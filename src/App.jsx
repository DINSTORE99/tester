import React, { useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import {
  Menu,
  X,
  Home,
  Sparkles,
  Shield,
  Database,
  Download,
  Wrench,
  Search,
  ArrowUpRight,
  KeyRound,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Copy,
  Check,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

import { supabase } from "./lib/supabase";

/* =========================
   DATA
========================= */

const cats = [
  ["ai", "AI", Sparkles],
  ["admin", "ADMIN", Shield],
  ["cache", "CACHE", Database],
  ["download", "DOWNLOAD", Download],
  ["tools", "TOOLS", Wrench],
];

const eps = [
  ["ai", "AI Aiko", "/api/ai/aiko"],
  ["ai", "AI Lyrics Generator", "/api/ai/lyricsgen"],
  ["ai", "AI Coder", "/api/tools/aicoder"],
  ["ai", "Text To Image", "/api/ai/text2img"],

  ["admin", "Health", "/api/health"],
  ["admin", "Profile", "/api/me"],

  ["cache", "Cache Status", "/api/cache/status"],
  ["cache", "Cache Stats", "/api/cache/stats"],
  ["cache", "Cache Clear", "/api/cache/clear"],

  ["download", "TikTok", "/api/download/tiktok"],
  ["download", "Instagram", "/api/download/instagram"],
  ["download", "YouTube", "/api/download/youtube"],
  ["download", "Pinterest", "/api/download/pinterest"],
  ["download", "Spotify", "/api/download/spotify"],

  ["tools", "QRIS Generator", "/api/tools/qrisgen"],
  ["tools", "Short URL", "/api/tools/shorturl"],
  ["tools", "Screenshot", "/api/tools/screenshot"],
  ["tools", "IP Info", "/api/tools/ipinfo"],
].map((x) => ({
  cat: x[0],
  method: "GET",
  name: x[1],
  path: x[2],
}));

/* =========================
   USER
========================= */

function useUser() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return user;
}

/* =========================
   NAV
========================= */

function Nav({ to, icon: Icon, label, close }) {
  return (
    <NavLink
      to={to}
      onClick={close}
      className={({ isActive }) =>
        "nav " + (isActive ? "active" : "")
      }
    >
      <Icon size={19} />
      <span>{label}</span>
    </NavLink>
  );
}

/* =========================
   SHELL
========================= */

function Shell({ children }) {
  const [open, setOpen] = useState(false);
  const user = useUser();

  return (
    <>
      <header className="top">
        <button
          className="hamb"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>

        <Link className="brand" to="/">
          <i>D</i> DINSTORE <b>API</b>
        </Link>

        {user ? (
          <Link className="user" to="/dashboard">
            <User size={16} />
            MEMBER
          </Link>
        ) : (
          <Link className="user" to="/login">
            <LogIn size={16} />
            LOGIN
          </Link>
        )}
      </header>

      <div className="layout">
        <aside className={"side " + (open ? "show" : "")}>
          <div className="sidehead">
            <div>
              <small>NAVIGATION</small>
              <strong>DINSTORE API</strong>
            </div>

            <button
              className="hamb close"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </div>

          <nav>
            <Nav
              to="/home"
              icon={Home}
              label="HOME"
              close={() => setOpen(false)}
            />

            {cats.map((c) => (
              <Nav
                key={c[0]}
                to={"/docs/" + c[0]}
                icon={c[2]}
                label={c[1]}
                close={() => setOpen(false)}
              />
            ))}

            <Nav
              to="/dashboard"
              icon={User}
              label="MEMBER"
              close={() => setOpen(false)}
            />
          </nav>

          <div className="sidebottom">
            {user ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/login";
                }}
              >
                <LogOut size={16} />
                LOGOUT
              </button>
            ) : (
              <Link to="/register">
                <UserPlus size={16} />
                DAFTAR
              </Link>
            )}
          </div>
        </aside>

        {open && (
          <div
            className="overlay"
            onClick={() => setOpen(false)}
          />
        )}

        <main>{children}</main>
      </div>
    </>
  );
}

/* =========================
   CARD
========================= */

