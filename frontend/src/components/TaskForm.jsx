import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTaskOptimistic, addNewTask } from "../store/tasksSlice";

export default function TaskForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tempId = Date.now().toString();
    const optimisticTask = {
      _id: tempId,
      tempId,
      title,
      description,
      status: "todo",
    };

    dispatch(addTaskOptimistic(optimisticTask));
    dispatch(addNewTask(optimisticTask));

    setTitle("");
    setDescription("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-2 p-4 bg-gray-200 rounded shadow w-full max-w-lg mx-auto"
    >
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded bg-white w-full text-sm md:text-base"
      />
      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border bg-white p-2 rounded w-full text-sm md:text-base"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm md:text-base "
      >
        Add Task
      </button>
    </form>
  );
}
