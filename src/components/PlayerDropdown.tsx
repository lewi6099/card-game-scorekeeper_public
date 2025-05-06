import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Game from '../models/Game';
import Player from '../models/Player';
import { styles } from '../styles/styles';
import { theme } from '../styles/theme';

interface PlayerDropdownProps {
  game: Game;
  setDealer: (dealer: Player) => void;
}

const PlayerDropdown: React.FC<PlayerDropdownProps> = ({ game, setDealer }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const handleSelect = (playerName: string) => {
    const selected = game.players.find(player => player.name === playerName);
    if (selected) {
      setSelectedPlayer(playerName);
      setDealer(selected);
    }
  };

  const dropdownData = game.players.map(player => ({
    label: player.name,
    value: player.name, // Using player's name as the unique identifier
  }));

  return (
    <View style={componentStyles.container}>
      <Dropdown
        style={componentStyles.dropdown}
        data={dropdownData}
        labelField="label"
        valueField="value"
        placeholder="Select a player"
        value={selectedPlayer}
        onChange={item => handleSelect(item.value)}
        placeholderStyle={styles.placeholderText}
      />
    </View>
  );
};

const componentStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: theme.colors.gray2,
    height: 40,
    paddingHorizontal: 10,
    flex: 2,
    borderRadius: 8,
  },
  placeholderText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "white"
  },
  selectedText: {
    color: "white"
  },
});

export default PlayerDropdown;