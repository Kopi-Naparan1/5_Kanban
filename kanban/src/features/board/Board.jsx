import "./board.css";
import BoardIcon from "./utils/BoardIcon";
import ShowList from "./components/ShowList";
import { createCard } from "./utils/createCard";

export default function Board({ lists, setLists }) {
  function handleAddList(newList) {
    setLists((prevList) => [...prevList, newList]);
  }

  function handleAddCard(listId, title) {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.id !== listId) return list;

        return {
          ...list,
          cards: [
            ...list.cards,
            createCard({
              id: crypto.randomUUID(),
              title,
            }),
          ],
        };
      }),
    );
  }

  function handleUpdateCard(listId, cardId, updatedCard) {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.id !== listId) return list;

        return {
          ...list,
          cards: list.cards.map((card) =>
            card.id === cardId ? { ...card, ...updatedCard } : card,
          ),
        };
      }),
    );
  }

  function handleDeleteCard(listId, cardId) {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.id !== listId) return list;
        return {
          ...list,
          cards: list.cards.filter((card) => card.id !== cardId),
        };
      }),
    );
  }

  function handleMoveCard({
    fromListId,
    toListId,
    cardId,
    toIndex,
    updatedCard,
  }) {
    setLists((prevLists) => {
      const sourceListIndex = prevLists.findIndex(
        (list) => list.id === fromListId,
      );
      const targetListIndex = prevLists.findIndex(
        (list) => list.id === toListId,
      );

      if (sourceListIndex < 0 || targetListIndex < 0) return prevLists;

      const sourceList = prevLists[sourceListIndex];
      const movingCardIndex = sourceList.cards.findIndex(
        (card) => card.id === cardId,
      );
      if (movingCardIndex < 0) return prevLists;

      const movingCard = {
        ...sourceList.cards[movingCardIndex],
        ...updatedCard,
      };

      const sourceCardsWithoutMovingCard = sourceList.cards.filter(
        (_, index) => index !== movingCardIndex,
      );

      if (fromListId === toListId) {
        const safeIndex = Math.max(
          0,
          Math.min(Number(toIndex) || 0, sourceCardsWithoutMovingCard.length),
        );

        const reorderedCards = [...sourceCardsWithoutMovingCard];
        reorderedCards.splice(safeIndex, 0, movingCard);

        return prevLists.map((list, index) =>
          index === sourceListIndex ? { ...list, cards: reorderedCards } : list,
        );
      }

      const targetList = prevLists[targetListIndex];
      const safeIndex = Math.max(
        0,
        Math.min(Number(toIndex) || 0, targetList.cards.length),
      );

      const nextTargetCards = [...targetList.cards];
      nextTargetCards.splice(safeIndex, 0, movingCard);

      return prevLists.map((list, index) => {
        if (index === sourceListIndex) {
          return { ...list, cards: sourceCardsWithoutMovingCard };
        }

        if (index === targetListIndex) {
          return { ...list, cards: nextTargetCards };
        }

        return list;
      });
    });
  }

  function handleRenameList(listId, nextTitle) {
    const trimmedTitle = nextTitle.trim();
    if (!trimmedTitle) return;

    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId ? { ...list, title: trimmedTitle } : list,
      ),
    );
  }

  function handleToggleListSettings(listId) {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? { ...list, isSettingsOpen: !list.isSettingsOpen }
          : { ...list, isSettingsOpen: false },
      ),
    );
  }

  function handleDeleteList(listId) {
    setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
  }

  function handleToggleCollapseList(listId) {
    setLists((prevList) => {
      return prevList.map((list) =>
        list.id === listId ? { ...list, isCollapsed: !list.isCollapsed } : list,
      );
    });
  }

  function handleMoveList(listId, toIndex) {
    setLists((prevLists) => {
      const fromIndex = prevLists.findIndex((list) => list.id === listId);
      if (fromIndex < 0) return prevLists;

      const safeIndex = Math.max(
        0,
        Math.min(Number(toIndex) || 0, prevLists.length - 1),
      );

      if (fromIndex === safeIndex) return prevLists;

      const nextLists = [...prevLists];
      const [movingList] = nextLists.splice(fromIndex, 1);
      nextLists.splice(safeIndex, 0, movingList);
      return nextLists;
    });
  }

  return (
    <div className="board-container">
      <div className="header-container">
        <BoardIcon></BoardIcon>
        <h2>Board</h2>
      </div>

      <div className="lists-outmost-container">
        <ShowList
          lists={lists}
          addList={handleAddList}
          addCard={handleAddCard}
          updateCard={handleUpdateCard}
          deleteCard={handleDeleteCard}
          moveCard={handleMoveCard}
          toggleListSettings={handleToggleListSettings}
          deleteList={handleDeleteList}
          renameList={handleRenameList}
          toggleCollapseList={handleToggleCollapseList}
          moveList={handleMoveList}
        ></ShowList>
      </div>
    </div>
  );
}
