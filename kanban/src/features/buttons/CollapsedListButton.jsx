export default function CollapsedListButton({
  list,
  toggleCollapseList,
  onListDragStart,
  onListDragEnd,
  isDraggingList,
}) {
  return (
    <button
      type="button"
      className={`collapsed-list ${isDraggingList ? "dragging" : ""}`}
      data-list-id={list.id}
      draggable
      onDragStart={(event) => onListDragStart(event, list.id)}
      onDragEnd={onListDragEnd}
      onClick={() => toggleCollapseList(list.id)}
    >
      <span className="collapsed-list-title">{list.title}</span>
      <span className="collapsed-list-count">{list.cards.length}</span>
    </button>
  );
}
