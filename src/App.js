import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardInternal from "./pages/Dashboard/Internal";
import DashboardExternal from "./pages/Dashboard/external";
import LayoutAdminExternal from "./components/LayoutAdmin/external";
import LayoutAdminInternal from "./components/LayoutAdmin/internal";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<LayoutAdminInternal />}>
        <Route path="/:id" element={<DashboardInternal />} />
      </Route>
      <Route element={<LayoutAdminExternal />}>
        <Route path="/external/:id" element={<DashboardExternal />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
