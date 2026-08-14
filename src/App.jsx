import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

/* =========================================================
   DINSTORE API - APP.JSX TAHAP 3
   Tidak membutuhkan react-router-dom / lucide-react
   ========================================================= */

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.azbry.com";

/* =========================================================
   API DATA
   ========================================================= */

const API_DATA = [
  {
    category: "DOWNLOAD",
    endpoints: [
      {
        name: "TikTok Downloader",
        method: "GET",
        path: "/api/download/tiktok",
        description: "Download video TikTok tanpa watermark.",
        params: ["url"],
      },
      {
        name: "Instagram Downloader",
        method: "GET",
        path: "/api/download/instagram",
        description: "Download media dari Instagram.",
        params: ["url"],
      },
      {
        name: "Apple Music",
        method: "GET",
        path: "/api/download/applemusic",
        description: "Download informasi dan media Apple Music.",
        params: ["url"],
      },
      {
        name: "CapCut Downloader",
        method: "GET",
        path: "/api/download/capcut",
        description: "Download video template CapCut.",
        params: ["url"],
      },
      {
        name: "Douyin Downloader",
        method: "GET",
        path: "/api/download/douyin",
        description: "Download video dari Douyin.",
        params: ["url"],
      },
      {
        name: "DramaBox",
        method: "GET",
        path: "/api/download/dramabox",
        description: "Ambil data media DramaBox.",
        params: ["url"],
      },
      {
        name: "Facebook Downloader",
        method: "GET",
        path: "/api/download/facebook",
        description: "Download video Facebook.",
        params: ["url"],
      },
      {
        name: "MediaFire",
        method: "GET",
        path: "/api/download/mediafire",
        description: "Download file MediaFire.",
        params: ["url"],
      },
      {
        name: "Pinterest Downloader",
        method: "GET",
        path: "/api/download/pinterest",
        description: "Download media Pinterest.",
        params: ["url"],
      },
      {
        name: "Spotify Downloader",
        method: "GET",
        path: "/api/download/spotify",
        description: "Ambil informasi atau media Spotify.",
        params: ["url"],
      },
      {
        name: "SoundCloud Downloader",
        method: "GET",
        path: "/api/download/soundcloud",
        description: "Download audio SoundCloud.",
        params: ["url"],
      },
      {
        name: "TikTok Slide",
        method: "GET",
        path: "/api/download/tiktokslide",
        description: "Ambil foto atau slide TikTok.",
        params: ["url"],
      },
      {
        name: "X Downloader",
        method: "GET",
        path: "/api/download/x",
        description: "Download media dari X.",
        params: ["url"],
      },
      {
        name: "YouTube MP3",
        method: "GET",
        path: "/api/download/ytmp3",
        description: "Konversi video YouTube menjadi MP3.",
        params: ["url"],
      },
      {
        name: "YouTube Play",
        method: "GET",
        path: "/api/download/ytplay",
        description: "Ambil media dari YouTube.",
        params: ["url"],
      },
    ],
  },

  {
    category: "AI",
    endpoints: [
      {
        name: "AI Ko",
        method: "GET",
        path: "/api/ai/aiko",
        description: "AI assistant untuk percakapan.",
        params: ["text"],
      },
      {
        name: "AI Coder",
        method: "GET",
        path: "/api/tools/aicoder",
        description: "Membantu membuat dan memperbaiki kode.",
        params: ["text"],
      },
      {
        name: "Lyrics Generator",
        method: "GET",
        path: "/api/ai/lyricsgen",
        description: "Generate lirik menggunakan AI.",
        params: ["prompt"],
      },
      {
        name: "AI4Chat",
        method: "GET",
        path: "/api/ai/ai4chat",
        description: "AI chatbot.",
        params: ["text"],
      },
      {
        name: "Azbry AI",
        method: "GET",
        path: "/api/ai/azbryai",
        description: "AI assistant.",
        params: ["text"],
      },
      {
        name: "ChatDay",
        method: "GET",
        path: "/api/ai/chatday",
        description: "AI conversation endpoint.",
        params: ["text"],
      },
      {
        name: "ChatMusic",
        method: "GET",
        path: "/api/ai/chatmusic",
        description: "AI untuk kebutuhan musik.",
        params: ["text"],
      },
      {
        name: "Claude",
        method: "GET",
        path: "/api/ai/claude",
        description: "AI assistant endpoint.",
        params: ["text"],
      },
      {
        name: "DeepSeek",
        method: "GET",
        path: "/api/ai/deepseek",
        description: "DeepSeek AI endpoint.",
        params: ["text"],
      },
      {
        name: "OriPer",
        method: "GET",
        path: "/api/ai/oriper",
        description: "AI assistant.",
        params: ["text"],
      },
      {
        name: "Generate Prompt",
        method: "GET",
        path: "/api/ai/generateprompt",
        description: "Generate prompt menggunakan AI.",
        params: ["text"],
      },
      {
        name: "Pollinations",
        method: "GET",
        path: "/api/ai/pollinations",
        description: "AI generation endpoint.",
        params: ["prompt"],
      },
      {
        name: "GPT-4o",
        method: "GET",
        path: "/api/ai/gpt4o",
        description: "GPT-4o compatible AI endpoint.",
        params: ["text"],
      },
      {
        name: "GPT Free",
        method: "GET",
        path: "/api/ai/gptfree",
        description: "Free AI endpoint.",
        params: ["text"],
      },
      {
        name: "IAsk",
        method: "GET",
        path: "/api/ai/iask",
        description: "AI question answering.",
        params: ["text"],
      },
      {
        name: "Image Generator",
        method: "GET",
        path: "/api/ai/imagegen",
        description: "Generate gambar menggunakan AI.",
        params: ["prompt"],
      },
      {
        name: "Ustadz AI",
        method: "GET",
        path: "/api/ai/ustadz",
        description: "AI assistant untuk pertanyaan umum.",
        params: ["text"],
      },
      {
        name: "Qwen",
        method: "GET",
        path: "/api/ai/qwen",
        description: "Qwen AI endpoint.",
        params: ["text"],
      },
      {
        name: "Text To Image",
        method: "GET",
        path: "/api/ai/text2img",
        description: "Generate gambar dari text.",
        params: ["prompt"],
      },
    ],
  },

  {
    category: "TOOLS",
    endpoints: [
      {
        name: "QRIS Generator",
        method: "GET",
        path: "/api/tools/qrisgen",
        description: "Generate QRIS dari data yang diberikan.",
        params: ["text"],
      },
      {
        name: "AI Coder",
        method: "GET",
        path: "/api/tools/aicoder",
        description: "Generate atau perbaiki kode.",
        params: ["text"],
      },
    ],
  },

  {
    category: "SYSTEM",
    endpoints: [
      {
        name: "Health Check",
        method: "GET",
        path: "/api/health",
        description: "Memeriksa status server API.",
        params: [],
      },
      {
        name: "API Documentation",
        method: "GET",
        path: "/api/docs",
        description: "Mengambil dokumentasi API.",
        params: [],
      },
    ],
  },

  {
    category: "SEARCH",
    endpoints: [
      {
        name: "Search",
        method: "GET",
        path: "/api/search",
        description: "Pencarian data menggunakan API.",
        params: ["q"],
      },
      {
        name: "YouTube Search",
        method: "GET",
        path: "/api/search/youtube",
        description: "Cari video YouTube.",
        params: ["q"],
      },
    ],
  },

  {
    category: "STALK",
    endpoints: [
      {
        name: "TikTok Stalk",
        method: "GET",
        path: "/api/stalk/tiktok",
        description: "Mengambil informasi akun TikTok.",
        params: ["username"],
      },
      {
        name: "Instagram Stalk",
        method: "GET",
        path: "/api/stalk/instagram",
        description: "Mengambil informasi akun Instagram.",
        params: ["username"],
      },
    ],
  },

  {
    category: "RANDOM",
    endpoints: [
      {
        name: "Random Image",
        method: "GET",
        path: "/api/random/image",
        description: "Mengambil gambar random.",
        params: [],
      },
      {
        name: "Random Quote",
        method: "GET",
        path: "/api/random/quote",
        description: "Mengambil quote random.",
        params: [],
      },
    ],
  },

  {
    category: "MAKER",
    endpoints: [
      {
        name: "Sticker Maker",
        method: "GET",
        path: "/api/maker/sticker",
        description: "Membuat sticker dari media.",
        params: ["url"],
      },
      {
        name: "Logo Maker",
        method: "GET",
        path: "/api/maker/logo",
        description: "Membuat logo.",
        params: ["text"],
      },
    ],
  },

  {
    category: "NEWS",
    endpoints: [
      {
        name: "Latest News",
        method: "GET",
        path: "/api/news",
        description: "Mengambil berita terbaru.",
        params: [],
      },
    ],
  },

  {
    category: "FUN",
    endpoints: [
      {
        name: "Fun",
        method: "GET",
        path: "/api/fun",
        description: "Endpoint hiburan.",
        params: ["text"],
      },
    ],
  },

  {
    category: "LIBRARY",
    endpoints: [
      {
        name: "Library",
        method: "GET",
        path: "/api/library",
        description: "Informasi library API.",
        params: [],
      },
    ],
  },

  {
    category: "ADMIN",
    endpoints: [
      {
        name: "API Status",
        method: "GET",
        path: "/api/admin/status",
        description: "Status sistem API.",
        params: [],
      },
    ],
  },
];

