import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import CurrentRound from '../models/CurrentRound';
import Icon from "react-native-vector-icons/Ionicons";
import Player from '../models/Player';

interface GameStatusProps {
  midRound: boolean;
  round: CurrentRound | null;
  complete: boolean;
  dealer: Player | null;
}

/**
 * GameStatus component displays the current round number and status with an arrow icon and status indicator.
 * 
 * @param midRound - Boolean indicating if the game is in the middle of a round.
 * @param round - CurrentRound object representing the current round.
 */
const GameStatus: React.FC<GameStatusProps> = ({ midRound, round, complete, dealer }) => {

  const renderStatusIcons = () => {
    if (complete) {
      return (
        <View style={componentStyles.row}>
          <View style={[componentStyles.statusIndicator, { backgroundColor: 'red' }]} />
          <Text style={componentStyles.statusText}>
            Status: Game complete
          </Text>
        </View>
      )
    } else if (midRound) {
      return (
        <View style={componentStyles.row}>
          <View style={[componentStyles.statusIndicator, { backgroundColor: 'green' }]} />
          <Text style={componentStyles.statusText}>
            Status: Playing round {round?.getRoundNumber()}
          </Text>
        </View>
      )
    } else if (!midRound) {
      return (
        <View style={componentStyles.row}>
          <View style={[componentStyles.statusIndicator, { backgroundColor: 'yellow' }]} />
          <Text style={componentStyles.statusText}>
            Status: Waiting for bids
          </Text>
        </View>
      )
    }
  }

  const renderRoundNumber = () => {
    if (complete) {
      return (
        <View style={componentStyles.row}>
          <Text style={componentStyles.roundText}>End of Game {round?.getRoundNumber()}</Text>
        </View>
      )
    } else {
      return (
        <View style={componentStyles.row}>
          <Text style={componentStyles.roundText}>Round {round?.getRoundNumber()}</Text>
          <Icon name={round?.getIsGoingDown() ? "arrow-down" : "arrow-up"} size={20} color="#000" />
        </View>
      )
    }
  }

  const renderDealerDetails = () => {
    if (complete || dealer == null) {
      return;
    } else {
      return (
        <View style={componentStyles.row}>
          <Text style={componentStyles.dealerText}>Dealer: {dealer.name}</Text>
        </View>
      )
    }
  }

  return (
    <View style={componentStyles.container}>
      {renderRoundNumber()}
      {renderStatusIcons()}
      {renderDealerDetails()}
    </View>
  );
};

export default GameStatus;

/**
 * Styles for the GameStatus component.
 */
const componentStyles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    borderColor: theme.colors.gray3,
    borderWidth: 2,
    backgroundColor: theme.colors.gray2,
    width: '85%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  roundText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    marginLeft: 5,
    fontSize: 14,
  },
  dealerText: {
    marginLeft: 5,
    fontSize: 14,
    fontStyle: 'italic',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
});