import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../FireBase/Context";
import { useNavigate, useParams } from "react-router-dom";
function Card() {
  const { AddTask, getOneTask, updateTask } = useContext(UserContext);
  const { ID } = useParams();

  const [todo, setTodo] = useState({
    title: "",
    description: "",
    endingDate: "",
    status: "Todo",
  });

  const navigator = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskData = await getOneTask(ID);
        if (taskData) {
          // Update the todo state with the fetched task data
          setTodo((prevTodo) => ({
            ...prevTodo,
            title: taskData.title,
            description: taskData.description,
            endingDate: taskData.endingDate,
            status: taskData.status,
            taskID: ID, // Set the taskID from the URL params
          }));
        } else {
          // Handle case where task data is not found
          console.log("Task not found");
        }
      } catch (error) {
        // Handle error if the task data cannot be fetched
        console.error("Error fetching task:", error);
      }
    };

    if (ID) {
      // Fetch task data only if ID is present in the URL
      fetchTask();
    }
  }, [ID, getOneTask]);

  const handleInput = (e) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  const hendleprogress = async () => {
    try {
      let updatedStatus = todo.status === "Todo" ? "InProgress" : "Done";
      const updatedTask = { ...todo, status: updatedStatus };
      await updateTask(todo.taskID, updatedTask);
      setTodo(updatedTask); // Update the local state after the API call is successful
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle error
    }
  };

  return (
    <div className="fixed flex justify-center items-center top-0 left-0 h-screen w-full bg-black/20">
      <div className="p-[2.4rem] max-sm:mx-[2rem] max-sm:p-[2rem] flex flex-col gap-[1rem]  w-[30rem] max-sm:w-full h-[22rem] rounded-[1.6rem] bg-[#fbfcfd]">
        <input
          name="title"
          onChange={(e) => handleInput(e)}
          value={todo.title}
          type="text"
          required
          className="px-[1rem] py-[.2rem] w-full rounded-[.4rem] border-[2px] font-medium text-[1.2rem] border-black/50 focus:border-[#6060e3] placeholder:text-black/60"
          placeholder="Title"
        />
        <textarea
          name="description"
          onChange={(e) => handleInput(e)}
          value={todo.description}
          rows={3}
          required
          type="text"
          className="px-[1rem] py-[.2rem] w-full rounded-[.4rem] border-[2px] font-normal text-[1.2rem] border-black/50 focus:border-[#6060e3] placeholder:text-black/70"
          placeholder="Description"
        />
        <input
          name="endingDate"
          onChange={(e) => handleInput(e)}
          value={todo.endingDate}
          required
          min="2024-01-24"
          type="date"
          className="px-[1rem] py-[.2rem]  w-full rounded-[.4rem] border-[2px] font-medium text-[1.2rem] border-black/50 focus:border-[#6060e3] placeholder:text-black/60"
        />

        <div className="flex justify-between mt-[1rem]">
          {ID && (
            <div
              onClick={() => updateTask(todo.taskID, todo)}
              className="cursor-pointer flex justify-center items-center h-[2.4rem] w-[8rem] max-sm:w-[6.6rem] rounded-[.8rem] text-[1.2rem] font-semibold  transition-colors duration-300 bg-blue-500/20 text-blue-700 hover:bg-[#6060e3] hover:text-white "
            >
              Update
            </div>
          )}

          <div
            onClick={() => (ID ? hendleprogress() : AddTask(todo))}
            className="cursor-pointer flex justify-center items-center h-[2.4rem] w-[8rem] max-sm:w-[6.6rem] rounded-[.8rem] text-[1.2rem] font-semibold  transition-colors duration-300 bg-green-500/20 text-green-700 hover:bg-green-400 hover:text-white "
          >
            {ID ? (todo.status === "Todo" ? "Progress" : "Done") : "Add"}
          </div>

          <div
            onClick={() => navigator("/")}
            className="cursor-pointer flex justify-center items-center h-[2.4rem] w-[8rem] max-sm:w-[6.6rem] rounded-[.8rem] text-[1.2rem] font-semibold  transition-colors duration-300 bg-red-500/20 text-red-700 hover:bg-red-500 hover:text-white "
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
