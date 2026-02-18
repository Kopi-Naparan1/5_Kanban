import "../buttons/css/add-card-button.css";

export default function AddCardButton({
  list,
  addingListId,
  setAddingListId,
  textByList,
  handleTextChange,
  handleAdd,
  cancel,
  textAreaRef,
}) {
  return (
    <div className="board-add-card-container">
      {addingListId !== list.id ? (
        <button
          className="add-card-button"
          onClick={() => {
            setAddingListId(list.id);
          }}
        >
          + Add Card
        </button>
      ) : (
        <div className="board-actions">
          <textarea
            ref={textAreaRef}
            value={textByList[list.id] ?? ""}
            onChange={(e) => handleTextChange(list.id, e.target.value)}
            placeholder="Enter a card title..."
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                cancel();
              } else if (e.key === "Enter") {
                handleAdd(list.id);
              }
            }}
          />
          <div className="add-cancel-buttons-container">
            <button
              className="board-add-button "
              onClick={() => handleAdd(list.id)}
              disabled={!textByList[list.id]?.trim()}
            >
              Add
            </button>
            <button className="board-cancel-button" onClick={cancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
