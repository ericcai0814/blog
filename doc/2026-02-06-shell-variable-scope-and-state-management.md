---
title: 'Shell 變數作用域與狀態管理'
description: '在 Claude Code hook 腳本踩了變數讀不到的坑，才發現自己對 shell 變數作用域根本搞不清楚。這篇是我搞懂之後的整理筆記。'
keywords: ['Shell', 'Bash', 'Zsh', '變數作用域', '環境變數', 'export', 'Claude Code', 'hooks', 'fork', 'subshell']
date: 2026-02-06T16:00:00.000+00:00
lang: zh-tw
lastUpdated: 2026-02-06
duration: 20min
---

# Shell 變數作用域與狀態管理

## 前言

最近在寫 Claude Code 的 hook 腳本時踩了一個坑 — 我在 `~/.zshrc` 裡設了一個 `COMPACT_THRESHOLD=30` 的環境變數，結果腳本執行時死活讀不到，一直 fallback 到預設值。

一開始以為是自己打錯字，`echo` 確認了好幾次都正常。後來才發現問題根本不在 Claude Code ，而是我對 shell 變數作用域的理解太粗淺了。我只知道「`export` 可以讓 child process 讀到變數」，但對於什麼時候 `.zshrc` 會被載入、什麼時候不會、`fork` 出來的 child process 到底繼承了什麼，完全是一知半解。

花了一個晚上把這些東西搞清楚之後，覺得這些知識不只對 Claude Code hooks 有用，只要寫 shell 腳本、設定 cron job、或是在 CI/CD 環境排查「變數怎麼不見了」的問題，都會用到。

這篇就是我整理的筆記，從最基本的「process 怎麼跨執行保留狀態」一路到實際排查的除錯方法。

## 無狀態 process + 有狀態檔案 Pattern

### 問題：每次執行都是新的 process

像 hook 腳本這種東西，每次被觸發都會產生一個全新的 process ，有自己的 PID ，執行完記憶體全部歸零。下次再觸發又是一個新的 PID。

```
執行 #1          執行 #2          執行 #3
┌──────┐        ┌──────┐        ┌──────┐
│ PID  │        │ PID  │        │ PID  │
│ 4821 │ ────→  │ 5033 │ ────→  │ 5197 │
│ 記憶=0│        │記憶=0│        │ 記憶=0│
└──────┘        └──────┘        └──────┘
```

### 解法：讓檔案系統當「外部記憶體」

既然 process 本身沒辦法保留狀態，那就把狀態存到 process 之外的檔案系統。每次腳本啟動時做一個 **讀取 → 修改 → 寫回**（ read-modify-write ）的循環：

```
執行 #1          執行 #2          執行 #3
┌──────┐        ┌──────┐        ┌──────┐
│讀→ 0 │        │讀→ 1 │        │讀→ 2 │
│寫→ 1 │        │寫→ 2 │        │寫→ 3 │
└──┬───┘        └──┬───┘        └──┬───┘
   │                │                │
   ▼                ▼                ▼
┌──────────────────────────────────────┐
│  /tmp/counter-file                   │
│  內容: 1 → 2 → 3                    │
│  process 結束了，但檔案還在              │
└──────────────────────────────────────┘
```

實際的 shell 寫法：

```bash
#!/bin/bash
STATE_FILE="/tmp/my-counter"

# 讀取：檔案不存在就從 0 開始
count=$(cat "$STATE_FILE" 2>/dev/null || echo 0)

# 修改
count=$((count + 1))

# 寫回
echo "$count" > "$STATE_FILE"
```

### 為什麼不用其他方案？

| 方案         | 問題                                                              |
| ------------ | ----------------------------------------------------------------- |
| 環境變數     | 單向傳遞（父→子）， child process 改了也不會回傳給 parent process |
| 資料庫       | 殺雞焉用牛刀，只是記一個數字不需要 ACID                           |
| daemon       | 太重了， hook 腳本只需要「記住一個值」                            |
| **檔案系統** | **零依賴、天然持久化、`/tmp` 重開機自動清理**                     |

### Race Condition 的問題

不過這個做法有一個前提：不能有兩個 process 同時做 read-modify-write。不然就會像這樣：

```
process A: 讀取 → count=5
                process B: 讀取 → count=5
process A: 寫回 → count=6
                process B: 寫回 → count=6  ← 少算了，應該是 7
```

A 和 B 都讀到 5 ，各自加 1 寫回 6 ，但正確答案應該是 7。

