import React, { useMemo, useState } from "react";

/* =========================================================
   DIN API 3.0.0
   ROBOT / TRANSFORMER 3D DOCUMENTATION
========================================================= */

const API_CATEGORIES = [
  /* =========================
     AI
  ========================= */

  {
    name: "AI",
    icon: "✦",
    color: "green",
    path: "/docs/ai",
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
            placeholder: "tes",
            required: true,
          },
          {
            name: "reset",
            label: "Reset",
            placeholder: "oke",
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
    ],
  },

  /* =========================
     ADMIN
  ========================= */

  {
    name: "ADMIN",
    icon: "◇",
    color: "red",
    path: "/docs/admin",
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

  /* =========================
     CACHE
  ========================= */

  {
    name: "CACHE",
    icon: "▣",
    color: "cyan",
    path: "/docs/cache",
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

  /* =========================
     DOWNLOAD
  ========================= */

  {
    name: "DOWNLOAD",
    icon: "⇩",
    color: "blue",
    path: "/docs/download",
    endpoints: [
      {
        name: "TikTok Downloader",
        method: "GET",
        path: "/api/tiktok",
        description: "Download video TikTok",
        params: [
          {
            name: "url",
            label: "URL",
            placeholder: "https://vt.tiktok.com/...",
            required: true,
          },
        ],
      },

      {
        name: "Instagram Downloader",
        method: "GET",
        path: "/api/instagram",
        description: "Download media Instagram",
        params: [
          {
            name: "url",
            label: "URL",
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
            label: "URL",
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
            label: "URL",
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
            label: "URL",
            placeholder: "https://mediafire.com/...",
            required: true,
          },
        ],
      },
    ],
  },

  /* =========================
     FUN
  ========================= */

  {
    name: "FUN",
    icon: "♣",
    color: "pink",
    path: "/docs/fun",
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

  /* =========================
     LEADERBOARD
  ========================= */

  {
    name: "LEADERBOARD",
    icon: "♛",
    color: "gold",
    path: "/docs/leaderboard",
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

  /* =========================
     LIBRARY
  ========================= */

  {
    name: "LIBRARY",
    icon: "▤",
    color: "orange",
    path: "/docs/library",
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

  /* =========================
     MAKER
  ========================= */

  {
    name: "MAKER",
    icon: "✣",
    color: "pink",
    path: "/docs/maker",
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
            placeholder: "ZEL",
            required: true,
          },
        ],
      },
    ],
  },

  /* =========================
     NEWS
  ========================= */

  {
    name: "NEWS",
    icon: "▥",
    color: "cyan",
    path: "/docs/news",
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

  /* =========================
     RANDOM
  ========================= */

  {
    name: "RANDOM",
    icon: "◆",
    color: "purple",
    path: "/docs/random",
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

  /* =========================
     SEARCH
  ========================= */

  {
    name: "SEARCH",
    icon: "⌕",
    color: "green",
    path: "/docs/search",
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

  /* =========================
     STALK
  ========================= */

  {
    name: "STALK",
    icon: "◉",
    color: "purple",
    path: "/docs/stalk",
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

  /* =========================
     TOOLS
  ========================= */

  {
    name: "TOOLS",
    icon: "⌘",
    color: "orange",
    path: "/docs/tools",
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
            placeholder: "dinns.my.id",
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
   ICON
========================================================= */

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
   APP
========================================================= */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState("AI");

  const totalEndpoints = API_CATEGORIES.reduce(
    (total, category) => total + category.endpoints.length,
    0
  );

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return API_CATEGORIES;
    }

    return API_CATEGORIES
      .map((category) => {
        const categoryMatch = category.name
          .toLowerCase()
          .includes(keyword);

        const endpoints = category.endpoints.filter(
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

        if (endpoints.length > 0) {
          return {
            ...category,
            endpoints,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [search]);

  const scrollHome = () => {
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollCategory = (name) => {
    setMenuOpen(false);

    setTimeout(() => {
      const element = document.getElementById(
        `category-${name.toLowerCase()}`
      );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        setOpenCategory(name);
      }
    }, 200);
  };

  return (
    <div className="app">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="background-grid" />
      <div className="scanlines" />

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="header">

        <div className="header-left">

          <button
            className={`menu-button ${
              menuOpen ? "active" : ""
            }`}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="header-brand">
            <RobotIcon />

            <div>
              <strong>DIN API🔥</strong>
              <small>ROBOT SYSTEM</small>
            </div>
          </div>

        </div>

        <div className="header-right">

          <div className="connection">
            <span />
            ONLINE
          </div>

          <div className="version">
            v1.0.0
          </div>

        </div>

      </header>

      {/* =================================================
          NAV OVERLAY
      ================================================= */}

      <div
        className={`nav-overlay ${
          menuOpen ? "show" : ""
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* =================================================
          SIDE NAV
      ================================================= */}

      <aside
        className={`side-nav ${
          menuOpen ? "open" : ""
        }`}
      >

        <div className="side-top">

          <div>
            <small>NAVIGATION</small>
            <h2>DIN API🔥</h2>
          </div>

          <button
            className="close-button"
            onClick={() => setMenuOpen(false)}
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
            <span className="nav-icon">⌂</span>

            <b>HOME</b>

            <small>00</small>
          </button>

          {API_CATEGORIES.map(
            (category, index) => (
              <button
                key={category.name}
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
                  {category.icon}
                </span>

                <b>{category.name}</b>

                <small>
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </small>
              </button>
            )
          )}

        </nav>

        <div className="side-footer">
          <span>SYSTEM STATUS</span>
          <strong>● OPERATIONAL</strong>
        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="main">

        {/* =================================================
            HERO
        ================================================= */}

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

              <h1>DOCS</h1>

              <span>v3.0.0</span>

            </div>

            <p>
              A comprehensive and user friendly API
              solution for modern applications.
            </p>

            <div className="hero-system">

              <div className="system-item">

                <span>CATEGORIES</span>

                <strong>
                  {API_CATEGORIES.length}
                </strong>

              </div>

              <div className="system-item active">

                <span>ENDPOINTS</span>

                <strong>
                  {totalEndpoints}
                </strong>

              </div>

              <div className="system-item">

                <span>STATUS</span>

                <strong>ONLINE</strong>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="search-section">

          <div className="search-box">

            <span className="search-icon">
              ⌕
            </span>

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="SEARCH ENDPOINT / CATEGORY..."
            />

            {search && (
              <button
                className="clear-search"
                onClick={() =>
                  setSearch("")
                }
              >
                ×
              </button>
            )}

            <span className="search-status">
              SEARCH
            </span>

          </div>

        </section>

        {/* =================================================
            CATEGORY GRID
        ================================================= */}

        <section className="categories">

          {filteredCategories.map(
            (category, index) => {

              const isOpen =
                openCategory ===
                category.name;

              return (
                <article
                  key={category.name}
                  id={`category-${category.name.toLowerCase()}`}
                  className={`category-card ${
                    isOpen
                      ? "opened"
                      : ""
                  }`}
                >

                  {/* CATEGORY TOP */}

                  <button
                    className="category-top"
                    onClick={() =>
                      setOpenCategory(
                        isOpen
                          ? null
                          : category.name
                      )
                    }
                  >

                    <div
                      className={`category-icon ${category.color}`}
                    >
                      {category.icon}
                    </div>

                    <div className="category-info">

                      <div className="category-index">
                        MODULE{" "}
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <h2>
                        {category.name}
                      </h2>

                      <span>
                        {category.endpoints.length}{" "}
                        ENDPOINTS
                      </span>

                    </div>

                    <div className="category-right">

                      <span className="open-label">
                        {isOpen
                          ? "CLOSE"
                          : "OPEN"}
                      </span>

                      <span className="category-arrow">
                        {isOpen
                          ? "↑"
                          : "↓"}
                      </span>

                    </div>

                  </button>

                  {/* PATH */}

                  <div className="category-path">
                    <span>PATH</span>
                    {category.path}
                  </div>

                  {/* ENDPOINTS */}

                  <div
                    className={`endpoint-list ${
                      isOpen
                        ? "visible"
                        : ""
                    }`}
                  >

                    {category.endpoints.map(
                      (endpoint) => (
                        <EndpointCard
                          endpoint={endpoint}
                          key={endpoint.path}
                        />
                      )
                    )}

                  </div>

                </article>
              );
            }
          )}

          {filteredCategories.length ===
            0 && (
            <div className="empty">
              <RobotIcon />

              <strong>
                MODULE NOT FOUND
              </strong>

              <span>
                Endpoint atau category tidak
                ditemukan.
              </span>

            </div>
          )}

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="footer">

          <div>
            <strong>Documentation v3.0.0</strong>
            <span>
              ROBOTIC API SYSTEM
            </span>
          </div>

          <div className="footer-status">
            <span />
            ALL SYSTEMS OPERATIONAL
          </div>

          <div>
            BUILT FOR DEVELOPERS
          </div>

        </footer>

      </main>

      {/* =================================================
          FLOATING ROBOT
      ================================================= */}

      <div className="floating-robot">

        <RobotIcon />

        <span className="floating-light" />

      </div>

    </div>
  );
}

/* =========================================================
   ENDPOINT CARD
========================================================= */

function EndpointCard({ endpoint }) {

  const [expanded, setExpanded] =
    useState(false);

  const [values, setValues] =
    useState({});

  const [response, setResponse] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const updateValue = (
    name,
    value
  ) => {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const execute = async () => {

    setLoading(true);
    setResponse(null);

    try {

      const query =
        new URLSearchParams();

      endpoint.params.forEach(
        (param) => {

          const value =
            values[param.name];

          if (
            value !== undefined &&
            value !== ""
          ) {
            query.append(
              param.name,
              value
            );
          }

        }
      );

      const url =
        endpoint.path +
        (
          query.toString()
            ? `?${query.toString()}`
            : ""
        );

      const started =
        performance.now();

      const res =
        await fetch(url);

      const finished =
        performance.now();

      let data;

      try {
        data =
          await res.json();
      } catch {
        data =
          await res.text();
      }

      setResponse({
        status: res.ok,
        code: res.status,
        time:
          Math.round(
            finished - started
          ),
        data,
      });

    } catch (error) {

      setResponse({
        status: false,
        code: 0,
        time: 0,
        data: {
          error:
            error.message,
        },
      });

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      className={`endpoint ${
        expanded ? "expanded" : ""
      }`}
    >

      {/* HEADER */}

      <button
        className="endpoint-header"
        onClick={() =>
          setExpanded(
            !expanded
          )
        }
      >

        <div className="method">
          {endpoint.method}
        </div>

        <div className="endpoint-main">

          <strong>
            {endpoint.name}
          </strong>

          <span>
            {endpoint.path}
          </span>

        </div>

        <div className="endpoint-open">
          {expanded
            ? "CLOSE"
            : "OPEN"}
          <span>
            {expanded
              ? "↑"
              : "→"}
          </span>
        </div>

      </button>

      {/* BODY */}

      {expanded && (
        <div className="endpoint-body">

          <div className="endpoint-description">

            <span>
              DESCRIPTION
            </span>

            <p>
              {endpoint.description}
            </p>

          </div>

          {endpoint.params.length >
            0 && (
            <div className="request-panel">

              <div className="panel-title">
                PARAMETERS
              </div>

              <div className="params">

                {endpoint.params.map(
                  (param) => (
                    <label
                      className="param"
                      key={
                        param.name
                      }
                    >

                      <div className="param-label">

                        <span>
                          {param.label}
                        </span>

                        <small>
                          {param.required
                            ? "REQUIRED"
                            : "OPTIONAL"}
                        </small>

                      </div>

                      <input
                        value={
                          values[
                            param.name
                          ] || ""
                        }
                        onChange={(e) =>
                          updateValue(
                            param.name,
                            e.target
                              .value
                          )
                        }
                        placeholder={
                          param.placeholder
                        }
                      />

                    </label>
                  )
                )}

              </div>

            </div>
          )}

          <div className="execute-row">

            <button
              className="execute-button"
              onClick={execute}
              disabled={loading}
            >

              <span>
                {loading
                  ? "PROCESSING"
                  : "EXECUTE"}
              </span>

              <b>
                {loading
                  ? "..."
                  : "▶"}
              </b>

            </button>

            <div className="request-info">
              METHOD{" "}
              <strong>
                {endpoint.method}
              </strong>
            </div>

          </div>

          {response && (
            <div className="response-panel">

              <div className="response-header">

                <div>

                  <span>
                    RESPONSE
                  </span>

                  <strong
                    className={
                      response.status
                        ? "success"
                        : "error"
                    }
                  >
                    {response.code ||
                      "ERROR"}
                  </strong>

                </div>

                <div>
                  {response.time}ms
                </div>

              </div>

              <pre>
                {typeof response.data ===
                "string"
                  ? response.data
                  : JSON.stringify(
                      response.data,
                      null,
                      2
                    )}
              </pre>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
