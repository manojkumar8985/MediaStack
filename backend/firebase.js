const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyBd-Qx2NtwT4E3gTPO6G_gbolt6XCMAwT8",
  authDomain: "tapxtream-64eea.firebaseapp.com",
  projectId: "tapxtream-64eea",
  storageBucket: "tapxtream-64eea.appspot.com",
  messagingSenderId: "105148996870",
  appId: "1:105148996870:web:bbade8f2068685586e1287"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage };
