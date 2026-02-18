import "./cardSection.css";
import { useEffect, useState } from "react";
import CheckCircle from "../utils/CheckCircle";
import EditIcon from "../utils/EditIcon";
import EditPopover from "../edit/EditPopover";

import { deleteTask, updateTask } from "../utils/taskOptionActions";
import useDragToScroll from "../../../hooks/useDragToScroll";

export default function CardSection({ tasks, setTasks }) {
  const { containerRef, isDragging } = useDragToScroll({
    axis: "y",
    longPressMs: 180,
  });
  const [hasScroll, setHasScroll] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);

  function getDropIndex(clientY) {
    const containerEl = containerRef.current;
    if (!containerEl) return 0;

    const taskElements = Array.from(
      containerEl.querySelectorAll(".task[data-task-id]"),
    );

    const filteredTaskElements = taskElements.filter((element) => {
      const taskId = element.getAttribute("data-task-id");
      return taskId !== draggedTaskId;
    });

    for (let index = 0; index < filteredTaskElements.length; index += 1) {
      const element = filteredTaskElements[index];
      const rect = element.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;

      if (clientY < midpoint) return index;
    }

    return filteredTaskElements.length;
  }

  function handleEdit(task, rect) {
    setActiveTask(task);
    setAnchorRect(rect);
  }

  function deleteActiveTask() {
    setTasks((prev) => deleteTask(prev, activeTask.id));
    setActiveTask(null);
  }

  function saveActiveTask(text) {
    setTasks((prev) => updateTask(prev, activeTask.id, text));
    setActiveTask(null);
  }

  function toggleTaskCompleted(taskId, nextChecked) {
    setTasks((prev) => updateTask(prev, taskId, { isCompleted: nextChecked }));
  }

  function handleTaskDragStart(event, taskId) {
    setDraggedTaskId(taskId);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleTaskDragOver(event) {
    if (!draggedTaskId) return;
    event.preventDefault();
    setDropIndex(getDropIndex(event.clientY));
  }

  function handleTaskDrop(event) {
    event.preventDefault();
    if (!draggedTaskId) return;

    const targetIndex = getDropIndex(event.clientY);

    setTasks((prevTasks) => {
      const fromIndex = prevTasks.findIndex((task) => task.id === draggedTaskId);
      if (fromIndex < 0) return prevTasks;

      const reorderedTasks = prevTasks.filter((task) => task.id !== draggedTaskId);
      const nextIndex = Math.max(
        0,
        Math.min(Number(targetIndex) || 0, reorderedTasks.length),
      );
      const [movingTask] = prevTasks.slice(fromIndex, fromIndex + 1);

      reorderedTasks.splice(nextIndex, 0, movingTask);
      return reorderedTasks;
    });

    setDraggedTaskId(null);
    setDropIndex(null);
  }

  function handleTaskDragLeave(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDropIndex(null);
    }
  }

  function handleTaskDragEnd() {
    setDraggedTaskId(null);
    setDropIndex(null);
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check if overflow
    const checkScroll = () => {
      setHasScroll(el.scrollHeight > el.clientHeight);
    };

    checkScroll();
    window.addEventListener("resize", checkScroll); // Recheck on resize

    return () => {
      window.removeEventListener("resize", checkScroll); // stop calling the function
    };
  }, [tasks, containerRef]);

  return (
    <div
      className={`card-section-container drag-scroll-zone ${hasScroll ? "has-scroll" : ""} ${isDragging ? "is-dragging" : ""}`}
      ref={containerRef}
      onDragOver={handleTaskDragOver}
      onDrop={handleTaskDrop}
      onDragLeave={handleTaskDragLeave}
    >
      {tasks.map((task, taskIndex) => (
        <div key={task.id}>
          {dropIndex === taskIndex && <div className="task-drop-indicator" />}
          <div
            className={`task ${draggedTaskId === task.id ? "dragging" : ""} ${task.isCompleted ? "completed" : ""}`}
            data-task-id={task.id}
            draggable
            onDragStart={(event) => handleTaskDragStart(event, task.id)}
            onDragEnd={handleTaskDragEnd}
          >
            <CheckCircle
              checked={Boolean(task.isCompleted)}
              onToggle={(nextChecked) =>
                toggleTaskCompleted(task.id, nextChecked)
              }
            />
            <span className="task-text">{task.text}</span>
            <span
              className="edit-icon-wrapper"
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                handleEdit(task, rect);
              }}
            >
              <EditIcon />
            </span>
          </div>
        </div>
      ))}

      {dropIndex === tasks.length && <div className="task-drop-indicator" />}

      {activeTask && anchorRect && (
        <EditPopover
          task={activeTask}
          // anchorRect={anchorRect}
          onClose={() => setActiveTask(null)}
          onSave={saveActiveTask}
          onDelete={deleteActiveTask}
        />
      )}
    </div>
  );
}
