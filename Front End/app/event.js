
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, AppState, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import config from '../config';


const EventScreen = () => {

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

  const [refreshing, setRefreshing] = useState(false);
  const [activePostIndex, setActivePostIndex] = useState(-1);
  const [events, setEvents] = useState([]);
  const [showAllEvents, setShowAllEvents] = useState(true);
  const [showAddButton, setShowAddButton] = useState(true); 
  const apiBaseUrl = config.API_BASE_URL;


  const navigation = useNavigation();

  const onRefresh = () => {
    setRefreshing(true);
    // Fetch data or perform any other actions needed on refresh
    fetchEventData().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    AsyncStorage.multiGet(['token', 'role', 'eid'])
      .then((values) => {
        const [[tokenKey, token], [roleKey, role], [eidKey, eid]] = values;

        if (token && eid) {

          if (role === 'User') {
            setShowAddButton(false); // Hide the button for users
          }
        }
      })
      .catch((error) => {
        console.error('Error getting values:', error);
      });
  }, []);


  const fetchAttendeesCount = async (eventId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch(
          apiBaseUrl+`/get_participants?event_id=${eventId}&status=Yes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Request Failed:', response.status, response.statusText);
          console.error('Error Details:', errorData);
          return 0; // Default to 0 attendees if the request fails
        } else {
          const data = await response.json();
          return data.message.length; // Return the number of attendees
        }
      } else {
        console.error('No token available.');
        return 0; // Default to 0 attendees if there is no token
      }
    } catch (error) {
      console.error('Error fetching attendee count:', error);
      return 0; // Default to 0 attendees in case of an error
    }
  };



const fetchEventData = async () => {
    try {
      const [[tokenKey, token], [eidKey, eid]] = await AsyncStorage.multiGet(['token', 'eid']);
      //console.log(eid);
      if (token && eid) {
        const response = await fetch(apiBaseUrl+`/get_events?eid=${eid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        //console.log(token);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Request Failed:', response.status, response.statusText);
          console.error('Error Details:', errorData);
          return;
        }

        const data = await response.json();

        if (data && data.list_of_events) {
          const eventsWithAttendeesCount = await Promise.all(
            data.list_of_events.map(async (event) => {
              const attendeesCount = await fetchAttendeesCount(event.id);
              return {
                ...event,
                isHost: event.host === eid,
                attendeesCount,
              };
            })
          );

          if (showAllEvents) {
            const sortedEvents = eventsWithAttendeesCount.sort(
              (a, b) => new Date(b.start_Date) - new Date(a.start_Date)
            );
            setEvents(sortedEvents);
          }
        } else {
          console.error('No token available.');
        }
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

  // Function to fetch data periodically
  const fetchDataPeriodically = async () => {
    fetchEventData(); // Fetch data immediately when the component mounts

    // Set up a setInterval to fetch data periodically
    const interval = setInterval(() => {
      fetchEventData();
      //console.log('Background refresh occurred.')
    }, 500); // Refresh every 60 seconds (adjust as needed)

    return () => {
      clearInterval(interval); // Clean up the interval when the component unmounts
    };
  };

  useEffect(() => {
    const unsubscribe = fetchDataPeriodically(); // Start periodic data fetching

    // Subscribe to app state changes to continue fetching data in the background
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        fetchDataPeriodically();
      }
    });

    // return () => {
    //   unsubscribe(); // Clean up when the component unmounts
    //   AppState.removeEventListener('change');
    // };
  }, [showAllEvents]);

  const navigateParticipantsScreen = (eventId) => {
    navigation.navigate('participants', { eventId: eventId });
    //console.log(eventId);
  };

  const toggleDropdown = (index) => {
    if (activePostIndex === index) {
      setActivePostIndex(-1);
    } else {
      setActivePostIndex(index);
    }
  };

  const updateStatus = async (eventId, status) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Updating status:', status, 'for event ID:', eventId); // Debugging
      if (token) {
        const response = await fetch(apiBaseUrl+`/update_status?status=${status}&event_id=${eventId}`, {
          method: 'GET', // Use GET for updating status (not recommended)
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Request Failed:', response.status, response.statusText);
          console.error('Error Details:', errorData);
        } else {
          console.log(`Status updated to "${status}" for event ID ${eventId}`);
        }
      } else {
        console.error('No token available.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [showAllEvents]);

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('add_event')}
          style={styles.addButton}
        >
          <Image source={require('../assets/plus_icon.png')} style={styles.plusIcon} />
        </TouchableOpacity>
      </View> */}
                  <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        {showAddButton && (
          <TouchableOpacity
            onPress={() => navigation.navigate('add_event')}
            style={styles.addButton}
          >
            <Image source={require('../assets/plus_icon.png')} style={styles.plusIcon} />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="gray"
            title="Refreshing..."
            titleColor="gray"
          />
        }
      >
        {events.map((event, index) => (
          <View key={index} style={styles.eventDetails}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDate}>
              Start Date: {new Date(event.start_Date).toLocaleString()}
            </Text>
            <Text style={styles.eventDate}>
              End Date: {new Date(event.end_Date).toLocaleString()}
            </Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
            <View style={styles.dateTimeParticipants}>
              <View style={styles.imageContainer}>
                <TouchableOpacity
                  onPress={() => navigateParticipantsScreen(event.id)}
                  style={styles.peopleButton}
                >
                  <View style={styles.userImagesContainer}>
                    <Image
                      source={require('../assets/profile_picture.jpg')}
                      style={styles.userImage}
                    />
                    <Image
                      source={require('../assets/profile_picture.jpg')}
                      style={styles.userImage}
                    />
                    <Image
                      source={require('../assets/profile_picture.jpg')}
                      style={styles.userImage}
                    />
                    <View style={styles.userImageOverlay}>
                      <Text style={styles.participantCountText}>
                        +{event.attendeesCount}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {event.isHost ? (
                  <TouchableOpacity style={styles.hostButton}>
                    <Text style={styles.participantCountText}>Host</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => toggleDropdown(index)}
                    style={styles.rsvpButton}
                  >
                    <Text style={styles.participantCountText}>RSVP</Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* ... (rest of your code) */}
            </View>
            {activePostIndex === index && (
              <View style={styles.rsvpToggleContent}>
                <TouchableOpacity
                  style={styles.rsvpActionButtonAccept}
                  onPress={() => {
                    updateStatus(event.id, 'Yes');
                    toggleDropdown(index);
                  }}
                >
                  <Text>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rsvpActionButtonReject}
                  onPress={() => {
                    updateStatus(event.id, 'No');
                    toggleDropdown(index);
                  }}
                >
                  <Text>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  eventDetails: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10  
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 16,
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 16,
  },
  addButton: {
    padding: 5,
  },
  plusIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: -10,
    borderWidth: 2,
    borderColor: 'white',
  },
  participantCountOverlay: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginLeft: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rsvpButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    maxWidth: 75,
    miHeight: 30,
    justifyContent: 'center',
  },
  peopleButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 25,
    maxWidth: 300,
    maxHeight: 30,
    marginLeft: 100,
    justifyContent: 'center',
  },
  hostButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    maxWidth: 75,
    minHeight: 30,
    justifyContent: 'center',
  },
  rsvpToggleContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  rsvpActionButtonAccept: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  rsvpActionButtonReject: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  dateTimeParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '2%', /* Responsive margin */
    marginLeft: 'auto', /* Align to right */
    marginRight: '5%', /* Responsive margin */
  },
  userImageOverlay: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginLeft: -5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantCountText: {
    color: 'white',
    fontSize: 12,
  },
  userImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    marginRight: 5,
  },
});

export default EventScreen;



 

