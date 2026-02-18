import { useState, useEffect, useRef } from "react";
import "./add-list.css";
import createList from "../utils/createList";

export default function AddList({ addList }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const idRef = useRef(null);

  if (idRef.current === null) {
    idRef.current = crypto.randomUUID();
  }

  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  function cancel() {
    setTitle("");
    setIsAdding(false);
  }

  function handleSubmit() {
    const trimmed = title.trim();

    if (!trimmed) return;

    const list = createList({
      id: idRef.current,
      title: trimmed,
      color: null,
      isCollapsed: false,
      cards: [],
    });

    addList(list);
    setTitle("");
    setIsAdding(false);
    idRef.current = crypto.randomUUID();
  }

  return (
    <div>
      {!isAdding ? (
        <button
          className="add-list-add-button"
          onClick={() => setIsAdding(true)}
        >
          Add another list
        </button>
      ) : (
        <div className="input-field-container">
          <input
            ref={inputRef}
            className="input-list-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                cancel();
              } else if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="List title..."
          />

          <div className="actions">
            <button className="add-button" onClick={handleSubmit}>
              Add
            </button>
            <button className="cancel-button" onClick={cancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
