import AsyncStorage from '@react-native-async-storage/async-storage';
import { parse, stringify } from 'flatted';
import Game from '../models/Game';

const GAME_STORAGE_KEY = 'game_data';

/**
 * Saves the game object to AsyncStorage
 * @param game Game instance
 */
export const saveGame = async (game: Game): Promise<void> => {
  try {
    const existingGames = await loadAllGames();
    // If there are no existing games, create a new list
    if (existingGames === null) {
      await AsyncStorage.setItem(GAME_STORAGE_KEY, stringify([game]));
      console.log('Game added successfully.');
      return;
    }
    // Check if the game already exists
    let gameExists = false;
    for (let i = 0; i < existingGames.length; i++) {
      if (existingGames[i].id === game.id) {
        console.log('Game already exists. Updating game.');
        existingGames[i] = game;
        gameExists = true;
        break;
      }
    }
    if (!gameExists) {
      existingGames.push(game); // Add new game to the list
    }
    // Sort the games by date
    existingGames.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // Save the updated list to AsyncStorage
    const jsonValue = stringify(existingGames);
    await AsyncStorage.setItem(GAME_STORAGE_KEY, jsonValue);
    console.log('Successfully updated storage.');
  } catch (error) {
    console.error('Error saving game:', error);
  }
};

/**
 * Retrieves all games from AsyncStorage
 * @returns A Game instance or null if not found
 */
export const loadAllGames = async (): Promise<Game[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(GAME_STORAGE_KEY);
    if (jsonValue !== null) {
        const parsedGames = parse(jsonValue);
        return parsedGames.map((game: any) => Game.fromJSON(game)); // Convert objects to Game instances
    }
    return []; // Return an empty array if no games exist
  } catch (error) {
    console.error('Error loading games:', error);
    return [];
  }
};

/**
 * Deletes all games from from AsyncStorage
 * @returns void
 */
export const deleteAllGames = async (): Promise<void> => {
  try {
      await AsyncStorage.removeItem(GAME_STORAGE_KEY);
      console.log('All games deleted.');
  } catch (error) {
      console.error('Error deleting all games:', error);
  }
};

/**
 * Deletes a specific game from AsyncStorage
 * @param game Game instance
 */
export const deleteGame = async (game: Game): Promise<void> => {
  try {
    const existingGames = await loadAllGames();
    if (existingGames === null) {
      console.log('Game not found.');
      return;
    }
    const updatedGames = existingGames.filter((g) => g.id !== game.id);
    const jsonValue = stringify(updatedGames);
    await AsyncStorage.setItem(GAME_STORAGE_KEY, jsonValue);
    console.log('Game deleted successfully.');
  } catch (error) {
    console.error('Error deleting game:', error);
  }
}
