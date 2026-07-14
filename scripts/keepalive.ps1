# keepalive.ps1 - Roda a cada 6 horas para manter o Supabase ativo
# Agendar no Windows Task Scheduler:
#   schtasks /create /tn "SupabaseKeepAlive" /tr "powershell -ExecutionPolicy Bypass -File C:\src\Projetos\vendas26\venda-inteligente-ai\scripts\keepalive.ps1" /sc hourly /mo 6 /f

$SUPABASE_URL = "https://cdznlgccxmtowqnwcglh.supabase.co"
$SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkem5sZ2NjeG10b3dxbndjZ2xoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzM2MTg2MywiZXhwIjoyMDk4OTM3ODYzfQ.vvE0fKsztEUwCn0qXL_MAXYAVp4L0PQDcYTGjdlljIQ"

$headers = @{
    "apikey" = $SERVICE_ROLE_KEY
    "Authorization" = "Bearer $SERVICE_ROLE_KEY"
}

$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

try {
    # Tenta fazer SELECT 1 via POST na funcao auth
    $body = @{ query = "SELECT 1" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$SUPABASE_URL/pg/query" -Method POST -Headers $headers -Body $body -ContentType "application/json" -TimeoutSec 15 -UseBasicParsing
    $log = "$timestamp - Supabase OK (pg/query status $($response.StatusCode))"
    Add-Content -Path "$PSScriptRoot\keepalive.log" -Value $log
    Write-Output $log
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 404 -or $statusCode -eq 401) {
        # pg/query nao existe, tenta outro endpoint
        try {
            $response2 = Invoke-WebRequest -Uri "$SUPABASE_URL/auth/v1/health" -Method GET -Headers $headers -TimeoutSec 15 -UseBasicParsing
            $log = "$timestamp - Supabase OK (auth/health status $($response2.StatusCode))"
            Add-Content -Path "$PSScriptRoot\keepalive.log" -Value $log
            Write-Output $log
        } catch {
            $statusCode2 = $_.Exception.Response.StatusCode.value__
            try {
                $body2 = @{ grant_type = "password"; email = "ping@test.com"; password = "ping" } | ConvertTo-Json
                $response3 = Invoke-WebRequest -Uri "$SUPABASE_URL/auth/v1/token?grant_type=password" -Method POST -Headers $headers -Body $body2 -ContentType "application/json" -TimeoutSec 15 -UseBasicParsing
                $log = "$timestamp - Supabase OK (auth/v1/token responded)"
                Add-Content -Path "$PSScriptRoot\keepalive.log" -Value $log
                Write-Output $log
            } catch {
                $statusCode3 = $_.Exception.Response.StatusCode.value__
                if ($statusCode3 -eq 400) {
                    # 400 = invalid creds, but server is alive!
                    $log = "$timestamp - Supabase OK (server responded with 400 - invalid creds but alive)"
                    Add-Content -Path "$PSScriptRoot\keepalive.log" -Value $log
                    Write-Output $log
                } else {
                    $log = "$timestamp - ERRO: server returned $statusCode3"
                    Add-Content -Path "$PSScriptRoot\keepalive.log" -Value $log
                    Write-Output $log
                }
            }
        }
    } else {
        $log = "$timestamp - ERRO: $($_.Exception.Message)"
        Add-Content -Path "$PSScriptRoot\keepalive.log" -Value $log
        Write-Output $log
    }
}
