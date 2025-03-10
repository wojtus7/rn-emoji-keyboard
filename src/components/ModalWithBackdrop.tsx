import * as React from 'react';
import {
  SafeAreaView,
  Modal,
  Animated,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardContext } from '../contexts/KeyboardContext';

type ModalWithBackdropProps = {
  isOpen: boolean;
  backdropPress: () => void;
  children: React.ReactNode;
};

export const ModalWithBackdrop = ({
  isOpen,
  backdropPress,
  children,
}: ModalWithBackdropProps) => {
  const { height: screenHeight } = useWindowDimensions();
  const translateY = React.useRef(new Animated.Value(screenHeight)).current;
  const ctx = React.useContext(KeyboardContext);

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: isOpen ? 0 : screenHeight,
      useNativeDriver: true,
    }).start();
  }, [isOpen, screenHeight, translateY]);

  const handleClose = () => {
    Animated.spring(translateY, {
      toValue: screenHeight,
      useNativeDriver: true,
    }).start();
    setTimeout(() => backdropPress(), 200);
  };

  return (
    <Modal visible={isOpen} animationType="fade" transparent={true}>
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={handleClose}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: ctx.backdropColor },
          ]}
        >
          <SafeAreaView style={styles.modalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <Animated.View
                style={{
                  transform: [{ translateY }],
                }}
              >
                {children}
              </Animated.View>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 10,
  },
});
