import FloatingDatePicker from "../../inbox/edit/FloatingDatePicker";

export default function StartAndDuePanel({
  startButtonEl,
  startDate,
  handleStartDateChange,
  setActivePanel,
}) {
  return (
    <>
      {" "}
      <FloatingDatePicker
        anchorEl={startButtonEl}
        date={startDate}
        onChange={handleStartDateChange}
        onClose={() => setActivePanel(null)}
      />
    </>
  );
}
