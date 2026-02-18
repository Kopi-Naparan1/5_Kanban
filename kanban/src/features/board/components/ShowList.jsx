import "./show-list.css";
import AddList from "./AddList";
import { useEffect, useRef, useState } from "react";
import useAddCardByList from "../../../hooks/useAddCardByList";
import useBoardCardDnD from "../../../hooks/useBoardCardDnD";
import CollapsedListButton from "../../buttons/CollapsedListButton";
import BoardList from "./BoardList";

export default function ShowList({
  lists,
  addList,
  addCard,
  updateCard,
  deleteCard,
  moveCard,
  toggleListSettings,
  deleteList,
  renameList,
  toggleCollapseList,
  moveList,
}) {
  const [addingListId, setAddingListId] = useState(null);
  const [hasScrollByList, setHasScrollByList] = useState({});
  const [textByList, setTextByList] = useState({});
  const [activeCard, setActiveCard] = useState(null);
  const [activeListId, setActiveListId] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const openedList = lists.find((list) => list.isSettingsOpen);

  const [renamingListId, setRenamingListId] = useState(null);
  const [listTitleDraft, setListTitleDraft] = useState("");
  const [draggedListId, setDraggedListId] = useState(null);
  const [listDropIndex, setListDropIndex] = useState(null);
  const dragClientXRef = useRef(null);

  const {
    textAreaRef,
    cardContainerRefs,
    setCardContainerRef,
    blockNextCardDragRef,
    boardScrollRef,
    isDraggingBoard,
  } = useAddCardByList();

  useEffect(() => {
    const checkScroll = () => {
      setHasScrollByList((prev) => {
        const next = {};

        for (const list of lists) {
          const el = cardContainerRefs.current[list.id];
          next[list.id] = el ? el.scrollHeight > el.clientHeight : false;
        }

        const prevKeys = Object.keys(prev);
        const nextKeys = Object.keys(next);

        if (
          prevKeys.length === nextKeys.length &&
          nextKeys.every((key) => prev[key] === next[key])
        ) {
          return prev;
        }

        return next;
      });
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(checkScroll);
      for (const list of lists) {
        const el = cardContainerRefs.current[list.id];
        if (el) resizeObserver.observe(el);
      }
    }

    return () => {
      window.removeEventListener("resize", checkScroll);
      resizeObserver?.disconnect();
    };
  }, [lists, cardContainerRefs]);

  useEffect(() => {
    if (addingListId !== null) {
      textAreaRef.current?.focus();
    }
  }, [addingListId, textAreaRef]);

  function cancel() {
    setAddingListId(null);
  }

  function handleTextChange(listId, value) {
    setTextByList((prev) => ({ ...prev, [listId]: value }));
  }

  function handleSettingsButtonClick(listId) {
    toggleListSettings(listId);
  }

  function handleAdd(listId) {
    const text = textByList[listId]?.trim();
    if (!text) return;

    addCard(listId, text);
    setTextByList((prev) => ({ ...prev, [listId]: "" }));
    setAddingListId(null);
  }

  function closeEditor() {
    setIsEditing(false);
    setActiveCard(null);
    setActiveListId(null);
    setActiveCardIndex(null);
  }

  function handleDeleteList(listId) {
    deleteList(listId);
  }

  function handleRenameList(list) {
    setRenamingListId(list.id);
    setListTitleDraft(list.title);
  }

  function saveRenameList(list) {
    const trimmedTitle = listTitleDraft.trim();
    if (!trimmedTitle) {
      setListTitleDraft(list.title);
      setRenamingListId(null);
      return;
    }

    renameList(list.id, trimmedTitle);
    setRenamingListId(null);
  }

  function cancelRenameList(list) {
    setRenamingListId(null);
    setListTitleDraft(list.title);
  }

  function handleToggleListCollapsed(listId) {
    toggleCollapseList(listId);
  }

  function getListDropIndex(clientX) {
    const containerEl = boardScrollRef.current;
    if (!containerEl) return 0;

    const listElements = Array.from(
      containerEl.querySelectorAll("[data-list-id]"),
    );

    const filteredListElements = listElements.filter((element) => {
      const listId = element.getAttribute("data-list-id");
      return listId !== draggedListId;
    });

    for (let index = 0; index < filteredListElements.length; index += 1) {
      const rect = filteredListElements[index].getBoundingClientRect();
      const midpoint = rect.left + rect.width / 2;

      if (clientX < midpoint) return index;
    }

    return filteredListElements.length;
  }

  function handleListDragStart(event, listId) {
    setDraggedListId(listId);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleListDragOver(event) {
    if (!draggedListId) return;
    event.preventDefault();
    dragClientXRef.current = event.clientX;
    setListDropIndex(getListDropIndex(event.clientX));
  }

  function handleListDrop(event) {
    event.preventDefault();
    if (!draggedListId) return;

    moveList(draggedListId, getListDropIndex(event.clientX));
    setDraggedListId(null);
    setListDropIndex(null);
    dragClientXRef.current = null;
  }

  function handleListDragLeave(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setListDropIndex(null);
    }
  }

  function handleListDragEnd() {
    setDraggedListId(null);
    setListDropIndex(null);
    dragClientXRef.current = null;
  }

  useEffect(() => {
    if (!draggedListId) return;

    const EDGE_ZONE_PX = 90;
    const MAX_SCROLL_STEP = 24;
    let rafId = null;

    const tick = () => {
      const containerEl = boardScrollRef.current;
      const clientX = dragClientXRef.current;

      if (containerEl && typeof clientX === "number") {
        const rect = containerEl.getBoundingClientRect();
        let delta = 0;

        if (clientX < rect.left + EDGE_ZONE_PX) {
          const ratio = (rect.left + EDGE_ZONE_PX - clientX) / EDGE_ZONE_PX;
          delta = -MAX_SCROLL_STEP * Math.min(1, Math.max(0, ratio));
        } else if (clientX > rect.right - EDGE_ZONE_PX) {
          const ratio = (clientX - (rect.right - EDGE_ZONE_PX)) / EDGE_ZONE_PX;
          delta = MAX_SCROLL_STEP * Math.min(1, Math.max(0, ratio));
        }

        if (delta !== 0) {
          containerEl.scrollLeft += delta;
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [draggedListId, boardScrollRef]);

  const {
    dropTarget,
    handleCardContainerDragOver,
    handleCardContainerDrop,
    handleCardContainerDragLeave,
    handleCardDragStart,
    handleCardDragEnd,
    isDraggingCard,
  } = useBoardCardDnD({
    cardContainerRefs,
    moveCard,
    blockNextCardDragRef,
  });

  return (
    <div
      className={`lists-container drag-scroll-zone ${isDraggingBoard ? "is-dragging" : ""}`}
      ref={boardScrollRef}
      onDragOver={handleListDragOver}
      onDrop={handleListDrop}
      onDragLeave={handleListDragLeave}
    >
      {openedList && (
        <button
          type="button"
          className="settings-backdrop"
          aria-label="Close settings"
          onClick={() => toggleListSettings(openedList.id)}
        />
      )}
      {lists.map((list, listIndex) => {

        if (list.isCollapsed) {
          return (
            <div key={list.id} className="list-item-wrapper">
              {draggedListId && listDropIndex === listIndex && (
                <div className="list-drop-indicator" />
              )}
              <CollapsedListButton
                list={list}
                toggleCollapseList={toggleCollapseList}
                onListDragStart={handleListDragStart}
                onListDragEnd={handleListDragEnd}
                isDraggingList={draggedListId === list.id}
              />
            </div>
          );
        }
        return (
          <div key={list.id} className="list-item-wrapper">
            {draggedListId && listDropIndex === listIndex && (
              <div className="list-drop-indicator" />
            )}
            <BoardList
              list={list}
              setCardContainerRef={setCardContainerRef}
              hasScrollByList={hasScrollByList}
              dropTarget={dropTarget}
              renamingListId={renamingListId}
              listTitleDraft={listTitleDraft}
              setListTitleDraft={setListTitleDraft}
              saveRenameList={saveRenameList}
              cancelRenameList={cancelRenameList}
              handleRenameList={handleRenameList}
              handleDeleteList={handleDeleteList}
              toggleListSettings={toggleListSettings}
              handleToggleListCollapsed={handleToggleListCollapsed}
              handleCardContainerDragOver={handleCardContainerDragOver}
              handleCardContainerDrop={handleCardContainerDrop}
              handleCardContainerDragLeave={handleCardContainerDragLeave}
              isDraggingCard={isDraggingCard}
              handleCardDragStart={handleCardDragStart}
              handleCardDragEnd={handleCardDragEnd}
              handleSettingsButtonClick={handleSettingsButtonClick}
              isEditing={isEditing}
              activeListId={activeListId}
              activeCard={activeCard}
              activeCardIndex={activeCardIndex}
              setActiveListId={setActiveListId}
              setActiveCard={setActiveCard}
              setActiveCardIndex={setActiveCardIndex}
              setIsEditing={setIsEditing}
              closeEditor={closeEditor}
              lists={lists}
              updateCard={updateCard}
              deleteCard={deleteCard}
              moveCard={moveCard}
              addingListId={addingListId}
              setAddingListId={setAddingListId}
              textByList={textByList}
              handleTextChange={handleTextChange}
              handleAdd={handleAdd}
              cancel={cancel}
              textAreaRef={textAreaRef}
              blockNextCardDragRef={blockNextCardDragRef}
              moveList={moveList}
              onListDragStart={handleListDragStart}
              onListDragEnd={handleListDragEnd}
              isDraggingList={draggedListId === list.id}
            />
          </div>
        );
      })}

      {draggedListId && listDropIndex === lists.length && (
        <div className="list-drop-indicator" />
      )}
      <AddList addList={addList} />
    </div>
  );
}
