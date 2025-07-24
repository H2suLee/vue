import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyBUochlrZu3cwXnaW907_ZvHPPNQkCHUaE",
  authDomain: "toychat-1a2b7.firebaseapp.com",
  projectId: "toychat-1a2b7",
  storageBucket: "toychat-1a2b7.firebasestorage.app",
  messagingSenderId: "286624352269",
  appId: "1:286624352269:web:c05c71880d215786ea2d44",
  measurementId: "G-8LWB2ZRCW1",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };
