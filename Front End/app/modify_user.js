import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import config from '../config';


const ModifyScreen = () => {

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
  const apiBaseUrl = config.API_BASE_URL;
  const apiBaseUrlImage = config.API_BASE_URL_IMAGE;

  const toggleSearchBar = () => {
    setSearchBarVisible(!isSearchBarVisible);
  };

  const navigateToEditEmployeeScreen = (eid) => {
    navigation.navigate('edit_employee', { eid: eid });
  };

  const filterEmployees = (employee) => {
    return searchQuery === '' || employee.emp_Name.toLowerCase().includes(searchQuery.toLowerCase());
  };

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then((token) => {
        if (token) {
          fetch(apiBaseUrl+'/get_employees', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              setEmployeeData(data);
            })
            .catch((error) => {
              console.error('Error fetching employee data:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error getting token:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>People</Text>
      <TouchableOpacity onPress={toggleSearchBar} style={styles.searchIcon}>
        <Image source={require('../assets/search.png')} style={styles.iconImage} />
      </TouchableOpacity>

      {isSearchBarVisible && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search employees..."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
      )}

      <ScrollView>
        {employeeData
          .filter(filterEmployees)
          .map((employee) => (
            <View key={employee.eid} style={styles.feedItem}>
              <View style={styles.feedHeader}>
                <View style={styles.profilePictureContainer}>
                  <Image
                    source={
                      employee.image
                        ? { uri: apiBaseUrlImage+`/${employee.image}` }
                        : require('../assets/user.png')
                    }
                    style={styles.profilePicture}
                  />
                </View>
                <Text style={styles.employeeName}>{employee.emp_Name}</Text>
                <TouchableOpacity
                  style={styles.capsuleButton}
                  onPress={() => navigateToEditEmployeeScreen(employee.eid)}
                >
                  <Text style={styles.capsuleButtonText}>EDIT</Text>
                </TouchableOpacity>
              </View>
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
    paddingTop:40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  iconImage: {
    width: 25,
    height: 25,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
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
});

export default ModifyScreen;
