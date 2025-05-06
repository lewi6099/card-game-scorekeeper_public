import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { theme } from '../styles/theme';
import Game from '../models/Game';
import { NavigationProp } from '@react-navigation/native';
import { useGame } from '../contexts/GameContext';
import { formatDate, formatTime, formatDateLong } from '../utils/DateUtils';
import { deleteGame } from '../utils/GameStorage';

interface SavedGameProps {
  game: Game;
  navigation: NavigationProp<any>;
  openRowKey: string | null;
  setOpenRowKey: (key: string | null) => void;
  swipeRowRefs: React.MutableRefObject<{ [key: string]: SwipeRow<any> | null }>;
  refreshScreen: () => void;
}

/**
 * SavedGame component displays a saved game and allows interaction with it.
 * It supports swipe-to-delete functionality.
 * 
 * @param game - The game to display.
 * @param navigation - Navigation prop for navigating between screens.
 * @param openRowKey - The key of the currently open swipe row.
 * @param setOpenRowKey - Function to set the currently open swipe row key.
 * @param swipeRowRefs - References to the swipe rows.
 * @param refreshScreen - Function to refresh the screen after deletion.
 */
const SavedGame: React.FC<SavedGameProps> = ({ game, navigation, openRowKey, setOpenRowKey, swipeRowRefs, refreshScreen }) => {
  const { setGameFromStorage } = useGame();
  const playerNames = game.players.map(player => player.name).join(', ');

  /**
   * Closes other open swipe rows.
   * 
   * @param rowKey - The key of the row to keep open, or null to close all rows.
   */
  const closeOtherRows = (rowKey: string | null) => {
    if (rowKey === null) {
      Object.keys(swipeRowRefs.current).forEach(key => {
        swipeRowRefs.current[key]?.closeRow();
      });
      setOpenRowKey(null);
    } else {
      if (openRowKey && openRowKey !== rowKey && swipeRowRefs.current[openRowKey]) {
        swipeRowRefs.current[openRowKey]?.closeRow();
      }
      setOpenRowKey(rowKey);
    }
  };

  /**
   * Handles the click event to load the selected game.
   * 
   * @param game - The game to load.
   */
  const handleClick = (game: Game) => {
    setGameFromStorage(game);
    navigation.navigate('ActiveGame');
  };

  /**
   * Handles the delete event to remove the selected game.
   * 
   * @param game - The game to delete.
   */
  const handleDeletePressed = (game: Game) => {
    Alert.alert(
      "Confirm Deletion", 
      formatDate(game.date) + "\n" + 
      "Are you sure you want to delete this saved game?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: async () => {
            closeOtherRows(null);
          },
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteGame(game);
            refreshScreen();
          },
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  /**
   * Renders the game details including course and date.
   * 
   * @returns A JSX element displaying the game details.
   */
  const renderGameDetails = () => {
    if (game && game.name) {
      return (
        <View>
          <Text style={componentStyles.label1} numberOfLines={1} ellipsizeMode="tail">
            {game.name}
          </Text>
          <Text style={componentStyles.label2}>{formatDate(game.date)}, {formatTime(game.date)}</Text>
          <Text style={componentStyles.label3} numberOfLines={1} ellipsizeMode="tail">
            {playerNames}
          </Text>
        </View>
      );
    } else if (game) {
      return (
        <View>
          <Text style={componentStyles.label1}>Game on {formatDateLong(game.date)}</Text>
          <Text style={componentStyles.label2}>{formatDate(game.date)}, {formatTime(game.date)}</Text>
          <Text style={componentStyles.label3} numberOfLines={1} ellipsizeMode="tail">
            {playerNames}
          </Text>
        </View>
      );
    }
  };

  return (
    // @ts-expect-error
    <SwipeRow
      ref={(ref) => (swipeRowRefs.current[game.id] = ref)}
      disableRightSwipe
      rightOpenValue={-95}
      onRowOpen={() => closeOtherRows(game.id)}
    >
      <TouchableOpacity style={componentStyles.hiddenItem} onPress={() => handleDeletePressed(game)}>
        <View style={componentStyles.deleteButton}>
          <Text style={componentStyles.deleteButtonText}>Delete</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={componentStyles.customView} activeOpacity={1} onPress={() => handleClick(game)}>
        {renderGameDetails()}
      </TouchableOpacity>
    </SwipeRow>
  );
};

export default SavedGame;

/**
 * Styles for the SavedGame component.
 */
const componentStyles = StyleSheet.create({
  customView: {
    backgroundColor: theme.colors.navy1,
    borderRadius: 8,
    padding: 15,
    margin: 7,
    alignItems: "center",
  },
  label1: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label2: {
    color: theme.colors.gray2,
    fontSize: 15,
    textAlign: 'center',
  },
  label3: {
    color: 'white',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  hiddenItemContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  hiddenItem: {
    alignItems: 'flex-end',
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 15,
    margin: 7,
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});