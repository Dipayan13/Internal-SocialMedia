import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './login';
import HomeScreen from './HomeScreen';
import EventScreen from './EventScreen'; // Import the missing screens here
import PeopleScreen from './PeopleScreen'; // Import the missing screens here
import NewsScreen from './NewsScreen'; // Import the missing screens here
import BirthdayScreen from './BirthdayScreen'; // Import the missing screens here
import UpcomingScreen from './UpcomingScreen'; // Import the missing screens here
import Sidebar from './Sidebar';
import ChangePassword from './ChangePassword'; // Import the ChangePassword screen
import ViewProfileScreen from './ViewProfileScreen'; 
import EditEmployeeScreen from './EditEmployeeScreen'; 
import AddUserScreen from './AddUserScreen'; 
import RemoveUserScreen from './RemoveUserScreen';
import ModifyScreen from './ModifyScreen';
import ParticipantScreen from './ParticipantScreen';
import ChatScreen from './ChatScreen';
import FullViewScreen from './FullViewScreen';


const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="login" component={Login} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Event" component={EventScreen} />
                <Stack.Screen name="People" component={PeopleScreen} />
                <Stack.Screen name="News" component={NewsScreen} />
                <Stack.Screen name="Birthday" component={BirthdayScreen} />
                <Stack.Screen name="Upcoming" component={UpcomingScreen} />
                <Stack.Screen name="Sidebar" component={Sidebar}/>
                <Stack.Screen name="change_pwd" component={ChangePassword} />
                <Stack.Screen name="add_user" component={AddUserScreen} />
                <Stack.Screen name="remove_user" component={RemoveUserScreen} />
                <Stack.Screen name="chat_screen" component={ChatScreen} />
                <Stack.Screen name="modify_user" component={ModifyScreen} />
                <Stack.Screen name="server_repo" component={ServerRepository} />


                <Stack.Screen
                        name="view_profile"
                        component={ViewProfileScreen}
                        options={({ route }) => ({ title: `view_profile: ${route.params.eid}` })}
                    />
                <Stack.Screen
                        name="edit_employee"
                        component={ViewProfileScreen}
                        options={({ route }) => ({ title: `edit_employee: ${route.params.eid}` })}
                    />
                <Stack.Screen
                name="participants"
                component={ParticipantScreen}
                options={({ route }) => ({ title: `participants: ${route.params.eid}` })}
                />
                <Stack.Screen
                name="full_view"
                component={FullViewScreen}
                options={({ route }) => ({ title: `full_view: ${route.params.formatFeedItemForFullView}` })}

                />
            </Stack.Navigator>
        </NavigationContainer>



    );
};

export default App;
