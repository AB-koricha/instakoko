import firebase from "firebase"
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyDlOBMxT-5KQnRgmWA2KtxQFz0OoE8ohiI",
    authDomain: "kokoinsta-76856.firebaseapp.com",
    projectId: "kokoinsta-76856",
    storageBucket: "kokoinsta-76856.appspot.com",
    messagingSenderId: "247865370340",
    appId: "1:247865370340:web:f2e6ab9fd2ddbad33beef1",
    measurementId: "G-GETHZ7LG8X"
  })

  const db=firebaseApp.firestore()
  const auth=firebase.auth()
  const storage=firebase.storage()

  export {db,auth,storage};