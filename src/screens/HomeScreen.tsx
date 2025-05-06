import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Button } from '@ui-kitten/components';
import { NavigationProp } from '@react-navigation/native';
import { styles } from '../styles/styles';
import { StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/splash-icon-light.png')} style={componentStyles.image}/>
      <Button style={styles.button} onPress={() => navigation.navigate('NewGamePart0')}>
        Start New Game
      </Button>
      <Button style={styles.secondaryButton} onPress={() => navigation.navigate('LoadGameScreen')}>
        View Previous Game
      </Button>
    </View>
  );
};

export default HomeScreen;

const componentStyles = StyleSheet.create({
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 20,
  },
});