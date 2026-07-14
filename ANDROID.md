# Como Gerar o APK (Android)

## Pre-requisitos

1. **Android Studio** - Baixe em https://developer.android.com/studio
2. **Java JDK 11+** - Ja instalado (versao 1.8 detectada, funciona)

## Passo a Passo

### Opcao 1: Usando Android Studio (Recomendado)

```bash
# 1. Buildar o app web
npm run build

# 2. Sincronizar com Capacitor
npx cap sync android

# 3. Abrir no Android Studio
npx cap open android
```

No Android Studio:
1. Aguarde o Gradle sincronizar
2. Clique em **Build > Build Bundle(s) / APK(s) > Build APK(s)**
3. Aguarde o build finalizar
4. O APK estara em: `android/app/build/outputs/apk/debug/app-debug.apk`

### Opcao 2: Usando Terminal

```bash
# 1. Buildar o app web
npm run build

# 2. Sincronizar com Capacitor
npx cap sync android

# 3. Entrar na pasta android
cd android

# 4. Buildar o APK
.\gradlew assembleDebug

# 5. APK gerado em:
# android\app\build\outputs\apk\debug\app-debug.apk
```

### Opcao 3: Script Automatico

```powershell
.\scripts\build-apk.ps1
```

## Configuracoes do APK

- **Nome do app:** Venda Inteligente AI
- **Package ID:** com.vendainteligente.ai
- **Icone:** `android-resources/icons/icon.svg`
- **Splash Screen:** `android-resources/splash/splash.svg`

## Para Publicar na Play Store

1. Gere uma **keystore** para assinar o APK:
```bash
keytool -genkey -v -keystore vendainteligente.keystore -alias vendainteligente -keyalg RSA -keysize 2048 -validity 10000
```

2. Build o **Release**:
```bash
cd android
.\gradlew assembleRelease
```

3. Assine o APK com sua keystore

4. Faca upload no Google Play Console

## Notas

- O app conecta com o Supabase em: `https://rchzcarcllbzmiqbocme.supabase.co`
- Para testes locais, o app aponta para `http://10.0.2.2:3000` (emulador Android)
- Para producao, mude a URL do Supabase no `.env.local` e build novamente
