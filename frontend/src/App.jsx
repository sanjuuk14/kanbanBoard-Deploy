import Board from "./components/Board";
import TaskForm from "./components/TaskForm";

export default function App() {
  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold font-serif ">KANBAN BOARD</h1>
      <p className="text-sm font-extralight"> Developed by Sandeep Panwar</p>
      <TaskForm />
      <Board />
    </div>
  );
}
