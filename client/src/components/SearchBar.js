function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search by policy name..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        marginBottom: "10px"
      }}
    />
  );
}

export default SearchBar;