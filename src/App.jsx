import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  X,
  Home,
  Sparkles,
  Shield,
  Database,
  Download,
  Wrench,
  Search,
  ArrowUpRight,
  KeyRound,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Copy,
  Check,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

import { Turnstile } from "@marsidev/react-turnstile";
import { supabase } from "./lib/supabase";

/* =========================================================
   CONFIG
========================================================= */

const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES = [
  ["ai", "AI", Sparkles],
  ["admin", "ADMIN", Shield],
  ["cache", "CACHE", Database],
  ["download", "DOWNLOAD", Download],
  ["tools", "TOOLS", Wrench],
];

/* =========================================================
   API ENDPOINTS
========================================================= */

const ENDPOINTS = [
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
  method: "GET",
  name,
  path,
}));

/* =========================================================
   AUTH USER HOOK
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
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user || null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return user;
}

/* =========================================================
   NAV ITEM
========================================================= */

function NavItem({
  to,
  icon: Icon,
  label,
  close,
}) {
  return (
    <NavLink
      to={to}
      onClick={close}
      className={({ isActive }) =>
        `nav ${isActive ? "active" : ""}`
      }
    >
      <Icon size={19} />
      <span>{label}</span>
    </NavLink>
  );
}

/* =========================================================
   MAIN SHELL
========================================================= */

function Shell({ children }) {
  const [open, setOpen] = useState(false);
  const user = useUser();

  return (
    <>
      {/* HEADER */}
      <header className="top">
        <button
          className="hamb"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu />
        </button>

        <Link className="brand" to="/">
          <i>D</i>
          DINSTORE
          <b>API</b>
        </Link>

        {user ? (
          <Link className="user" to="/dashboard">
            <User size={16} />
            MEMBER
          </Link>
        ) : (
          <Link className="user" to="/login">
            <LogIn size={16} />
            LOGIN
          </Link>
        )}
      </header>

      <div className="layout">

        {/* SIDEBAR */}
        <aside
          className={`side ${
            open ? "show" : ""
          }`}
        >
          <div className="sidehead">
            <div>
              <small>NAVIGATION</small>
              <strong>DINSTORE API</strong>
            </div>

            <button
              className="hamb close"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </div>

          <nav>
            <NavItem
              to="/"
              icon={Home}
              label="HOME"
              close={() => setOpen(false)}
            />

            {CATEGORIES.map(
              ([id, label, Icon]) => (
                <NavItem
                  key={id}
                  to={`/docs/${id}`}
                  icon={Icon}
                  label={label}
                  close={() => setOpen(false)}
                />
              )
            )}

            <NavItem
              to="/dashboard"
              icon={User}
              label="MEMBER"
              close={() => setOpen(false)}
            />
          </nav>

          <div className="sidebottom">
            {user ? (
              <button
                onClick={() =>
                  supabase.auth.signOut()
                }
              >
                <LogOut size={16} />
                LOGOUT
              </button>
            ) : (
              <Link
                to="/register"
                onClick={() => setOpen(false)}
              >
                <UserPlus size={16} />
                DAFTAR
              </Link>
            )}
          </div>
        </aside>

        {/* MOBILE OVERLAY */}
        {open && (
          <div
            className="overlay"
            onClick={() => setOpen(false)}
          />
        )}

        <main>{children}</main>
      </div>

      {/* FLOATING BOT */}
      <a
        className="float"
        href="https://wa.me/6287776581216"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        <span>W</span>
        <em />
      </a>
    </>
  );
}

/* =========================================================
   API CARD
========================================================= */

function ApiCard({ endpoint }) {
  return (
    <article className="card">
      <div className="cardtop">

        <span className="method">
          {endpoint.method}
        </span>

        <div>
          <h3>{endpoint.name}</h3>

          <code>
            {endpoint.path}
          </code>
        </div>

        <Link
          className="open"
          to={
            "/endpoint?path=" +
            encodeURIComponent(
              endpoint.path
            )
          }
        >
          OPEN
          <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="desc">
        API endpoint DINSTORE.
      </div>
    </article>
  );
}

/* =========================================================
   HOME
========================================================= */

function HomePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredEndpoints = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return ENDPOINTS.filter(
      (endpoint) => {
        const categoryMatch =
          filter === "all" ||
          endpoint.cat === filter;

        const searchMatch =
          !keyword ||
          `${endpoint.name} ${endpoint.path}`
            .toLowerCase()
            .includes(keyword);

        return (
          categoryMatch &&
          searchMatch
        );
      }
    );
  }, [search, filter]);

  return (
    <div className="page">

      {/* HERO */}
      <section className="hero">
        <div className="terminal">
          ● TERMINAL ACTIVE
        </div>

        <h1>
          DINSTORE{" "}
          <span>API</span>
        </h1>

        <p>
          API modern untuk aplikasi,
          automation, downloader, tools
          dan AI dengan akses member.
        </p>
      </section>

      {/* STATS */}
      <section className="stats">

        <div>
          <small>CATEGORIES</small>
          <b>{CATEGORIES.length}</b>
        </div>

        <div>
          <small>ENDPOINTS</small>
          <b className="green">
            {ENDPOINTS.length}+
          </b>
        </div>

        <div className="full">
          <small>STATUS</small>
          <b className="green">
            ONLINE
          </b>
        </div>

      </section>

      {/* MEMBER NOTICE */}
      <div className="notice">
        <KeyRound />

        <span>
          Login untuk mendapatkan{" "}
          <b>API KEY</b> member.
        </span>

        <Link to="/login">
          LOGIN →
        </Link>
      </div>

      {/* SEARCH */}
      <div className="search">
        <Search />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="SEARCH ENDPOINT / CATEGORY..."
        />
      </div>

      {/* FILTER */}
      <div className="filters">

        <button
          className={
            filter === "all"
              ? "sel"
              : ""
          }
          onClick={() =>
            setFilter("all")
          }
        >
          ALL ({ENDPOINTS.length})
        </button>

        {CATEGORIES.map(
          ([id, label]) => (
            <button
              key={id}
              className={
                filter === id
                  ? "sel"
                  : ""
              }
              onClick={() =>
                setFilter(id)
              }
            >
              {label}
            </button>
          )
        )}

      </div>

      {/* API GRID */}
      <div className="grid">
        {filteredEndpoints.map(
          (endpoint) => (
            <ApiCard
              key={endpoint.path}
              endpoint={endpoint}
            />
          )
        )}
      </div>

      {filteredEndpoints.length === 0 && (
        <div className="empty">
          <b>ENDPOINT TIDAK DITEMUKAN</b>
          <span>
            Coba gunakan kata kunci lain.
          </span>
        </div>
      )}

    </div>
  );
}

/* =========================================================
   DOCUMENTATION
========================================================= */

function DocsPage({ id }) {
  const category =
    CATEGORIES.find(
      ([categoryId]) =>
        categoryId === id
    ) || CATEGORIES[0];

  const endpoints =
    ENDPOINTS.filter(
      (endpoint) =>
        endpoint.cat === id
    );

  return (
    <div className="page">

      <div className="heading">
        <small>MODULE</small>

        <h1>
          {category[1]}
        </h1>

        <p>
          {endpoints.length} endpoints
        </p>
      </div>

      <div className="grid">
        {endpoints.map(
          (endpoint) => (
            <ApiCard
              key={endpoint.path}
              endpoint={endpoint}
            />
          )
        )}
      </div>

    </div>
  );
}

/* =========================================================
   AUTH WRAPPER
========================================================= */

