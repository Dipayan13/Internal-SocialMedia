import React,{useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
//import axios from 'axios';

const ManageUsersScreen = () => {
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

    const navigateToServerScreen = () => {
        navigation.navigate('server_repo');
    };
    const navigateAddUserScreen = () => {
        navigation.navigate('add_user');
    };
    const navigateRemoveUserScreen = () => {
        navigation.navigate('remove_user');
    };
    const navigateModifyUserScreen = () => {
        navigation.navigate('modify_user');
    };
    

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.manageUsersLabel}>Manage Users</Text>

            {/* Add Buttons */}
            <View style={styles.buttonSection}>
                <TouchableOpacity style={styles.button} onPress={navigateAddUserScreen}>
                    <Image
                        source={require('../assets/plus.png')} // Replace with your image path
                        style={styles.buttonImage}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={navigateRemoveUserScreen}>
                    <Image
                        source={require('../assets/delete.png')} // Replace with your image path
                        style={styles.buttonImage}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.buttonSection}>
                <TouchableOpacity style={styles.button} onPress={navigateModifyUserScreen}>
                    <Image
                        source={require('../assets/edit.png')} // Replace with your image path
                        style={styles.buttonImage}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={navigateToServerScreen}>
                    <Image
                        source={require('../assets/settings-gears.png')} // Replace with your image path
                        style={styles.buttonImage}
                    />
                </TouchableOpacity>
            </View>

            {/* Add a Line */}
            <View style={styles.line} />

            {/* Add any additional content you want */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:40,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 20,
    },
    manageUsersLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },

    buttonSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        width: 150,
        height: 120,
        borderRadius: 8,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10, 
    },
    buttonImage: {
        width: '40%',
        height: '40%',
        resizeMode: 'contain',
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: 'gray',
        marginBottom: 20,
    },
});

export default ManageUsersScreen;
