import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import config from '../config';


const MyProfile = () => {

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

  const apiBaseUrl = config.API_BASE_URL;
  const apiBaseUrlImage = config.API_BASE_URL_IMAGE;
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    AsyncStorage.multiGet(['token', 'role', 'eid'])
      .then(values => {
        const [[tokenKey, token], [roleKey, role], [eidKey, eid]] = values;
        if (token) {
          axios
            .get(apiBaseUrl+`/profile?eid=${eid}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then(response => {
              // Extract only the date portion from the full date-time string
              const birthday = response.data.emp_profile[0].dob.split('T')[0];
              const doj = response.data.emp_profile[0].doj.split('T')[0];

              // Update the state with the extracted date values
              setProfileData({
                ...response.data.emp_profile[0],
                dob: birthday,
                doj: doj,
              });
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

  return (
    <View style={styles.container}>
      <View style={styles.coverContainer}>
        <Image source={require('../assets/IBSFINtech-logo.png')} style={styles.coverImage} />
        <View style={styles.line} />
        {profileData.image ? (
          <Image
            source={{ uri: apiBaseUrlImage+`/${profileData.image}` }}
            style={styles.profileImage}
          />
        ) : (
          <Image source={require('../assets/profile_picture.jpg')} style={styles.profileImage} />
        )}
      </View>
      <View style={styles.alignContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>Name: {profileData.emp_Name}</Text>
          <Text style={styles.infoText}>Employee ID: {profileData.eid}</Text>
          <Text style={styles.infoText}>Birthday: {profileData.dob}</Text>
          <Text style={styles.infoText}>Date of Joining: {profileData.doj}</Text>
          <Text style={styles.infoText}>Nick Name: {profileData.nick_Name}</Text>
        </View>
      </View>
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
    borderWidth: 1,
    borderColor:'gray',
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
  alignContainer: {
    alignItems: 'center' ,
  },
  infoContainer: {
    paddingTop:16,
    marginTop: 18,
    alignItems: 'center' ,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'gray',
    marginBottom: 20,
  },
});

export default MyProfile;
