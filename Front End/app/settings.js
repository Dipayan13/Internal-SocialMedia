import React,{useEffect} from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const iconSize = 30;

const Settings = () => {
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

  const navigateToChangePassword = () => {
    navigation.navigate('change_pwd'); 
  };

  const navigateToChangeNickname = () => {
    navigation.navigate('change_nick');
  };

  const navigateToChangeWLink = () => {
    navigation.navigate('change_wlink');
  };

  const navigateToChangeLinkedIn = () => {
    navigation.navigate('change_linkedin');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <LineWithButton
        logo={require('../assets/padlock.png')}
        buttonText="Change Password"
        onPress={navigateToChangePassword}
      />
      <LineWithButton
        logo={require('../assets/user.png')}
        buttonText="Change Nickname"
        onPress={navigateToChangeNickname}
      />
      <LineWithButton
        logo={require('../assets/whatsapp.png')}
        buttonText="Change WhatsApp link"
        onPress={navigateToChangeWLink}
      />
      <LineWithButton
        logo={require('../assets/phone-call.png')}
        buttonText="Change Number"
      />
      <LineWithButton
        logo={require('../assets/teams.png')}
        buttonText="Change Teams"
      />
      <LineWithButton
        logo={require('../assets/linkedin.png')}
        buttonText="Change LinkedIn"
        onPress={navigateToChangeLinkedIn}
      />
    </View>
  );
};

const LineWithButton = ({ logo, buttonText, onPress }) => (
  <TouchableOpacity style={styles.lineContainer} onPress={onPress}>
    <Image source={logo} style={[styles.logo, { width: iconSize, height: iconSize }]} />
    <View style={styles.buttonContainer}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </View>
  </TouchableOpacity>
);

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
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    marginRight: 10,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Settings;
