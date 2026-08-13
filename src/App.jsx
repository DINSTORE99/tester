import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useLocation,
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
  RefreshCw,
  Bot,
  Copy,
  Check,
  Terminal,
} from "lucide-react";

import { Turnstile } from "@marsidev/react-turnstile";
import { supabase } from "./lib/supabase";

const API =
  import.meta.env.VITE_API_BASE_URL || "/api";

const TS =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "";


/* =========================================================
   CATEGORIES
========================================================= */

const cats = [
  ["ai", "AI", Sparkles],
  ["admin", "ADMIN", Shield],
  ["cache", "CACHE", Database],
  ["download", "DOWNLOAD", Download],
  ["tools", "TOOLS", Wrench],
];


/* =========================================================
   ENDPOINTS
========================================================= */

const eps = [
  ["ai", "GET", "AI Aiko", "/api/ai/aiko"],
  [
    "ai",
    "GET",
    "AI Lyrics Generator",
    "/api/ai/lyricsgen",
  ],
  [
    "ai",
    "GET",
    "AI Coder",
    "/api/tools/aicoder",
  ],
  [
    "ai",
    "GET",
    "Text To Image",
    "/api/ai/text2img",
  ],

  ["admin", "GET", "Health", "/api/health"],
  ["admin", "GET", "Profile", "/api/me"],

  [
    "cache",
    "GET",
    "Cache Status",
    "/api/cache/status",
  ],
  [
    "cache",
    "GET",
    "Cache Stats",
    "/api/cache/stats",
  ],
  [
    "cache",
    "GET",
    "Cache Clear",
    "/api/cache/clear",
  ],

  [
    "download",
    "GET",
    "TikTok",
    "/api/download/tiktok",
  ],
  [
    "download",
    "GET",
    "Instagram",
    "/api/download/instagram",
  ],
  [
    "download",
    "GET",
    "YouTube",
    "/api/download/youtube",
  ],
  [
    "download",
    "GET",
    "Pinterest",
    "/api/download/pinterest",
  ],
  [
    "download",
    "GET",
    "Spotify",
    "/api/download/spotify",
  ],

  [
    "tools",
    "GET",
    "QRIS Generator",
    "/api/tools/qrisgen",
  ],
  [
    "tools",
    "GET",
    "Short URL",
    "/api/tools/shorturl",
  ],
  [
    "tools",
    "GET",
    "Screenshot",
    "/api/tools/screenshot",
  ],
  [
    "tools",
    "GET",
    "IP Info",
    "/api/tools/ipinfo",
  ],
].map(
  ([cat, method, name, path]) => ({
    cat,
    method,
    name,
    path,
  })
);


/* =========================================================
   NAV ITEM
========================================================= */

function Nav({
  to,
  icon: Icon,
  label,
  n,
  close,
}) {
  return (
    <NavLink
      to={to}
      onClick={close}
      className={({ isActive }) =>
        "nav " + (isActive ? "active" : "")
      }
    >
      <Icon size={21} />

      <span>{label}</span>

      {n && <small>{n}</small>}
    </NavLink>
  );
}


/* =========================================================
   MAIN SHELL
========================================================= */

