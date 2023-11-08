import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';
import { initializeApp } from 'firebase/app'; // Import initializeApp
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Auth functions
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions

// Your Firebase configuration from your package.json or another config file
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
const auth = getAuth(app); // Get the auth instance
const db = getFirestore(app);

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      name: ''
    };
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp = () => {
    const { email, password, name } = this.state;
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Handle the success scenario
        const user = userCredential.user;
        // Use setDoc to add data to Firestore
        await setDoc(doc(getFirestore(), "users", user.uid), {
          name: name,
          email: email
        });
        console.log("User registered:", user.uid);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error signing up:", error);
      });
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="name"
          onChangeText={(name) => this.setState({ name })}
        />
        <TextInput
          placeholder="email"
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />
        <Button
          onPress={this.onSignUp}
          title="Sign Up"
        />
      </View>
    );
  }
}

export default Register;
