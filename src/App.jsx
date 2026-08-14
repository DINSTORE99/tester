import React from "react";

export default function App() {
  return (
    <div className="app">
      <div className="card">
        <div className="logo">D</div>

        <h1>DINSTORE API</h1>

        <p>
          Website berhasil dijalankan.
        </p>

        <div className="status">
          <span></span>
          SYSTEM ONLINE
        </div>

        <button onClick={() => alert("DINSTORE API berhasil!")}>
          TEST WEBSITE
        </button>
      </div>
    </div>
  );
}
