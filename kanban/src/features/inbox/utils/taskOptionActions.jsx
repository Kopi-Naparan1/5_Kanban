// taskOptionActions.jsx

export function deleteTask(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId);
}

export function updateTask(tasks, taskId, newTaskData) {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, ...newTaskData } : task,
  );
}
