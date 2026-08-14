import React, { useState } from "react";

export default function App() {
  const [page, setPage] = useState("login");

  if (page === "register") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>D</div>

          <h1>DAFTAR MEMBER</h1>

          <p>
            Buat akun DINSTORE API
          </p>

          <input
            style={styles.input}
            type="text"
            placeholder="Nama"
          />

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
          />

          <button
            style={styles.button}
            onClick={() =>
              alert("Fitur daftar akan kita pasang berikutnya.")
            }
          >
            DAFTAR
          </button>

          <button
            style={styles.link}
            onClick={() => setPage("login")}
          >
            ← Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  if (page === "forgot") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>D</div>

          <h1>LUPA PASSWORD</h1>

          <p>
            Masukkan email untuk reset password.
          </p>

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
          />

          <button
            style={styles.button}
            onClick={() =>
              alert("Fitur reset password akan kita pasang berikutnya.")
            }
          >
            KIRIM LINK
          </button>

          <button
            style={styles.link}
            onClick={() => setPage("login")}
          >
            ← Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.logo}>
          D
        </div>

        <h1>
          DINSTORE API
        </h1>

        <p>
          Member Login
        </p>

        <button
          style={styles.google}
          onClick={() =>
            alert("Google Login akan kita pasang setelah versi tes berhasil.")
          }
        >
          <b>G</b>
          LOGIN DENGAN GOOGLE
        </button>

        <div style={styles.divider}>
          ATAU
        </div>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
        />

        <button
          style={styles.button}
          onClick={() =>
            alert("Login test berhasil!")
          }
        >
          LOGIN
        </button>

        <button
          style={styles.link}
          onClick={() => setPage("forgot")}
        >
          Lupa Password?
        </button>

        <div style={styles.bottom}>
          Belum punya akun?
        </div>

        <button
          style={styles.register}
          onClick={() => setPage("register")}
        >
          DAFTAR AKUN
        </button>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#101010",
    border: "1px solid #292929",
    borderRadius: "18px",
    padding: "35px",
    boxSizing: "border-box",
    boxShadow:
      "0 20px 60px rgba(0,0,0,.5)",
  },

  logo: {
    width: "58px",
    height: "58px",
    borderRadius: "14px",
    background: "#ffffff",
    color: "#000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "900",
    marginBottom: "22px",
  },

  h1: {
    fontSize: "28px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#080808",
    border: "1px solid #303030",
    color: "#ffffff",
    padding: "14px",
    borderRadius: "10px",
    marginTop: "12px",
    outline: "none",
    fontSize: "15px",
  },

  button: {
    width: "100%",
    border: "none",
    background: "#ffffff",
    color: "#000000",
    padding: "14px",
    borderRadius: "10px",
    marginTop: "16px",
    fontWeight: "800",
    cursor: "pointer",
  },

  google: {
    width: "100%",
    border: "1px solid #333333",
    background: "#181818",
    color: "#ffffff",
    padding: "14px",
    borderRadius: "10px",
    marginTop: "20px",
    fontWeight: "700",
    cursor: "pointer",
  },

  divider: {
    textAlign: "center",
    color: "#666666",
    fontSize: "12px",
    margin: "22px 0 5px",
  },

  link: {
    width: "100%",
    border: "none",
    background: "transparent",
    color: "#aaaaaa",
    padding: "12px",
    marginTop: "10px",
    cursor: "pointer",
  },

  register: {
    width: "100%",
    border: "1px solid #333333",
    background: "#151515",
    color: "#ffffff",
    padding: "13px",
    borderRadius: "10px",
    marginTop: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },

  bottom: {
    textAlign: "center",
    color: "#777777",
    fontSize: "13px",
    marginTop: "25px",
  },
};
