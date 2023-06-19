import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAImaQpwgTdPaXdv7Si9hfGtn_nLNCtALU",
  authDomain: "project-78b01.firebaseapp.com",
  databaseURL: "https://project-78b01-default-rtdb.firebaseio.com",
  projectId: "project-78b01",
  storageBucket: "project-78b01.appspot.com",
  messagingSenderId: "840285442138",
  appId: "1:840285442138:web:ce03266c3c39d8719c8863",
}

const app = firebase.initializeApp(firebaseConfig)
const auth = app.auth()
const db = firebase.firestore()
const storage = firebase.storage()

export { firebase, auth, app, db, storage }
