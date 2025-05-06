import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from "react-native";
import { Button, Radio, RadioGroup } from '@ui-kitten/components';
import { useGame } from '../contexts/GameContext';
import { NavigationProp } from '@react-navigation/native';
import { styles, buttonRowStyles } from '../styles/styles';
import Game from '../models/Game';
import Player from '../models/Player';
import PlayerDropdown from '../components/PlayerDropdown';

interface NewGameProps {
  route: any;
  navigation: NavigationProp<any>;
}

/**
 * NewGame component allows users to select and customize good chips for a new game or edit an existing game's good chips.
 * @param route - The route prop for navigation.
 * @param navigation - The navigation prop for navigating between screens.
 */
const NewGame: React.FC<NewGameProps> = ({ route, navigation }) => {
  const { setSettings, getGame, setDealer } = useGame();
  const [game, setGame] = useState<Game | null>(null);
  const [numPlayers, setNumPlayers] = useState<number | null>(null);
  const [numCards, setNumCards] = useState<number | null>(null);
  const [maxCards, setMaxCards] = useState<number | null>(null);
  const [downAndUp, setDownAndUp] = useState<boolean>(false);
  const [startDealer, setStartDealer] = useState<Player | null>(null);
  const editMode = route.params?.editor;

  useEffect(() => {
    const game = getGame();
    if (game) {
      setGame(game);
      setNumPlayers(game.numPlayers);
      setMaxCards(Math.floor(52 / game.numPlayers));
      setNumCards(Math.floor(52 / game.numPlayers));
    }
  }, []);

  const increaseNumCards = () => {
    if (!numCards || !maxCards) {
      return;
    }
    if (numCards + 1 > maxCards) {
      Alert.alert('You have reached the maximum amount of cards for ' + numPlayers + ' players.');
      return;
    }
    setNumCards(numCards + 1);
  };

  const decreaseNumCards = () => {
    if (!numCards || !maxCards || !numPlayers) {
      return;
    }
    if (numCards - 1 < 1) {
      Alert.alert('Every player needs at least 1 card.');
      return;
    }
    setNumCards(numCards - 1);
  };

  const verifyInput = async (): Promise<boolean> => {
    if (!numCards || !numPlayers) {
      return false;
    }
    if (startDealer == null) {
      Alert.alert('Please select a dealer.');
      return false;
    }
    if (numCards * numPlayers == 52) {
      return new Promise((resolve) => {
        Alert.alert(
          'Using all 52 cards',
          numCards + ' cards dealt to ' + numPlayers + ' players uses all 52 cards. There will be no extra card for trump. Do you want to continue?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Continue', onPress: () => resolve(true) },
          ]
        );
      });
    } else {
      return true;
    }
  };

  /**
   * Handles the form submission.
   */
  const handleSubmit = async () => {
    if (!(await verifyInput())) {
      return;
    }
    // validate numCards input. Make sure there is enough cards for trump.
    if (numCards) {
      setSettings(downAndUp, numCards);
    }
    if (startDealer != null) {
      setDealer(startDealer);
    }
    navigation.navigate('NewGamePart3');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>First Dealer:</Text>
        {game && <PlayerDropdown game={game} setDealer={setStartDealer} />}
      </View>
      <View style={{ paddingTop: 40 }}>
        <Text style={styles.header}>Cards Dealt:</Text>
        <View style={buttonRowStyles.container}>
          <Text style={componentStyles.text}>{numCards}</Text>
          <View style={buttonRowStyles.leftButton}>
            <Button style={styles.thirdButton} onPress={decreaseNumCards}>-</Button>
          </View>
          <View style={buttonRowStyles.rightButton}>
            <Button style={styles.thirdButton} onPress={increaseNumCards}>+</Button>
          </View>
        </View>
      </View>
      <View style={{ paddingTop: 40 }}>
        <Text style={styles.header}>Down and Up:</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <RadioGroup
            selectedIndex={downAndUp ? 0 : 1}
            onChange={(index) => setDownAndUp(index === 0)}
            style={componentStyles.radioGroup}
          >
            <Radio style={componentStyles.radio}>Enabled</Radio>
            <Radio style={componentStyles.radio}>Disabled</Radio>
          </RadioGroup>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Button style={styles.button} onPress={handleSubmit}>
          Submit Game Settings
        </Button>
      </View>
    </View>
  );
};

export default NewGame;

const componentStyles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginRight: 30,
    minWidth: 40,
    paddingVertical: 7,
    textAlignVertical: 'center',
    marginTop: 20,
  },
  radioGroup: {
    flexDirection: 'row', // Arrange the radio buttons in a row
    alignItems: 'center', // Align items vertically in the center
    marginTop: 10,
  },
  radio: {
    marginHorizontal: 10, // Add horizontal spacing between the radio buttons
  },
});