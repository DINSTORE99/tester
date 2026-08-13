import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
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
  Eye,
  EyeOff,
  Copy,
  Check,
  KeyRound,
  LockKeyhole,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

import { supabase } from "./lib/supabase";

/* =========================================================
   DATA
========================================================= */

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

/* =========================================================
   AUTH HOOK
========================================================= */

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

/* =========================================================
   NAVIGATION
========================================================= */

function NavigationItem({ to, icon: Icon, label, close }) {
  return (
    <NavLink
      to={to}
      onClick={close}
      className={({ isActive }) =>
        `nav-item ${isActive ? "active" : ""}`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}

/* =========================================================
   SHELL
========================================================= */

function Shell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useUser();

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app">

      <header className="topbar">

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={21} />
        </button>

        <Link to="/" className="brand">
          <span className="brand-icon">D</span>

          <span>
            DINSTORE <b>API</b>
          </span>
        </Link>

        {user ? (
          <Link className="top-user" to="/dashboard">
            <User size={16} />
            MEMBER
          </Link>
        ) : (
          <Link className="top-user" to="/login">
            <LogIn size={16} />
            LOGIN
          </Link>
        )}

      </header>

      <div className="layout">

        <aside className={`sidebar ${menuOpen ? "show" : ""}`}>

          <div className="sidebar-head">

            <div>
              <small>NAVIGATION</small>
              <strong>DINSTORE API</strong>
            </div>

            <button
              className="mobile-menu close"
              onClick={closeMenu}
            >
              <X size={21} />
            </button>

          </div>

          <nav>

            <NavigationItem
              to="/"
              icon={HomeIcon}
              label="HOME"
              close={closeMenu}
            />

            {categories.map(([id, label, Icon]) => (
              <NavigationItem
                key={id}
                to={`/docs/${id}`}
                icon={Icon}
                label={label}
                close={closeMenu}
              />
            ))}

            <NavigationItem
              to="/dashboard"
              icon={User}
              label="MEMBER"
              close={closeMenu}
            />

          </nav>

          <div className="sidebar-bottom">

            {user ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  closeMenu();
                }}
              >
                <LogOut size={16} />
                LOGOUT
              </button>
            ) : (
              <Link to="/register" onClick={closeMenu}>
                <UserPlus size={16} />
                DAFTAR
              </Link>
            )}

          </div>

        </aside>

        {menuOpen && (
          <div
            className="overlay"
            onClick={closeMenu}
          />
        )}

        <main className="main">
          {children}
        </main>

      </div>

    </div>
  );
}

/* =========================================================
   ENDPOINT CARD
========================================================= */

function EndpointCard({ endpoint }) {
  return (
    <article className="endpoint-card">

      <div className="endpoint-top">

        <span className="method">
          {endpoint.method}
        </span>

        <div className="endpoint-info">
          <h3>{endpoint.name}</h3>
          <code>{endpoint.path}</code>
        </div>

        <Link
          className="open-endpoint"
          to={`/endpoint?path=${encodeURIComponent(
            endpoint.path
          )}`}
        >
          OPEN
          <ArrowUpRight size={15} />
        </Link>

      </div>

      <p>
        API endpoint DINSTORE untuk kebutuhan aplikasi,
        automation dan integrasi.
      </p>

    </article>
  );
}

/* =========================================================
   HOME
========================================================= */

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
          API modern untuk aplikasi, automation,
          downloader, tools dan AI.
        </p>

      </section>

      <section className="stats">

        <div>
          <small>CATEGORIES</small>
          <strong>5</strong>
        </div>

        <div>
          <small>ENDPOINTS</small>
          <strong className="green">
            {endpoints.length}+
          </strong>
        </div>

        <div>
          <small>STATUS</small>
          <strong className="green">
            ONLINE
          </strong>
        </div>

      </section>

      <div className="notice">

        <KeyRound size={18} />

        <span>
          Gunakan API KEY member untuk mengakses API.
        </span>

        <Link to="/dashboard">
          DASHBOARD →
        </Link>

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

/* =========================================================
   DOCS
========================================================= */

