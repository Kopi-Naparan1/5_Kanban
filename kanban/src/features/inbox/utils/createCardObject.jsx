export default function createCardObject({
  id,
  text,
  isCompleted = false,
  startDate = null,
  dueDate = null,
  recurrence = {},
}) {
  return {
    id,
    text,
    isCompleted,
    startDate,
    dueDate,
    recurrence: {
      type: recurrence.type ?? "none",
      interval: recurrence.interval ?? 1,
      unit: recurrence.unit ?? "weeks",
      daysOfWeek: recurrence.daysOfWeek ?? [],
    },
  };
}
