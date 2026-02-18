import AddCard from "./components/AddCard";
import "./inbox.css";
import CardSection from "./tasks/CardSection";

import InboxIcon from "./utils/InboxIcon";

export default function Inbox({ tasks, setTasks }) {
  function handleAddTask(newTask) {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }
  return (
    <div className="inbox-container">
      <div className="header-container">
        <InboxIcon></InboxIcon>
        <h2>Inbox</h2>
      </div>

      <div className="task-container">
        <AddCard addTask={handleAddTask} />
        <CardSection tasks={tasks} setTasks={setTasks}></CardSection>
      </div>
    </div>
  );
}
