import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Share, TouchableWithoutFeedback } from 'react-native';
import { Button } from '@ui-kitten/components';
import { CheckBox } from 'react-native-elements';
import Game from '../../models/Game';
import { styles } from '../../styles/styles';

interface ShareModalProps {
  game: Game | null;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

/**
 * ShareModal component allows users to share game details.
 * @param game - The game to share.
 * @param visible - Boolean indicating whether the modal is visible.
 * @param setVisible - Function to set the visibility of the modal.
 */
const ShareModal: React.FC<ShareModalProps> = ({ game, visible, setVisible }) => {
  const [includeDate, setIncludeDate] = useState<boolean>(true);
  const [includePlayers, setIncludePlayers] = useState<boolean>(true);
  const [includePayments, setIncludePayments] = useState<boolean>(true);
  const [includeChipCount, setIncludeChipCount] = useState<boolean>(false);
  const [includeSpecificChips, setIncludeSpecificChips] = useState<boolean>(false);

  /**
   * Creates the message to be shared based on the selected options.
   * @returns The message string.
   */
  const createMessage = (): string => {
    let message = "";
    if (includeDate) {
      message += `Date: ${new Date().toLocaleDateString()}\n`;
      if (includePlayers || includePayments || includeChipCount || includeSpecificChips) {
        message += '\n';
      }
    }
    if (includePlayers) {
      message += "Players: ";
      game?.players.forEach((player, index) => {
        message += `${player.name}`;
        if (index < game.players.length - 1) {
          message += ', ';
        } else {
          message += '\n';
        }
      });
      if (includePayments || includeChipCount || includeSpecificChips) {
        message += '\n';
      }
    }
    if (includePayments) {
      message += "Payments:\n";
      game?.payments.forEach((payment) => {
        message += `${payment.sender.name} owes ${payment.receiver.name} $${payment.amount}\n`;
      });
      if (includeChipCount || includeSpecificChips) {
        message += '\n';
      }
    }
    if (includeChipCount) {
      message += "Chip Count:\n";
      game?.players.forEach((player) => {
        let goodChips = 0;
        let badChips = 0;
        player.goodChips.forEach(() => goodChips++);
        player.badChips.forEach(() => badChips++);
        if (goodChips > 0 || badChips > 0) {
          message += `${player.name} has ${goodChips} good chips and ${badChips} bad chips\n`;
        }
      });
      if (includeSpecificChips) {
        message += '\n';
      }
    }
    if (includeSpecificChips) {
      message += "Chips:\n";
      game?.goodChips.forEach((chip) => {
        message += `${chip.title}: `;
        if (game.players.some(player => player.goodChips.includes(chip))) {
          game.players.forEach((player) => {
            if (player.goodChips.includes(chip)) {
              message += `${player.name}\n`;
            }
          });
        } else {
          message += 'N/A\n';
        }
      });
      game?.badChips.forEach((chip) => {
        message += `${chip.title}: `;
        if (game.players.some(player => player.badChips.includes(chip))) {
          game.players.forEach((player) => {
            if (player.badChips.includes(chip)) {
              message += `${player.name}\n`;
            }
          });
        } else {
          message += 'N/A\n';
        }
      });
    }
    return message;
  };

  /**
   * Shares the created message using the Share API.
   */
  const shareMessage = async () => {
    const message = createMessage();
    try {
      await Share.share({
        message,
      });
      setVisible(false);
    } catch (error) {
      console.error('Error sharing message:', error);
    }
  };

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
          <View>
            <Text style={styles.header}>Included information...</Text>
            <CheckBox
              title="Include Date"
              checked={includeDate}
              onPress={() => setIncludeDate(!includeDate)}
              checkedColor="#2c3d50"
            />
            <CheckBox
              title="Include Player Names"
              checked={includePlayers}
              onPress={() => setIncludePlayers(!includePlayers)}
              checkedColor="#2c3d50"
            />
            <CheckBox
              title="Include Required Payments"
              checked={includePayments}
              onPress={() => setIncludePayments(!includePayments)}
              checkedColor="#2c3d50"
            />
            <CheckBox
              title="Include Count of Good vs. Bad Chips"
              checked={includeChipCount}
              onPress={() => setIncludeChipCount(!includeChipCount)}
              checkedColor="#2c3d50"
            />
            <CheckBox
              title="Include Specific Chips"
              checked={includeSpecificChips}
              onPress={() => setIncludeSpecificChips(!includeSpecificChips)}
              checkedColor="#2c3d50"
            />
          </View>
          <Button style={styles.button} onPress={shareMessage}>
            Share
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
 * Styles for the ShareModal component.
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
  },
});

export default ShareModal;
