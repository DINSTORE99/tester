import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./style.css";

/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

/* =========================================================
   HELPERS
========================================================= */

function formatNumber(value) {
  return Number(value || 0).toLocaleString("id-ID");
}

function getInitial(email) {
  if (!email) return "D";
  return email.charAt(0).toUpperCase();
}

function normalizeAccount(data) {
  /*
    RPC get_my_account() bisa mengembalikan:
    object
    atau array berisi satu object.

    Kita normalkan supaya App tetap mudah digunakan.
  */

  if (Array.isArray(data)) {
    return data[0] || null;
  }

  return data || null;
}

function getRole(account) {
  return (
    account?.role ||
    account?.user_role ||
    account?.account_role ||
    "member"
  ).toLowerCase();
}

function getEmail(account, session) {
  return (
    account?.email ||
    session?.user?.email ||
    ""
  );
}

function getApiKey(account) {
  return (
    account?.api_key ||
    account?.key ||
    account?.apiKey ||
    null
  );
}

function getLimit(account) {
  return Number(
    account?.daily_limit ??
      account?.request_limit ??
      account?.limit ??
      100
  );
}

function getRequest(account) {
  return Number(
    account?.requests_today ??
      account?.request_today ??
      account?.daily_requests ??
      account?.requests ??
      0
  );
}

function getStatus(account) {
  return (
    account?.status ||
    account?.account_status ||
    "active"
  );
}

function isActive(account) {
  const status = getStatus(account).toLowerCase();

  return (
    status === "active" ||
    status === "aktif" ||
    status === "online"
  );
}

/* =========================================================
   ICONS
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
   LOGIN
========================================================= */

function LoginPage({
  email,
  setEmail,
  password,
  setPassword,
  onLogin,
  loading,
  error,
}) {
  return (
    <div className="auth-page">

      <div className="background-grid" />
      <div className="scanlines" />

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="auth-card">

        <div className="auth-logo">
          <RobotIcon />
        </div>

        <div className="auth-brand">
          <strong>DIN API🔥</strong>
          <span>ROBOT SYSTEM</span>
        </div>

        <div className="auth-status">
          <span />
          SYSTEM ONLINE
        </div>

        <div className="auth-title">
          <small>SECURE ACCESS</small>
          <h1>LOGIN</h1>
          <p>
            Masuk untuk mengakses dashboard
            DIN API.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠</span>
            {error}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={onLogin}
        >

          <label>
            EMAIL
          </label>

          <input
            type="email"
            placeholder="nama@gmail.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            autoComplete="email"
            required
          />

          <label>
            PASSWORD
          </label>

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                AUTHENTICATING...
              </>
            ) : (
              <>
                LOGIN
                <span>→</span>
              </>
            )}
          </button>

        </form>

        <div className="auth-footer">
          <span>DIN API</span>
          <span>v3.0.0</span>
          <span>SECURE SYSTEM</span>
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   TOP HEADER
========================================================= */

function DashboardHeader({
  account,
  session,
  menuOpen,
  setMenuOpen,
  onLogout,
  isAdmin,
}) {
  const email = getEmail(account, session);

  return (
    <header className="header">

      <div className="header-left">

        <button
          className={`menu-button ${
            menuOpen ? "active" : ""
          }`}
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          type="button"
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
              {isAdmin
                ? "ADMIN SYSTEM"
                : "MEMBER SYSTEM"}
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
  );
}

/* =========================================================
   SIDE NAV
========================================================= */

