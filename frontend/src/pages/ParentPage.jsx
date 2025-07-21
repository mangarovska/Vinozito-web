import React from "react";
import { useNavigate } from "react-router-dom";

export default function ParentPage() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center", marginTop: "70px" }}>
      <h1>Parent Page !</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
