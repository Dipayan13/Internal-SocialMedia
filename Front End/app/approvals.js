import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';


const Approvals = () => {
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

  const [posts, setPosts] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const apiBaseUrl = config.API_BASE_URL;


  useEffect(() => {
    // Fetch user role from AsyncStorage
    AsyncStorage.getItem('role')
      .then((role) => {
        setUserRole(role || '');
      })
      .catch((error) => {
        console.error('Error getting user role:', error);
      });

    // Fetch token from AsyncStorage
    AsyncStorage.getItem('token')
      .then((token) => {
        if (token) {
          // Fetch posts from the API with the token
          fetch(apiBaseUrl+'/approvals?status=All', {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + token, // Pass the token in the Authorization header
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              const reversedPosts = data.message.reverse();
              setPosts(reversedPosts);
              // Initialize expandedRows with false for each post
              setExpandedRows(Array(reversedPosts.length).fill(false));
            })
            .catch((error) => {
              console.error('Error fetching posts:', error);
            });
        } else {
          console.error('Token not found in AsyncStorage');
        }
      })
      .catch((error) => {
        console.error('Error getting token:', error);
      });
  }, []);

  const toggleRow = (index) => {
    const newExpandedRows = [...expandedRows];
    newExpandedRows[index] = !newExpandedRows[index];
    setExpandedRows(newExpandedRows);
  };

  const handleApproval = (eventId, newStatus, index) => {
    // Fetch token from AsyncStorage
    AsyncStorage.getItem('token')
      .then((token) => {
        if (token) {
          fetch(apiBaseUrl+`/update_event_status?status=${newStatus}&event_id=${eventId}`, {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + token,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log('Event status updated:', data);
              const updatedPosts = [...posts];
              updatedPosts[index] = { ...updatedPosts[index], status: newStatus };
              setPosts(updatedPosts);
              toggleRow(index); // Toggle the row after updating status
            })
            .catch((error) => {
              console.error('Error updating event status:', error);
            });
        } else {
          console.error('Token not found in AsyncStorage');
        }
      })
      .catch((error) => {
        console.error('Error getting token:', error);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.headerTitle}>Approvals</Text>
        {posts.map((post, index) => (
          <View key={post.id} style={styles.postContainer}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.description}>{post.description}</Text>
            <TouchableOpacity
              onPress={() => toggleRow(index)}
            >
              <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Status: </Text>
                <View style={[
                  styles.status,
                  post.status === 'Approved' ? styles.statusApproved :
                  post.status === 'Rejected' ? styles.statusRejected :
                  styles.statusPending
                ]}>
                  <Text style={styles.statusText}>{post.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
            {userRole === 'Executive' && expandedRows[index] && post.status === 'Pending' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => handleApproval(post.id, 'Approved', index)}
                >
                  <Text>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleApproval(post.id, 'Rejected', index)}
                >
                  <Text>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop:40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  postContainer: {
    backgroundColor: 'lightblue',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  status: {
    borderRadius: 6,
    fontSize: 18,
    padding: 3,
    textAlign: 'center',
    alignItems: 'center', // Center the text vertically
  },
  statusText: {
    textAlign: 'center', // Center the text horizontally
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  approveButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    minWidth: 95,
    minHeight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    minWidth: 95,
    minHeight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusApproved: {
    backgroundColor: 'green',
  },
  statusRejected: {
    backgroundColor: 'red',
  },
  statusPending: {
    backgroundColor: 'gold',
  },
});

export default Approvals;