import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import { Button } from '@ui-kitten/components';
import { styles, buttonRowStyles } from '../../styles/styles';
import { NavigationProp } from '@react-navigation/native';
import { useGame } from '../../contexts/GameContext';
import Game from '../../models/Game';
import Player from '../../models/Player';
import PlayerDropdown from '../PlayerDropdown';


interface PlayAgainModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  game: Game;
  navigation: NavigationProp<any>;
}

const PlayAgainModal: React.FC<PlayAgainModalProps> = ({ visible, setVisible, game, navigation }) => {
  const { startNewGameFromPrev, nextRound } = useGame();
  const [dealer, setDealer] = useState<Player | null>(null);
  const [recommendedDealers, setRecommendedDealers] = useState<Player[]>([]);
  const [winners, setWinners] = useState<Player[]>([]);
  const [multiple, setMultiple] = useState(false);

  useEffect(() => {
    if (game && visible) {
      const tempWinners: Player[] = findWinners(game.players);
      const tempDealers: Player[] = findRecommendedDealers(game.players, tempWinners, game.setting_startNumCards || 0);
      setWinners(tempWinners);
      setRecommendedDealers(tempDealers);
      setMultiple(tempWinners.length > 1);
    }
  }, [game, visible]);

  const findWinners = (players: Player[]): Player[] => {
    if (players.length === 0) return [];
  
    // Find the highest score among all players
    const highestScore = Math.max(...players.map(player => player.totalScore));
  
    // Filter players to find those with the highest score
    const winners = players.filter(player => player.totalScore === highestScore);
  
    return winners;
  };

  const findRecommendedDealers = (players: Player[], winners: Player[], numCards: number): Player[] => {

    if (players.length === 0 || winners.length === 0) {
      throw new Error('Players and winners must not be empty.');
    }

    const dealers: Player[] = [];
    winners.forEach(winner => {
      const winnerIndex = players.findIndex(player => player.name === winner.name);
      if (winnerIndex === -1) {
        throw new Error('Winner not found in players list.');
      }
      const dealerIndex = (winnerIndex - (numCards - 2) + players.length) % players.length;
      dealers.push(players[dealerIndex]);
    })
    return dealers;
  };

  /**
   * Handles starting the new game.
   */
  const onSubmit = () => {
    if (!dealer) {
      Alert.alert('Please select a dealer.');
      return false;
    }
    startNewGameFromPrev(game, dealer.name);
    setVisible(false);
  }

  const onSubmitNewSettings = () => {
    setVisible(false);
    navigation.navigate('Home');
    navigation.navigate('NewGamePart0');
  }

  /**
   * Generates a card with details about the game.
   * @param game - The game object containing details.
   * @returns JSX element representing the game details card.
   */
  const generateGameDetailsCard = () => {
    return (
      <View style={componentStyles.card}>
        
        <Text style={componentStyles.cardTitle}>Previous Game Details</Text>
        <View></View>
        {/* Game Name */}
        {game.name && <Text style={componentStyles.cardSubtitle}>Game Name:</Text>}
        {game.name && <Text style={componentStyles.cardText} numberOfLines={1} ellipsizeMode="tail">{game.name}</Text>}

        {/* Players */}
        <Text style={componentStyles.cardSubtitle}>Players:</Text>
        <Text style={componentStyles.cardText} numberOfLines={2} ellipsizeMode="tail">
          {game.players.map(player => player.name).join(', ')}
        </Text>
        
        {/* Number of Cards */}
        <Text style={componentStyles.cardSubtitle}>Number of Cards:</Text>
        <Text style={componentStyles.cardText}>
          {game.setting_startNumCards || 'Not Set'}
        </Text>

        {/* Down and Up Mode */}
        <Text style={componentStyles.cardSubtitle}>Down and Up Mode:</Text>
        <Text style={componentStyles.cardText}>
          {game.setting_downAndUp ? 'Enabled' : 'Disabled'}
        </Text>
        {/* Winners */}
        {!multiple && <Text style={componentStyles.cardSubtitle}>Previous Game Winner:</Text>}
        {multiple && <Text style={componentStyles.cardSubtitle}>Previous Game Winners:</Text>}
        <Text style={componentStyles.cardText} numberOfLines={2} ellipsizeMode="tail">
          {winners.map(winner => winner.name).join(', ')}
        </Text>
        {/* Recommended Dealers (only recommend if there is over 1 round) */}
        {game.completedRounds.length > 1 && (
          <>
            {!multiple && <Text style={componentStyles.cardSubtitle}>Recommended Dealer:</Text>}
            {multiple && <Text style={componentStyles.cardSubtitle}>Recommended Dealers:</Text>}
            <Text style={componentStyles.cardText} numberOfLines={2} ellipsizeMode="tail">
              {recommendedDealers.map(dealer => dealer.name).join(', ')}
            </Text>
          </>
        )}
      </View>
    );
  }


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={componentStyles.modalOverlay}>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={componentStyles.modalOverlayTouchable} />
        </TouchableWithoutFeedback>
        <View style={componentStyles.modalContent}>
          <View style={{ padding: 10 }}>
            {generateGameDetailsCard()}
          </View>
          <View style={{ paddingTop: 10, marginBottom: -5, alignSelf: 'flex-start', width: '100%' }}>
            <Text style={styles.header}>First Dealer:</Text>
            {game && <PlayerDropdown game={game} setDealer={setDealer} />}
          </View>
          <Button style={styles.button} onPress={() => onSubmit()}>
            <Text>Use Previous Settings</Text>
          </Button>
          <Button style={styles.thirdButton} onPress={() => onSubmitNewSettings()}>
            <Text>Set New Settings</Text>
          </Button>
          <Button style={styles.secondaryButton} onPress={() => setVisible(false)}>
            Cancel
          </Button>
        </View>
      </View>
    </Modal>
  );
};

/**
 * Styles for the InfoEntryModal component.
 */
const componentStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', // Semi-transparent background
  },
  modalOverlayTouchable: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContent: {
    width: '85%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 1,
    maxHeight: '90%',
  },
  card: {
    backgroundColor: '#fff',
    minWidth: '90%',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    color: '#555',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardSubText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
  },
});

export default PlayAgainModal;