在 Claude Code hooks 的場景下， hooks 是**同步序列執行**的，不會併發，所以不用擔心。但如果你的腳本有可能被同時觸發（例如多個 terminal 同時跑），就需要用 `flock` 來做檔案鎖：

```bash
#!/bin/bash
STATE_FILE="/tmp/my-counter"
LOCK_FILE="/tmp/my-counter.lock"

(
  # 取得排他鎖，等不到就一直等
  flock -x 200

  count=$(cat "$STATE_FILE" 2>/dev/null || echo 0)
  count=$((count + 1))
  echo "$count" > "$STATE_FILE"

) 200>"$LOCK_FILE"
```

`flock -x 200` 的意思是：對 file descriptor 200 取得排他鎖（ exclusive lock ）。`200>"$LOCK_FILE"` 則是把 fd 200 指向鎖檔。只要有其他 process 也在等同一把鎖，就會排隊等前一個放開。

這個寫法的 `( ... ) 200>` 語法看起來有點奇怪，但其實就是把整個 subshell 的 fd 200 重導向到鎖檔，然後在 subshell 裡面用 `flock` 鎖住它。

### 安全建立暫存檔：`mktemp`

順帶一提，如果你需要建立暫存檔，不要自己硬寫路徑，用 `mktemp` 比較安全：

```bash
# 建立暫存檔（檔名帶隨機字串，避免撞名）
STATE_FILE=$(mktemp /tmp/my-app.XXXXXX)

# 建立暫存目錄
STATE_DIR=$(mktemp -d /tmp/my-app.XXXXXX)
```

`XXXXXX` 會被替換成隨機字元，這樣就不怕跟其他腳本撞名了。

## Shell 變數 vs 環境變數

我一開始把 shell 變數和環境變數搞混了，後來才發現**這兩個是不同的東西**，搞清楚之後很多問題就解開了。

### Shell 變數：只有 shell 自己看得到

```bash
greeting="hello"
echo $greeting   # hello — 沒問題，shell 自己當然讀得到
```

但如果你啟動一個 child process ：

```bash
greeting="hello"
bash -c 'echo $greeting'   # （空的）— child process看不到
```

什麼都沒印出來。因為 `greeting` 只是 shell 內部的變數，儲存在 shell 自己的資料結構裡，不會隨著 `fork()` 傳給 child process。

### 環境變數：`export` 之後才進入 environ

```bash
export greeting="hello"
bash -c 'echo $greeting'   # hello — child process讀得到了
```

`export` 做了什麼事？它把變數從 shell 的內部資料結構**推進 process 的 environ 表**。而 `fork()` 建立 child process 時，會把 parent process 的 environ 整份複製過去，所以 child process 就讀得到了。

你可以用 `env` 或 `printenv` 來確認一個變數有沒有在 environ 裡：

```bash
MY_VAR="only shell"
env | grep MY_VAR          # （沒東西）

export MY_VAR
env | grep MY_VAR          # MY_VAR=only shell — 出現了
```

### 幾種等價的寫法

```bash
# 這三種效果一樣
export FOO="bar"

FOO="bar"
export FOO

declare -x FOO="bar"      # -x 就是 export 的意思
```

### 單次傳遞（不污染當前 shell ）

有時候你只想讓某個指令看到某個變數，不想動到當前 shell 的環境：

```bash
# MY_DB 只會存在於 python3 這個child process的 environ 中
MY_DB="production" python3 app.py

echo $MY_DB   # （空的）— 當前 shell 完全不受影響
```

這個語法在寫 one-liner 的時候超好用。

## Shell 變數的四層作用域

從最窄到最廣，shell 變數可以分成四層：

```
┌─────────────────────────────────────────────────┐
│ Layer 4: 系統級 (/etc/environment, /etc/profile)  │
│ ┌─────────────────────────────────────────────┐ │
│ │ Layer 3: 使用者級 (~/.zshrc, ~/.zprofile)     │ │
│ │ ┌─────────────────────────────────────────┐ │ │
│ │ │ Layer 2: Shell session 級 (export)      │ │ │
│ │ │ ┌─────────────────────────────────────┐ │ │ │
│ │ │ │ Layer 1: 腳本/child process級        │ │ │ │
│ │ │ └─────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Layer 1 ：腳本內部變數（最窄）

```bash
#!/bin/bash
STATE_FILE="/tmp/my-state"   # 只在這個腳本的process中存在
count=1                       # 腳本結束，變數跟著消失
```

腳本執行完畢， process 結束，這些變數就不存在了。下次執行又是一個全新的世界。

在 function 裡面還可以用 `local` 把範圍縮得更小：

```bash
#!/bin/bash
my_func() {
  local temp="只在 function 裡活著"
  echo "$temp"
}

