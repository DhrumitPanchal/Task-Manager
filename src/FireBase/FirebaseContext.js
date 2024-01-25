import React, { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { app } from "./FireBaseConfig";
import { toast } from "react-hot-toast";
export const UserContext = createContext(null);

export default function FirebaseContext() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const auth = getAuth(app);
  const database = getDatabase(app);
  const navigator = useNavigate();
  const provider = new GoogleAuthProvider();

  // create user using email and password
  const createUser = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then((response) => {
        const ID = response.user.uid;
        setUserID(userID);
        console.log("ID Is : " + ID);
        console.log("Hook Is : " + userID);
        toast.success("login Success");
        navigator("/");
      });

      await set(ref(database, "users/" + user.uid), {
        username: name,
        email: email,
        uid: user.uid,
      });

      toast.success("User registered successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };
}