function Shell({ children }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setUser(data.session?.user || null);
      });

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () =>
      listener.subscription.unsubscribe();
  }, []);

  return (
    <>
      {/* HEADER */}

      <header className="top">
        <button
          className="hamb"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
        >
          <Menu />
        </button>

        <Link className="brand" to="/">
          <i>D</i>

          DINSTORE <b>API</b>
        </Link>

        <div>
          {user ? (
            <Link
              className="user"
              to="/dashboard"
            >
              <User size={16} />
              MEMBER
            </Link>
          ) : (
            <Link
              className="user"
              to="/login"
            >
              <LogIn size={16} />
              LOGIN
            </Link>
          )}
        </div>
      </header>


      {/* LAYOUT */}

      <div className="layout">

        {/* SIDEBAR */}

        <aside
          className={
            "side " +
            (open ? "show" : "")
          }
        >

          <div className="sidehead">

            <div>
              <small>
                NAVIGATION
              </small>

              <strong>
                DINSTORE API
              </strong>
            </div>

            <button
              className="hamb close"
              onClick={() =>
                setOpen(false)
              }
            >
              <X />
            </button>

          </div>


          <nav>

            <Nav
              to="/"
              icon={Home}
              label="HOME"
              close={() =>
                setOpen(false)
              }
            />

            {cats.map(
              (category, index) => (
                <Nav
                  key={category[0]}
                  to={
                    "/docs/" +
                    category[0]
                  }
                  icon={category[2]}
                  label={category[1]}
                  n={
                    "0" +
                    (index + 1)
                  }
                  close={() =>
                    setOpen(false)
                  }
                />
              )
            )}

            <Nav
              to="/dashboard"
              icon={User}
              label="MEMBER"
              close={() =>
                setOpen(false)
              }
            />

          </nav>


          {/* SIDEBAR BOTTOM */}

          <div className="sidebottom">

            {user ? (
              <button
                onClick={() =>
                  supabase.auth.signOut()
                }
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


        {/* OVERLAY */}

        {open && (
          <div
            className="overlay"
            onClick={() =>
              setOpen(false)
            }
          />
        )}


        {/* CONTENT */}

        <main>
          {children}
        </main>

      </div>


      {/* FLOATING WHATSAPP / BOT */}

      <a
        className="float"
        href="https://wa.me/6287776581216"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        <Bot />
        <em />
      </a>
    </>
  );
}


/* =========================================================
   ENDPOINT CARD
========================================================= */

function Card({ e }) {
  return (
    <article className="card">

      <div className="cardtop">

        <span className="method">
          {e.method}
        </span>

        <div>
          <h3>{e.name}</h3>

          <code>
            {e.path}
          </code>
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


/* =========================================================
   HOME
========================================================= */

function Home() {
  const [q, setQ] = useState("");
  const [f, setF] = useState("all");

  const list = useMemo(() => {
    return eps.filter((e) => {
      const categoryMatch =
        f === "all" ||
        e.cat === f;

      const searchMatch =
        `${e.name} ${e.path}`
          .toLowerCase()
          .includes(
            q.toLowerCase()
          );

      return (
        categoryMatch &&
        searchMatch
      );
    });
  }, [q, f]);

  return (
    <div className="page">

      {/* HERO */}

      <section className="hero">

        <div className="terminal">
          ● TERMINAL ACTIVE
        </div>

        <h1>
          DINSTORE{" "}
          <span>API</span>
        </h1>

        <p>
          A comprehensive and user
          friendly API solution for
          modern applications.
        </p>

      </section>


      {/* STATS */}

      <section className="stats">

        <div>
          <small>
            CATEGORIES
          </small>

          <b>5</b>
        </div>

        <div>
          <small>
            ENDPOINTS
          </small>

          <b className="green">
            18+
          </b>
        </div>

        <div className="full">
          <small>
            STATUS
          </small>

          <b>
            ONLINE
          </b>
        </div>

      </section>


      {/* API KEY NOTICE */}

      <div className="notice">

        <KeyRound />

        <span>
          Login untuk mendapatkan{" "}
          <b>API KEY</b>{" "}
          member dan mengakses
          endpoint.
        </span>

        <Link to="/login">
          LOGIN →
        </Link>

      </div>


      {/* SEARCH */}

      <div className="search">

        <Search />

        <input
          value={q}
          onChange={(e) =>
            setQ(e.target.value)
          }
          placeholder="SEARCH ENDPOINT / CATEGORY..."
        />

      </div>


      {/* FILTER */}

      <div className="filters">

        <button
          className={
            f === "all"
              ? "sel"
              : ""
          }
          onClick={() =>
            setF("all")
          }
        >
          ALL ({eps.length})
        </button>

        {cats.map((c) => (
          <button
            key={c[0]}
            className={
              f === c[0]
                ? "sel"
                : ""
            }
            onClick={() =>
              setF(c[0])
            }
          >
            {c[1]}
          </button>
        ))}

      </div>


      {/* ENDPOINT GRID */}

      <div className="grid">

        {list.map((e) => (
          <Card
            key={e.path}
            e={e}
          />
        ))}

      </div>

    </div>
  );
}


/* =========================================================
   DOCUMENTATION
========================================================= */

function Docs({ id }) {
  const category =
    cats.find(
      (x) => x[0] === id
    ) || cats[0];

  const list =
    eps.filter(
      (e) => e.cat === id
    );

  return (
    <div className="page">

      <div className="heading">

        <div>

          <small>
            MODULE
          </small>

          <h1>
            {category[1]}
          </h1>

          <p>
            {list.length} endpoints
          </p>

        </div>

      </div>


      <div className="grid">

        {list.map((e) => (
          <Card
            key={e.path}
            e={e}
          />
        ))}

      </div>

    </div>
  );
}


/* =========================================================
   AUTH LAYOUT
========================================================= */

function Auth({
  title,
  sub,
  children,
}) {
  return (
    <div className="auth">

      <div className="authcard">

        <div className="brand big">
          <i>D</i>
          DINSTORE API
        </div>

        <small>
          MEMBER ACCESS
        </small>

        <h1>
          {title}
        </h1>

        <p>
          {sub}
        </p>

        {children}

      </div>

    </div>
  );
}


/* =========================================================
   LOGIN
========================================================= */

function Login() {
  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [pw, setPw] =
    useState("");

  const [err, setErr] =
    useState("");

  const submit = async (e) => {
    e.preventDefault();

    setErr("");

    const {
      error,
    } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password: pw,
        }
      );

    if (error) {
      setErr(error.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <Auth
      title="LOGIN MEMBER"
      sub="Masuk ke dashboard DINSTORE API."
    >

      <form onSubmit={submit}>

        <label>
          Email

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />
        </label>


        <label>
          Password

          <input
            type="password"
            required
            value={pw}
            onChange={(e) =>
              setPw(
                e.target.value
              )
            }
          />
        </label>


        {err && (
          <div className="error">
            {err}
          </div>
        )}


        <button
          className="primary"
          type="submit"
        >
          LOGIN
        </button>


        <div className="links">

          <Link to="/forgot-password">
            Lupa sandi?
          </Link>

          <Link to="/register">
            Daftar
          </Link>

        </div>

      </form>

    </Auth>
  );
}


/* =========================================================
   REGISTER
========================================================= */

function Register() {
  const navigate =
    useNavigate();

  const [v, setV] =
    useState({
      name: "",
      email: "",
      pw: "",
    });

  const [token, setToken] =
    useState("");

  const [err, setErr] =
    useState("");

  const [ok, setOk] =
    useState("");

  const submit = async (e) => {
    e.preventDefault();

    setErr("");

    if (TS && !token) {
      setErr(
        "Selesaikan verifikasi Cloudflare Turnstile."
      );

      return;
    }

    const {
      data,
      error,
    } =
      await supabase.auth.signUp(
        {
          email: v.email,
          password: v.pw,

          options: {
            data: {
              name: v.name,
            },
          },
        }
      );

    if (error) {
      setErr(error.message);
      return;
    }

    if (data.session) {
      navigate("/dashboard");
    } else {
      setOk(
        "Akun dibuat. Cek email verifikasi lalu login."
      );
    }
  };

  return (
    <Auth
      title="DAFTAR MEMBER"
      sub="Buat akun baru dan dapatkan API key."
    >

      <form onSubmit={submit}>

        <label>
          Nama

          <input
            required
            value={v.name}
            onChange={(e) =>
              setV({
                ...v,
                name: e.target.value,
              })
            }
          />
        </label>


        <label>
          Email

          <input
            type="email"
            required
            value={v.email}
            onChange={(e) =>
              setV({
                ...v,
                email: e.target.value,
              })
            }
          />
        </label>


        <label>
          Password

          <input
            type="password"
            minLength={8}
            required
            value={v.pw}
            onChange={(e) =>
              setV({
                ...v,
                pw: e.target.value,
              })
            }
          />
        </label>


        {TS && (
          <Turnstile
            siteKey={TS}
            onSuccess={setToken}
          />
        )}


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
          type="submit"
        >
          CREATE ACCOUNT
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


/* =========================================================
   FORGOT PASSWORD
========================================================= */

function Forgot() {
  const [email, setEmail] =
    useState("");

  const [msg, setMsg] =
    useState("");

  const [err, setErr] =
    useState("");

  const submit = async (e) => {
    e.preventDefault();

    setErr("");
    setMsg("");

    const {
      error,
    } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            location.origin +
            "/reset-password",
        }
      );

    if (error) {
      setErr(error.message);
    } else {
      setMsg(
        "Link reset password terkirim."
      );
    }
  };

  return (
    <Auth
      title="LUPA PASSWORD"
      sub="Link reset akan dikirim ke email."
    >

      <form onSubmit={submit}>

        <label>
          Email

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
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


        <button
          className="primary"
          type="submit"
        >
          KIRIM LINK
        </button>


        <Link
          className="back"
          to="/login"
        >
          ← Kembali
        </Link>

      </form>

    </Auth>
  );
}


/* =========================================================
   RESET PASSWORD
========================================================= */

function Reset() {
  const [pw, setPw] =
    useState("");

  const [msg, setMsg] =
    useState("");

  const [err, setErr] =
    useState("");

  const submit = async (e) => {
    e.preventDefault();

    setErr("");
    setMsg("");

    const {
      error,
    } =
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
              setPw(
                e.target.value
              )
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


        <button
          className="primary"
          type="submit"
        >
          SIMPAN
        </button>

      </form>

    </Auth>
  );
}


/* =========================================================
   MEMBER DASHBOARD
========================================================= */

function Dashboard() {
  const navigate =
    useNavigate();

  const [p, setP] =
    useState(null);

  const [key, setKey] =
    useState("");

  const [err, setErr] =
    useState("");

  useEffect(() => {
    (async () => {
      const {
        data,
      } =
        await supabase.auth.getSession();

      if (!data.session) {
        navigate("/login");
        return;
      }

      const response =
        await fetch(
          API + "/me",
          {
            headers: {
              Authorization:
                "Bearer " +
                data.session
                  .access_token,
            },
          }
        );

      const json =
        await response.json();

      setP(json.profile);
    })();
  }, [navigate]);

  const regen = async () => {
    setErr("");

    const {
      data,
    } =
      await supabase.auth.getSession();

    if (!data.session) {
      navigate("/login");
      return;
    }

    const response =
      await fetch(
        API + "/keys/regenerate",
        {
          method: "POST",

          headers: {
            Authorization:
              "Bearer " +
              data.session
                .access_token,
          },
        }
      );

    const json =
      await response.json();

    if (!response.ok) {
      setErr(
        json.error ||
          "Gagal membuat API key."
      );

      return;
    }

    setKey(json.apiKey);
  };

  return (
    <div className="page">

      <small>
        MEMBER PANEL
      </small>

      <h1>
        Dashboard
      </h1>

      <p>
        {p?.email}
      </p>


      <div className="dash">

        <div>
          <small>NAMA</small>

          <b>
            {p?.name || "-"}
          </b>
        </div>


        <div>
          <small>STATUS</small>

          <b className="green">
            {p?.status || "active"}
          </b>
        </div>


        <div className="key">

          <small>
            API KEY BARU
          </small>

          <code>
            {key ||
              "••••••••••••••••••••"}
          </code>

          <button
            onClick={regen}
          >
            <RefreshCw size={16} />

            GENERATE / REGENERATE
          </button>

        </div>

      </div>


      {err && (
        <div className="error">
          {err}
        </div>
      )}


      <div className="security">

        <Terminal size={18} />

        API key dibuat dan
        diverifikasi di backend.
        Service-role key tidak
        pernah dikirim ke browser.

      </div>

    </div>
  );
}


/* =========================================================
   ENDPOINT DETAIL
========================================================= */

function Endpoint() {
  const location =
    useLocation();

  const params =
    new URLSearchParams(
      location.search
    );

  const path =
    params.get("path") ||
    "/api/health";

  const [copied, setCopied] =
    useState(false);

  const copy = () => {
    navigator.clipboard.writeText(
      window.location.origin +
        path
    );

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      1200
    );
  };

  const endpoint =
    eps.find(
      (e) => e.path === path
    );

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

            <code>
              {path}
            </code>

          </div>

        </div>


        <p>
          Endpoint DINSTORE API.
          Gunakan API key member
          bila endpoint
          memerlukannya.
        </p>


        <div className="code">

          <span>
            {window.location.origin +
              path}
          </span>

          <button
            onClick={copy}
            aria-label="Copy endpoint"
          >
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


/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <Shell>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        {cats.map((c) => (
          <Route
            key={c[0]}
            path={
              "/docs/" +
              c[0]
            }
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
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="*"
          element={<Home />}
        />

      </Routes>

    </Shell>
  );
}
