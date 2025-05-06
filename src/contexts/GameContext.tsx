import React, { createContext, useState, useContext, ReactNode } from 'react';
import Game from '../models/Game';
import Player from '../models/Player';
import CurrentRound from '../models/CurrentRound';
import PlayerRound from '../models/PlayerRound';

interface GameContextProps {
  game: Game | null;
  startNewGame: () => void;
  setDate: (date: Date) => void;
  logCurrentGame: () => void;
  getGame: () => Game | null;
  setGameFromStorage: (game: Game) => void;
  editPlayers: (namesDict: { [key: string]: string }) => void;
  setSettings: (downAndUp: boolean, startNumCards: number) => void;
  setRemainingRounds: (roundsArray: CurrentRound[]) => void;
  nextRound: (updatedGame?: Game) => boolean;
  setName: (name: string | null) => void;
  setMidRound: (midRound: boolean) => void;
  setDealer: (dealer: Player) => void;
  nextDealer: (updatedGame?: Game) => void;
  prevDealer: () => void;
  startNewGameFromPrev: (prevGame: Game, dealer: String) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [game, setGame] = useState<Game | null>(null);

  /**
   * Starts a new game with the given date and course.
   * @param date The date of the game.
   * @param course The course name this game was played at.
   */
  const startNewGame = () => {
    const newGame = new Game();
    setGame(newGame);
  };

  /**
   * Sets the game context from a previously stored game.
   * @param game The game to set in the context.
   */
  const setGameFromStorage = (game: Game) => {
    setGame(game);
  };

  /**
   * Starts a new game with data (players and rounds) from the a game.
   * @param game The previous game to start a new game from.
   */
  const startNewGameFromPrev = (prevGame: Game, dealerName: String) => {
    const newGame = new Game();
    // Update name of new game
    newGame.name = prevGame.name;
    // Update players in new game
    prevGame.players.forEach((player) => {
      const newPlayer = new Player(player.name);
      newGame.addPlayer(newPlayer);
    });
    // Set card and 'down and up' settings
    newGame.setSettingDownAndUp(prevGame.setting_downAndUp);
    newGame.setSettingStartNumCards(prevGame.setting_startNumCards || 0);
    // Set the dealer
    const foundDealer = newGame.players.find((player) => player.name === dealerName);
    if (foundDealer) {
      newGame.setDealer(foundDealer);
    } else {
      return;
    }
    // Set the remaining rounds
    prevGame.completedRounds.forEach((round) => {
      const newRound = new CurrentRound(round.getRoundNumber(), round.getIsGoingDown());
      newGame.addRemainingRound(newRound);
    });
    // Set the new game to context
    setGame(newGame); // Update the game state
    nextRound(newGame); // Pass the updated game directly to nextRound
  };

  /**
   * Gets the current game.
   * @returns The current game or null if no game is set.
   */
  const getGame = (): Game | null => {
    return game;
  };

  const setDate = (date: Date) => {
    if (game) {
      game.setDate(date);
    }
  };

  const setDealer = (dealer: Player) => {
    if (game) {
      game.setDealer(dealer);
    }
  };

  // if called synchronously, use updatedGame parameter to pass the game
  // if called asynchronously, don't use updatedGame parameter and use the game state
  const nextDealer = (updatedGame?: Game) => {
    const currentGame = updatedGame || game;
    if (currentGame && currentGame.dealer) {
      const currentIndex = currentGame.players.indexOf(currentGame.dealer);
      const nextIndex = (currentIndex + 1) % currentGame.players.length;
      currentGame.setDealer(currentGame.players[nextIndex]);
    }
  };

  const prevDealer = () => {
    if (game && game.dealer) {
      const currentIndex = game.players.indexOf(game.dealer);
      const prevIndex = (currentIndex - 1 + game.players.length) % game.players.length;
      game.setDealer(game.players[prevIndex]);
    }
  };

  const setName = (name: string | null) => {
    if (game) {
      game.setName(name);
    }
  };

  /**
   * Edits the players of the current game.
   * @param namesDict A dictionary of player names.
   */
  const editPlayers = (namesDict: { [key: string]: string }) => {
    if (game) {
      game.players = [];
      Object.entries(namesDict).forEach(([key, value]) => {
        const newPlayer = new Player(value);
        game.addPlayer(newPlayer);
      });
    }
  };

  const setSettings = (downAndUp: boolean, startNumCards: number) => {
    if (game) {
      game.setSettingDownAndUp(downAndUp);
      game.setSettingStartNumCards(startNumCards);
    }
  };

  // returns true if next round is started and false if the game is over
  // if called synchronously, use updatedGame parameter to pass the game
  // if called asynchronously, don't use updatedGame parameter and use the game state
  const nextRound = (updatedGame?: Game) => {
    const currentGame = updatedGame || game;
    if (!currentGame) {
      return false;
    }

    // Run if the game has started
    if (currentGame.currentRound) {
      // Call nextDealer to set the next dealer
      nextDealer(currentGame);

      // Update completedRounds
      currentGame.completedRounds.push(currentGame.currentRound);
    }

    const nextRound = currentGame.remainingRounds.shift();
    // Check for end of game
    if (nextRound == undefined) {
      // Game is over, set currentRound to null
      currentGame.currentRound = null;
      currentGame.gameCompleted = true;
    } else {
      // Game is not over, start the next round
      currentGame.currentRound = nextRound;
    }

    currentGame.players.forEach((player) => {
      // Calculate the score for the previous round and update total score
      player.currentRound?.calculateRoundScore();
      player.totalScore += player.currentRound?.roundScore ?? 0;

      // Start the next round if there is one
      if (nextRound != undefined) {
        const newRound = new PlayerRound(nextRound.getRoundNumber(), nextRound.getIsGoingDown());
        player.currentRound = newRound;
        player.rounds.push(newRound);
      } else {
        // Game is over, set currentRound to null
        player.currentRound = null;
      }
    });

    return true;
  };

  const setRemainingRounds = (roundsArray: CurrentRound[]) => {
    if (game) {
      roundsArray.forEach((round) => {
        game.addRemainingRound(round);
      });
    }
  };

  const setMidRound = (midRound: boolean) => {
    if (game) {
      game.setMidRound(midRound);
    }
  };

  /**
   * Logs the current game to the console.
   */
  const logCurrentGame = () => {
    console.log(JSON.stringify(game));
  };

  return (
    <GameContext.Provider value={{
      game,
      startNewGame,
      logCurrentGame,
      setDate,
      getGame,
      setGameFromStorage,
      editPlayers,
      setSettings,
      setRemainingRounds,
      nextRound,
      setName,
      setMidRound,
      setDealer,
      nextDealer,
      prevDealer,
      startNewGameFromPrev,
    }}>
      {children}
    </GameContext.Provider>
  );
};

/**
 * Custom hook to use the GameContext.
 * @returns The GameContextProps.
 * @throws Error if used outside of a GameProvider.
 */
export const useGame = (): GameContextProps => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};