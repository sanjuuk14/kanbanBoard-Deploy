import { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, moveTask, updateTaskStatus } from "../store/tasksSlice";
import TaskCard from "./TaskCard";

const statuses = ["todo", "inprogress", "done"];

export default function Board() {
  const dispatch = useDispatch();
  const { tasks = [], loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    // Optimistic update
    dispatch(moveTask({ id: draggableId, status: newStatus }));

    // API call
    dispatch(updateTaskStatus({ id: draggableId, status: newStatus }));
  };

  if (loading) return <p className="p-4">Loading tasks...</p>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {statuses.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-full md:w-1/3 bg-gray-100 p-4 rounded-md min-h-[400px]"
              >
                <h2 className="font-bold mb-2 capitalize">{status}</h2>

                {/* Ensure tasks is always an array */}
                {(Array.isArray(tasks) ? tasks : [])
                  .filter((t) => t.status === status)
                  .map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <TaskCard task={task} provided={provided} />
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
