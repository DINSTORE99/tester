import React, { useMemo, useState } from "react";
import {
  Home,
  Sparkles,
  Shield,
  Database,
  Download,
  Gamepad2,
  Trophy,
  Library,
  Palette,
  Newspaper,
  Shuffle,
  Search,
  Eye,
  Command,
  X,
  Menu,
  ChevronRight,
  Terminal,
  Zap,
  Activity,
  Copy,
  Check,
} from "lucide-react";

const API_BASE = "";

const categories = [
  {
    id: "home",
    name: "HOME",
    icon: Home,
  },
  {
    id: "ai",
    name: "AI",
    icon: Sparkles,
  },
  {
    id: "admin",
    name: "ADMIN",
    icon: Shield,
  },
  {
    id: "cache",
    name: "CACHE",
    icon: Database,
  },
  {
    id: "download",
    name: "DOWNLOAD",
    icon: Download,
  },
  {
    id: "fun",
    name: "FUN",
    icon: Gamepad2,
  },
  {
    id: "leaderboard",
    name: "LEADERBOARD",
    icon: Trophy,
  },
  {
    id: "library",
    name: "LIBRARY",
    icon: Library,
  },
  {
    id: "maker",
    name: "MAKER",
    icon: Palette,
  },
  {
    id: "news",
    name: "NEWS",
    icon: Newspaper,
  },
  {
    id: "random",
    name: "RANDOM",
    icon: Shuffle,
  },
  {
    id: "search",
    name: "SEARCH",
    icon: Search,
  },
  {
    id: "stalk",
    name: "STALK",
    icon: Eye,
  },
  {
    id: "tools",
    name: "TOOLS",
    icon: Command,
  },
];

const endpoints = [
  {
    id: "tiktok",
    category: "download",
    name: "TikTok Downloader",
    path: "/api/download/tiktok",
    method: "GET",
    description: "Download video TikTok tanpa watermark.",
    parameter: "url",
  },
  {
    id: "instagram",
    category: "download",
    name: "Instagram Downloader",
    path: "/api/download/instagram",
    method: "GET",
    description: "Download foto dan video Instagram.",
    parameter: "url",
  },
  {
    id: "capcut",
    category: "download",
    name: "CapCut Downloader",
    path: "/api/download/capcut",
    method: "GET",
    description: "Download template atau video CapCut.",
    parameter: "url",
  },
  {
    id: "ai4chat",
    category: "ai",
    name: "AI4Chat",
    path: "/api/ai/ai4chat",
    method: "GET",
    description: "AI chat untuk berbagai kebutuhan.",
    parameter: "text",
  },
  {
    id: "aiko",
    category: "ai",
    name: "AIKO",
    path: "/api/ai/aiko",
    method: "GET",
    description: "AI assistant dengan respons otomatis.",
    parameter: "text",
  },
  {
    id: "chatgpt",
    category: "ai",
    name: "ChatGPT",
    path: "/api/ai/chatgpt",
    method: "GET",
    description: "Endpoint AI ChatGPT.",
    parameter: "text",
  },
  {
    id: "lyricsgen",
    category: "ai",
    name: "Lyrics Generator",
    path: "/api/ai/lyricsgen",
    method: "GET",
    description: "Generate lirik menggunakan AI.",
    parameter: "text",
  },
  {
    id: "aicoder",
    category: "tools",
    name: "AI Coder",
    path: "/api/tools/aicoder",
    method: "GET",
    description: "Generate dan bantu memperbaiki kode.",
    parameter: "text",
  },
  {
    id: "domaininfo",
    category: "tools",
    name: "Domain Info",
    path: "/api/tools/domaininfo",
    method: "GET",
    description: "Mendapatkan informasi sebuah domain.",
    parameter: "domain",
  },
];

