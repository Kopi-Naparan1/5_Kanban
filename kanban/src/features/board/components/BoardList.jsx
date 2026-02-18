import MoreHorizontalOutline from "../utils/MoreHorizontalIcons";
import EditBoardPopover from "./EditBoardPopover";
import AddCardButton from "../../buttons/AddCardButton";
import ListSettingsPopover from "./ListSettingsPopover";
import BoardCardItem from "./BoardCardItem";

export default function BoardList({
  list,
  setCardContainerRef,
  hasScrollByList,
  dropTarget,
  renamingListId,
  listTitleDraft,
  setListTitleDraft,
  saveRenameList,
  cancelRenameList,
  handleRenameList,
  handleDeleteList,
  toggleListSettings,
  handleToggleListCollapsed,
  handleCardContainerDragOver,
  handleCardContainerDrop,
  handleCardContainerDragLeave,
  isDraggingCard,
  handleCardDragStart,
  handleCardDragEnd,
  handleSettingsButtonClick,
  isEditing,
  activeListId,
  activeCard,
  activeCardIndex,
  setActiveListId,
  setActiveCard,
  setActiveCardIndex,
  setIsEditing,
  closeEditor,
  lists,
  updateCard,
  deleteCard,
  moveCard,
  addingListId,
  setAddingListId,
  textByList,
  handleTextChange,
  handleAdd,
  cancel,
  textAreaRef,
  blockNextCardDragRef,
  moveList,
  onListDragStart,
  onListDragEnd,
  isDraggingList,
}) {
  return (
    <div
      className={`list-container ${list.isSettingsOpen ? "list-focused" : ""} ${isDraggingList ? "dragging" : ""}`}
      data-list-id={list.id}
    >
      <div className="list-header-container">
        <button
          type="button"
          className="list-drag-handle"
          draggable
          onDragStart={(event) => onListDragStart(event, list.id)}
          onDragEnd={onListDragEnd}
          aria-label={`Drag ${list.title} list`}
          title="Drag list"
        >
          ::
        </button>
        <h2 className="list-title">{list.title}</h2>
        <button
          type="button"
          className="settings-button-wrapper"
          onClick={() => handleSettingsButtonClick(list.id)}
        >
          <MoreHorizontalOutline className="settings-button" />
        </button>

        {list.isSettingsOpen && (
          <ListSettingsPopover
            list={list}
            renamingListId={renamingListId}
            listTitleDraft={listTitleDraft}
            setListTitleDraft={setListTitleDraft}
            saveRenameList={saveRenameList}
            cancelRenameList={cancelRenameList}
            handleRenameList={handleRenameList}
            handleDeleteList={handleDeleteList}
            toggleListSettings={toggleListSettings}
            handleToggleListCollapsed={handleToggleListCollapsed}
            lists={lists}
            moveList={moveList}
          />
        )}
      </div>

      <div
        ref={(el) => setCardContainerRef(list.id, el)}
        onDragOver={(event) => handleCardContainerDragOver(event, list.id)}
        onDrop={(event) => handleCardContainerDrop(event, list)}
        onDragLeave={(event) => handleCardContainerDragLeave(event, list.id)}
        className={`card-container ${hasScrollByList[list.id] ? "has-scroll" : ""} ${dropTarget?.listId === list.id ? "drop-active" : ""}`}
      >
        {list.cards.map((card, cardIndex) => (
          <BoardCardItem
            key={card.id}
            listId={list.id}
            card={card}
            cardIndex={cardIndex}
            onToggleDone={(cardId, nextDone) =>
              updateCard(list.id, cardId, { done: nextDone })
            }
            showDropIndicator={
              dropTarget?.listId === list.id && dropTarget.toIndex === cardIndex
            }
            isDraggingCard={isDraggingCard}
            handleCardDragStart={handleCardDragStart}
            handleCardDragEnd={handleCardDragEnd}
            blockNextCardDragRef={blockNextCardDragRef}
            setActiveListId={setActiveListId}
            setActiveCard={setActiveCard}
            setActiveCardIndex={setActiveCardIndex}
            setIsEditing={setIsEditing}
          />
        ))}

        {dropTarget?.listId === list.id && dropTarget.toIndex === list.cards.length && (
          <div className="card-drop-indicator" />
        )}

        {isEditing && activeListId === list.id && activeCard && (
          <EditBoardPopover
            key={activeCard.id}
            task={{ ...activeCard, text: activeCard.title }}
            onSave={(updatedTask) => {
              const { move, text, ...taskUpdates } = updatedTask;
              const nextCardData = {
                ...activeCard,
                ...taskUpdates,
                title: text?.trim() || activeCard.title,
              };

              const shouldMove =
                move &&
                (move.listId !== list.id ||
                  Number(move.index) !== Number(activeCardIndex));

              if (shouldMove) {
                moveCard({
                  fromListId: list.id,
                  toListId: move.listId,
                  cardId: activeCard.id,
                  toIndex: Number(move.index),
                  updatedCard: nextCardData,
                });
              } else {
                updateCard(list.id, activeCard.id, nextCardData);
              }

              closeEditor();
            }}
            onClose={closeEditor}
            onDelete={() => {
              deleteCard(list.id, activeCard.id);
              closeEditor();
            }}
            lists={lists}
            currentListId={list.id}
            currentCardIndex={activeCardIndex || 0}
          />
        )}
      </div>

      <AddCardButton
        list={list}
        addingListId={addingListId}
        setAddingListId={setAddingListId}
        textByList={textByList}
        handleTextChange={handleTextChange}
        handleAdd={handleAdd}
        cancel={cancel}
        textAreaRef={textAreaRef}
      />
    </div>
  );
}

