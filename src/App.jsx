function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ marginBottom: "10px" }}>
          DINSTORE API
        </h1>

        <p style={{ opacity: 0.7 }}>
          React berhasil berjalan.
        </p>

        <button
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            border: "0",
            borderRadius: "10px",
            background: "#20e58a",
            color: "#00150d",
            fontWeight: "700",
          }}
        >
          TEST BERHASIL
        </button>
      </div>
    </div>
  );
}

export default App;
