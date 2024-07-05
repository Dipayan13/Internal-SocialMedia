import React,{useEffect} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const About = () => {

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
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.paragraph}>
        India’s own & a truly global Comprehensive Risk Management Solution Company, pioneering the wave of Digital Transformation of Treasury, Risk & Trade Finance functions of the corporates globally.
      </Text>
      <Image source={require('../assets/IBSFINtech-logo.png')} style={styles.logo} />
      <Text style={styles.paragraph}>
        IBSFINtech is a “Make-In-India” company, established by Ex-Bankers, having rich experience in banking, finance and treasury. During their stint with the leading public sector bank in India, they identified a niche gap in the market and that led to the birth of the product. With their experience in both finance as well as technology, the company grew fast from providing treasury to the leading media house of the country in the year 2013 to today, having more than 50 marquee corporations of the country who have chosen our platform for leveraging the benefits of digitization of their corporate finance functions. We currently have 15+ implementations undergoing currently. IBSFINtech is at the forefront, leading the transformation of cash & liquidity, treasury, risk and trade finance function of the corporate, by leveraging the power of technology. It is evident that Digitization and Automation is going to be the only way forward for corporates to ensure better control, visibility and transparency of the exposure to various risks, including but not limited to, Compliance, Financial and Operational Risks.
      </Text>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop:40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 20,
    resizeMode: 'contain',
  },
});

export default About;
