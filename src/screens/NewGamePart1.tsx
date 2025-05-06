import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView } from "react-native";
import PlayerInput from '../components/PlayerInput';
import { Button } from '@ui-kitten/components';
import { useGame } from '../contexts/GameContext';
import { NavigationProp } from '@react-navigation/native';
import { styles } from '../styles/styles';

interface NewGameProps {
  route: any;
  navigation: NavigationProp<any>;
}

/**
 * NewGame component allows users to input player names for a new game or edit an existing game's players.
 * @param route - The route prop for navigation.
 * @param navigation - The navigation prop for navigating between screens.
 */
const NewGame: React.FC<NewGameProps> = ({ route, navigation }) => {
  const { editPlayers, getGame } = useGame();
  const [numPlayers, setNumPlayers] = useState(4);
  const [playerNames, setPlayerNames] = useState<{ [key: number]: string }>({});
  const editMode = route.params?.editor;

  useEffect(() => {
    if (editMode) {
      const game = getGame();
      if (game) {
        const namesDict: { [key: number]: string } = {};
        game.players.forEach((player, index) => {
          namesDict[index] = player.name;
        });
        setPlayerNames(namesDict);
        setNumPlayers(game.players.length);
      }
    } else {
      setPlayerNames({ 0: '', 1: '', 2: '', 3: '' });
    }
  }, [editMode, getGame]);

  /**
   * Handles the change in player name input.
   * @param index - The index of the player.
   * @param name - The new name of the player.
   */
  const handleNameChange = (index: number, name: string) => {
    setPlayerNames((prevNames) => ({
      ...prevNames,
      [index]: name,
    }));
  };

  /**
   * Handles the removal of a player input field.
   */
  const handleRemovePlayer = () => {
    if (numPlayers > 2) {
      setPlayerNames((prevNames) => {
        const updatedNames = { ...prevNames };
        delete updatedNames[numPlayers - 1];
        return updatedNames;
      });
      setNumPlayers(numPlayers - 1);
    } else {
      Alert.alert('There must be at least 2 players.');
    }
  };

  /**
   * Verifies the input fields.
   * @returns A boolean indicating whether the input is valid.
   */
  const verifyInput = (): boolean => {
    // Check how many names are filled in
    let filledInValues = 0;
    for (const value of Object.values(playerNames)) {
      if (value.trim().length !== 0) {
        filledInValues++;
      }
    }
    // Check for at least 2 players
    if(filledInValues < 2) {
      Alert.alert('There must be at least 2 players.');
      return false;
    }
    // Check for duplicate names
    const nameSet = new Set(Object.values(playerNames)
      .map(name => name.trim().toLowerCase())
      .filter(name => name.length > 0));
    if (nameSet.size !== filledInValues) {
      Alert.alert('Duplicate names are not allowed.');
      return false;
    }
    // Return true if all checks pass
    return true;
  };

  /**
   * Handles the form submission.
   */
  const handleSubmit = () => {
    // Trim trailing white space and capitalize first letter of each name
    for (const key in playerNames) {
      if (playerNames.hasOwnProperty(key)) {
        const trimmedName = playerNames[key].trim();
        playerNames[key] = trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);
      }
    }
    // Verify input
    if (!verifyInput()) {
      return;
    }
    // Remove empty names
    for (const key in playerNames) {
      if (playerNames[key].trim() === '') {
        delete playerNames[key];
        continue;
      }
    }
    // Update context with player names
    editPlayers(playerNames);
    // Navigate to the next screen
    if(editMode) {
      navigation.navigate('NewGamePart5', {
        editor: false,
      });
    } else{
      navigation.navigate('NewGamePart2', {
        editor: false,
      });
    }
  };

  /**
   * Renders the player input fields.
   * @returns A JSX element containing the player input fields.
   */
  const renderPlayerInputs = () => {
    return Array.from({ length: numPlayers }).map((_, index) => (
      <PlayerInput
        key={index}
        name={playerNames[index]}
        label={`Player ${index + 1}:`}
        onNameChange={(name: string) => handleNameChange(index, name)}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header2}>Enter players in seating order</Text>
      <ScrollView>
        {renderPlayerInputs()}
      </ScrollView>
      <View>
        <View>
          <Button style={styles.secondaryButton} onPress={() => setNumPlayers(numPlayers + 1)}>Add Player</Button>
          <Button style={styles.secondaryButton} onPress={handleRemovePlayer}>Remove Player</Button>
        </View>
        <Button style={styles.button} onPress={handleSubmit}>
          Submit Players
        </Button>
      </View>
    </View>
  );
};

export default NewGame;