import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
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
  Search,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  Copy,
  Check,
  LayoutDashboard,
  Globe,
  Zap,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "./lib/supabase";

/* =========================================================
   DATA
========================================================= */

const categories = [
  {
    id: "ai",
    name: "AI",
    icon: Sparkles,
    description: "Artificial Intelligence API",
  },
  {
    id: "admin",
    name: "ADMIN",
    icon: Shield,
    description: "System & member API",
  },
  {
    id: "cache",
    name: "CACHE",
    icon: Database,
    description: "Cache management API",
  },
  {
    id: "download",
    name: "DOWNLOAD",
    icon: Download,
    description: "Downloader API",
  },
  {
    id: "tools",
    name: "TOOLS",
    icon: Wrench,
    description: "Utility tools API",
  },
];

const endpoints = [
  {
    category: "ai",
    name: "AI Aiko",
    path: "/api/ai/aiko",
    description: "AI conversation endpoint.",
  },
  {
    category: "ai",
    name: "AI Lyrics Generator",
    path: "/api/ai/lyricsgen",
    description: "Generate lyrics using AI.",
  },
  {
    category: "ai",
    name: "AI Coder",
    path: "/api/tools/aicoder",
    description: "AI coding assistant endpoint.",
  },
  {
    category: "ai",
    name: "Text To Image",
    path: "/api/ai/text2img",
    description: "Generate images from text prompts.",
  },
  {
    category: "admin",
    name: "Health",
    path: "/api/health",
    description: "Check API server status.",
  },
  {
    category: "admin",
    name: "Profile",
    path: "/api/me",
    description: "Get authenticated member profile.",
  },
  {
    category: "cache",
    name: "Cache Status",
    path: "/api/cache/status",
    description: "Check cache status.",
  },
  {
    category: "cache",
    name: "Cache Stats",
    path: "/api/cache/stats",
    description: "View cache statistics.",
  },
  {
    category: "cache",
    name: "Cache Clear",
    path: "/api/cache/clear",
    description: "Clear API cache.",
  },
  {
    category: "download",
    name: "TikTok",
    path: "/api/download/tiktok",
    description: "TikTok downloader endpoint.",
  },
  {
    category: "download",
    name: "Instagram",
    path: "/api/download/instagram",
    description: "Instagram downloader endpoint.",
  },
  {
    category: "download",
    name: "YouTube",
    path: "/api/download/youtube",
    description: "YouTube downloader endpoint.",
  },
  {
    category: "download",
    name: "Pinterest",
    path: "/api/download/pinterest",
    description: "Pinterest downloader endpoint.",
  },
  {
    category: "download",
    name: "Spotify",
    path: "/api/download/spotify",
    description: "Spotify downloader endpoint.",
  },
  {
    category: "tools",
    name: "QRIS Generator",
    path: "/api/tools/qrisgen",
    description: "Generate QRIS data.",
  },
  {
    category: "tools",
    name: "Short URL",
    path: "/api/tools/shorturl",
    description: "Create short URLs.",
  },
  {
    category: "tools",
    name: "Screenshot",
    path: "/api/tools/screenshot",
    description: "Website screenshot API.",
  },
  {
    category: "tools",
    name: "IP Info",
    path: "/api/tools/ipinfo",
    description: "Get IP information.",
  },
];

/* =========================================================
   AUTH HOOK
========================================================= */

function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setUser(data.session?.user ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return user;
}

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children }) {
  const user = useAuth();

  if (user === undefined) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">D</div>
        <div className="loading-text">MEMUAT DINSTORE...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =========================================================
   AUTH LAYOUT
========================================================= */

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="glow glow-one" />
        <div className="glow glow-two" />
        <div className="grid-background" />
      </div>

      <Link to="/" className="auth-brand">
        <span>D</span>
        <strong>DINSTORE</strong>
        <b>API</b>
      </Link>

      <div className="auth-content">{children}</div>

      <div className="auth-footer">
        © {new Date().getFullYear()} DINSTORE API
      </div>
    </div>
  );
}

/* =========================================================
   GOOGLE LOGIN
========================================================= */

