import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import PlayerRound from '../models/PlayerRound';

interface ScoreTableCellProps {
  playerRound: PlayerRound;
}

/**
 * ScoreTableCell component displays a player's bid amount and round score in a 1D table.
 * 
 * @param playerRound - PlayerRound object to display.
 */
const ScoreTableCell: React.FC<ScoreTableCellProps> = ({ playerRound }) => {
  return (
    <View style={componentStyles.container}>
      <View style={componentStyles.cell}>
        <Text style={componentStyles.cellText}>{playerRound.bidAmount}</Text>
      </View>
      {playerRound.bidAmount === playerRound.actualAmount ? (
        <View style={componentStyles.cell}>
          <Text style={componentStyles.cellTextGreen}>{playerRound.actualAmount}</Text>
        </View>
      ) : (
        <View style={componentStyles.cell}>
          <Text style={componentStyles.cellTextRed}>{playerRound.actualAmount}</Text>
        </View>
      )}
    </View>
  );
};

export default ScoreTableCell;

/**
 * Styles for the ScoreTableCell component.
 */
const componentStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    padding: 10,
  },
  cellText: {
    textAlign: 'center',
  },
  cellTextGreen: {
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
  },
  cellTextRed: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
});