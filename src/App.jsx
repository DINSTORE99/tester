import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  X,
  Home as HomeIcon,
  Sparkles,
  Shield,
  Database,
  Download,
  Wrench,
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
  Chrome,
} from "lucide-react";

import { Turnstile } from "@marsidev/react-turnstile";
import { supabase } from "./lib/supabase";

const TS = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

const cats = [
  ["ai", "AI", Sparkles],
  ["admin", "ADMIN", Shield],
  ["cache", "CACHE", Database],
  ["download", "DOWNLOAD", Download],
  ["tools", "TOOLS", Wrench],
];

const endpoints = [
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
].map((item) => ({
  cat: item[0],
  method: "GET",
  name: item[1],
  path: item[2],
}));

/* =========================
   AUTH USER
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
   NAVIGATION
========================= */

function NavItem({ to, icon: Icon, label, close }) {
  return (
    <Link
      to={to}
      onClick={close}
      className="nav"
    >
      <Icon size={19} />
      <span>{label}</span>
    </Link>
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
          <i>D</i>
          DINSTORE <b>API</b>
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

        <aside className={`side ${open ? "show" : ""}`}>

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

            <NavItem
              to="/home"
              icon={HomeIcon}
              label="HOME"
              close={() => setOpen(false)}
            />

            {cats.map((cat) => (
              <NavItem
                key={cat[0]}
                to={`/docs/${cat[0]}`}
                icon={cat[2]}
                label={cat[1]}
                close={() => setOpen(false)}
              />
            ))}

            <NavItem
              to="/dashboard"
              icon={User}
              label="MEMBER"
              close={() => setOpen(false)}
            />

          </nav>

          <div className="sidebottom">

            {user ? (
              <button
                onClick={() => supabase.auth.signOut()}
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

        <main>
          {children}
        </main>

      </div>

      <a
        className="float"
        href="https://wa.me/6287776581216"
        target="_blank"
        rel="noreferrer"
      >
        <User />
        <em />
      </a>
    </>
  );
}

/* =========================
   AUTH LAYOUT
========================= */

function Auth({ title, sub, children }) {
  return (
    <div className="auth">

      <div className="authcard">

        <Link className="brand big" to="/">
          <i>D</i>
          DINSTORE <b>API</b>
        </Link>

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
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      setError("Email atau password salah.");
      return;
    }

    navigate("/dashboard");
  }

  async function googleLogin() {
    setError("");

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dashboard",
        },
      });

    if (error) {
      setError(error.message);
    }
  }

  return (
    <Auth
      title="LOGIN MEMBER"
      sub="Masuk ke dashboard DINSTORE API."
    >

      <form onSubmit={login}>

        <label>
          Email

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="email@gmail.com"
          />
        </label>

        <label>
          Password

          <div className="pass">

            <input
              type={show ? "text" : "password"}
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff /> : <Eye />}
            </button>

          </div>
        </label>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <button
          className="primary"
          disabled={loading}
        >
          {loading
            ? "MEMPROSES..."
            : "LOGIN"}
        </button>

        <div className="or">
          <span>ATAU</span>
        </div>

        <button
          type="button"
          className="google"
          onClick={googleLogin}
        >
          <Chrome size={18} />
          LOGIN DENGAN GOOGLE
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

