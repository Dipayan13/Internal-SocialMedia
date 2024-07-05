import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import config from '../config';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
 
const AddUserScreen = () => {
 
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
 
    const [empEID, setEmpEID] = useState('');
    const [empName, setEmpName] = useState('');
    const [role, setRole] = useState('Admin');
    const [nickName, setNickName] = useState('Add Nick Name');
    const [whatsApp, setWhatsApp] = useState('Add Whatsap Link');
    const [linkedIn, setLinkedIn] = useState('Add LinkedIn Link');
    const [pMail, setPMail] = useState('Add Personal Mail');
    const [wMail, setWMail] = useState('Add Work Mail');
    const [password, setPassword] = useState('');
    const [eventstartDate, setEventstartDate] = useState('');
 
    const [eventendDate, setEventendDate] = useState('');
    const apiBaseUrl = config.API_BASE_URL;
    const [modalError, setModalError] = useState(false);
   
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState(null);
    const [imageSource, setImageSource] = useState(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
      };
 
 
    const formatDateSD = (date) => {
        var datee = date + "T00:00:00";
        console.log(datee);
        return datee;
    };
 
    const formatDateDOB = (date) => {
        var datee = `${date}T00:00:00`;
        return datee;
    };
 
    const setModalClear =()=>{
        console.log('going into the function');
        setModalError(false);
        setEmpEID('');
        setModalVisible(false);
        setEmpName('');
        setRole('Admin');
        setEventstartDate('');
        setEventendDate('');
        setNickName('');
        setWhatsApp('');
        setLinkedIn('');
        setPMail('');
        setWMail('');
        setPassword('');
        setImageSource(null); // Clear selected image
 
    };
   
 
    const handleAddUser = async () => {
        if (empEID == '' ||empName == '' ||role == ''||doj==''||dob==''||wMail==''||password==''){
                setError("Fields are empty");
                setModalError(true);
                return;
            }
       
        const token = await AsyncStorage.getItem('token');
        const eid = await AsyncStorage.getItem('eid');
        var doj = formatDateSD(eventstartDate);
        var dob = formatDateDOB(eventendDate);
        const formData = new FormData();
        formData.append('eid', empEID);
        formData.append('emp_Name', empName);
        formData.append('role', role);
        formData.append('doj', doj);
        formData.append('dob', dob);
        formData.append('nick_Name', nickName);
        formData.append('whatsApp', whatsApp);
        formData.append('linkedIn', linkedIn);
        formData.append('pMail', pMail);
        formData.append('wMail', wMail);
        formData.append('password', password);
 
        if (imageSource) {
            // You can add image handling here
            console.log(imageSource);
            formData.append('image', imageSource); // Modify this line for image upload
 
        }
        try {
            console.log(formData);
            console.log("hello");
            console.log(eventstartDate);
            console.log("hii");
            console.log(empName);
            console.log("bye");
            const response = await fetch('https://social.intreax.com/App/register', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    //'Content-Type': 'application/json',
                },
                body: formData,
            });
 
            const data = await response.json();
         
            if (response.ok) {
                // setModalClear;
                setEmpEID('');
                setModalVisible(true);
                setEmpName('');
                setRole('Admin');
                setEventstartDate('');
                setEventendDate('');
                setNickName('');
                setWhatsApp('');
                setLinkedIn('');
                setPMail('');
                setWMail('');
                setPassword('');
                setImageSource(null); // Clear selected image
                console.log("in if");
            } else {
                console.log("inin");
               
                if(response!=null){
                    setError(data[0].description);
                    setModalError(true);
                   
                }
 
            }
        }
        catch (error) {
 
           
            console.log("helllllllllll");
            console.log("An error occurred while adding the user.");
            console.log("Error namecatch:", error.name);
            console.log("Error messagecatch:", error.message);
            console.log("Error stackcatch:", error.stack);
            console.log("messsage is thiscatch",error.response);
           
           
 
        }
    };
 
 
 
    const handleImagePicker = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Request permission
            if (status !== 'granted') {
                console.log('Permission to access media library denied');
                return;
            }
 
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                base64: true,
            });
 
            if (!result.canceled) {
                const temporaryUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
 
                // Write the image data to a temporary file
                await FileSystem.writeAsStringAsync(temporaryUri, result.base64, {
                    encoding: FileSystem.EncodingType.Base64,
                });
 
                // Create an IFormFile object
                const imageFile = {
                    uri: temporaryUri,
                    name: 'image.jpg', // You can specify a custom file name here
                    type: 'image/jpeg', // You may need to adjust the MIME type based on your needs
                };
 
                // Now you can use `imageFile` as an IFormFile and send it to your API
                // Send the `imageFile` to your API using an HTTP request, e.g., a POST request
                // Example: const formData = new FormData();
                // formData.append('file', imageFile);
                // axios.post('your-api-endpoint', formData);
 
                setImageSource(imageFile); // Set the image source for display if needed
                console.log(imageSource);
            }
        } catch (error) {
            console.error('ImagePicker Error: ', error);
        }
    };
 
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need media library permissions to make this work.');
            }
        })();
    }, []);
 
    // useEffect(() => {
    //     setError(error);
    // }, [empName, role, eventendDate.eventstartDate, nickName, whatsApp, linkedIn, pMail, wMail, password]);
 
 
 
    return (
        <ScrollView style={{ backgroundColor: 'white', padding: 20 }}>
            <View style={styles.container}>
                <Text style={styles.addUserLabel}>Add User</Text>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Employee Eid:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter employee Eid"
                        value={empEID}
                        onChangeText={setEmpEID}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Employee Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter employee name"
                        value={empName}
                        onChangeText={setEmpName}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Role:</Text>
                    <Picker
                        selectedValue={role}
                        onValueChange={(itemValue) => setRole(itemValue)}
                        style={styles.input}
                    >
                        <Picker.Item label="Admin" value="Admin" />
                        <Picker.Item label="User" value="User" />
                        <Picker.Item label="Executive" value="Executive" />
                    </Picker>
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Date of Joining:</Text>
                    <TextInput
 
                        value={eventstartDate.toString()}
                        onChangeText={(text) => setEventstartDate(text)}
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                    />
                </View>
 
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Date of Birth:</Text>
                    <TextInput
                        value={eventendDate.toString()}
                        onChangeText={(text) => setEventendDate(text)}
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                    />
                </View>
 
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Nick Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter nick name (optional)"
                        value={nickName}
                        onChangeText={setNickName}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>WhatsApp:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter WhatsApp (optional)"
                        value={whatsApp}
                        onChangeText={setWhatsApp}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>LinkedIn:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter LinkedIn (optional)"
                        value={linkedIn}
                        onChangeText={setLinkedIn}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Personal Email:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter personal email (optional)"
                        value={pMail}
                        onChangeText={setPMail}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Work Email:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter work email (optional)"
                        value={wMail}
                        onChangeText={setWMail}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Password:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter password"
                        secureTextEntry={!isPasswordVisible}
                        value={password}
                        onChangeText={setPassword}
                   
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeButton}>
                        <Ionicons
                        name={isPasswordVisible ? 'eye-off' : 'eye'}
                        size={18}
                        color="black"
                    />
                 </TouchableOpacity>
       
                </View>
               
                <TouchableOpacity style={styles.addButton} onPress={handleImagePicker}>
                    <Text style={styles.addimageButtonText}>ADD IMAGE</Text>
                </TouchableOpacity>
                <View>
                    {imageSource && (
                        <Image
                            source={imageSource}
                            style={{ width: 100, height: 100, resizeMode: 'cover' }}
                        />
                    )}
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
                    <Text style={styles.addButtonText}>ADD USER</Text>
                </TouchableOpacity>
                <Modal visible={modalError} animationType="slide" transparent={false}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}> {error}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalClear() }
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
               
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>User Added Successfully!</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                {/* {error && <Text style={styles.errorText}>{error}</Text>} */}
            </View>
        </ScrollView>
    );
};
 
