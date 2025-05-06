import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, StyleSheet } from "react-native";
import { CheckBox } from 'react-native-elements';
import { Button } from '@ui-kitten/components';
import { useGame } from '../contexts/GameContext';
import { NavigationProp } from '@react-navigation/native';
import { styles } from '../styles/styles';
import CurrentRound from '../models/CurrentRound';

interface NewGameProps {
  route: any;
  navigation: NavigationProp<any>;
}

/**
 * NewGame component allows users to select and customize bad chips for a new game or edit an existing game's bad chips.
 * @param route - The route prop for navigation.
 * @param navigation - The navigation prop for navigating between screens.
 */
const NewGame: React.FC<NewGameProps> = ({ route, navigation }) => {
  const { getGame, setRemainingRounds, nextRound } = useGame();
  const [roundsUp, setRoundsUp] = useState<Record<number, boolean>>({}); // dictionary containing rounds, and a boolean if they will be played or not
  const [roundsDown, setRoundsDown] = useState<Record<number, boolean>>({}); // dictionary containing rounds, and a boolean if they will be played or not
  const [downAndUp, setDownAndUp] = useState<boolean>(false);
  
  useEffect(() => {
    const game = getGame();
    if (!game || !game.setting_startNumCards) {
      return;
    }
    setDownAndUp(game.setting_downAndUp);
    const tempDictDown: Record<number, boolean> = {};
    // set the values for the way down
    for (let i = game.setting_startNumCards; i > 0; i--) {
      tempDictDown[i] = true;
    }
    setRoundsDown(tempDictDown);

    // if playing downAndUp, set the values for the way up
    if (game.setting_downAndUp) {
      const tempDictUp: Record<number, boolean> = {};
      for (let i = 1; i <= game.setting_startNumCards; i++) {
        tempDictUp[i] = true;
      }
      setRoundsUp(tempDictUp);
    }
  }, []);

  /**
   * Handles the change of checkbox state.
   * @param key - The key of the round.
   * @param goingDown - Boolean indicating if the round is going down.
   */
  const handleChange = (key: number, goingDown: boolean) => {
    if (goingDown) {
      setRoundsDown({
        ...roundsDown,
        [key]: !roundsDown[key],
      });
    } else {
      setRoundsUp({
        ...roundsUp,
        [key]: !roundsUp[key],
      });
    }
  };

  /**
   * Handles the submission of selected rounds.
   */
  const handleSubmit = () => {
    const selectedRounds: CurrentRound[] = [];
    Object.keys(roundsDown).reverse().map((key) => {
      if(roundsDown[Number(key)]) {
        selectedRounds.push(new CurrentRound(Number(key), true));
      }
    })
    if(downAndUp) {
      Object.keys(roundsUp).map((key) => {
        if(roundsUp[Number(key)]) {
          selectedRounds.push(new CurrentRound(Number(key), false));
        }
      })
    }

    // Validate input to ensure at least one round is selected
    if(selectedRounds.length == 0) {
      Alert.alert('At least 1 round must be selected.');
      return;
    }
    // Update the game context with the selected rounds
    setRemainingRounds(selectedRounds);
    // Start the game
    nextRound();
    navigation.navigate('ActiveGame');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rounds in Use:</Text>
      <ScrollView>
        <Text style={componentStyles.text}>Going Down</Text>
        {Object.keys(roundsDown)
          .reverse()
          .map((key) => (
            <View key={key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <CheckBox
                key={Number(key)}
                checked={roundsDown[Number(key)]}
                onPress={() => handleChange(Number(key), true)}
              >
              </CheckBox>
              <Text style={ styles.checkboxText }>Round {key}</Text>
            </View>
            
          ))}
        {downAndUp && 
          <View>
            <Text style={componentStyles.text}>Going Up</Text>
            {Object.keys(roundsUp)
              .map((key) => (
                <View key={key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <CheckBox
                    key={Number(key)}
                    checked={roundsUp[Number(key)]}
                    onPress={() => handleChange(Number(key), false)}
                  >
                  </CheckBox>
                  <Text style={ styles.checkboxText }>Round {key}</Text>
                </View>
              ))}
          </View>
        }
      </ScrollView>
      <Button style={styles.button} onPress={handleSubmit}>
        Submit Rounds in Use
      </Button>
    </View>
  );
};

export default NewGame;

const componentStyles = StyleSheet.create({
  text: {
    fontSize: 18,
  }
});