/* =========================
   REGISTER
========================= */

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  async function register(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (TS && !token) {
      setError(
        "Selesaikan verifikasi Cloudflare Turnstile."
      );
      return;
    }

    setLoading(true);

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,

        options: {
          data: {
            name,
          },
        },
      });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      navigate("/dashboard");
      return;
    }

    setSuccess(
      "Akun berhasil dibuat. Silakan cek email untuk verifikasi."
    );
  }

  return (
    <Auth
      title="DAFTAR MEMBER"
      sub="Buat akun baru dan dapatkan API key otomatis."
    >

      <form onSubmit={register}>

        <label>
          Nama

          <input
            required
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Nama kamu"
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
            placeholder="email@gmail.com"
          />
        </label>

        <label>
          Password

          <input
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Minimal 8 karakter"
          />
        </label>

        {TS && (
          <Turnstile
            siteKey={TS}
            onSuccess={setToken}
            onExpire={() => setToken("")}
          />
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {success && (
          <div className="ok">
            {success}
          </div>
        )}

        <button
          className="primary"
          disabled={loading}
        >
          {loading
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
   FORGOT PASSWORD
========================= */

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

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
      setError(error.message);
      return;
    }

    setSuccess(
      "Link reset password sudah dikirim ke email."
    );
  }

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
            placeholder="email@gmail.com"
          />
        </label>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {success && (
          <div className="ok">
            {success}
          </div>
        )}

        <button className="primary">
          KIRIM LINK RESET
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
   RESET PASSWORD
========================= */

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(
      "Password berhasil diubah."
    );

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }

  return (
    <Auth
      title="RESET PASSWORD"
      sub="Masukkan password baru."
    >

      <form onSubmit={submit}>

        <label>
          Password Baru

          <input
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Minimal 8 karakter"
          />
        </label>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {success && (
          <div className="ok">
            {success}
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
   HOME
========================= */

function HomePage() {
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
          API modern untuk aplikasi,
          automation, downloader, tools
          dan AI dengan akses member.
        </p>

      </section>

      <section className="stats">

        <div>
          <small>CATEGORIES</small>
          <b>5</b>
        </div>

        <div>
          <small>ENDPOINTS</small>
          <b className="green">
            {endpoints.length}+
          </b>
        </div>

        <div className="full">
          <small>STATUS</small>
          <b className="green">
            ONLINE
          </b>
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

      <div className="grid">

        {endpoints.map((endpoint) => (
          <EndpointCard
            key={endpoint.path}
            endpoint={endpoint}
          />
        ))}

      </div>

    </div>
  );
}

/* =========================
   ENDPOINT CARD
========================= */

function EndpointCard({ endpoint }) {
  return (
    <article className="card">

      <div className="cardtop">

        <span className="method">
          {endpoint.method}
        </span>

        <div>

          <h3>
            {endpoint.name}
          </h3>

          <code>
            {endpoint.path}
          </code>

        </div>

        <Link
          className="open"
          to={
            "/endpoint?path=" +
            encodeURIComponent(endpoint.path)
          }
        >
          OPEN
        </Link>

      </div>

      <div className="desc">
        API endpoint DINSTORE.
      </div>

    </article>
  );
}

/* =========================
   DOCS
========================= */

function Docs({ id }) {
  const category =
    cats.find((item) => item[0] === id) ||
    cats[0];

  const list =
    endpoints.filter(
      (item) => item.cat === id
    );

  return (
    <div className="page">

      <div className="heading">

        <small>MODULE</small>

        <h1>
          {category[1]}
        </h1>

        <p>
          {list.length} endpoints
        </p>

      </div>

      <div className="grid">

        {list.map((endpoint) => (
          <EndpointCard
            key={endpoint.path}
            endpoint={endpoint}
          />
        ))}

      </div>

    </div>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard() {
  const navigate = useNavigate();

  const user = useUser();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {

    if (user === null) {
      navigate("/login");
      return;
    }

    if (!user) return;

    async function loadProfile() {

      const { data, error } =
        await supabase
          .from("profiles")
          .select(
            "name,email,api_key,status,role,created_at"
          )
          .eq("id", user.id)
          .single();

      if (error) {
        setError(error.message);
        return;
      }

      setProfile(data);
    }

    loadProfile();

  }, [user, navigate]);

  if (user === undefined) {
    return (
      <div className="page">
        MEMUAT...
      </div>
    );
  }

  if (!user) return null;

  async function copyKey() {

    if (!profile?.api_key) return;

    await navigator.clipboard.writeText(
      profile.api_key
    );

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      1200
    );
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="page">

      <small>
        MEMBER PANEL
      </small>

      <h1>
        Dashboard
      </h1>

      <p className="muted">
        {profile?.email}
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
            {profile?.status || "active"}
          </b>
        </div>

        <div>
          <small>ROLE</small>
          <b>
            {profile?.role || "member"}
          </b>
        </div>

        <div>
          <small>JOINED</small>
          <b>
            {profile?.created_at
              ? new Date(
                  profile.created_at
                ).toLocaleDateString("id-ID")
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

          <button onClick={copyKey}>
            {copied ? (
              <Check size={16} />
            ) : (
              <Copy size={16} />
            )}

            {copied
              ? "COPIED"
              : "COPY KEY"}
          </button>

        </div>

      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="security">

        <LockKeyhole size={18} />

        API key dibuat otomatis
        oleh database.

        <button onClick={logout}>
          LOGOUT
        </button>

      </div>

    </div>
  );
}

/* =========================
   ENDPOINT DETAIL
========================= */

function Endpoint() {

  const location = useLocation();

  const path =
    new URLSearchParams(
      location.search
    ).get("path") ||
    "/api/health";

  const endpoint =
    endpoints.find(
      (item) => item.path === path
    );

  const [copied, setCopied] =
    useState(false);

  const url =
    window.location.origin + path;

  async function copyUrl() {

    await navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      1200
    );
  }

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
          jika endpoint memerlukannya.
        </p>

        <div className="code">

          <span>
            {url}
          </span>

          <button onClick={copyUrl}>

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
   APP
========================= */

export default function App() {

  return (
    <Routes>

      {/* HALAMAN PERTAMA = LOGIN */}
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
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
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/home"
        element={
          <Shell>
            <HomePage />
          </Shell>
        }
      />

      {cats.map((cat) => (
        <Route
          key={cat[0]}
          path={`/docs/${cat[0]}`}
          element={
            <Shell>
              <Docs id={cat[0]} />
            </Shell>
          }
        />
      ))}

      <Route
        path="/dashboard"
        element={
          <Shell>
            <Dashboard />
          </Shell>
        }
      />

      <Route
        path="/endpoint"
        element={
          <Shell>
            <Endpoint />
          </Shell>
        }
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
  );
}