function App() {
  const [activeCategory, setActiveCategory] = useState("home");
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const categoryEndpoints = useMemo(() => {
    if (activeCategory === "home") {
      return endpoints;
    }

    return endpoints.filter(
      (item) => item.category === activeCategory
    );
  }, [activeCategory]);

  const activeCategoryData = categories.find(
    (item) => item.id === activeCategory
  );

  function openCategory(category) {
    setActiveCategory(category);
    setSelectedEndpoint(null);
    setResponse(null);
    setInput("");
    setSidebarOpen(false);
  }

  function openEndpoint(endpoint) {
    setSelectedEndpoint(endpoint);
    setResponse(null);
    setInput("");
    setSidebarOpen(false);
  }

  async function testEndpoint() {
    if (!selectedEndpoint) return;

    if (!input.trim()) {
      alert(
        `Masukkan ${selectedEndpoint.parameter} terlebih dahulu.`
      );
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const separator = selectedEndpoint.path.includes("?")
        ? "&"
        : "?";

      const url =
        `${API_BASE}${selectedEndpoint.path}` +
        `${separator}${selectedEndpoint.parameter}=` +
        encodeURIComponent(input.trim());

      const res = await fetch(url);

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
        ok: res.ok,
        data,
      });
    } catch (error) {
      setResponse({
        status: 500,
        ok: false,
        data: {
          success: false,
          error: error.message,
        },
      });
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    if (!selectedEndpoint) return;

    const code =
      `fetch("${selectedEndpoint.path}?` +
      `${selectedEndpoint.parameter}=YOUR_VALUE")`;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      alert("Gagal menyalin.");
    }
  }

  const renderHome = () => {
    return (
      <>
        <section className="hero-card">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="live-dot"></span>
              DINSTORE API
            </div>

            <h1>
              Powerful API
              <br />
              for modern apps.
            </h1>

            <p>
              Satu API untuk berbagai kebutuhan.
              Download, AI, tools, dan layanan lainnya.
            </p>

            <div className="hero-actions">
              <button
                className="primary-btn"
                onClick={() => openCategory("download")}
              >
                Explore API
                <ChevronRight size={18} />
              </button>

              <button
                className="secondary-btn"
                onClick={() => openCategory("ai")}
              >
                AI API
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="orb">
              <div className="orb-core">
                <Terminal size={38} />
              </div>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>ENDPOINTS</span>
            <strong>{endpoints.length}</strong>
          </div>

          <div className="stat-card">
            <span>CATEGORIES</span>
            <strong>{categories.length - 1}</strong>
          </div>

          <div className="stat-card">
            <span>STATUS</span>
            <strong className="online-text">
              ONLINE
            </strong>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                AVAILABLE
              </span>
              <h2>Popular API</h2>
            </div>

            <span className="endpoint-count">
              {endpoints.length} ENDPOINTS
            </span>
          </div>

          <div className="endpoint-grid">
            {endpoints.slice(0, 6).map((endpoint) => (
              <EndpointCard
                key={endpoint.id}
                endpoint={endpoint}
                onClick={() => openEndpoint(endpoint)}
              />
            ))}
          </div>
        </section>
      </>
    );
  };

  const renderCategory = () => {
    return (
      <>
        <section className="page-header">
          <div>
            <span className="eyebrow">
              CATEGORY
            </span>

            <h1>
              {activeCategoryData?.name}
            </h1>

            <p>
              Semua endpoint yang tersedia pada kategori ini.
            </p>
          </div>

          <div className="category-icon">
            {activeCategoryData &&
              React.createElement(
                activeCategoryData.icon,
                { size: 32 }
              )}
          </div>
        </section>

        {categoryEndpoints.length === 0 ? (
          <div className="empty-card">
            <Database size={42} />

            <h3>Belum ada endpoint</h3>

            <p>
              Endpoint untuk kategori ini akan
              ditambahkan nanti.
            </p>
          </div>
        ) : (
          <div className="endpoint-grid">
            {categoryEndpoints.map((endpoint) => (
              <EndpointCard
                key={endpoint.id}
                endpoint={endpoint}
                onClick={() => openEndpoint(endpoint)}
              />
            ))}
          </div>
        )}
      </>
    );
  };

  const renderEndpoint = () => {
    if (!selectedEndpoint) return null;

    const example =
      `fetch("${selectedEndpoint.path}?` +
      `${selectedEndpoint.parameter}=YOUR_VALUE")`;

    return (
      <section className="endpoint-page">
        <button
          className="back-btn"
          onClick={() => setSelectedEndpoint(null)}
        >
          ← Back
        </button>

        <div className="endpoint-title">
          <div>
            <span className="method-badge">
              {selectedEndpoint.method}
            </span>

            <h1>{selectedEndpoint.name}</h1>

            <p>{selectedEndpoint.description}</p>
          </div>

          <div className="endpoint-status">
            <Activity size={16} />
            ONLINE
          </div>
        </div>

        <div className="endpoint-url">
          <code>
            {selectedEndpoint.path}
          </code>

          <button onClick={copyCode}>
            {copied ? (
              <Check size={17} />
            ) : (
              <Copy size={17} />
            )}
          </button>
        </div>

        <div className="tester-card">
          <div className="tester-heading">
            <div>
              <span className="eyebrow">
                API TESTER
              </span>

              <h2>Test Endpoint</h2>
            </div>

            <Zap size={22} />
          </div>

          <label>
            {selectedEndpoint.parameter}
          </label>

          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder={
              selectedEndpoint.parameter === "url"
                ? "https://..."
                : `Masukkan ${selectedEndpoint.parameter}`
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                testEndpoint();
              }
            }}
          />

          <button
            className="test-btn"
            onClick={testEndpoint}
            disabled={loading}
          >
            {loading
              ? "PROCESSING..."
              : "TEST API"}
          </button>
        </div>

        <div className="code-card">
          <div className="code-heading">
            <span>REQUEST EXAMPLE</span>

            <button onClick={copyCode}>
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>

          <pre>
            <code>{example}</code>
          </pre>
        </div>

        {response && (
          <div className="response-card">
            <div className="response-heading">
              <span>RESPONSE</span>

              <span
                className={
                  response.ok
                    ? "response-ok"
                    : "response-error"
                }
              >
                HTTP {response.status}
              </span>
            </div>

            <pre>
              {typeof response.data === "string"
                ? response.data
                : JSON.stringify(
                    response.data,
                    null,
                    2
                  )}
            </pre>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="app">
      <header className="topbar">
        <button
          className="menu-btn"
          onClick={() =>
            setSidebarOpen(true)
          }
        >
          <Menu size={22} />
        </button>

        <div className="brand">
          <div className="brand-logo">
            D
          </div>

          <div>
            <strong>DINSTORE</strong>
            <small>API SYSTEM</small>
          </div>
        </div>

        <div className="system-status">
          <span></span>
          ONLINE
        </div>
      </header>

      <div
        className={
          sidebarOpen
            ? "overlay active"
            : "overlay"
        }
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={
          sidebarOpen
            ? "sidebar open"
            : "sidebar"
        }
      >
        <div className="sidebar-header">
          <div>
            <span>N A V I G A T I O N</span>
            <h2>DINSTORE API</h2>
          </div>

          <button
            className="close-btn"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={24} />
          </button>
        </div>

        <nav className="nav-list">
          {categories.map((category, index) => {
            const Icon = category.icon;

            const count =
              category.id === "home"
                ? endpoints.length
                : endpoints.filter(
                    (item) =>
                      item.category ===
                      category.id
                  ).length;

            return (
              <button
                key={category.id}
                className={
                  activeCategory === category.id &&
                  !selectedEndpoint
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  openCategory(category.id)
                }
              >
                <Icon size={18} />

                <span>{category.name}</span>

                <small>
                  {String(index).padStart(2, "0")}
                </small>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="main">
        {selectedEndpoint
          ? renderEndpoint()
          : activeCategory === "home"
          ? renderHome()
          : renderCategory()}
      </main>

      <footer className="footer">
        <div>
          <strong>DINSTORE API</strong>
          <span>
            Modern API system
          </span>
        </div>

        <span>
          © {new Date().getFullYear()} DINSTORE
        </span>
      </footer>
    </div>
  );
}

function EndpointCard({ endpoint, onClick }) {
  return (
    <button
      className="endpoint-card"
      onClick={onClick}
    >
      <div className="card-top">
        <span className="method-badge">
          {endpoint.method}
        </span>

        <ChevronRight size={18} />
      </div>

      <h3>{endpoint.name}</h3>

      <p>{endpoint.description}</p>

      <code>{endpoint.path}</code>
    </button>
  );
}

export default App;
