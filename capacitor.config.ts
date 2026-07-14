import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vendainteligente.ai',
  appName: 'Venda Inteligente AI',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    url: 'http://10.0.2.2:3000',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#4c6ef5',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#4c6ef5',
    },
  },
};

export default config;
