import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Button } from '@ui-kitten/components';
import { useGame } from '../contexts/GameContext';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import Game from '../models/Game';
import { styles, buttonRowStyles } from '../styles/styles';
import { saveGame, deleteGame } from '../utils/GameStorage';
import { formatDateLong, formatTime } from '../utils/DateUtils';
import Icon from "react-native-vector-icons/Ionicons";
import InfoEntryModal from '../components/modals/InfoEntryModal';
import GameStatus from '../components/GameStatus';
import Podium from '../components/Podium';
import PlayAgainModal from '../components/modals/PlayAgainModal';

interface ActiveGameProps {
  route: any;
  navigation: NavigationProp<any>;
}

/**
 * GameSummary component displays the summary of a game including players, chips, and payments.
 * @param route - The route prop for navigation.
 * @param navigation - The navigation prop for navigating between screens.
 */
const ActiveGame: React.FC<ActiveGameProps> = ({ route, navigation }) => {
  const { getGame, nextRound, setMidRound, prevDealer } = useGame();
  const [refreshKey, setRefreshKey] = useState(0);
  const [game, setGame] = useState<Game | null>(null);
  const [midRound, setMidRound_hook] = useState<boolean>(false);
  const [visibleShareModal, setVisibleShareModal] = useState<boolean>(false);
  const [visibleInfoEntryModal, setVisibleInfoEntryModal] = useState<boolean>(false);
  const [visiblePlayAgainModal, setVisiblePlayAgainModal] = useState<boolean>(false);



  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => {handleDelete()}}>
          <Icon name="trash" style={styles.headerIconLeft} size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  /**
   * Forced the screen to refresh when it is focused.
   */
  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  /**
   * Updates the game from context and saves it to storage.
   */
  useEffect(() => {
    const fetchedGame = getGame();
    setGame(fetchedGame);
    if (fetchedGame) {
      saveGame(fetchedGame);
    }
  }, [refreshKey, midRound, game, visiblePlayAgainModal]);

  useEffect(() => {
    if (game?.gameCompleted) {
      // navigation.setOptions({
      //   headerRight: () => (
      //     <TouchableOpacity onPress={() => setVisibleShareModal(true)}>
      //       <Icon name="share-outline" style={styles.headerIconRight} size={24} color="black" />
      //     </TouchableOpacity>
      //   ),
      // });
    } else {
      navigation.setOptions({
        headerRight: () => null,
      });
    }
  }, [navigation, game, midRound, refreshKey]);

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete Game",
      "Are you sure you want to delete this game?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            if (game) {
              navigation.navigate('Home');
              deleteGame(game);
            };
          },
        }
      ],
      { cancelable: false }
    );
  }

  const handleEditPrevRound = () => {
    if(!game) {
      return;
    }
    game.players.forEach((player) => {
      // Game is completed, set current round to last completed round
      if (player.currentRound == null){
        player.currentRound = player.rounds[player.rounds.length - 1];
      }
      // There are more than 2 rounds added (at least 1 completed), 
      // delete newly added round and set current round to last completed round
      else if (player.rounds.length >= 2) {
        player.rounds.pop();
        player.currentRound = player.rounds[player.rounds.length - 1];
      }
      // One round completed, set current round to that round 
      else if (player.rounds.length === 1) {
        player.currentRound = player.rounds[0];
      } 
      // Fail case
      else {
        player.currentRound = null;
      }
      if (player.currentRound != null) {
        player.totalScore = player.totalScore - (player.currentRound.roundScore ?? 0);
        player.currentRound.roundScore = null;
      }
    })
    if (game.currentRound != null) {
      game.remainingRounds.unshift(game.currentRound);
    }
    game.currentRound = game.completedRounds.pop() || null;
    // Reverse the dealer
    prevDealer();
    // Set hooks
    setMidRound(true);
    setMidRound_hook(true);
    setVisibleInfoEntryModal(true);
  }

  const handleEditBids = () => {
    setMidRound(false);
    setMidRound_hook(false);
    setVisibleInfoEntryModal(true);
  }

  /**
   * Renders the game details including course and date.
   * @returns A JSX element displaying the game details.
   */
  const renderGameDetails = () => {
    if (game && game.name) {
      return (
        <View>
          <Text style={styles.gameDetailsHeader} numberOfLines={2} ellipsizeMode="tail">
            {game.name}
          </Text>
          <Text style={styles.gameDetailsHeader2}>{formatDateLong(game.date)}, {formatTime(game.date)}</Text>
        </View>
      );
    } else if (game) {
      return (
        <View>
          <Text style={styles.gameDetailsHeader}>{formatDateLong(game.date)}</Text>
          <Text style={styles.gameDetailsHeader2}>{formatTime(game.date)}</Text>
        </View>
      );
    }
    return null;
  };

  const renderOngoingGame = () => {
    return(
      <>
        {midRound && 
          <ScrollView style={styles.scrollContainer}>
            <View style={componentStyles.tableRow}>
              <Text style={componentStyles.tableHeader}>Name</Text>
              <Text style={componentStyles.tableHeader}>Bid</Text>
              <Text style={componentStyles.tableHeader}>Total Score</Text>
            </View>
            {game && game.players.map((player) => (
              <View key={player.name} style={componentStyles.tableRow}>
                <Text style={componentStyles.tableCell} numberOfLines={1} ellipsizeMode="tail">{player.name}</Text>
                <Text style={componentStyles.tableCell}>{player.currentRound?.bidAmount}</Text>
                <Text style={componentStyles.tableCell}>{player.totalScore}</Text>
              </View>
            ))}
          </ScrollView>
        }
        {!midRound && 
          <ScrollView style={styles.scrollContainer}>
            <View style={componentStyles.tableRow}>
              <Text style={componentStyles.tableHeader}>Name</Text>
              <Text style={componentStyles.tableHeader}>Total Score</Text>
            </View>
            {game && game.players.map((player) => (
              <View key={player.name} style={componentStyles.tableRow}>
                <Text style={componentStyles.tableCell} numberOfLines={1} ellipsizeMode="tail">{player.name}</Text>
                <Text style={componentStyles.tableCell}>{player.totalScore}</Text>
              </View>
            ))}
          </ScrollView>
        }
      </>
    )
  }

  const renderEndGame = () => {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={componentStyles.tableRow}>
          <Text style={componentStyles.tableHeader}>Place</Text>
          <Text style={componentStyles.tableHeader}>Name</Text>
          <Text style={componentStyles.tableHeader}>Total Score</Text>
        </View>
        {game &&
          game.players
            .slice()
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((player, index) => (
              <View key={player.name} style={componentStyles.tableRow}>
                <Text style={componentStyles.tableCell}>{index + 1}</Text>
                <Text style={componentStyles.tableCell} numberOfLines={1} ellipsizeMode="tail">{player.name}</Text>
                <Text style={componentStyles.tableCell}>{player.totalScore}</Text>
              </View>
            ))}
      </ScrollView>
    );
  };

  const renderEndGameButtons = () => {
    return(
      <View>
        {game && <Podium players={game.players} />}
        <Button style={styles.secondaryButton} onPress={() => { navigation.navigate('ScoreTable'); }}>
          View Score Chart
        </Button>
        <View style={buttonRowStyles.container}>
          <View style={buttonRowStyles.leftButton}>
            <Button style={styles.secondaryButton} onPress={async () => {
              const promise = await new Promise((resolve) => {
                Alert.alert(
                  'Opening Finished Game',
                  'This game is finished. Do you want to open it again?',
                  [
                    { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                    { text: 'Continue', onPress: () => resolve(true) },
                  ]
                );
              });
              if (promise && game) {
                game.gameCompleted = false;
                handleEditPrevRound();
              }
            }}>
              Previous Round
            </Button>
          </View>
          <View style={buttonRowStyles.rightButton}>
            <Button style={styles.secondaryButton} onPress={() => setVisiblePlayAgainModal(true)}>
              Play Again
            </Button>
          </View>
        </View>
        <Button style={styles.button} onPress={() => { navigation.navigate('Home'); }}>
          Return to Home
        </Button>
      </View>
    )
  }

  const renderOngoingGameButtons = () => {
    return(
      <View>
        <Button style={styles.thirdButton} onPress={() => { setVisibleInfoEntryModal(true); }}>
          {midRound ? "End Round: Enter Actual Tricks Taken" : "Start Next Round: Enter Bids"}
        </Button>
        {game && (game.completedRounds.length > 0 || midRound) &&
          <View style={buttonRowStyles.container}>
            <View style={buttonRowStyles.leftButton}>
              {midRound ? 
                <Button style={styles.secondaryButton} onPress={() => handleEditBids()}>
                  Re-enter Bids
                </Button>
                :
                // only show if game.completedRounds.length > 0
                <Button style={styles.secondaryButton} onPress={() => handleEditPrevRound()}>
                  Previous Round
                </Button>
              }
            </View>
            <View style={buttonRowStyles.rightButton}>
              <Button style={styles.secondaryButton} onPress={() => { navigation.navigate('ScoreTable'); }}>
              View Score Chart
              </Button>
            </View>
          </View>
        }
        <Button style={styles.button} onPress={() => { navigation.navigate('Home'); }}>
          Return to Home
        </Button>
      </View>
    )
  }

  return (
    <View key={refreshKey} style={styles.container}>
      {renderGameDetails()}
      {game && <GameStatus midRound={midRound} round={game.currentRound} complete={game.gameCompleted} dealer={game.dealer}/>}

      {game && !game.gameCompleted && renderOngoingGame()}
      {game && game.gameCompleted && renderEndGame()}

      {game && !game.gameCompleted && renderOngoingGameButtons()}
      {game && game.gameCompleted && renderEndGameButtons()}
      
      {/* <ShareModal game={game} visible={visibleShareModal} setVisible={setVisibleShareModal} /> */}
      {game &&
        <InfoEntryModal 
          visible={visibleInfoEntryModal} 
          setVisible={setVisibleInfoEntryModal} 
          game={game} 
          midRound={midRound} 
          setMidRound={setMidRound_hook} 
          triggerNextRound={nextRound} 
          dealer={game.dealer}
          navigation={navigation} 
        />
      }
      {game &&
        <PlayAgainModal 
          visible={visiblePlayAgainModal} 
          setVisible={setVisiblePlayAgainModal} 
          game={game}
          navigation={navigation} 
        />
      }
    </View>
  );
};

/**
 * Styles for the ActiveGame component.
 */
const componentStyles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  table: { marginTop: 0 },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  tableHeader: { flex: 1, fontWeight: 'bold', textAlign: 'center' },
  tableCell: { flex: 1, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  }
});

export default ActiveGame;