/* =========================================================
   HELPER
   ========================================================= */

function getInitials(name) {
  if (!name) return "D";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAllEndpoints() {
  return API_DATA.flatMap((group) =>
    group.endpoints.map((endpoint) => ({
      ...endpoint,
      category: group.category,
    }))
  );
}

/* =========================================================
   AUTH
   ========================================================= */

function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const { data } = await supabase.auth.getSession();

        if (active) {
          setSession(data?.session || null);
          setLoading(false);
        }
      } catch {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (!active) return;

        setSession(currentSession);
      }
    );

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  return {
    session,
    loading,
    setSession,
  };
}

/* =========================================================
   AUTH PAGE
   ========================================================= */

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function clear() {
    setError("");
    setMessage("");
  }

  async function handleLogin() {
    clear();

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setBusy(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }

    onLogin(data.session);
  }

  async function handleRegister() {
    clear();

    if (!name || !email || !password) {
      setError("Semua data wajib diisi.");
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
          name,
        },
      },
    });

    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      onLogin(data.session);
      return;
    }

    setMessage(
      "Akun berhasil dibuat. Silakan cek email untuk verifikasi."
    );

    setMode("login");
  }

  async function handleGoogle() {
    clear();

    setBusy(true);

    const { error } =
      await supabase.auth.signInWithOAuth({
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

  async function handleForgot() {
    clear();

    if (!email) {
      setError("Masukkan email terlebih dahulu.");
      return;
    }

    setBusy(true);

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: window.location.origin,
        }
      );

    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Link reset password sudah dikirim ke email kamu."
    );
  }

  return (
    <div className="app">
      <div className="auth-container">
        <div className="auth-card">
          <div className="logo">D</div>

          <h1>DINSTORE API</h1>

          <p className="subtitle">
            {mode === "register"
              ? "Buat akun DINSTORE"
              : mode === "forgot"
              ? "Reset password akun"
              : "Masuk ke dashboard API"}
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

          {mode === "login" && (
            <>
              <button
                className="google-button"
                onClick={handleGoogle}
                disabled={busy}
              >
                <span className="google-icon">
                  G
                </span>

                {busy
                  ? "Menghubungkan..."
                  : "Lanjut dengan Google"}
              </button>

              <div className="divider">
                <span>ATAU</span>
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={email}
                  placeholder="nama@email.com"
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                />
              </div>

              <div className="forgot-row">
                <button
                  className="link-button"
                  onClick={() => {
                    clear();
                    setMode("forgot");
                  }}
                >
                  Lupa password?
                </button>
              </div>

              <button
                className="primary-button"
                onClick={handleLogin}
                disabled={busy}
              >
                {busy ? "Login..." : "Login"}
              </button>

              <p className="switch-text">
                Belum punya akun?

                <button
                  className="link-button inline"
                  onClick={() => {
                    clear();
                    setMode("register");
                  }}
                >
                  Daftar
                </button>
              </p>
            </>
          )}

          {mode === "register" && (
            <>
              <div className="form-group">
                <label>Nama</label>

                <input
                  type="text"
                  value={name}
                  placeholder="Nama lengkap"
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={email}
                  placeholder="nama@email.com"
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  value={password}
                  placeholder="Minimal 6 karakter"
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

              <button
                className="primary-button"
                onClick={handleRegister}
                disabled={busy}
              >
                {busy ? "Mendaftarkan..." : "Daftar"}
              </button>

              <div className="divider">
                <span>ATAU</span>
              </div>

              <button
                className="google-button"
                onClick={handleGoogle}
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
                    clear();
                    setMode("login");
                  }}
                >
                  Login
                </button>
              </p>
            </>
          )}

          {mode === "forgot" && (
            <>
              <div className="form-group">
                <label>Email akun</label>

                <input
                  type="email"
                  value={email}
                  placeholder="nama@email.com"
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <button
                className="primary-button"
                onClick={handleForgot}
                disabled={busy}
              >
                {busy
                  ? "Mengirim..."
                  : "Kirim Link Reset"}
              </button>

              <button
                className="text-button"
                onClick={() => {
                  clear();
                  setMode("login");
                }}
              >
                ← Kembali ke login
              </button>
            </>
          )}

          <div className="auth-footer">
            <span>DINSTORE API</span>
            <span>Secure Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
   ========================================================= */

