import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import "./style.css";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        setError(error.message);
      }

      setSession(data?.session || null);
      setLoading(false);
    }

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (!mounted) return;

        setSession(currentSession);

        if (currentSession) {
          setPage("home");
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function clearMessage() {
    setError("");
    setMessage("");
  }

  async function login() {
    clearMessage();

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setBusy(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSession(data.session);
    setPage("home");
  }

  async function register() {
    clearMessage();

    if (!name || !email || !password) {
      setError("Nama, email, dan password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setBusy(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          name: name,
        },
      },
    });

    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      setSession(data.session);
      setPage("home");
    } else {
      setMessage(
        "Pendaftaran berhasil. Silakan login menggunakan akun yang sudah dibuat."
      );
      setPage("login");
    }
  }

  async function loginGoogle() {
    clearMessage();
    setBusy(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setBusy(false);
      setError(error.message);
    }
  }

  async function forgotPassword() {
    clearMessage();

    if (!email) {
      setError("Masukkan email terlebih dahulu.");
      return;
    }

    setBusy(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Link reset password sudah dikirim. Silakan cek email kamu."
    );
  }

  async function updatePassword() {
    clearMessage();

    if (!newPassword) {
      setError("Masukkan password baru.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setBusy(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }

    setNewPassword("");
    setMessage("Password berhasil diubah.");

    setTimeout(() => {
      setPage("home");
    }, 1000);
  }

  async function logout() {
    await supabase.auth.signOut();

    setSession(null);
    setEmail("");
    setPassword("");
    setPage("login");
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Memuat DINSTORE...</p>
        </div>
      </div>
    );
  }

  /*
   * HALAMAN RESET PASSWORD
   */
  if (
    window.location.hash.includes("access_token") &&
    !session
  ) {
    return (
      <div className="app">
        <div className="auth-container">
          <div className="auth-card">
            <div className="logo">D</div>

            <h1>Password Baru</h1>

            <p className="subtitle">
              Masukkan password baru untuk akun kamu.
            </p>

            {error && (
              <div className="alert error">
                {error}
              </div>
            )}

            {message && (
              <div className="alert success">
                {message}
              </div>
            )}

            <div className="form-group">
              <label>Password Baru</label>

              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />
            </div>

            <button
              className="primary-button"
              onClick={updatePassword}
              disabled={busy}
            >
              {busy ? "Memproses..." : "Ubah Password"}
            </button>

            <button
              className="text-button"
              onClick={() => setPage("login")}
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
   * JIKA SUDAH LOGIN
   */
  if (session) {
    const user = session.user;

    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User";

    return (
      <div className="app">
        <header className="navbar">
          <div className="brand">
            <div className="brand-logo">D</div>

            <div>
              <strong>DINSTORE</strong>
              <small>API PLATFORM</small>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <main className="dashboard">
          <section className="hero-card">
            <div className="hero-content">
              <div className="online-badge">
                <span></span>
                SYSTEM ONLINE
              </div>

              <h1>
                Selamat datang,
                <br />
                <span>{fullName}</span>
              </h1>

              <p>
                DINSTORE API siap digunakan.
                Kelola layanan API kamu dari satu tempat.
              </p>

              <div className="user-email">
                {user.email}
              </div>
            </div>

            <div className="hero-logo">
              D
            </div>
          </section>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">⚡</div>

              <div>
                <span>Status</span>
                <strong>Online</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔐</div>

              <div>
                <span>Authentication</span>
                <strong>Verified</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🚀</div>

              <div>
                <span>API</span>
                <strong>Ready</strong>
              </div>
            </div>
          </section>

          <section className="content-card">
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  DINSTORE API
                </span>

                <h2>Dashboard</h2>
              </div>

              <div className="status-dot">
                ONLINE
              </div>
            </div>

            <p>
              Kamu sudah berhasil login.
              Halaman utama DINSTORE sekarang dapat
              diakses.
            </p>

            <div className="api-box">
              <div>
                <span>API STATUS</span>
                <strong>Operational</strong>
              </div>

              <div>
                <span>ACCOUNT</span>
                <strong>{user.email}</strong>
              </div>
            </div>
          </section>

          <section className="content-card">
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  QUICK ACCESS
                </span>

                <h2>Layanan</h2>
              </div>
            </div>

            <div className="service-grid">
              <div className="service-card">
                <div className="service-icon">
                  API
                </div>

                <h3>API Tester</h3>

                <p>
                  Test endpoint API DINSTORE.
                </p>

                <button
                  onClick={() =>
                    alert("API Tester akan tersedia pada tahap berikutnya.")
                  }
                >
                  Buka
                </button>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  DOC
                </div>

                <h3>Documentation</h3>

                <p>
                  Lihat dokumentasi API.
                </p>

                <button
                  onClick={() =>
                    alert("Documentation akan tersedia pada tahap berikutnya.")
                  }
                >
                  Buka
                </button>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  KEY
                </div>

                <h3>API Key</h3>

                <p>
                  Kelola API key akun kamu.
                </p>

                <button
                  onClick={() =>
                    alert("API Key akan tersedia pada tahap berikutnya.")
                  }
                >
                  Kelola
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer>
          <strong>DINSTORE API</strong>
          <span>© 2026 DINSTORE. All rights reserved.</span>
        </footer>
      </div>
    );
  }

  /*
   * HALAMAN AUTH
   */

  return (
    <div className="app">
      <div className="auth-container">
        <div className="auth-card">
          <div className="logo">
            D
          </div>

          <h1>DINSTORE API</h1>

          <p className="subtitle">
            {page === "register"
              ? "Buat akun baru"
              : page === "forgot"
              ? "Reset password akun"
              : "Login untuk melanjutkan"}
          </p>

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          {message && (
            <div className="alert success">
              {message}
            </div>
          )}

          {page === "login" && (
            <>
              <button
                className="google-button"
                onClick={loginGoogle}
                disabled={busy}
              >
                <span className="google-icon">
                  G
                </span>

                {busy
                  ? "Menghubungkan..."
                  : "Login dengan Google"}
              </button>

              <div className="divider">
                <span>atau</span>
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      login();
                    }
                  }}
                />
              </div>

              <div className="forgot-row">
                <button
                  className="link-button"
                  onClick={() => {
                    clearMessage();
                    setPage("forgot");
                  }}
                >
                  Lupa Password?
                </button>
              </div>

              <button
                className="primary-button"
                onClick={login}
                disabled={busy}
              >
                {busy ? "Login..." : "Login"}
              </button>

              <p className="switch-text">
                Belum punya akun?
                <button
                  className="link-button inline"
                  onClick={() => {
                    clearMessage();
                    setPage("register");
                  }}
                >
                  Daftar sekarang
                </button>
              </p>
            </>
          )}

          {page === "register" && (
            <>
              <div className="form-group">
                <label>Nama</label>

                <input
                  type="text"
                  placeholder="Nama lengkap"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

              <button
                className="primary-button"
                onClick={register}
                disabled={busy}
              >
                {busy
                  ? "Membuat akun..."
                  : "Daftar"}
              </button>

              <div className="divider">
                <span>atau</span>
              </div>

              <button
                className="google-button"
                onClick={loginGoogle}
                disabled={busy}
              >
                <span className="google-icon">
                  G
                </span>

                Daftar dengan Google
              </button>

              <p className="switch-text">
                Sudah punya akun?
                <button
                  className="link-button inline"
                  onClick={() => {
                    clearMessage();
                    setPage("login");
                  }}
                >
                  Login
                </button>
              </p>
            </>
          )}

          {page === "forgot" && (
            <>
              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <button
                className="primary-button"
                onClick={forgotPassword}
                disabled={busy}
              >
                {busy
                  ? "Mengirim..."
                  : "Kirim Link Reset"}
              </button>

              <button
                className="text-button"
                onClick={() => {
                  clearMessage();
                  setPage("login");
                }}
              >
                ← Kembali ke Login
              </button>
            </>
          )}

          <div className="auth-footer">
            <span>DINSTORE API</span>
            <span>Secure Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
