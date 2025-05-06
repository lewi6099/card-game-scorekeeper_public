import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Player from '../models/Player';

interface PodiumProps {
  players: Player[];
}

const Podium: React.FC<PodiumProps> = ({ players }) => {
  const [sortedPlayers, setSortedPlayers] = useState<Player[]>([]);
  const [first, setFirst] = useState<Player[]>([]);
  const [second, setSecond] = useState<Player[]>([]);
  const [third, setThird] = useState<Player[]>([]);
  const [scrollEnabledFirst, setScrollEnabledFirst] = useState(false);
  const [scrollEnabledSecond, setScrollEnabledSecond] = useState(false);
  const [scrollEnabledThird, setScrollEnabledThird] = useState(false);

  useEffect(() => {
    // Sort players by score in descending order
    const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);
    const tempFirst = [sorted[0]];
    const tempSecond = [];
    const tempThird = [];

    // Find the first place players
    let score = tempFirst[0].totalScore;
    let index = 1;
    while (sorted[index] && sorted[index].totalScore === score) {
      tempFirst.push(sorted[index]);
      index++;
    }

    // Find the second place players
    if (tempFirst.length === 1) {
      tempSecond.push(sorted[index]);
      score = tempSecond[0].totalScore;
      index++;
      while (sorted[index] && sorted[index].totalScore === score) {
        tempSecond.push(sorted[index]);
        index++;
      }
    }

    // Find the third place players
    if (((tempFirst.length === 1 && tempSecond.length === 1) || tempFirst.length === 2) && players.length > 2) {
      tempThird.push(sorted[index]);
      score = tempThird[0].totalScore;
      index++;
      while (sorted[index] && sorted[index].totalScore === score) {
        tempThird.push(sorted[index]);
        index++;
      }
    }
    setFirst(tempFirst);
    setSecond(tempSecond);
    setThird(tempThird);
  }, [players]);

  return (
    <View style={componentStyles.container}>
      {/* Second Place */}
      <View style={[componentStyles.podiumBlock, componentStyles.second]}>
        <ScrollView
          scrollEnabled={scrollEnabledSecond}
          onContentSizeChange={(contentWidth, contentHeight) => {
            setScrollEnabledSecond(contentHeight > 50);
          }}
          showsVerticalScrollIndicator={false}
        >
          {second.map((player, index) => (
            <Text key={index} style={componentStyles.name}>{player.name}</Text>
          ))}
        </ScrollView>
        <Text style={componentStyles.placeText}>2nd</Text>
      </View>

      {/* First Place (Tallest) */}
      <View style={[componentStyles.podiumBlock, componentStyles.first]}>
        <ScrollView
          scrollEnabled={scrollEnabledFirst}
          onContentSizeChange={(contentWidth, contentHeight) => {
            setScrollEnabledFirst(contentHeight > 90);
          }}
          showsVerticalScrollIndicator={false}
        >
          {first.map((player, index) => (
            <Text key={index} style={componentStyles.name}>{player.name}</Text>
          ))}
        </ScrollView>
        <Text style={componentStyles.placeText}>1st</Text>
      </View>

      {/* Third Place */}
      <View style={[componentStyles.podiumBlock, componentStyles.third]}>
        <ScrollView
          scrollEnabled={scrollEnabledThird}
          onContentSizeChange={(contentWidth, contentHeight) => {
            setScrollEnabledThird(contentHeight > 40);
          }}
          showsVerticalScrollIndicator={false}
        >
          {third.map((player, index) => (
            <Text key={index} style={componentStyles.name}>{player.name}</Text>
          ))}
        </ScrollView>
        <Text style={componentStyles.placeText}>3rd</Text>
      </View>
    </View>
  );
};

export default Podium;

/**
 * Styles for the Podium component.
 */
const componentStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  podiumBlock: {
    width: 80,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#FFD700",
    marginHorizontal: 5,
    borderRadius: 5,
    padding: 10,
  },
  first: { height: 120, backgroundColor: "#FFD700" }, // Gold
  second: { height: 100, backgroundColor: "#C0C0C0" }, // Silver
  third: { height: 80, backgroundColor: "#CD7F32" }, // Bronze
  placeText: { fontSize: 16, fontWeight: "bold", paddingTop: 5 },
  name: { fontSize: 14, marginTop: 5 },
});