import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const endpoints = [
  {
    category: "DOWNLOAD",
    name: "TikTok Downloader",
    path: "/api/download/tiktok",
    parameter: "url",
    placeholder: "https://www.tiktok.com/@user/video/..."
  },
  {
    category: "DOWNLOAD",
    name: "Instagram Downloader",
    path: "/api/download/instagram",
    parameter: "url",
    placeholder: "https://www.instagram.com/p/..."
  },
  {
    category: "DOWNLOAD",
    name: "YouTube Downloader",
    path: "/api/download/youtube",
    parameter: "url",
    placeholder: "https://www.youtube.com/watch?v=..."
  },
  {
    category: "AI",
    name: "ChatGPT",
    path: "/api/ai/chatgpt",
    parameter: "text",
    placeholder: "Tulis pertanyaan..."
  },
  {
    category: "AI",
    name: "AI Aiko",
    path: "/api/ai/aiko",
    parameter: "text",
    placeholder: "Tulis pesan..."
  },
  {
    category: "AI",
    name: "Lyrics Generator",
    path: "/api/ai/lyricsgen",
    parameter: "text",
    placeholder: "Contoh: lagu tentang persahabatan..."
  },
  {
    category: "TOOLS",
    name: "AI Coder",
    path: "/api/tools/aicoder",
    parameter: "text",
    placeholder: "Contoh: buatkan kode JavaScript..."
  },
  {
    category: "TOOLS",
    name: "QRIS Generator",
    path: "/api/tools/qrisgen",
    parameter: "text",
    placeholder: "Masukkan parameter..."
  }
];

