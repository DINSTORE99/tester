import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import "./style.css";

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState("login");
  const [adminPage, setAdminPage] = useState("overview");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  /* =========================
     SESSION
  ========================= */

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      if (data?.session) {
        setSession(data.session);
        await loadProfile(data.session.user);
      }

      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession || null);

        if (newSession) {
          await loadProfile(newSession.user);
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

  /* =========================
     LOAD PROFILE
  ========================= */

  async function loadProfile(user) {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Profile error:", error);
      return;
    }

    setProfile(data || null);
  }

  /* =========================
     MESSAGE
  ========================= */

  function clearMessage() {
    setError("");
    setMessage("");
  }

  /* =========================
     LOGIN
  ========================= */

  async function handleLogin(e) {
    e.preventDefault();

    clearMessage();

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setProcessing(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    setProcessing(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data?.session) {
      setSession(data.session);
      await loadProfile(data.session.user);
    }
  }

  /* =========================
     REGISTER
  ========================= */

  async function handleRegister(e) {
    e.preventDefault();

    clearMessage();

    if (!name || !email || !password) {
      setError("Semua data wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setProcessing(true);

    const { data, error } =
      await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

    setProcessing(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data?.session) {
      setSession(data.session);
      await loadProfile(data.session.user);
    } else {
      setMessage(
        "Akun berhasil dibuat. Silakan cek email kamu."
      );
      setPage("login");
    }
  }

  /* =========================
     GOOGLE
  ========================= */

  async function handleGoogle() {
    clearMessage();

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

    if (error) {
      setError(error.message);
    }
  }

  /* =========================
     FORGOT PASSWORD
  ========================= */

  async function handleForgot(e) {
    e.preventDefault();

    clearMessage();

    if (!email) {
      setError("Masukkan email.");
      return;
    }

    setProcessing(true);

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: window.location.origin,
        }
      );

    setProcessing(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Link reset password sudah dikirim ke email."
    );
  }

  /* =========================
     LOGOUT
  ========================= */

  async function logout() {
    await supabase.auth.signOut();

    setSession(null);
    setProfile(null);

    setEmail("");
    setPassword("");
    setName("");

    setPage("login");
  }

  /* =========================
     ADMIN LOAD MEMBERS
  ========================= */

  async function loadMembers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      setError(error.message);
      return;
    }

    setMembers(data || []);
  }

  /* =========================
     ADMIN UPDATE STATUS
  ========================= */

  async function toggleMemberStatus(member) {
    const newStatus =
      member.status === "active"
        ? "banned"
        : "active";

    const { error } = await supabase
      .from("profiles")
      .update({
        status: newStatus,
      })
      .eq("id", member.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadMembers();
  }

  /* =========================
     COPY API KEY
  ========================= */

  async function copyKey(key) {
    if (!key) return;

    await navigator.clipboard.writeText(key);

    setMessage("API Key berhasil disalin.");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  }

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="app">
        <div className="loading-box">
          <div className="logo">D</div>

          <h2>DINSTORE API</h2>

          <p>Memuat sistem...</p>

          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  /* =========================
     LOGIN
  ========================= */

  if (!session) {
    return (
      <div className="app">
        <div className="auth-card">

          <div className="logo">
            D
          </div>

          <div className="brand">
            DINSTORE API
          </div>

          {page === "login" && (
            <>
              <h1>Login</h1>

              <p className="subtitle">
                Masuk ke dashboard DINSTORE API.
              </p>

              <form onSubmit={handleLogin}>

                <label>Email</label>

                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

                <label>Password</label>

                <div className="password">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? "HIDE"
                      : "SHOW"}
                  </button>
                </div>

                <button
                  className="primary"
                  disabled={processing}
                >
                  {processing
                    ? "LOGIN..."
                    : "LOGIN"}
                </button>

              </form>

              <button
                className="google"
                onClick={handleGoogle}
              >
                <b>G</b>
                Login dengan Google
              </button>

              <button
                className="link"
                onClick={() => {
                  clearMessage();
                  setPage("forgot");
                }}
              >
                Lupa Password?
              </button>

              <div className="switch">
                Belum punya akun?

                <button
                  onClick={() => {
                    clearMessage();
                    setPage("register");
                  }}
                >
                  Daftar
                </button>
              </div>
            </>
          )}

          {page === "register" && (
            <>
              <h1>Daftar</h1>

              <p className="subtitle">
                Buat akun DINSTORE baru.
              </p>

              <form onSubmit={handleRegister}>

                <label>Nama</label>

                <input
                  type="text"
                  placeholder="Nama lengkap"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

                <label>Email</label>

                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

                <label>Password</label>

                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  className="primary"
                  disabled={processing}
                >
                  {processing
                    ? "MEMBUAT..."
                    : "DAFTAR"}
                </button>

              </form>

              <div className="switch">
                Sudah punya akun?

                <button
                  onClick={() => {
                    clearMessage();
                    setPage("login");
                  }}
                >
                  Login
                </button>
              </div>
            </>
          )}

          {page === "forgot" && (
            <>
              <h1>Lupa Password</h1>

              <p className="subtitle">
                Masukkan email untuk menerima
                link reset password.
              </p>

              <form onSubmit={handleForgot}>

                <label>Email</label>

                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

                <button
                  className="primary"
                  disabled={processing}
                >
                  {processing
                    ? "MENGIRIM..."
                    : "KIRIM LINK"}
                </button>

              </form>

              <button
                className="link"
                onClick={() => {
                  clearMessage();
                  setPage("login");
                }}
              >
                ← Kembali Login
              </button>
            </>
          )}

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {message && (
            <div className="success">
              {message}
            </div>
          )}

        </div>
      </div>
    );
  }

  /* =========================
     ADMIN DASHBOARD
  ========================= */

  if (profile?.role === "admin") {
    const filteredMembers =
      members.filter((member) => {
        const value =
          `${member.email || ""} ${
            member.username || ""
          }`.toLowerCase();

        return value.includes(
          search.toLowerCase()
        );
      });

    return (
      <div className="dashboard">

        <aside className="sidebar">

          <div className="sidebar-brand">
            <div className="logo">D</div>

            <strong>
              DINSTORE
            </strong>
          </div>

          <div className="role">
            ADMIN PANEL
          </div>

          <button
            className={
              adminPage === "overview"
                ? "menu active"
                : "menu"
            }
            onClick={() =>
              setAdminPage("overview")
            }
          >
            Overview
          </button>

          <button
            className={
              adminPage === "members"
                ? "menu active"
                : "menu"
            }
            onClick={() => {
              setAdminPage("members");
              loadMembers();
            }}
          >
            Members
          </button>

          <button
            className={
              adminPage === "api"
                ? "menu active"
                : "menu"
            }
            onClick={() =>
              setAdminPage("api")
            }
          >
            API System
          </button>

          <button
            className={
              adminPage === "settings"
                ? "menu active"
                : "menu"
            }
            onClick={() =>
              setAdminPage("settings")
            }
          >
            Settings
          </button>

          <div className="sidebar-bottom">

            <button
              className="logout"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </aside>

        <main className="main">

          <header className="topbar">

            <div>
              <span>
                ADMIN
              </span>

              <h1>
                {adminPage === "overview"
                  ? "Overview"
                  : adminPage === "members"
                  ? "Members"
                  : adminPage === "api"
                  ? "API System"
                  : "Settings"}
              </h1>
            </div>

            <div className="online">
              <span></span>
              SYSTEM ONLINE
            </div>

          </header>

          {/* OVERVIEW */}

          {adminPage === "overview" && (
            <>
              <div className="stats">

                <div className="stat">
                  <span>
                    TOTAL MEMBER
                  </span>

                  <strong>
                    {members.length || "—"}
                  </strong>
                </div>

                <div className="stat">
                  <span>
                    ACTIVE
                  </span>

                  <strong>
                    {members.filter(
                      (x) =>
                        x.status ===
                        "active"
                    ).length || "—"}
                  </strong>
                </div>

                <div className="stat">
                  <span>
                    API
                  </span>

                  <strong>
                    35+
                  </strong>
                </div>

                <div className="stat">
                  <span>
                    ROLE
                  </span>

                  <strong>
                    ADMIN
                  </strong>
                </div>

              </div>

              <div className="panel">

                <h2>
                  DINSTORE API
                </h2>

                <p>
                  Selamat datang di panel
                  administrator.
                </p>

                <div className="api-list">

                  <div>
                    <strong>
                      TikTok Downloader
                    </strong>

                    <code>
                      /api/download/tiktok
                    </code>
                  </div>

                  <div>
                    <strong>
                      ChatGPT
                    </strong>

                    <code>
                      /api/ai/chatgpt
                    </code>
                  </div>

                </div>

              </div>
            </>
          )}

          {/* MEMBERS */}

          {adminPage === "members" && (
            <div className="panel">

              <div className="panel-head">

                <h2>
                  Member Management
                </h2>

                <button
                  className="refresh"
                  onClick={loadMembers}
                >
                  Refresh
                </button>

              </div>

              <input
                className="search"
                placeholder="Cari email / username..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <div className="members">

                {filteredMembers.map(
                  (member) => (
                    <div
                      className="member"
                      key={member.id}
                    >

                      <div className="member-avatar">
                        {(member.username ||
                          member.email ||
                          "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="member-info">

                        <strong>
                          {member.username ||
                            "Member"}
                        </strong>

                        <span>
                          {member.email}
                        </span>

                        <code>
                          {member.api_key ||
                            "Tidak ada API key"}
                        </code>

                      </div>

                      <div className="member-actions">

                        <span
                          className={
                            member.status ===
                            "active"
                              ? "badge active-badge"
                              : "badge banned-badge"
                          }
                        >
                          {member.status ||
                            "unknown"}
                        </span>

                        {member.api_key && (
                          <button
                            onClick={() =>
                              copyKey(
                                member.api_key
                              )
                            }
                          >
                            Copy Key
                          </button>
                        )}

                        <button
                          onClick={() =>
                            toggleMemberStatus(
                              member
                            )
                          }
                        >
                          {member.status ===
                          "active"
                            ? "Ban"
                            : "Aktifkan"}
                        </button>

                      </div>

                    </div>
                  )
                )}

                {filteredMembers.length ===
                  0 && (
                  <div className="empty">
                    Belum ada data member.
                  </div>
                )}

              </div>

            </div>
          )}

          {/* API */}

          {adminPage === "api" && (
            <div className="panel">

              <h2>
                API System
              </h2>

              <div className="endpoint">

                <span className="method get">
                  GET
                </span>

                <code>
                  /api/download/tiktok
                </code>

              </div>

              <div className="endpoint">

                <span className="method post">
                  POST
                </span>

                <code>
                  /api/ai/chatgpt
                </code>

              </div>

              <p className="muted">
                Endpoint API bisa kita tambahkan
                satu per satu setelah dashboard
                selesai.
              </p>

            </div>
          )}

          {/* SETTINGS */}

          {adminPage === "settings" && (
            <div className="panel">

              <h2>
                Settings
              </h2>

              <div className="setting">
                <span>
                  Admin
                </span>

                <strong>
                  {session.user.email}
                </strong>
              </div>

              <div className="setting">
                <span>
                  Role
                </span>

                <strong>
                  ADMIN
                </strong>
              </div>

              <button
                className="logout-large"
                onClick={logout}
              >
                Logout
              </button>

            </div>
          )}

        </main>

      </div>
    );
  }

  /* =========================
     MEMBER DASHBOARD
  ========================= */

  return (
    <div className="dashboard">

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="logo">
            D
          </div>

          <strong>
            DINSTORE
          </strong>

        </div>

        <div className="role">
          MEMBER
        </div>

        <button className="menu active">
          Dashboard
        </button>

        <button className="menu">
          API Documentation
        </button>

        <button className="menu">
          API Tester
        </button>

        <button className="menu">
          Profile
        </button>

        <div className="sidebar-bottom">

          <button
            className="logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </aside>

      <main className="main">

        <header className="topbar">

          <div>
            <span>
              MEMBER
            </span>

            <h1>
              Dashboard
            </h1>
          </div>

          <div className="online">
            <span></span>
            ONLINE
          </div>

        </header>

        <div className="stats">

          <div className="stat">
            <span>
              ACCOUNT
            </span>

            <strong>
              ACTIVE
            </strong>
          </div>

          <div className="stat">
            <span>
              API
            </span>

            <strong>
              35+
            </strong>
          </div>

          <div className="stat">
            <span>
              REQUEST
            </span>

            <strong>
              {profile?.total_requests ||
                0}
            </strong>
          </div>

        </div>

        <div className="panel">

          <h2>
            API KEY
          </h2>

          <p>
            Gunakan API key ini untuk
            mengakses API DINSTORE.
          </p>

          <div className="api-key">

            <code>
              {profile?.api_key ||
                "API KEY BELUM TERSEDIA"}
            </code>

            {profile?.api_key && (
              <button
                onClick={() =>
                  copyKey(
                    profile.api_key
                  )
                }
              >
                COPY
              </button>
            )}

          </div>

        </div>

        <div className="panel">

          <h2>
            API ENDPOINT
          </h2>

          <div className="endpoint">

            <span className="method get">
              GET
            </span>

            <code>
              /api/download/tiktok
            </code>

            <button
              onClick={() =>
                alert(
                  "API Tester TikTok akan dibuat."
                )
              }
            >
              TEST
            </button>

          </div>

          <div className="endpoint">

            <span className="method post">
              POST
            </span>

            <code>
              /api/ai/chatgpt
            </code>

            <button
              onClick={() =>
                alert(
                  "API Tester ChatGPT akan dibuat."
                )
              }
            >
              TEST
            </button>

          </div>

        </div>

        {message && (
          <div className="success">
            {message}
          </div>
        )}

      </main>

    </div>
  );
}
