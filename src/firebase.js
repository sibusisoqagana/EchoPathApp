import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAvdmsjeDhtkhneimCxkkCV3vYuGEleDxQ',
  authDomain: 'echopath-7a94b.firebaseapp.com',
  projectId: 'echopath-7a94b',
  storageBucket: 'echopath-7a94b.firebasestorage.app',
  messagingSenderId: '107056171665',
  appId: '1:107056171665:web:196de42e2d0128645b8d30',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
