import React, { useState, useEffect, useRef } from 'react';
import {View, Text, TextInput, Button, StyleSheet, Modal, TouchableHighlight, Image,ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import config from '../config';
import { useNavigation } from '@react-navigation/native';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
// import HTMLView from "react-native-htmlview";
const AddNews = () => {
 
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
 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // Error modal
  const [successModalVisible, setSuccessModalVisible] = useState(false); // Success modal
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
 
  const max = 300;
 
  //const [selectedImage, setSelectedImage] = useState(null);
  const apiBaseUrl = config.API_BASE_URL;
  const [imageSource, setImageSource] = useState(null);
 
  const navigation = useNavigation();
 

 
  //const RichText = useRef(); //reference to the RichEditor component
  const [article, setArticle] = useState("");
  const [text, setText] = useState('');
  const [count, setCount] = useState(0);
  const [editorHeight, setEditorHeight] = useState(200); // Initial height
    const RichText = useRef(null);
    const onContentSizeChange = (contentSize) => {
      setEditorHeight(Math.max(200, contentSize.height)); // Adjust height based on content
      RichText.current?.scrollToBottom(); // Scroll to bottom
    };


 

  const handleChange = (description) => {
    // Remove HTML tags and &nbsp; entity
    const regex = /<\/?(div|b|br|i|s|u|strike)>|&nbsp;/g;
    const result = description.replace(regex, '');

    // Check the length after stripping HTML tags
    if (result.length > max) {
        // If the result exceeds max length, truncate it
        const truncatedResult = result.substring(0, max);
        setDescription(truncatedResult);
        setCount(max);
        setArticle(truncatedResult);

        // Update the RichText editor with the truncated content
        RichText.current?.setContentHTML(truncatedResult);
        RichText.current?.blurContentEditor();
    } else {
        // If within the character limit, update the state normally
        setDescription(description); // Keep original description with HTML tags
        setCount(result.length); // Set count based on text without HTML tags
        setArticle(result); // Set article with stripped HTML tags
    }

    // Uncomment the line below if you need to refocus the editor after changes
    // RichText.current?.focusContentEditor();
};

 
 
  // function editorInitializedCallback() {
  //   RichText.current?.registerToolbar(function (items) {
     
  //   });
  // }

 
  async function handleSubmit() {
      try {
        if (!title.trim()) {
          setErrorMessage('Title field cannot be empty');
          setModalVisible(true);
          return;
        }
 
        const token = await AsyncStorage.getItem('token');
        const eid = await AsyncStorage.getItem('eid');
 
        const formData = new FormData();
        formData.append('eid', eid);
        formData.append('title', title);
        formData.append('description', description);
        //console.log(description);
        formData.append('link', link);
 
        if (imageSource) {
          // You can add image handling here
          //console.log(imageSource);
          formData.append('image', imageSource); // Modify this line for image upload
        }
 
        if (token && eid) {
          const response = await fetch('https://social.intreax.com/App/add_news', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              //'Content-Type': 'application/json',
            },
            body: formData,
          });
 
          //console.log('Response:', response);
          if (response.ok) {
            setSuccessMessage('News added successfully');
            setSuccessModalVisible(true);
            setTitle('');
            setDescription('');
            setLink('');
 
            navigation.navigate('news');
            setCount(0);
 
          } else {
            console.error('Failed to add news');
            //console.error(await response.text());
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
 
  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Request permission
      if (status !== 'granted') {
        //console.log('Permission to access media library denied');
        return;
      }
 
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });
 
      if (!result.canceled) {
        const temporaryUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
 
        // Write the image data to a temporary file
        await FileSystem.writeAsStringAsync(temporaryUri, result.base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
 
        const imageFile = {
          uri: temporaryUri,
          name: 'image.jpg',
          type: 'image/jpeg', 
        };
       
        setImageSource(imageFile); // Set the image source for display if needed
        //console.log(imageSource);
      }
    } catch (error) {
      console.error('ImagePicker Error: ', error);
    }
  };
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need media library permissions to make this work.');
      }
    })();
  }, []);
 
  useEffect(() => {
    AsyncStorage.multiGet(['token', 'role', 'eid'])
      .then((values) => {
        const [[tokenKey, token], [roleKey, role], [eidKey, eid]] = values;
 
      
      })
      .catch((error) => {
        console.error('Error getting values:', error);
      });
  }, []);
 
  return (
    <ScrollView>
    <View style={styles.container}>
    {/* <View style={styles.container}> */}
      <Text style={styles.addUserLabel}>Add News</Text>
      <Text>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
 
        <Text>Description:</Text>
        <RichEditor
          disabled={false}
          ref={RichText}
          value={description}
          style={styles.rich}
          editorStyle={{contentCSSText: `
          display: flex; 
          flex-direction: column; 
          height: 200px; 
          position: absolute;
          borderRadius: 8,`,
            }    
          }   
          onChange={(text) => handleChange(text)}
          // editorInitializedCallback={editorInitializedCallback}
          // androidHardwareAccelartionDisabled={true}
          initialHeight={250}
          maxLength={max}
        />
      <View style={styles.counterContainer}>
          <Text style={styles.counterText}>{count} / {max}</Text>
          <RichToolbar
        style={[styles.richBar]}
        editor={RichText}
        disabled={false}
        iconTint={"#666666"}
        selectedIconTint={"black"}
        disabledIconTint={"#666666"}
       
        iconSize={15}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.setStrikethrough,
        ]}
      />
        </View>
   
 
      <Text>Link:</Text>
      <TextInput
        style={styles.input}
        value={link}
        onChangeText={(text) => setLink(text)}
      />
      <View style={styles.blueButton}>
        <Button
            title="Add Image"
            color="blue"
            onPress={handleImagePicker} />
      </View>
      <View>
      {imageSource && (
            <Image
              source={imageSource}
              style={{ width: 100, height: 100, resizeMode: 'cover' }}
            />
      )}
      </View>
      <View style={styles.greenButton}>
        <Button
          title="Submit"
          color="green"
          onPress={handleSubmit}        />
      </View>
      {/* Error Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <TouchableHighlight
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButton}>OK</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      {/* Success Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => {
          setSuccessModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{successMessage}</Text>
            <TouchableHighlight
              onPress={() => {
                setSuccessModalVisible(false);
              }}
            >
              <Text style={styles.modalButton}>OK</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingTop:45,
    // backgroundColor: 'transparent',
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
   
  },
  addUserLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },

  rich: {
    maxHeight: 200, 
    borderColor: 'black',
    borderWidth: 1,
  },

   
counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
 
  counterText: {
    fontSize: 12,
    color: 'black',
    right: 0,
   
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
  },
  modalButton: {
    fontSize: 16,
    color: 'blue',
  },
  blueButton: {
    backgroundColor: 'blue',
    color:'white',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 16,
    marginTop: 13,
  },

  greenButton: {
    backgroundColor: 'green',
    color:'white',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 16,
    marginTop: 13,
  },
 
  richBar: {
    height: 20,
    left: 10,
    width: 130,
    backgroundColor:'transparent',
  },
  text: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
export default AddNews;
