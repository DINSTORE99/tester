import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./style.css";

/* =========================================================
   SUPABASE
========================================================= */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <LoadingScreen />;
  }

  /* =======================================================
     SUPABASE CONFIG ERROR
  ======================================================= */

  if (!supabase) {
    return <ConfigError />;
  }

  /* =======================================================
     BELUM LOGIN
  ======================================================= */

  if (!session) {
    return <AuthPage />;
  }

  /* =======================================================
     SUDAH LOGIN
  ======================================================= */

  return <Dashboard session={session} />;
}

/* =========================================================
   LOADING SCREEN
========================================================= */

function LoadingScreen() {
  return (
    <div className="app-loading">
      <div className="loading-box">
        <div className="loading-logo">D</div>

        <div className="loading-title">
          DINSTORE API
        </div>

        <div className="loading-spinner" />

        <div className="loading-text">
          Memuat aplikasi...
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CONFIG ERROR
========================================================= */

function ConfigError() {
  return (
    <div className="app-loading">
      <div className="config-error">
        <div className="error-icon">!</div>

        <h2>Supabase belum dikonfigurasi</h2>

        <p>
          Tambahkan environment variable berikut di
          Vercel:
        </p>

        <div className="env-code">
          VITE_SUPABASE_URL
        </div>

        <div className="env-code">
          VITE_SUPABASE_ANON_KEY
        </div>

        <p className="small-text">
          Setelah menambahkan Environment Variables,
          lakukan redeploy di Vercel.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   AUTH PAGE
========================================================= */

function AuthPage() {
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function resetMessages() {
    setMessage("");
    setError("");
  }

  /* =======================================================
     LOGIN
  ======================================================= */

  async function handleLogin(e) {
    e.preventDefault();

    resetMessages();

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    setLoading(false);

    if (error) {
      setError(getAuthError(error));
      return;
    }
  }

  /* =======================================================
     REGISTER
  ======================================================= */

  async function handleRegister(e) {
    e.preventDefault();

    resetMessages();

    if (!name || !email || !password) {
      setError("Semua data wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password minimal 6 karakter."
      );
      return;
    }

    setLoading(true);

    const { data, error } =
      await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            full_name: name.trim(),
          },
        },
      });

    setLoading(false);

    if (error) {
      setError(getAuthError(error));
      return;
    }

    if (data.session) {
      return;
    }

    setMessage(
      "Akun berhasil dibuat. Silakan login."
    );

    setMode("login");
    setPassword("");
  }

  /* =======================================================
     GOOGLE LOGIN
  ======================================================= */

  async function handleGoogleLogin() {
    resetMessages();
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

    if (error) {
      setLoading(false);
      setError(getAuthError(error));
    }
  }

  /* =======================================================
     FORGOT PASSWORD
  ======================================================= */

  async function handleForgotPassword() {
    resetMessages();

    if (!email) {
      setError(
        "Masukkan email terlebih dahulu."
      );
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo:
            `${window.location.origin}/reset-password`,
        }
      );

    setLoading(false);

    if (error) {
      setError(getAuthError(error));
      return;
    }

    setMessage(
      "Link reset password sudah dikirim ke email."
    );
  }

  return (
    <div className="auth-page">

      {/* TOP BAR */}
      <header className="auth-header">

        <div className="brand">
          <div className="brand-logo">
            D
          </div>

          <div>
            <div className="brand-name">
              DINSTORE
            </div>

            <div className="brand-sub">
              API
            </div>
          </div>
        </div>

        <div className="status-pill">
          <span />
          ONLINE
        </div>

      </header>

      {/* AUTH CONTENT */}
      <main className="auth-main">

        <div className="auth-card">

          {/* LOGO */}
          <div className="auth-logo">
            D
          </div>

          <div className="auth-eyebrow">
            MEMBER ACCESS
          </div>

          <h1>
            {mode === "login"
              ? "LOGIN"
              : "DAFTAR MEMBER"}
          </h1>

          <p className="auth-description">
            {mode === "login"
              ? "Masuk ke akun DINSTORE API kamu."
              : "Buat akun baru dan dapatkan akses API."}
          </p>

          {/* GOOGLE */}
          <button
            type="button"
            className="google-button"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <span className="google-icon">
              G
            </span>

            <span>
              {loading
                ? "Memproses..."
                : "Lanjutkan dengan Google"}
            </span>
          </button>

          <div className="divider">
            <span />
            <b>ATAU</b>
            <span />
          </div>

          {/* FORM */}
          <form
            onSubmit={
              mode === "login"
                ? handleLogin
                : handleRegister
            }
          >

            {mode === "register" && (
              <div className="input-group">

                <label>Nama</label>

                <input
                  type="text"
                  placeholder="Nama kamu"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  autoComplete="name"
                />

              </div>
            )}

            <div className="input-group">

              <label>Email</label>

              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />

            </div>

            <div className="input-group">

              <label>Password</label>

              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
              />

            </div>

            {mode === "login" && (
              <button
                type="button"
                className="forgot-button"
                onClick={handleForgotPassword}
              >
                Lupa password?
              </button>
            )}

            {/* ERROR */}
            {error && (
              <div className="auth-alert error">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {message && (
              <div className="auth-alert success">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "MEMPROSES..."
                : mode === "login"
                ? "LOGIN"
                : "CREATE ACCOUNT"}
            </button>

          </form>

          {/* SWITCH */}
          <div className="switch-auth">

            {mode === "login" ? (
              <>
                Belum punya akun?

                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setMode("register");
                  }}
                >
                  Daftar sekarang
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?

                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setMode("login");
                  }}
                >
                  Login
                </button>
              </>
            )}

          </div>

        </div>

      </main>

      <footer className="auth-footer">
        © {new Date().getFullYear()} DINSTORE API
      </footer>

    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ session }) {
  const [active, setActive] = useState("home");
  const [mobileMenu, setMobileMenu] =
    useState(false);
  const [loggingOut, setLoggingOut] =
    useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    await supabase.auth.signOut();

    setLoggingOut(false);
  }

  const user =
    session?.user;

  const metadata =
    user?.user_metadata || {};

  const displayName =
    metadata.full_name ||
    metadata.name ||
    user?.email?.split("@")[0] ||
    "Member";

  const avatar =
    metadata.avatar_url ||
    metadata.picture ||
    "";

  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="dashboard-header">

        <div className="dashboard-brand">

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
          >
            ☰
          </button>

          <div className="brand-logo">
            D
          </div>

          <div>
            <div className="brand-name">
              DINSTORE
            </div>

            <div className="brand-sub">
              API
            </div>
          </div>

        </div>

        <div className="header-right">

          <div className="user-mini">

            {avatar ? (
              <img
                src={avatar}
                alt=""
              />
            ) : (
              <div className="avatar-placeholder">
                {displayName
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="user-mini-info">
              <strong>
                {displayName}
              </strong>

              <small>
                {user?.email}
              </small>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut
              ? "..."
              : "Logout"}
          </button>

        </div>

      </header>

      <div className="dashboard-body">

        {/* SIDEBAR */}
        <aside
          className={`sidebar ${
            mobileMenu
              ? "sidebar-open"
              : ""
          }`}
        >

          <nav>

            <SidebarItem
              icon="⌂"
              label="HOME"
              active={active === "home"}
              onClick={() => {
                setActive("home");
                setMobileMenu(false);
              }}
            />

            <SidebarItem
              icon="✦"
              label="AI"
              active={active === "ai"}
              onClick={() => {
                setActive("ai");
                setMobileMenu(false);
              }}
            />

            <SidebarItem
              icon="◇"
              label="ADMIN"
              active={active === "admin"}
              onClick={() => {
                setActive("admin");
                setMobileMenu(false);
              }}
            />

            <SidebarItem
              icon="▣"
              label="CACHE"
              active={active === "cache"}
              onClick={() => {
                setActive("cache");
                setMobileMenu(false);
              }}
            />

            <SidebarItem
              icon="⇩"
              label="DOWNLOAD"
              active={active === "download"}
              onClick={() => {
                setActive("download");
                setMobileMenu(false);
              }}
            />

            <SidebarItem
              icon="⚒"
              label="TOOLS"
              active={active === "tools"}
              onClick={() => {
                setActive("tools");
                setMobileMenu(false);
              }}
            />

            <SidebarItem
              icon="♙"
              label="MEMBER"
              active={active === "member"}
              onClick={() => {
                setActive("member");
                setMobileMenu(false);
              }}
            />

          </nav>

        </aside>

        {/* MAIN */}
        <main className="dashboard-main">

          {active === "home" && (
            <HomePage
              displayName={displayName}
              email={user?.email}
            />
          )}

          {active === "ai" && (
            <ComingPage
              title="AI"
              description="AI tools akan tersedia di halaman ini."
            />
          )}

          {active === "admin" && (
            <ComingPage
              title="ADMIN"
              description="Panel administrator DINSTORE API."
            />
          )}

          {active === "cache" && (
            <ComingPage
              title="CACHE"
              description="Kelola cache API."
            />
          )}

          {active === "download" && (
            <ComingPage
              title="DOWNLOAD"
              description="Daftar API downloader."
            />
          )}

          {active === "tools" && (
            <ComingPage
              title="TOOLS"
              description="Tools DINSTORE API."
            />
          )}

          {active === "member" && (
            <MemberPage
              displayName={displayName}
              email={user?.email}
              userId={user?.id}
            />
          )}

        </main>

      </div>

      {/* MOBILE OVERLAY */}
      {mobileMenu && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setMobileMenu(false)
          }
        />
      )}

      {/* CHAT BUTTON */}
      <button
        className="floating-button"
        type="button"
      >
        W
        <span />
      </button>

    </div>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon,
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`sidebar-item ${
        active
          ? "sidebar-item-active"
          : ""
      }`}
      onClick={onClick}
    >
      <span className="sidebar-icon">
        {icon}
      </span>

      <span>
        {label}
      </span>
    </button>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