my_func
echo "$temp"   # （空的）— function 外面讀不到
```

`local` 確保變數不會洩漏到 function 外面。寫比較長的腳本時，養成用 `local` 的習慣可以避免很多意外的變數覆蓋問題。

### Layer 2 ： Shell Session 級

```bash
export MY_VAR="hello"

./script.sh                                         # 腳本可讀
bash -c 'echo $MY_VAR'                              # child process 可讀
python3 -c "import os; print(os.environ['MY_VAR'])" # 任何語言的 child process 都可讀

# 關掉終端機 → 消失
```

`export` 讓變數往下傳遞給所有 child process ，但它只在這個 terminal session 裡活著。關掉視窗就沒了。

### Layer 3 ：使用者級

```bash
# ~/.zshrc
export COMPACT_THRESHOLD=30
export EDITOR="vim"
export PATH="$HOME/.local/bin:$PATH"
```

每次開啟新的 interactive shell ，`~/.zshrc` 會被 source ，裡面的變數對該 session 及所有 child process 可見。

Layer 3 和 Layer 2 的差別在於**持久性**： Layer 2 關視窗就沒了， Layer 3 寫在檔案裡，下次開 terminal 還在。

### Layer 4 ：系統級（最廣）

```bash
# /etc/environment（所有使用者）
PATH="/usr/local/bin:/usr/bin:/bin"

# /etc/profile（所有 login shell）
export LANG="en_US.UTF-8"
```

這是系統管理員設定的，影響所有使用者。一般日常開發不太會去動這一層。

## `source` vs `./`

搞懂 `source` 和 `./` 的差別之後，前面講的作用域問題基本上就全通了。

### `./script.sh`：在 child process 中執行

```bash
# script.sh
MY_VAR="from script"
```

```bash
./script.sh
echo $MY_VAR   # （空的）
```

用 `./` 執行腳本時， shell 會 `fork` 出一個 child process ，在 child process 裡跑腳本。腳本裡設的變數只存在於那個 child process ，跑完就沒了。就像你在另一個房間做的事，回到原來的房間什麼都不會變。

### `source script.sh`：在當前 shell 中執行

```bash
source script.sh    # 或者用簡寫 . script.sh
echo $MY_VAR        # from script — 讀到了！
```

`source` 不會建立 child process ，它直接在**當前 shell** 裡執行腳本的每一行。所以腳本裡設的變數、改的目錄，全部都會影響當前 shell。

### 為什麼 `.zshrc` 是被 source 的？

你有沒有想過，為什麼在 `~/.zshrc` 裡 `export` 的變數，當前 terminal 就讀得到？

因為 zsh 在啟動 interactive shell 時，會自動 `source ~/.zshrc`。等同於在當前 shell 裡逐行執行 `.zshrc` 的內容。如果 `.zshrc` 是被 `./` 執行的，那裡面的 `export` 全部都白寫了（只會在 child process 裡生效，然後 child process 就結束了）。

這也是為什麼改了 `.zshrc` 之後要 `source ~/.zshrc` 才會生效 — 不 source 的話，當前 shell 不會重新讀取。

### 實驗看看

```bash
# 建立測試腳本
echo 'MAGIC="abracadabra"' > /tmp/test-scope.sh
chmod +x /tmp/test-scope.sh

# 用 ./ 執行 — 當前 shell 看不到
/tmp/test-scope.sh
echo $MAGIC      # （空的）

# 用 source 執行 — 當前 shell 看得到
source /tmp/test-scope.sh
echo $MAGIC      # abracadabra
```

## Subshell 的坑

除了 `./` 會建立 child process 之外，還有幾個地方也會偷偷建立 subshell ，變數改了等於白改。

### 管線（ pipe ）裡的 subshell

這是最容易中招的：

```bash
count=0
echo -e "a\nb\nc" | while read line; do
  count=$((count + 1))
done
echo $count   # 0 — 什麼！不是應該是 3 嗎？
```

因為 `|` 管線右邊的 `while` 是在 subshell 裡跑的。subshell 裡的 `count` 和外面的 `count` 是兩回事。

**解法：用 process substitution 或 here string**

```bash
# 方法一：process substitution（bash 4+, zsh）
count=0
while read line; do
  count=$((count + 1))
done < <(echo -e "a\nb\nc")
echo $count   # 3 — 正確了

