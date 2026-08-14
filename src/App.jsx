import React, { useMemo, useState } from "react";
import "./style.css";

/* =========================================================
   DIN API
   DOCUMENTATION + API TESTER
========================================================= */

const API_BASE =
  import.meta.env.VITE_API_URL ||
  window.location.origin;

/* =========================================================
   ENDPOINTS
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
        description: "AI chat assistant.",
        params: [
          {
            name: "q",
            label: "Prompt",
            placeholder: "Halo, siapa kamu?",
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
        name: "AI ChatGPT",
        method: "GET",
        path: "/api/ai/chatgpt",
        description: "Chat dengan AI ChatGPT.",
        params: [
          {
            name: "q",
            label: "Question",
            placeholder: "Jelaskan tentang AI",
            required: true,
          },
        ],
      },
      {
        name: "AI Lyrics Generator",
        method: "GET",
        path: "/api/ai/lyricsgen",
        description: "Generate lyrics menggunakan AI.",
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
        description: "Generate kode menggunakan AI.",
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
        description: "AI chat generation.",
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

  {
    name: "ADMIN",
    icon: "◇",
    color: "red",
    endpoints: [
      {
        name: "Admin Status",
        method: "GET",
        path: "/api/admin/status",
        description: "Check admin status.",
        params: [],
      },
      {
        name: "Admin Info",
        method: "GET",
        path: "/api/admin/info",
        description: "Get admin information.",
        params: [],
      },
      {
        name: "Server Status",
        method: "GET",
        path: "/api/admin/server",
        description: "Check server information.",
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
        description: "Get cached data.",
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
        description: "Clear cache.",
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
        description: "Download video TikTok.",
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
        description: "Download media Instagram.",
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
        description: "Download CapCut.",
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
        description: "Download Facebook media.",
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
        description: "Download MediaFire.",
        params: [
          {
            name: "url",
            label: "MediaFire URL",
            placeholder: "https://mediafire.com/...",
            required: true,
          },
        ],
      },
      {
        name: "Pinterest Downloader",
        method: "GET",
        path: "/api/download/pinterest",
        description: "Download media Pinterest.",
        params: [
          {
            name: "url",
            label: "Pinterest URL",
            placeholder: "https://pinterest.com/...",
            required: true,
          },
        ],
      },
      {
        name: "Spotify Downloader",
        method: "GET",
        path: "/api/download/spotify",
        description: "Get Spotify media information.",
        params: [
          {
            name: "url",
            label: "Spotify URL",
            placeholder: "https://open.spotify.com/...",
            required: true,
          },
        ],
      },
      {
        name: "SoundCloud Downloader",
        method: "GET",
        path: "/api/download/soundcloud",
        description: "Download SoundCloud media.",
        params: [
          {
            name: "url",
            label: "SoundCloud URL",
            placeholder: "https://soundcloud.com/...",
            required: true,
          },
        ],
      },
      {
        name: "YouTube Play",
        method: "GET",
        path: "/api/download/ytplay",
        description: "Get YouTube media.",
        params: [
          {
            name: "url",
            label: "YouTube URL",
            placeholder: "https://youtube.com/watch?v=...",
            required: true,
          },
        ],
      },
      {
        name: "YouTube MP3",
        method: "GET",
        path: "/api/download/ytmp3",
        description: "Convert YouTube audio.",
        params: [
          {
            name: "url",
            label: "YouTube URL",
            placeholder: "https://youtube.com/watch?v=...",
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
        description: "Generate random joke.",
        params: [],
      },
      {
        name: "Truth",
        method: "GET",
        path: "/api/fun/truth",
        description: "Random truth question.",
        params: [],
      },
      {
        name: "Dare",
        method: "GET",
        path: "/api/fun/dare",
        description: "Random dare.",
        params: [],
      },
      {
        name: "Quotes",
        method: "GET",
        path: "/api/fun/quotes",
        description: "Random quotes.",
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
        description: "Get leaderboard data.",
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
        description: "Get library information.",
        params: [],
      },
      {
        name: "Library Search",
        method: "GET",
        path: "/api/library/search",
        description: "Search library.",
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
        description: "Create styled text.",
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
        description: "Create sticker.",
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
        description: "Generate logo.",
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
        description: "Get latest news.",
        params: [],
      },
      {
        name: "Search News",
        method: "GET",
        path: "/api/news/search",
        description: "Search news.",
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
        description: "Get random image.",
        params: [],
      },
      {
        name: "Random Number",
        method: "GET",
        path: "/api/random/number",
        description: "Generate random number.",
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
        description: "Search information from web.",
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
        description: "Search images.",
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
        description: "Get public TikTok profile information.",
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
        description: "Get public Instagram profile information.",
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
        description: "Check domain information.",
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
        description: "Generate QR code.",
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
        description: "Shorten URL.",
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
   ROBOT
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
   URL BUILDER
========================================================= */

