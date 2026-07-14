# ============================================
# Script de Build - Venda Inteligente AI
# ============================================
# Execute este script para gerar o APK

Write-Host "=== Venda Inteligente AI - Build APK ===" -ForegroundColor Cyan

# 1. Build do Next.js
Write-Host "`n[1/4] Buildando Next.js..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no build do Next.js!" -ForegroundColor Red
    exit 1
}

# 2. Sincronizar com Capacitor
Write-Host "`n[2/4] Sincronizando com Capacitor..." -ForegroundColor Yellow
npx cap sync android

# 3. Copiar icones
Write-Host "`n[3/4] Copiando recursos..." -ForegroundColor Yellow
# Os icones e splash ja estao configurados

# 4. Build do APK
Write-Host "`n[4/4] Gerando APK..." -ForegroundColor Yellow
Write-Host "Para gerar o APK, abra o projeto Android no Android Studio:" -ForegroundColor Gray
Write-Host "  cd android" -ForegroundColor Gray
Write-Host "  .\gradlew assembleDebug" -ForegroundColor Gray
Write-Host ""
Write-Host "Ou abra a pasta 'android' no Android Studio e clique em Build > Build Bundle(s) / APK(s)" -ForegroundColor Gray

Write-Host "`n=== Build concluido! ===" -ForegroundColor Green
Write-Host "O APK estara em: android/app/build/outputs/apk/debug/app-debug.apk" -ForegroundColor Cyan
