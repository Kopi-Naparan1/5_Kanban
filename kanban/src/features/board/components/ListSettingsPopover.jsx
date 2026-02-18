import { useEffect, useMemo, useState } from "react";
import CloseButton from "../../buttons/CloseButton";
import "./list-settings-popover.css";

export default function ListSettingsPopover({
  list,
  renamingListId,
  listTitleDraft,
  setListTitleDraft,
  saveRenameList,
  cancelRenameList,
  handleRenameList,
  handleDeleteList,
  toggleListSettings,
  handleToggleListCollapsed,
  lists,
  moveList,
}) {
  const isInboxList = list.id === "inbox-list";
  const currentPosition = useMemo(
    () => lists.findIndex((item) => item.id === list.id),
    [lists, list.id],
  );
  const [targetPosition, setTargetPosition] = useState(currentPosition);
  const [movingListId, setMovingListId] = useState(null);

  useEffect(() => {
    setTargetPosition(currentPosition);
  }, [currentPosition, list.id]);

  function handleDeleteClick() {
    if (isInboxList) {
      window.alert("Inbox cannot be deleted. It will be collapsed instead.");
      handleToggleListCollapsed(list.id);
      toggleListSettings(list.id);
      return;
    }

    handleDeleteList(list.id);
  }

  function handleMoveToPosition() {
    moveList(list.id, targetPosition);
    setMovingListId(null);
    toggleListSettings(list.id);
  }

  function cancelMoveList() {
    setMovingListId(null);
    setTargetPosition(currentPosition);
  }

  return (
    <div className="list-settings-popover">
      <div className="list-settings-popover-header-wrapper">
        {renamingListId === list.id ? (
          <div className="rename-input-container">
            <input
              type="text"
              className="list-title-input"
              value={listTitleDraft}
              onChange={(e) => setListTitleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveRenameList(list);
                }
                if (e.key === "Escape") {
                  cancelRenameList(list);
                }
              }}
              onBlur={(e) => {
                const nextFocusedElement =
                  e.relatedTarget instanceof HTMLElement
                    ? e.relatedTarget
                    : null;
                const isRenameActionButton =
                  nextFocusedElement?.dataset?.renameAction === "true";

                if (!isRenameActionButton) {
                  saveRenameList(list);
                }
              }}
              autoFocus
            />
            <div className="rename-actions-wrapper">
              <button
                type="button"
                className="title-input-button save-button"
                data-rename-action="true"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => saveRenameList(list)}
              >
                Save
              </button>
              <button
                type="button"
                className="title-input-button cancel-button"
                data-rename-action="true"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => cancelRenameList(list)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <h2 className="list-title">{list.title}</h2>
        )}

        <button onClick={() => handleRenameList(list)}>Rename</button>
        <button onClick={handleDeleteClick}>Delete</button>
        {movingListId === list.id ? (
          <div className="move-list-position-container">
            <label htmlFor={`move-list-position-${list.id}`}>
              Move to position
            </label>
            <div className="move-list-position-controls">
              <select
                id={`move-list-position-${list.id}`}
                value={targetPosition}
                onChange={(event) => setTargetPosition(Number(event.target.value))}
              >
                {lists.map((item, index) => (
                  <option key={item.id} value={index}>
                    {index + 1}. {item.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="action-move-button"
                onClick={handleMoveToPosition}
                disabled={targetPosition === currentPosition}
              >
                Move
              </button>
              <button
                type="button"
                className="cancel-move-button"
                onClick={cancelMoveList}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setMovingListId(list.id)}>Move</button>
        )}
        <button
          onClick={() => {
            handleToggleListCollapsed(list.id);
            toggleListSettings(list.id);
          }}
        >
          {list.isCollapsed ? "Expand" : "Collapse"}
        </button>
        <CloseButton onClose={() => toggleListSettings(list.id)} />
      </div>
    </div>
  );
}
