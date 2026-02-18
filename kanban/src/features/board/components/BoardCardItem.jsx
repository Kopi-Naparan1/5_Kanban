import CheckCircle from "../../inbox/utils/CheckCircle";
import EditIcon from "../../inbox/utils/EditIcon";

export default function BoardCardItem({
  listId,
  card,
  cardIndex,
  onToggleDone,
  showDropIndicator,
  isDraggingCard,
  handleCardDragStart,
  handleCardDragEnd,
  blockNextCardDragRef,
  setActiveListId,
  setActiveCard,
  setActiveCardIndex,
  setIsEditing,
}) {
  return (
    <div>
      {showDropIndicator && <div className="card-drop-indicator" />}
      <div
        className={`card ${isDraggingCard(listId, card.id) ? "dragging" : ""} ${card.done ? "completed" : ""}`}
        data-card-id={card.id}
        draggable
        onDragStart={(event) =>
          handleCardDragStart(event, listId, card.id, cardIndex)
        }
        onDragEnd={handleCardDragEnd}
      >
        <CheckCircle
          checked={Boolean(card.done)}
          onToggle={(nextChecked) => onToggleDone(card.id, nextChecked)}
        />
        <span className="task-text">{card.title}</span>
        <span
          className="edit-icon-wrapper"
          draggable={false}
          onMouseDown={(event) => {
            blockNextCardDragRef.current = true;
            event.stopPropagation();
          }}
          onMouseUp={() => {
            blockNextCardDragRef.current = false;
          }}
          onMouseLeave={() => {
            blockNextCardDragRef.current = false;
          }}
          onDragStart={(event) => {
            event.preventDefault();
          }}
          onClick={() => {
            setActiveListId(listId);
            setActiveCard(card);
            setActiveCardIndex(cardIndex);
            setIsEditing(true);
          }}
        >
          <EditIcon />
        </span>
      </div>
    </div>
  );
}
