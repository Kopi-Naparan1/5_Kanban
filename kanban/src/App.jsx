import Header from "./features/header/Header";
import { useRef, useState } from "react";
import Toggle from "./features/toggle/Toggle";
import Board from "../src/features/board/Board";

import "./app.css";
import Inbox from "./features/inbox/Inbox";

const INBOX_LIST_ID = "inbox-list";
const DEFAULT_RECURRENCE = {
  type: "none",
  interval: 1,
  unit: "weeks",
  daysOfWeek: [],
};

function createDefaultInboxCard(title) {
  return {
    id: crypto.randomUUID(),
    title,
    done: false,
    startDate: null,
    dueDate: null,
    recurrence: { ...DEFAULT_RECURRENCE },
  };
}

function createInboxList(cards = DEFAULT_INBOX_CARDS) {
  return {
    id: INBOX_LIST_ID,
    title: "Inbox",
    color: null,
    isCollapsed: true,
    cards,
  };
}

const DEFAULT_INBOX_CARDS = [
  createDefaultInboxCard("Welcome to Kanban. Start by renaming your lists."),
  createDefaultInboxCard(
    "Add your first real task from the Inbox input above.",
  ),
  createDefaultInboxCard(
    "Drag a task to reorder it or move it across board lists.",
  ),
];

const DEFAULT_LISTS = [
  createInboxList(DEFAULT_INBOX_CARDS),
  {
    id: crypto.randomUUID(),
    title: "Queue",
    color: null,
    isCollapsed: true,
    cards: [],
  },
  {
    id: crypto.randomUUID(),
    title: "Priority",
    color: null,
    isCollapsed: true,
    cards: [],
  },
  {
    id: crypto.randomUUID(),
    title: "Development",
    color: null,
    isCollapsed: true,
    cards: [],
  },
  {
    id: crypto.randomUUID(),
    title: "Testing",
    color: null,
    isCollapsed: true,
    cards: [],
  },
  {
    id: crypto.randomUUID(),
    title: "Done",
    color: null,
    isCollapsed: true,
    cards: [],
  },
];

function toInboxTask(card) {
  return {
    id: card.id,
    text: card.title ?? "",
    isCompleted: card.done ?? false,
    startDate: card.startDate ?? null,
    dueDate: card.dueDate ?? null,
    recurrence: card.recurrence ?? {
      type: "none",
      interval: 1,
      unit: "weeks",
      daysOfWeek: [],
    },
  };
}

function toBoardCard(task) {
  return {
    id: task.id,
    title: task.text ?? task.title ?? "",
    done: task.isCompleted ?? task.done ?? false,
    startDate: task.startDate ?? null,
    dueDate: task.dueDate ?? null,
    recurrence: task.recurrence ?? {
      type: "none",
      interval: 1,
      unit: "weeks",
      daysOfWeek: [],
    },
  };
}

function App() {
  const [lists, setLists] = useState(DEFAULT_LISTS);
  const [views, setView] = useState({ inbox: true, board: true });
  const [leftWidthPct, setLeftWidthPct] = useState(25);

  const splitRef = useRef(null);
  const inboxList = lists.find((list) => list.id === INBOX_LIST_ID);
  const inboxTasks = (inboxList?.cards ?? []).map(toInboxTask);

  function setListsEnsuringInbox(nextLists) {
    setLists((prevLists) => {
      const resolvedLists =
        typeof nextLists === "function" ? nextLists(prevLists) : nextLists;

      if (resolvedLists.some((list) => list.id === INBOX_LIST_ID)) {
        return resolvedLists;
      }

      const previousInboxCards =
        prevLists.find((list) => list.id === INBOX_LIST_ID)?.cards ?? [];

      return [createInboxList(previousInboxCards), ...resolvedLists];
    });
  }

  function setInboxTasks(nextTasks) {
    setListsEnsuringInbox((prevLists) =>
      prevLists.map((list) => {
        if (list.id !== INBOX_LIST_ID) return list;

        const prevTasks = list.cards.map(toInboxTask);
        const resolvedTasks =
          typeof nextTasks === "function" ? nextTasks(prevTasks) : nextTasks;

        return {
          ...list,
          cards: resolvedTasks.map(toBoardCard),
        };
      }),
    );
  }

  function safeSetView(nextView) {
    setView((prev) => {
      const resolvedView =
        typeof nextView === "function" ? nextView(prev) : nextView;

      if (!resolvedView.inbox && !resolvedView.board) {
        return prev;
      }

      return resolvedView;
    });
  }

  function startResize(event) {
    event.preventDefault();

    function handleMove(moveEvent) {
      if (!splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const nextPct = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(80, Math.max(20, nextPct));
      setLeftWidthPct(clamped);
    }

    function handleUp() {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }

  return (
    <div className="app">
      {" "}
      <Header></Header>
      <Toggle views={views} setView={safeSetView}></Toggle>
      {views.inbox && views.board ? (
        <div className="split-container" ref={splitRef}>
          <div className="split-pane" style={{ flexBasis: `${leftWidthPct}%` }}>
            <Inbox tasks={inboxTasks} setTasks={setInboxTasks}></Inbox>
          </div>
          <div className="splitter" onMouseDown={startResize}></div>
          <div
            className="split-pane"
            style={{ flexBasis: `${100 - leftWidthPct}%` }}
          >
            <Board lists={lists} setLists={setListsEnsuringInbox}></Board>
          </div>
        </div>
      ) : (
        <>
          {views.inbox && (
            <Inbox tasks={inboxTasks} setTasks={setInboxTasks}></Inbox>
          )}
          {views.board && (
            <Board lists={lists} setLists={setListsEnsuringInbox}></Board>
          )}
        </>
      )}
    </div>
  );
}

export default App;