export default function ConnectAPI() {
  const [selectedPath, setSelectedPath] =
    useState(endpoints[0].path);

  const [input, setInput] = useState("");

  const [apiBase, setApiBase] = useState("");

  const [apiKey, setApiKey] = useState("");

  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(null);

  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);

  const selected = useMemo(() => {
    return (
      endpoints.find(
        (item) =>
          item.path === selectedPath
      ) || endpoints[0]
    );
  }, [selectedPath]);

  function getBaseURL() {
    if (apiBase.trim()) {
      return apiBase
        .trim()
        .replace(/\/+$/, "");
    }

    return window.location.origin;
  }

  function buildURL() {
    const base = getBaseURL();

    const url =
      new URL(
        selected.path,
        base.endsWith("/")
          ? base
          : base + "/"
      );

    if (input.trim()) {
      url.searchParams.set(
        selected.parameter,
        input.trim()
      );
    }

    return url.toString();
  }

  async function testConnection() {
    setError("");
    setResponse(null);

    if (!input.trim()) {
      setError(
        `Masukkan ${selected.parameter} terlebih dahulu.`
      );
      return;
    }

    setLoading(true);

    try {
      const url = buildURL();

      const headers = {};

      if (apiKey.trim()) {
        headers.Authorization =
          `Bearer ${apiKey.trim()}`;

        headers["x-api-key"] =
          apiKey.trim();
      }

      const result = await fetch(url, {
        method: "GET",
        headers
      });

      const contentType =
        result.headers.get(
          "content-type"
        ) || "";

      let data;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        data = await result.json();
      } else {
        data = await result.text();
      }

      setResponse({
        status: result.status,
        ok: result.ok,
        url,
        data
      });
    } catch (err) {
      setError(
        "Gagal menghubungkan API: " +
          err.message
      );
    }

    setLoading(false);
  }

  async function copyURL() {
    const url = buildURL();

    try {
      await navigator.clipboard.writeText(
        url
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setError(
        "URL tidak dapat disalin."
      );
    }
  }

  function formatResponse(data) {
    if (typeof data === "string") {
      return data;
    }

    try {
      return JSON.stringify(
        data,
        null,
        2
      );
    } catch {
      return String(data);
    }
  }

  return (
    <div className="api-page">

      {/* HEADER */}

      <header className="api-header">

        <Link
          to="/dashboard"
          className="api-brand"
        >
          <div className="api-logo">
            D
          </div>

          <div>
            <strong>
              DINSTORE
            </strong>

            <small>
              API CONNECT
            </small>
          </div>
        </Link>

        <Link
          to="/dashboard"
          className="back-dashboard"
        >
          ← DASHBOARD
        </Link>

      </header>


      {/* CONTENT */}

      <main className="api-content">

        <section className="api-intro">

          <div>

            <small>
              API CONNECTION
            </small>

            <h1>
              Connect API
            </h1>

            <p>
              Pilih endpoint, masukkan
              parameter, lalu test API
              secara langsung.
            </p>

          </div>

          <div className="api-online">
            <span />
            API ONLINE
          </div>

        </section>


        {/* BASE URL */}

        <section className="connection-card">

          <div className="card-heading">

            <div>
              <small>
                CONNECTION
              </small>

              <h2>
                API Configuration
              </h2>
            </div>

          </div>


          <label>
            API BASE URL
          </label>

          <input
            value={apiBase}
            onChange={(e) =>
              setApiBase(e.target.value)
            }
            placeholder={
              window.location.origin
            }
          />

          <small className="input-help">
            Kosongkan untuk menggunakan
            domain website saat ini.
          </small>


          <label>
            API KEY
            <span className="optional">
              OPTIONAL
            </span>
          </label>

          <input
            type="password"
            value={apiKey}
            onChange={(e) =>
              setApiKey(e.target.value)
            }
            placeholder="Masukkan API key member..."
          />

        </section>


        {/* ENDPOINT SELECTOR */}

        <section className="endpoint-selector">

          <div className="card-heading">

            <div>
              <small>
                ENDPOINT
              </small>

              <h2>
                Select API
              </h2>
            </div>

            <span>
              {endpoints.length} API
            </span>

          </div>


          <div className="endpoint-list">

            {endpoints.map((item) => (

              <button
                key={item.path}
                className={
                  selected.path ===
                  item.path
                    ? "endpoint-select active"
                    : "endpoint-select"
                }
                onClick={() => {
                  setSelectedPath(
                    item.path
                  );

                  setResponse(null);
                  setError("");
                  setInput("");
                }}
              >

                <div>

                  <span className="endpoint-method">
                    GET
                  </span>

                  <strong>
                    {item.name}
                  </strong>

                </div>

                <code>
                  {item.path}
                </code>

              </button>

            ))}

          </div>

        </section>


        {/* TESTER */}

        <section className="tester-card">

          <div className="tester-header">

            <div>

              <small>
                API TESTER
              </small>

              <h2>
                {selected.name}
              </h2>

            </div>

            <span className="method-badge">
              GET
            </span>

          </div>


          <div className="selected-url">

            <code>
              {selected.path}
            </code>

          </div>


          <label>
            {selected.parameter.toUpperCase()}
          </label>

          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder={
              selected.placeholder
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                testConnection();
              }
            }}
          />


          {error && (
            <div className="api-error">
              {error}
            </div>
          )}


          <div className="tester-actions">

            <button
              className="test-api-button"
              onClick={testConnection}
              disabled={loading}
            >
              {loading
                ? "REQUEST..."
                : "▶ TEST API"}
            </button>

            <button
              className="copy-button"
              onClick={copyURL}
            >
              {copied
                ? "COPIED!"
                : "COPY URL"}
            </button>

          </div>

        </section>


        {/* REQUEST */}

        <section className="request-card">

          <div className="response-title">

            <div>
              <small>
                REQUEST
              </small>

              <h2>
                Request URL
              </h2>
            </div>

          </div>

          <div className="request-url">
            <code>
              {buildURL()}
            </code>
          </div>

        </section>


        {/* RESPONSE */}

        {response && (

          <section className="response-card">

            <div className="response-title">

              <div>
                <small>
                  RESPONSE
                </small>

                <h2>
                  API Response
                </h2>
              </div>

              <span
                className={
                  response.ok
                    ? "status-ok"
                    : "status-error"
                }
              >
                HTTP {response.status}
              </span>

            </div>


            <div className="response-url">
              {response.url}
            </div>


            <pre className="response-code">
{formatResponse(response.data)}
            </pre>

          </section>

        )}


        {/* EXAMPLE */}

        <section className="example-card">

          <div>

            <small>
              JAVASCRIPT
            </small>

            <h2>
              Example
            </h2>

          </div>

          <pre>
{`const response = await fetch(
  "${buildURL()}"
);

const data = await response.json();

console.log(data);`}
          </pre>

        </section>

      </main>


      <footer className="api-footer">

        <strong>
          DINSTORE API
        </strong>

        <span>
          Secure API Connection
        </span>

      </footer>

    </div>
  );
}
