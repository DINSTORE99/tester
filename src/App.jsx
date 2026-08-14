import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Chrome,
  ArrowRight,
  Eye,
  EyeOff,
  Home,
  LogOut,
} from "lucide-react";

import { supabase } from "./lib/supabase";

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-bg" />

      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <span>D</span>
          <strong>
            DINSTORE <b>API</b>
          </strong>
        </Link>

        {children}

        <div className="auth-footer">
          © {new Date().getFullYear()} DINSTORE API
        </div>
      </div>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/home");
  }

  async function loginGoogle() {
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/home",
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-icon">
          <LogIn size={25} />
        </div>

        <div className="auth-title">
          <h1>Login Member</h1>
          <p>Masuk ke dashboard DINSTORE API.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button
          type="button"
          className="google-button"
          onClick={loginGoogle}
        >
          <Chrome size={19} />
          <span>Login dengan Google</span>
        </button>

        <div className="divider">
          <span>ATAU</span>
        </div>

        <form onSubmit={handleLogin}>
          <label>
            Email
            <div className="input-box">
              <Mail size={18} />
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          <label>
            Password
            <div className="input-box">
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </label>

          <div className="forgot-row">
            <Link to="/forgot-password">Lupa password?</Link>
          </div>

          <button className="primary-button" disabled={loading}>
            {loading ? "MEMPROSES..." : "LOGIN"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-switch">
          Belum punya akun?
          <Link to="/register"> Daftar sekarang</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
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
      navigate("/home");
      return;
    }

    setSuccess(
      "Akun berhasil dibuat. Silakan cek email untuk verifikasi jika email confirmation aktif."
    );
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-icon">
          <UserPlus size={25} />
        </div>

        <div className="auth-title">
          <h1>Daftar Member</h1>
          <p>Buat akun DINSTORE API baru.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleRegister}>
          <label>
            Nama
            <div className="input-box">
              <UserPlus size={18} />

              <input
                type="text"
                placeholder="Nama kamu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </label>

          <label>
            Email
            <div className="input-box">
              <Mail size={18} />

              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          <label>
            Password
            <div className="input-box">
              <Lock size={18} />

              <input
                type="password"
                placeholder="Minimal 6 karakter"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </label>

          <button className="primary-button" disabled={loading}>
            {loading ? "MEMBUAT AKUN..." : "DAFTAR"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-switch">
          Sudah punya akun?
          <Link to="/login"> Login</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleForgot(e) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Link reset password sudah dikirim ke email.");
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-icon">
          <Mail size={25} />
        </div>

        <div className="auth-title">
          <h1>Lupa Password</h1>
          <p>Masukkan email untuk mendapatkan link reset.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleForgot}>
          <label>
            Email
            <div className="input-box">
              <Mail size={18} />

              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          <button className="primary-button" disabled={loading}>
            {loading ? "MENGIRIM..." : "KIRIM LINK"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-switch">
          <Link to="/login">← Kembali ke Login</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

function HomePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

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

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <Link to="/" className="home-logo">
          <span>D</span>
          DINSTORE <b>API</b>
        </Link>

        <button onClick={logout} className="logout-button">
          <LogOut size={17} />
          LOGOUT
        </button>
      </header>

      <main className="home-content">
        <div className="status-badge">● SYSTEM ONLINE</div>

        <h1>
          Welcome to
          <span> DINSTORE API</span>
        </h1>

        <p>
          Login berhasil. Ini adalah halaman utama DINSTORE API.
        </p>

        <div className="user-box">
          <small>LOGIN ACCOUNT</small>
          <strong>{user?.email || "Member"}</strong>
        </div>

        <div className="home-buttons">
          <button onClick={() => navigate("/")}>
            <Home size={18} />
            HOME
          </button>

          <button onClick={logout}>
            <LogOut size={18} />
            LOGOUT
          </button>
        </div>
      </main>
    </div>
  );
}

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleReset(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password berhasil diubah.");
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-icon">
          <Lock size={25} />
        </div>

        <div className="auth-title">
          <h1>Reset Password</h1>
          <p>Masukkan password baru.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {message && <div className="auth-success">{message}</div>}

        <form onSubmit={handleReset}>
          <label>
            Password Baru
            <div className="input-box">
              <Lock size={18} />

              <input
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password baru"
                required
              />
            </div>
          </label>

          <button className="primary-button">
            SIMPAN PASSWORD
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-switch">
          <Link to="/login">Kembali ke Login</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">D</div>
        <p>MEMUAT DINSTORE...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          session ? <Navigate to="/home" replace /> : <Login />
        }
      />

      <Route
        path="/register"
        element={
          session ? <Navigate to="/home" replace /> : <Register />
        }
      />

      <Route
        path="/forgot-password"
        element={
          session ? (
            <Navigate to="/home" replace />
          ) : (
            <ForgotPassword />
          )
        }
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/home"
        element={
          session ? <HomePage /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="*"
        element={
          session ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
