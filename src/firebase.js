import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Firebase 구성 객체를 여기에 붙여넣습니다.
  apiKey: "AIzaSyDCwSeWvwIgmV8o-b1e0gtJIGdcnA3gHSM",
  authDomain: "norse-figure-394613.firebaseapp.com",
  projectId: "norse-figure-394613",
  storageBucket: "norse-figure-394613.appspot.com",
  messagingSenderId: "91661654122",
  appId: "1:91661654122:web:597349544d7ac511565213",
  measurementId: "G-2RCZK106KN"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, app as default };