import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";

import {
  Menu,
  X,
  Home as HomeIcon,
  Sparkles,
  Shield,
  Database,
  Download,
  Wrench,
  LogIn,
  UserPlus,
  LogOut,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";

import { supabase } from "./lib/supabase";

/* =========================
   DATA
========================= */

const categories = [
  ["ai", "AI", Sparkles],
  ["admin", "ADMIN", Shield],
  ["cache", "CACHE", Database],
  ["download", "DOWNLOAD", Download],
  ["tools", "TOOLS", Wrench],
];

const endpoints = [
  ["ai", "AI Aiko", "/api/ai/aiko"],
  ["ai", "AI Lyrics Generator", "/api/ai/lyricsgen"],
  ["ai", "AI Coder", "/api/tools/aicoder"],
  ["ai", "Text To Image", "/api/ai/text2img"],

  ["admin", "Health", "/api/health"],
  ["admin", "Profile", "/api/me"],

  ["cache", "Cache Status", "/api/cache/status"],
  ["cache", "Cache Stats", "/api/cache/stats"],
  ["cache", "Cache Clear", "/api/cache/clear"],

  ["download", "TikTok", "/api/download/tiktok"],
  ["download", "Instagram", "/api/download/instagram"],
  ["download", "YouTube", "/api/download/youtube"],
  ["download", "Pinterest", "/api/download/pinterest"],
  ["download", "Spotify", "/api/download/spotify"],

  ["tools", "QRIS Generator", "/api/tools/qrisgen"],
  ["tools", "Short URL", "/api/tools/shorturl"],
  ["tools", "Screenshot", "/api/tools/screenshot"],
  ["tools", "IP Info", "/api/tools/ipinfo"],
].map(([cat, name, path]) => ({
  cat,
  name,
  path,
  method: "GET",
}));

/* =========================
   AUTH HOOK
========================= */

function useUser() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setUser(data.session?.user || null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return user;
}

/* =========================
   SIDEBAR
========================= */

function NavItem({ to, icon: Icon, label, close }) {
  return (
    <Link to={to} className="nav-item" onClick={close}>
      <Icon size={19} />
      <span>{label}</span>
    </Link>
  );
}

/* =========================
   LAYOUT
========================= */

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useUser();

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="logo">
          <span className="logo-box">D</span>
          <span>
            DINSTORE <b>API</b>
          </span>
        </Link>

        <div className="top-actions">
          {user ? (
            <Link to="/dashboard" className="member-btn">
              <User size={16} />
              MEMBER
            </Link>
          ) : (
            <Link to="/login" className="member-btn">
              <LogIn size={16} />
              LOGIN
            </Link>
          )}
        </div>
      </header>

      <div className="layout">
        <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
          <div className="sidebar-head">
            <div>
              <small>NAVIGATION</small>
              <strong>DINSTORE API</strong>
            </div>

            <button
              className="close-menu"
              onClick={() => setMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="sidebar-nav">
            <NavItem
              to="/"
              icon={HomeIcon}
              label="HOME"
              close={() => setMenuOpen(false)}
            />

            {categories.map(([id, label, Icon]) => (
              <NavItem
                key={id}
                to={`/docs/${id}`}
                icon={Icon}
                label={label}
                close={() => setMenuOpen(false)}
              />
            ))}

            <NavItem
              to="/dashboard"
              icon={User}
              label="MEMBER"
              close={() => setMenuOpen(false)}
            />
          </nav>

          <div className="sidebar-bottom">
            {user ? (
              <button onClick={logout}>
                <LogOut size={17} />
                LOGOUT
              </button>
            ) : (
              <Link to="/register">
                <UserPlus size={17} />
                DAFTAR
              </Link>
            )}
          </div>
        </aside>

        {menuOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

/* =========================
   LOGIN PAGE
========================= */

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginGoogle = async () => {
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  const loginEmail = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Email atau password salah.");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Link to="/" className="auth-logo">
          <span className="logo-box">D</span>
          DINSTORE <b>API</b>
        </Link>

        <div className="auth-label">
          MEMBER ACCESS
        </div>

        <h1>LOGIN MEMBER</h1>

        <p>
          Masuk untuk mengakses dashboard dan API key
          DINSTORE API.
        </p>

        <button
          className="google-btn"
          onClick={loginGoogle}
        >
          <span className="google-icon">G</span>
          Login dengan Google
        </button>

        <div className="divider">
          <span>ATAU</span>
        </div>

        <form onSubmit={loginEmail}>
          <label>
            Email

            <input
              type="email"
              placeholder="email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Password

            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </label>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <button
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "MEMPROSES..." : "LOGIN"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">
            Lupa password?
          </Link>

          <Link to="/register">
            Daftar akun
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================
   REGISTER
========================= */

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
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
      navigate("/dashboard");
      return;
    }

    setSuccess(
      "Akun berhasil dibuat. Silakan login."
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Link to="/" className="auth-logo">
          <span className="logo-box">D</span>
          DINSTORE <b>API</b>
        </Link>

        <div className="auth-label">
          MEMBER ACCESS
        </div>

        <h1>DAFTAR MEMBER</h1>

        <p>
          Buat akun DINSTORE API untuk mendapatkan
          akses member.
        </p>

        <form onSubmit={register}>

          <label>
            Nama

            <input
              type="text"
              placeholder="Nama kamu"
              required
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </label>

          <label>
            Email

            <input
              type="email"
              placeholder="email@example.com"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </label>

          <label>
            Password

            <input
              type="password"
              placeholder="Minimal 8 karakter"
              minLength={8}
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </label>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {success && (
            <div className="success-box">
              {success}
            </div>
          )}

          <button
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "MEMBUAT AKUN..."
              : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">
            Sudah punya akun?
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================
   FORGOT PASSWORD
========================= */

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            window.location.origin +
            "/reset-password",
        }
      );

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(
      "Link reset password sudah dikirim ke email."
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Link to="/" className="auth-logo">
          <span className="logo-box">D</span>
          DINSTORE <b>API</b>
        </Link>

        <div className="auth-label">
          ACCOUNT RECOVERY
        </div>

        <h1>LUPA PASSWORD</h1>

        <p>
          Masukkan email akun kamu untuk mendapatkan
          link reset password.
        </p>

        <form onSubmit={submit}>
          <label>
            Email

            <input
              type="email"
              placeholder="email@example.com"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </label>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {success && (
            <div className="success-box">
              {success}
            </div>
          )}

          <button className="primary-btn">
            KIRIM LINK RESET
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">
            ← Kembali ke login
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================
   RESET PASSWORD
========================= */

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Password berhasil diubah.");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Link to="/" className="auth-logo">
          <span className="logo-box">D</span>
          DINSTORE <b>API</b>
        </Link>

        <div className="auth-label">
          ACCOUNT RECOVERY
        </div>

        <h1>RESET PASSWORD</h1>

        <p>
          Masukkan password baru untuk akun kamu.
        </p>

        <form onSubmit={submit}>
          <label>
            Password Baru

            <input
              type="password"
              minLength={8}
              required
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </label>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {success && (
            <div className="success-box">
              {success}
            </div>
          )}

          <button className="primary-btn">
            SIMPAN PASSWORD
          </button>
        </form>
      </div>
    </div>
  );
}

/* =========================
   HOME
========================= */

function HomePage() {
  const user = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page">

      <section className="hero">
        <div className="terminal">
          ● TERMINAL ACTIVE
        </div>

        <h1>
          DINSTORE <span>API</span>
        </h1>

        <p>
          API modern untuk downloader, AI,
          automation dan berbagai tools.
        </p>
      </section>

      <section className="stats">

        <div className="stat-card">
          <small>CATEGORIES</small>
          <strong>5</strong>
        </div>

        <div className="stat-card">
          <small>ENDPOINTS</small>
          <strong className="green">
            {endpoints.length}+
          </strong>
        </div>

        <div className="stat-card full">
          <small>STATUS</small>
          <strong className="green">
            ONLINE
          </strong>
        </div>

      </section>

      <div className="welcome-box">
        <KeyRound size={20} />

        <div>
          <strong>
            Selamat datang di DINSTORE API
          </strong>

          <p>
            Pilih kategori API dari sidebar untuk
            melihat dokumentasi endpoint.
          </p>
        </div>
      </div>

      <div className="endpoint-grid">
        {endpoints.map((endpoint) => (
          <EndpointCard
            key={endpoint.path}
            endpoint={endpoint}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================
   ENDPOINT CARD
========================= */

function EndpointCard({ endpoint }) {
  return (
    <Link
      to={`/endpoint?path=${encodeURIComponent(
        endpoint.path
      )}`}
      className="endpoint-card"
    >
      <div className="endpoint-top">

        <span className="method">
          {endpoint.method}
        </span>

        <div className="endpoint-info">
          <h3>{endpoint.name}</h3>
          <code>{endpoint.path}</code>
        </div>

        <ArrowRight size={18} />
      </div>

      <p>
        DINSTORE API endpoint.
      </p>
    </Link>
  );
}

/* =========================
   DOCS
========================= */

function DocsPage({ id }) {
  const category =
    categories.find(
      (item) => item[0] === id
    );

  const list = endpoints.filter(
    (endpoint) => endpoint.cat === id
  );

  if (!category) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page">

      <div className="heading">
        <small>MODULE</small>

        <h1>{category[1]}</h1>

        <p>
          {list.length} endpoints tersedia
        </p>
      </div>

      <div className="endpoint-grid">
        {list.map((endpoint) => (
          <EndpointCard
            key={endpoint.path}
            endpoint={endpoint}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard() {
  const navigate = useNavigate();
  const user = useUser();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user === null) {
      navigate("/login");
      return;
    }

    if (!user) return;

    const loadProfile = async () => {
      const { data, error } =
        await supabase
          .from("profiles")
          .select(
            "name,email,api_key,status,role,created_at"
          )
          .eq("id", user.id)
          .single();

      if (error) {
        setError(error.message);
      } else {
        setProfile(data);
      }
    };

    loadProfile();
  }, [user, navigate]);

  if (user === undefined) {
    return (
      <div className="page">
        <div className="loading">
          MEMUAT DASHBOARD...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const copyKey = () => {
    if (profile?.api_key) {
      navigator.clipboard.writeText(
        profile.api_key
      );
    }
  };

  return (
    <div className="page">

      <small className="section-label">
        MEMBER PANEL
      </small>

      <h1 className="dashboard-title">
        Dashboard
      </h1>

      <p className="muted">
        {user.email}
      </p>

      <div className="dashboard-grid">

        <div className="dash-card">
          <small>NAMA</small>
          <strong>
            {profile?.name || "-"}
          </strong>
        </div>

        <div className="dash-card">
          <small>STATUS</small>
          <strong className="green">
            {profile?.status || "active"}
          </strong>
        </div>

        <div className="dash-card">
          <small>ROLE</small>
          <strong>
            {profile?.role || "member"}
          </strong>
        </div>

        <div className="dash-card">
          <small>JOINED</small>
          <strong>
            {profile?.created_at
              ? new Date(
                  profile.created_at
                ).toLocaleDateString("id-ID")
              : "-"}
          </strong>
        </div>

        <div className="dash-card key-card">
          <small>API KEY MEMBER</small>

          <code>
            {profile?.api_key ||
              "API KEY BELUM TERSEDIA"}
          </code>

          <button
            className="copy-btn"
            onClick={copyKey}
          >
            <Copy size={16} />
            COPY KEY
          </button>
        </div>

      </div>

      {error && (
        <div className="error-box dashboard-error">
          {error}
        </div>
      )}

      <div className="security-box">
        <div>
          <KeyRound size={19} />

          <span>
            API key member tersimpan di database
            Supabase.
          </span>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/login");
          }}
        >
          <LogOut size={16} />
          LOGOUT
        </button>
      </div>
    </div>
  );
}

/* =========================
   ENDPOINT
========================= */

function EndpointPage() {
  const params = new URLSearchParams(
    window.location.search
  );

  const path =
    params.get("path") || "/api/health";

  const endpoint = endpoints.find(
    (item) => item.path === path
  );

  const [copied, setCopied] = useState(false);

  const url =
    window.location.origin + path;

  const copy = () => {
    navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  return (
    <div className="page">

      <small className="section-label">
        DOCUMENTATION / ENDPOINT
      </small>

      <div className="endpoint-detail">

        <div className="detail-head">

          <span className="method">
            GET
          </span>

          <div>
            <h1>
              {endpoint?.name ||
                "API Endpoint"}
            </h1>

            <code>{path}</code>
          </div>

        </div>

        <p>
          Endpoint DINSTORE API. Gunakan API
          key member jika endpoint memerlukannya.
        </p>

        <div className="url-box">

          <span>{url}</span>

          <button onClick={copy}>
            {copied ? (
              <Check size={17} />
            ) : (
              <Copy size={17} />
            )}
          </button>

        </div>
      </div>
    </div>
  );
}

/* =========================
   APP
========================= */

export default function App() {
  const user = useUser();

  return (
    <Layout>

      <Routes>

        <Route
          path="/"
          element={
            user === undefined ? (
              <div className="loading-page">
                MEMUAT...
              </div>
            ) : (
              <HomePage />
            )
          }
        />

        {categories.map(([id]) => (
          <Route
            key={id}
            path={`/docs/${id}`}
            element={<DocsPage id={id} />}
          />
        ))}

        <Route
          path="/endpoint"
          element={
            user ? (
              <EndpointPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </Layout>
  );
}
