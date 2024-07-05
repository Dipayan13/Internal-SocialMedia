// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   Text,
//   TextInput,
//   Button,
//   Alert,
//   Modal,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AddEvent = () => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [participants, setParticipants] = useState([]);
//   const [selectedParticipants, setSelectedParticipants] = useState([]);
//   const [selectAll, setSelectAll] = useState(true);
//   const [token, setToken] = useState('');
//   const [eventstartDate, setEventstartDate] = useState(new Date());
//   const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//   const [eventendDate, setEventendDate] = useState(new Date());
//   const [showEndDatePicker, setShowEndDatePicker] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [isDropdownVisible, setIsDropdownVisible] = useState(false);
//   const [selectedParticipantsNames, setSelectedParticipantsNames] = useState([]);

//   const setSecondsToZero = (dateTimeString) => {
//     const date = new Date(dateTimeString);
//     date.setSeconds(0);
//     const isoString = formatDate(date);
//     return isoString;
//   };

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     return `${year}-${month}-${day}T${hours}:${minutes}:00.000`;
//   };

//   const handleStartDateChange = (event, selectedDate) => {
//     setShowStartDatePicker(false);
//     if (selectedDate) {
//       setEventstartDate(selectedDate);
//     }
//   };

//   useEffect(() => {
//     AsyncStorage.multiGet(['token', 'role', 'eid'])
//       .then((values) => {
//         const [[tokenKey, token], [roleKey, role], [eidKey, eid]] = values;

//         if (token && eid) {
//           console.log('Token:', token);
//           console.log('EID:', eid);
//           //fetchUserData(eid, token); // Fetch user data using the token and eid
//         }
//       })
//       .catch((error) => {
//         console.error('Error getting values:', error);
//       });
//   }, []);

//   const handleEndDateChange = (event, selectedDate) => {
//     setShowEndDatePicker(false);
//     if (selectedDate) {
//       setEventendDate(selectedDate);
//     }
//   };

//   const fetchEmployeeNames = async () => {
//     try {
//       const storedToken = await AsyncStorage.getItem('token');
//       setToken(storedToken);
//       const storedEid = await AsyncStorage.getItem('eid');
//       const currentUserEid = parseInt(storedEid, 10);

//       const response = await fetch('https://social.intreax.com/App/get_employees', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${storedToken}`,
//           'Content-Type': 'application/json',
//         },
//         timeout: 10000,
//       });

//       if (response.ok) {
//         const employeeData = await response.json();
//         const employeeNames = employeeData
//           .filter((employee) => employee.eid !== currentUserEid)
//           .map((employee) => ({
//             key: employee.eid,
//             label: employee.emp_Name,
//             // checked: true, // Commented out checkbox related code
//           }));

//         const initialSelectedParticipants = employeeNames.map((participant) => participant.key);

//         setParticipants(employeeNames);
//         setSelectedParticipants(initialSelectedParticipants);
//       } else {
//         console.error('Failed to fetch employee names. Response status:', response.status);
//       }
//     } catch (error) {
//       console.error('Error fetching employee names:', error);
//     }
//   };

//   const handleSelectAll = (value) => {
//     setSelectAll(value);
//     const updatedParticipants = participants.map((participant) => ({
//       ...participant,
//       // checked: value, // Commented out checkbox related code
//     }));
//     setParticipants(updatedParticipants);
//     const selectedIds = value ? participants.map((p) => p.key) : [];
//     setSelectedParticipants(selectedIds);
//     const selectedNames = value ? participants.map((p) => p.label) : [];
//     setSelectedParticipantsNames(selectedNames);
//   };

//   // Commented out checkbox related code
//   // const handleParticipantToggle = (participantKey) => {
//   //   const updatedParticipants = participants.map((participant) =>
//   //     participant.key === participantKey ? { ...participant, checked: !participant.checked } : participant
//   //   );

//   //   setParticipants(updatedParticipants);

//   //   const selectedIds = updatedParticipants
//   //     .filter((participant) => participant.checked)
//   //     .map((p) => p.key);
//   //   setSelectedParticipants(selectedIds);

//   //   setSelectAll(
//   //     updatedParticipants.every((participant) => participant.checked) &&
//   //     updatedParticipants.length > 0
//   //   );
//   // };

//   const handleAddEvent = async () => {
//     try {
//       const selectedEmployees = participants.filter((participant) =>
//         selectedParticipants.includes(participant.key)
//       );

//       const eventParticipantIds = selectedEmployees.map((employee) => employee.key.toString());
//       console.log('Eids Being Passed:', eventParticipantIds);

