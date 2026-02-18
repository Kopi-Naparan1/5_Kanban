export function createCard({
  id,
  title,
  done = false,
  startDate = null,
  dueDate = null,
  recurrence = {
    type: "none",
    interval: 1,
    unit: "weeks",
    daysOfWeek: [],
  },
}) {
  return {
    id,
    title,
    done,
    startDate,
    dueDate,
    recurrence,
  };
}
