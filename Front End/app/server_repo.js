import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';


const ServerRepository = () => {

  const navigation = useNavigation();

  useEffect(() => {
    const disableHeader = () => {
      navigation.setOptions({
        headerShown: false,
      });
    };

    disableHeader();

    return () => {
      navigation.setOptions({
        headerShown: true,
      });
    };
  }, [navigation]);

  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    // Display the alert when the component mounts
    setShowAlert(true);
  }, []);

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAlert}
        onRequestClose={closeAlert}
      >
        <View style={styles.modalContainer}>
          <View style={styles.alert}>
            <Text style={styles.alertText}>
              Sorry, this feature is not available 😞
            </Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={closeAlert}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <WebView
        source={{ uri: 'https://www.ibsfintech.com/' }}
        style={styles.webView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:40,
  },
  webView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
  },
  alert: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  alertText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  okButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  okButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ServerRepository;
