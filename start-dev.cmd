@echo off
title my-blog dev server
cd /d "%~dp0"

rem Open the browser once the dev server answers (runs hidden in the background)
start "" /min powershell -NoProfile -WindowStyle Hidden -Command "do { Start-Sleep 1; try { $null = Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 60; $ok = $true } catch { $ok = $false } } until ($ok); Start-Process http://localhost:3000"

npm run dev

rem Keep the window open if the server stops or crashes, so you can read the error
pause
