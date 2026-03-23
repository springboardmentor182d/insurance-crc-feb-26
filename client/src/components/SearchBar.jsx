import React from "react";
import { TextField, Button, Box } from "@mui/material";

function SearchBar({ search, setSearch, setFilter }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        background: "#f3f4f6",
        borderRadius: 3,
        mb: 3
      }}
    >
      <TextField
        size="small"
        fullWidth
        placeholder="Search by claim ID, user name, or fraud rule..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mr: 2, background: "white", borderRadius: 2 }}
      />

      <Box>
        <Button variant="contained" onClick={() => setFilter("all")} sx={{ mr: 1 }}>
          All
        </Button>
        <Button variant="outlined" onClick={() => setFilter("low")} sx={{ mr: 1 }}>
          Low
        </Button>
        <Button variant="outlined" onClick={() => setFilter("medium")} sx={{ mr: 1 }}>
          Medium
        </Button>
        <Button variant="outlined" onClick={() => setFilter("high")}>
          High
        </Button>
      </Box>
    </Box>
  );
}

export default SearchBar;