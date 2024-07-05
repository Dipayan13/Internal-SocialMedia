import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'; 
import config from '../config';


const PeopleScreen = () => {

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

    const [employeeData, setEmployeeData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchBarVisible, setSearchBarVisible] = useState(false);
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(''); 
    const apiBaseUrl = config.API_BASE_URL;
    const apiBaseUrlImage = config.API_BASE_URL_IMAGE;

    const toggleSearchBar = () => {
        setSearchBarVisible(!isSearchBarVisible);
    };

    const navigateToViewProfileScreen = (eid) => {
        navigation.navigate('view_profile', { eid: eid });
    };
    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
      };

    useEffect(() => {
        AsyncStorage.getItem('token')
            .then(token => {
                if (token) {
                    fetch(apiBaseUrl+'/get_employees', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        setEmployeeData(data);
                    })
                    .catch(error => {
                        console.error('Error fetching employee data:', error);
                    });
                }
            })
            .catch(error => {
                console.error('Error getting token:', error);
            });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>People</Text>
            <TouchableOpacity onPress={toggleSearchBar} style={styles.searchIcon}>
                <AntDesign name={isSearchBarVisible ? 'close' : 'search1'} size={24} color="black" />
            </TouchableOpacity>
            {isSearchBarVisible && (
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for users..."
                    onChangeText={text => setSearchQuery(text)}
                    value={searchQuery}
                    multiline={false}
                    numberOfLines={1}
                />
            )}
            <ScrollView>
                {employeeData
                    .filter(employee => {
                        return employee.emp_Name.toLowerCase().includes(searchQuery.toLowerCase());
                    })
                    .map((employee) => (
                        <View key={employee.eid} style={styles.feedItem}>
                            <View style={styles.feedHeader}>
                                <View style={styles.profilePictureContainer}>
                                    <TouchableOpacity
                                    onPress={() => openImageModal(apiBaseUrlImage+`/${employee.image}`)}
                                    >
                                    {employee.image ? (
                                        <Image
                                            source={{ uri: apiBaseUrlImage+`/${employee.image}` }}
                                            style={styles.profilePicture}
                                        />
                                    ) : (
                                        <Image
                                            source={require('../assets/user.png')}
                                            style={styles.profilePicture}
                                        />
                                    )}
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.employeeName}>{employee.emp_Name}</Text>
                                <TouchableOpacity
                                    style={styles.capsuleButton}
                                    onPress={() => navigateToViewProfileScreen(employee.eid)}
                                >
                                    <Text style={styles.capsuleButtonText}>View</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={styles.fullSizeImage}
                                />
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop:45,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    feedItem: {
        marginBottom: 20,
    },
    feedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 8,
    },
    profilePictureContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'gray',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    employeeName: {
        flex: 1,
        fontSize: 18,
        marginRight: 10,
    },
    capsuleButton: {
        padding: 1,
        backgroundColor: 'darkblue',
        borderRadius: 25,
        width: 80,
    },
    capsuleButtonText: {
        textAlign: 'center',
        color: 'white',
        padding: 10,
    },
    searchIcon: {
        position: 'absolute',
        paddingTop:45,
        right: 20,
    },
    searchInput: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 12,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    fullSizeImage: {
        width: 300, // Set according to your preference
        height: 300, // Set according to your preference
        borderRadius: 20,
    },
    closeButton: {
        // Style your close button
    },
    closeButtonText: {
        // Style your close button text
    }
});

export default PeopleScreen;
