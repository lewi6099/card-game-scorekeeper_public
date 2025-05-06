import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@ui-kitten/components';
import { NavigationProp } from '@react-navigation/native';
import { theme } from '../styles/theme';
import { setOnboardingStatus } from '../utils/OtherStorage';
import { styles } from '../styles/styles';

const { width } = Dimensions.get('window');

interface OnboardingProps {
  route: any;
  navigation: NavigationProp<any>;
}

const Onboarding: React.FC<OnboardingProps> = ({ route, navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleMomentumScrollEnd = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.floor(scrollPosition / width);
    setActiveIndex(index);
  };

  const scrollToScreen = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: width * index, animated: true });
      setActiveIndex(index);
    }
  };

  const handleCompleteOnboarding = async () => {
    // Set the onboarding status in AsyncStorage
    await setOnboardingStatus(true);
    navigation.navigate('Home');
  };

  const screens = [
    { key: '1', text: 'Welcome to the card game scorekeeper!', src: null },
    { key: '2', text: 'Record details about your game.', src: require('../../assets/onboarding/slide1.png') },
    { key: '3', text: 'Enter other game settings before getting started.', src: require('../../assets/onboarding/slide2.png') },
    { key: '4', text: 'View a summary of the current game.', src: require('../../assets/onboarding/slide3.png') },
    { key: '5', text: 'View the scores table to see detailed scoring.', src: require('../../assets/onboarding/slide4.png') },
  ];

  return (
    <SafeAreaView style={componentStyles.container}>
      {activeIndex < screens.length - 1 && (
        <TouchableOpacity style={componentStyles.skipButton} onPress={handleCompleteOnboarding}>
          <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>Skip</Text>
        </TouchableOpacity>
      )}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      >
        {screens.map((screen) => (
          <View key={screen.key} style={componentStyles.screen}>
            <Text style={componentStyles.text}>{screen.text}</Text>
            {screen.src && (
              <Image 
                source={screen.src} 
                style={componentStyles.image} 
              />
            )}
            {screen.key === '5' && (
              <View style={{ marginTop: 20, width: '80%' }}>
                <Button style={styles.button} onPress={handleCompleteOnboarding}>
                  Get Started
                </Button>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      {Platform.OS !== 'android' && 
        <View style={componentStyles.dotsContainer}>
          {screens.map((_, index) => (
            <View
              key={index}
              style={[
                componentStyles.dot,
                { opacity: index === activeIndex ? 1 : 0.3 },
              ]}
            />
          ))}
        </View>
      }
      {activeIndex < screens.length - 1 && (
        <TouchableOpacity style={componentStyles.nextButton} onPress={() => {scrollToScreen(activeIndex + 1)}}>
          <Text style={{ fontSize: 18 }}>Next</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const componentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screen: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 26,
    color: theme.colors.gray4,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginHorizontal: 5,
  },
  skipButton: {
    position: 'absolute',
    top: 70,
    right: 25,
    backgroundColor: theme.colors.navy1,
    borderRadius: 8,
    padding: 15,
    zIndex: 1,
  },
  nextButton: {
    position: 'absolute',
    bottom: 15,
    right: 5,
    padding: 35,
  },
  image: {
    width: width * 0.8, 
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: theme.colors.navy2,
    backgroundColor: theme.colors.gray1,
    marginVertical: 30,
  },
});

export default Onboarding;