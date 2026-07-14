@echo off
echo Criando tarefa agendada para manter Supabase ativo...
echo Roda a cada 6 horas automaticamente.
echo.
schtasks /create /tn "SupabaseKeepAlive" /tr "powershell -ExecutionPolicy Bypass -File \"%~dp0keepalive.ps1\"" /sc hourly /mo 6 /st 00:00 /f
echo.
echo Tarefa criada! Testando agora...
powershell -ExecutionPolicy Bypass -File "%~dp0keepalive.ps1"
echo.
pause
