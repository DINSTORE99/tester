import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  // =========================
  // CHECK SESSION
  // =========================

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error(error);
      }

      setSession(data?.session || null);
      setLoading(false);
    }

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession || null);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =========================
  // RESET FORM
  // =========================

  function resetMessage() {
    setMessage("");
    setError("");
  }

  // =========================
  // LOGIN
  // =========================

  async function handleLogin(e) {
    e.preventDefault();

    resetMessage();

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setProcessing(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setProcessing(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSession(data.session);

    setMessage("Login berhasil.");
  }

  // =========================
  // REGISTER
  // =========================

  async function handleRegister(e) {
    e.preventDefault();

    resetMessage();

    if (!name || !email || !password) {
      setError("Nama, email dan password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setProcessing(true);

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

    setProcessing(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      setSession(data.session);
      setMessage("Akun berhasil dibuat.");
    } else {
      setMessage(
        "Akun berhasil dibuat. Silakan cek email untuk verifikasi."
      );
      setPage("login");
    }
  }

  // =========================
  // GOOGLE LOGIN
  // =========================

  async function handleGoogleLogin() {
    resetMessage();
    setProcessing(true);

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

    setProcessing(false);

    if (error) {
      setError(error.message);
    }
  }

  // =========================
  // FORGOT PASSWORD
  // =========================

  async function handleForgotPassword(e) {
    e.preventDefault();

    resetMessage();

    if (!email) {
      setError("Masukkan email terlebih dahulu.");
      return;
    }

    setProcessing(true);

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: window.location.origin,
        }
      );

    setProcessing(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Link reset password sudah dikirim ke email kamu."
    );
  }

  // =========================
  // LOGOUT
  // =========================

  async function handleLogout() {
    setProcessing(true);

    await supabase.auth.signOut();

    setSession(null);

    setEmail("");
    setPassword("");
    setName("");

    setProcessing(false);
    setPage("login");
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="app">
        <div className="card loading-card">

          <div className="logo">
            D
          </div>

          <h1>DINSTORE API</h1>

          <p>
            Memeriksa sesi login...
          </p>

          <div className="spinner"></div>

        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  if (session) {
    const user = session.user;

    const displayName =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      "User";

    return (
      <div className="app">

        <div className="dashboard">

          {/* HEADER */}

          <header className="dashboard-header">

            <div>
              <div className="brand-small">
                DINSTORE
              </div>

              <h1>
                Dashboard
              </h1>

              <p>
                Selamat datang kembali, {displayName}.
              </p>
            </div>

            <div className="online">
              <span></span>
              ONLINE
            </div>

          </header>

          {/* USER CARD */}

          <section className="user-card">

            <div className="avatar">
              {displayName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="user-data">

              <span>
                ACCOUNT
              </span>

              <strong>
                {displayName}
              </strong>

              <p>
                {user.email}
              </p>

            </div>

          </section>

          {/* STATISTICS */}

          <section className="stats">

            <div className="stat-card">
              <span>STATUS</span>
              <strong>ONLINE</strong>
            </div>

            <div className="stat-card">
              <span>API</span>
              <strong>35+</strong>
            </div>

            <div className="stat-card">
              <span>ACCOUNT</span>
              <strong>ACTIVE</strong>
            </div>

          </section>

          {/* API MENU */}

          <section className="api-section">

            <div className="section-title">
              <span>API SYSTEM</span>
              <h2>
                DINSTORE API
              </h2>
            </div>

            <div className="api-grid">

              <button
                className="api-card"
                onClick={() => {
                  alert(
                    "Endpoint TikTok:\n/api/download/tiktok"
                  );
                }}
              >
                <div className="api-icon">
                  ♪
                </div>

                <div>
                  <strong>
                    TikTok Downloader
                  </strong>

                  <p>
                    /api/download/tiktok
                  </p>
                </div>

                <span>→</span>
              </button>

              <button
                className="api-card"
                onClick={() => {
                  alert(
                    "Endpoint ChatGPT:\n/api/ai/chatgpt"
                  );
                }}
              >
                <div className="api-icon">
                  AI
                </div>

                <div>
                  <strong>
                    ChatGPT AI
                  </strong>

                  <p>
                    /api/ai/chatgpt
                  </p>
                </div>

                <span>→</span>
              </button>

              <button
                className="api-card"
                onClick={() => {
                  alert(
                    "API Tester akan dibuat di tahap berikutnya."
                  );
                }}
              >
                <div className="api-icon">
                  ⚡
                </div>

                <div>
                  <strong>
                    API Tester
                  </strong>

                  <p>
                    Test endpoint secara langsung
                  </p>
                </div>

                <span>→</span>
              </button>

            </div>

          </section>

          {/* QUICK ACTION */}

          <section className="quick-section">

            <button
              onClick={() => {
                window.open(
                  "/api/download/tiktok",
                  "_blank"
                );
              }}
            >
              DOCUMENTATION
            </button>

            <button
              onClick={() => {
                alert(
                  "Koneksi API akan dibuat pada tahap berikutnya."
                );
              }}
            >
              CONNECT API
            </button>

          </section>

          {/* LOGOUT */}

          <button
            className="logout"
            onClick={handleLogout}
            disabled={processing}
          >
            {processing
              ? "LOGGING OUT..."
              : "LOGOUT"}
          </button>

          <div className="footer">
            DINSTORE API © 2026
          </div>

        </div>

      </div>
    );
  }

  // =========================
  // LOGIN / REGISTER / FORGOT
  // =========================

  return (
    <div className="app">

      <div className="auth-card">

        <div className="auth-logo">
          D
        </div>

        <div className="auth-brand">
          DINSTORE API
        </div>

        {/* LOGIN */}

        {page === "login" && (
          <>
            <div className="auth-title">

              <span>
                WELCOME BACK
              </span>

              <h1>
                Login
              </h1>

              <p>
                Masuk ke akun DINSTORE kamu.
              </p>

            </div>

            <form onSubmit={handleLogin}>

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />

              <label>
                Password
              </label>

              <div className="password-box">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "HIDE"
                    : "SHOW"}
                </button>

              </div>

              <button
                className="primary-button"
                type="submit"
                disabled={processing}
              >
                {processing
                  ? "LOGIN..."
                  : "LOGIN"}
              </button>

            </form>

            <button
              className="google-button"
              onClick={handleGoogleLogin}
              disabled={processing}
            >
              <span>
                G
              </span>

              Continue with Google
            </button>

            <button
              className="text-button"
              onClick={() => {
                resetMessage();
                setPage("forgot");
              }}
            >
              Lupa password?
            </button>

            <div className="switch-text">

              Belum punya akun?

              <button
                onClick={() => {
                  resetMessage();
                  setPage("register");
                }}
              >
                Daftar
              </button>

            </div>
          </>
        )}

        {/* REGISTER */}

        {page === "register" && (
          <>
            <div className="auth-title">

              <span>
                CREATE ACCOUNT
              </span>

              <h1>
                Daftar
              </h1>

              <p>
                Buat akun DINSTORE baru.
              </p>

            </div>

            <form onSubmit={handleRegister}>

              <label>
                Nama
              </label>

              <input
                type="text"
                placeholder="Nama kamu"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                autoComplete="name"
              />

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />

              <label>
                Password
              </label>

              <div className="password-box">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "HIDE"
                    : "SHOW"}
                </button>

              </div>

              <button
                className="primary-button"
                type="submit"
                disabled={processing}
              >
                {processing
                  ? "MEMBUAT AKUN..."
                  : "DAFTAR"}
              </button>

            </form>

            <div className="switch-text">

              Sudah punya akun?

              <button
                onClick={() => {
                  resetMessage();
                  setPage("login");
                }}
              >
                Login
              </button>

            </div>
          </>
        )}

        {/* FORGOT PASSWORD */}

        {page === "forgot" && (
          <>
            <div className="auth-title">

              <span>
                ACCOUNT RECOVERY
              </span>

              <h1>
                Lupa Password
              </h1>

              <p>
                Masukkan email untuk mendapatkan
                link reset password.
              </p>

            </div>

            <form onSubmit={handleForgotPassword}>

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />

              <button
                className="primary-button"
                type="submit"
                disabled={processing}
              >
                {processing
                  ? "MENGIRIM..."
                  : "KIRIM LINK RESET"}
              </button>

            </form>

            <button
              className="text-button"
              onClick={() => {
                resetMessage();
                setPage("login");
              }}
            >
              ← Kembali ke Login
            </button>

          </>
        )}

        {/* MESSAGE */}

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {message && (
          <div className="message success">
            {message}
          </div>
        )}

        <div className="auth-footer">
          DINSTORE API © 2026
        </div>

      </div>

    </div>
  );
}
