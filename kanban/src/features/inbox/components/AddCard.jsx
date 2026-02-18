import { useState, useRef, useEffect } from "react";
import "./addCard.css";
import createCardObject from "../utils/createCardObject";

// onAdd is for putting that card to that container
export default function AddCard({ addTask }) {
  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState("");

  const idRef = useRef(null);

  const EMPTY_RECURRENCE = {
    type: "none",
    interval: 1,
    unit: "weeks",
    daysOfWeek: [],
  };

  if (idRef.current === null) {
    idRef.current = crypto.randomUUID();
  }

  const textareaRef = useRef(null);

  useEffect(() => {
    if (isAdding) {
      textareaRef.current?.focus();
    }
  }, [isAdding]);

  function handleSubmit() {
    const trimmed = text.trim();

    if (!trimmed) return;

    const card = createCardObject({
      id: idRef.current,
      text: trimmed,
      isCompleted: false,
      startDate: null,
      dueDate: null,
      recurrence: EMPTY_RECURRENCE,
    });
    addTask(card);
    setText("");
    setIsAdding(false);
    idRef.current = crypto.randomUUID();
  }

  function cancel() {
    setText("");
    setIsAdding(false);
  }

  return (
    <div className="add-card">
      {!isAdding ? (
        <input
          className="inputField"
          placeholder="Enter a title for this card..."
          onClick={() => setIsAdding(true)}
        ></input>
      ) : (
        <>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
              if (e.key === "Escape") cancel();
            }}
            placeholder="Enter a title for this card..."
          ></textarea>
          <div className="actions">
            <button
              className="add-button"
              onClick={handleSubmit}
              disabled={!text.trim()}
            >
              Add
            </button>
            <button className="cancel-button" onClick={cancel}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