# 方法二：用 zsh 的 lastpipe（僅 zsh）
# zsh 預設就不會把最後一個管線元件放進 subshell
```

### 小括號 `()` vs 大括號 `{}`

```bash
# () — 在 subshell 裡執行
x=1
(x=99)
echo $x   # 1 — 不受影響

# {} — 在當前 shell 裡執行（注意結尾要加分號）
x=1
{ x=99; }
echo $x   # 99 — 被改了
```

`()` 裡面做的任何事都不會影響外面。如果你故意要隔離副作用（例如暫時 `cd` 到別的目錄），用 `()` 就很方便。

## macOS zsh 設定檔載入順序

```
Login Shell                    Non-login Shell
─────────────────              ────────────────────
/etc/zshenv            ←       /etc/zshenv
~/.zshenv              ←       ~/.zshenv
/etc/zprofile
~/.zprofile
/etc/zshrc             ←       /etc/zshrc
~/.zshrc               ←       ~/.zshrc
/etc/zlogin
~/.zlogin

← 箭頭表示 Non-login Shell 也會載入該檔案
```

### 各檔案的職責

| 檔案          | 何時載入             | 適合放什麼                         |
| ------------- | -------------------- | ---------------------------------- |
| `~/.zshenv`   | **每次**（包含腳本） | `PATH` 等所有環境都需要的變數      |
| `~/.zprofile` | 只有 login shell     | 一次性初始化（如 `brew shellenv`） |
| `~/.zshrc`    | interactive shell    | 別名、prompt、補全、主題           |
| `~/.zlogin`   | login shell 最後     | 登入歡迎訊息                       |

值得注意的是，`~/.zshenv` 是**唯一保證**在所有 zsh process 中都會被載入的檔案，不管是 interactive、non-interactive、login 還是 non-login。大部分教學都叫你把東西放 `~/.zshrc`，但如果你的變數需要在 non-interactive 環境（cron、IDE 啟動的 child process 等）也生效，就只有 `~/.zshenv` 才靠得住。

### 怎麼確認某個檔案有沒有被載入？

在 `.zshenv` 或 `.zshrc` 最上面加一行 debug 訊息：

```bash
# ~/.zshenv 最上面加
echo "[DEBUG] .zshenv loaded" >&2

# ~/.zshrc 最上面加
echo "[DEBUG] .zshrc loaded" >&2
```

然後分別用不同方式啟動 shell 看看哪些訊息出現：

```bash
# interactive — 應該兩個都出現
zsh

# non-interactive 腳本 — 只有 .zshenv
zsh -c 'echo test'

# login shell — 全部都出現
zsh -l
```

測試完記得把 debug 訊息拿掉。

## `.zshrc` 讀不到的場景

| 場景                         | 能讀到？ | 原因                                                 |
| ---------------------------- | -------- | ---------------------------------------------------- |
| 終端機直接執行               | O        | interactive shell 會 source `.zshrc`                 |
| 從終端機啟動的 child process | O        | 繼承 parent process 的 environ （前提是有 `export`） |
| cron job                     | X        | 非 interactive ，不載入 `.zshrc`                     |
| launchd daemon               | X        | 非 interactive ，不載入 `.zshrc`                     |
| SSH 非互動命令               | X        | 非 interactive shell                                 |
| IDE 啟動的終端機             | △        | 取決於 IDE 怎麼啟動 shell                            |
| Claude Code hooks            | △        | 取決於 Claude Code 的啟動方式                        |

規則就一條：**`.zshrc` 只有在 interactive shell 才會被載入**。

而「從終端機啟動的 child process」之所以讀得到，不是因為 child process 也載入了 `.zshrc`，而是因為 parent process （你的 terminal shell ）已經把變數 `export` 進 environ 了， child process 繼承到的是 environ 裡的值。

## Claude Code Hooks 的變數傳遞鏈

回到一開始的問題。Claude Code 的 hook 腳本到底怎麼拿到環境變數的？整條傳遞鏈長這樣：

```
~/.zshenv 或 ~/.zshrc
    │
    │  export COMPACT_THRESHOLD=30
    ▼
Terminal Session (zsh)
    │
    │  環境繼承（fork 時複製 environ）
    ▼
Claude Code main process (Node.js)
    │
    │  fork + exec
    ▼
/bin/bash -c "strategic-compact.sh"
    │
    │  ${COMPACT_THRESHOLD:-50}
    │  → 在 environ 裡找到 30 → 用 30
    ▼