function Card({ e }) {
  return (
    <article className="card">
      <div className="cardtop">
        <span className="method">{e.method}</span>

        <div>
          <h3>{e.name}</h3>
          <code>{e.path}</code>
        </div>

        <Link
          className="open"
          to={
            "/endpoint?path=" +
            encodeURIComponent(e.path)
          }
        >
          OPEN
          <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="desc">
        API endpoint DINSTORE.
      </div>
    </article>
  );
}

/* =========================
   HOME
========================= */

function Home() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const list = useMemo(() => {
    return eps.filter(
      (e) =>
        (filter === "all" || e.cat === filter) &&
        `${e.name} ${e.path}`
          .toLowerCase()
          .includes(q.toLowerCase())
    );
  }, [q, filter]);

  return (
    <div className="page">
      <section className="hero">
        <div className="terminal">
          ● TERMINAL ACTIVE
        </div>

        <h1>
          DINSTORE <span>API</span>
        </h1>

        <p>
          API modern untuk aplikasi, automation,
          downloader, tools dan AI dengan akses member.
        </p>
      </section>

      <section className="stats">
        <div>
          <small>CATEGORIES</small>
          <b>5</b>
        </div>

        <div>
          <small>ENDPOINTS</small>
          <b className="green">{eps.length}+</b>
        </div>

        <div className="full">
          <small>STATUS</small>
          <b className="green">ONLINE</b>
        </div>
      </section>

      <div className="notice">
        <KeyRound />

        <span>
          Login untuk mendapatkan{" "}
          <b>API KEY</b> member.
        </span>

        <Link to="/login">
          LOGIN →
        </Link>
      </div>

      <div className="search">
        <Search />

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="SEARCH ENDPOINT / CATEGORY..."
        />
      </div>

      <div className="filters">
        <button
          className={filter === "all" ? "sel" : ""}
          onClick={() => setFilter("all")}
        >
          ALL ({eps.length})
        </button>

        {cats.map((c) => (
          <button
            key={c[0]}
            className={
              filter === c[0] ? "sel" : ""
            }
            onClick={() => setFilter(c[0])}
          >
            {c[1]}
          </button>
        ))}
      </div>

      <div className="grid">
        {list.map((e) => (
          <Card key={e.path} e={e} />
        ))}
      </div>
    </div>
  );
}

/* =========================
   DOCS
========================= */

function Docs({ id }) {
  const category =
    cats.find((x) => x[0] === id) || cats[0];

  const list = eps.filter(
    (e) => e.cat === id
  );

  return (
    <div className="page">
      <div className="heading">
        <small>MODULE</small>
        <h1>{category[1]}</h1>
        <p>{list.length} endpoints</p>
      </div>

      <div className="grid">
        {list.map((e) => (
          <Card key={e.path} e={e} />
        ))}
      </div>
    </div>
  );
}

/* =========================
   AUTH LAYOUT
========================= */

function Auth({ title, sub, children }) {
  return (
    <div className="auth">
      <div className="authcard">
        <div className="brand big">
          <i>D</i> DINSTORE <b>API</b>
        </div>

        <small>MEMBER ACCESS</small>

        <h1>{title}</h1>

        <p>{sub}</p>

        {children}
      </div>
    </div>
  );
}

/* =========================
   LOGIN
========================= */

