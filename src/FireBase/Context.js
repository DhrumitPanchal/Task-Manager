import React, { useState, createContext, useEffect } from "react";
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

export default function Mycontext(props) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const auth = getAuth(app);
  const database = getDatabase(app);
  const navigator = useNavigate();
  const provider = new GoogleAuthProvider();

  // create New User ----------------
  const createUser = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const newUser = {
        uid: userCredential.user?.uid,
        email: email,
        username: name,
      };

      setUser(newUser);
      console.log("User Is : ", newUser);
      toast.success("User registered successfully");
      navigator("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // SignIn wite email and password ----------------
  const SignIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const loggedInUser = {
        uid: userCredential.user?.uid,
        email: email,
      };

      setUser(loggedInUser); // Set the user details in the state
      console.log("User Is : ", loggedInUser);
      console.log("hook is : ", user);
      toast.success("login Success");
      navigator("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const SignINWithGoogle = async () => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        const userCredential = GoogleAuthProvider.credentialFromResult(result);
        const loggedInUser = {
          uid: userCredential.user?.uid,
          email: userCredential.user?.email,
        };

        setUser({ ...loggedInUser });
        toast.success("login Success");
        navigator("/");
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  const AddTask = async ({ title, description, endingDate, status }) => {
    try {
      if (!user) {
        navigator("/login");
        return;
      }

      console.log("Adding task for userID:", user?.uid);
      const taskId = Date.now();

      const newTaskRef = ref(database, `tasks/${user?.uid}/${taskId}`);

      console.log("New task reference:", newTaskRef.toString());

      await set(newTaskRef, {
        title: title,
        description: description,
        endingDate: endingDate,
        status: status,
        taskID: taskId,
      });

      console.log("Task added:", { title, description, endingDate, status });

      setTasks([
        ...tasks,
        { title, description, endingDate, status, taskID: taskId },
      ]);

      toast.success("Task Added successfully");

      navigator("/");
    } catch (error) {
      const message = error.message;
      toast.error(message);
    }
  };

  const getTasks = async () => {
    try {
      if (!user) {
        navigator("/login");
      }
      const dbRef = ref(getDatabase(app));
      const snapshot = await get(child(dbRef, `tasks/${user?.uid}`));
      if (snapshot.exists()) {
        const data = snapshot.val();

        const arrayOfObjects = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        console.log(arrayOfObjects);

        if (arrayOfObjects) {
          console.log("Data : " + arguments);
          setTasks(arrayOfObjects);
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateTask = async (taskId, updatedTaskData) => {
    try {
      if (!user) {
        navigator("/login");
        return;
      }

      const taskRef = ref(database, `tasks/${user?.uid}/${taskId}`);

      await set(taskRef, updatedTaskData);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.taskID === taskId ? { ...task, ...updatedTaskData } : task
        )
      );

      toast.success("Task updated successfully");
      navigator("/");
    } catch (error) {
      console.error("Error updating task:", error);
      const message = error.message;
      toast.error(message);
    }
  };

  const getOneTask = async (taskId) => {
    try {
      if (!user) {
        navigator("/login");
        return null;
      }

      const taskRef = ref(database, `tasks/${user?.uid}/${taskId}`);

      const snapshot = await get(taskRef);

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching task:", error);
      return null;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user, // Pass the user object instead of userID
        createUser,
        SignIn,
        AddTask,
        getTasks,
        tasks,
        setTasks,
        updateTask,
        getOneTask,
        SignINWithGoogle,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