function AuthPage({
  title,
  sub,
  children,
}) {
  return (
    <div className="auth">

      <div className="authcard">

        <div className="brand big">
          <i>D</i>
          DINSTORE
          <b>API</b>
        </div>

        <small>
          MEMBER ACCESS
        </small>

        <h1>{title}</h1>

        <p>{sub}</p>

        {children}

      </div>

    </div>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    setLoading(false);

    if (error) {
      setError(
        "Email atau password salah."
      );
      return;
    }

    navigate("/dashboard");
  };

  return (
    <AuthPage
      title="LOGIN MEMBER"
      sub="Masuk ke dashboard DINSTORE API."
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
            placeholder="email@example.com"
          />
        </label>

        <label>
          Password

          <div className="pass">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              required
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="••••••••"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword ? (
                <EyeOff />
              ) : (
                <Eye />
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
          className="primary"
          disabled={loading}
        >
          {loading
            ? "MEMPROSES..."
            : "LOGIN"}
        </button>

        <div className="links">
          <Link to="/forgot-password">
            Lupa sandi?
          </Link>

          <Link to="/register">
            Daftar
          </Link>
        </div>

      </form>
    </AuthPage>
  );
}

/* =========================================================
   REGISTER
========================================================= */

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [turnstileToken, setTurnstileToken] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const updateForm = (
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleRegister = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      TURNSTILE_SITE_KEY &&
      !turnstileToken
    ) {
      setError(
        "Selesaikan verifikasi Cloudflare Turnstile."
      );
      return;
    }

    setLoading(true);

    const { data, error } =
      await supabase.auth.signUp({
        email: form.email,
        password: form.password,

        options: {
          data: {
            name: form.name,
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
      "Akun berhasil dibuat. Silakan cek email untuk verifikasi."
    );
  };

  return (
    <AuthPage
      title="DAFTAR MEMBER"
      sub="Buat akun baru dan dapatkan API key otomatis."
    >
      <form onSubmit={handleRegister}>

        <label>
          Nama

          <input
            required
            value={form.name}
            onChange={(e) =>
              updateForm(
                "name",
                e.target.value
              )
            }
            placeholder="Nama kamu"
          />
        </label>

        <label>
          Email

          <input
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              updateForm(
                "email",
                e.target.value
              )
            }
            placeholder="email@example.com"
          />
        </label>

        <label>
          Password

          <input
            type="password"
            minLength={8}
            required
            value={form.password}
            onChange={(e) =>
              updateForm(
                "password",
                e.target.value
              )
            }
            placeholder="Minimal 8 karakter"
          />
        </label>

        {TURNSTILE_SITE_KEY && (
          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={
              setTurnstileToken
            }
            onExpire={() =>
              setTurnstileToken("")
            }
          />
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {success && (
          <div className="ok">
            {success}
          </div>
        )}

        <button
          className="primary"
          disabled={loading}
        >
          {loading
            ? "MEMBUAT..."
            : "CREATE ACCOUNT"}
        </button>

        <div className="links">
          <Link to="/login">
            Sudah punya akun?
          </Link>
        </div>

      </form>
    </AuthPage>
  );
}

/* =========================================================
   FORGOT PASSWORD
========================================================= */

function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleForgot = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

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

    setMessage(
      "Link reset password berhasil dikirim ke email."
    );
  };

  return (
    <AuthPage
      title="LUPA PASSWORD"
      sub="Link reset akan dikirim ke email."
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
            placeholder="email@example.com"
          />
        </label>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {message && (
          <div className="ok">
            {message}
          </div>
        )}

        <button className="primary">
          KIRIM LINK
        </button>

        <Link
          className="back"
          to="/login"
        >
          ← Kembali ke login
        </Link>

      </form>
    </AuthPage>
  );
}

/* =========================================================
   RESET PASSWORD
========================================================= */

function ResetPasswordPage() {
  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleReset = async (
    event
  ) => {
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
  };

  return (
    <AuthPage
      title="RESET PASSWORD"
      sub="Masukkan password baru."
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
              setPassword(
                e.target.value
              )
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
          <div className="ok">
            {message}
          </div>
        )}

        <button className="primary">
          SIMPAN PASSWORD
        </button>

      </form>
    </AuthPage>
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

    const loadProfile =
      async () => {
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
      };

    loadProfile();
  }, [user, navigate]);

  if (user === undefined) {
    return (
      <div className="page">
        <div className="loading">
          MEMUAT...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const copyApiKey = async () => {
    if (!profile?.api_key) return;

    await navigator.clipboard.writeText(
      profile.api_key
    );

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      1500
    );
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="page">

      <small>MEMBER PANEL</small>

      <h1>Dashboard</h1>

      <p className="muted">
        {profile?.email}
      </p>

      <div className="dash">

        <div>
          <small>NAMA</small>
          <b>
            {profile?.name || "-"}
          </b>
        </div>

        <div>
          <small>STATUS</small>
          <b className="green">
            {profile?.status ||
              "active"}
          </b>
        </div>

        <div>
          <small>ROLE</small>
          <b>
            {profile?.role ||
              "member"}
          </b>
        </div>

        <div>
          <small>JOINED</small>
          <b>
            {profile?.created_at
              ? new Date(
                  profile.created_at
                ).toLocaleDateString(
                  "id-ID"
                )
              : "-"}
          </b>
        </div>

        <div className="key">

          <small>
            API KEY MEMBER
          </small>

          <code>
            {profile?.api_key ||
              "API KEY BELUM TERSEDIA"}
          </code>

          <button
            onClick={copyApiKey}
          >
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

      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="security">

        <LockKeyhole size={18} />

        <span>
          API key dibuat otomatis
          oleh database.
        </span>

        <button onClick={logout}>
          LOGOUT
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   ENDPOINT DETAIL
========================================================= */

function EndpointPage() {
  const location =
    useLocation();

  const path =
    new URLSearchParams(
      location.search
    ).get("path") ||
    "/api/health";

  const endpoint =
    ENDPOINTS.find(
      (item) =>
        item.path === path
    );

  const [copied, setCopied] =
    useState(false);

  const url =
    window.location.origin +
    path;

  const copyUrl = async () => {
    await navigator.clipboard.writeText(
      url
    );

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      1200
    );
  };

  return (
    <div className="page">

      <small>
        DOCUMENTATION / ENDPOINT
      </small>

      <div className="detail">

        <div className="detailhead">

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
          Endpoint DINSTORE API.
          Gunakan API key member jika
          endpoint memerlukannya.
        </p>

        <div className="code">

          <span>{url}</span>

          <button
            onClick={copyUrl}
            aria-label="Copy URL"
          >
            {copied ? (
              <Check />
            ) : (
              <Copy />
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

        <Route
          path="/"
          element={<HomePage />}
        />

        {CATEGORIES.map(
          ([id]) => (
            <Route
              key={id}
              path={`/docs/${id}`}
              element={
                <DocsPage id={id} />
              }
            />
          )
        )}

        <Route
          path="/endpoint"
          element={<EndpointPage />}
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
          element={
            <ForgotPasswordPage />
          }
        />

        <Route
          path="/reset-password"
          element={
            <ResetPasswordPage />
          }
        />

        <Route
          path="/dashboard"
          element={
            <DashboardPage />
          }
        />

        <Route
          path="*"
          element={<HomePage />}
        />

      </Routes>

    </Shell>
  );
}
