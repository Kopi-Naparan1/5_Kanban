export default function createList({
  id,
  title,
  color = "#d4eeee",
  isCollapsed = false,
  isSettingsOpen = false,
  cards = [],
}) {
  return {
    id,
    title,
    color,
    isCollapsed,
    isSettingsOpen,
    cards,
  };
}
