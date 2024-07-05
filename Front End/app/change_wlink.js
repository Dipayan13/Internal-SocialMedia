import React, { useState, useEffect } from 'react';

import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';


import axios from 'axios';

 

const ChangeWLink = () => {

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

  const [token, setToken] = useState('');

  const [Wlink, setWlink] = useState('');

  const [newWlink, setnewWlink] = useState('');

//   const [modalVisible, setModalVisible] = useState(false);

//   const [modalMessage, setModalMessage] = useState('');

 

  useEffect(() => {

    AsyncStorage.multiGet(['token', 'role', 'eid'])

      .then(values => {

        const [[tokenKey, token], [roleKey, role], [eidKey, eid]] = values;

        if (token) {

            setToken(token);

          // Fetch user profile data using the token

          axios.get(`https://social.intreax.com/App/profile?eid=${eid}`, {

            headers: {

              Authorization: `Bearer ${token}`,

            },

          })

          .then(response => {

            setWlink(response.data.emp_profile[0].whatsApp);

          })

          .catch(error => {

            console.error('Error fetching profile:', error);

          });

        }

      })

      .catch(error => {

        console.error('Error getting values:', error);

      });

  }, []);

 

//   const fetchProfileData = (token) => {

//     // Fetch the user's profile data using the token

//     fetch('https://social.intreax.com/App/profile', {

//       headers: {

//         Authorization: `Bearer ${token}`,

//       },

//     })

//       .then((response) => response.json())

//       .then((data) => {

//         if (data && data.emp_profile && data.emp_profile.length > 0) {

//           setNickName(data.emp_profile[0].nick_Name);

//         }

//       })

//       .catch((error) => console.error(error));

//   };

 

  const updateWLink = () => {

    // Update the user's nickname using the newNickName state

    fetch('https://social.intreax.com/App/edit_profile', {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

        Authorization: `Bearer ${token}`,

      },

      body: JSON.stringify({

        whatsApp: newWlink,

      }),

    })

      .then((response) => response.json())

      .then((data) => {

        if (data.success) {

          // Update the local state with the new nickname

          //setNickName(newNickName);

          // Clear the input field

          setnewWlink('');

        }

      })

      .catch((error) => console.error(error));

    //      if (apiResponse.ok && responseData.message === 'Ok') {

    //     setModalMessage('Nickname changed successfully.');

    //     handleLogout(); // Call logout function after successful password change

    //   } else {

    //     setModalMessage('An error occurred while changing the Nickname. Please try again.');

    //   }

 

    //   setModalVisible(true);

  };

 

  return (

    <View style={styles.container}>

        <Text style={styles.title}>Change WhatsApp link</Text>

    <View>

      {/* <Text style={styles.input}> Current Nickname: {nickName}</Text> */}

      <TextInput

      style={styles.input}

        placeholder={` ${Wlink}`}

        value={newWlink}

        onChangeText={(text) => setnewWlink(text)}

      />

      <TouchableOpacity style={styles.button} onPress={updateWLink}>

        <Text style={styles.buttonText}>Update</Text>

      </TouchableOpacity>

      {/* <Modal

        visible={modalVisible}

        animationType="slide"

        transparent={true}

        onRequestClose={() => setModalVisible(false)}

      >

 

        <View style={styles.modalContainer}>

          <View style={styles.modalContent}>

            <Text style={styles.modalText}>{modalMessage}</Text>

            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>

              <Text style={styles.modalButtonText}>OK</Text>

            </TouchableOpacity>

          </View>

        </View>

 

      </Modal> */}

 

    </View>

    </View>

  );

};

 

 

const styles = StyleSheet.create({

    container: {

        flex: 1,

        justifyContent: 'center',

        alignItems: 'center',

        padding: 20,
        paddingTop:40,

      },

 

      title: {

        fontSize: 24,

        fontWeight: 'bold',

        marginBottom: 20,

      },

 

      input: {

        width: 200,

        height: 40,

        borderColor: 'gray',

        borderWidth: 1,

        borderRadius: 5,

        paddingHorizontal: 10,

        marginBottom: 20,

 

      },

 

      button: {

        backgroundColor: 'blue',

        paddingVertical: 10,

        paddingHorizontal: 20,

        borderRadius: 5,

 

      },

 

      buttonText: {

        color: 'white',

        fontSize: 16,

        textAlign: 'center',

 

      },

 

      modalContainer: {

        flex: 1,

        justifyContent: 'center',

        alignItems: 'center',

        backgroundColor: 'rgba(0, 0, 0, 0.5)',

 

      },

 

      modalContent: {

        backgroundColor: 'white',

        padding: 20,

        borderRadius: 10,

        alignItems: 'center',

 

      },

 

      modalText: {

        fontSize: 18,

        marginBottom: 20,

        textAlign: 'center',

 

      },

 

      modalButton: {

        backgroundColor: 'blue',

        paddingVertical: 10,

        paddingHorizontal: 20,

        borderRadius: 5,

 

      },

 

      modalButtonText: {

        color: 'white',

        fontSize: 16,

        textAlign: 'center',

 

      },

 

 

});

 

 

 

export default ChangeWLink;