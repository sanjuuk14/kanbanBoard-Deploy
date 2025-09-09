import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteTaskById,
  deleteTaskOptimistic,
  editTask,
} from "../store/tasksSlice";

export default function TaskCard({ task, provided, isDragging }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleDelete = () => {
    dispatch(deleteTaskOptimistic(task._id));
    dispatch(deleteTaskById(task._id));
  };

  const handleEdit = () => {
    if (!isEditing) setIsEditing(true);
    else {
      dispatch(
        editTask({
          id: task._id,
          task: { title, description, status: task.status },
        })
      );
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`bg-white shadow p-2 mb-2 rounded transition-all duration-200
        ${isDragging ? "shadow-lg scale-105 bg-blue-50" : ""}`}
    >
      {isEditing ? (
        <>
          <input
            className="border p-1 w-full mb-1 text-sm md:text-base "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border p-1 w-full mb-1 text-sm md:text-base"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </>
      ) : (
        <>
          <p className="font-medium text-sm md:text-base capitalize  ">
            {task.title}
          </p>
          <p className="text-gray-600 text-xs md:text-sm">{task.description}</p>
        </>
      )}

      <div className="flex gap-2 mt-2 flex-wrap">
        <button
          onClick={handleEdit}
          className="text-sm md:text-base bg-yellow-500 text-white px-2 py-1 rounded"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
        <button
          onClick={handleDelete}
          className="text-sm md:text-base bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
