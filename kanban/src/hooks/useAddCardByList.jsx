import useDragToScroll from "./useDragToScroll";
import { useCallback, useRef } from "react";
export default function useAddCardByList() {
  const textAreaRef = useRef(null);
  const cardContainerRefs = useRef({});
  const blockNextCardDragRef = useRef(false);
  const { containerRef: boardScrollRef, isDragging: isDraggingBoard } =
    useDragToScroll({ axis: "x", longPressMs: 180 });

  const setCardContainerRef = useCallback((listId, el) => {
    if (el) {
      cardContainerRefs.current[listId] = el;
    } else {
      delete cardContainerRefs.current[listId];
    }
  }, []);

  return {
    textAreaRef,
    cardContainerRefs,
    setCardContainerRef,
    blockNextCardDragRef,
    boardScrollRef,
    isDraggingBoard,
  };
}