function SideNav({
  open,
  setOpen,
  activePage,
  setActivePage,
  isAdmin,
  onLogout,
}) {
  const navigate = (page) => {
    setActivePage(page);
    setOpen(false);
  };

  return (
    <>
      <div
        className={`nav-overlay ${
          open ? "show" : ""
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`side-nav ${
          open ? "open" : ""
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
            onClick={() => setOpen(false)}
            type="button"
          >
            ×
          </button>

        </div>

        <div className="side-line" />

        <nav className="nav-list">

          <button
            className={`nav-item ${
              activePage === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigate("dashboard")
            }
            type="button"
          >
            <span className="nav-icon green">
              ⌂
            </span>

            <b>DASHBOARD</b>

            <small>
              00
            </small>
          </button>

          <button
            className={`nav-item ${
              activePage === "apikey"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigate("apikey")
            }
            type="button"
          >
            <span className="nav-icon green">
              🔑
            </span>

            <b>API KEY</b>

            <small>
              01
            </small>
          </button>

          <button
            className={`nav-item ${
              activePage === "requests"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigate("requests")
            }
            type="button"
          >
            <span className="nav-icon cyan">
              ↗
            </span>

            <b>REQUESTS</b>

            <small>
              02
            </small>
          </button>

          {isAdmin && (
            <>
              <div className="nav-separator">
                ADMIN
              </div>

              <button
                className={`nav-item ${
                  activePage === "admin"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  navigate("admin")
                }
                type="button"
              >
                <span className="nav-icon red">
                  ◇
                </span>

                <b>ADMIN PANEL</b>

                <small>
                  A1
                </small>
              </button>

              <button
                className={`nav-item ${
                  activePage ===
                  "members"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  navigate("members")
                }
                type="button"
              >
                <span className="nav-icon purple">
                  ♟
                </span>

                <b>MEMBERS</b>

                <small>
                  A2
                </small>
              </button>
            </>
          )}

          <button
            className="nav-item logout"
            onClick={onLogout}
            type="button"
          >
            <span className="nav-icon red">
              ↪
            </span>

            <b>LOGOUT</b>

            <small>
              XX
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
    </>
  );
}

/* =========================================================
   MEMBER DASHBOARD
========================================================= */

function MemberDashboard({
  account,
  session,
  onPage,
}) {
  const email = getEmail(
    account,
    session
  );

  const apiKey = getApiKey(account);

  const limit = getLimit(account);
  const request = getRequest(account);

  const remaining = Math.max(
    limit - request,
    0
  );

  const percentage =
    limit > 0
      ? Math.min(
          (request / limit) * 100,
          100
        )
      : 0;

  const status = getStatus(account);

  return (
    <div className="dashboard-page">

      <section className="welcome-section">

        <div className="eyebrow">
          MEMBER
        </div>

        <p>
          Welcome back,
        </p>

        <h1>
          {email} 👋
        </h1>

      </section>

      <section className="stats-grid">

        <div className="stat-card">

          <span>
            REQUESTS TODAY
          </span>

          <strong>
            {formatNumber(request)}
            {" / "}
            {formatNumber(limit)}
          </strong>

          <small>
            DAILY REQUEST
          </small>

        </div>

        <div className="stat-card">

          <span>
            REMAINING
          </span>

          <strong>
            {formatNumber(remaining)}
          </strong>

          <small>
            REQUEST AVAILABLE
          </small>

        </div>

        <div className="stat-card">

          <span>
            EXPIRES
          </span>

          <strong>
            {account?.expires_at
              ? new Date(
                  account.expires_at
                ).toLocaleDateString(
                  "id-ID"
                )
              : "Unlimited"}
          </strong>

          <small>
            ACCOUNT PERIOD
          </small>

        </div>

        <div className="stat-card">

          <span>
            STATUS
          </span>

          <strong
            className={
              isActive(account)
                ? "status-online"
                : "status-offline"
            }
          >
            ●{" "}
            {isActive(account)
              ? "ACTIVE"
              : String(status).toUpperCase()}
          </strong>

          <small>
            ACCOUNT STATUS
          </small>

        </div>

      </section>

      <section className="usage-card">

        <div className="section-heading">

          <div>
            <span>
              DAILY USAGE
            </span>

            <h2>
              {formatNumber(request)}
              {" / "}
              {formatNumber(limit)}
            </h2>
          </div>

          <strong>
            {percentage.toFixed(0)}%
          </strong>

        </div>

        <div className="progress-track">

          <div
            className="progress-value"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </section>

      <section className="key-card">

        <div className="key-heading">

          <div>
            <span>
              API ACCESS
            </span>

            <h2>
              YOUR API KEY
            </h2>
          </div>

          <div className="key-lock">
            🔑
          </div>

        </div>

        {apiKey ? (
          <>
            <div className="api-key-box">

              <code>
                {apiKey}
              </code>

              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    apiKey
                  )
                }
              >
                COPY
              </button>

            </div>

            <div className="warning-box">
              ⚠ Jangan bagikan API key kepada
              siapapun.
            </div>
          </>
        ) : (
          <div className="empty-key">
            API KEY BELUM DIBUAT
          </div>
        )}

      </section>

      <section className="quick-card">

        <div className="section-heading">

          <div>
            <span>
              QUICK START
            </span>

            <h2>
              API REQUEST
            </h2>
          </div>

        </div>

        <div className="code-box">

          <div className="code-header">
            <span>
              CURL
            </span>

            <button
              type="button"
              onClick={() =>
                navigator.clipboard.writeText(
                  `curl -X GET "https://YOUR-DOMAIN.vercel.app/api/example" -H "x-api-key: ${apiKey || "YOUR_API_KEY"}"`
                )
              }
            >
              COPY
            </button>
          </div>

          <pre>
{`curl -X GET "https://YOUR-DOMAIN.vercel.app/api/example"
-H "x-api-key: ${apiKey || "YOUR_API_KEY"}"`}
          </pre>

        </div>

        <button
          className="primary-button"
          type="button"
          onClick={() =>
            onPage("requests")
          }
        >
          VIEW REQUESTS →
        </button>

      </section>

    </div>
  );
}

/* =========================================================
   API KEY PAGE
========================================================= */

function ApiKeyPage({
  account,
}) {
  const apiKey = getApiKey(account);

  return (
    <div className="content-page">

      <div className="page-title">
        <span>
          API ACCESS
        </span>

        <h1>
          API KEY
        </h1>

        <p>
          Gunakan API key ini untuk
          mengakses DIN API.
        </p>
      </div>

      <section className="key-card large">

        <div className="key-heading">

          <div>
            <span>
              MEMBER KEY
            </span>

            <h2>
              YOUR API KEY
            </h2>
          </div>

          <div className="key-lock">
            🔐
          </div>

        </div>

        {apiKey ? (
          <>
            <div className="api-key-box large">

              <code>
                {apiKey}
              </code>

              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    apiKey
                  )
                }
              >
                COPY
              </button>

            </div>

            <div className="warning-box">
              ⚠ API key bersifat rahasia.
              Jangan kirim ke orang lain.
            </div>
          </>
        ) : (
          <div className="empty-key">
            API KEY BELUM DIBUAT
          </div>
        )}

      </section>

    </div>
  );
}

/* =========================================================
   REQUEST PAGE
========================================================= */

function RequestsPage({
  account,
}) {
  const apiKey = getApiKey(account);

  const endpoints = [
    {
      method: "GET",
      path: "/api/ai/aiko",
    },
    {
      method: "GET",
      path: "/api/tiktok",
    },
    {
      method: "GET",
      path: "/api/instagram",
    },
    {
      method: "GET",
      path: "/api/tools/qr",
    },
  ];

  return (
    <div className="content-page">

      <div className="page-title">

        <span>
          API SYSTEM
        </span>

        <h1>
          REQUESTS
        </h1>

        <p>
          Gunakan API key kamu untuk
          mengakses endpoint DIN API.
        </p>

      </div>

      <section className="request-list">

        {endpoints.map(
          (endpoint) => (
            <div
              className="request-item"
              key={endpoint.path}
            >

              <div
                className={`method ${endpoint.method.toLowerCase()}`}
              >
                {endpoint.method}
              </div>

              <code>
                {endpoint.path}
              </code>

              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `curl -X ${endpoint.method} "https://YOUR-DOMAIN.vercel.app${endpoint.path}" -H "x-api-key: ${apiKey || "YOUR_API_KEY"}"`
                  )
                }
              >
                COPY
              </button>

            </div>
          )
        )}

      </section>

    </div>
  );
}

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AdminDashboard({
  account,
  members,
  loadingMembers,
  onRefresh,
  onUpdateLimit,
  onResetRequest,
  onRegenerateKey,
  message,
}) {
  const totalMembers =
    members.length;

  const activeMembers =
    members.filter(
      (member) =>
        String(
          member.status || ""
        ).toLowerCase() === "active"
    ).length;

  const totalRequests =
    members.reduce(
      (total, member) =>
        total +
        Number(
          member.requests_today ||
            member.request_today ||
            0
        ),
      0
    );

  return (
    <div className="admin-page">

      <div className="page-title">

        <span>
          ADMINISTRATOR
        </span>

        <h1>
          ADMIN PANEL
        </h1>

        <p>
          Kelola member dan penggunaan
          API DIN API.
        </p>

      </div>

      {message && (
        <div className="success-box">
          ✓ {message}
        </div>
      )}

      <section className="admin-stats">

        <div className="stat-card admin">
          <span>
            MEMBERS
          </span>

          <strong>
            {formatNumber(totalMembers)}
          </strong>
        </div>

        <div className="stat-card admin">
          <span>
            ACTIVE
          </span>

          <strong>
            {formatNumber(activeMembers)}
          </strong>
        </div>

        <div className="stat-card admin">
          <span>
            REQUESTS TODAY
          </span>

          <strong>
            {formatNumber(totalRequests)}
          </strong>
        </div>

      </section>

      <section className="admin-toolbar">

        <div>
          <span>
            MEMBER MANAGEMENT
          </span>

          <h2>
            Semua Member
          </h2>
        </div>

        <button
          className="primary-button"
          onClick={onRefresh}
          type="button"
        >
          {loadingMembers
            ? "LOADING..."
            : "REFRESH"}
        </button>

      </section>

      <section className="members-table">

        {loadingMembers ? (
          <div className="loading-box">
            Mengambil data member...
          </div>
        ) : members.length === 0 ? (
          <div className="empty-box">
            Belum ada member.
          </div>
        ) : (
          members.map(
            (member) => (
              <AdminMemberCard
                key={
                  member.id ||
                  member.user_id
                }
                member={member}
                onUpdateLimit={
                  onUpdateLimit
                }
                onResetRequest={
                  onResetRequest
                }
                onRegenerateKey={
                  onRegenerateKey
                }
              />
            )
          )
        )}

      </section>

    </div>
  );
}

/* =========================================================
   ADMIN MEMBER CARD
========================================================= */

function AdminMemberCard({
  member,
  onUpdateLimit,
  onResetRequest,
  onRegenerateKey,
}) {
  const [limit, setLimit] =
    useState(
      Number(
        member.daily_limit ??
          member.request_limit ??
          member.limit ??
          100
      )
    );

  const id =
    member.id ||
    member.user_id;

  const email =
    member.email ||
    member.user_email ||
    "-";

  const requests =
    Number(
      member.requests_today ??
        member.request_today ??
        0
    );

  const status =
    member.status ||
    "active";

  const key =
    member.api_key ||
    member.key ||
    null;

  return (
    <article className="member-card">

      <div className="member-top">

        <div className="member-avatar">
          {getInitial(email)}
        </div>

        <div className="member-info">

          <strong>
            {email}
          </strong>

          <small>
            ID: {id}
          </small>

        </div>

        <div
          className={`member-status ${
            String(status).toLowerCase() ===
            "active"
              ? "active"
              : "inactive"
          }`}
        >
          ●{" "}
          {String(
            status
          ).toUpperCase()}
        </div>

      </div>

      <div className="member-data">

        <div>
          <span>
            REQUEST
          </span>

          <strong>
            {formatNumber(requests)}
          </strong>
        </div>

        <div>
          <span>
            API KEY
          </span>

          <strong>
            {key
              ? `${key.slice(
                  0,
                  8
                )}••••••`
              : "BELUM ADA"}
          </strong>
        </div>

      </div>

      <div className="member-actions">

        <div className="limit-control">

          <label>
            DAILY LIMIT
          </label>

          <input
            type="number"
            min="0"
            value={limit}
            onChange={(e) =>
              setLimit(
                Number(
                  e.target.value
                )
              )
            }
          />

          <button
            type="button"
            onClick={() =>
              onUpdateLimit(
                id,
                limit
              )
            }
          >
            SAVE LIMIT
          </button>

        </div>

        <button
          className="admin-action"
          type="button"
          onClick={() =>
            onResetRequest(id)
          }
        >
          RESET REQUEST
        </button>

        <button
          className="admin-action danger"
          type="button"
          onClick={() =>
            onRegenerateKey(id)
          }
        >
          REGENERATE KEY
        </button>

      </div>

    </article>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {

  /* =========================
     AUTH
  ========================= */

  const [
    session,
    setSession,
  ] = useState(null);

  const [
    account,
    setAccount,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loginLoading,
    setLoginLoading,
  ] = useState(false);

  const [
    loginEmail,
    setLoginEmail,
  ] = useState("");

  const [
    loginPassword,
    setLoginPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  /* =========================
     DASHBOARD
  ========================= */

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    activePage,
    setActivePage,
  ] = useState("dashboard");

  /* =========================
     ADMIN
  ========================= */

  const [
    members,
    setMembers,
  ] = useState([]);

  const [
    membersLoading,
    setMembersLoading,
  ] = useState(false);

  const [
    adminMessage,
    setAdminMessage,
  ] = useState("");

  /* =======================================================
     LOAD ACCOUNT
  ======================================================= */

  const loadAccount =
    async (currentSession) => {

      if (!supabase) {
        setError(
          "Supabase belum dikonfigurasi. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY."
        );

        setLoading(false);

        return;
      }

      try {

        const {
          data,
          error: rpcError,
        } = await supabase.rpc(
          "get_my_account"
        );

        if (rpcError) {
          console.error(
            "get_my_account:",
            rpcError
          );

          /*
            Fallback minimal kalau RPC
            belum mengembalikan data.
          */

          setAccount({
            email:
              currentSession
                ?.user?.email || "",
            role: "member",
            status: "active",
            daily_limit: 100,
            requests_today: 0,
            api_key: null,
          });

          return;
        }

        const normalized =
          normalizeAccount(data);

        if (!normalized) {

          setAccount({
            email:
              currentSession
                ?.user?.email || "",
            role: "member",
            status: "active",
            daily_limit: 100,
            requests_today: 0,
            api_key: null,
          });

          return;
        }

        setAccount({
          ...normalized,
          email:
            getEmail(
              normalized,
              currentSession
            ),
        });

      } catch (err) {

        console.error(err);

        setError(
          err.message ||
            "Gagal mengambil data akun."
        );

      }
    };

  /* =======================================================
     AUTH INITIALIZE
  ======================================================= */

  useEffect(() => {

    let mounted = true;

    async function init() {

      if (!supabase) {

        setError(
          "Supabase belum dikonfigurasi."
        );

        setLoading(false);

        return;
      }

      const {
        data,
      } =
        await supabase.auth.getSession();

      if (!mounted) return;

      if (
        data?.session
      ) {

        setSession(
          data.session
        );

        await loadAccount(
          data.session
        );

      }

      setLoading(false);
    }

    init();

    const {
      data: listener,
    } =
      supabase
        ? supabase.auth.onAuthStateChange(
            async (
              event,
              newSession
            ) => {

              if (!mounted) return;

              setSession(
                newSession
              );

              if (
                newSession
              ) {

                /*
                  Jangan langsung memanggil
                  banyak RPC secara bersamaan.
                */

                setTimeout(
                  () =>
                    loadAccount(
                      newSession
                    ),
                  0
                );

              } else {

                setAccount(
                  null
                );

                setMembers(
                  []
                );

              }

            }
          )
        : {
            data: {
              subscription: {
                unsubscribe() {},
              },
            },
          };

    return () => {

      mounted = false;

      listener?.subscription?.unsubscribe();

    };

  }, []);

  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin =
    async (event) => {

      event.preventDefault();

      setError("");

      if (!supabase) {

        setError(
          "Supabase belum dikonfigurasi."
        );

        return;
      }

      if (
        !loginEmail ||
        !loginPassword
      ) {

        setError(
          "Email dan password wajib diisi."
        );

        return;
      }

      setLoginLoading(
        true
      );

      try {

        const {
          data,
          error: authError,
        } =
          await supabase.auth.signInWithPassword(
            {
              email:
                loginEmail.trim(),
              password:
                loginPassword,
            }
          );

        if (authError) {
          throw authError;
        }

        setSession(
          data.session
        );

        await loadAccount(
          data.session
        );

        setLoginPassword("");

      } catch (err) {

        console.error(err);

        let message =
          err?.message ||
          "Login gagal.";

        if (
          message
            .toLowerCase()
            .includes(
              "invalid login credentials"
            )
        ) {
          message =
            "Email atau password salah.";
        }

        setError(
          message
        );

      } finally {

        setLoginLoading(
          false
        );

      }
    };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout =
    async () => {

      if (!supabase)
        return;

      await supabase.auth.signOut();

      setSession(null);
      setAccount(null);
      setMembers([]);

      setActivePage(
        "dashboard"
      );

      setMenuOpen(false);

    };

  /* =======================================================
     ADMIN CHECK
  ======================================================= */

  const isAdmin =
    useMemo(
      () =>
        getRole(account) ===
        "admin",
      [account]
    );

  /* =======================================================
     LOAD MEMBERS
  ======================================================= */

  const loadMembers =
    async () => {

      if (
        !supabase ||
        !isAdmin
      ) {
        return;
      }

      setMembersLoading(
        true
      );

      setAdminMessage("");

      try {

        /*
          Function ini idealnya dibuat
          oleh SQL sebelumnya:

          get_members()

          Jika nama RPC pada SQL kamu
          berbeda, ubah hanya nama RPC
          di sini.
        */

        const {
          data,
          error: rpcError,
        } =
          await supabase.rpc(
            "get_members"
          );

        if (rpcError) {
          throw rpcError;
        }

        setMembers(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(
          "get_members:",
          err
        );

        setAdminMessage(
          err.message ||
            "Gagal mengambil data member."
        );

      } finally {

        setMembersLoading(
          false
        );

      }
    };

  /* =======================================================
     ADMIN ACTIONS
  ======================================================= */

  const updateLimit =
    async (
      userId,
      limit
    ) => {

      if (
        !supabase ||
        !isAdmin
      )
        return;

      try {

        const {
          error: rpcError,
        } =
          await supabase.rpc(
            "admin_set_limit",
            {
              target_user_id:
                userId,
              new_limit:
                Number(limit),
            }
          );

        if (rpcError) {
          throw rpcError;
        }

        setAdminMessage(
          "Limit request berhasil diperbarui."
        );

        await loadMembers();

      } catch (err) {

        console.error(err);

        setAdminMessage(
          err.message ||
            "Gagal mengubah limit."
        );

      }
    };

  const resetRequest =
    async (userId) => {

      if (
        !supabase ||
        !isAdmin
      )
        return;

      try {

        const {
          error: rpcError,
        } =
          await supabase.rpc(
            "admin_reset_request",
            {
              target_user_id:
                userId,
            }
          );

        if (rpcError) {
          throw rpcError;
        }

        setAdminMessage(
          "Request member berhasil direset."
        );

        await loadMembers();

      } catch (err) {

        console.error(err);

        setAdminMessage(
          err.message ||
            "Gagal reset request."
        );

      }
    };

  const regenerateKey =
    async (userId) => {

      if (
        !supabase ||
        !isAdmin
      )
        return;

      const confirmed =
        window.confirm(
          "Generate API key baru untuk member ini?"
        );

      if (!confirmed)
        return;

      try {

        const {
          error: rpcError,
        } =
          await supabase.rpc(
            "admin_regenerate_key",
            {
              target_user_id:
                userId,
            }
          );

        if (rpcError) {
          throw rpcError;
        }

        setAdminMessage(
          "API key berhasil dibuat ulang."
        );

        await loadMembers();

      } catch (err) {

        console.error(err);

        setAdminMessage(
          err.message ||
            "Gagal regenerate API key."
        );

      }
    };

  /* =======================================================
     ADMIN PAGE AUTO LOAD
  ======================================================= */

  useEffect(() => {

    if (
      isAdmin &&
      (
        activePage ===
          "admin" ||
        activePage ===
          "members"
      )
    ) {
      loadMembers();
    }

  }, [
    isAdmin,
    activePage,
  ]);

  /* =======================================================
     SECURITY:
     MEMBER TIDAK BOLEH ADMIN
  ======================================================= */

  useEffect(() => {

    if (
      !isAdmin &&
      (
        activePage ===
          "admin" ||
        activePage ===
          "members"
      )
    ) {

      setActivePage(
        "dashboard"
      );

    }

  }, [
    isAdmin,
    activePage,
  ]);

  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (loading) {

    return (
      <div className="loading-page">

        <div className="loading-logo">
          <RobotIcon />
        </div>

        <div className="loading-title">
          DIN API🔥
        </div>

        <div className="loading-status">
          <span />
          INITIALIZING SYSTEM...
        </div>

      </div>
    );

  }

  /* =======================================================
     LOGIN SCREEN
  ======================================================= */

  if (!session) {

    return (
      <LoginPage
        email={loginEmail}
        setEmail={setLoginEmail}
        password={loginPassword}
        setPassword={setLoginPassword}
        onLogin={handleLogin}
        loading={loginLoading}
        error={error}
      />
    );

  }

  /* =======================================================
     NO ACCOUNT
  ======================================================= */

  if (!account) {

    return (
      <div className="loading-page">

        <div className="loading-logo">
          <RobotIcon />
        </div>

        <div className="loading-title">
          DIN API🔥
        </div>

        <div className="loading-status">
          <span />
          LOADING ACCOUNT...
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

      </div>
    );

  }

  /* =======================================================
     MAIN APP
  ======================================================= */

  return (
    <div className="app">

      <div className="background-grid" />
      <div className="scanlines" />

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <DashboardHeader
        account={account}
        session={session}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />

      <SideNav
        open={menuOpen}
        setOpen={setMenuOpen}
        activePage={activePage}
        setActivePage={setActivePage}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      <main className="main">

        {/* =================================================
            MEMBER
        ================================================= */}

        {!isAdmin &&
          activePage ===
            "dashboard" && (
            <MemberDashboard
              account={account}
              session={session}
              onPage={
                setActivePage
              }
            />
          )}

        {!isAdmin &&
          activePage ===
            "apikey" && (
            <ApiKeyPage
              account={account}
            />
          )}

        {!isAdmin &&
          activePage ===
            "requests" && (
            <RequestsPage
              account={account}
            />
          )}

        {/* =================================================
            ADMIN
        ================================================= */}

        {isAdmin &&
          (
            activePage ===
              "admin" ||
            activePage ===
              "members"
          ) && (
            <AdminDashboard
              account={account}
              members={members}
              loadingMembers={
                membersLoading
              }
              onRefresh={
                loadMembers
              }
              onUpdateLimit={
                updateLimit
              }
              onResetRequest={
                resetRequest
              }
              onRegenerateKey={
                regenerateKey
              }
              message={
                adminMessage
              }
            />
          )}

        {isAdmin &&
          activePage ===
            "dashboard" && (
            <AdminDashboard
              account={account}
              members={members}
              loadingMembers={
                membersLoading
              }
              onRefresh={
                loadMembers
              }
              onUpdateLimit={
                updateLimit
              }
              onResetRequest={
                resetRequest
              }
              onRegenerateKey={
                regenerateKey
              }
              message={
                adminMessage
              }
            />
          )}

      </main>

    </div>
  );
}
