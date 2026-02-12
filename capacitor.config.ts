import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hijibiji.housekeeping',
  appName: 'hijibiji_housekeeping',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