function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const loginEmail = async (e) => {
    e.preventDefault();

    setErr("");
    setBusy(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password: pw,
      });

    setBusy(false);

    if (error) {
      setErr(
        "Email atau password salah."
      );
      return;
    }

    nav("/dashboard");
  };

  const loginGoogle = async () => {
    setErr("");
    setGoogleBusy(true);

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",

        options: {
          redirectTo:
            window.location.origin +
            "/dashboard",
        },
      });

    if (error) {
      setGoogleBusy(false);
      setErr(error.message);
    }
  };

  return (
    <Auth
      title="LOGIN MEMBER"
      sub="Masuk ke dashboard DINSTORE API."
    >
      <form onSubmit={loginEmail}>
        <label>
          Email

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </label>

        <label>
          Password

          <div className="pass">
            <input
              type={
                show ? "text" : "password"
              }
              required
              value={pw}
              onChange={(e) =>
                setPw(e.target.value)
              }
            />

            <button
              type="button"
              onClick={() =>
                setShow(!show)
              }
            >
              {show ? (
                <EyeOff />
              ) : (
                <Eye />
              )}
            </button>
          </div>
        </label>

        {err && (
          <div className="error">
            {err}
          </div>
        )}

        <button
          className="primary"
          disabled={busy}
        >
          {busy
            ? "MEMPROSES..."
            : "LOGIN"}
        </button>
      </form>

      <div className="or">
        <span>ATAU</span>
      </div>

      <button
        type="button"
        className="google-btn"
        onClick={loginGoogle}
        disabled={googleBusy}
      >
        <span className="google-icon">
          G
        </span>

        {googleBusy
          ? "MENGHUBUNGKAN..."
          : "LOGIN DENGAN GOOGLE"}
      </button>

      <div className="links">
        <Link to="/forgot-password">
          Lupa password?
        </Link>

        <Link to="/register">
          Daftar
        </Link>
      </div>
    </Auth>
  );
}

/* =========================
   REGISTER
========================= */

function Register() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setErr("");
    setOk("");
    setBusy(true);

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password: pw,

        options: {
          data: {
            name,
          },
        },
      });

    setBusy(false);

    if (error) {
      setErr(error.message);
      return;
    }

    if (data.session) {
      nav("/dashboard");
    } else {
      setOk(
        "Akun berhasil dibuat. Silakan login."
      );
    }
  };

  return (
    <Auth
      title="DAFTAR MEMBER"
      sub="Buat akun baru DINSTORE API."
    >
      <form onSubmit={submit}>
        <label>
          Nama

          <input
            required
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
        </label>

        <label>
          Email

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </label>

        <label>
          Password

          <input
            type="password"
            minLength={8}
            required
            value={pw}
            onChange={(e) =>
              setPw(e.target.value)
            }
          />
        </label>

        {err && (
          <div className="error">
            {err}
          </div>
        )}

        {ok && (
          <div className="ok">
            {ok}
          </div>
        )}

        <button
          className="primary"
          disabled={busy}
        >
          {busy
            ? "MEMBUAT..."
            : "CREATE ACCOUNT"}
        </button>

        <div className="links">
          <Link to="/login">
            Sudah punya akun?
          </Link>
        </div>
      </form>
    </Auth>
  );
}

/* =========================
   FORGOT
========================= */

function Forgot() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setErr("");
    setMsg("");

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            window.location.origin +
            "/reset-password",
        }
      );

    if (error) {
      setErr(error.message);
    } else {
      setMsg(
        "Link reset password berhasil dikirim."
      );
    }
  };

  return (
    <Auth
      title="LUPA PASSWORD"
      sub="Masukkan email akun kamu."
    >
      <form onSubmit={submit}>
        <label>
          Email

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </label>

        {err && (
          <div className="error">
            {err}
          </div>
        )}

        {msg && (
          <div className="ok">
            {msg}
          </div>
        )}

        <button className="primary">
          KIRIM LINK
        </button>

        <Link
          className="back"
          to="/login"
        >
          ← Kembali ke login
        </Link>
      </form>
    </Auth>
  );
}

/* =========================
   RESET
========================= */

