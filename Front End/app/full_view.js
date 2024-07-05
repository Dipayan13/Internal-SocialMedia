import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Linking } from 'react-native'; // Import Linking
import { useRoute, useNavigation } from '@react-navigation/native';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHtml from 'react-native-render-html';
import axios from 'axios';

const FullViewScreen = () => {

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
  const navigation = useNavigation();
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPressed, setIsPressed] = useState(null);
  const item = route.params?.item;
  const id = route.params?.id;
  const apiBaseUrlImage = config.API_BASE_URL_IMAGE;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`https://social.intreax.com/App/News_reaction_list?news_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { liked, disliked } = response.data.message;
        setLikeCount(liked.length);
        setDislikeCount(disliked.length);

        const eid = await AsyncStorage.getItem('eid');
        if (liked.includes(parseInt(eid))) {
          setUserReaction('liked');
          setIsPressed('liked');
        } else if (disliked.includes(parseInt(eid))) {
          setUserReaction('disliked');
          setIsPressed('disliked');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching reaction data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  const handleReaction = async (reaction) => {
    try {
      // Optimistically update state based on user interaction
      let updatedLikeCount = likeCount;
      let updatedDislikeCount = dislikeCount;
      let updatedUserReaction = null;
  
      if (reaction === 'like') {
        updatedLikeCount += (userReaction === 'liked' ? -1 : 1);
        updatedDislikeCount += (userReaction === 'disliked' ? -1 : 0);
        updatedUserReaction = (userReaction === 'liked' ? null : 'liked');
      } else if (reaction === 'dislike') {
        updatedDislikeCount += (userReaction === 'disliked' ? -1 : 1);
        updatedLikeCount += (userReaction === 'liked' ? -1 : 0);
        updatedUserReaction = (userReaction === 'disliked' ? null : 'disliked');
      }
  
      setLikeCount(updatedLikeCount);
      setDislikeCount(updatedDislikeCount);
      setUserReaction(updatedUserReaction);
  
      // Send API request
      const token = await AsyncStorage.getItem('token');
      await axios.get(
        `https://social.intreax.com/App/react_to_news?news_id=${id}&reaction=${reaction === 'like' ? 'true' : 'false'}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Optionally, you can update the state again with the server response if needed
      // const response = await axios.get(...);
      // const { liked_count, disliked_count, already_liked, already_disliked } = response.data.message;
      // setLikeCount(liked_count);
      // setDislikeCount(disliked_count);
      // setUserReaction(already_liked ? 'liked' : already_disliked ? 'disliked' : null);
    } catch (error) {
      // Handle errors
      console.error('Error updating reaction:', error);
      // Revert state changes in case of error
      setLikeCount(prevLikeCount => prevLikeCount);
      setDislikeCount(prevDislikeCount => prevDislikeCount);
      setUserReaction(null);
    }
  };

  if (loading) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
  }

  if (!item) {
    return <View style={styles.errorContainer}><Text>Item not found</Text></View>;
  }

  
  const getSplData = (item) => {
    console.log(item)
    if('events' in item){
      if (item.events) {
        return {
          image: item.events.image,
          date: item.events.start_Date,
          title: item.events.title,
          description: item.events.description,
          link: null,
        };
      } else if (item.news) {
        console.log("News Link:", item.news.link); // Log the news link
  
        return {
          image: item.news.image,
          date: item.news.p_Date,
          title: item.news.title,
          description: item.news.description,
          link: item.news.link,
        };
      }
    }
    else if('e_Id' in item){
      if (item.e_Id) {
        return {
          image: item.image,
          date: item.p_Date,
          title: item.title,
          description: item.description,
          link: item.link,
        };
      }
    }
  };

  const formatDateAndTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
  };

  const itemData = getSplData(item);

  return (
    <ScrollView style={styles.container}>
      <Image source={itemData.image ? { uri: apiBaseUrlImage + `/${itemData.image}` } : (item.news ? require('../assets/paper.webp') : require('../assets/conference.png'))} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.dateText}>{formatDateAndTime(itemData.date)}</Text>
        <Text style={styles.title}>{itemData.title}</Text>
        <RenderHtml
          source={{ html: itemData.description }}
          contentWidth={300} // Adjust content width as needed
          containerStyle={styles.description}
        />
        {itemData.link && ( // Render link only if it exists
          <TouchableOpacity onPress={() => handleLinkPress(item)}>
            <Text style={styles.link}>{itemData.link}</Text>
          </TouchableOpacity>
        )}
        {(item && 'news' in item && item.news !== null) || (item && item.e_Id) ? (
          <View  style={styles.reactionContainer}>
            <TouchableOpacity onPress={() => handleReaction('like')} style={[styles.likeButton, userReaction === 'liked' && styles.likedButton]}>
              <Image source={require('../assets/like.png')} style={styles.likeImage} />
              <Text style={styles.reactionButtonText}>{likeCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReaction('dislike')} style={[styles.dislikeButton, userReaction === 'disliked' && styles.dislikedButton]}>
              <Image source={require('../assets/dislike.png')} style={styles.likeImage} />
              <Text style={styles.reactionButtonText}>{dislikeCount}</Text>
            </TouchableOpacity>
          </View>
          ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 45,
  },
  image: {
    width: Dimensions.get('window').width,
    height: 200,
    resizeMode: 'contain',
  },
  content: {
    padding: 10,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 22,
    marginBottom: 5,
  },
  reactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  likeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    flexDirection: 'row', // Ensure that the image and text are in a row
    alignItems: 'center', // Align items vertically in the center
  },
  likeImage: {
    width: 20, // Adjust the width of the image as needed
    height: 20, // Adjust the height of the image as needed
    resizeMode: 'contain', // Make sure the image fits inside the button
    marginRight: 5, // Add some space between the image and the text
  },
  dislikeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    flexDirection: 'row', // Ensure that the image and text are in a row
    alignItems: 'center', // Align items vertically in the center
  },
  reactionButtonText: {
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 10,
  },
  likedButton: {
    backgroundColor: 'green',
  },
  dislikedButton: {
    backgroundColor: 'red',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    fontSize: 14,
    color: 'purple',
    marginTop: 5,
  },
});

export default FullViewScreen;
