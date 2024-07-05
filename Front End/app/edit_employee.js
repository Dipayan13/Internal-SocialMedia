import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import config from '../config';


const formatDate = (dateString) => {

  

  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const EditEmployeeScreen = () => {

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

  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState(null); // State for error modal
  const route = useRoute();
  const apiBaseUrl = config.API_BASE_URL;
  const apiBaseUrlImage = config.API_BASE_URL_IMAGE;
  const eid = route.params?.eid;

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then((token) => {
        if (token) {
          axios
            .get(apiBaseUrl+`/profile?eid=${eid}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              const formattedData = {
                ...response.data.emp_profile[0],
                dob: formatDate(response.data.emp_profile[0].dob), // Format birthday
                doj: formatDate(response.data.emp_profile[0].doj), // Format date of joining
              };
              setProfileData(formattedData);
            })
            .catch((error) => {
              console.error('Error fetching profile:', error);
              setError('Oops! Something went wrong. Please try again later.'); // Set the error message
            });
        }
      })
      .catch((error) => {
        console.error('Error getting token:', error);
      });
  }, [eid]);

  const closeErrorModal = () => {
    setError(null); // Clear the error message
  };

  const handleSaveChanges = () => {
    // Perform the save operation here
    // If there's an error, set the error message and display the modal
    setError('Oops! Something went wrong while saving. Please try again later.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.coverContainer}>
        <Image source={require('../assets/IBSFINtech-logo.png')} style={styles.coverImage} />
        {profileData.image ? ( // Check if image field exists in profileData
          <Image
            source={{ uri: apiBaseUrlImage+`/${profileData.image}` }}
            style={styles.profileImage}
          />
        ) : (
          <Image source={require('../assets/profile_picture.jpg')} style={styles.profileImage} />
        )}
      </View>
      <View style={styles.logoContainer}>
        {/* Render your logo buttons here */}
        {/* You can use TouchableOpacity with Image inside */}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Name: {profileData.emp_Name}</Text>
        <Text style={styles.email}>{profileData.wmail}</Text>
        <Text style={styles.infoText}>Employee ID:</Text>
        <TextInput style={styles.input} placeholder={` ${profileData.eid}`} placeholderTextColor="#888" />
        <Text style={styles.infoText}>Birthday:</Text>
        <TextInput style={styles.input} placeholder={` ${profileData.dob}`} placeholderTextColor="#888" />
        <Text style={styles.infoText}>Date of Joining:</Text>
        <TextInput style={styles.input} placeholder={` ${profileData.doj}`} placeholderTextColor="#888" />
        <Text style={styles.infoText}>Nick Name:</Text>
        <TextInput style={styles.input} placeholder={` ${profileData.nick_Name}`} placeholderTextColor="#888" />
      </View>
      <TouchableOpacity
        style={styles.capsuleButton}
        onPress={handleSaveChanges} // Call the save changes function
      >
        <Text style={styles.capsuleButtonText}>SAVE CHANGES</Text>
      </TouchableOpacity>
      {/* Error Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={error !== null} // Display the modal when error is not null
        onRequestClose={closeErrorModal}
      >
        <TouchableWithoutFeedback onPress={closeErrorModal}>
          <View style={styles.modalContainer}>
            <View style={styles.alert}>
              <Text style={styles.alertText}>{error}</Text>
              <TouchableOpacity style={styles.okButton} onPress={closeErrorModal}>
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:40,
    alignItems: 'center',
  },
  coverContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  profileImage: {
    position: 'absolute',
    bottom: -50,
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  capsuleButton: {
    padding: 3,
    backgroundColor: 'green',
    borderRadius: 25,
    minWidth: 80,
  },
  capsuleButtonText: {
    textAlign: 'center',
    color: 'white',
    padding: 10,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alert: {
    backgroundColor: 'white',
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  alertText: {
    fontSize: 18,
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
    minWidth: 80,
    alignSelf: 'center', 
  },
  okButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EditEmployeeScreen;
