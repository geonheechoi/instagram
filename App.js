import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';
const store =createStore(rootReducer, applyMiddleware(thunk));
// Firebase configuration
const firebaseConfig = {
  // ...your firebase config
  apiKey: "AIzaSyBfTsfC-hpoTqrdTLzC7T_oMxuJ1smBJn4",
  authDomain: "instagram-dev-28084.firebaseapp.com",
  projectId: "instagram-dev-28084",
  storageBucket: "instagram-dev-28084.appspot.com",
  messagingSenderId: "536686366160",
  appId: "1:536686366160:web:119dc60b11f2ddf9677dd5",
  measurementId: "G-6YTM7K5PFJ"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Auth

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({
          loaded: true,
          loggedIn: true
        });
      } else {
        this.setState({
          loaded: true,
          loggedIn: false
        });
      }
    });
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading...</Text>
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } 
      // If logged in, return a different navigation stack or component
      return (
        <Provider store={store}>
          <NavigationContainer>
           <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation} />
          </Stack.Navigator>
          </NavigationContainer>
        </Provider>
        
      )
    
  }
}
