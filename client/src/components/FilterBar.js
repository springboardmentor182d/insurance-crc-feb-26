function FilterBar({ setCategory }) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <button onClick={() => setCategory("")}>All</button>
      <button onClick={() => setCategory("Health")}>Health</button>
      <button onClick={() => setCategory("Life")}>Life</button>
      <button onClick={() => setCategory("Vehicle")}>Vehicle</button>
    </div>
  );
}

export default FilterBar;