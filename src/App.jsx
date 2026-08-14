import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./style.css";

/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* =======================================================
     ENV ERROR
  ======================================================= */

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return <EnvError />;
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-logo">D</div>
        <div className="loading-text">DINSTORE API</div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  /* =======================================================
     AUTH
  ======================================================= */

  if (!session) {
    return <AuthPage />;
  }

  /* =======================================================
     DASHBOARD
  ======================================================= */

  return <Dashboard session={session} />;
}

/* =========================================================
   ENV ERROR
========================================================= */

function EnvError() {
  return (
    <div className="app">
      <div className="background-grid"></div>

      <div className="error-container">
        <div className="error-card">
          <div className="brand">
            <div className="brand-logo">D</div>
            <div>
              <strong>DINSTORE</strong>
              <span>API</span>
            </div>
          </div>

          <div className="error-icon">!</div>

          <h1>Supabase belum dikonfigurasi</h1>

          <p>
            Tambahkan dua Environment Variable berikut di project Vercel:
          </p>

          <div className="env-box">
            <div>VITE_SUPABASE_URL</div>
            <div>VITE_SUPABASE_ANON_KEY</div>
          </div>

          <p className="small">
            Setelah menambahkan Environment Variable, lakukan redeploy
            project di Vercel.
          </p>
        </div>
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

  async function handleLogin(e) {
    e.preventDefault();

    resetMessages();

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    resetMessages();

    if (!name || !email || !password) {
      setError("Nama, email dan password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      return;
    }

    setMessage(
      "Akun berhasil dibuat. Jika konfirmasi email aktif di Supabase, silakan cek email kamu."
    );
  }

  async function handleGoogleLogin() {
    resetMessages();
    setLoading(true);

    const redirectTo = window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setLoading(false);
      setError(error.message);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();

    resetMessages();

    if (!email) {
      setError("Masukkan email terlebih dahulu.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Link reset password sudah dikirim ke email kamu.");
  }

  /* =======================================================
     LOGIN
  ======================================================= */

  if (mode === "login") {
    return (
      <AuthLayout>
        <div className="auth-card">
          <Brand />

          <div className="auth-header">
            <span className="eyebrow">MEMBER ACCESS</span>
            <h1>LOGIN</h1>
            <p>Masuk ke akun DINSTORE API kamu.</p>
          </div>

          {error && <Alert type="error">{error}</Alert>}
          {message && <Alert type="success">{message}</Alert>}

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

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <button className="primary-btn" disabled={loading}>
              {loading ? "MEMPROSES..." : "LOGIN"}
            </button>
          </form>

          <button
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <GoogleIcon />
            <span>Login dengan Google</span>
          </button>

          <div className="auth-links">
            <button
              onClick={() => {
                resetMessages();
                setMode("forgot");
              }}
            >
              Lupa password?
            </button>
          </div>

          <div className="auth-bottom">
            Belum punya akun?

            <button
              onClick={() => {
                resetMessages();
                setMode("register");
              }}
            >
              Daftar sekarang
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  /* =======================================================
     REGISTER
  ======================================================= */

  if (mode === "register") {
    return (
      <AuthLayout>
        <div className="auth-card">
          <Brand />

          <div className="auth-header">
            <span className="eyebrow">MEMBER ACCESS</span>
            <h1>DAFTAR MEMBER</h1>
            <p>Buat akun baru dan dapatkan akses API.</p>
          </div>

          {error && <Alert type="error">{error}</Alert>}
          {message && <Alert type="success">{message}</Alert>}

          <form onSubmit={handleRegister}>
            <label>Nama</label>

            <input
              type="text"
              placeholder="Nama kamu"
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

            <input
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            <button className="primary-btn" disabled={loading}>
              {loading ? "MEMPROSES..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <button
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <GoogleIcon />
            <span>Daftar dengan Google</span>
          </button>

          <div className="auth-bottom">
            Sudah punya akun?

            <button
              onClick={() => {
                resetMessages();
                setMode("login");
              }}
            >
              Login
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  /* =======================================================
     FORGOT PASSWORD
  ======================================================= */

  return (
    <AuthLayout>
      <div className="auth-card">
        <Brand />

        <div className="auth-header">
          <span className="eyebrow">ACCOUNT RECOVERY</span>
          <h1>LUPA PASSWORD</h1>
          <p>Masukkan email untuk mendapatkan link reset password.</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}
        {message && <Alert type="success">{message}</Alert>}

        <form onSubmit={handleForgotPassword}>
          <label>Email</label>

          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <button className="primary-btn" disabled={loading}>
            {loading ? "MENGIRIM..." : "KIRIM LINK RESET"}
          </button>
        </form>

        <div className="auth-bottom">
          Ingat password?

          <button
            onClick={() => {
              resetMessages();
              setMode("login");
            }}
          >
            Kembali Login
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

/* =========================================================
   AUTH LAYOUT
========================================================= */

function AuthLayout({ children }) {
  return (
    <div className="app">
      <div className="background-grid"></div>

      <header className="topbar">
        <Brand />

        <div className="topbar-status">
          <span className="status-dot"></span>
          SYSTEM ONLINE
        </div>
      </header>

      <main className="auth-main">{children}</main>

      <div className="floating-orb">D</div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ session }) {
  const [active, setActive] = useState("home");
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Member";

  async function logout() {
    setLoggingOut(true);

    await supabase.auth.signOut();

    setLoggingOut(false);
  }

  return (
    <div className="dashboard">
      <div className="background-grid"></div>

      <header className="dashboard-topbar">
        <Brand />

        <div className="dashboard-user">
          <div className="user-info">
            <strong>{displayName}</strong>
            <span>{user?.email}</span>
          </div>

          <button onClick={logout} disabled={loggingOut}>
            {loggingOut ? "..." : "LOGOUT"}
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav>
            <SidebarButton
              icon="⌂"
              label="HOME"
              active={active === "home"}
              onClick={() => setActive("home")}
            />

            <SidebarButton
              icon="✦"
              label="AI"
              active={active === "ai"}
              onClick={() => setActive("ai")}
            />

            <SidebarButton
              icon="◈"
              label="ADMIN"
              active={active === "admin"}
              onClick={() => setActive("admin")}
            />

            <SidebarButton
              icon="▤"
              label="CACHE"
              active={active === "cache"}
              onClick={() => setActive("cache")}
            />

            <SidebarButton
              icon="↓"
              label="DOWNLOAD"
              active={active === "download"}
              onClick={() => setActive("download")}
            />

            <SidebarButton
              icon="⚒"
              label="TOOLS"
              active={active === "tools"}
              onClick={() => setActive("tools")}
            />

            <SidebarButton
              icon="♙"
              label="MEMBER"
              active={active === "member"}
              onClick={() => setActive("member")}
            />
          </nav>
        </aside>

        <main className="dashboard-main">
          {active === "home" && (
            <HomeContent user={user} displayName={displayName} />
          )}

          {active === "ai" && <SimplePage title="AI" />}
          {active === "admin" && <SimplePage title="ADMIN" />}
          {active === "cache" && <SimplePage title="CACHE" />}
          {active === "download" && <SimplePage title="DOWNLOAD" />}
          {active === "tools" && <SimplePage title="TOOLS" />}
          {active === "member" && (
            <MemberPage user={user} displayName={displayName} />
          )}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   HOME CONTENT
========================================================= */

function HomeContent({ user, displayName }) {
  return (
    <section className="content-wrapper">
      <div className="hero-card">
        <div className="hero-content">
          <span className="eyebrow">WELCOME MEMBER</span>

          <h1>
            HALO, <span>{displayName.toUpperCase()}</span>
          </h1>

          <p>
            Selamat datang di dashboard DINSTORE API.
            Semua layanan API tersedia dari sini.
          </p>

          <div className="hero-buttons">
            <button>EXPLORE API</button>
            <button className="secondary-btn">DOCUMENTATION</button>
          </div>
        </div>

        <div className="hero-orb-large">
          <span>D</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="ACCOUNT"
          value="ACTIVE"
          description="Akun kamu aktif"
        />

        <StatCard
          title="AUTH"
          value="SECURE"
          description="Supabase Authentication"
        />

        <StatCard
          title="API"
          value="ONLINE"
          description="DINSTORE API"
        />
      </div>

      <div className="content-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SYSTEM</span>
            <h2>System Information</h2>
          </div>

          <span className="online-badge">
            <span></span>
            ONLINE
          </span>
        </div>

        <div className="system-list">
          <div>
            <span>EMAIL</span>
            <strong>{user?.email || "-"}</strong>
          </div>

          <div>
            <span>USER ID</span>
            <strong className="mono">{user?.id || "-"}</strong>
          </div>

          <div>
            <span>AUTH PROVIDER</span>
            <strong>
              {user?.app_metadata?.provider || "email"}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MEMBER PAGE
========================================================= */

function MemberPage({ user, displayName }) {
  return (
    <section className="content-wrapper">
      <div className="page-title">
        <span className="eyebrow">MEMBER</span>
        <h1>PROFILE</h1>
        <p>Informasi akun kamu.</p>
      </div>

      <div className="content-card">
        <div className="profile-row">
          <div className="profile-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{displayName}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="system-list">
          <div>
            <span>EMAIL</span>
            <strong>{user?.email}</strong>
          </div>

          <div>
            <span>USER ID</span>
            <strong className="mono">{user?.id}</strong>
          </div>

          <div>
            <span>STATUS</span>
            <strong className="green">ACTIVE</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SIMPLE PAGE
========================================================= */

function SimplePage({ title }) {
  return (
    <section className="content-wrapper">
      <div className="page-title">
        <span className="eyebrow">DINSTORE API</span>
        <h1>{title}</h1>
        <p>Menu {title} sedang disiapkan.</p>
      </div>

      <div className="content-card empty-card">
        <div className="empty-icon">✦</div>
        <h2>{title}</h2>
        <p>Fitur akan tersedia di update berikutnya.</p>
      </div>
    </section>
  );
}

/* =========================================================
   SIDEBAR BUTTON
========================================================= */

function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button
      className={`sidebar-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="sidebar-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ title, value, description }) {
  return (
    <div className="stat-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{description}</small>
    </div>
  );
}

/* =========================================================
   BRAND
========================================================= */

function Brand() {
  return (
    <div className="brand">
      <div className="brand-logo">D</div>

      <div className="brand-name">
        <strong>DINSTORE</strong>
        <span>API</span>
      </div>
    </div>
  );
}

/* =========================================================
   ALERT
========================================================= */

function Alert({ type, children }) {
  return (
    <div className={`alert ${type}`}>
      {children}
    </div>
  );
}

/* =========================================================
   GOOGLE ICON
========================================================= */

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.68-.06-1.34-.18-1.97H12v3.73h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.15Z"
      />

      <path
        fill="#34A853"
        d="M12 21.99c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.99Z"
      />

      <path
        fill="#FBBC05"
        d="M6.53 14.07a5.86 5.86 0 0 1 0-3.75V7.79H3.28a9.99 9.99 0 0 0 0 8.81l3.25-2.53Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.29c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.38 14.63 2.01 12 2.01a9.74 9.74 0 0 0-8.72 5.78l3.25 2.53C7.3 8.01 9.46 6.29 12 6.29Z"
      />
    </svg>
  );
}
