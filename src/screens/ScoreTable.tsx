import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useGame } from '../contexts/GameContext';
import { theme } from '../styles/theme';

import { styles } from '../styles/styles';
import ScoreTableCell from '../components/ScoreTableCell';

const ScoreTable: React.FC = () => {
  const { game } = useGame();

  if (!game) {
    return <Text>No game data available</Text>;
  }

  const tableHead = ['', ...game.players.map(player => player.name)];
  const roundNumbers = game.completedRounds.map(round => round.roundNumber);
  const playerRounds = game.completedRounds.map(round =>
    game.players.map(player => player.rounds.find(r => r.roundNumber === round.roundNumber && r.goingDown === round.goingDown))
  );
  const totalScores = ['Score', ...game.players.map(player => player.totalScore)];

  return (
    <View style={[styles.container, {alignItems: 'center'}]}>
      <ScrollView horizontal>
        <View>
          <View style={componentStyles.headerRow}>
            {tableHead.map((header, index) => (
              <View key={index} style={[componentStyles.headerCell, { width: index === 0 ? 60 : 100 }]}>
                <Text style={componentStyles.headerText}>{header}</Text>
              </View>
            ))}
          </View>
          <ScrollView style={componentStyles.dataWrapper}>
            {roundNumbers.map((roundNumber, rowIndex) => (
              <View key={rowIndex} style={[componentStyles.row, rowIndex % 2 ? componentStyles.alternateRow : null]}>
                <View style={[componentStyles.cell, { width: 60 }]}>
                  <Text style={componentStyles.cellText}>{roundNumber}</Text>
                </View>
                {playerRounds[rowIndex].map((playerRound, cellIndex) => (
                  <View key={cellIndex} style={[componentStyles.cell, { width: 100 }]}>
                    {playerRound !== undefined && <ScoreTableCell playerRound={playerRound} />}
                  </View>
                ))}
              </View>
            ))}
            <View style={[componentStyles.row, roundNumbers.length % 2 ? componentStyles.alternateRow : null]}>
              {totalScores.map((score, index) => (
                <View key={index} style={[componentStyles.cell, { width: index === 0 ? 60 : 100 }]}>
                  <Text style={componentStyles.cellText}>{score}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default ScoreTable;

/**
 * Styles for the ScoreTable component.
 */
const componentStyles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', height: 50, backgroundColor: theme.colors.navy2 },
  headerCell: { justifyContent: 'center', alignItems: 'center', borderWidth: 0.2, borderColor: '#C1C0B9' },
  headerText: { textAlign: 'center', fontWeight: 'bold', color: '#fff' },
  dataWrapper: { marginTop: -1 },
  row: { flexDirection: 'row', height: 40, backgroundColor: theme.colors.gray2 },
  alternateRow: { backgroundColor: theme.colors.gray1 },
  cell: { justifyContent: 'center', alignItems: 'center', borderWidth: 0.2, borderColor: theme.colors.navy2 },
  cellText: { textAlign: 'center' },
});



