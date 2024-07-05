import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Sidebar = () => {
  const navigation = useNavigation();
  const [role, setRole] = useState('');

  useEffect(() => {
    // Retrieve the role from AsyncStorage
    AsyncStorage.getItem('role')
      .then((storedRole) => {
        if (storedRole) {
          setRole(storedRole);
        }
      })
      .catch((error) => {
        console.error('Error getting role:', error);
      });
  }, []);

  const navigateToProfile = () => {
    navigation.navigate('my_profile');
  };

  const navigateToLatest = () => {
    navigation.navigate('news', { showLatestToggle: true });
  };

  const navigateToUpcoming = () => {
    navigation.navigate('upcoming');
  };

  const navigateToEvents = () => {
    navigation.navigate('event');
  };

  const navigateToApprovals = () => {
    navigation.navigate('approvals');
  };

  const navigateToManageUsers = () => {
    navigation.navigate('manage_users');
  };

  const navigateToSettings = () => {
    navigation.navigate('settings');
  };

  const navigateToAbout = () => {
    navigation.navigate('about');
  };

  const navigateToSocialMedia = () => {
    navigation.navigate('social_media');
  };

  const navigateToLocation = () => {
    navigation.navigate('location');
  };

  const handleLogout = async () => {
    try {
      // Remove token, role, and eid from AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('role');
      await AsyncStorage.removeItem('eid');

      // Navigate to the index screen
      navigation.replace('index');

      // Prevent the user from navigating back to the home screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'index' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.option} onPress={navigateToProfile}>
        <Text style={styles.optionText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={navigateToLatest}>
        <Text style={styles.optionText}>Latest</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={navigateToUpcoming}>
        <Text style={styles.optionText}>Upcoming</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={navigateToEvents}>
        <Text style={styles.optionText}>Events</Text>
      </TouchableOpacity>

      {(role === 'Admin' || role === 'Executive') && (
        <TouchableOpacity style={styles.option} onPress={navigateToApprovals}>
          <Text style={styles.optionText}>Approvals</Text>
        </TouchableOpacity>
      )}

      {(role === 'Admin' || role === 'Executive') && (
        <TouchableOpacity style={styles.option} onPress={navigateToManageUsers}>
          <Text style={styles.optionText}>Manage Users</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.option} onPress={navigateToSettings}>
        <Text style={styles.optionText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={navigateToAbout}>
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={navigateToSocialMedia}>
        <Text style={styles.optionText}>Social Media</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={navigateToLocation}>
        <Text style={styles.optionText}>Location</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={handleLogout}>
        <Text style={styles.optionText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top:30,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  sidebarImage: {
    width: 25,
    height: 25,
    resizeMode: 'cover', // or 'contain' depending on your image aspect ratio
    marginBottom: 20,
    borderRadius: 50,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingLeft:10,
  },
  optionText: {
    fontSize: 18,
  },
});

export default Sidebar;