function DocsPage({ id }) {
  const category =
    categories.find((item) => item[0] === id) ||
    categories[0];

  const list = endpoints.filter(
    (endpoint) => endpoint.cat === id
  );

  return (
    <div className="page">

      <div className="heading">
        <small>MODULE</small>
        <h1>{category[1]}</h1>
        <p>{list.length} endpoints</p>
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

/* =========================================================
   AUTH LAYOUT
========================================================= */

function AuthLayout({ title, description, children }) {
  return (
    <div className="auth-page">

      <div className="auth-card">

        <Link to="/" className="auth-brand">
          <span className="brand-icon">D</span>
          DINSTORE <b>API</b>
        </Link>

        <small>MEMBER ACCESS</small>

        <h1>{title}</h1>

        <p>{description}</p>

        {children}

      </div>

    </div>
  );
}

/* =========================================================
   GOOGLE LOGIN
========================================================= */

async function loginWithGoogle() {
  const { error } =
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

  return error;
}

/* =========================================================
   LOGIN
========================================================= */

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] =
    useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      setError("Email atau password salah.");
      return;
    }

    navigate("/dashboard");
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);

    const error = await loginWithGoogle();

    if (error) {
      setGoogleLoading(false);
      setError(error.message);
    }
  }

  return (
    <AuthLayout
      title="LOGIN MEMBER"
      description="Masuk ke dashboard DINSTORE API."
    >

      <form onSubmit={handleLogin}>

        <label>
          Email

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="email@gmail.com"
          />

        </label>

        <label>
          Password

          <div className="password-box">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>

          </div>

        </label>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <button
          className="primary-button"
          disabled={loading}
        >
          {loading ? "MEMPROSES..." : "LOGIN"}
        </button>

        <div className="divider">
          <span>ATAU</span>
        </div>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogle}
          disabled={googleLoading}
        >
          <span className="google-icon">
            G
          </span>

          {googleLoading
            ? "MENGHUBUNGKAN..."
            : "LOGIN DENGAN GOOGLE"}
        </button>

        <div className="auth-links">

          <Link to="/forgot-password">
            Lupa password?
          </Link>

          <Link to="/register">
            Daftar akun
          </Link>

        </div>

      </form>

    </AuthLayout>
  );
}

/* =========================================================
   REGISTER
========================================================= */

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const { data, error } =
      await supabase.auth.signUp({
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
  }

  return (
    <AuthLayout
      title="DAFTAR MEMBER"
      description="Buat akun baru untuk mendapatkan akses member."
    >

      <form onSubmit={handleRegister}>

        <label>
          Nama

          <input
            required
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Nama kamu"
          />

        </label>

        <label>
          Email

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="email@gmail.com"
          />

        </label>

        <label>
          Password

          <input
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Minimal 8 karakter"
          />

        </label>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {success && (
          <div className="success">
            {success}
          </div>
        )}

        <button
          className="primary-button"
          disabled={loading}
        >
          {loading
            ? "MEMBUAT AKUN..."
            : "CREATE ACCOUNT"}
        </button>

        <div className="auth-links">

          <Link to="/login">
            Sudah punya akun?
          </Link>

        </div>

      </form>

    </AuthLayout>
  );
}

/* =========================================================
   FORGOT PASSWORD
========================================================= */

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleForgot(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            `${window.location.origin}/reset-password`,
        }
      );

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Link reset password berhasil dikirim."
    );
  }

  return (
    <AuthLayout
      title="LUPA PASSWORD"
      description="Masukkan email untuk mendapatkan link reset."
    >

      <form onSubmit={handleForgot}>

        <label>
          Email

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="email@gmail.com"
          />

        </label>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {message && (
          <div className="success">
            {message}
          </div>
        )}

        <button className="primary-button">
          KIRIM LINK
        </button>

        <Link
          className="back-link"
          to="/login"
        >
          ← Kembali ke login
        </Link>

      </form>

    </AuthLayout>
  );
}

