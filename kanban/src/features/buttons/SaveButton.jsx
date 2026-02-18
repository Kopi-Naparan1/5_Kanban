export default function SaveButton({
  text,
  task,
  startDate,
  dueDate,
  moveTargetListId,
  moveTargetIndex,
  recurrence,
  EMPTY_RECURRENCE,
  onSave,
}) {
  return (
    <button
      className="save"
      onClick={() => {
        const trimmedText = text.trim() === "" ? task.text : text.trim();

        onSave({
          ...task,
          text: trimmedText,
          startDate,
          dueDate,
          move: {
            listId: moveTargetListId,
            index: moveTargetIndex,
          },
          recurrence: {
            ...EMPTY_RECURRENCE,
            ...recurrence,
          },
        });
      }}
    >
      Save
    </button>
  );
}
