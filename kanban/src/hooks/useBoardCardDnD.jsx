import { useState } from "react";

export default function useBoardCardDnD({
  cardContainerRefs,
  moveCard,
  blockNextCardDragRef,
}) {
  const [draggedCard, setDraggedCard] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  function getDropIndex(listId, clientY) {
    const containerEl = cardContainerRefs.current[listId];
    if (!containerEl) return 0;

    const cardElements = Array.from(
      containerEl.querySelectorAll(".card[data-card-id]"),
    );

    const filteredCardElements = cardElements.filter((element) => {
      if (!draggedCard) return true;
      const cardId = element.getAttribute("data-card-id");
      return !(
        draggedCard.fromListId === listId && cardId === draggedCard.cardId
      );
    });

    for (let index = 0; index < filteredCardElements.length; index += 1) {
      const element = filteredCardElements[index];
      const rect = element.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;

      if (clientY < midpoint) {
        return index;
      }
    }

    return filteredCardElements.length;
  }

  function handleCardContainerDragOver(event, listId) {
    if (!draggedCard) return;
    event.preventDefault();
    const toIndex = getDropIndex(listId, event.clientY);
    setDropTarget({ listId, toIndex });
  }

  function handleCardContainerDrop(event, list) {
    event.preventDefault();
    if (!draggedCard) return;

    const toIndex = getDropIndex(list.id, event.clientY);

    moveCard({
      fromListId: draggedCard.fromListId,
      toListId: list.id,
      cardId: draggedCard.cardId,
      toIndex,
    });

    setDraggedCard(null);
    setDropTarget(null);
  }

  function handleCardContainerDragLeave(event, listId) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDropTarget((prev) => (prev?.listId === listId ? null : prev));
    }
  }

  function handleCardDragStart(event, listId, cardId, cardIndex) {
    if (blockNextCardDragRef.current) {
      event.preventDefault();
      blockNextCardDragRef.current = false;
      return;
    }

    setDraggedCard({
      fromListId: listId,
      cardId,
      fromIndex: cardIndex,
    });
    event.dataTransfer.effectAllowed = "move";
  }

  function handleCardDragEnd() {
    setDraggedCard(null);
    setDropTarget(null);
  }

  function isDraggingCard(listId, cardId) {
    return (
      draggedCard &&
      draggedCard.fromListId === listId &&
      draggedCard.cardId === cardId
    );
  }

  return {
    dropTarget,
    handleCardContainerDragOver,
    handleCardContainerDrop,
    handleCardContainerDragLeave,
    handleCardDragStart,
    handleCardDragEnd,
    isDraggingCard,
  };
}
