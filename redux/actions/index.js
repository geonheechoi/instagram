import { getFirestore, doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from '../constants/index';

// Fetch user details from Firestore
export function fetchUser() {
  return async (dispatch) => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
    if (user) {
      console.log('User retrieved', user);
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        dispatch({ type: USER_STATE_CHANGE, currentUser: docSnap.data() });
        console.log('Document data:', docSnap.data());
      } else {
        console.log('No such document!');
      }
    } else {
      console.log('No user logged in');
    }
  };
}

// Fetch user posts from Firestore
export function fetchUserPosts() {
    return async (dispatch) => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;
      if (user) {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('authorId', '==', user.uid), orderBy('creation', 'asc'));
        
        getDocs(q)
          .then((snapshot) => {
            let posts = snapshot.docs.map(doc => {
              const data = doc.data();
             
              return { id: doc.id, ...data }; // Construct a new object for each post
            });
            console.log(posts); // Log the array of post data
            
            // Dispatch the action with the user posts
            dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
          })
          .catch((error) => {
            console.error("Error getting documents: ", error);
          });
      } else {
        console.log('No user logged in');
      }
    };
  }
  
