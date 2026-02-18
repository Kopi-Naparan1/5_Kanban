import { useEffect, useRef, useState } from "react";

export default function useDragToScroll({
  axis = "both",
  longPressMs = 100,
} = {}) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const pointerDownRef = useRef(false);
  const dragEnabledRef = useRef(false);
  const didDragRef = useRef(false);
  const suppressClickRef = useRef(false);
  const longPressTimerRef = useRef(null);
  const pointerIdRef = useRef(null);
  const startPointRef = useRef({ x: 0, y: 0 });
  const startScrollRef = useRef({ left: 0, top: 0 });
  const previousBodyUserSelectRef = useRef("");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const clearLongPressTimer = () => {
      if (!longPressTimerRef.current) return;
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    };

    const lockTextSelection = () => {
      previousBodyUserSelectRef.current = document.body.style.userSelect;
      document.body.style.userSelect = "none";
    };

    const unlockTextSelection = () => {
      document.body.style.userSelect = previousBodyUserSelectRef.current;
      const selection = window.getSelection?.();
      selection?.removeAllRanges?.();
    };

    const endGesture = () => {
      clearLongPressTimer();
      pointerDownRef.current = false;
      dragEnabledRef.current = false;
      pointerIdRef.current = null;
      setIsDragging(false);
      unlockTextSelection();
    };

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest(
          "[draggable='true'], .card, .task, button, input, textarea, select, a, .edit-icon-wrapper",
        )
      ) {
        return;
      }

      pointerDownRef.current = true;
      didDragRef.current = false;
      pointerIdRef.current = event.pointerId;
      startPointRef.current = { x: event.clientX, y: event.clientY };
      startScrollRef.current = { left: el.scrollLeft, top: el.scrollTop };
      dragEnabledRef.current = false;

      longPressTimerRef.current = setTimeout(() => {
        if (!pointerDownRef.current) return;
        dragEnabledRef.current = true;
        setIsDragging(true);
        lockTextSelection();
        el.setPointerCapture?.(event.pointerId);
      }, longPressMs);
    };

    const onPointerMove = (event) => {
      if (!pointerDownRef.current || !dragEnabledRef.current) return;
      if (pointerIdRef.current !== event.pointerId) return;

      const dx = event.clientX - startPointRef.current.x;
      const dy = event.clientY - startPointRef.current.y;

      if (axis === "x" || axis === "both") {
        el.scrollLeft = startScrollRef.current.left - dx;
      }

      if (axis === "y" || axis === "both") {
        el.scrollTop = startScrollRef.current.top - dy;
      }

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        didDragRef.current = true;
      }
    };

    const onPointerUpOrCancel = (event) => {
      if (!pointerDownRef.current) {
        return;
      }

      if (
        pointerIdRef.current !== null &&
        pointerIdRef.current !== event.pointerId
      ) {
        return;
      }

      if (dragEnabledRef.current && didDragRef.current) {
        suppressClickRef.current = true;
      }

      endGesture();
    };

    const onClickCapture = (event) => {
      if (!suppressClickRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    };

    const onPointerLeave = () => {
      if (!pointerDownRef.current) return;
      clearLongPressTimer();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUpOrCancel);
    el.addEventListener("pointercancel", onPointerUpOrCancel);
    el.addEventListener("pointerleave", onPointerLeave);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      clearLongPressTimer();
      unlockTextSelection();
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUpOrCancel);
      el.removeEventListener("pointercancel", onPointerUpOrCancel);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [axis, longPressMs]);

  return { containerRef, isDragging };
}
