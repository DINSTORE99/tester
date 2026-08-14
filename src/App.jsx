import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { supabase } from "./lib/supabase";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const ENDPOINTS = [
  {
    name: "TikTok Downloader",
    method: "GET",
    path: "/api/download/tiktok",
    category: "DOWNLOAD",
    icon: "♪",
  },
  {
    name: "Instagram Downloader",
    method: "GET",
    path: "/api/download/instagram",
    category: "DOWNLOAD",
    icon: "◎",
  },
  {
    name: "CapCut Downloader",
    method: "GET",
    path: "/api/download/capcut",
    category: "DOWNLOAD",
    icon: "◈",
  },
  {
    name: "AI ChatGPT",
    method: "POST",
    path: "/api/ai/chatgpt",
    category: "AI",
    icon: "✦",
  },
  {
    name: "AI Aiko",
    method: "GET",
    path: "/api/ai/aiko",
    category: "AI",
    icon: "✦",
  },
  {
    name: "AI4Chat",
    method: "GET",
    path: "/api/ai/ai4chat",
    category: "AI",
    icon: "✦",
  },
  {
    name: "Lyrics Generator",
    method: "GET",
    path: "/api/ai/lyricsgen",
    category: "AI",
    icon: "♫",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function copyText(text) {
  navigator.clipboard?.writeText(text);
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysLeft(date) {
  if (!date) return 0;

  const now = new Date();
  const end = new Date(date);

  return Math.max(
    0,
    Math.ceil(
      (end.getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
}

/* =========================================================
   LOGO
========================================================= */

function Logo() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <span />
        <span />
      </div>

      <div>
        <strong>DIN API🔥</strong>
        <small>API SYSTEM</small>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  suffix,
  icon,
  color = "purple",
}) {
  return (
    <div className="stat-card">
      <div>
        <small>{title}</small>

        <strong>
          {value}
          {suffix && (
            <em>{suffix}</em>
          )}
        </strong>
      </div>

      <div className={`stat-icon ${color}`}>
        {icon}
      </div>
    </div>
  );
}

/* =========================================================
   MEMBER DASHBOARD
========================================================= */

function MemberDashboard({
  user,
  profile,
  apiKey,
  keyInfo,
  onLogout,
}) {
  const [copied, setCopied] = useState(false);

  const limit =
    keyInfo?.daily_limit ??
    profile?.daily_limit ??
    100;

  const used =
    keyInfo?.requests_today ??
    profile?.requests_today ??
    0;

  const remaining = Math.max(
    0,
    limit - used
  );

  const expires =
    keyInfo?.expires_at ??
    profile?.expires_at;

  const percent =
    limit > 0
      ? Math.min(
          100,
          Math.round(
            (used / limit) * 100
          )
        )
      : 0;

  const copyKey = () => {
    if (!apiKey) return;

    copyText(apiKey);

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      1500
    );
  };

  return (
    <div className="dashboard">

      <div className="welcome">
        <span>Welcome back,</span>

        <h1>
          {user?.email || "Member"} 👋
        </h1>

        <label>MEMBER</label>
      </div>

      {/* STATS */}

      <div className="stats-grid">

        <StatCard
          title="REQUESTS TODAY"
          value={used}
          suffix={` / ${limit}`}
          icon="⌁"
          color="purple"
        />

        <StatCard
          title="REMAINING"
          value={remaining}
          icon="◒"
          color="blue"
        />

        <StatCard
          title="EXPIRES"
          value={
            expires
              ? formatDate(expires)
              : "Unlimited"
          }
          icon="◷"
          color="pink"
        />

        <StatCard
          title="STATUS"
          value={
            expires &&
            daysLeft(expires) <= 0
              ? "Expired"
              : "Active"
          }
          icon="✓"
          color="green"
        />

      </div>

      {/* API KEY */}

      <div className="two-column">

        <section className="panel">

          <div className="panel-title">
            <div>
              <span className="eyebrow">
                API ACCESS
              </span>

              <h2>
                YOUR API KEY
              </h2>
            </div>

            <button
              className="small-button"
              onClick={copyKey}
            >
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>

          <div className="key-box">
            {apiKey || "API KEY BELUM DIBUAT"}
          </div>

          <p className="warning">
            ⚠ Jangan bagikan API key kepada
            siapapun.
          </p>

          <div className="usage">

            <div className="usage-head">
              <span>DAILY USAGE</span>

              <strong>
                {used} / {limit}
              </strong>
            </div>

            <div className="progress">
              <span
                style={{
                  width: `${percent}%`,
                }}
              />
            </div>

          </div>

        </section>

        {/* QUICK START */}

        <section className="panel">

          <div className="panel-title">

            <div>
              <span className="eyebrow">
                QUICK START
              </span>

              <h2>
                API REQUEST
              </h2>
            </div>

            <button
              className="small-button"
              onClick={() =>
                copyText(
                  `curl -X GET "${API_BASE}/api/download/tiktok?url=VIDEO_URL" -H "x-api-key: ${apiKey || "YOUR_API_KEY"}"`
                )
              }
            >
              COPY
            </button>

          </div>

          <pre className="code-box">
{`curl -X GET "${API_BASE}/api/download/tiktok?url=VIDEO_URL" \\
-H "x-api-key: ${apiKey || "YOUR_API_KEY"}"`}
          </pre>

          <div className="code-note">
            API key member otomatis digunakan
            untuk request.
          </div>

        </section>

      </div>

      {/* ENDPOINTS */}

      <section className="panel endpoints-panel">

        <div className="panel-title">

          <div>
            <span className="eyebrow">
              API SYSTEM
            </span>

            <h2>
              AVAILABLE ENDPOINTS
            </h2>
          </div>

          <span className="endpoint-count">
            {ENDPOINTS.length} ENDPOINTS
          </span>

        </div>

        <div className="endpoint-grid">

          {ENDPOINTS.map(
            (endpoint) => (
              <EndpointCard
                key={endpoint.path}
                endpoint={endpoint}
                apiKey={apiKey}
              />
            )
          )}

        </div>

      </section>

      {/* PROFILE */}

      <section className="panel profile-panel">

        <span className="eyebrow">
          ACCOUNT
        </span>

        <h2>PROFILE</h2>

        <div className="profile-grid">

          <div>
            <small>EMAIL</small>
            <strong>
              {user?.email}
            </strong>
          </div>

          <div>
            <small>ROLE</small>
            <strong>
              MEMBER
            </strong>
          </div>

          <div>
            <small>KEY STATUS</small>
            <strong className="green-text">
              ACTIVE
            </strong>
          </div>

          <div>
            <small>EXPIRES</small>
            <strong>
              {expires
                ? formatDate(expires)
                : "Unlimited"}
            </strong>
          </div>

        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          LOGOUT
        </button>

      </section>

    </div>
  );
}

/* =========================================================
   ENDPOINT CARD
========================================================= */

function EndpointCard({
  endpoint,
  apiKey,
}) {
  const [open, setOpen] =
    useState(false);

  const [value, setValue] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const isPost =
    endpoint.method === "POST";

  const execute = async () => {
    setLoading(true);
    setResult(null);

    try {
      let url =
        API_BASE +
        endpoint.path;

      if (!isPost && value) {
        url +=
          "?url=" +
          encodeURIComponent(value);
      }

      const options = {
        method: endpoint.method,
        headers: {
          "Content-Type":
            "application/json",

          ...(apiKey
            ? {
                "x-api-key":
                  apiKey,
              }
            : {}),
        },
      };

      if (isPost) {
        options.body =
          JSON.stringify({
            message: value,
          });
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
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      setResult({
        status:
          response.status,
        data,
      });
    } catch (error) {
      setResult({
        status: "ERROR",
        data: error.message,
      });
    }

    setLoading(false);
  };

  return (
    <div className="endpoint-card">

      <div className="endpoint-head">

        <div className="endpoint-icon">
          {endpoint.icon}
        </div>

        <div className="endpoint-info">

          <strong>
            {endpoint.name}
          </strong>

          <code>
            {endpoint.path}
          </code>

        </div>

        <span
          className={`method ${endpoint.method.toLowerCase()}`}
        >
          {endpoint.method}
        </span>

      </div>

      <div className="endpoint-actions">

        <button
          onClick={() =>
            setOpen(!open)
          }
        >
          {open
            ? "CLOSE"
            : "TEST API"}
        </button>

      </div>

      {open && (
        <div className="tester">

          <input
            value={value}
            onChange={(e) =>
              setValue(
                e.target.value
              )
            }
            placeholder={
              isPost
                ? "Masukkan prompt..."
                : "Masukkan URL..."
            }
          />

          <button
            className="run-button"
            onClick={execute}
            disabled={loading}
          >
            {loading
              ? "REQUEST..."
              : "RUN REQUEST"}
          </button>

          {result && (
            <pre className="result-box">
{JSON.stringify(
  result,
  null,
  2
)}
            </pre>
          )}

        </div>
      )}

    </div>
  );
}

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AdminDashboard({
  members,
  refreshMembers,
}) {
  const [search, setSearch] =
    useState("");

  const [selected, setSelected] =
    useState(null);

  const filtered =
    members.filter((member) =>
      member.email
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const total =
    members.length;

  const active =
    members.filter(
      (m) =>
        m.api_key &&
        m.key_status !==
          "inactive"
    ).length;

  const requests =
    members.reduce(
      (sum, m) =>
        sum +
        Number(
          m.requests_today || 0
        ),
      0
    );

  const updateMember =
    async () => {
      if (!selected) return;

      const {
        error,
      } = await supabase
        .from("profiles")
        .update({
          daily_limit:
            Number(
              selected.daily_limit
            ),
          expires_at:
            selected.expires_at ||
            null,
          key_status:
            selected.key_status ||
            "active",
        })
        .eq(
          "id",
          selected.id
        );

      if (error) {
        alert(error.message);
        return;
      }

      setSelected(null);

      refreshMembers();
    };

  return (
    <div className="dashboard admin-dashboard">

      <div className="admin-header">

        <div>
          <span className="eyebrow">
            ADMINISTRATION
          </span>

          <h1>
            ADMIN DASHBOARD
          </h1>

          <p>
            Kelola member, API key,
            limit request dan akses
            DIN API.
          </p>
        </div>

        <div className="admin-badge">
          🛡 ADMIN
        </div>

      </div>

      {/* ADMIN STATS */}

      <div className="stats-grid">

        <StatCard
          title="TOTAL MEMBERS"
          value={total}
          icon="♟"
          color="purple"
        />

        <StatCard
          title="ACTIVE KEYS"
          value={active}
          icon="🔑"
          color="green"
        />

        <StatCard
          title="REQUESTS TODAY"
          value={requests}
          icon="⌁"
          color="blue"
        />

        <StatCard
          title="SYSTEM STATUS"
          value="ONLINE"
          icon="✓"
          color="pink"
        />

      </div>

      <section className="panel">

        <div className="panel-title">

          <div>
            <span className="eyebrow">
              MANAGEMENT
            </span>

            <h2>
              MEMBERS & API KEYS
            </h2>
          </div>

          <button
            className="small-button"
            onClick={refreshMembers}
          >
            REFRESH
          </button>

        </div>

        <input
          className="search-input"
          placeholder="Search Gmail member..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <div className="member-table">

          <div className="table-head">
            <span>EMAIL</span>
            <span>KEY</span>
            <span>STATUS</span>
            <span>LIMIT</span>
            <span>USED</span>
            <span>EXPIRES</span>
            <span>ACTION</span>
          </div>

          {filtered.map(
            (member) => (
              <div
                className="table-row"
                key={member.id}
              >

                <span>
                  {member.email}
                </span>

                <span className="key-short">
                  {member.api_key
                    ? member.api_key.slice(
                        0,
                        18
                      ) + "..."
                    : "-"}
                </span>

                <span>
                  <b
                    className={
                      member.key_status ===
                      "inactive"
                        ? "status-red"
                        : "status-green"
                    }
                  >
                    {member.key_status ||
                      "ACTIVE"}
                  </b>
                </span>

                <span>
                  {member.daily_limit ||
                    100}
                </span>

                <span>
                  {member.requests_today ||
                    0}
                </span>

                <span>
                  {formatDate(
                    member.expires_at
                  )}
                </span>

                <span>

                  <button
                    className="edit-button"
                    onClick={() =>
                      setSelected({
                        ...member,
                      })
                    }
                  >
                    EDIT
                  </button>

                </span>

              </div>
            )
          )}

          {filtered.length ===
            0 && (
            <div className="empty">
              Tidak ada member.
            </div>
          )}

        </div>

      </section>

      {/* EDIT MEMBER */}

      {selected && (
        <div className="modal-bg">

          <div className="modal">

            <button
              className="modal-close"
              onClick={() =>
                setSelected(null)
              }
            >
              ×
            </button>

            <span className="eyebrow">
              MEMBER CONTROL
            </span>

            <h2>
              EDIT MEMBER
            </h2>

            <p className="modal-email">
              {selected.email}
            </p>

            <label>
              LIMIT REQUEST / HARI
            </label>

            <input
              type="number"
              value={
                selected.daily_limit ??
                100
              }
              onChange={(e) =>
                setSelected({
                  ...selected,
                  daily_limit:
                    e.target.value,
                })
              }
            />

            <label>
              EXPIRED DATE
            </label>

            <input
              type="date"
              value={
                selected.expires_at
                  ? selected.expires_at.slice(
                      0,
                      10
                    )
                  : ""
              }
              onChange={(e) =>
                setSelected({
                  ...selected,
                  expires_at:
                    e.target.value
                      ? new Date(
                          e.target.value
                        ).toISOString()
                      : null,
                })
              }
            />

            <label>
              KEY STATUS
            </label>

            <select
              value={
                selected.key_status ||
                "active"
              }
              onChange={(e) =>
                setSelected({
                  ...selected,
                  key_status:
                    e.target.value,
                })
              }
            >
              <option value="active">
                ACTIVE
              </option>

              <option value="inactive">
                INACTIVE
              </option>
            </select>

            <button
              className="save-button"
              onClick={updateMember}
            >
              SAVE CHANGES
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {

  const [session, setSession] =
    useState(null);

  const [profile, setProfile] =
    useState(null);

  const [apiKey, setApiKey] =
    useState("");

  const [keyInfo, setKeyInfo] =
    useState(null);

  const [members, setMembers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [page, setPage] =
    useState("dashboard");

  const [menuOpen, setMenuOpen] =
    useState(false);

  /* =====================================================
     AUTH
  ===================================================== */

  useEffect(() => {

    let mounted = true;

    supabase.auth
      .getSession()
      .then(
        ({
          data,
        }) => {

          if (!mounted)
            return;

          setSession(
            data.session
          );

          setLoading(false);
        }
      );

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {

          setSession(session);

          if (!session) {
            setProfile(null);
            setApiKey("");
            setKeyInfo(null);
          }
        }
      );

    return () => {
      mounted = false;

      listener.subscription.unsubscribe();
    };

  }, []);

  /* =====================================================
     LOAD USER
  ===================================================== */

  useEffect(() => {

    if (!session?.user)
      return;

    loadUser(
      session.user
    );

  }, [session]);

  async function loadUser(
    user
  ) {

    setLoading(true);

    const {
      data: profileData,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq(
        "id",
        user.id
      )
      .maybeSingle();

    setProfile(
      profileData || {
        role: "member",
        email: user.email,
      }
    );

    /* GET API KEY */

    const {
      data: keyData,
    } = await supabase
      .from("api_keys")
      .select("*")
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "status",
        "active"
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(1)
      .maybeSingle();

    if (keyData) {

      setApiKey(
        keyData.api_key
      );

      setKeyInfo(
        keyData
      );

    }

    setLoading(false);
  }

  /* =====================================================
     ADMIN MEMBERS
  ===================================================== */

  async function loadMembers() {

    if (
      profile?.role !==
      "admin"
    ) {
      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .select(
        `
        *,
        api_keys (
          api_key,
          status,
          daily_limit,
          requests_today,
          expires_at
        )
        `
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {
      console.error(error);
      return;
    }

    const formatted =
      (data || []).map(
        (member) => {

          const key =
            Array.isArray(
              member.api_keys
            )
              ? member.api_keys[0]
              : member.api_keys;

          return {
            ...member,
            api_key:
              key?.api_key ||
              "",
            key_status:
              key?.status ||
              "inactive",
            daily_limit:
              key?.daily_limit ??
              member.daily_limit ??
              100,
            requests_today:
              key?.requests_today ??
              0,
            expires_at:
              key?.expires_at ||
              member.expires_at,
          };
        }
      );

    setMembers(
      formatted
    );
  }

  useEffect(() => {

    if (
      profile?.role ===
      "admin"
    ) {
      loadMembers();
    }

  }, [profile]);

  /* =====================================================
     LOGOUT
  ===================================================== */

  async function logout() {
    await supabase.auth.signOut();

    setSession(null);
    setProfile(null);
    setApiKey("");

    setPage("dashboard");
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="loading-screen">

        <div className="loading-logo">
          DIN API🔥
        </div>

        <div className="loading-bar">
          <span />
        </div>

        <p>
          INITIALIZING SYSTEM...
        </p>

      </div>
    );
  }

  /* =====================================================
     BELUM LOGIN
  ===================================================== */

  if (!session) {
    return (
      <LoginScreen />
    );
  }

  const isAdmin =
    profile?.role ===
    "admin";

  return (
    <div className="app">

      <div className="grid-bg" />

      <header className="topbar">

        <button
          className="mobile-menu"
          onClick={() =>
            setMenuOpen(
              !menuOpen
            )
          }
        >
          ☰
        </button>

        <Logo />

        <div className="top-right">

          <div className="online">
            <span />
            ONLINE
          </div>

          <div className="user-mini">
            {session.user.email}
          </div>

        </div>

      </header>

      <div
        className={`app-layout ${
          menuOpen
            ? "menu-open"
            : ""
        }`}
      >

        {/* SIDEBAR */}

        <aside className="sidebar">

          <Logo />

          <nav>

            <button
              className={
                page ===
                "dashboard"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage(
                  "dashboard"
                )
              }
            >
              <span>⌂</span>
              Dashboard
            </button>

            <button
              className={
                page === "keys"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage("keys")
              }
            >
              <span>🔑</span>
              API Key
            </button>

            <button
              className={
                page ===
                "endpoints"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage(
                  "endpoints"
                )
              }
            >
              <span>⌁</span>
              Requests
            </button>

            {isAdmin && (
              <button
                className={
                  page === "admin"
                    ? "active admin-nav"
                    : "admin-nav"
                }
                onClick={() =>
                  setPage("admin")
                }
              >
                <span>🛡</span>
                Admin Panel
              </button>
            )}

          </nav>

          <div className="sidebar-bottom">

            <span>
              {isAdmin
                ? "ADMINISTRATOR"
                : "MEMBER"}
            </span>

            <button
              onClick={logout}
            >
              ↪ Logout
            </button>

          </div>

        </aside>

        {/* CONTENT */}

        <main className="content">

          {page ===
            "admin" &&
          isAdmin ? (
            <AdminDashboard
              members={
                members
              }
              refreshMembers={
                loadMembers
              }
            />
          ) : page ===
            "keys" ? (

            <MemberDashboard
              user={
                session.user
              }
              profile={
                profile
              }
              apiKey={
                apiKey
              }
              keyInfo={
                keyInfo
              }
              onLogout={
                logout
              }
            />

          ) : page ===
            "endpoints" ? (

            <div className="dashboard">

              <div className="welcome">
                <span>
                  API SYSTEM
                </span>

                <h1>
                  ENDPOINTS
                </h1>
              </div>

              <section className="panel">

                <div className="endpoint-grid">

                  {ENDPOINTS.map(
                    (endpoint) => (
                      <EndpointCard
                        key={
                          endpoint.path
                        }
                        endpoint={
                          endpoint
                        }
                        apiKey={
                          apiKey
                        }
                      />
                    )
                  )}

                </div>

              </section>

            </div>

          ) : (

            <MemberDashboard
              user={
                session.user
              }
              profile={
                profile
              }
              apiKey={
                apiKey
              }
              keyInfo={
                keyInfo
              }
              onLogout={
                logout
              }
            />

          )}

        </main>

      </div>

    </div>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function LoginScreen() {

  const [
    mode,
    setMode,
  ] = useState("login");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  async function submit(e) {

    e.preventDefault();

    setLoading(true);
    setMessage("");

    if (mode === "register") {

      const {
        error,
      } =
        await supabase.auth
          .signUp({
            email,
            password,
          });

      if (error) {
        setMessage(
          error.message
        );
      } else {
        setMessage(
          "Akun berhasil dibuat. Silakan cek email jika verifikasi diperlukan."
        );

        setMode("login");
      }

    } else {

      const {
        error,
      } =
        await supabase.auth
          .signInWithPassword({
            email,
            password,
          });

      if (error) {
        setMessage(
          error.message
        );
      }
    }

    setLoading(false);
  }

  async function googleLogin() {

    await supabase.auth.signInWithOAuth(
      {
        provider: "google",
        options: {
          redirectTo:
            window.location.origin,
        },
      }
    );
  }

  return (
    <div className="login-screen">

      <div className="login-grid" />

      <div className="login-card">

        <div className="login-logo">
          <Logo />
        </div>

        <span className="eyebrow">
          SECURE ACCESS
        </span>

        <h1>
          {mode ===
          "register"
            ? "Create Account"
            : "Welcome Back"}
        </h1>

        <p>
          Masuk ke DIN API
          dashboard untuk
          mengakses API key dan
          endpoint.
        </p>

        <button
          className="google-button"
          onClick={
            googleLogin
          }
        >
          <b>G</b>
          Continue with Google
        </button>

        <div className="or">
          <span />
          OR
          <span />
        </div>

        <form
          onSubmit={
            submit
          }
        >

          <label>
            EMAIL
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="you@gmail.com"
            required
          />

          <label>
            PASSWORD
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            placeholder="••••••••"
            minLength={6}
            required
          />

          {message && (
            <div className="login-message">
              {message}
            </div>
          )}

          <button
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "PROCESSING..."
              : mode ===
                "register"
              ? "CREATE ACCOUNT"
              : "LOGIN"}
          </button>

        </form>

        <button
          className="switch-auth"
          onClick={() =>
            setMode(
              mode ===
                "login"
                ? "register"
                : "login"
            )
          }
        >
          {mode ===
          "login"
            ? "Belum punya akun? Daftar"
            : "Sudah punya akun? Login"}
        </button>

      </div>

    </div>
  );
}
