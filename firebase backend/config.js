
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyC1-0yfII8k2UW4lAeGXYJCuGF2kW42cC0",
    authDomain: "digital-dream-savers-project.firebaseapp.com",
    projectId: "digital-dream-savers-project",
    storageBucket: "digital-dream-savers-project.appspot.com",
    messagingSenderId: "280915461013",
    appId: "1:280915461013:web:c4a18993d877e935a92c9c",
    measurementId: "G-3DF6JLTZGJ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  
export { app, analytics };