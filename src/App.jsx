import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import "./style.css";

const API_BASE = "";

const API_DATA = [
  {
    id: "ai",
    name: "AI",
    icon: "✦",
    description: "Artificial Intelligence & Chat",
    endpoints: [
      {
        method: "POST",
        path: "/api/ai/chatgpt",
        description: "Chat with AI",
        body: { message: "Halo, siapa kamu?" },
      },
    ],
  },
  {
    id: "download",
    name: "DOWNLOAD",
    icon: "♧",
    description: "Social media downloader",
    endpoints: [
      {
        method: "GET",
        path: "/api/download/tiktok",
        description: "Download video TikTok",
        query: "url=https://vt.tiktok.com/example",
      },
    ],
  },
  {
    id: "tools",
    name: "TOOLS",
    icon: "⌘",
    description: "Utility & developer tools",
    endpoints: [
      {
        method: "GET",
        path: "/api/tools/domaininfo",
        description: "Domain information",
        query: "domain=example.com",
      },
      {
        method: "POST",
        path: "/api/tools/aicoder",
        description: "AI coding assistant",
        body: { prompt: "Buat fungsi JavaScript sederhana" },
      },
    ],
  },
  {
    id: "search",
    name: "SEARCH",
    icon: "⌕",
    description: "Search utilities",
    endpoints: [],
  },
];

function getUserName(user) {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Member"
  );
}

