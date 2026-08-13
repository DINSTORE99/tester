import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  LogIn,
  UserPlus,
  ArrowLeft,
  Chrome,
  Loader2,
  KeyRound,
  LogOut,
  Copy,
  Check,
} from "lucide-react";

import { supabase } from "./lib/supabase";

/* =========================================================
   AUTH HOOK
========================================================= */

function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setUser(data.session?.user ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return user;
}

/* =========================================================
   LOGO
========================================================= */

function Logo() {
  return (
    <Link to="/login" className="brand">
      <span className="brand-icon">D</span>

      <span>
        DINSTORE <b>API</b>
      </span>
    </Link>
  );
}

/* =========================================================
   AUTH LAYOUT
========================================================= */

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-glow glow-one" />
      <div className="auth-glow glow-two" />

      <header className="auth-header">
        <Logo />

        <Link to="/" className="auth-back">
          <ArrowLeft size={16} />
          HOME
        </Link>
      </header>

      <main className="auth-main">{children}</main>

      <footer className="auth-footer">
        © {new Date().getFullYear()} DINSTORE API
      </footer>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  minLength,
}) {
  const [show, setShow] = useState(false);

  const inputType =
    type === "password" ? (show ? "text" : "password") : type;

  return (
    <label className="form-group">
      <span className="form-label">{label}</span>

      <div className="input-wrap">
        <Icon size={17} />

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          autoComplete={
            type === "email"
              ? "email"
              : type === "password"
              ? "current-password"
              : "name"
          }
        />

        {type === "password" && (
          <button
            type="button"
            className="input-action"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Sembunyikan password" : "Lihat password"}
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
    </label>
  );
}

/* =========================================================
   ERROR / SUCCESS
========================================================= */

function Message({ type = "error", children }) {
  if (!children) return null;

  return (
    <div className={`message ${type}`}>
      {children}
    </div>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function LoginPage() {
  const navigate = useNavigate();
  const user = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Email atau password salah.");
      return;
    }

    navigate("/dashboard");
  }

  async function handleGoogleLogin() {
    setError("");
    setGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      setGoogleLoading(false);
      setError(error.message);
    }
  }

  return (
    <AuthLayout>
      <section className="auth-card">
        <div className="auth-logo">
          <Logo />
        </div>

        <div className="auth-title">
          <span>MEMBER ACCESS</span>
          <h1>LOGIN MEMBER</h1>
          <p>Masuk untuk mengakses dashboard DINSTORE API.</p>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="spin" size={18} />
          ) : (
            <Chrome size={18} />
          )}

          {googleLoading ? "MENGHUBUNGKAN..." : "LOGIN DENGAN GOOGLE"}
        </button>

        <div className="divider">
          <span>ATAU</span>
        </div>

        <form onSubmit={handleLogin}>
          <Input
            label="Email"
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
          />

          <Input
            label="Password"
            icon={Lock}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
          />

          <div className="form-options">
            <span />

            <Link to="/forgot-password">Lupa password?</Link>
          </div>

          <Message>{error}</Message>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spin" size={18} />
                LOGIN...
              </>
            ) : (
              <>
                <LogIn size={18} />
                LOGIN
              </>
            )}
          </button>
        </form>

        <div className="auth-switch">
          Belum punya akun?

          <Link to="/register">
            <UserPlus size={15} />
            DAFTAR
          </Link>
        </div>
      </section>
    </AuthLayout>
  );
}

/* =========================================================
   REGISTER
========================================================= */

function RegisterPage() {
  const navigate = useNavigate();
  const user = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleRegister(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
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
      "Akun berhasil dibuat. Jika verifikasi email aktif di Supabase, silakan cek email Anda."
    );
  }

  return (
    <AuthLayout>
      <section className="auth-card">
        <div className="auth-logo">
          <Logo />
        </div>

        <div className="auth-title">
          <span>MEMBER ACCESS</span>
          <h1>DAFTAR MEMBER</h1>
          <p>Buat akun baru untuk menggunakan DINSTORE API.</p>
        </div>

        <form onSubmit={handleRegister}>
          <Input
            label="Nama"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kamu"
          />

          <Input
            label="Email"
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
          />

          <Input
            label="Password"
            icon={Lock}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
            minLength={8}
          />

          <Message>{error}</Message>
          <Message type="success">{success}</Message>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spin" size={18} />
                MEMBUAT AKUN...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                CREATE ACCOUNT
              </>
            )}
          </button>
        </form>

        <div className="auth-switch">
          Sudah punya akun?

          <Link to="/login">
            <LogIn size={15} />
            LOGIN
          </Link>
        </div>
      </section>
    </AuthLayout>
  );
}