THRESHOLD=30
```

每個箭頭都是一次 `fork()`， child process 複製 parent process 的 environ。只要中間任何一環沒有把變數放進 environ ，鏈就斷了。

### 變數中斷的常見原因

```bash
# 沒有 export — 只是 shell 局部變數，fork 帶不走
COMPACT_THRESHOLD=30

# 有 export — child process 可見
export COMPACT_THRESHOLD=30
```

還有一個更隱晦的斷點：如果你是**從 IDE 的按鈕啟動** Claude Code ，而不是從 terminal 啟動，那 IDE 的 process 可能根本沒有繼承你 terminal 的 environ。這時候就算 `.zshrc` 裡有 `export`， IDE 啟動的 Claude Code 也讀不到。

解法是把變數放 `~/.zshenv`，或是從 IDE 的 terminal （而不是按鈕）啟動 Claude Code。

## 配置變數該放哪？

大部分教學都叫你把環境變數放在 `~/.zshrc`：

```bash
# ~/.zshrc
export COMPACT_THRESHOLD=30
```

從終端機啟動的話，這樣做完全沒問題。但前面提過，`.zshrc` 只有 interactive shell 才會載入。如果你是從 IDE 按鈕啟動、跑 cron job、或用 SSH 非互動命令，這個變數就讀不到了。

更穩的做法是放 `~/.zshenv`：

```bash
# ~/.zshenv
export COMPACT_THRESHOLD=30
```

`~/.zshenv` 在任何 zsh process 中都會被載入，不管 interactive 還是 non-interactive。唯一要注意的是別放太多東西，因為每個 zsh child process 啟動時都會跑一遍。

不過不管變數放在哪裡，腳本裡面最好都加一個預設值：

```bash
THRESHOLD=${COMPACT_THRESHOLD:-50}
```

有環境變數就用，沒有就 fallback 到 50。`${VAR:-default}` 是 shell 裡最防禦性的寫法，我現在幾乎所有從外部讀設定的地方都會加上，避免在不同環境下出現意料之外的行為。

我自己的做法是 `~/.zshenv` + 腳本預設值併用。設定寫在 `~/.zshenv` 裡，腳本也有 fallback，不管在什麼環境下執行都不會因為少了環境變數就炸掉。

## 除錯小技巧

### 確認變數有沒有在 environ 裡

```bash
# 列出所有環境變數，過濾關鍵字
env | grep COMPACT

# 或用 printenv 查特定變數
printenv COMPACT_THRESHOLD
```

如果 `env | grep` 找不到，那就是沒有 `export`。

### 確認 shell 類型

```bash
# 確認當前 shell 是不是 interactive
[[ -o interactive ]] && echo "interactive" || echo "non-interactive"

# 確認是不是 login shell
[[ -o login ]] && echo "login" || echo "non-login"
```

### 追蹤設定檔載入順序

```bash
# 用 zsh -x 開啟 trace 模式，會印出每一行被執行的指令
zsh -x -i -c 'exit' 2>&1 | head -50
```

`-x` 開啟 trace ，`-i` 強制 interactive 模式，`-c 'exit'` 讓它立刻退出。輸出會顯示 `.zshenv`、`.zshrc` 等檔案裡的每一行指令。

### 在腳本裡印出繼承到的環境

```bash
#!/bin/bash
# 在腳本最上面加這幾行，方便 debug
echo "=== 環境 debug ===" >&2
echo "PID: $$" >&2
echo "SHELL: $SHELL" >&2
echo "COMPACT_THRESHOLD: ${COMPACT_THRESHOLD:-（未設定）}" >&2
echo "==================" >&2
```

輸出到 `>&2`（ stderr ）而不是 stdout ，避免干擾腳本的正常輸出。

## 最後

回頭看，shell 變數的規則其實就一條線：`export` 決定變數能不能過 `fork` 這道門，`source` 決定腳本跑在哪個 shell 裡。搞懂這兩件事，大部分「為什麼我設了變數但讀不到」的問題就能自己解了。剩下的 subshell 陷阱和 race condition，踩過一次就會記住——先踩坑、再查原理，反而比硬背規則有效。

## 參考資料

- [Zsh Documentation - Startup/Shutdown Files](https://zsh.sourceforge.io/Doc/Release/Files.html)
- [Bash Reference Manual - Shell Variables](https://www.gnu.org/software/bash/manual/html_node/Shell-Variables.html)
- [The Linux Programming Interface - Process Creation](https://man7.org/linux/man-pages/man2/fork.2.html)
- [flock(1) - Linux manual page](https://man7.org/linux/man-pages/man1/flock.1.html)
- [Claude Code Documentation - Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks)
