import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Button } from '@ui-kitten/components';
import { NavigationProp } from '@react-navigation/native';
import { styles } from '../styles/styles';
import { loadAllGames, deleteAllGames } from '../utils/GameStorage';
import SavedGame from '../components/SavedGame';
import Game from '../models/Game';
import { SwipeRow } from 'react-native-swipe-list-view';


interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

/**
 * LoadGameScreen component displays the list of saved games and allows interaction with them.
 * @param navigation - Navigation prop for navigating between screens.
 */
const LoadGameScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [localStorage, setLocalStorage] = useState<Game[] | null>(null);
  const [openRowKey, setOpenRowKey] = useState<string | null>(null);
  const swipeRowRefs = useRef<{ [key: string]: SwipeRow<any> | null }>({});

  /**
   * Fetches all saved games from storage and sets them in the state.
   */
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const games = await loadAllGames();
    setLocalStorage(games);
  };

  /**
   * Handles the deletion of all saved games.
   */
  const handleDeleteGame = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete all previously saved games?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteAllGames();
            setLocalStorage([]);
          },
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
      {localStorage === null ? (
        <View>
          <Text style={styles.checkboxText}>Loading games from storage...</Text>
        </View>
      ) : localStorage.length === 0 ? (
        <View>
          <Text style={styles.checkboxText}>No games found.</Text>
          <Button style={styles.button} onPress={() => navigation.navigate('NewGamePart0')}>
            Start New Game
          </Button>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {localStorage.map((game) => (
              <SavedGame key={game.id} game={game} navigation={navigation} openRowKey={openRowKey} setOpenRowKey={setOpenRowKey} swipeRowRefs={swipeRowRefs} refreshScreen={fetchGames} />
            ))}
          </ScrollView>
          <Button style={styles.secondaryButton} onPress={() => handleDeleteGame()}>
            Delete all games
          </Button>
        </View>
      )}
    </View>
  );
};

export default LoadGameScreen;