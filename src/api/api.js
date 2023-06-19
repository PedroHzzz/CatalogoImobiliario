import { auth } from "../config/firebaseConfig";
import { db } from "../config/firebaseConfig";
import storage from "@react-native-firebase/storage";

async function signUpWithEmailAndPassword(email, senha, displayName) {
  try {
    const resultado = await auth.createUserWithEmailAndPassword(email, senha);
    await resultado.user.updateProfile({
      displayName: displayName,
    });
    console.log("O usuário criado foi: ", resultado.user);
    await insertUserInDb(
      resultado.user.uid,
      email,
      displayName,
      resultado.user.photoURL
    );
    return resultado;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function insertUserInDb(uid, email, displayName, photoURL) {
  const getUser = await db.collection("users").doc(uid).get();
  const user = getUser.data();

  try {
    const formattedEmail = email.toLowerCase().trim();

    await db.collection("users").doc(uid).set({
      uid: uid,
      email: formattedEmail,
      displayName: displayName,
      photoURL: photoURL,
    });
  } catch (error) {
    console.error(error);
  }
}

async function signInWithEmailAndPassword(email, senha) {
  try {
    const formattedEmail = email.toLowerCase().trim();

    const resultado = await auth.signInWithEmailAndPassword(
      formattedEmail,
      senha
    );

    console.log("O usuário logado foi: ", resultado.user);
    return resultado;
  } catch (error) {
    console.error(error);
    console.log("Ocorreu um erro ao logar o usuário");
    return null;
  }
}



async function addAnnouncement(userId, newAnnouncement) {
  try {
    const announcementRef = db
      .collection("announcements")
      .doc(userId)
      .collection("userAnnouncements")
      .doc();

    const newAnnouncementFirebase = {
      ...newAnnouncement,
      id: announcementRef.id,
      userId: userId,
      image: null,
    };

  
    await announcementRef.set(newAnnouncementFirebase);
  } catch (error) {
    console.error("Erro ao adicionar novo anúncio:", error);
  }
}

export {
  signUpWithEmailAndPassword,
  signInWithEmailAndPassword,
  addAnnouncement,
};
