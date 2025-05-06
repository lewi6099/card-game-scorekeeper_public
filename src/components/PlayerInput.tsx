import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { styles } from '../styles/styles';

interface PlayerInputProps {
  label: string;
  onNameChange: (name: string) => void;
  name: string;
}

/**
 * PlayerInput component allows users to input a player's name.
 * @param label - The label for the input field.
 * @param onNameChange - Function to handle the change in the player's name.
 */
const PlayerInput: React.FC<PlayerInputProps> = ({ label, onNameChange, name: name }) => {

  return (
    <View style={componentStyles.container}>
      <Text style={componentStyles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={onNameChange}
        placeholder="Enter name"
        placeholderTextColor={styles.placeholderText.color}
        returnKeyType="done"
      />
    </View>
  );
};

/**
 * Styles for the PlayerInput component.
 */
const componentStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginRight: 10,
    flex: 1,
    color: 'black',
  },
});

export default PlayerInput;