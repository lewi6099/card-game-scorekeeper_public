import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView, Alert } from 'react-native';
import { Button } from '@ui-kitten/components';
import { styles } from '../../styles/styles';
import { NavigationProp } from '@react-navigation/native';
import { theme } from "../../styles/theme";
import Game from '../../models/Game';
import TrickSelector from '../TrickSelector';
import Player from '../../models/Player';
import Icon from "react-native-vector-icons/Ionicons";


interface InfoEntryModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  game: Game;
  navigation: NavigationProp<any>;
  midRound: boolean;
  setMidRound: (midRound: boolean) => void;
  triggerNextRound: () => void;
  dealer: Player | null;
}

/**
 * InfoEntryModal component allows users to enter or edit information for the game.
 * It displays a modal with trick selectors for each player, allowing them to input their bids or actual amounts.
 * The modal can be closed by touching the overlay or pressing the cancel button.
 * @param visible - Boolean indicating whether the modal is visible.
 * @param setVisible - Function to set the visibility of the modal.
 * @param game - The game object containing game details.
 * @param navigation - Navigation prop for navigating between screens.
 * @param midRound - Boolean indicating if the game is in the middle of a round.
 * @param setMidRound - Function to set the midRound state.
 * @param triggerNextRound - Function to trigger the next round.
 */
const InfoEntryModal: React.FC<InfoEntryModalProps> = ({ visible, setVisible, game, midRound, setMidRound, triggerNextRound, dealer, navigation }) => {
  const [totalTricks, setTotalTricks] = React.useState<number>(0);


  useEffect(() => {
    addUpTotalTricks();
  }, [visible]);

  const addUpTotalTricks = () => {
    let total = 0;
    game.players.forEach(player => {
      if (player.currentRound) {
        if (midRound && player.currentRound.actualAmount !== null) {
          total += player.currentRound.actualAmount;
        }
        else if (player.currentRound.bidAmount !== null) {
          total += player.currentRound.bidAmount;
        } 
      }
    });
    setTotalTricks(total);
  }

  const validateBidSubmission = (): boolean => {
    // check that bid amount does not equal current round number (unless on round 1)
    if (totalTricks == game.currentRound?.getRoundNumber() && game.currentRound?.getRoundNumber() != 1) {
      Alert.alert("Invalid Trick Count", "Total bid count cannot equal the total number of tricks possible.");
      return false;
    }
    return true;
  }

  const validateActualSubmission = (): boolean => {
    // check that actual amount equals current round number
    if (totalTricks !== game.currentRound?.getRoundNumber()) {
      Alert.alert("Invalid Trick Count", "The number of tricks received does not equal the total number of tricks possible.");
      return false;
    }
    return true;
  }


  /**
   * Handles the submission of the edit options.
   */
  const onSubmit = () => {
    // If midRound is true, waiting for actual count submission
    if (midRound) {
      if (!validateActualSubmission()) {
        return;
      }
      setVisible(false);
      // if amount is null, set to 0
      game.players.forEach(player => {
        if (player.currentRound?.actualAmount == null && player.currentRound) {
          player.currentRound.actualAmount = 0;
        }
      });
      setMidRound(false);
      game.setMidRound(false);
      triggerNextRound();
    } 
    // If midRound is false, waiting for bid submission
    else {
      if (!validateBidSubmission()) {
        return;
      }
      setVisible(false);
      // if amount is null, set to 0
      game.players.forEach(player => {
        if (player.currentRound?.bidAmount == null && player.currentRound) {
          player.currentRound.bidAmount = 0;
        }
      });
      setMidRound(true);
      game.setMidRound(true);
    }
  }

  /**
   * Renders the TrickSelector components for each player.
   * @returns A list of TrickSelector components.
   */
  const renderTrickSelectors = () => {
    // Reorder players so the list is cyclical with the dealer at the end
    const dealerIndex = game.players.findIndex(player => player.name === dealer?.name);
    const reorderedPlayers = dealerIndex >= 0
      ? [...game.players.slice(dealerIndex + 1), ...game.players.slice(0, dealerIndex + 1)]
      : game.players; // If no dealer is found, keep the original order

    if (midRound) {
      return reorderedPlayers.map((player, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          {player.currentRound && (
            <TrickSelector
              label={player.name}
              playerBid={player.currentRound.bidAmount}
              startValue={player.currentRound.actualAmount ?? 0}
              onValueChange={(value) => {
                if (player.currentRound) {
                  player.currentRound.actualAmount = value;
                }
                addUpTotalTricks();
              }}
            />
          )}
        </View>
      ));
    } else {
      return reorderedPlayers.map((player, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          {player.currentRound && (
            <TrickSelector
              label={player.name}
              playerBid={null}
              startValue={player.currentRound.bidAmount ?? 0}
              onValueChange={(value) => {
                if (player.currentRound) {
                  player.currentRound.bidAmount = value;
                }
                addUpTotalTricks();
              }}
            />
          )}
        </View>
      ));
    }
  }

  const renderTotalTricksFeature = () => {
    if (!visible) {
      return null;
    }
    let overUnder = 0;
    let roundOne = false;
    if (game.currentRound) {
      roundOne = game.currentRound.getRoundNumber() == 1;
      overUnder = game.currentRound.getRoundNumber() - totalTricks;
    }
    if (midRound) {
      if (overUnder !== 0) {
        return( <Text style={{color: 'red', fontSize: 16,}}>Total tricks: {totalTricks}</Text> );
      }
      else {
        return( <Text style={{color: 'green', fontSize: 16,}}>Total tricks: {totalTricks}</Text> );
      }
    } else {
      if (overUnder > 0) {
        return( <Text style={{color: 'green', fontSize: 16,}}>Total bids: {totalTricks} | Under by {overUnder}</Text> );
      }
      else if (overUnder < 0) {
        return( <Text style={{color: 'green', fontSize: 16,}}>Total bids: {totalTricks} | Over by {overUnder * -1}</Text> );
      }
      else if (roundOne){
        return( <Text style={{color: 'green', fontSize: 16,}}>Total bids: {totalTricks} | Equal to total tricks</Text> );
      }
      else{
        return( <Text style={{color: 'red', fontSize: 16,}}>Total bids: {totalTricks} | Equal to total tricks</Text> );
      }
    }
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
          {midRound ? (
            <Text style={styles.header}>Enter Actual Tricks</Text>
          ) : (
            <Text style={styles.header}>Enter Bids</Text>
          )}
          <View style={componentStyles.row}>
            <Text style={componentStyles.header2}>Round {game.currentRound?.getRoundNumber()}</Text>
            <Icon name={game.currentRound?.getIsGoingDown() ? "arrow-down" : "arrow-up"} style={{paddingLeft: 6, paddingBottom: 8}} size={23} color="#000" />
          </View>
          <ScrollView style={{ width: '100%' }}>
            {renderTrickSelectors()}
          </ScrollView>
          <View style={{paddingTop: 10}}>
            {renderTotalTricksFeature()}
          </View>
          <Button style={styles.button} onPress={() => onSubmit()}>
            <Text>{midRound ? "Submit Actual" : "Submit Bids"}</Text>
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
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 1,
    maxHeight: '85%',
  },
  header2: {
    fontSize: 16,
    marginBottom: 10,
  },
  bottomText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.colors.gray3,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 0,
    width: '100%'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingBottom: 10
  },
});

export default InfoEntryModal;
