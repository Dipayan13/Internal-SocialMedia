import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthLoading = () => {
    const navigation = useNavigation();
    const [error, setError] = useState('');

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

    useEffect(() => {
        AsyncStorage.multiGet(['token', 'role', 'eid'])
          .then(values => {
            const [[, token]] = values;
            setTimeout(() => {
              if (token) {
                navigation.replace('Home');
              } else {
                navigation.replace('login');
              }
            }, 500); // delay navigation
          })
          .catch(error => {
            console.error('Error getting values:', error);
            setError('Oops! Something went wrong. Please try again later.');
          });
      }, []);

    return (
        <View>
            <ActivityIndicator />
            {error ? <Text>{error}</Text> : null}
        </View>
    );
};

export default AuthLoading;