function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginGoogle = async () => {
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="google-button"
        onClick={loginGoogle}
        disabled={loading}
      >
        <span className="google-icon">G</span>
        <span>
          {loading ? "MENGHUBUNGKAN..." : "Lanjutkan dengan Google"}
        </span>
      </button>

      {error && <div className="auth-error">{error}</div>}
    </>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
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

    navigate("/");
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-logo">
          <span>D</span>
        </div>

        <div className="auth-heading">
          <div className="eyebrow">MEMBER ACCESS</div>
          <h1>Selamat datang</h1>
          <p>Login untuk mengakses DINSTORE API.</p>
        </div>

        <GoogleButton />

        <div className="divider">
          <span>ATAU LOGIN DENGAN EMAIL</span>
        </div>

        <form onSubmit={submit} className="auth-form">
          <label>
            <span>Email</span>

            <div className="input-box">
              <Mail size={18} />

              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          <label>
            <span>Password</span>

            <div className="input-box">
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <div className="form-options">
            <Link to="/forgot-password">Lupa password?</Link>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="primary-button" disabled={loading}>
            {loading ? "MEMPROSES..." : "LOGIN"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-bottom">
          Belum punya akun?
          <Link to="/register"> Daftar sekarang</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

/* =========================================================
   REGISTER
========================================================= */

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
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
      navigate("/");
    } else {
      setSuccess(
        "Akun berhasil dibuat. Silakan cek email untuk verifikasi akun."
      );
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-logo">
          <span>D</span>
        </div>

        <div className="auth-heading">
          <div className="eyebrow">CREATE MEMBER</div>
          <h1>Buat akun</h1>
          <p>Daftar untuk mendapatkan akses API member.</p>
        </div>

        <GoogleButton />

        <div className="divider">
          <span>ATAU DAFTAR DENGAN EMAIL</span>
        </div>

        <form onSubmit={submit} className="auth-form">
          <label>
            <span>Nama</span>

            <div className="input-box">
              <User size={18} />

              <input
                type="text"
                placeholder="Nama kamu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </label>

          <label>
            <span>Email</span>

            <div className="input-box">
              <Mail size={18} />

              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          <label>
            <span>Password</span>

            <div className="input-box">
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && <div className="auth-error">{error}</div>}

          {success && <div className="auth-success">{success}</div>}

          <button className="primary-button" disabled={loading}>
            {loading ? "MEMBUAT AKUN..." : "DAFTAR"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-bottom">
          Sudah punya akun?
          <Link to="/login"> Login</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

/* =========================================================
   FORGOT PASSWORD
========================================================= */

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Link reset password sudah dikirim ke email kamu.");
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-logo">
          <span>?</span>
        </div>

        <div className="auth-heading">
          <div className="eyebrow">PASSWORD RECOVERY</div>
          <h1>Lupa password?</h1>
          <p>
            Masukkan email akun kamu dan kami akan mengirimkan link reset.
          </p>
        </div>

        <form onSubmit={submit} className="auth-form">
          <label>
            <span>Email</span>

            <div className="input-box">
              <Mail size={18} />

              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          {error && <div className="auth-error">{error}</div>}

          {success && <div className="auth-success">{success}</div>}

          <button className="primary-button" disabled={loading}>
            {loading ? "MENGIRIM..." : "KIRIM LINK RESET"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-bottom">
          <Link to="/login">← Kembali ke login</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

/* =========================================================
   RESET PASSWORD
========================================================= */

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Password tidak sama.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Password berhasil diubah.");

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-logo">
          <span>✓</span>
        </div>

        <div className="auth-heading">
          <div className="eyebrow">ACCOUNT SECURITY</div>
          <h1>Password baru</h1>
          <p>Buat password baru untuk akun DINSTORE kamu.</p>
        </div>

        <form onSubmit={submit} className="auth-form">
          <label>
            <span>Password baru</span>

            <div className="input-box">
              <Lock size={18} />

              <input
                type={show ? "text" : "password"}
                minLength={8}
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label>
            <span>Konfirmasi password</span>

            <div className="input-box">
              <Lock size={18} />

              <input
                type={show ? "text" : "password"}
                minLength={8}
                placeholder="Ulangi password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          </label>

          {error && <div className="auth-error">{error}</div>}

          {success && <div className="auth-success">{success}</div>}

          <button className="primary-button" disabled={loading}>
            {loading ? "MENYIMPAN..." : "SIMPAN PASSWORD"}
            {!loading && <Check size={18} />}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({ user, onMenu }) {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="header">
      <button className="mobile-menu" onClick={onMenu}>
        <Menu size={22} />
      </button>

      <Link to="/" className="brand">
        <span>D</span>
        <strong>DINSTORE</strong>
        <b>API</b>
      </Link>

      <div className="header-right">
        <Link to="/dashboard" className="member-button">
          <User size={16} />
          MEMBER
        </Link>

        <button className="logout-button" onClick={logout}>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({ open, close }) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={close} />}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <div>
            <small>NAVIGATION</small>
            <strong>DINSTORE API</strong>
          </div>

          <button onClick={close} className="sidebar-close">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" onClick={close}>
            <HomeIcon size={18} />
            HOME
          </Link>

          <div className="sidebar-label">MODULES</div>

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.id}
                to={`/docs/${category.id}`}
                onClick={close}
              >
                <Icon size={18} />
                {category.name}
                <span>›</span>
              </Link>
            );
          })}

          <div className="sidebar-label">MEMBER</div>

          <Link to="/dashboard" onClick={close}>
            <LayoutDashboard size={18} />
            DASHBOARD
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="online-dot" />

          <div>
            <strong>API ONLINE</strong>
            <small>All systems operational</small>
          </div>
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   APP SHELL
========================================================= */

