import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const LayoutAdminInternal = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="wrapper">
      <div className="row h-100 ms-0">
        <div
          className="card border-0 border-radius-0 col-2 text-white"
          style={{ backgroundColor: "#6C9BCF", width: "18%" }}
        >
          <p className="fs-6 fw-bold mt-3 pb-2 border-bottom border-3 border-light text-center">
            Dashboard Survey <br />
            Stellar Award 2023
          </p>
          <div
            className="d-flex pointer sidebar-menu"
            onClick={() => navigate("/")}
          >
            <i class="fas fa-info-circle fa-fw mt-1"></i>
            <span className="ms-2 text-sidebar">Dashboard</span>
          </div>
          <span className="mt-auto text-xs text-center">v 1.0.0</span>
        </div>
        <div className="col ps-0">
          <div className="d-flex shadow-sm p-4"></div>
          {children} <Outlet />
          <div className="footer mt-2">
            <p className="text-center">
              Copyright © Digital Learning Solutions 2023. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutAdminInternal;