const styles = StyleSheet.create({
    container: {
        alignItems: 'left',
        // paddingBottom: 20,
        padding: 15,
        paddingTop: 40,
    },
    addUserLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    fieldLabel: {
        width: 200,
        fontWeight: 'bold',
        marginRight: -80,
    },
    inputRow: {
        flex: 1,
        height: 40,
        paddingLeft: 0,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        // borderRadius:5,
    },
    input: {
        backgroundColor: 'lightblue',
        flex: 1,
        height: 40,
        minWidth: 185,
        //width:150,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    blueButton: {
        padding: 10,
        borderRadius: 20,
        padding: 10,
        marginTop: 15,
    },
   
    addButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius: 12,
        padding: 10,
        backgroundColor: '#228b22',
        marginTop: 15,
        color: 'white',
    },
    addimageButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius: 12,
        padding: 10,
        backgroundColor: 'blue',
        marginTop: 15,
        color: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
    },
    modalButton: {
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius: 12,
        padding: 8,
        minWidth: 80,
        backgroundColor: '#228b22',
        marginTop: 15,
        // modalButtonText:{
        //     color:'white',
        // },
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    eyeButton: {
        position: 'absolute',
        right: 10,
        padding: 10,
        top: '50%',
        transform: [{ translateY: -20 }],
    },
   
});
 
export default AddUserScreen;