//       const eventData = {
//         title,
//         start_Date: setSecondsToZero(eventstartDate),
//         end_Date: setSecondsToZero(eventendDate),
//         description,
//         event_participants: eventParticipantIds,
//         event_participants_names: selectedParticipantsNames,
//       };

//       const response = await fetch('https://social.intreax.com/App/add_event', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(eventData),
//       });

//       if (response.ok) {
//         setShowSuccessModal(true);
//         clearForm();
//       } else {
//         console.error('Failed to add event');
//         console.log(response);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       Alert.alert('Error', 'An error occurred');
//     }
//   };

//   const clearForm = () => {
//     setTitle('');
//     setDescription('');
//     setSelectedParticipants([]);
//     setEventstartDate(new Date());
//     setEventendDate(new Date());
//   };

//   useEffect(() => {
//     fetchEmployeeNames();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <TextInput
//         label="Title"
//         placeholder="Enter title"
//         value={title}
//         onChangeText={setTitle}
//         style={[styles.input, { backgroundColor: 'lightgray' }]}
//         multiline
//       />

//       {/* Start Date */}
//       <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
//         <Text style={styles.label}>Start Date</Text>
//         <View style={styles.datePickerContainer}>
//           <Text>{eventstartDate.toLocaleDateString()}</Text>
//           <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
//             <Text>📅</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
//             <Text>🕒</Text>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//       {showStartDatePicker && (
//         <DateTimePicker
//           value={eventstartDate}
//           mode="datetime"
//           is24Hour={true}
//           display="default"
//           onChange={handleStartDateChange}
//         />
//       )}

//       {/* End Date */}
//       <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
//         <Text style={styles.label}>End Date</Text>
//         <View style={styles.datePickerContainer}>
//           <Text>{eventendDate.toLocaleDateString()}</Text>
//           <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
//             <Text>📅</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
//             <Text>🕒</Text>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//       {showEndDatePicker && (
//         <DateTimePicker
//           value={eventendDate}
//           mode="datetime"
//           is24Hour={true}
//           display="default"
//           onChange={handleEndDateChange}
//         />
//       )}

//       <TextInput
//         label="Description"
//         placeholder="Enter description"
//         value={description}
//         onChangeText={setDescription}
//         style={[styles.input, { backgroundColor: 'lightgray' }]}
//         multiline
//       />

//       {/* Commented out checkbox related code */}
//       {/* <Text>Select Participants:</Text>
//       <View style={styles.selectAllContainer}>
//         <CheckBox
//           label="Select All"
//           checked={selectAll}
//           onPress={() => handleSelectAll(!selectAll)}
//         />
//       </View>

//       <TouchableOpacity
//         onPress={() => setIsDropdownVisible(!isDropdownVisible)}
//         style={styles.dropdownButton}
//       >
//         <Text>Select Participants</Text>
//         <Text>{isDropdownVisible ? '▲' : '▼'}</Text>
//       </TouchableOpacity>

//       {isDropdownVisible && (
//         <ScrollView style={styles.dropdownList}>
//           {participants.map((participant) => (
//             <View key={participant.key} style={styles.participantContainer}>
//               <CheckBox
//                 label={participant.label}
//                 checked={participant.checked}
//                 onPress={() => handleParticipantToggle(participant.key)}
//               />
//               <Text>{participant.label}</Text>
//             </View>
//           ))}
//         </ScrollView>
//       )} */}

//       <View style={styles.buttonContainer}>
//         <Button title="Send for Approval" onPress={handleAddEvent} color="white" />
//       </View>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={showSuccessModal}
//         onRequestClose={() => {
//           setShowSuccessModal(false);
//         }}
//       >
//         <View style={styles.modalView}>
//           <Text>Event Successfully sent for approval</Text>
//           <Button
//             title="Close"
//             onPress={() => {
//               setShowSuccessModal(false);
//             }}
//           />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: 'white',
//     flex: 1, // Ensure the container takes the full available height
//   },

//   input: {
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 5,
//     padding: 10,
//     fontSize: 16,
//   },

//   datePickerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },

//   label: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//     fontSize: 16,
//   },

//   dateText: {
//     fontSize: 16,
//     marginRight: 10,
//   },

//   dateIcon: {
//     fontSize: 20,
//   },

//   buttonContainer: {
//     backgroundColor: 'green',
//     marginTop: 16,
//     borderRadius: 25,
//     overflow: 'hidden',
//     marginBottom: 16,
//   },

//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//     paddingVertical: 10,
//   },

//   modalView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },

