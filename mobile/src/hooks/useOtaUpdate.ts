import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export function useOtaUpdate() {
  useEffect(() => {
    if (__DEV__) return;

    async function check() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'Update Available',
            'A new version of Zengo has been downloaded. Restart to apply.',
            [
              { text: 'Later' },
              { text: 'Restart', onPress: () => Updates.reloadAsync() },
            ]
          );
        }
      } catch (e) {
        console.warn('OTA check failed:', e);
      }
    }

    check();
  }, []);
}
