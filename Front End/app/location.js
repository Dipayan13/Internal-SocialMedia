import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';


const LocationScreen = () => {

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

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://www.google.com/maps/dir/13.0000797,77.5734042/ibsfintech/@13.0028705,77.5683008,15z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3bae16347ebb4c09:0x50dd2048e2d256ef!2m2!1d77.5835429!2d13.006825?entry=ttu' }}
        style={styles.webView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:45,
  },
  webView: {
    flex: 1,
  },
});

export default LocationScreen;
