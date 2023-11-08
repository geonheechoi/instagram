import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Image } from 'react-native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';


// Your web app's Firebase configuration (you must replace this with your own config)
const firebaseConfig = {
  // ... your firebase config
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
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

export default function Save(props) {
  const [caption, setCaption] = useState("");
  const uploadImage = async () => {
    const uri = props.route.params.image;
    const childPath = `post/${auth.currentUser.uid}/${Math.random().toString(36)}`;
    const response = await fetch(uri);
    const blob = await response.blob();
  
    const storageRef = ref(storage, childPath);
  
    const task = uploadBytes(storageRef, blob);
  
    task.then((snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
      
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log('Download URL:', downloadURL);
        savePostData(downloadURL); // Call savePostData here with the download URL
      });
    }).catch((error) => {
      console.error(error);
    });
  };
  
  const savePostData = (downloadURL) => {
    // Ensure that 'navigation' is available in this context
    const postsRef = collection(firestore, 'posts');
    const userPostRef = doc(postsRef, auth.currentUser.uid);
    const userPostsCollectionRef = collection(firestore, `${userPostRef.path}/userPosts`);
  
    addDoc(userPostsCollectionRef, {
      downloadURL,
      caption,
      creation: serverTimestamp()
    })
    .then(() => {
      props.navigation.popToTop(); // Ensure 'navigation' is in scope and correctly passed to this function
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
  };
  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: props.route.params.image }} />
      <TextInput
        placeholder='Write a Caption . . .'
        onChangeText={setCaption}
      />
      <Button title="Save" onPress={uploadImage} />
    </View>
  );
}
