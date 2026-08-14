import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { supabase } from "./lib/supabase";

/* =========================================================
   DIN API 3.0.0
   FULL MEMBER + DOCUMENTATION + API TESTER
========================================================= */

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  window.location.origin;

/* =========================================================
   API ENDPOINTS
========================================================= */

const API_CATEGORIES = [
  {
    name: "AI",
    icon: "✦",
    color: "green",
    endpoints: [
      {
        name: "AI Aiko",
        method: "GET",
        path: "/api/ai/aiko",
        description: "AI chat assistant",
        params: [
          {
            name: "q",
            label: "Prompt",
            placeholder: "Halo",
            required: true,
          },
          {
            name: "reset",
            label: "Reset",
            placeholder: "false",
            required: false,
          },
        ],
      },

      {
        name: "AI Lyrics Generator",
        method: "GET",
        path: "/api/ai/lyricsgen",
        description: "Generate lyrics menggunakan AI",
        params: [
          {
            name: "theme",
            label: "Theme",
            placeholder: "persahabatan",
            required: true,
          },
          {
            name: "genre",
            label: "Genre",
            placeholder: "pop",
            required: false,
          },
          {
            name: "emotion",
            label: "Emotion",
            placeholder: "happy",
            required: false,
          },
          {
            name: "lang",
            label: "Language",
            placeholder: "Indonesia",
            required: false,
          },
        ],
      },

      {
        name: "AI Coder",
        method: "GET",
        path: "/api/tools/aicoder",
        description: "Generate kode menggunakan AI",
        params: [
          {
            name: "prompt",
            label: "Prompt",
            placeholder: "buat landing page modern",
            required: true,
          },
        ],
      },

      {
        name: "AI4Chat",
        method: "GET",
        path: "/api/ai/ai4chat",
        description: "AI chat generation",
        params: [
          {
            name: "q",
            label: "Question",
            placeholder: "Halo",
            required: true,
          },
        ],
      },

      {
        name: "ChatGPT",
        method: "POST",
        path: "/api/ai/chatgpt",
        description: "ChatGPT AI assistant",
        params: [
          {
            name: "prompt",
            label: "Prompt",
            placeholder: "Jelaskan tentang JavaScript",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "ADMIN",
    icon: "◇",
    color: "red",
    endpoints: [
      {
        name: "Admin Status",
        method: "GET",
        path: "/api/admin/status",
        description: "Check admin status",
        params: [],
      },
      {
        name: "Admin Info",
        method: "GET",
        path: "/api/admin/info",
        description: "Get admin information",
        params: [],
      },
      {
        name: "Server Status",
        method: "GET",
        path: "/api/admin/server",
        description: "Check server information",
        params: [],
      },
    ],
  },

  {
    name: "CACHE",
    icon: "▣",
    color: "cyan",
    endpoints: [
      {
        name: "Cache Get",
        method: "GET",
        path: "/api/cache/get",
        description: "Get cached data",
        params: [
          {
            name: "key",
            label: "Key",
            placeholder: "example",
            required: true,
          },
        ],
      },
      {
        name: "Cache Clear",
        method: "GET",
        path: "/api/cache/clear",
        description: "Clear cache",
        params: [],
      },
    ],
  },

  {
    name: "DOWNLOAD",
    icon: "⇩",
    color: "blue",
    endpoints: [
      {
        name: "TikTok Downloader",
        method: "GET",
        path: "/api/download/tiktok",
        description: "Download video TikTok",
        params: [
          {
            name: "url",
            label: "TikTok URL",
            placeholder: "https://vt.tiktok.com/...",
            required: true,
          },
        ],
      },

      {
        name: "Instagram Downloader",
        method: "GET",
        path: "/api/download/instagram",
        description: "Download media Instagram",
        params: [
          {
            name: "url",
            label: "Instagram URL",
            placeholder: "https://instagram.com/...",
            required: true,
          },
        ],
      },

      {
        name: "CapCut Downloader",
        method: "GET",
        path: "/api/download/capcut",
        description: "Download CapCut",
        params: [
          {
            name: "url",
            label: "CapCut URL",
            placeholder: "https://www.capcut.com/...",
            required: true,
          },
        ],
      },

      {
        name: "Facebook Downloader",
        method: "GET",
        path: "/api/download/facebook",
        description: "Download Facebook media",
        params: [
          {
            name: "url",
            label: "Facebook URL",
            placeholder: "https://facebook.com/...",
            required: true,
          },
        ],
      },

      {
        name: "MediaFire Downloader",
        method: "GET",
        path: "/api/download/mediafire",
        description: "Download MediaFire",
        params: [
          {
            name: "url",
            label: "MediaFire URL",
            placeholder: "https://mediafire.com/...",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "FUN",
    icon: "♣",
    color: "pink",
    endpoints: [
      {
        name: "Random Joke",
        method: "GET",
        path: "/api/fun/joke",
        description: "Generate random joke",
        params: [],
      },
      {
        name: "Truth",
        method: "GET",
        path: "/api/fun/truth",
        description: "Random truth question",
        params: [],
      },
      {
        name: "Dare",
        method: "GET",
        path: "/api/fun/dare",
        description: "Random dare",
        params: [],
      },
      {
        name: "Quotes",
        method: "GET",
        path: "/api/fun/quotes",
        description: "Random quotes",
        params: [],
      },
    ],
  },

  {
    name: "LEADERBOARD",
    icon: "♛",
    color: "gold",
    endpoints: [
      {
        name: "Leaderboard",
        method: "GET",
        path: "/api/leaderboard",
        description: "Get leaderboard data",
        params: [],
      },
    ],
  },

  {
    name: "LIBRARY",
    icon: "▤",
    color: "orange",
    endpoints: [
      {
        name: "Library List",
        method: "GET",
        path: "/api/library",
        description: "Get library information",
        params: [],
      },
      {
        name: "Library Search",
        method: "GET",
        path: "/api/library/search",
        description: "Search library",
        params: [
          {
            name: "q",
            label: "Search",
            placeholder: "keyword",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "MAKER",
    icon: "✣",
    color: "pink",
    endpoints: [
      {
        name: "Text Maker",
        method: "GET",
        path: "/api/maker/text",
        description: "Create styled text",
        params: [
          {
            name: "text",
            label: "Text",
            placeholder: "Hello",
            required: true,
          },
        ],
      },

      {
        name: "Sticker Maker",
        method: "GET",
        path: "/api/maker/sticker",
        description: "Create sticker",
        params: [
          {
            name: "url",
            label: "Image URL",
            placeholder: "https://...",
            required: true,
          },
        ],
      },

      {
        name: "Logo Maker",
        method: "GET",
        path: "/api/maker/logo",
        description: "Generate logo",
        params: [
          {
            name: "text",
            label: "Text",
            placeholder: "DIN",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "NEWS",
    icon: "▥",
    color: "cyan",
    endpoints: [
      {
        name: "Latest News",
        method: "GET",
        path: "/api/news/latest",
        description: "Get latest news",
        params: [],
      },

      {
        name: "Search News",
        method: "GET",
        path: "/api/news/search",
        description: "Search news",
        params: [
          {
            name: "q",
            label: "Keyword",
            placeholder: "teknologi",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "RANDOM",
    icon: "◆",
    color: "purple",
    endpoints: [
      {
        name: "Random Image",
        method: "GET",
        path: "/api/random/image",
        description: "Get random image",
        params: [],
      },

      {
        name: "Random Number",
        method: "GET",
        path: "/api/random/number",
        description: "Generate random number",
        params: [
          {
            name: "min",
            label: "Minimum",
            placeholder: "1",
            required: false,
          },
          {
            name: "max",
            label: "Maximum",
            placeholder: "100",
            required: false,
          },
        ],
      },
    ],
  },

  {
    name: "SEARCH",
    icon: "⌕",
    color: "green",
    endpoints: [
      {
        name: "Web Search",
        method: "GET",
        path: "/api/search/web",
        description: "Search information from web",
        params: [
          {
            name: "q",
            label: "Query",
            placeholder: "OpenAI",
            required: true,
          },
        ],
      },

      {
        name: "Image Search",
        method: "GET",
        path: "/api/search/image",
        description: "Search images",
        params: [
          {
            name: "q",
            label: "Query",
            placeholder: "robot",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "STALK",
    icon: "◉",
    color: "purple",
    endpoints: [
      {
        name: "TikTok Stalk",
        method: "GET",
        path: "/api/stalk/tiktok",
        description: "Get public TikTok profile information",
        params: [
          {
            name: "username",
            label: "Username",
            placeholder: "username",
            required: true,
          },
        ],
      },

      {
        name: "Instagram Stalk",
        method: "GET",
        path: "/api/stalk/instagram",
        description: "Get public Instagram profile information",
        params: [
          {
            name: "username",
            label: "Username",
            placeholder: "username",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "TOOLS",
    icon: "⌘",
    color: "orange",
    endpoints: [
      {
        name: "Domain Info",
        method: "GET",
        path: "/api/tools/domaininfo",
        description: "Check domain information",
        params: [
          {
            name: "domain",
            label: "Domain",
            placeholder: "example.com",
            required: true,
          },
        ],
      },

      {
        name: "QR Generator",
        method: "GET",
        path: "/api/tools/qr",
        description: "Generate QR code",
        params: [
          {
            name: "text",
            label: "Text",
            placeholder: "Hello World",
            required: true,
          },
        ],
      },

      {
        name: "Short URL",
        method: "GET",
        path: "/api/tools/shorturl",
        description: "Shorten URL",
        params: [
          {
            name: "url",
            label: "URL",
            placeholder: "https://example.com",
            required: true,
          },
        ],
      },
    ],
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getTotalEndpoints() {
  return API_CATEGORIES.reduce(
    (total, category) => total + category.endpoints.length,
    0
  );
}

function RobotIcon() {
  return (
    <div className="robot-icon">
      <span className="robot-eye left" />
      <span className="robot-eye right" />
      <span className="robot-mouth" />
    </div>
  );
}

/* =========================================================
   AUTH PAGE
========================================================= */

function AuthPage() {
  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  const login = async () => {
    resetMessages();

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const register = async () => {
    resetMessages();

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password minimal 6 karakter."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Konfirmasi password tidak sama."
      );
      return;
    }

    setLoading(true);

    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (!data.session) {
      setMessage(
        "Pendaftaran berhasil. Silakan cek email untuk verifikasi."
      );
      setMode("login");
    }

    setLoading(false);
  };

  const forgotPassword = async () => {
    resetMessages();

    if (!email) {
      setError(
        "Masukkan email terlebih dahulu."
      );
      return;
    }

    setLoading(true);

    const redirectTo =
      `${window.location.origin}`;

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo,
        }
      );

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "Link reset password sudah dikirim ke email."
      );
    }

    setLoading(false);
  };

  const googleLogin = async () => {
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
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="background-grid" />
      <div className="scanlines" />

      <div className="auth-card">
        <div className="auth-logo">
          <RobotIcon />
        </div>

        <div className="auth-brand">
          <strong>DIN API🔥</strong>
          <small>API SYSTEM</small>
        </div>

        <div className="auth-status">
          <span />
          SYSTEM ONLINE
        </div>

        {mode === "login" && (
          <>
            <h1>Welcome Back</h1>

            <p className="auth-description">
              Login untuk mengakses dashboard
              DIN API.
            </p>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {message && (
              <div className="auth-success">
                {message}
              </div>
            )}

            <button
              className="auth-main-button"
              onClick={login}
              disabled={loading}
            >
              {loading
                ? "PROCESSING..."
                : "LOGIN"}
            </button>

            <button
              className="google-button"
              onClick={googleLogin}
              disabled={loading}
            >
              <span>G</span>
              LOGIN WITH GOOGLE
            </button>

            <button
              className="text-button"
              onClick={() => {
                resetMessages();
                setMode("forgot");
              }}
            >
              LUPA PASSWORD?
            </button>

            <div className="auth-switch">
              Belum punya akun?
              <button
                onClick={() => {
                  resetMessages();
                  setMode("register");
                }}
              >
                DAFTAR
              </button>
            </div>
          </>
        )}

        {mode === "register" && (
          <>
            <h1>Create Account</h1>

            <p className="auth-description">
              Buat akun member DIN API.
            </p>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
            />

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {message && (
              <div className="auth-success">
                {message}
              </div>
            )}

            <button
              className="auth-main-button"
              onClick={register}
              disabled={loading}
            >
              {loading
                ? "CREATING..."
                : "DAFTAR"}
            </button>

            <div className="auth-switch">
              Sudah punya akun?
              <button
                onClick={() => {
                  resetMessages();
                  setMode("login");
                }}
              >
                LOGIN
              </button>
            </div>
          </>
        )}

        {mode === "forgot" && (
          <>
            <h1>Reset Password</h1>

            <p className="auth-description">
              Masukkan email untuk mendapatkan
              link reset password.
            </p>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {message && (
              <div className="auth-success">
                {message}
              </div>
            )}

            <button
              className="auth-main-button"
              onClick={forgotPassword}
              disabled={loading}
            >
              {loading
                ? "SENDING..."
                : "KIRIM LINK RESET"}
            </button>

            <div className="auth-switch">
              Ingat password?
              <button
                onClick={() => {
                  resetMessages();
                  setMode("login");
                }}
              >
                LOGIN
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingPage() {
  return (
    <div className="loading-page">
      <div className="loading-box">
        <RobotIcon />

        <h2>DIN API🔥</h2>

        <div className="loading-dot">
          CONNECTING...
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [activePage, setActivePage] =
    useState("home");

  const [selectedEndpoint, setSelectedEndpoint] =
    useState(null);

  const [testerOpen, setTesterOpen] =
    useState(false);

  const [testerValues, setTesterValues] =
    useState({});

  const [testLoading, setTestLoading] =
    useState(false);

  const [testResponse, setTestResponse] =
    useState(null);

  const [copied, setCopied] =
    useState(false);

  /* =======================================================
     AUTH SESSION
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        await loadProfile(
          session.user.id
        );
      }

      setAuthLoading(false);
    }

    initialize();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (!mounted) return;

          setUser(
            session?.user || null
          );

          if (session?.user) {
            await loadProfile(
              session.user.id
            );
          } else {
            setProfile(null);
          }
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* =======================================================
     PROFILE
  ======================================================= */

  async function loadProfile(userId) {
    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error(
        "PROFILE ERROR:",
        error
      );
      return;
    }

    if (data) {
      setProfile(data);
    }
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  async function logout() {
    await supabase.auth.signOut();

    setUser(null);
    setProfile(null);
    setActivePage("home");
  }

  /* =======================================================
     DATA
  ======================================================= */

  const totalEndpoints =
    getTotalEndpoints();

  const filteredCategories =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return API_CATEGORIES;
      }

      return API_CATEGORIES
        .map((category) => {
          const categoryMatch =
            category.name
              .toLowerCase()
              .includes(keyword);

          const endpoints =
            category.endpoints.filter(
              (endpoint) =>
                endpoint.name
                  .toLowerCase()
                  .includes(keyword) ||
                endpoint.path
                  .toLowerCase()
                  .includes(keyword) ||
                endpoint.description
                  .toLowerCase()
                  .includes(keyword)
            );

          if (categoryMatch) {
            return category;
          }

          if (endpoints.length) {
            return {
              ...category,
              endpoints,
            };
          }

          return null;
        })
        .filter(Boolean);
    }, [search]);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  function scrollHome() {
    setMenuOpen(false);
    setActivePage("home");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function scrollCategory(name) {
    setMenuOpen(false);
    setActivePage("docs");

    setTimeout(() => {
      const element =
        document.getElementById(
          `category-${name.toLowerCase()}`
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }

  /* =======================================================
     TESTER
  ======================================================= */

  function openTester(endpoint) {
    setSelectedEndpoint(endpoint);

    const initial = {};

    endpoint.params.forEach(
      (param) => {
        initial[param.name] = "";
      }
    );

    setTesterValues(initial);
    setTestResponse(null);
    setTesterOpen(true);
  }

  function closeTester() {
    setTesterOpen(false);
    setSelectedEndpoint(null);
    setTestResponse(null);
  }

  async function executeTest() {
    if (!selectedEndpoint) return;

    setTestLoading(true);
    setTestResponse(null);

    try {
      const values = {
        ...testerValues,
      };

      const missing =
        selectedEndpoint.params.find(
          (param) =>
            param.required &&
            !String(
              values[param.name] || ""
            ).trim()
        );

      if (missing) {
        setTestResponse({
          error: true,
          message:
            `${missing.label || missing.name} wajib diisi.`,
        });

        setTestLoading(false);
        return;
      }

      let url =
        `${API_BASE}${selectedEndpoint.path}`;

      const headers = {
        Accept:
          "application/json",
      };

      if (profile?.api_key) {
        headers[
          "x-api-key"
        ] = profile.api_key;

        headers[
          "Authorization"
        ] =
          `Bearer ${profile.api_key}`;
      }

      const method =
        selectedEndpoint.method
          .toUpperCase();

      let options = {
        method,
        headers,
      };

      if (method === "GET") {
        const query =
          new URLSearchParams();

        Object.entries(values).forEach(
          ([key, value]) => {
            if (
              value !== undefined &&
              String(value).trim() !== ""
            ) {
              query.append(
                key,
                value
              );
            }
          }
        );

        const queryString =
          query.toString();

        if (queryString) {
          url += `?${queryString}`;
        }
      } else {
        headers[
          "Content-Type"
        ] =
          "application/json";

        options.body =
          JSON.stringify(values);
      }

      const response =
        await fetch(
          url,
          options
        );

      const text =
        await response.text();

      let data;

      try {
        data =
          JSON.parse(text);
      } catch {
        data = text;
      }

      setTestResponse({
        status:
          response.status,
        ok: response.ok,
        data,
      });
    } catch (error) {
      setTestResponse({
        error: true,
        message:
          error.message ||
          "Request gagal.",
      });
    }

    setTestLoading(false);
  }

  /* =======================================================
     COPY KEY
  ======================================================= */

  async function copyApiKey() {
    if (!profile?.api_key) return;

    try {
      await navigator.clipboard.writeText(
        profile.api_key
      );

      setCopied(true);

      setTimeout(
        () => setCopied(false),
        2000
      );
    } catch {
      alert(
        "Gagal menyalin API key."
      );
    }
  }

  /* =======================================================
     AUTH CHECK
  ======================================================= */

  if (authLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <AuthPage />;
  }

  /* =======================================================
     DASHBOARD
  ======================================================= */

  return (
    <div className="app">
      <div className="background-grid" />
      <div className="scanlines" />

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="header">
        <div className="header-left">
          <button
            className={`menu-button ${
              menuOpen
                ? "active"
                : ""
            }`}
            onClick={() =>
              setMenuOpen(true)
            }
          >
            <span />
            <span />
            <span />
          </button>

          <div className="header-brand">
            <RobotIcon />

            <div>
              <strong>
                DIN API🔥
              </strong>

              <small>
                ROBOT SYSTEM
              </small>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="connection">
            <span />
            ONLINE
          </div>

          <div className="version">
            v3.0.0
          </div>
        </div>
      </header>

      {/* ===================================================
          OVERLAY
      =================================================== */}

      <div
        className={`nav-overlay ${
          menuOpen ? "show" : ""
        }`}
        onClick={() =>
          setMenuOpen(false)
        }
      />

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside
        className={`side-nav ${
          menuOpen ? "open" : ""
        }`}
      >
        <div className="side-top">
          <div>
            <small>
              NAVIGATION
            </small>

            <h2>
              DIN API🔥
            </h2>
          </div>

          <button
            className="close-button"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            ×
          </button>
        </div>

        <div className="side-line" />

        <nav className="nav-list">
          <button
            className="nav-item home"
            onClick={scrollHome}
          >
            <span className="nav-icon">
              ⌂
            </span>

            <b>HOME</b>

            <small>
              00
            </small>
          </button>

          <button
            className="nav-item"
            onClick={() => {
              setMenuOpen(false);
              setActivePage(
                "dashboard"
              );
            }}
          >
            <span className="nav-icon green">
              ◉
            </span>

            <b>DASHBOARD</b>

            <small>
              01
            </small>
          </button>

          {API_CATEGORIES.map(
            (category, index) => (
              <button
                key={
                  category.name
                }
                className="nav-item"
                onClick={() =>
                  scrollCategory(
                    category.name
                  )
                }
              >
                <span
                  className={`nav-icon ${category.color}`}
                >
                  {
                    category.icon
                  }
                </span>

                <b>
                  {
                    category.name
                  }
                </b>

                <small>
                  {String(
                    index + 2
                  ).padStart(
                    2,
                    "0"
                  )}
                </small>
              </button>
            )
          )}

          <button
            className="nav-item"
            onClick={() => {
              setMenuOpen(false);
              setActivePage(
                "profile"
              );
            }}
          >
            <span className="nav-icon">
              ◎
            </span>

            <b>PROFILE</b>

            <small>
              99
            </small>
          </button>

          <button
            className="nav-item logout-nav"
            onClick={logout}
          >
            <span className="nav-icon red">
              ⇥
            </span>

            <b>LOGOUT</b>

            <small>
              ↪
            </small>
          </button>
        </nav>

        <div className="side-footer">
          <span>
            SYSTEM STATUS
          </span>

          <strong>
            ● OPERATIONAL
          </strong>
        </div>
      </aside>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="main">
        {/* =================================================
            DASHBOARD
        ================================================= */}

        {activePage ===
          "dashboard" && (
          <section className="member-dashboard">
            <div className="dashboard-header">
              <div>
                <span>
                  MEMBER PANEL
                </span>

                <h1>
                  Dashboard
                </h1>

                <p>
                  Selamat datang kembali,
                  {user.email}
                </p>
              </div>

              <div className="role-badge">
                {(
                  profile?.role ||
                  "MEMBER"
                ).toUpperCase()}
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <span>
                  ACCOUNT
                </span>

                <strong>
                  ACTIVE
                </strong>
              </div>

              <div className="dashboard-card">
                <span>
                  ENDPOINTS
                </span>

                <strong>
                  {totalEndpoints}
                </strong>
              </div>

              <div className="dashboard-card">
                <span>
                  REQUESTS
                </span>

                <strong>
                  {profile?.requests ??
                    0}
                </strong>
              </div>

              <div className="dashboard-card">
                <span>
                  PLAN
                </span>

                <strong>
                  {profile?.plan ||
                    "FREE"}
                </strong>
              </div>
            </div>

            <div className="api-key-card">
              <div>
                <span>
                  API KEY
                </span>

                <h2>
                  Your API Access Key
                </h2>

                <p>
                  Gunakan API key ini
                  untuk mengakses API
                  DIN API.
                </p>
              </div>

              <div className="api-key-box">
                <code>
                  {profile?.api_key ||
                    "API KEY BELUM TERSEDIA"}
                </code>

                <button
                  onClick={
                    copyApiKey
                  }
                >
                  {copied
                    ? "COPIED"
                    : "COPY"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            PROFILE
        ================================================= */}

        {activePage ===
          "profile" && (
          <section className="member-dashboard">
            <div className="dashboard-header">
              <div>
                <span>
                  ACCOUNT
                </span>

                <h1>
                  Profile
                </h1>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-avatar">
                {(
                  user.email ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="profile-info">
                <span>
                  EMAIL
                </span>

                <strong>
                  {user.email}
                </strong>

                <span>
                  ROLE
                </span>

                <strong>
                  {(
                    profile?.role ||
                    "MEMBER"
                  ).toUpperCase()}
                </strong>

                <span>
                  STATUS
                </span>

                <strong>
                  {profile?.status ||
                    "ACTIVE"}
                </strong>
              </div>
            </div>

            <button
              className="danger-button"
              onClick={logout}
            >
              LOGOUT
            </button>
          </section>
        )}

        {/* =================================================
            HOME / DOCS
        ================================================= */}

        {(activePage ===
          "home" ||
          activePage ===
            "docs") && (
          <>
            {/* HERO */}

            <section className="hero">
              <div className="hero-robot-decoration">
                <div className="robot-head">
                  <div className="robot-eye left" />
                  <div className="robot-eye right" />
                  <div className="robot-mouth" />
                </div>
              </div>

              <div className="hero-content">
                <div className="terminal">
                  <span className="terminal-light" />

                  TERMINAL ACTIVE

                  <span className="terminal-lines">
                    /// SYSTEM READY
                  </span>
                </div>

                <div className="hero-title">
                  <h1>
                    DOCS
                  </h1>

                  <span>
                    v3.0.0
                  </span>
                </div>

                <p>
                  A comprehensive and
                  user friendly API
                  solution for modern
                  applications.
                </p>

                <div className="hero-system">
                  <div className="system-item">
                    <span>
                      CATEGORIES
                    </span>

                    <strong>
                      {
                        API_CATEGORIES.length
                      }
                    </strong>
                  </div>

                  <div className="system-item active">
                    <span>
                      ENDPOINTS
                    </span>

                    <strong>
                      {
                        totalEndpoints
                      }
                    </strong>
                  </div>

                  <div className="system-item">
                    <span>
                      STATUS
                    </span>

                    <strong>
                      ONLINE
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            {/* MEMBER INFO */}

            <section className="member-mini-card">
              <div>
                <span>
                  MEMBER
                </span>

                <strong>
                  {user.email}
                </strong>
              </div>

              <div>
                <span>
                  ROLE
                </span>

                <strong>
                  {(
                    profile?.role ||
                    "MEMBER"
                  ).toUpperCase()}
                </strong>
              </div>

              <div>
                <span>
                  API KEY
                </span>

                <button
                  onClick={
                    copyApiKey
                  }
                >
                  {copied
                    ? "COPIED"
                    : "COPY KEY"}
                </button>
              </div>
            </section>

            {/* SEARCH */}

            <section className="search-section">
              <div className="search-box">
                <span>
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="SEARCH ENDPOINT / CATEGORY..."
                />

                {search && (
                  <button
                    onClick={() =>
                      setSearch(
                        ""
                      )
                    }
                  >
                    ×
                  </button>
                )}
              </div>
            </section>

            {/* CATEGORIES */}

            <section className="categories">
              {filteredCategories.map(
                (category) => (
                  <section
                    key={
                      category.name
                    }
                    id={`category-${category.name.toLowerCase()}`}
                    className={`category-section category-${category.color}`}
                  >
                    <div className="category-header">
                      <div className="category-icon">
                        {
                          category.icon
                        }
                      </div>

                      <div>
                        <span>
                          MODULE
                        </span>

                        <h2>
                          {
                            category.name
                          }
                        </h2>

                        <small>
                          {
                            category
                              .endpoints
                              .length
                          }{" "}
                          ENDPOINTS
                        </small>
                      </div>
                    </div>

                    <div className="endpoint-list">
                      {category.endpoints.map(
                        (
                          endpoint
                        ) => (
                          <div
                            className="endpoint-card"
                            key={
                              endpoint.path
                            }
                          >
                            <div className="endpoint-info">
                              <div className="method">
                                {
                                  endpoint.method
                                }
                              </div>

                              <div>
                                <strong>
                                  {
                                    endpoint.name
                                  }
                                </strong>

                                <code>
                                  {
                                    endpoint.path
                                  }
                                </code>

                                <p>
                                  {
                                    endpoint.description
                                  }
                                </p>
                              </div>
                            </div>

                            <button
                              className="test-button"
                              onClick={() =>
                                openTester(
                                  endpoint
                                )
                              }
                            >
                              TEST
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </section>
                )
              )}
            </section>

            {filteredCategories.length ===
              0 && (
              <div className="empty-state">
                <h2>
                  ENDPOINT NOT FOUND
                </h2>

                <p>
                  Tidak ada endpoint
                  yang cocok dengan
                  pencarian.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* ===================================================
          API TESTER MODAL
      =================================================== */}

      {testerOpen &&
        selectedEndpoint && (
          <div
            className="tester-overlay"
            onClick={closeTester}
          >
            <div
              className="tester-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="tester-header">
                <div>
                  <span>
                    API TESTER
                  </span>

                  <h2>
                    {
                      selectedEndpoint.name
                    }
                  </h2>
                </div>

                <button
                  onClick={
                    closeTester
                  }
                >
                  ×
                </button>
              </div>

              <div className="tester-endpoint">
                <span
                  className={`method ${selectedEndpoint.method}`}
                >
                  {
                    selectedEndpoint.method
                  }
                </span>

                <code>
                  {
                    selectedEndpoint.path
                  }
                </code>
              </div>

              {selectedEndpoint
                .params.length >
                0 && (
                <div className="tester-fields">
                  {selectedEndpoint.params.map(
                    (param) => (
                      <div
                        className="tester-field"
                        key={
                          param.name
                        }
                      >
                        <label>
                          {
                            param.label
                          }

                          {param.required && (
                            <b>
                              *
                            </b>
                          )}
                        </label>

                        <input
                          value={
                            testerValues[
                              param.name
                            ] || ""
                          }
                          placeholder={
                            param.placeholder
                          }
                          onChange={(
                            e
                          ) =>
                            setTesterValues(
                              (
                                old
                              ) => ({
                                ...old,
                                [param.name]:
                                  e
                                    .target
                                    .value,
                              })
                            )
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="tester-key">
                <span>
                  API KEY
                </span>

                <code>
                  {profile?.api_key ||
                    "NOT AVAILABLE"}
                </code>
              </div>

              <button
                className="execute-button"
                onClick={
                  executeTest
                }
                disabled={
                  testLoading
                }
              >
                {testLoading
                  ? "REQUESTING..."
                  : "EXECUTE REQUEST"}
              </button>

              {testResponse && (
                <div className="response-box">
                  <div className="response-header">
                    <span>
                      RESPONSE
                    </span>

                    {!testResponse.error && (
                      <b
                        className={
                          testResponse.ok
                            ? "success"
                            : "failed"
                        }
                      >
                        HTTP{" "}
                        {
                          testResponse.status
                        }
                      </b>
                    )}
                  </div>

                  <pre>
                    {testResponse.error
                      ? testResponse.message
                      : typeof testResponse.data ===
                          "string"
                        ? testResponse.data
                        : JSON.stringify(
                            testResponse.data,
                            null,
                            2
                          )}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
