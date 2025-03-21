import { useState } from "react";
import "./App.css";
import Home from "./components/pages/Home";
import { Route, Routes } from "react-router";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
