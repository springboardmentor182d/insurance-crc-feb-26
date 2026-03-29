import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ROUTES } from "./data/constants";

import AdminLogin       from "./pages/AdminLogin";
import AuthStatus       from "./pages/AuthStatus";
import ForgotPassword   from "./pages/ForgotPassword";
import Login            from "./pages/Login";
import Signup           from "./pages/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME}   element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path={ROUTES.LOGIN}  element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.AUTH_STATUS} element={<AuthStatus />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
