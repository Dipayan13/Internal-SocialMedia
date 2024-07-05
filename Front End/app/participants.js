import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EventScreen from './event';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import config from '../config';


 

 

const Tab = createMaterialTopTabNavigator();
const ParticipantScreen = () => {

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

  const route = useRoute();
  const apiBaseUrl = config.API_BASE_URL;
  const eventId = route.params?.eventId;
  console.log("eventId",eventId);
  const [yesParticipants, setYesParticipants] = useState([]);
  const [noParticipants, setNoParticipants] = useState([]);
  const ParticipantList = ({ participants }) => {

      //console.log(participants.message);

      return (

        <FlatList

          data={participants.message}

          keyExtractor={(item) => item.id.toString()}

          renderItem={({ item }) => (

            <Text style={styles.participantItem}>{item.emp_Name}</Text>

          )}

        />

      );

    };

 

  useEffect(() => {

    fetchData('Yes');

    fetchData('No');

  }, [eventId]);

 

  const fetchData = async (status) => {

    try {

      const token = await AsyncStorage.getItem('token');

      if (token) {

      const responseYes = await fetch(apiBaseUrl+`/get_participants?event_id=${eventId}&status=Yes`, {

        headers: {

            Authorization: `Bearer ${token}`,

        },

        });

        const responseNo = await fetch(apiBaseUrl+`/get_participants?event_id=${eventId}&status=No`, {

        headers: {

            Authorization: `Bearer ${token}`,

        },

        });

    if (!responseYes.ok || !responseNo.ok) {

      console.error('API Request Failed:', response.status, response.statusText);

      return;

    }

 

 

      const dataYes = await responseYes.json();

      const dataNo = await responseNo.json();

        setYesParticipants(dataYes);

        setNoParticipants(dataNo);

 

    }

    } catch (error) {

      console.error('Error fetching participants:', error);

    }

  };

 

  return (

   

    <View style={styles.container}>

      <Tab.Navigator>

        <Tab.Screen name="Yes">

          {() => <ParticipantList participants={yesParticipants} />}

        </Tab.Screen>

        <Tab.Screen name="No">

          {() => <ParticipantList participants={noParticipants} />}

        </Tab.Screen>

      </Tab.Navigator>

    </View>

  );

};

const styles = StyleSheet.create({

    container: {

      flex: 1,
      paddingTop:45,

    },

    participantItem: {

      padding: 10,

      borderBottomWidth: 1,

      borderBottomColor: '#ccc',

    },

  });

 

 

export default ParticipantScreen;