//   successText: {
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: 'center',
//   },

//   closeButtonText: {
//     fontSize: 16,
//     color: 'green',
//     textAlign: 'center',
//     marginTop: 10,
//   },
// });


// export default AddEvent;



// //Android

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AddEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error, info) {
    console.error('Error caught by componentDidCatch:', error, info);
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;

    if (hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Oops! Something went wrong. Please try again.
          </Text>
        </View>
      );
    }

    return <AddEventContent />;
  }
}

const AddEventContent = () => {
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

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [token, setToken] = useState('');
  const [eventstartDate, setEventstartDate] = useState('');
  const [eventStartTimeHours, setEventStartTimeHours] = useState('');
  const [eventStartTimeMinutes, setEventStartTimeMinutes] = useState('');
  const [eventStartTimeAMPM, setEventStartTimeAMPM] = useState('AM');
  const [eventendDate, setEventendDate] = useState('');
  const [eventEndTimeHours, setEventEndTimeHours] = useState('');
  const [eventEndTimeMinutes, setEventEndTimeMinutes] = useState('');
  const [eventEndTimeAMPM, setEventEndTimeAMPM] = useState('AM');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const setSecondsToZero = (dateTimeString) => {
    const isoString = dateTimeString + "T00:00:00";
    return isoString;
  };

  const formatDate = (date, hours, minutes, ampm) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedHours = ampm === 'PM' ? Number(hours) + 12 : hours;
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}:00.000`;
  };

  const handleStartDateChange = (text) => {
    setEventstartDate(text);
  };

  const handleStartTimeHoursChange = (text) => {
    setEventStartTimeHours(text);
  };

  const handleStartTimeMinutesChange = (text) => {
    setEventStartTimeMinutes(text);
  };

  const handleStartTimeAMPMChange = (value) => {
    setEventStartTimeAMPM(value);
  };

  const handleEndDateChange = (text) => {
    setEventendDate(text);
  };

  const handleEndTimeHoursChange = (text) => {
    setEventEndTimeHours(text);
  };

  const handleEndTimeMinutesChange = (text) => {
    setEventEndTimeMinutes(text);
  };

  const handleEndTimeAMPMChange = (value) => {
    setEventEndTimeAMPM(value);
  };

  const fetchEmployeeNames = async () => {
    try {
      console.log('Fetching employee names...');
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
      const storedEid = await AsyncStorage.getItem('eid');
      const currentUserEid = parseInt(storedEid, 10);

      const response = await fetch('https://social.intreax.com/App/get_employees', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        console.log('Employee names fetched successfully.');
        const employeeData = await response.json();
        const employeeNames = employeeData
          .filter((employee) => employee.eid !== currentUserEid)
          .map((employee) => ({
            key: employee.eid,
            label: employee.emp_Name,
          }));

        const initialSelectedParticipants = employeeNames.map((participant) => participant.key);

        setParticipants(employeeNames);
        setSelectedParticipants(initialSelectedParticipants);
      } else {
        console.error('Failed to fetch employee names. Response status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching employee names:', error);
      setErrorMessage('Error fetching employee names. Please try again.');
      setErrorModalVisible(true);
    }
  };

  const handleSelectAll = (value) => {
    setSelectAll(value);
    const updatedParticipants = participants.map((participant) => ({
      ...participant,
    }));
    setParticipants(updatedParticipants);
    const selectedIds = value ? participants.map((p) => p.key) : [];
    setSelectedParticipants(selectedIds);
  };

  const handleAddEvent = async () => {
    try {
      console.log('Adding event...');
      const selectedEmployees = participants.filter((participant) =>
        selectedParticipants.includes(participant.key)
      );

      const eventParticipantIds = selectedEmployees.map((employee) => employee.key.toString());
      console.log('Eids Being Passed:', eventParticipantIds);

      const formattedStartDate = formatDate(
        new Date(eventstartDate),
        eventStartTimeHours,
        eventStartTimeMinutes,
        eventStartTimeAMPM
      );

      const formattedEndDate = formatDate(
        new Date(eventendDate),
        eventEndTimeHours,
        eventEndTimeMinutes,
        eventEndTimeAMPM
      );

      const eventData = {
        title,
        start_Date: formattedStartDate,
        end_Date: formattedEndDate,
        description,
        event_participants: eventParticipantIds,
      };

      console.log(JSON.stringify(eventData));

      const response = await fetch('https://social.intreax.com/App/add_event', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        console.log('Event added successfully.');
        setShowSuccessModal(true);
        clearForm();
      } else {
        console.error('Failed to add event');
        console.log('Response:', response);

        const responseData = await response.json();

        // Handle specific error messages or log them
        if (responseData.errors) {
          console.error('Validation errors:', responseData.errors);
          setErrorMessage('Validation errors occurred. Please check your input.');
          setErrorModalVisible(true);
        }
      }
    } catch (error) {
      console.error('Error in handleAddEvent:', error);
      // Handle other errors if necessary
      setErrorMessage('An unexpected error occurred. Please try again.');
      setErrorModalVisible(true);
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setSelectedParticipants([]);
    setEventstartDate('');
    setEventendDate('');
    setEventStartTimeHours('');
    setEventStartTimeMinutes('');
    setEventStartTimeAMPM('AM');
    setEventEndTimeHours('');
    setEventEndTimeMinutes('');
    setEventEndTimeAMPM('AM');
  };

  useEffect(() => {
    fetchEmployeeNames();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Event</Text>
      <TextInput
        label="Title"
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
        style={[styles.input, { backgroundColor: 'lightgray' }]}
        multiline
      />

      {/* Start Date */}
      <Text style={styles.label}>Start Date</Text>
      <TextInput
        value={eventstartDate.toString()}
        onChangeText={(text) => handleStartDateChange(text)}
        style={[styles.input, { backgroundColor: 'lightgray' }]}
        placeholder="YYYY-MM-DD"
      />

      {/* Start Time */}
      <Text style={styles.label}>Start Time</Text>
      <View style={styles.timeInputContainer}>
        <TextInput
          placeholder="HH"
          value={eventStartTimeHours.toString()}
          onChangeText={(text) => handleStartTimeHoursChange(text)}
          style={styles.timeInput}
        />
        <Text>:</Text>
        <TextInput
          placeholder="MM"
          value={eventStartTimeMinutes.toString()}
          onChangeText={(text) => handleStartTimeMinutesChange(text)}
          style={styles.timeInput}
        />
        <Picker
          selectedValue={eventStartTimeAMPM}
          onValueChange={(itemValue) => handleStartTimeAMPMChange(itemValue)}
          style={styles.ampmPicker}
        >
          <Picker.Item label="AM" value="AM" />
          <Picker.Item label="PM" value="PM" />
        </Picker>
      </View>

      {/* End Date */}
      <Text style={styles.label}>End Date</Text>
      <TextInput
        value={eventendDate.toString()}
        onChangeText={(text) => handleEndDateChange(text)}
        style={[styles.input, { backgroundColor: 'lightgray' }]}
        placeholder="YYYY-MM-DD"
      />

      {/* End Time */}
      <Text style={styles.label}>End Time</Text>
      <View style={styles.timeInputContainer}>
        <TextInput
          placeholder="HH"
          value={eventEndTimeHours.toString()}
          onChangeText={(text) => handleEndTimeHoursChange(text)}
          style={styles.timeInput}
        />
        <Text>:</Text>
        <TextInput
          placeholder="MM"
          value={eventEndTimeMinutes.toString()}
          onChangeText={(text) => handleEndTimeMinutesChange(text)}
          style={styles.timeInput}
        />
        <Picker
          selectedValue={eventEndTimeAMPM}
          onValueChange={(itemValue) => handleEndTimeAMPMChange(itemValue)}
          style={styles.ampmPicker}
        >
          <Picker.Item label="AM" value="AM" />
          <Picker.Item label="PM" value="PM" />
        </Picker>
      </View>

      <TextInput
        label="Description"
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
        style={[styles.description, { backgroundColor: 'lightgray' }]}
        multiline
      />

      <View style={styles.buttonContainer}>
        <Button title="Send for Approval" onPress={handleAddEvent} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => {
          setShowSuccessModal(false);
        }}
      >
        <View style={styles.modalView}>
          <Text>Event Successfully sent for approval</Text>
          <Button
            title="Close"
            onPress={() => {
              setShowSuccessModal(false);
            }}
          />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => {
          setErrorModalVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <Text>{errorMessage}</Text>
          <Button
            title="OK"
            onPress={() => {
              setErrorModalVisible(false);
              clearForm();
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
    paddingTop: 60,
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'yellow',
    width: '35%',
  },

  input: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },

  description: {
    height: 120,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },

  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },

  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  timeInput: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginRight: 5,
    flex: 1,


  },

  ampmPicker: {
    width: 50,
    height: 40,
    color: 'black',
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },

  buttonContainer: {
    backgroundColor: 'green',
    color: 'white',
    marginTop: 16,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 16,
  },

  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default AddEvent;
