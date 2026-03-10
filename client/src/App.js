import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Recommendations from "./Recommendations";

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Header />
        <Recommendations />
      </div>
    </div>
  );
}

export default App;