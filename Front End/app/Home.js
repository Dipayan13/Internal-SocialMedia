import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Linking, Alert, Modal,RefreshControl } from 'react-native';
import { useNavigation, useRoute  } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from './Sidebar';
import config from '../config';
import RenderHtml from 'react-native-render-html';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [feedData, setFeedData] = useState([]);
  const [error, setError] = useState(null);
  const [eventDescriptions, setEventDescriptions] = useState([]);
  const [loginSuccessModalVisible, setLoginSuccessModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false); 
  const [userImage, setUserImage] = useState(require('../assets/user.png')); 
  const apiBaseUrl = config.API_BASE_URL;
  const apiBaseUrlImage = config.API_BASE_URL_IMAGE;



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const showLoginSuccessModal = () => {
  //   setLoginSuccessModalVisible(true);
  //   setTimeout(() => {
  //     setLoginSuccessModalVisible(false);
  //   }, 3000);
  // };

  const handleLinkPress = (item) => {
    const url = item.news?.link;

    if (url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        const absoluteUrl = `http://${url}`;
        Linking.openURL(absoluteUrl)
          .then(() => console.log('URL opened successfully'))
          .catch((err) => {
            console.error('An error occurred while opening the link: ', err);
            setError('Oops! Something went wrong. Please try again later.');
          });
      } else {
        Linking.openURL(url)
          .then(() => console.log('URL opened successfully'))
          .catch((err) => {
            console.error('An error occurred while opening the link: ', err);
            setError('Oops! Something went wrong. Please try again later.');
          });
      }
    }
  };

  const navigateToEventScreen = () => {
    navigation.navigate('event');
  };

  const navigateToPeopleScreen = () => {
    navigation.navigate('people');
  };

  const navigateToNewsScreen = () => {
    navigation.navigate('news');
  };

  const navigateToBirthdayScreen = () => {
    navigation.navigate('birthday');
  };

  const navigateToUpcomingScreen = () => {
    navigation.navigate('upcoming');
  };
  const handleFeedMessagePress = (item) => {
    if (item.events || item.news) {
      navigation.navigate('full_view', { item: formatFeedItemForFullView(item), id: item.id });
    }
  };

  const formatFeedItemForFullView = (item) => {
    return item;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = `${date.getDate()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear()}`;
    
    // Convert hours to 12-hour format
    let hours = date.getHours() % 12;
    hours = hours === 0 ? 12 : hours; // Handle midnight (0 hours)
  
    // Get AM/PM designation
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  
    const formattedTime = `${hours.toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${ampm}`;
    
    return (
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateTextStyle}>Date: {formattedDate}</Text>
        <Text style={styles.timeTextStyle}> Time: {formattedTime}</Text>
      </View>
    );
  };


  useEffect(() => {
    // Disabling the header on mount
    navigation.setOptions({ headerShown: false });
  
    // Fetching user data and showing login success modal if the user has just logged in
    AsyncStorage.multiGet(['token', 'role', 'eid']).then(values => {
      const [[tokenKey, token], [roleKey, role], [eidKey, eid]] = values;
  
      if (token && eid) {
        fetchUserData(String(eid), token);
        if (route.params?.justLoggedIn) {
          setLoginSuccessModalVisible(true);
          const timer = setTimeout(() => {
            setLoginSuccessModalVisible(false);
          }, 2000);
  
          return () => clearTimeout(timer);
        }
      }
    }).catch(error => {
      console.error('Error getting values:', error);
      setError('Oops! Something went wrong. Please try again later.');
    });
  
    return () => {
      navigation.setOptions({ headerShown: true });
    };
  }, [navigation, route.params?.justLoggedIn]);
  

  const fetchUserData = (eid, token) => {
    eid = String(eid);
    fetch(apiBaseUrl+`/profile?eid=${eid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        return response.json();
      })
      .then(data => {
        const user = data.emp_profile[0];
        if (user && user.emp_Name) {
          setUserName(user.emp_Name);
        }
        if (user && user.image) {
          setUserImage({ uri: apiBaseUrlImage+`/${user.image}` });
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setError('Oops! Something went wrong. Please try again later.');
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(apiBaseUrl+'/dashboard_view?nos=20', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setFeedData(data.list_of_latest);
      if (Array.isArray(data.list_of_latest)) {
        const eventDescriptions = data.list_of_latest
          .filter((item) => item?.events !== null && item.events?.description !== null)
          .map((item) => truncateDescription(item.events.description, 10, styles.feedMessageDescription));

        setEventDescriptions(eventDescriptions);


      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Oops! Something went wrong. Please try again later.');
    } finally {
      setRefreshing(false); 
    }
  };

  const hasBirthdayPosts = () => {
    return Array.isArray(feedData) && feedData.some((item) => item?.birthdays !== null);
  };

  const truncateDescription = (description, maxLength) => {
    if (!description) return ''; // Return empty string if description is null or undefined
    const words = description.split(' '); // Split description into words
    if (words.length <= maxLength) return description; // Return full description if it has less or equal words than maxLength
    return `${words.slice(0, maxLength).join(' ')}...`; // Join the first maxLength words and append "..."
  };
  
  // useEffect(() => {
  //   if (hasBirthdayPosts()) {
  //     setShowConfetti(true);
  //   } else {
  //     setShowConfetti(false);
  //   }
  // }, [feedData]);

  useEffect(() => {
    const disableBackButton = () => {
      navigation.setOptions({
        headerLeft: () => null,
      });
    };

    disableBackButton();

    return () => {
      navigation.setOptions({
        headerLeft: undefined,
      });
    };
  }, [navigation]);

  useEffect(() => {
    fetchData();

    const refreshInterval = setInterval(() => {
      fetchData();
    }, 300);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
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
      {/* {showConfetti && (
        <ConfettiCannon
          count={300}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          fadeOut={true}
        />
      )} */}
      <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarButton}>
        <Image
          source={isSidebarOpen ? require('../assets/close.webp') : require('../assets/sidebar.webp')}
          style={isSidebarOpen ? styles.closeIcon : styles.sidebarImage}
        />
      </TouchableOpacity>

      {isSidebarOpen ? null : (
        <React.Fragment>
          <Modal
            animationType="fade"
            transparent={true}
            visible={loginSuccessModalVisible}
            onRequestClose={() => setLoginSuccessModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.alert}>
                <Text style={styles.alertText}>Login Successful</Text>
                <TouchableOpacity
                  style={styles.okButton}
                  onPress={() => setLoginSuccessModalVisible(false)}
                >
                  <Text style={styles.okButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.greetingSection}>
            <View><Image source={require('../assets/IBSFINtech-1024x226.png')} style={styles.logoImage} /></View>
            <View style={styles.profileContainer}>
              <Image source={userImage} style={styles.profileImage} />
              <Text style={styles.greetingText}>Hi, {userName}</Text>
            </View>
            <Text style={styles.loremIpsum}>
              Ranked globally as one of the Top 8 TMS and Top 10 Trade Finance Solution Providers, IBSFINtech is leading the Digital Transformation journey for Corporates.
            </Text>
          </View>

          <View style={styles.buttonSection}>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={navigateToEventScreen}>
                <Image
                  source={require('../assets/announcements.png')}
                  style={styles.buttonImage}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={navigateToPeopleScreen}>
                <Image
                  source={require('../assets/People.png')}
                  style={styles.buttonImage}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={navigateToNewsScreen}>
                <Image
                  source={require('../assets/News.png')}
                  style={styles.buttonImage}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={navigateToBirthdayScreen}>
                <Image
                  source={require('../assets/Calendar.png')}
                  style={styles.buttonImage}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.line} />
          </View>

          <ScrollView style={styles.feedSection}>
            <View style={styles.eventsHeader}>
              <Text style={styles.eventsHeaderText}>Events for you</Text>
              <TouchableOpacity style={styles.viewAllButton} onPress={navigateToUpcomingScreen}>
                <Text style={styles.viewAllButtonText}>View All</Text>
              </TouchableOpacity>
            </View>
            {error ? (
              <Text style={styles.errorMessage}>{error}</Text>
            ) : (
              feedData.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity 
                    style={styles.feedMessage} 
                    key={index} 
                    onPress={() => handleFeedMessagePress(item)}
                  >
                    <View style={styles.messageLeftColumn}>
                    {item.birthdays && (
                        <Image source={require('../assets/balloons.png')} style={styles.imagePlaceholder} />
                      )}
                      {item.events && (
                        <Image source={require('../assets/conference.png')} style={styles.imagePlaceholder} />
                      )}
                      {!item.birthdays && !item.events && (
                        <Image
                          source={
                            item.news?.image
                              ? { uri: apiBaseUrlImage+`/${item.news.image}` }
                              : require('../assets/paper.webp')
                          }
                          style={styles.imagePlaceholder}
                        />
                      )}
                    </View>
                    <View style={styles.messageRightColumn}>
                      {item.created && !item.news && !item.birthdays && (
                        <Text style={styles.feedMessageTextTime}>{formatDateTime(item.created)}</Text>
                      )}
                      {item.news && (
                        <Text style={styles.feedMessageTextTime}>{formatDateTime(item.news.p_Date)}</Text>
                      )}
                      {item.birthdays && !item.news && (
                        <Text style={styles.feedMessageTextTime}>
                          {formatDateTime(item.birthdays.dob)}
                        </Text>
                      )}
                      <Text style={styles.feedMessageTitle}>
                        {item.birthdays
                          ? <Text style={styles.feedMessageBirthday}>{item.birthdays.emp_Name}'s Birthday Today</Text>
                          : item.news?.title || item.events?.title
                        }
                      </Text>
                      {item.events && (
                        <Text style={styles.feedMessageDescription}>{truncateDescription(item.events.description, 10)}</Text>
                      )}
                      <RenderHtml
                          source={{
                            html: `${truncateDescription(item.news?.description, 10) || '<p></p>'}`
                          }}
                          contentWidth={300}
                          containerStyle={styles.feedMessageDescription}
                        />

                      <TouchableOpacity onPress={() => handleLinkPress(item)}>
                        <Text style={styles.feedMessageTextLink}>{item.news?.link}</Text>
                      </TouchableOpacity>
                      
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </React.Fragment>
      )}

      {isSidebarOpen && <Sidebar />}
    </ScrollView>
  );

  function onRefresh() {
    setRefreshing(true);
    fetchData();
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 40,
  },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loremIpsum: {
    fontSize: 16,
    marginLeft: 14,
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    width: 150,
    height: 120,
    borderRadius: 8,
    backgroundColor: 'lightgray',
  },
  feedSection: {
    flex: 1,
    padding: 20,
  },
  feedHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedMessageText:{
    color:'gray',
  },

  feedMessageTextTime: {
    fontSize: 12,
    color: 'blue',
    
  },
  feedMessageTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop:5,
  },
  feedMessageBirthday: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'midnightblue',
  },
  feedMessageDescription: {
    paddingTop:8,
    fontSize: 16,
    color: 'gray',
  },
  feedMessageTextLink: {
    fontSize: 14,
    color: 'purple',
  },
  messageLeftColumn: {
    width: '30%',
    paddingRight: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  messageRightColumn: {
    width: '70%',
    marginBottom: 'auto',
    marginTop: 'auto',
    textAlignVertical: 'center',
  },
  buttonSection: {
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  profileImage: {
    width: 26,
    height: 26,
    borderColor: 'black',
    borderWidth:1,
    borderRadius: 25,
    marginRight: 8,
  },
  
  buttonImage: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  container: {
    flex: 1,
  },
  greetingSection: {
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 14,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 15,
  },
  eventsHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomWidth: 2,  
    borderBottomColor: '#F4CE05', 
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'gray',
    marginBottom: 20,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#01DB17',
  },
  viewAllButtonText: {
    color: 'white',
  },
  sidebarButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  sidebarImage: {
    width: 25,
    height: 25,
    marginBottom: 10,
    marginLeft: 16,
  },
  closeIcon: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
    marginRight: 20,
    borderRadius: 50,
  },
  logoImage: {
    width: 146, 
    height: 30,
    alignSelf: 'center',
    marginBottom: 0,
    resizeMode: 'contain',
  },
  errorMessage: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  dateTextStyle: {
    color: 'black',
  },
  timeTextStyle: {
    color: 'black',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  feedMessage: {
    backgroundColor: 'lightblue',
    padding: '2%', /* Responsive padding */
    marginBottom: '2%', /* Responsive margin */
    borderRadius: 5,
    //maxWidth: '90%', /* Responsive max width */
    maxHeight: 130, /* Responsive max height */
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  alert: {
    width: 350, 
    height: 200, 
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  alertText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', 
  },
  okButton: {
    width: 80, 
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 8, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  okButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
});

export default HomeScreen;