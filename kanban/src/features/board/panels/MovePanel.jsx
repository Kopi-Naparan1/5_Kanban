import "./movePanel.css";

export default function MovePanel({
  lists,
  selectedListId,
  selectedIndex,
  onListChange,
  onIndexChange,
  currentListId,
}) {
  const selectedList = lists.find((list) => list.id === selectedListId) || null;
  const totalPositions = selectedList
    ? selectedList.id === currentListId
      ? Math.max(1, selectedList.cards.length)
      : Math.max(1, selectedList.cards.length + 1)
    : 1;

  return (
    <div className="move-panel">
      <div className="move-title">Move</div>

      <div className="move-options">
        <label className="move-field">
          <span className="move-label">List</span>
          <select
            className="move-select"
            value={selectedListId}
            onChange={(e) => onListChange(e.target.value)}
          >
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
        </label>

        <label className="move-field">
          <span className="move-label">Position</span>
          <select
            className="move-select"
            value={selectedIndex}
            onChange={(e) => onIndexChange(Number(e.target.value))}
          >
            {Array.from({ length: totalPositions }, (_, index) => (
              <option key={index} value={index}>
                {index + 1}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