/* =========================================================
   RESET PASSWORD
========================================================= */

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleReset(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Password berhasil diubah."
    );
  }

  return (
    <AuthLayout
      title="RESET PASSWORD"
      description="Masukkan password baru kamu."
    >

      <form onSubmit={handleReset}>

        <label>
          Password baru

          <input
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Minimal 8 karakter"
          />

        </label>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {message && (
          <div className="success">
            {message}
          </div>
        )}

        <button className="primary-button">
          SIMPAN PASSWORD
        </button>

      </form>

    </AuthLayout>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardPage() {
  const navigate = useNavigate();
  const user = useUser();

  const [profile, setProfile] =
    useState(null);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  useEffect(() => {

    if (user === null) {
      navigate("/login");
      return;
    }

    if (!user) return;

    async function loadProfile() {

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
        return;
      }

      setProfile(data);
    }

    loadProfile();

  }, [user, navigate]);

  if (user === undefined) {
    return (
      <div className="loading">
        MEMUAT...
      </div>
    );
  }

  if (!user) return null;

  async function copyKey() {
    if (!profile?.api_key) return;

    await navigator.clipboard.writeText(
      profile.api_key
    );

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      1500
    );
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="page">

      <small>MEMBER PANEL</small>

      <h1>Dashboard</h1>

      <p className="muted">
        {user.email}
      </p>

      <div className="dashboard-grid">

        <div className="dashboard-box">
          <small>NAMA</small>
          <strong>
            {profile?.name || "-"}
          </strong>
        </div>

        <div className="dashboard-box">
          <small>STATUS</small>
          <strong className="green">
            {profile?.status || "active"}
          </strong>
        </div>

        <div className="dashboard-box">
          <small>ROLE</small>
          <strong>
            {profile?.role || "member"}
          </strong>
        </div>

        <div className="dashboard-box">
          <small>JOINED</small>
          <strong>
            {profile?.created_at
              ? new Date(
                  profile.created_at
                ).toLocaleDateString("id-ID")
              : "-"}
          </strong>
        </div>

      </div>

      <div className="api-key-box">

        <div>
          <small>API KEY MEMBER</small>

          <code>
            {profile?.api_key || "-"}
          </code>
        </div>

        <button onClick={copyKey}>

          {copied ? (
            <Check size={16} />
          ) : (
            <Copy size={16} />
          )}

          {copied
            ? "COPIED"
            : "COPY KEY"}

        </button>

      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="security-box">

        <LockKeyhole size={18} />

        <span>
          API key dibuat otomatis oleh database.
        </span>

        <button onClick={logout}>
          LOGOUT
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   ENDPOINT
========================================================= */

function EndpointPage() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const path =
    params.get("path") ||
    "/api/health";

  const endpoint =
    endpoints.find(
      (item) => item.path === path
    );

  const [copied, setCopied] =
    useState(false);

  const url =
    window.location.origin + path;

  async function copyUrl() {
    await navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      1200
    );
  }

  return (
    <div className="page">

      <small>
        DOCUMENTATION / ENDPOINT
      </small>

      <div className="endpoint-detail">

        <div className="detail-head">

          <span className="method">
            {endpoint?.method || "GET"}
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
          Endpoint DINSTORE API.
          Gunakan API key member jika
          endpoint membutuhkan autentikasi.
        </p>

        <div className="url-box">

          <code>{url}</code>

          <button onClick={copyUrl}>
            {copied ? (
              <Check size={16} />
            ) : (
              <Copy size={16} />
            )}
          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <Shell>

      <Routes>

        {/* DEFAULT LANGSUNG LOGIN */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/home"
          element={<HomePage />}
        />

        {categories.map(([id]) => (
          <Route
            key={id}
            path={`/docs/${id}`}
            element={
              <ProtectedRoute>
                <DocsPage id={id} />
              </ProtectedRoute>
            }
          />
        ))}

        <Route
          path="/endpoint"
          element={
            <ProtectedRoute>
              <EndpointPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </Shell>
  );
}

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children }) {
  const user = useUser();

  if (user === undefined) {
    return (
      <div className="loading">
        MEMUAT...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}
