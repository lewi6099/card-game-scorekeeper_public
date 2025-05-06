import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for onboarding status data
const ONBOARDING_KEY = 'onboarding_complete';

/**
 * Get the onboarding status from AsyncStorage
 * @returns A boolean indicating whether onboarding is complete
 */
export const getOnboardingStatus = async (): Promise<boolean> => {
  try {
    const onboardingComplete = await AsyncStorage.getItem(ONBOARDING_KEY);
    if (onboardingComplete === null) {
      return false;
    }
    else {
      return true;
    }
  } catch (error) {
    console.error('Error retrieving onboarding status:', error);
    return true;
  }
};

/**
 * Set the onboarding staus in AsyncStorage
 * @param status A boolean indicating whether onboarding is complete
 */
export const setOnboardingStatus = async (status: boolean): Promise<void> => {
  try {
    if (status) {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    }
    else {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    }
  } catch (error) {
    console.error('Error setting onboarding status:', error);
  }
};

