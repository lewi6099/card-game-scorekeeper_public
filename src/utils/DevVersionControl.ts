import AsyncStorage from '@react-native-async-storage/async-storage';

const VERSION_KEY = 'app_version';

/**
 * WHEN VERSION CHANGES TO >= 1.0.2
 *
 * Due to changes in game object storage, this function checks the current app 
 * version against a stored version in AsyncStorage. If the versions do not 
 * match, it clears game_date and updates the stored version to the current app version.
 *
 * @returns {Promise<void>} A promise that resolves when the storage check and potential clear operation are complete.
 * @throws Will log an error message if there is an issue accessing or modifying AsyncStorage.
 */
export const clearStorageOnVersionChange = async () => {
  const CURRENT_APP_VERSION = '1.0.2';
  const STORAGE_KEY_TO_CLEAR = 'game_data';
  try {
    const storedVersion = await AsyncStorage.getItem(VERSION_KEY);
    let major = 0, minor = 0, patch = 0;
    if (storedVersion) {
      [major, minor, patch] = storedVersion.split('.').map(Number);
    }
  
    if (!storedVersion || isVersionLessThan(major, minor, patch, 1, 0, 2)) {
      // Clear the specific AsyncStorage key
      await AsyncStorage.removeItem(STORAGE_KEY_TO_CLEAR);

      // Update the stored version to the current version
      await AsyncStorage.setItem(VERSION_KEY, CURRENT_APP_VERSION);

      console.log(`Storage key "${STORAGE_KEY_TO_CLEAR}" cleared due to version change.`);
    }
  } catch (error) {
    console.error('Error checking and clearing storage on version change:', error);
  }
};

function isVersionLessThan(major1: number, minor1: number, patch1: number, major2: number, minor2: number, patch2: number) {
  if (major1 < major2) {
    return true;
  }
  if (major1 > major2) {
    return false;
  }
  // major1 === major2
  if (minor1 < minor2) {
    return true;
  }
  if (minor1 > minor2) {
    return false;
  }
  // minor1 === minor2
  if (patch1 < patch2) {
    return true;
  }
  if (patch1 > patch2) {
    return false;
  }
  // patch1 === patch2
  return false;
}