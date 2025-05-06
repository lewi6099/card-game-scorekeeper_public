import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert, Platform, StyleSheet } from "react-native";
import { Button } from '@ui-kitten/components';
import { useGame } from '../contexts/GameContext';
import { NavigationProp } from '@react-navigation/native';
import { styles } from '../styles/styles';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../styles/theme';

interface NewGameProps {
  route: any;
  navigation: NavigationProp<any>;
}

/**
 * NewGame component allows users to start a new game or edit an existing game's details.
 * @param route - The route prop for navigation.
 * @param navigation - The navigation prop for navigating between screens.
 */
const NewGame: React.FC<NewGameProps> = ({ route, navigation }) => {
  const { startNewGame, setDate, setName, getGame } = useGame();
  const [gameName, setGameName] = useState<string>('');
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [tempTime, setTempTime] = useState<Date>(new Date());
  const editMode = route.params?.editor;

  useEffect(() => {
    startNewGame();
  }, [editMode]);

  /**
   * Verifies the input fields.
   * @returns A boolean indicating whether the input is valid.
   */
  const verifyInput = (): boolean => {
    return true;
  };

  /**
   * Handles the date change event.
   * @param event - The event object.
   * @param selectedDate - The selected date.
   */
  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);
  };

  /**
   * Handles the time change event.
   * @param event - The event object.
   * @param selectedTime - The selected time.
   */
  const onTimeChange = (event: any, selectedTime: any) => {
    const currentTime = selectedTime || tempTime;
    setTempTime(currentTime);
  };

  /**
   * Handles the form submission.
   */
  const handleSubmit = () => {
    // Verify input
    if (!verifyInput()) {
      return;
    }
    // Combine date and time into a single Date object
    const combinedDateTime = new Date(tempDate);
    combinedDateTime.setHours(tempTime.getHours());
    combinedDateTime.setMinutes(tempTime.getMinutes());
    combinedDateTime.setSeconds(tempTime.getSeconds());

    // Set name of game to null if empty
    let tempGameName = null;
    if (gameName !== '') {
      tempGameName = gameName;
    }

    setDate(combinedDateTime);
    setName(tempGameName);

    // Navigate to the next screen
    if (editMode) {
      navigation.navigate('GameSummary');
    } else {
      navigation.navigate('NewGamePart1', {
        editor: false,
      });
    }
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'android') {
      return (
        <View
          style={componentStyles.androidDatePicker}
          onTouchEnd={async () => {
            DateTimePickerAndroid.open({
              value: tempDate,
              onChange: onDateChange, 
              mode: "date",
              is24Hour: false,
            });
          }}
        >
          <Text style={{ fontWeight: 'normal', color: 'black' }}>
            {tempDate.toLocaleDateString([], {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </Text>
        </View>
      );
    } else {
      return (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          themeVariant="light"
        />
      );
    }
  };

  const renderTimePicker = () => {
    if (Platform.OS === 'android') {
      return (
        <View
          style={componentStyles.androidDatePicker}
          onTouchEnd={async () => {
            DateTimePickerAndroid.open({
              value: tempTime,
              onChange: onTimeChange, 
              mode: "time",
              is24Hour: false,
            });
          }}
        >
          <Text style={{ fontWeight: 'normal', color: 'black' }}>
            {tempTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
        </View>
      );
    } else {
      return (
        <DateTimePicker
          value={tempTime}
          mode="time"
          display="default"
          onChange={onTimeChange}
          themeVariant="light"
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Game Name:</Text>
      <TextInput
        style={styles.input2}
        placeholder="Optional - Enter a name for your game"
        placeholderTextColor={styles.placeholderText.color}
        value={gameName}
        onChangeText={setGameName}
      />
      <View style={{ paddingTop: 40 }}>
        <Text style={styles.header}>Date:</Text>
        <View style={{ alignItems: 'center' }}>
          {renderDatePicker()}
        </View>
      </View>
      <View style={{ paddingTop: 40 }}>
        <Text style={styles.header}>Time:</Text>
        <View style={{ alignItems: 'center' }}>
          {renderTimePicker()}
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Button style={styles.button} onPress={handleSubmit}>
          Submit Details
        </Button>
      </View>
    </View>
  );
};

export default NewGame;

const componentStyles = StyleSheet.create({
  androidDatePicker: {
    width: 200,
    height: 40,
    margin: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.gray2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#d3d3d3',
    borderWidth: 1,
  },
});
