import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';


const BirthdayScreen = () => {

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

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [showDropdown, setShowDropdown] = useState(false);
    const [birthdayData, setBirthdayData] = useState([]);
    const apiBaseUrl = config.API_BASE_URL;


    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const selectMonth = (month) => {
        setSelectedMonth(month);
        setShowDropdown(false);
    };

    const getMonthNames = () => {
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    };

    const getDayOfWeek = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayIndex = new Date(date).getDay();
        return days[dayIndex];
    };

    const fetchBirthdayData = async (month) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const response = await axios.get(apiBaseUrl+`/birthday?month=${month}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBirthdayData(response.data);
            }
        } catch (error) {
            console.error('Error fetching birthday data:', error);
        }
    };

    useEffect(() => {
        fetchBirthdayData(selectedMonth);
    }, [selectedMonth]);

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Birthdays</Text>

            <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filter by Month:</Text>
                <TouchableOpacity style={styles.filterDropdown} onPress={toggleDropdown}>
                    <Text>{getMonthNames()[selectedMonth - 1]}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>

                {!birthdayData || !Array.isArray(birthdayData) || birthdayData.length === 0 ? (
                    <Text>No birthdays to display for this month.</Text>
                ) : (
                    birthdayData.map((birthday, index) => (
                        <View key={index} style={styles.birthdayItem}>
                            <View style={styles.birthdayDetails}>
                                <View style={styles.birthdayDateContainer}>
                                    <Text style={styles.birthdayDateText}>{new Date(birthday.dob).getDate()}</Text>
                                    <Text style={styles.birthdayMonthText}>
                                        {getMonthNames()[new Date(birthday.dob).getMonth()]}
                                    </Text>
                                </View>
                                <View style={styles.birthdayNameContainer}>
                                    <Text style={styles.birthdayName}>{birthday.emp_Name}'s Birthday</Text>
                                </View>
                                <View style={styles.birthdayDayContainer}>
                                    <Text style={styles.birthdayDay}>
                                        {getDayOfWeek(new Date(birthday.dob))}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
            <Modal visible={showDropdown} transparent={true}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.overlay} onPress={toggleDropdown} />
                    <View style={styles.dropdown}>
                        {getMonthNames().map((month, index) => (
                            <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => selectMonth(index + 1)}>
                                <Text>{month}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop:40,
      },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
      },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    filterLabel: {
        fontSize: 18,
        marginRight: 10,
    },
    filterDropdown: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
    },
    birthdayDay: {
        fontSize: 16,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 0,
        paddingBottom: 0,
        color: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    dropdown: {
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: 'lightgray',
    },
    birthdayItem: {
        marginBottom: 20,
        borderRadius: 5,
        overflow: 'hidden',
    },
    birthdayDetails: {
        //maxWidth:340,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    birthdayDateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    birthdayMonthText: {
        fontSize: 14,
        color: 'white',
        marginTop: 3,
    },
    birthdayName: {
        fontSize: 18,
        marginLeft: 15,
    },
    birthdayContainerWrapper: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        marginBottom: 10, 
        height: 68,
      },
      
      birthdayDateContainer: {
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        width: 70,
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%', 
      },
      
      birthdayNameContainer: {
        backgroundColor: 'lightblue',
        paddingLeft: 5,
        paddingRight: 2,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5,
        flex: 1,
        maxWidth: '70%',
        height: '100%', 
      },
      
      birthdayDayContainer: {
        backgroundColor: 'lightblue',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5,
        minWidth: 60,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', 
      },
});

export default BirthdayScreen;