function HomePage({
  displayName,
  email,
}) {
  return (
    <div className="page-content">

      <div className="welcome-card">

        <div className="eyebrow">
          DASHBOARD
        </div>

        <h1>
          Selamat datang,
          <br />
          <span>{displayName}</span>
        </h1>

        <p>
          Kamu berhasil login ke
          DINSTORE API.
        </p>

        <div className="email-badge">
          {email}
        </div>

      </div>

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            ◉
          </div>

          <div>
            <small>
              STATUS
            </small>

            <strong>
              ONLINE
            </strong>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            API
          </div>

          <div>
            <small>
              SERVICE
            </small>

            <strong>
              DINSTORE API
            </strong>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            ✓
          </div>

          <div>
            <small>
              ACCOUNT
            </small>

            <strong>
              VERIFIED
            </strong>
          </div>

        </div>

      </div>

      <div className="section-card">

        <div className="section-header">

          <div>
            <div className="eyebrow">
              SYSTEM
            </div>

            <h2>
              System Information
            </h2>
          </div>

          <div className="online-dot">
            <span />
            ONLINE
          </div>

        </div>

        <div className="system-list">

          <SystemRow
            label="API Status"
            value="Operational"
          />

          <SystemRow
            label="Authentication"
            value="Supabase Auth"
          />

          <SystemRow
            label="Frontend"
            value="Vite + React"
          />

          <SystemRow
            label="Hosting"
            value="Vercel"
          />

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   SYSTEM ROW
========================================================= */

function SystemRow({
  label,
  value,
}) {
  return (
    <div className="system-row">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

/* =========================================================
   MEMBER PAGE
========================================================= */

function MemberPage({
  displayName,
  email,
  userId,
}) {
  return (
    <div className="page-content">

      <div className="page-title">

        <div className="eyebrow">
          MEMBER
        </div>

        <h1>
          Profil Member
        </h1>

        <p>
          Informasi akun DINSTORE kamu.
        </p>

      </div>

      <div className="profile-card">

        <div className="profile-avatar">
          {displayName
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="profile-info">

          <div>
            <small>
              NAMA
            </small>

            <strong>
              {displayName}
            </strong>
          </div>

          <div>
            <small>
              EMAIL
            </small>

            <strong>
              {email}
            </strong>
          </div>

          <div>
            <small>
              USER ID
            </small>

            <code>
              {userId}
            </code>
          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   COMING PAGE
========================================================= */

function ComingPage({
  title,
  description,
}) {
  return (
    <div className="page-content">

      <div className="coming-card">

        <div className="coming-icon">
          D
        </div>

        <div className="eyebrow">
          DINSTORE API
        </div>

        <h1>
          {title}
        </h1>

        <p>
          {description}
        </p>

        <div className="coming-badge">
          COMING SOON
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   AUTH ERROR
========================================================= */

function getAuthError(error) {
  const message =
    error?.message || "";

  if (
    message
      .toLowerCase()
      .includes("invalid login credentials")
  ) {
    return "Email atau password salah.";
  }

  if (
    message
      .toLowerCase()
      .includes("email not confirmed")
  ) {
    return "Email belum dikonfirmasi.";
  }

  if (
    message
      .toLowerCase()
      .includes("user already registered")
  ) {
    return "Email sudah terdaftar.";
  }

  if (
    message
      .toLowerCase()
      .includes("password should be at least")
  ) {
    return "Password terlalu pendek.";
  }

  if (
    message
      .toLowerCase()
      .includes("provider is not enabled")
  ) {
    return "Login Google belum diaktifkan di Supabase.";
  }

  return message || "Terjadi kesalahan.";
}