/* =========================================================
   FORGOT PASSWORD
========================================================= */

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleForgot(e) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo:
          window.location.origin + "/reset-password",
      }
    );

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(
      "Link reset password sudah dikirim. Silakan cek email Anda."
    );
  }

  return (
    <AuthLayout>
      <section className="auth-card">
        <div className="auth-logo">
          <Logo />
        </div>

        <div className="auth-title">
          <span>ACCOUNT RECOVERY</span>
          <h1>LUPA PASSWORD</h1>
          <p>
            Masukkan email akun Anda untuk mendapatkan link reset
            password.
          </p>
        </div>

        <form onSubmit={handleForgot}>
          <Input
            label="Email"
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
          />

          <Message>{error}</Message>
          <Message type="success">{success}</Message>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spin" size={18} />
                MENGIRIM...
              </>
            ) : (
              <>
                <Mail size={18} />
                KIRIM LINK RESET
              </>
            )}
          </button>
        </form>

        <div className="back-link">
          <Link to="/login">
            <ArrowLeft size={15} />
            Kembali ke login
          </Link>
        </div>
      </section>
    </AuthLayout>
  );
}

/* =========================================================
   RESET PASSWORD
========================================================= */

function ResetPasswordPage() {
  const navigate = useNavigate();
  const user = useAuth();

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Password berhasil diubah.");

    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);
  }

  return (
    <AuthLayout>
      <section className="auth-card">
        <div className="auth-logo">
          <Logo />
        </div>

        <div className="auth-title">
          <span>ACCOUNT RECOVERY</span>
          <h1>RESET PASSWORD</h1>
          <p>Masukkan password baru untuk akun Anda.</p>
        </div>

        <form onSubmit={handleReset}>
          <Input
            label="Password Baru"
            icon={Lock}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
            minLength={8}
          />

          <Message>{error}</Message>
          <Message type="success">{success}</Message>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spin" size={18} />
                MENYIMPAN...
              </>
            ) : (
              <>
                <KeyRound size={18} />
                SIMPAN PASSWORD
              </>
            )}
          </button>
        </form>

        {!user && (
          <div className="back-link">
            <Link to="/login">
              <ArrowLeft size={15} />
              Kembali ke login
            </Link>
          </div>
        )}
      </section>
    </AuthLayout>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuth();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user === null) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (user === undefined) {
    return (
      <div className="loading-page">
        <Loader2 className="spin" size={30} />
        <span>MEMUAT...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const name =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Member";

  const provider =
    user.app_metadata?.provider || "email";

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  async function copyEmail() {
    if (!user.email) return;

    await navigator.clipboard?.writeText(user.email);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Logo />

        <button className="logout-btn" onClick={logout}>
          <LogOut size={16} />
          LOGOUT
        </button>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-title">
          <span>MEMBER PANEL</span>
          <h1>Dashboard</h1>
          <p>Selamat datang, {name}.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-card-icon">
              <User size={20} />
            </div>

            <small>NAMA</small>
            <strong>{name}</strong>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon">
              <Mail size={20} />
            </div>

            <small>EMAIL</small>

            <strong className="email-value">
              {user.email || "-"}
            </strong>

            <button
              className="copy-small"
              onClick={copyEmail}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  COPIED
                </>
              ) : (
                <>
                  <Copy size={14} />
                  COPY
                </>
              )}
            </button>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon">
              <KeyRound size={20} />
            </div>

            <small>AUTH PROVIDER</small>
            <strong>{provider.toUpperCase()}</strong>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon">
              <LogIn size={20} />
            </div>

            <small>STATUS</small>
            <strong className="status-online">
              ACTIVE
            </strong>
          </div>
        </div>

        <section className="dashboard-info">
          <KeyRound size={20} />

          <div>
            <strong>DINSTORE API MEMBER</strong>

            <p>
              Akun Anda sudah berhasil login. API key member
              dapat ditambahkan setelah tabel profile dan sistem
              API key selesai dikonfigurasi di Supabase.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   HOME REDIRECT
========================================================= */

function HomeRedirect() {
  return <Navigate to="/login" replace />;
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <Routes>
      {/* WEBSITE LANGSUNG LOGIN */}
      <Route path="/" element={<HomeRedirect />} />

      {/* AUTH */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />
      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      {/* MEMBER */}
      <Route
        path="/dashboard"
        element={<DashboardPage />}
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
