# Kanban Task Manager

A lightweight Kanban app built with React + Vite.

It includes an Inbox panel and a Board panel that share the same task data, plus drag-and-drop for cards and lists.

## Features

- Shared Inbox + Board task model
- Inbox task reordering via drag-and-drop
- Board card drag-and-drop across lists
- Board list drag-and-drop reordering
- Auto-scroll when dragging lists near left/right edges
- List settings:
  - Rename list
  - Move list to a specific position
  - Collapse/expand list
  - Delete list (except Inbox, which collapses instead)
- Task editing:
  - Title
  - Start date / due date
  - Recurrence
- Persistent completed-check visual state for Inbox and Board cards
- Split view (Inbox + Board) with draggable divider

## Tech Stack

- React 19
- Vite 7
- react-datepicker
- ESLint

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Project Structure

```text
kanban/
  src/
    features/
      inbox/
      board/
      toggle/
      header/
      buttons/
    hooks/
```

## Notes

- Default board lists start collapsed.
- Inbox tasks are backed by the Inbox board list.
- If you try to delete Inbox from list settings, the app prevents deletion and collapses it.

## License

For personal/learning use unless you add your own license.
