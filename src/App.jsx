import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      const { data } = await supabase.auth.getSession();

      if (mounted) {
        setSession(data.session);
        setLoading(false);
      }
    }

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      setSession(newSession);

      if (event === "PASSWORD_RECOVERY") {
        setPage("reset");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function clearMessage() {
    setMessage("");
    setError("");
  }

  async function handleLogin(e) {
    e.preventDefault();

    clearMessage();

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setProcessing(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
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

  async function handleRegister(e) {
    e.preventDefault();

    clearMessage();

    if (!name || !email || !password) {
      setError("Nama, email dan password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setProcessing(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name.trim(),
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
        "Akun berhasil dibuat. Silakan cek email untuk verifikasi akun."
      );
      setPage("login");
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();

    clearMessage();

    if (!email) {
      setError("Masukkan email terlebih dahulu.");
      return;
    }

    setProcessing(true);

    const redirectUrl = `${window.location.origin}`;

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: redirectUrl,
      }
    );

    setProcessing(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Link reset password sudah dikirim. Silakan cek email kamu."
    );
  }

  async function handleResetPassword(e) {
    e.preventDefault();

    clearMessage();

    if (!newPassword) {
      setError("Masukkan password baru.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setProcessing(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setProcessing(false);

    if (error) {
      setError(error.message);
      return;
    }

    setNewPassword("");
    setMessage("Password berhasil diubah.");

    setTimeout(() => {
      setPage("login");
    }, 1200);
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    setSession(null);
    setEmail("");
    setPassword("");
    setName("");
    setMessage("");
    setError("");
    setPage("login");
  }

  function switchPage(nextPage) {
    clearMessage();
    setPage(nextPage);
    setPassword("");
    setNewPassword("");
  }

  if (loading) {
    return (
      <>
        <GlobalStyle />

        <div className="loading-screen">
          <div className="loading-logo">D</div>
          <div className="loading-title">DINSTORE API</div>
          <div className="loading-text">Memuat sistem...</div>
          <div className="loader"></div>
        </div>
      </>
    );
  }

  if (session) {
    const user = session.user;

    const displayName =
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "User";

    return (
      <>
        <GlobalStyle />

        <main className="app">
          <div className="glow glow-one"></div>
          <div className="glow glow-two"></div>

          <section className="dashboard-card">
            <div className="brand-logo">D</div>

            <div className="online-badge">
              <span></span>
              SYSTEM ONLINE
            </div>

            <h1>DINSTORE API</h1>

            <p className="dashboard-subtitle">
              Selamat datang kembali, <strong>{displayName}</strong>.
            </p>

            <div className="user-box">
              <div className="user-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="user-info">
                <small>ACCOUNT</small>
                <strong>{displayName}</strong>
                <span>{user.email}</span>
              </div>
            </div>

            <div className="dashboard-actions">
              <button
                className="primary-button"
                onClick={() => {
                  setMessage("Dashboard akan kita buat pada tahap berikutnya.");
                }}
              >
                DASHBOARD
              </button>

              <button className="logout-button" onClick={handleLogout}>
                LOGOUT
              </button>
            </div>

            {message && (
              <div className="success-message">
                ✓ {message}
              </div>
            )}
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />

      <main className="app">
        <div className="glow glow-one"></div>
        <div className="glow glow-two"></div>

        <section className="auth-card">
          <div className="brand-logo">D</div>

          <div className="brand-name">DINSTORE API</div>

          {page === "login" && (
            <>
              <h1>Welcome Back</h1>

              <p className="auth-description">
                Login untuk melanjutkan ke DINSTORE API.
              </p>

              <form onSubmit={handleLogin}>
                <label>Email</label>

                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />

                <label>Password</label>

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>

                <div className="forgot-row">
                  <button
                    type="button"
                    onClick={() => switchPage("forgot")}
                  >
                    Lupa Password?
                  </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {message && (
                  <div className="success-message">{message}</div>
                )}

                <button
                  type="submit"
                  className="primary-button auth-button"
                  disabled={processing}
                >
                  {processing ? "MEMPROSES..." : "LOGIN"}
                </button>
              </form>

              <div className="divider">
                <span>ATAU</span>
              </div>

              <button
                className="secondary-button"
                onClick={() => switchPage("register")}
              >
                BUAT AKUN
              </button>
            </>
          )}

          {page === "register" && (
            <>
              <h1>Create Account</h1>

              <p className="auth-description">
                Buat akun baru untuk menggunakan DINSTORE API.
              </p>

              <form onSubmit={handleRegister}>
                <label>Nama</label>

                <input
                  type="text"
                  placeholder="Nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />

                <label>Email</label>

                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />

                <label>Password</label>

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {message && (
                  <div className="success-message">{message}</div>
                )}

                <button
                  type="submit"
                  className="primary-button auth-button"
                  disabled={processing}
                >
                  {processing ? "MEMBUAT AKUN..." : "DAFTAR"}
                </button>
              </form>

              <div className="bottom-link">
                Sudah punya akun?
                <button onClick={() => switchPage("login")}>
                  Login
                </button>
              </div>
            </>
          )}

          {page === "forgot" && (
            <>
              <h1>Reset Password</h1>

              <p className="auth-description">
                Masukkan email akun kamu. Kami akan mengirimkan
                link untuk mengatur ulang password.
              </p>

              <form onSubmit={handleForgotPassword}>
                <label>Email</label>

                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />

                {error && <div className="error-message">{error}</div>}

                {message && (
                  <div className="success-message">{message}</div>
                )}

                <button
                  type="submit"
                  className="primary-button auth-button"
                  disabled={processing}
                >
                  {processing ? "MENGIRIM..." : "KIRIM LINK RESET"}
                </button>
              </form>

              <div className="bottom-link">
                Ingat password?
                <button onClick={() => switchPage("login")}>
                  Kembali Login
                </button>
              </div>
            </>
          )}

          {page === "reset" && (
            <>
              <h1>Password Baru</h1>

              <p className="auth-description">
                Masukkan password baru untuk akun kamu.
              </p>

              <form onSubmit={handleResetPassword}>
                <label>Password Baru</label>

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {message && (
                  <div className="success-message">{message}</div>
                )}

                <button
                  type="submit"
                  className="primary-button auth-button"
                  disabled={processing}
                >
                  {processing ? "MENYIMPAN..." : "UBAH PASSWORD"}
                </button>
              </form>
            </>
          )}
        </section>
      </main>
    </>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      * {
        box-sizing: border-box;
      }

      html,
      body,
      #root {
        margin: 0;
        padding: 0;
        width: 100%;
        min-height: 100%;
        font-family:
          Inter,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
        background: #020705;
        color: #f4f8f6;
      }

      body {
        min-height: 100vh;
      }

      button,
      input {
        font: inherit;
      }

      button {
        cursor: pointer;
      }

      .app {
        position: relative;
        min-height: 100vh;
        width: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px 18px;
        background:
          linear-gradient(
            rgba(1, 12, 9, 0.91),
            rgba(1, 12, 9, 0.96)
          ),
          repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 70px,
            rgba(55, 255, 175, 0.055) 71px,
            transparent 72px
          ),
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 70px,
            rgba(55, 255, 175, 0.055) 71px,
            transparent 72px
          );
      }

      .app::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(
            circle at 15% 15%,
            rgba(22, 255, 154, 0.11),
            transparent 30%
          ),
          radial-gradient(
            circle at 85% 80%,
            rgba(22, 255, 154, 0.07),
            transparent 30%
          );
      }

      .glow {
        position: absolute;
        width: 280px;
        height: 280px;
        border-radius: 50%;
        filter: blur(100px);
        pointer-events: none;
      }

      .glow-one {
        top: -120px;
        left: -100px;
        background: rgba(0, 255, 157, 0.08);
      }

      .glow-two {
        right: -120px;
        bottom: -100px;
        background: rgba(0, 255, 157, 0.07);
      }

      .auth-card,
      .dashboard-card {
        position: relative;
        z-index: 2;
        width: min(100%, 440px);
        padding: 34px 30px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 28px;
        background: rgba(5, 9, 8, 0.88);
        box-shadow:
          0 30px 100px rgba(0, 0, 0, 0.6),
          inset 0 1px 0 rgba(255, 255, 255, 0.035);
        backdrop-filter: blur(18px);
      }

      .brand-logo {
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        border-radius: 20px;
        background: #666;
        color: #030403;
        font-size: 42px;
        font-weight: 900;
      }

      .brand-name {
        margin-bottom: 28px;
        color: #7e8a86;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 4px;
      }

      h1 {
        margin: 0 0 10px;
        font-size: clamp(30px, 8vw, 42px);
        line-height: 1.05;
        letter-spacing: -1.5px;
      }

      .auth-description,
      .dashboard-subtitle {
        margin: 0 0 28px;
        color: #8f9b96;
        font-size: 15px;
        line-height: 1.7;
      }

      label {
        display: block;
        margin: 18px 0 8px;
        color: #b9c4c0;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
      }

      input {
        width: 100%;
        height: 54px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        outline: none;
        border-radius: 14px;
        padding: 0 16px;
        background: rgba(255, 255, 255, 0.045);
        color: #fff;
        transition: 0.2s ease;
      }

      input::placeholder {
        color: #68736f;
      }

      input:focus {
        border-color: #20e892;
        box-shadow: 0 0 0 3px rgba(32, 232, 146, 0.1);
      }

      .password-wrapper {
        position: relative;
      }

      .password-wrapper input {
        padding-right: 75px;
      }

      .show-password {
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
        border: 0;
        background: transparent;
        color: #20e892;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1px;
      }

      .forgot-row {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }

      .forgot-row button,
      .bottom-link button {
        border: 0;
        padding: 0;
        background: transparent;
        color: #20e892;
        font-size: 13px;
      }

      .primary-button,
      .secondary-button,
      .logout-button {
        width: 100%;
        min-height: 56px;
        border-radius: 15px;
        font-size: 14px;
        font-weight: 900;
        letter-spacing: 0.5px;
        transition: 0.2s ease;
      }

      .primary-button {
        border: 1px solid #20e892;
        background: #20e892;
        color: #03100a;
        box-shadow: 0 12px 30px rgba(32, 232, 146, 0.12);
      }

      .primary-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 16px 35px rgba(32, 232, 146, 0.2);
      }

      .primary-button:disabled {
        opacity: 0.55;
        cursor: wait;
      }

      .auth-button {
        margin-top: 20px;
      }

      .secondary-button {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.04);
        color: #fff;
      }

      .secondary-button:hover {
        border-color: rgba(32, 232, 146, 0.5);
      }

      .divider {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 25px 0;
        color: #59635f;
        font-size: 10px;
        letter-spacing: 2px;
      }

      .divider::before,
      .divider::after {
        content: "";
        height: 1px;
        flex: 1;
        background: rgba(255, 255, 255, 0.08);
      }

      .bottom-link {
        margin-top: 25px;
        text-align: center;
        color: #77827e;
        font-size: 13px;
      }

      .bottom-link button {
        margin-left: 6px;
      }

      .error-message,
      .success-message {
        margin-top: 15px;
        padding: 12px 14px;
        border-radius: 12px;
        font-size: 12px;
        line-height: 1.5;
      }

      .error-message {
        border: 1px solid rgba(255, 75, 75, 0.2);
        background: rgba(255, 50, 50, 0.08);
        color: #ff8d8d;
      }

      .success-message {
        border: 1px solid rgba(32, 232, 146, 0.2);
        background: rgba(32, 232, 146, 0.08);
        color: #55f5ac;
      }

      .online-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 18px;
        color: #20e892;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 2px;
      }

      .online-badge span {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #20e892;
        box-shadow: 0 0 12px #20e892;
      }

      .dashboard-card {
        text-align: left;
      }

      .dashboard-card h1 {
        margin-bottom: 12px;
      }

      .dashboard-subtitle strong {
        color: #fff;
      }

      .user-box {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 16px;
        margin-bottom: 18px;
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.035);
      }

      .user-avatar {
        width: 48px;
        height: 48px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
        background: #20e892;
        color: #03100a;
        font-size: 20px;
        font-weight: 900;
      }

      .user-info {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .user-info small {
        color: #65706b;
        font-size: 9px;
        letter-spacing: 2px;
      }

      .user-info strong {
        color: #fff;
        font-size: 14px;
      }

      .user-info span {
        overflow: hidden;
        color: #7d8883;
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dashboard-actions {
        display: grid;
        gap: 12px;
      }

      .logout-button {
        border: 1px solid rgba(255, 70, 70, 0.15);
        background: rgba(255, 50, 50, 0.035);
        color: #d86e6e;
      }

      .logout-button:hover {
        background: rgba(255, 50, 50, 0.08);
      }

      .loading-screen {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #020705;
        color: #fff;
      }

      .loading-logo {
        width: 65px;
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 18px;
        border-radius: 18px;
        background: #666;
        color: #050505;
        font-size: 38px;
        font-weight: 900;
      }

      .loading-title {
        font-weight: 800;
        letter-spacing: 3px;
      }

      .loading-text {
        margin-top: 8px;
        color: #6d7773;
        font-size: 13px;
      }

      .loader {
        width: 28px;
        height: 28px;
        margin-top: 20px;
        border: 3px solid rgba(255,255,255,0.1);
        border-top-color: #20e892;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 480px) {
        .app {
          padding: 18px 14px;
        }

        .auth-card,
        .dashboard-card {
          padding: 28px 20px;
          border-radius: 23px;
        }

        .brand-logo {
          width: 62px;
          height: 62px;
          font-size: 36px;
        }

        h1 {
          font-size: 32px;
        }
      }
    `}</style>
  );
}
