import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@ui-kitten/components';
import { styles } from '../styles/styles';
import { theme } from '../styles/theme';


interface TrickSelectorProps {
  label: string;
  onValueChange: (value: number) => void;
  startValue: number;
  playerBid: number | null;   // if playerBid is null, this is a bid selector
}

/**
 * TrickSelector component allows users to input a player's bid or actual amount.
 * @param label - The label for the input field.
 * @param onValueChange - Function to handle the change in the value.
 * @param playerBid - The player's bid amount.
 */
const TrickSelector: React.FC<TrickSelectorProps> = ({ label, onValueChange, playerBid, startValue }) => {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (startValue != 0) {
      setValue(startValue);
      onValueChange(startValue);
    }
    else if (playerBid != null) {
      setValue(playerBid);
      onValueChange(playerBid);
    }
  }, []);

  const handleDecrement = () => {
    if (value > 0) {
      setValue(value - 1);
      onValueChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < 999) {
      setValue(value + 1);
      onValueChange(value + 1);
    }
  };

  const renderPlayerBid = () => {
    if (playerBid !== null && playerBid == value) {
      return <Text style={componentStyles.labelGreen}>({playerBid})</Text>;
    }
    else if(playerBid !== null && playerBid != value) {
      return <Text style={componentStyles.labelRed}>({playerBid})</Text>;
    }
    else {
      return null;
    }
  }

  return (
    <View style={componentStyles.container}>
      <Text style={componentStyles.label} numberOfLines={1} ellipsizeMode="tail">
        {label}
      </Text>
      {renderPlayerBid()}
      <Button style={componentStyles.button} onPress={handleDecrement}>
        <Text style={componentStyles.buttonText}>-</Text>
      </Button>
      <Text style={componentStyles.text}>{value}</Text>
      <Button style={componentStyles.button} onPress={handleIncrement}>
        <Text style={componentStyles.buttonText}>+</Text>
      </Button>
    </View>
  );
};

/**
 * Styles for the TrickSelector component.
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
  labelGreen: {
    fontSize: 18,
    marginRight: 10,
    flex: 1,
    color: 'green',
    fontWeight: 'bold',
  },
  labelRed: {
    fontSize: 18,
    marginRight: 10,
    flex: 1,
    color: 'red',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    minWidth: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.colors.orange2,
    borderWidth: 0,
    borderRadius: 8,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default TrickSelector;