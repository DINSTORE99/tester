import { useMemo, useState } from "react";
import "./style.css";

const categories = [
  {
    name: "AI",
    icon: "✦",
    count: 4,
    endpoints: [
      {
        method: "GET",
        name: "AI Aiko",
        path: "/api/ai/aiko",
      },
      {
        method: "GET",
        name: "AI Lyrics Generator",
        path: "/api/ai/lyricsgen",
      },
      {
        method: "GET",
        name: "AI Coder",
        path: "/api/tools/aicoder",
      },
      {
        method: "GET",
        name: "AI Chat",
        path: "/api/ai/chat",
      },
    ],
  },
  {
    name: "ADMIN",
    icon: "◇",
    count: 2,
    endpoints: [
      {
        method: "GET",
        name: "Server Status",
        path: "/api/admin/status",
      },
      {
        method: "GET",
        name: "System Info",
        path: "/api/admin/info",
      },
    ],
  },
  {
    name: "CACHE",
    icon: "▣",
    count: 3,
    endpoints: [
      {
        method: "GET",
        name: "Cache Clear",
        path: "/api/cache/clear",
      },
      {
        method: "GET",
        name: "Cache Status",
        path: "/api/cache/status",
      },
      {
        method: "GET",
        name: "Cache Data",
        path: "/api/cache/data",
      },
    ],
  },
  {
    name: "DOWNLOAD",
    icon: "⇩",
    count: 5,
    endpoints: [
      {
        method: "GET",
        name: "TikTok Downloader",
        path: "/api/download/tiktok",
      },
      {
        method: "GET",
        name: "Instagram Downloader",
        path: "/api/download/instagram",
      },
      {
        method: "GET",
        name: "Facebook Downloader",
        path: "/api/download/facebook",
      },
      {
        method: "GET",
        name: "Pinterest Downloader",
        path: "/api/download/pinterest",
      },
      {
        method: "GET",
        name: "Spotify Downloader",
        path: "/api/download/spotify",
      },
    ],
  },
  {
    name: "TOOLS",
    icon: "⌘",
    count: 4,
    endpoints: [
      {
        method: "GET",
        name: "QR Generator",
        path: "/api/tools/qrcode",
      },
      {
        method: "GET",
        name: "Short URL",
        path: "/api/tools/shorturl",
      },
      {
        method: "GET",
        name: "Screenshot",
        path: "/api/tools/screenshot",
      },
      {
        method: "GET",
        name: "Translator",
        path: "/api/tools/translate",
      },
    ],
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("SEMUA");
  const [openCategory, setOpenCategory] = useState(null);

  const totalEndpoints = categories.reduce(
    (total, category) => total + category.endpoints.length,
    0
  );

  const filteredCategories = useMemo(() => {
    let result = categories;

    if (activeCategory !== "SEMUA") {
      result = result.filter(
        (category) => category.name === activeCategory
      );
    }

    if (!search.trim()) return result;

    const keyword = search.toLowerCase();

    return result
      .map((category) => ({
        ...category,
        endpoints: category.endpoints.filter(
          (endpoint) =>
            endpoint.name.toLowerCase().includes(keyword) ||
            endpoint.path.toLowerCase().includes(keyword) ||
            category.name.toLowerCase().includes(keyword)
        ),
      }))
      .filter(
        (category) =>
          category.endpoints.length > 0 ||
          category.name.toLowerCase().includes(keyword)
      );
  }, [search, activeCategory]);

  const openWhatsApp = () => {
    window.open(
      "https://wa.me/6287776581216",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="app">

      {/* BACKGROUND EFFECT */}
      <div className="grid-background" />
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      {/* NAVBAR */}
      <header className="navbar">

        <div className="brand">
          <div className="brand-logo">
            D
          </div>

          <div className="brand-text">
            <strong>DINSTORE</strong>
            <span>API</span>
          </div>
        </div>

        <div className="nav-actions">

          <button
            className="nav-icon"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>

          <button className="nav-icon notification">
            ♧
            <small>1</small>
          </button>

          <button className="profile-button">
            D
          </button>

        </div>

      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        >
          <aside
            className="mobile-menu"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="menu-header">
              <div>
                <span>NAVIGATION</span>
                <h2>DINSTORE API</h2>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="menu-line" />

            <button className="menu-item active">
              <span>⌂</span>
              HOME
            </button>

            {categories.map((category, index) => (
              <button
                key={category.name}
                className="menu-item"
                onClick={() => {
                  setActiveCategory(category.name);
                  setMenuOpen(false);
                }}
              >
                <span>{category.icon}</span>
                {category.name}
                <small>
                  {String(index + 1).padStart(2, "0")}
                </small>
              </button>
            ))}

          </aside>
        </div>
      )}

      <main>

        {/* HERO */}
        <section className="hero">

          <div className="hero-badge">
            <span className="status-dot" />
            DINSTORE API DIRECTORY
          </div>

          <h1>
            DINSTORE
            <span> API</span>
          </h1>

          <div className="hero-title-box">
            3D API INTERACTIVE
          </div>

          <p>
            A comprehensive and user friendly API
            solution for modern applications.
          </p>

          <div className="robot-decoration">

            <div className="robot-head">

              <div className="robot-eye left" />
              <div className="robot-eye right" />

              <div className="robot-mouth">
                <span />
                <span />
                <span />
              </div>

            </div>

            <div className="robot-neck" />

            <div className="robot-body">

              <div className="robot-panel">
                DIN
              </div>

              <div className="robot-line" />
              <div className="robot-line short" />

            </div>

          </div>

        </section>

        {/* INFORMATION */}
        <section className="section">

          <div className="section-heading">
            <div className="heading-icon">
              ♟
            </div>

            <h2>INFORMASI</h2>

            <span className="notification-number">
              1
            </span>
          </div>

          <div className="info-card">

            <div className="info-top">
              <span className="online-dot" />
              <strong>
                Update DINSTORE API
              </strong>

              <time>
                14 Aug 2026
              </time>
            </div>

            <p>
              Selamat datang di DINSTORE API.
              Gunakan API kami untuk kebutuhan
              aplikasi modern kamu.
            </p>

          </div>

        </section>

        {/* LOGIN */}
        <section className="login-banner">

          <div className="login-icon">
            🔑
          </div>

          <div>
            <strong>
              Login / Daftar akun
            </strong>

            <p>
              Login agar API Key akun kamu
              otomatis aktif saat menggunakan
              endpoint.
            </p>
          </div>

          <button>
            LOGIN →
          </button>

        </section>

        {/* STATS */}
        <section className="stats">

          <div className="stat">
            <strong>{totalEndpoints}</strong>
            <span>ENDPOINTS</span>
          </div>

          <div className="stat accent">
            <strong>{categories.length}</strong>
            <span>CATEGORIES</span>
          </div>

          <div className="stat">
            <strong>99.9%</strong>
            <span>SERVER UPTIME</span>
          </div>

        </section>

        {/* SERVER */}
        <section className="server-card">

          <div className="server-title">

            <div>
              <span className="server-icon">
                ▤
              </span>

              <strong>
                STATUS KONEKSI & SERVER
              </strong>
            </div>

            <span className="server-online">
              ● ONLINE
            </span>

          </div>

          <div className="server-details">

            <div>
              <span>SERVER</span>
              <strong>DINSTORE</strong>
            </div>

            <div>
              <span>STATUS</span>
              <strong>OPERATIONAL</strong>
            </div>

            <div>
              <span>RESPONSE</span>
              <strong>FAST</strong>
            </div>

          </div>

        </section>

        {/* SEARCH */}
        <section className="search-section">

          <div className="search-box">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Cari nama endpoint, parameter, atau kategori..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
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

        {/* FILTER */}
        <section className="filter-section">

          <h3>FILTER KATEGORI:</h3>

          <div className="filters">

            <button
              className={
                activeCategory === "SEMUA"
                  ? "filter active"
                  : "filter"
              }
              onClick={() => setActiveCategory("SEMUA")}
            >
              ⚡ SEMUA ({totalEndpoints})
            </button>

            {categories.map((category) => (
              <button
                key={category.name}
                className={
                  activeCategory === category.name
                    ? "filter active"
                    : "filter"
                }
                onClick={() =>
                  setActiveCategory(category.name)
                }
              >
                {category.name} ({category.endpoints.length})
              </button>
            ))}

          </div>

        </section>

        {/* ENDPOINTS */}
        <section className="endpoint-section">

          {filteredCategories.map((category) => {

            const isOpen =
              openCategory === category.name ||
              search.trim() !== "" ||
              activeCategory === category.name;

            return (
              <div
                className="category-card"
                key={category.name}
              >

                <button
                  className="category-header"
                  onClick={() =>
                    setOpenCategory(
                      isOpen ? null : category.name
                    )
                  }
                >

                  <div className="category-left">

                    <div className="category-icon">
                      {category.icon}
                    </div>

                    <div>
                      <h2>
                        {category.name}
                      </h2>

                      <span>
                        {category.endpoints.length}
                        {" "}endpoints
                      </span>
                    </div>

                  </div>

                  <div className="category-right">

                    <strong>
                      {category.endpoints.length}
                    </strong>

                    <span>
                      {isOpen ? "⌃" : "⌄"}
                    </span>

                  </div>

                </button>

                {isOpen && (
                  <div className="endpoint-list">

                    {category.endpoints.map(
                      (endpoint) => (
                        <article
                          className="endpoint-card"
                          key={endpoint.path}
                        >

                          <div className="endpoint-main">

                            <span className="method">
                              {endpoint.method}
                            </span>

                            <div className="endpoint-name">

                              <strong>
                                {endpoint.name}
                              </strong>

                              <span>
                                {endpoint.path}
                              </span>

                            </div>

                            <span className="ready">
                              READY
                            </span>

                            <button className="open-endpoint">
                              OPEN →
                            </button>

                          </div>

                          <div className="endpoint-description">

                            <span>
                              DESCRIPTION ENDPOINT
                            </span>

                            <p>
                              Endpoint {endpoint.name}
                              untuk kebutuhan API
                              DINSTORE.
                            </p>

                          </div>

                        </article>
                      )
                    )}

                  </div>
                )}

              </div>
            );
          })}

        </section>

      </main>

      {/* FLOATING ROBOT */}
      <button
        className="floating-robot"
        onClick={openWhatsApp}
        aria-label="Hubungi DINSTORE"
      >

        <div className="robot-mini">

          <span className="mini-eye left" />
          <span className="mini-eye right" />

          <div className="mini-mouth">
            <i />
            <i />
            <i />
          </div>

        </div>

        <span className="robot-online" />

      </button>

      <footer>
        <strong>DINSTORE API</strong>
        <span>© 2026 All Rights Reserved</span>
      </footer>

    </div>
  );
}

export default App;
