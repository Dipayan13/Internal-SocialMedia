import React, { useEffect } from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const SocialScreen = () => {

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

  useEffect(() => {
    // Open the LinkedIn URL in the device's default web browser
    Linking.openURL('https://in.linkedin.com/company/ibsfintech-india');
  }, []);

  return (
    <View style={styles.container}>
      <Text>Redirecting to LinkedIn...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SocialScreen;