function buildUrl(path, values) {
  const query = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const queryString = query.toString();

  return `${API_BASE}${path}${
    queryString ? `?${queryString}` : ""
  }`;
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState("AI");
  const [openEndpoint, setOpenEndpoint] = useState(null);

  const [values, setValues] = useState({});
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});

  const totalEndpoints = useMemo(() => {
    return API_CATEGORIES.reduce(
      (total, category) =>
        total + category.endpoints.length,
      0
    );
  }, []);

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

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
          category.endpoints.filter((endpoint) => {
            return (
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
          });

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

  /* =======================================================
     HOME
  ======================================================= */

  const scrollHome = () => {
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     CATEGORY
  ======================================================= */

  const scrollCategory = (name) => {
    setMenuOpen(false);
    setOpenCategory(name);

    setTimeout(() => {
      const element = document.getElementById(
        `category-${name.toLowerCase()}`
      );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  /* =======================================================
     PARAMETER
  ======================================================= */

  const updateValue = (
    endpointPath,
    parameter,
    value
  ) => {
    setValues((previous) => ({
      ...previous,
      [endpointPath]: {
        ...(previous[endpointPath] || {}),
        [parameter]: value,
      },
    }));
  };

  /* =======================================================
     TEST API
  ======================================================= */

  const testEndpoint = async (endpoint) => {
    const endpointValues =
      values[endpoint.path] || {};

    for (const parameter of endpoint.params) {
      if (
        parameter.required &&
        !endpointValues[parameter.name]
      ) {
        setResponses((previous) => ({
          ...previous,
          [endpoint.path]: {
            error: `Parameter "${parameter.name}" wajib diisi.`,
          },
        }));

        return;
      }
    }

    const url = buildUrl(
      endpoint.path,
      endpointValues
    );

    setLoading((previous) => ({
      ...previous,
      [endpoint.path]: true,
    }));

    setResponses((previous) => ({
      ...previous,
      [endpoint.path]: null,
    }));

    try {
      const response = await fetch(url, {
        method: endpoint.method,
        headers: {
          Accept: "application/json",
        },
      });

      const contentType =
        response.headers.get("content-type") || "";

      let result;

      if (contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      setResponses((previous) => ({
        ...previous,
        [endpoint.path]: {
          status: response.status,
          ok: response.ok,
          data: result,
        },
      }));
    } catch (error) {
      setResponses((previous) => ({
        ...previous,
        [endpoint.path]: {
          error:
            error?.message ||
            "Gagal menghubungkan ke API.",
        },
      }));
    } finally {
      setLoading((previous) => ({
        ...previous,
        [endpoint.path]: false,
      }));
    }
  };

  /* =======================================================
     COPY
  ======================================================= */

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert("URL berhasil disalin!");
    } catch {
      alert("Gagal menyalin URL.");
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="app">
      {/* BACKGROUND */}
      <div className="background-grid" />
      <div className="scanlines" />

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <button
            className={`menu-button ${
              menuOpen ? "active" : ""
            }`}
            onClick={() =>
              setMenuOpen(true)
            }
            aria-label="Open menu"
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
            v3.0.0
          </div>
        </div>
      </header>

      {/* OVERLAY */}
      <div
        className={`nav-overlay ${
          menuOpen ? "show" : ""
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* SIDEBAR */}
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

      {/* MAIN */}
      <main className="main">
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
              <h1>DOCS</h1>
              <span>v3.0.0</span>
            </div>

            <p>
              A comprehensive and user
              friendly API solution for
              modern applications.
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

        {/* SEARCH */}
        <div className="search-wrapper">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search endpoint, category..."
          />
        </div>

        {/* DOCUMENTATION */}
        {filteredCategories.length === 0 ? (
          <div className="empty-state">
            <strong>
              ENDPOINT NOT FOUND
            </strong>

            <p>
              Tidak ada endpoint yang cocok
              dengan pencarian "{search}".
            </p>
          </div>
        ) : (
          filteredCategories.map(
            (category) => {
              const isCategoryOpen =
                openCategory ===
                category.name;

              return (
                <section
                  key={category.name}
                  id={`category-${category.name.toLowerCase()}`}
                  className={`category ${
                    isCategoryOpen
                      ? "open"
                      : ""
                  } ${category.name.toLowerCase()}`}
                >
                  {/* CATEGORY HEADER */}
                  <button
                    className="category-header"
                    onClick={() =>
                      setOpenCategory(
                        isCategoryOpen
                          ? ""
                          : category.name
                      )
                    }
                  >
                    <div className="category-title">
                      <div
                        className="category-icon"
                      >
                        {category.icon}
                      </div>

                      <div>
                        <h2>
                          {category.name}
                        </h2>

                        <p>
                          {
                            category.endpoints
                              .length
                          }{" "}
                          API endpoints
                        </p>
                      </div>
                    </div>

                    <div className="category-meta">
                      <span className="endpoint-count">
                        {
                          category.endpoints
                            .length
                        }{" "}
                        ENDPOINTS
                      </span>

                      <span className="category-arrow">
                        ▼
                      </span>
                    </div>
                  </button>

                  {/* ENDPOINTS */}
                  {isCategoryOpen && (
                    <div className="endpoint-list">
                      {category.endpoints.map(
                        (endpoint) => {
                          const key =
                            `${category.name}-${endpoint.path}`;

                          const isOpen =
                            openEndpoint === key;

                          const endpointValues =
                            values[
                              endpoint.path
                            ] || {};

                          const response =
                            responses[
                              endpoint.path
                            ];

                          const isLoading =
                            loading[
                              endpoint.path
                            ];

                          const requestUrl =
                            buildUrl(
                              endpoint.path,
                              endpointValues
                            );

                          return (
                            <div
                              className={`endpoint-card ${
                                isOpen
                                  ? "open"
                                  : ""
                              }`}
                              key={key}
                            >
                              {/* ENDPOINT HEADER */}
                              <button
                                className="endpoint-head"
                                onClick={() =>
                                  setOpenEndpoint(
                                    isOpen
                                      ? null
                                      : key
                                  )
                                }
                              >
                                <span className="method-badge">
                                  {
                                    endpoint.method
                                  }
                                </span>

                                <span className="endpoint-name">
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
                                </span>

                                <span className="endpoint-arrow">
                                  ▼
                                </span>
                              </button>

                              {/* BODY */}
                              {isOpen && (
                                <div className="endpoint-body">
                                  <p className="endpoint-description">
                                    {
                                      endpoint.description
                                    }
                                  </p>

                                  {/* PARAMETERS */}
                                  {endpoint.params
                                    .length >
                                    0 && (
                                    <>
                                      <div className="params-title">
                                        PARAMETERS
                                      </div>

                                      <div className="params">
                                        {endpoint.params.map(
                                          (
                                            parameter
                                          ) => (
                                            <div
                                              className="param"
                                              key={
                                                parameter.name
                                              }
                                            >
                                              <span className="param-name">
                                                {
                                                  parameter.name
                                                }
                                              </span>

                                              <span className="param-label">
                                                {
                                                  parameter.label
                                                }
                                              </span>

                                              {parameter.required && (
                                                <span className="required">
                                                  REQUIRED
                                                </span>
                                              )}

                                              <input
                                                type="text"
                                                placeholder={
                                                  parameter.placeholder
                                                }
                                                value={
                                                  endpointValues[
                                                    parameter
                                                      .name
                                                  ] ||
                                                  ""
                                                }
                                                onChange={(
                                                  event
                                                ) =>
                                                  updateValue(
                                                    endpoint.path,
                                                    parameter.name,
                                                    event
                                                      .target
                                                      .value
                                                  )
                                                }
                                              />
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </>
                                  )}

                                  {/* REQUEST */}
                                  <div className="request-box">
                                    <div className="request-title">
                                      <span>
                                        REQUEST URL
                                      </span>

                                      <button
                                        className="copy-button"
                                        onClick={() =>
                                          copyUrl(
                                            requestUrl
                                          )
                                        }
                                      >
                                        COPY
                                      </button>
                                    </div>

                                    <code>
                                      {
                                        requestUrl
                                      }
                                    </code>
                                  </div>

                                  {/* TESTER */}
                                  <div className="tester">
                                    <div className="tester-title">
                                      API TESTER
                                    </div>

                                    <div className="tester-row">
                                      <input
                                        value={
                                          requestUrl
                                        }
                                        readOnly
                                      />

                                      <button
                                        className="test-button"
                                        onClick={() =>
                                          testEndpoint(
                                            endpoint
                                          )
                                        }
                                        disabled={
                                          isLoading
                                        }
                                      >
                                        {isLoading
                                          ? "LOADING..."
                                          : "TEST API"}
                                      </button>
                                    </div>

                                    {/* RESPONSE */}
                                    {response && (
                                      <div className="response-box">
                                        {response.error ? (
                                          <pre>
                                            {JSON.stringify(
                                              response,
                                              null,
                                              2
                                            )}
                                          </pre>
                                        ) : (
                                          <pre>
                                            {typeof response.data ===
                                            "string"
                                              ? response.data
                                              : JSON.stringify(
                                                  {
                                                    status:
                                                      response.status,
                                                    success:
                                                      response.ok,
                                                    data: response.data,
                                                  },
                                                  null,
                                                  2
                                                )}
                                          </pre>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </section>
              );
            }
          )
        )}

        {/* FOOTER */}
        <footer className="footer">
          <strong>
            DIN API🔥
          </strong>

          <span>
            Robot System • API Documentation
            v3.0.0
          </span>
        </footer>
      </main>
    </div>
  );
}
