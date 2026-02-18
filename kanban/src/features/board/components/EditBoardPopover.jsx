import { useCallback, useEffect, useRef, useState } from "react";
import "./editBoardPopover.css";

import FloatingError from "../../inbox/components/FloatingError";
import FloatingDatePicker from "../../inbox/edit/FloatingDatePicker";
import StartButton from "../../buttons/StartButton";
import RecurringPanel from "../panels/RecurringPanel";
import StartAndDuePanel from "../panels/StartAndDuePanel";
import MovePanel from "../panels/MovePanel";
import DueButton from "../../buttons/DueButton";
import RecurringButton from "../../buttons/RecurringButton";
import CloseButton from "../../buttons/CloseButton";
import SaveButton from "../../buttons/SaveButton";
import MoveCardButton from "../../buttons/MoveCardButton";

const EMPTY_RECURRENCE = {
  type: "none",
  interval: 1,
  unit: "weeks",
  daysOfWeek: [],
};

const WEEK_DAYS = [
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "T", value: 4 },
  { label: "F", value: 5 },
  { label: "S", value: 6 },
  { label: "S", value: 0 },
];

export default function EditBoardPopover({
  task,
  onClose,
  onSave,
  onDelete,
  lists,
  currentListId,
  currentCardIndex,
}) {
  const popoverRef = useRef(null);
  const textAreaRef = useRef(null);
  const startButtonRef = useRef(null);
  const dueButtonRef = useRef(null);
  const moveCardButtonRef = useRef(null);
  const recurringButtonRef = useRef(null);

  const [activePanel, setActivePanel] = useState(null);
  const [dateError, setDateError] = useState("");
  const [moveCardMenuOpen, setMoveCardMenuOpen] = useState(false);

  const [text, setText] = useState(task.text ?? "");
  const [startButtonEl, setStartButtonEl] = useState(null);
  const [dueButtonEl, setDueButtonEl] = useState(null);
  const [recurringButtonEl, setRecurringButtonEl] = useState(null);

  const [startDate, setStartDate] = useState(task.startDate || null);
  const [dueDate, setDueDate] = useState(task.dueDate || null);
  const [moveTargetListId, setMoveTargetListId] = useState(currentListId);
  const [moveTargetIndex, setMoveTargetIndex] = useState(currentCardIndex || 0);
  const [recurrence, setRecurrence] = useState(
    task.recurrence
      ? { ...EMPTY_RECURRENCE, ...task.recurrence }
      : EMPTY_RECURRENCE,
  );

  const getMaxPositions = useCallback(
    (listId) => {
      const selectedList = lists.find((list) => list.id === listId);
      if (!selectedList) return 1;
      if (listId === currentListId) return Math.max(1, selectedList.cards.length);
      return Math.max(1, selectedList.cards.length + 1);
    },
    [lists, currentListId],
  );

  useEffect(() => {
    if (!dateError) return;
    const timer = setTimeout(() => setDateError(""), 2000);
    return () => clearTimeout(timer);
  }, [dateError]);

  useEffect(() => {
    setMoveCardMenuOpen(activePanel === "move");
  }, [activePanel]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    setText(task.text ?? "");
    setStartDate(task.startDate || null);
    setDueDate(task.dueDate || null);
    setRecurrence(
      task.recurrence
        ? { ...EMPTY_RECURRENCE, ...task.recurrence }
        : EMPTY_RECURRENCE,
    );
    setActivePanel(null);
    setMoveCardMenuOpen(false);
    setDateError("");
    setMoveTargetListId(currentListId);
    setMoveTargetIndex(currentCardIndex || 0);
  }, [task, currentListId, currentCardIndex]);

  useEffect(() => {
    const maxPositions = getMaxPositions(moveTargetListId);
    const nextIndex = Math.min(
      Math.max(0, Number(moveTargetIndex) || 0),
      maxPositions - 1,
    );
    if (nextIndex !== moveTargetIndex) {
      setMoveTargetIndex(nextIndex);
    }
  }, [getMaxPositions, moveTargetListId, moveTargetIndex]);

  function handleMoveListChange(nextListId) {
    setMoveTargetListId(nextListId);
    setMoveTargetIndex(getMaxPositions(nextListId) - 1);
  }

  function handleChange(e) {
    setText(e.target.value);
  }

  function handleDueDateChange(nextDue) {
    setDueDate(nextDue);
    if (startDate && nextDue && new Date(startDate) > new Date(nextDue)) {
      setStartDate(nextDue);
    }
  }

  function handleStartDateChange(nextStart) {
    setStartDate(nextStart);
    if (dueDate && nextStart && new Date(dueDate) < new Date(nextStart)) {
      setDueDate(nextStart);
    }
  }

  function formatRecurrenceLabel(value) {
    if (!value || value.type === "none") return "Not recurring";
    if (value.type === "daily") return "Every day";

    if (value.type === "weekly") {
      if (!value.daysOfWeek?.length) return "Every week";
      const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const days = [...value.daysOfWeek]
        .sort((a, b) => a - b)
        .map((d) => map[d])
        .join(", ");
      return `Every week on ${days}`;
    }

    if (value.type === "monthly") return "Every month";
    if (value.type === "yearly") return "Every year";
    if (value.type === "weekdays") return "Weekdays";
    if (value.type === "custom") return `Every ${value.interval} ${value.unit}`;
    return "Recurring";
  }

  return (
    <div className="edit-overlay">
      <div ref={popoverRef} className="edit-popover">
        <textarea
          ref={textAreaRef}
          className="edit-input"
          value={text}
          onChange={handleChange}
          autoFocus
        />

        <div className="actions-container">
          <div className="is-save-container">
            <SaveButton
              text={text}
              task={task}
              startDate={startDate}
              dueDate={dueDate}
              moveTargetListId={moveTargetListId}
              moveTargetIndex={moveTargetIndex}
              recurrence={recurrence}
              EMPTY_RECURRENCE={EMPTY_RECURRENCE}
              onSave={onSave}
            />
            <CloseButton onClose={onClose}></CloseButton>
          </div>

          <div className="other-options">
            <MoveCardButton
              moveCardButtonRef={moveCardButtonRef}
              setActivePanel={setActivePanel}
              setMoveCardMenuOpen={setMoveCardMenuOpen}
              moveCardMenuOpen={moveCardMenuOpen}
            />

            <StartButton
              startButtonRef={startButtonRef}
              startDate={startDate}
              setStartDate={setStartDate}
              dueDate={dueDate}
              setDueDate={setDueDate}
              setActivePanel={setActivePanel}
              setStartButtonEl={setStartButtonEl}
            />
            {activePanel === "start" && (
              <StartAndDuePanel
                startButtonEl={startButtonEl}
                startDate={startDate}
                handleStartDateChange={handleStartDateChange}
                setActivePanel={setActivePanel}
              />
            )}

            <DueButton
              dueButtonRef={dueButtonRef}
              dueDate={dueDate}
              setDueDate={setDueDate}
              setActivePanel={setActivePanel}
              setDueButtonEl={setDueButtonEl}
            />

            {activePanel === "due" && (
              <FloatingDatePicker
                anchorEl={dueButtonEl}
                date={dueDate}
                onChange={handleDueDateChange}
                onClose={() => setActivePanel(null)}
                variant="due"
              />
            )}

            <RecurringButton
              recurringButtonRef={recurringButtonRef}
              dueDate={dueDate}
              setDateError={setDateError}
              setRecurringButtonEl={setRecurringButtonEl}
              setActivePanel={setActivePanel}
              recurrence={recurrence}
              setRecurrence={setRecurrence}
              formatRecurrenceLabel={formatRecurrenceLabel}
              EMPTY_RECURRENCE={EMPTY_RECURRENCE}
              WEEK_DAYS={WEEK_DAYS}
            />
            {dateError && (
              <FloatingError
                anchorEl={recurringButtonEl}
                message={dateError}
                onClose={() => setDateError("")}
              />
            )}

            <button onClick={onDelete}>Delete</button>
          </div>
        </div>

        {activePanel === "move" && (
          <MovePanel
            lists={lists}
            selectedListId={moveTargetListId}
            selectedIndex={moveTargetIndex}
            onListChange={handleMoveListChange}
            onIndexChange={setMoveTargetIndex}
            currentListId={currentListId}
          />
        )}

        {activePanel === "recurring" && (
          <RecurringPanel
            applyRecurrence={setRecurrence}
            recurrence={recurrence}
            setRecurrence={setRecurrence}
            WEEK_DAYS={WEEK_DAYS}
          />
        )}
      </div>
    </div>
  );
}
