import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDRQPei3RGJzv57-NX4vX3EF2DqPRDb_fw',
  authDomain: 'newsapp-90e9c.firebaseapp.com',
  projectId: 'newsapp-90e9c',
  storageBucket: 'newsapp-90e9c.appspot.com',
  messagingSenderId: '930574480336',
  appId: '1:930574480336:web:f24b294521f5041a57ffd5',
  measurementId: 'G-4Z0P07Q0BM',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