function getInitial(user) {
  return getUserName(user).charAt(0).toUpperCase();
}

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMessage("");

    if (!email || (!password && mode !== "forgot")) {
      setMessage("Lengkapi data terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }

      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) throw error;

        if (!data.session) {
          setMessage(
            "Akun berhasil dibuat. Silakan cek email untuk verifikasi."
          );
        }
      }

      if (mode === "forgot") {
        const redirectTo = `${window.location.origin}`;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo,
        });

        if (error) throw error;

        setMessage("Link reset password sudah dikirim ke email.");
      }

      if (mode !== "forgot") {
        onLogin?.();
      }
    } catch (error) {
      setMessage(error?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  async function googleLogin() {
    setMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error) {
      setMessage(error?.message || "Login Google gagal.");
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-grid" />

      <section className="auth-card">
        <div className="auth-logo">
          <div className="logo-orb">D</div>
        </div>

        <div className="auth-brand">DIN API 🔥</div>

        <div className="terminal-status">
          <span />
          SYSTEM ONLINE
        </div>

        <div className="auth-heading">
          <span>WELCOME TO</span>
          <h1>DIN API</h1>
          <p>
            API platform untuk aplikasi modern dengan akses cepat,
            sederhana, dan aman.
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
          >
            LOGIN
          </button>

          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setMode("register");
              setMessage("");
            }}
          >
            DAFTAR
          </button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {mode === "register" && (
            <label>
              Nama
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              autoComplete="email"
            />
          </label>

          {mode !== "forgot" && (
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
            </label>
          )}

          {mode === "login" && (
            <button
              type="button"
              className="forgot-button"
              onClick={() => {
                setMode("forgot");
                setMessage("");
              }}
            >
              Lupa password?
            </button>
          )}

          {message && <div className="auth-message">{message}</div>}

          <button className="primary-button" disabled={loading}>
            {loading
              ? "MEMPROSES..."
              : mode === "login"
                ? "LOGIN"
                : mode === "register"
                  ? "BUAT AKUN"
                  : "KIRIM RESET PASSWORD"}
          </button>
        </form>

        {mode !== "forgot" && (
          <>
            <div className="auth-divider">
              <span>ATAU</span>
            </div>

            <button
              className="google-button"
              onClick={googleLogin}
              disabled={loading}
            >
              <span className="google-icon">G</span>
              Lanjut dengan Google
            </button>
          </>
        )}

        {mode === "forgot" && (
          <button
            className="back-auth"
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
          >
            ← Kembali ke login
          </button>
        )}

        <div className="auth-footer">
          DIN API • Secure API Platform
        </div>
      </section>
    </main>
  );
}

function Sidebar({ open, close, user, active, setActive, logout }) {
  const items = [
    ["home", "⌂", "HOME"],
    ["ai", "✦", "AI"],
    ["download", "♧", "DOWNLOAD"],
    ["tools", "⌘", "TOOLS"],
    ["search", "⌕", "SEARCH"],
    ["docs", "▤", "DOCUMENTATION"],
    ["tester", "◉", "API TESTER"],
    ["profile", "◎", "PROFILE"],
  ];

  return (
    <>
      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={close}
      />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-top">
          <div>
            <span className="mini-label">NAVIGATION</span>
            <strong>DIN API</strong>
          </div>

          <button className="close-sidebar" onClick={close}>
            ×
          </button>
        </div>

        <div className="sidebar-user">
          <div className="avatar">{getInitial(user)}</div>
          <div>
            <strong>{getUserName(user)}</strong>
            <span>MEMBER</span>
          </div>
        </div>

        <nav>
          {items.map(([id, icon, title], index) => (
            <button
              key={id}
              className={`side-item ${active === id ? "active" : ""}`}
              onClick={() => {
                setActive(id);
                close();
              }}
            >
              <span className="side-icon">{icon}</span>
              <span>{title}</span>
              <small>{String(index).padStart(2, "0")}</small>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-side" onClick={logout}>
            ↪ LOGOUT
          </button>
        </div>
      </aside>
    </>
  );
}

function Header({ openSidebar, user, logout }) {
  return (
    <header className="app-header">
      <button className="menu-button" onClick={openSidebar}>
        <span />
        <span />
        <span />
      </button>

      <div className="header-brand">
        <div className="header-logo">◉</div>
        <strong>DIN API🔥</strong>
      </div>

      <div className="header-right">
        <div className="online-pill">
          <span />
          ONLINE
        </div>

        <button className="header-avatar" onClick={logout}>
          {getInitial(user)}
        </button>
      </div>
    </header>
  );
}

function Home({ user, setActive }) {
  const totalEndpoints = API_DATA.reduce(
    (total, category) => total + category.endpoints.length,
    0
  );

  const categories = API_DATA.length + 9;

  return (
    <>
      <section className="hero-card">
        <div className="hero-inner">
          <div className="terminal-badge">
            <span />
            TERMINAL ACTIVE
          </div>

          <div className="hero-content">
            <div className="hero-copy">
              <div className="docs-title">
                DOCS <small>v3.0.0</small>
              </div>

              <p>
                A comprehensive and user friendly API solution for modern
                applications.
              </p>
            </div>

            <div className="robot-decoration">
              <div className="robot-eye left" />
              <div className="robot-eye right" />
              <div className="robot-mouth" />
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>CATEGORIES</span>
              <strong>{categories}</strong>
            </div>

            <div className="stat-card green">
              <span>ENDPOINTS</span>
              <strong>{35 || totalEndpoints}</strong>
            </div>

            <div className="stat-card wide">
              <span>STATUS</span>
              <strong>ONLINE</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="welcome-strip">
        <div>
          <span>WELCOME BACK</span>
          <strong>{getUserName(user)}</strong>
        </div>

        <button onClick={() => setActive("tester")}>OPEN API TESTER →</button>
      </section>

      <CategoryList setActive={setActive} />
    </>
  );
}

function CategoryList({ setActive }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return API_DATA;

    return API_DATA.filter(
      (category) =>
        category.name.toLowerCase().includes(value) ||
        category.description.toLowerCase().includes(value) ||
        category.endpoints.some((endpoint) =>
          endpoint.path.toLowerCase().includes(value)
        )
    );
  }, [search]);

  return (
    <>
      <div className="search-box">
        <span>⌕</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH ENDPOINT / CATEGORY..."
        />
      </div>

      <section className="category-section">
        {filtered.map((category, index) => (
          <article
            className="category-card"
            key={category.id}
            onClick={() => setActive(category.id)}
          >
            <div className="category-left">
              <div className="category-icon">{category.icon}</div>

              <div>
                <span className="module">
                  MODULE {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{category.name}</h3>
                <p>
                  {category.endpoints.length || 0} ENDPOINTS
                </p>
              </div>
            </div>

            <div className="category-arrow">→</div>
          </article>
        ))}
      </section>
    </>
  );
}

function EndpointPage({ category, setActive }) {
  if (!category) {
    return <Home setActive={setActive} />;
  }

  const [selected, setSelected] = useState(category.endpoints[0] || null);

  return (
    <section className="endpoint-page">
      <button className="back-button" onClick={() => setActive("home")}>
        ← BACK TO HOME
      </button>

      <div className="page-heading">
        <span>MODULE</span>
        <h1>{category.icon} {category.name}</h1>
        <p>{category.description}</p>
      </div>

      {category.endpoints.length === 0 ? (
        <div className="empty-card">
          <strong>NO ENDPOINT AVAILABLE</strong>
          <p>Endpoint untuk kategori ini belum ditambahkan.</p>
        </div>
      ) : (
        <div className="endpoint-layout">
          <div className="endpoint-list">
            {category.endpoints.map((endpoint) => (
              <button
                key={endpoint.path}
                className={`endpoint-item ${
                  selected?.path === endpoint.path ? "active" : ""
                }`}
                onClick={() => setSelected(endpoint)}
              >
                <span className={`method ${endpoint.method.toLowerCase()}`}>
                  {endpoint.method}
                </span>
                <code>{endpoint.path}</code>
              </button>
            ))}
          </div>

          {selected && <EndpointDetail endpoint={selected} />}
        </div>
      )}
    </section>
  );
}

function EndpointDetail({ endpoint }) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function buildUrl() {
    let target = `${API_BASE}${endpoint.path}`;

    if (endpoint.method === "GET" && endpoint.query) {
      target += `?${endpoint.query}`;
    }

    if (url.trim()) {
      target =
        endpoint.method === "GET"
          ? `${API_BASE}${endpoint.path}?url=${encodeURIComponent(url)}`
          : target;
    }

    return target;
  }

  async function testEndpoint() {
    setLoading(true);
    setResult(null);

    try {
      const target = buildUrl();

      const options = {
        method: endpoint.method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      if (endpoint.method === "POST") {
        options.body = JSON.stringify(
          endpoint.body || {
            message: url || "Halo",
          }
        );
      }

      const response = await fetch(target, options);
      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      setResult({
        status: response.status,
        data,
      });
    } catch (error) {
      setResult({
        status: "ERROR",
        data: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="endpoint-detail">
      <div className="detail-header">
        <span className={`method ${endpoint.method.toLowerCase()}`}>
          {endpoint.method}
        </span>

        <code>{endpoint.path}</code>
      </div>

      <p className="endpoint-description">{endpoint.description}</p>

      <label className="tester-label">
        {endpoint.method === "GET" ? "URL / INPUT" : "MESSAGE / INPUT"}
      </label>

      <input
        className="tester-input"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={
          endpoint.method === "GET"
            ? "Masukkan URL..."
            : "Masukkan pesan..."
        }
      />

      <button className="test-button" onClick={testEndpoint}>
        {loading ? "PROCESSING..." : "TEST ENDPOINT →"}
      </button>

      {result && (
        <div className="response-box">
          <div className="response-title">
            RESPONSE <span>{result.status}</span>
          </div>

          <pre>
            {typeof result.data === "string"
              ? result.data
              : JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function Documentation() {
  return (
    <section className="generic-page">
      <span className="page-eyebrow">DOCUMENTATION</span>
      <h1>API Documentation</h1>
      <p>
        Dokumentasi endpoint DIN API tersedia di sini. Gunakan API tester
        untuk mencoba endpoint secara langsung.
      </p>

      <div className="doc-card">
        <span>BASE URL</span>
        <code>{window.location.origin}</code>
      </div>

      <div className="doc-card">
        <span>AVAILABLE ENDPOINTS</span>
        <code>/api/download/tiktok</code>
        <code>/api/ai/chatgpt</code>
      </div>
    </section>
  );
}

function Profile({ user, logout }) {
  return (
    <section className="generic-page">
      <span className="page-eyebrow">ACCOUNT</span>
      <h1>Profile</h1>

      <div className="profile-card">
        <div className="profile-avatar">{getInitial(user)}</div>

        <div className="profile-info">
          <span>NAME</span>
          <strong>{getUserName(user)}</strong>

          <span>EMAIL</span>
          <strong>{user?.email || "-"}</strong>

          <span>ROLE</span>
          <strong>MEMBER</strong>
        </div>
      </div>

      <button className="danger-button" onClick={logout}>
        LOGOUT ACCOUNT
      </button>
    </section>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setUser(data?.session?.user || null);
        setLoadingAuth(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoadingAuth(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setActive("home");
    setSidebarOpen(false);
  }

  if (loadingAuth) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">D</div>
        <div className="loading-text">CONNECTING TO DIN API...</div>
        <div className="loading-line">
          <span />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={() => {}} />;
  }

  const selectedCategory = API_DATA.find(
    (category) => category.id === active
  );

  return (
    <div className="app-shell">
      <div className="background-grid" />

      <Sidebar
        open={sidebarOpen}
        close={() => setSidebarOpen(false)}
        user={user}
        active={active}
        setActive={setActive}
        logout={logout}
      />

      <Header
        openSidebar={() => setSidebarOpen(true)}
        user={user}
        logout={logout}
      />

      <main className="main-content">
        {active === "home" && (
          <Home user={user} setActive={setActive} />
        )}

        {["ai", "download", "tools", "search"].includes(active) && (
          <EndpointPage
            category={selectedCategory}
            setActive={setActive}
          />
        )}

        {active === "docs" && <Documentation />}

        {active === "tester" && (
          <section className="generic-page">
            <span className="page-eyebrow">DEVELOPER</span>
            <h1>API Tester</h1>
            <p>
              Pilih endpoint dari menu API untuk melakukan pengujian.
            </p>

            <div className="tester-shortcuts">
              <button onClick={() => setActive("download")}>
                TEST TIKTOK →
              </button>

              <button onClick={() => setActive("ai")}>
                TEST CHATGPT →
              </button>
            </div>
          </section>
        )}

        {active === "profile" && (
          <Profile user={user} logout={logout} />
        )}
      </main>

      <footer className="app-footer">
        <span>DIN API</span>
        <span>v3.0.0</span>
        <span>SYSTEM ONLINE</span>
      </footer>
    </div>
  );
}

export default App;