function Reset() {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setErr("");
    setMsg("");

    const { error } =
      await supabase.auth.updateUser({
        password: pw,
      });

    if (error) {
      setErr(error.message);
    } else {
      setMsg(
        "Password berhasil diubah."
      );
    }
  };

  return (
    <Auth
      title="RESET PASSWORD"
      sub="Masukkan password baru."
    >
      <form onSubmit={submit}>
        <label>
          Password baru

          <input
            type="password"
            minLength={8}
            required
            value={pw}
            onChange={(e) =>
              setPw(e.target.value)
            }
          />
        </label>

        {err && (
          <div className="error">
            {err}
          </div>
        )}

        {msg && (
          <div className="ok">
            {msg}
          </div>
        )}

        <button className="primary">
          SIMPAN PASSWORD
        </button>
      </form>
    </Auth>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard() {
  const nav = useNavigate();
  const user = useUser();

  const [profile, setProfile] =
    useState(null);

  const [err, setErr] =
    useState("");

  useEffect(() => {
    if (user === null) {
      nav("/login");
      return;
    }

    if (user) {
      supabase
        .from("profiles")
        .select(
          "name,email,api_key,status,role,created_at"
        )
        .eq("id", user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            setErr(error.message);
          } else {
            setProfile(data);
          }
        });
    }
  }, [user, nav]);

  if (user === undefined) {
    return (
      <div className="page">
        <div className="loading">
          MEMUAT...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="page">
      <small>MEMBER PANEL</small>

      <h1>Dashboard</h1>

      <p className="muted">
        {profile?.email ||
          user.email}
      </p>

      <div className="dash">
        <div>
          <small>NAMA</small>
          <b>
            {profile?.name || "-"}
          </b>
        </div>

        <div>
          <small>STATUS</small>
          <b className="green">
            {profile?.status ||
              "active"}
          </b>
        </div>

        <div>
          <small>ROLE</small>
          <b>
            {profile?.role ||
              "member"}
          </b>
        </div>

        <div>
          <small>JOINED</small>
          <b>
            {profile?.created_at
              ? new Date(
                  profile.created_at
                ).toLocaleDateString(
                  "id-ID"
                )
              : "-"}
          </b>
        </div>

        <div className="key">
          <small>
            API KEY MEMBER
          </small>

          <code>
            {profile?.api_key || "-"}
          </code>

          <button
            onClick={() =>
              navigator.clipboard?.writeText(
                profile?.api_key || ""
              )
            }
          >
            <Copy size={16} />
            COPY KEY
          </button>
        </div>
      </div>

      {err && (
        <div className="error">
          {err}
        </div>
      )}

      <div className="security">
        <LockKeyhole size={18} />

        API key dibuat otomatis
        oleh database.

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            nav("/login");
          }}
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
}

/* =========================
   ENDPOINT
========================= */

function Endpoint() {
  const location = useLocation();

  const path =
    new URLSearchParams(
      location.search
    ).get("path") ||
    "/api/health";

  const endpoint = eps.find(
    (x) => x.path === path
  );

  const [copied, setCopied] =
    useState(false);

  const url =
    window.location.origin +
    path;

  const copy = () => {
    navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      1200
    );
  };

  return (
    <div className="page">
      <small>
        DOCUMENTATION / ENDPOINT
      </small>

      <div className="detail">
        <div className="detailhead">
          <span className="method">
            GET
          </span>

          <div>
            <h1>
              {endpoint?.name ||
                "API Endpoint"}
            </h1>

            <code>{path}</code>
          </div>
        </div>

        <p>
          Endpoint DINSTORE API.
          Gunakan API key member
          jika endpoint memerlukannya.
        </p>

        <div className="code">
          <span>{url}</span>

          <button onClick={copy}>
            {copied ? (
              <Check />
            ) : (
              <Copy />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   AUTH ROUTER
========================= */

function AuthRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<Forgot />}
      />

      <Route
        path="/reset-password"
        element={<Reset />}
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

/* =========================
   MAIN APP
========================= */

export default function App() {
  const user = useUser();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname ===
      "/forgot-password" ||
    location.pathname ===
      "/reset-password";

  /*
   * ROOT LANGSUNG KE LOGIN
   */

  if (location.pathname === "/") {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /*
   * HALAMAN AUTH TANPA SIDEBAR
   */

  if (isAuthPage) {
    return <AuthRoutes />;
  }

  /*
   * WEBSITE UTAMA
   */

  return (
    <Shell>
      <Routes>
        <Route
          path="/home"
          element={<Home />}
        />

        {cats.map((c) => (
          <Route
            key={c[0]}
            path={"/docs/" + c[0]}
            element={
              <Docs id={c[0]} />
            }
          />
        ))}

        <Route
          path="/endpoint"
          element={<Endpoint />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
      </Routes>
    </Shell>
  );
}
