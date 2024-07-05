import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import RenderHtml from 'react-native-render-html';
const UpcomingScreen = () => {
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
 
  const [feedData, setFeedData] = useState([]);
  const apiBaseUrl = config.API_BASE_URL;
 
  const handleLinkPress = (item) => {
    const url = item.news?.link;
 
    if (url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        const absoluteUrl = `http://${url}`;
        Linking.openURL(absoluteUrl)
          .then(() => console.log('URL opened successfully'))
          .catch((err) => console.error('An error occurred while opening the link: ', err));
      } else {
        Linking.openURL(url)
          .then(() => console.log('URL opened successfully'))
          .catch((err) => console.error('An error occurred while opening the link: ', err));
      }
    }
  };
  const handleFeedMessagePress = (item) => {
    if (item.events || item.news) {
      navigation.navigate('full_view', { item: formatFeedItemForFullView(item), id: item.id  });
     
    }
  };
 
  const formatFeedItemForFullView = (item) => {
    return item;
  };
 
  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(apiBaseUrl + '/dashboard_view?nos=20', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Fetched data:', data);
      setFeedData(data.list_of_latest);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const truncateDescription = (description, maxLength, style) => {
    if (!description) return ''; // Return empty string if description is null or undefined
    const words = description.split(' '); // Split description into words
    if (words.length <= maxLength) return description; // Return full description if it has less or equal words than maxLength
    return `${words.slice(0, maxLength).join(' ')}...`; // Join the first maxLength words and append "..." with the given style
  };
 
  const formatDate = (isoDate) => {
    let date = new Date(isoDate);
    const timeString = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(/\b(am|pm)\b/g, match => match.toUpperCase());
    const dateString = date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(',', ' -');
  
    return `Date: ${dateString}  Time: ${timeString}`;
  };
  const formatTime = (isoDate) => {
    let date = new Date(isoDate);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
 
  return (
    <ScrollView style={styles.feedSection}>
      <View style={styles.eventsHeader}>
        <Text style={styles.eventsHeaderText}>Events for you</Text>
      </View>
      {feedData.map((item, index) => (
        // <View style={styles.feedMessage} key={index}>
          <View key={index}>
          <TouchableOpacity
                      style={styles.feedMessage}
                      key={index}
                      onPress={() => handleFeedMessagePress(item)}
                    >
 
          <View style={styles.messageLeftColumn}>
            {item.birthdays && (
              <Image
                source={require('../assets/balloons.png')}
                style={styles.imagePlaceholder}
              />
            )}
            {item.events && (
              <Image
                source={require('../assets/conference.png')}
                style={styles.imagePlaceholder}
              />
            )}
            {!item.birthdays && !item.events && (
              <Image
                source={
                  item.news?.image
                    ? { uri: `https://social.intreax.com/${item.news.image}` }
                    : require('../assets/paper.webp')
                }
                style={styles.imagePlaceholder}
              />
            )}
          </View>
          <View style={styles.messageRightColumn}>
            {item.events && (
              <Text style={styles.feedMessageTextTime}>
                Date: {new Date(item.created).toLocaleDateString()}  Time: {formatTime(item.created)}
              </Text>
            )}
            {item.news && <Text style={styles.feedMessageTextTime}>{formatDate(item.news.p_Date)}</Text>}
            {item.birthdays && (
              <Text style={styles.feedMessageTextTime}>
                {new Date(item.birthdays.dob).toLocaleDateString()}
              </Text>
            )}
           <Text style={styles.feedMessageText}>
              {item.birthdays
                ? `${item.birthdays.emp_Name}'s Birthday Today`
                : item.news?.title || item.events?.title}
            </Text>
            {item.events && (
                      <Text style={styles.feedMessageDescription}>{truncateDescription(item.events.description, 10)}</Text>
                    )}
            <RenderHtml
                         source={{
                          html: `${truncateDescription(item.news?.description, 10) || '<p></p>'}`
                        }}
                        contentWidth={300} // Adjust content width as needed
                        containerStyle={styles.feedMessageDescription}
                      />
            {/* <Text style={styles.feedMessageDescription}>{truncateDescription(item.news?.description, 10)}</Text> */}
            {item.news?.link && (
              <TouchableOpacity onPress={() => handleLinkPress(item)}>
                <Text style={styles.feedMessageTextLink}>{item.news?.link}</Text>
              </TouchableOpacity>
            )}
          </View>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  feedSection: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  eventsHeader: {
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 15,
  },
  eventsHeaderText: {
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#F4CE05',
  },
  feedMessage: {
    flexDirection: 'row',
    backgroundColor: 'lightblue',
    padding: '2%',
    marginBottom: '2%',
    borderRadius: 5,
  },
  messageLeftColumn: {
    width: '30%',
    paddingRight: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  messageRightColumn: {
    width: '70%',
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  feedMessageText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,

  },
  feedMessageTextTime: {
    fontSize: 14,
    color: 'blue',
    //fontWeight: 'bold',

  },
  feedMessageTextLink: {
    fontSize: 12,
    color: 'purple',
  },
});
 
export default UpcomingScreen;
 