function Sidebar({
  activeCategory,
  setActiveCategory,
  mobileOpen,
  setMobileOpen,
}) {
  const total = getAllEndpoints().length;

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-logo">D</div>

          <div>
            <strong>DINSTORE</strong>
            <small>API DOCUMENTATION</small>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-title">
            API MENU
          </span>

          <button
            className={`side-item ${
              activeCategory === "ALL"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveCategory("ALL");
              setMobileOpen(false);
            }}
          >
            <span>⌂</span>
            <span>Overview</span>
            <b>{total}</b>
          </button>

          {API_DATA.map((group) => (
            <button
              key={group.category}
              className={`side-item ${
                activeCategory === group.category
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setActiveCategory(group.category);
                setMobileOpen(false);
              }}
            >
              <span className="category-dot"></span>

              <span>{group.category}</span>

              <b>{group.endpoints.length}</b>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="server-card">
            <span className="server-light"></span>

            <div>
              <strong>API SERVER</strong>
              <small>Operational</small>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   ENDPOINT DETAIL
   ========================================================= */

function EndpointDetail({
  endpoint,
  onBack,
}) {
  const [value, setValue] = useState("");
  const [response, setResponse] = useState(null);
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = `${API_BASE}${endpoint.path}`;

  function copyUrl() {
    navigator.clipboard
      ?.writeText(fullUrl)
      .then(() => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1500);
      })
      .catch(() => {});
  }

  async function testEndpoint() {
    setTesting(true);
    setResponse(null);

    try {
      let url = fullUrl;

      if (endpoint.params.length > 0 && value) {
        const separator = url.includes("?")
          ? "&"
          : "?";

        const param = endpoint.params[0];

        url += `${separator}${encodeURIComponent(
          param
        )}=${encodeURIComponent(value)}`;
      }

      const started = Date.now();

      const res = await fetch(url);

      const elapsed = Date.now() - started;

      const contentType =
        res.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setResponse({
        status: res.status,
        time: elapsed,
        data,
      });
    } catch (error) {
      setResponse({
        status: "ERROR",
        time: 0,
        data: {
          error: error.message,
        },
      });
    }

    setTesting(false);
  }

  return (
    <div className="endpoint-detail">
      <button
        className="back-button"
        onClick={onBack}
      >
        ← Kembali
      </button>

      <div className="endpoint-header">
        <div>
          <div className="endpoint-category">
            {endpoint.category}
          </div>

          <h1>{endpoint.name}</h1>

          <p>{endpoint.description}</p>
        </div>

        <span className="method-badge">
          {endpoint.method}
        </span>
      </div>

      <div className="endpoint-url-card">
        <div>
          <span className="url-label">
            ENDPOINT
          </span>

          <code>{fullUrl}</code>
        </div>

        <button onClick={copyUrl}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="detail-grid">
        <section className="tester-panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">
                API TESTER
              </span>

              <h2>Test Endpoint</h2>
            </div>

            <span className="method-small">
              {endpoint.method}
            </span>
          </div>

          {endpoint.params.length > 0 ? (
            <div className="form-group">
              <label>
                {endpoint.params[0]}
              </label>

              <input
                value={value}
                onChange={(e) =>
                  setValue(e.target.value)
                }
                placeholder={`Masukkan ${endpoint.params[0]}`}
              />
            </div>
          ) : (
            <div className="no-param">
              Endpoint ini tidak membutuhkan
              parameter.
            </div>
          )}

          <button
            className="test-button"
            onClick={testEndpoint}
            disabled={testing}
          >
            {testing
              ? "Mengirim Request..."
              : "▶ Test Endpoint"}
          </button>
        </section>

        <section className="code-panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">
                REQUEST
              </span>

              <h2>Example</h2>
            </div>
          </div>

          <pre>
            <code>{`fetch("${fullUrl}${
              endpoint.params.length
                ? `?${endpoint.params[0]}=VALUE`
                : ""
            }")
  .then(res => res.json())
  .then(data => console.log(data));`}</code>
          </pre>
        </section>
      </div>

      {response && (
        <section className="response-panel">
          <div className="response-header">
            <div>
              <span className="eyebrow">
                RESPONSE
              </span>

              <h2>API Response</h2>
            </div>

            <div className="response-meta">
              <span>
                Status: {response.status}
              </span>

              <span>
                {response.time} ms
              </span>
            </div>
          </div>

          <pre>
            <code>
              {typeof response.data === "string"
                ? response.data
                : JSON.stringify(
                    response.data,
                    null,
                    2
                  )}
            </code>
          </pre>
        </section>
      )}
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD
   ========================================================= */

function Dashboard({ session }) {
  const [activeCategory, setActiveCategory] =
    useState("ALL");

  const [search, setSearch] = useState("");

  const [selectedEndpoint, setSelectedEndpoint] =
    useState(null);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [userMenu, setUserMenu] = useState(false);

  const allEndpoints = useMemo(
    () => getAllEndpoints(),
    []
  );

  const filteredEndpoints = useMemo(() => {
    let list = allEndpoints;

    if (activeCategory !== "ALL") {
      list = list.filter(
        (item) =>
          item.category === activeCategory
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.path.toLowerCase().includes(q) ||
          item.description
            .toLowerCase()
            .includes(q) ||
          item.category
            .toLowerCase()
            .includes(q)
      );
    }

    return list;
  }, [
    allEndpoints,
    activeCategory,
    search,
  ]);

  async function logout() {
    await supabase.auth.signOut();
  }

  const user = session?.user;

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  if (selectedEndpoint) {
    return (
      <div className="app dashboard-app">
        <Sidebar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="main-area">
          <header className="topbar">
            <button
              className="mobile-menu"
              onClick={() =>
                setMobileOpen(true)
              }
            >
              ☰
            </button>

            <div className="topbar-title">
              API Documentation
            </div>

            <div className="user-area">
              <button
                className="user-button"
                onClick={() =>
                  setUserMenu(!userMenu)
                }
              >
                <span className="avatar">
                  {getInitials(userName)}
                </span>

                <span className="user-name">
                  {userName}
                </span>
              </button>

              {userMenu && (
                <div className="user-dropdown">
                  <strong>{userName}</strong>

                  <small>{user?.email}</small>

                  <button onClick={logout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>

          <main className="main-content">
            <EndpointDetail
              endpoint={selectedEndpoint}
              onBack={() =>
                setSelectedEndpoint(null)
              }
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app dashboard-app">
      <Sidebar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() =>
              setMobileOpen(true)
            }
          >
            ☰
          </button>

          <div className="topbar-title">
            DINSTORE API
          </div>

          <div className="topbar-right">
            <div className="api-online">
              <span></span>
              ONLINE
            </div>

            <div className="user-area">
              <button
                className="user-button"
                onClick={() =>
                  setUserMenu(!userMenu)
                }
              >
                <span className="avatar">
                  {getInitials(userName)}
                </span>

                <span className="user-name">
                  {userName}
                </span>
              </button>

              {userMenu && (
                <div className="user-dropdown">
                  <strong>{userName}</strong>

                  <small>{user?.email}</small>

                  <button onClick={logout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="main-content">
          {/* HERO */}

          <section className="api-hero">
            <div className="hero-left">
              <div className="online-badge">
                <span></span>
                ALL SYSTEMS OPERATIONAL
              </div>

              <h1>
                DINSTORE
                <br />
                <span>API PLATFORM</span>
              </h1>

              <p>
                Powerful REST API untuk kebutuhan
                download, AI, tools, search dan
                berbagai layanan digital.
              </p>

              <div className="hero-actions">
                <button
                  className="hero-button"
                  onClick={() =>
                    document
                      .getElementById(
                        "api-directory"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                >
                  Explore API
                </button>

                <button
                  className="hero-button secondary"
                  onClick={() =>
                    setActiveCategory("SYSTEM")
                  }
                >
                  System Status
                </button>
              </div>
            </div>

            <div className="hero-orb">
              <div className="orb-ring">
                <div className="orb-core">
                  D
                </div>
              </div>
            </div>
          </section>

          {/* STATISTICS */}

          <section className="stats-grid large">
            <div className="stat-card">
              <div className="stat-icon">
                API
              </div>

              <div>
                <span>Total Endpoint</span>
                <strong>
                  {allEndpoints.length}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                CAT
              </div>

              <div>
                <span>Categories</span>
                <strong>
                  {API_DATA.length}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                ⚡
              </div>

              <div>
                <span>Response</span>
                <strong>Fast</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                ✓
              </div>

              <div>
                <span>Server</span>
                <strong>Online</strong>
              </div>
            </div>
          </section>

          {/* SEARCH */}

          <section
            className="search-section"
            id="api-directory"
          >
            <div>
              <span className="eyebrow">
                API DIRECTORY
              </span>

              <h2>
                Explore all endpoints
              </h2>

              <p>
                Pilih kategori atau cari endpoint
                yang ingin kamu gunakan.
              </p>
            </div>

            <div className="search-box">
              <span>⌕</span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search API endpoint..."
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                >
                  ×
                </button>
              )}
            </div>
          </section>

          {/* CATEGORY CHIPS */}

          <div className="category-chips">
            <button
              className={
                activeCategory === "ALL"
                  ? "chip active"
                  : "chip"
              }
              onClick={() =>
                setActiveCategory("ALL")
              }
            >
              All
            </button>

            {API_DATA.map((group) => (
              <button
                key={group.category}
                className={
                  activeCategory ===
                  group.category
                    ? "chip active"
                    : "chip"
                }
                onClick={() =>
                  setActiveCategory(
                    group.category
                  )
                }
              >
                {group.category}

                <span>
                  {group.endpoints.length}
                </span>
              </button>
            ))}
          </div>

          {/* ENDPOINTS */}

          <section className="endpoint-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  ENDPOINTS
                </span>

                <h2>
                  {activeCategory === "ALL"
                    ? "All APIs"
                    : activeCategory}
                </h2>
              </div>

              <span className="result-count">
                {filteredEndpoints.length} API
              </span>
            </div>

            {filteredEndpoints.length === 0 ? (
              <div className="empty-state">
                <div>⌕</div>

                <h3>API tidak ditemukan</h3>

                <p>
                  Coba gunakan kata pencarian
                  yang berbeda.
                </p>
              </div>
            ) : (
              <div className="endpoint-grid">
                {filteredEndpoints.map(
                  (endpoint) => (
                    <button
                      className="endpoint-card"
                      key={`${endpoint.category}-${endpoint.path}`}
                      onClick={() =>
                        setSelectedEndpoint(
                          endpoint
                        )
                      }
                    >
                      <div className="endpoint-top">
                        <span className="method-badge">
                          {endpoint.method}
                        </span>

                        <span className="category-label">
                          {endpoint.category}
                        </span>
                      </div>

                      <h3>{endpoint.name}</h3>

                      <p>
                        {endpoint.description}
                      </p>

                      <div className="endpoint-bottom">
                        <code>
                          {endpoint.path}
                        </code>

                        <span>→</span>
                      </div>
                    </button>
                  )
                )}
              </div>
            )}
          </section>

          {/* SYSTEM */}

          <section className="system-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  SYSTEM
                </span>

                <h2>
                  API Infrastructure
                </h2>
              </div>
            </div>

            <div className="system-grid">
              <div className="system-card">
                <div className="system-icon">
                  ✓
                </div>

                <div>
                  <h3>API Server</h3>

                  <p>
                    Main API server berjalan
                    normal.
                  </p>

                  <span className="system-status">
                    Operational
                  </span>
                </div>
              </div>

              <div className="system-card">
                <div className="system-icon">
                  DB
                </div>

                <div>
                  <h3>Database</h3>

                  <p>
                    Database authentication
                    aktif.
                  </p>

                  <span className="system-status">
                    Operational
                  </span>
                </div>
              </div>

              <div className="system-card">
                <div className="system-icon">
                  ⚡
                </div>

                <div>
                  <h3>Performance</h3>

                  <p>
                    Infrastruktur siap
                    menerima request.
                  </p>

                  <span className="system-status">
                    Healthy
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="main-footer">
          <div>
            <strong>DINSTORE API</strong>

            <span>
              Powerful API for your applications.
            </span>
          </div>

          <div>
            <span>
              © 2026 DINSTORE
            </span>

            <span>
              All systems operational
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* =========================================================
   APP
   ========================================================= */

export default function App() {
  const {
    session,
    loading,
    setSession,
  } = useAuth();

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="spinner"></div>

          <h2>DINSTORE API</h2>

          <p>
            Menghubungkan ke server...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <AuthPage
        onLogin={(newSession) =>
          setSession(newSession)
        }
      />
    );
  }

  return <Dashboard session={session} />;
}