function AppShell({ children }) {
  const user = useAuth();
  const [sidebar, setSidebar] = useState(false);

  if (user === undefined) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">D</div>
        <div className="loading-text">MEMUAT DINSTORE...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app">
      <Header user={user} onMenu={() => setSidebar(true)} />

      <div className="app-layout">
        <Sidebar open={sidebar} close={() => setSidebar(false)} />

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = endpoints.filter((endpoint) => {
    const matchCategory =
      filter === "all" || endpoint.category === filter;

    const text =
      `${endpoint.name} ${endpoint.path} ${endpoint.description}`.toLowerCase();

    return matchCategory && text.includes(search.toLowerCase());
  });

  return (
    <div className="page">
      <section className="hero">
        <div className="status-badge">
          <span />
          TERMINAL ACTIVE
        </div>

        <h1>
          DINSTORE <span>API</span>
        </h1>

        <p>
          API modern untuk aplikasi, automation, downloader,
          tools, AI dan berbagai kebutuhan developer.
        </p>

        <div className="hero-actions">
          <a href="#endpoints" className="hero-primary">
            Explore API
            <ArrowRight size={18} />
          </a>

          <Link to="/dashboard" className="hero-secondary">
            Dashboard
          </Link>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <Globe size={21} />
          <small>CATEGORIES</small>
          <strong>{categories.length}</strong>
        </div>

        <div className="stat-card">
          <Zap size={21} />
          <small>ENDPOINTS</small>
          <strong>{endpoints.length}+</strong>
        </div>

        <div className="stat-card">
          <ShieldCheck size={21} />
          <small>STATUS</small>
          <strong className="green">ONLINE</strong>
        </div>
      </section>

      <section className="api-banner">
        <div className="api-banner-icon">
          <KeyRound size={22} />
        </div>

        <div>
          <strong>API KEY MEMBER</strong>
          <p>
            Gunakan API key member untuk endpoint yang membutuhkan
            autentikasi.
          </p>
        </div>

        <Link to="/dashboard">
          LIHAT KEY
          <ArrowRight size={16} />
        </Link>
      </section>

      <section className="endpoint-section" id="endpoints">
        <div className="section-heading">
          <div>
            <div className="eyebrow">API DOCUMENTATION</div>
            <h2>Endpoints</h2>
            <p>Explore semua endpoint DINSTORE API.</p>
          </div>
        </div>

        <div className="search-box">
          <Search size={19} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search endpoint..."
          />
        </div>

        <div className="filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            ALL
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              className={filter === category.id ? "active" : ""}
              onClick={() => setFilter(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="endpoint-grid">
          {filtered.map((endpoint) => (
            <EndpointCard
              key={endpoint.path}
              endpoint={endpoint}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   ENDPOINT CARD
========================================================= */

function EndpointCard({ endpoint }) {
  return (
    <Link
      className="endpoint-card"
      to={`/endpoint?path=${encodeURIComponent(endpoint.path)}`}
    >
      <div className="endpoint-top">
        <span className="method">GET</span>

        <span className="endpoint-category">
          {endpoint.category.toUpperCase()}
        </span>
      </div>

      <h3>{endpoint.name}</h3>

      <code>{endpoint.path}</code>

      <p>{endpoint.description}</p>

      <div className="endpoint-open">
        OPEN ENDPOINT
        <ArrowRight size={15} />
      </div>
    </Link>
  );
}

/* =========================================================
   DOCS
========================================================= */

function Docs({ id }) {
  const category = categories.find((item) => item.id === id);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const Icon = category.icon;

  const list = endpoints.filter(
    (endpoint) => endpoint.category === id
  );

  return (
    <div className="page">
      <div className="docs-header">
        <div className="docs-icon">
          <Icon size={28} />
        </div>

        <div>
          <div className="eyebrow">MODULE</div>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>
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
   ENDPOINT DETAIL
========================================================= */

function Endpoint() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const path = params.get("path") || "/api/health";

  const endpoint = endpoints.find(
    (item) => item.path === path
  );

  const [copied, setCopied] = useState(false);

  const url = window.location.origin + path;

  const copy = async () => {
    await navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="page">
      <Link to="/" className="back-link">
        ← Kembali ke dokumentasi
      </Link>

      <div className="endpoint-detail">
        <div className="detail-method">GET</div>

        <div className="eyebrow">API ENDPOINT</div>

        <h1>{endpoint?.name || "API Endpoint"}</h1>

        <code className="detail-path">{path}</code>

        <p>
          {endpoint?.description ||
            "DINSTORE API endpoint."}
        </p>

        <div className="request-box">
          <div className="request-head">
            <span>REQUEST URL</span>

            <button onClick={copy}>
              {copied ? (
                <>
                  <Check size={15} />
                  COPIED
                </>
              ) : (
                <>
                  <Copy size={15} />
                  COPY
                </>
              )}
            </button>
          </div>

          <code>{url}</code>
        </div>

        <div className="info-box">
          <KeyRound size={19} />

          <div>
            <strong>Authentication</strong>

            <p>
              Endpoint tertentu membutuhkan API key
              member dari dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const user = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select(
          "id,name,email,api_key,status,role,created_at"
        )
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const apiKey = profile?.api_key || "";

  const copyKey = async () => {
    if (!apiKey) return;

    await navigator.clipboard.writeText(apiKey);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="page">
      <div className="dashboard-header">
        <div>
          <div className="eyebrow">MEMBER PANEL</div>
          <h1>Dashboard</h1>
          <p>Kelola akun dan API key kamu.</p>
        </div>

        <div className="profile-avatar">
          {(profile?.name ||
            user?.email ||
            "D")[0].toUpperCase()}
        </div>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          MEMUAT PROFILE...
        </div>
      ) : (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <small>NAMA</small>
              <strong>{profile?.name || "-"}</strong>
            </div>

            <div className="dashboard-card">
              <small>EMAIL</small>
              <strong>
                {profile?.email || user?.email || "-"}
              </strong>
            </div>

            <div className="dashboard-card">
              <small>STATUS</small>
              <strong className="green">
                {profile?.status || "active"}
              </strong>
            </div>

            <div className="dashboard-card">
              <small>ROLE</small>
              <strong>
                {profile?.role || "member"}
              </strong>
            </div>
          </div>

          <div className="api-key-card">
            <div className="api-key-head">
              <div>
                <div className="eyebrow">YOUR API KEY</div>
                <h2>Member API Key</h2>
              </div>

              <KeyRound size={24} />
            </div>

            <div className="api-key-value">
              {apiKey || "API KEY BELUM TERSEDIA"}
            </div>

            <button
              className="copy-key"
              onClick={copyKey}
              disabled={!apiKey}
            >
              {copied ? (
                <>
                  <Check size={17} />
                  COPIED
                </>
              ) : (
                <>
                  <Copy size={17} />
                  COPY API KEY
                </>
              )}
            </button>
          </div>

          <div className="security-card">
            <ShieldCheck size={22} />

            <div>
              <strong>Account secured</strong>
              <p>
                Data akun dikelola melalui Supabase
                Authentication.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

function MainApp() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* PROTECTED APP */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell>
              <Routes>
                <Route path="/" element={<Home />} />

                {categories.map((category) => (
                  <Route
                    key={category.id}
                    path={`/docs/${category.id}`}
                    element={<Docs id={category.id} />}
                  />
                ))}

                <Route
                  path="/endpoint"
                  element={<Endpoint />}
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
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}
