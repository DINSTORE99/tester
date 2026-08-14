import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function App() {
  const [page, setPage] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);

  /*
   * CEK SESSION SAAT WEBSITE DIBUKA
   */

  useEffect(() => {
    checkSession();

    if (!supabase) {
      setChecking(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);

        if (session?.user) {
          setPage("dashboard");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkSession() {
    try {
      if (!supabase) {
        setError(
          "Supabase belum dikonfigurasi."
        );
        setChecking(false);
        return;
      }

      const {
        data,
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        setChecking(false);
        return;
      }

      if (data.session?.user) {
        setUser(data.session.user);
        setPage("dashboard");
      }
    } catch (err) {
      setError(err.message);
    }

    setChecking(false);
  }

  /*
   * LOGIN SUPABASE
   */

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    if (!password) {
      setError("Password wajib diisi.");
      return;
    }

    if (!supabase) {
      setError(
        "Supabase belum dikonfigurasi."
      );
      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        setError(
          loginError.message ===
            "Invalid login credentials"
            ? "Email atau password salah."
            : loginError.message
        );

        setLoading(false);
        return;
      }

      if (data.user) {
        setUser(data.user);
        setPage("dashboard");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  /*
   * LOGOUT
   */

  async function handleLogout() {
    if (!supabase) return;

    await supabase.auth.signOut();

    setUser(null);
    setEmail("");
    setPassword("");
    setMessage("");
    setError("");
    setPage("login");
  }

  /*
   * LOADING SESSION
   */

  if (checking) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>D</div>

          <h1>DINSTORE API</h1>

          <p>
            Memeriksa session...
          </p>

          <div style={styles.loading}>
            LOADING...
          </div>
        </div>
      </div>
    );
  }

  /*
   * REGISTER
   */

  if (page === "register") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>

          <div style={styles.logo}>
            D
          </div>

          <h1>
            DAFTAR MEMBER
          </h1>

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
              alert(
                "Fitur daftar kita pasang pada tahap berikutnya."
              )
            }
          >
            DAFTAR
          </button>

          <button
            style={styles.link}
            onClick={() => {
              setError("");
              setMessage("");
              setPage("login");
            }}
          >
            ← Kembali ke Login
          </button>

        </div>
      </div>
    );
  }

  /*
   * FORGOT PASSWORD
   */

  if (page === "forgot") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>

          <div style={styles.logo}>
            D
          </div>

          <h1>
            LUPA PASSWORD
          </h1>

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
              alert(
                "Fitur reset password kita pasang pada tahap berikutnya."
              )
            }
          >
            KIRIM LINK
          </button>

          <button
            style={styles.link}
            onClick={() => {
              setError("");
              setMessage("");
              setPage("login");
            }}
          >
            ← Kembali ke Login
          </button>

        </div>
      </div>
    );
  }

  /*
   * DASHBOARD SETELAH LOGIN
   */

  if (page === "dashboard" && user) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>

          <div style={styles.logo}>
            D
          </div>

          <div style={styles.online}>
            <span />
            SYSTEM ONLINE
          </div>

          <h1>
            DINSTORE API
          </h1>

          <p>
            Login berhasil.
          </p>

          <div style={styles.userBox}>
            <small>
              LOGIN SEBAGAI
            </small>

            <strong>
              {user.email}
            </strong>
          </div>

          <button
            style={styles.button}
            onClick={() =>
              alert(
                "Dashboard akan kita buat pada tahap berikutnya."
              )
            }
          >
            DASHBOARD
          </button>

          <button
            style={styles.logout}
            onClick={handleLogout}
          >
            LOGOUT
          </button>

        </div>
      </div>
    );
  }

  /*
   * LOGIN
   */

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


        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        {message && (
          <div style={styles.success}>
            {message}
          </div>
        )}


        <button
          style={styles.google}
          onClick={() =>
            alert(
              "Google Login kita aktifkan setelah Login Email berhasil."
            )
          }
          type="button"
        >
          <b>G</b>
          LOGIN DENGAN GOOGLE
        </button>


        <div style={styles.divider}>
          ATAU
        </div>


        <form onSubmit={handleLogin}>

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            autoComplete="email"
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="current-password"
          />


          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
            }}
            disabled={loading}
          >
            {loading
              ? "MEMPROSES..."
              : "LOGIN"}
          </button>

        </form>


        <button
          style={styles.link}
          onClick={() => {
            setError("");
            setMessage("");
            setPage("forgot");
          }}
        >
          Lupa Password?
        </button>


        <div style={styles.bottom}>
          Belum punya akun?
        </div>


        <button
          style={styles.register}
          onClick={() => {
            setError("");
            setMessage("");
            setPage("register");
          }}
        >
          DAFTAR AKUN
        </button>

      </div>
    </div>
  );
}


/*
 * STYLE
 */

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

  error: {
    background: "#351414",
    border: "1px solid #6b2424",
    color: "#ff8f8f",
    padding: "11px",
    borderRadius: "9px",
    fontSize: "13px",
    marginTop: "15px",
  },

  success: {
    background: "#12351f",
    border: "1px solid #245d37",
    color: "#8ff0aa",
    padding: "11px",
    borderRadius: "9px",
    fontSize: "13px",
    marginTop: "15px",
  },

  loading: {
    marginTop: "20px",
    color: "#888888",
    fontSize: "13px",
    letterSpacing: "2px",
  },

  online: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#7cff9b",
    fontSize: "12px",
    marginBottom: "15px",
  },

  userBox: {
    marginTop: "20px",
    background: "#080808",
    border: "1px solid #292929",
    borderRadius: "10px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  logout: {
    width: "100%",
    border: "1px solid #3b2020",
    background: "#160b0b",
    color: "#ff8d8d",
    padding: "13px",
    borderRadius: "10px",
    marginTop: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },
};
