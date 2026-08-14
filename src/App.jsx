import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Chrome,
  LogOut,
  Home,
  ArrowLeft,
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
        setUser(data.session?.user || null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return user;
}

/* =========================================================
   LAYOUT
========================================================= */

function Layout({ children }) {
  const user = useAuth();

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="app">
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 22px",
          background: "rgba(7,16,13,.95)",
          borderBottom: "1px solid #263831",
          zIndex: 100,
        }}
      >
        <Link
          to={user ? "/" : "/login"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "800",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              width: "38px",
              height: "38px",
              display: "grid",
              placeItems: "center",
              border: "2px solid #5dffb0",
              borderRadius: "11px",
              color: "#5dffb0",
            }}
          >
            D
          </span>

          DINSTORE
          <span style={{ color: "#5dffb0" }}>API</span>
        </Link>

        {user && (
          <button
            onClick={logout}
            style={{
              width: "auto",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 14px",
              background: "#111b18",
              color: "#fff",
              border: "1px solid #34463f",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            <LogOut size={16} />
            LOGOUT
          </button>
        )}
      </header>

      <main style={{ paddingTop: "70px", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}

/* =========================================================
   AUTH CARD
========================================================= */

function AuthCard({ title, subtitle, children }) {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          padding: "30px",
          background: "linear-gradient(145deg,#141f1b,#0c1412)",
          border: "1px solid #354840",
          borderRadius: "21px",
          boxShadow: "0 25px 70px rgba(0,0,0,.4)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "62px",
              height: "62px",
              margin: "0 auto 18px",
              display: "grid",
              placeItems: "center",
              border: "2px solid #5dffb0",
              borderRadius: "16px",
              color: "#5dffb0",
              fontSize: "28px",
              fontWeight: "800",
              background: "#13251e",
            }}
          >
            D
          </div>

          <div
            style={{
              fontSize: "11px",
              letterSpacing: "3px",
              color: "#72817a",
              marginBottom: "8px",
            }}
          >
            DINSTORE API
          </div>

          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "27px",
            }}
          >
            {title}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#899690",
              fontSize: "14px",
            }}
          >
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}

/* =========================================================
   FORM COMPONENT
========================================================= */

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = true,
  minLength,
  showPassword,
  onTogglePassword,
}) {
  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <label
      style={{
        display: "grid",
        gap: "7px",
        color: "#b6c1bd",
        fontSize: "13px",
      }}
    >
      {label}

      <div
        style={{
          position: "relative",
        }}
      >
        {Icon && (
          <Icon
            size={17}
            style={{
              position: "absolute",
              left: "13px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6f8078",
            }}
          />
        )}

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          style={{
            width: "100%",
            padding: "13px",
            paddingLeft: Icon ? "40px" : "13px",
            paddingRight:
              type === "password" ? "43px" : "13px",
            borderRadius: "10px",
            border: "1px solid #394b43",
            background: "#09110e",
            color: "#fff",
            outline: "none",
          }}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={onTogglePassword}
            style={{
              position: "absolute",
              right: "5px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "35px",
              height: "35px",
              padding: 0,
              border: 0,
              background: "transparent",
              color: "#899690",
              cursor: "pointer",
            }}
          >
            {showPassword ? (
              <EyeOff size={17} />
            ) : (
              <Eye size={17} />
            )}
          </button>
        )}
      </div>
    </label>
  );
}

/* =========================================================
   MESSAGE
========================================================= */

function ErrorMessage({ children }) {
  if (!children) return null;

  return (
    <div
      style={{
        padding: "11px 13px",
        borderRadius: "9px",
        fontSize: "13px",
        background: "#2b1116",
        color: "#ff9ca4",
        border: "1px solid #71323b",
      }}
    >
      {children}
    </div>
  );
}

function SuccessMessage({ children }) {
  if (!children) return null;

  return (
    <div
      style={{
        padding: "11px 13px",
        borderRadius: "9px",
        fontSize: "13px",
        background: "#10271c",
        color: "#82ffc0",
        border: "1px solid #2e6d4d",
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

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

    navigate("/");
  }

  async function loginGoogle() {
    setError("");
    setGoogleLoading(true);

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

    if (error) {
      setGoogleLoading(false);
      setError(error.message);
    }
  }

  return (
    <AuthCard
      title="LOGIN MEMBER"
      subtitle="Masuk ke akun DINSTORE API."
    >
      <form
        onSubmit={login}
        style={{
          display: "grid",
          gap: "15px",
        }}
      >
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          icon={Mail}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={Lock}
          showPassword={showPassword}
          onTogglePassword={() =>
            setShowPassword(!showPassword)
          }
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Link
            to="/forgot-password"
            style={{
              color: "#5dffb0",
              fontSize: "13px",
            }}
          >
            Lupa password?
          </Link>
        </div>

        <ErrorMessage>{error}</ErrorMessage>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            border: "0",
            borderRadius: "11px",
            background: "#5dffb0",
            color: "#06100b",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          {loading ? "MEMPROSES..." : "LOGIN"}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#56655f",
            fontSize: "12px",
          }}
        >
          <span
            style={{
              flex: 1,
              height: "1px",
              background: "#293a33",
            }}
          />

          ATAU

          <span
            style={{
              flex: 1,
              height: "1px",
              background: "#293a33",
            }}
          />
        </div>

        <button
          type="button"
          onClick={loginGoogle}
          disabled={googleLoading}
          style={{
            width: "100%",
            padding: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "9px",
            border: "1px solid #3b4c45",
            borderRadius: "11px",
            background: "#151f1c",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          <Chrome size={18} />

          {googleLoading
            ? "MENGHUBUNGKAN..."
            : "LOGIN DENGAN GOOGLE"}
        </button>

        <div
          style={{
            textAlign: "center",
            color: "#899690",
            fontSize: "13px",
          }}
        >
          Belum punya akun?{" "}
          <Link
            to="/register"
            style={{
              color: "#5dffb0",
            }}
          >
            Daftar
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}

/* =========================================================
   REGISTER
========================================================= */

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function register(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
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
      navigate("/");
      return;
    }

    setSuccess(
      "Akun berhasil dibuat. Silakan cek email untuk verifikasi jika verifikasi email aktif."
    );
  }

  return (
    <AuthCard
      title="DAFTAR MEMBER"
      subtitle="Buat akun DINSTORE API."
    >
      <form
        onSubmit={register}
        style={{
          display: "grid",
          gap: "15px",
        }}
      >
        <Input
          label="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kamu"
          icon={UserPlus}
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          icon={Mail}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 8 karakter"
          icon={Lock}
          minLength={8}
          showPassword={showPassword}
          onTogglePassword={() =>
            setShowPassword(!showPassword)
          }
        />

        <ErrorMessage>{error}</ErrorMessage>

        <SuccessMessage>{success}</SuccessMessage>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            border: "0",
            borderRadius: "11px",
            background: "#5dffb0",
            color: "#06100b",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          {loading
            ? "MEMBUAT AKUN..."
            : "CREATE ACCOUNT"}
        </button>

        <div
          style={{
            textAlign: "center",
            color: "#899690",
            fontSize: "13px",
          }}
        >
          Sudah punya akun?{" "}
          <Link
            to="/login"
            style={{
              color: "#5dffb0",
            }}
          >
            Login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}

/* =========================================================
   FORGOT PASSWORD
========================================================= */

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function sendReset(e) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            window.location.origin +
            "/reset-password",
        }
      );

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(
      "Link reset password sudah dikirim ke email."
    );
  }

  return (
    <AuthCard
      title="LUPA PASSWORD"
      subtitle="Masukkan email untuk mendapatkan link reset."
    >
      <form
        onSubmit={sendReset}
        style={{
          display: "grid",
          gap: "15px",
        }}
      >
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          icon={Mail}
        />

        <ErrorMessage>{error}</ErrorMessage>

        <SuccessMessage>{success}</SuccessMessage>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            border: "0",
            borderRadius: "11px",
            background: "#5dffb0",
            color: "#06100b",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          {loading
            ? "MENGIRIM..."
            : "KIRIM RESET PASSWORD"}
        </button>

        <Link
          to="/login"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            color: "#5dffb0",
            fontSize: "13px",
          }}
        >
          <ArrowLeft size={15} />
          Kembali ke Login
        </Link>
      </form>
    </AuthCard>
  );
}

/* =========================================================
   RESET PASSWORD
========================================================= */

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function reset(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(
      "Password berhasil diubah. Silakan login kembali."
    );

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }

  return (
    <AuthCard
      title="RESET PASSWORD"
      subtitle="Buat password baru untuk akun kamu."
    >
      <form
        onSubmit={reset}
        style={{
          display: "grid",
          gap: "15px",
        }}
      >
        <Input
          label="Password Baru"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 8 karakter"
          icon={Lock}
          minLength={8}
          showPassword={showPassword}
          onTogglePassword={() =>
            setShowPassword(!showPassword)
          }
        />

        <ErrorMessage>{error}</ErrorMessage>

        <SuccessMessage>{success}</SuccessMessage>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            border: "0",
            borderRadius: "11px",
            background: "#5dffb0",
            color: "#06100b",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          {loading
            ? "MENYIMPAN..."
            : "SIMPAN PASSWORD"}
        </button>
      </form>
    </AuthCard>
  );
}

/* =========================================================
   HOME
========================================================= */

function HomePage() {
  const user = useAuth();

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "9px 15px",
            border: "1px solid #315342",
            borderRadius: "999px",
            background: "#102019",
            color: "#5dffb0",
            fontSize: "11px",
            letterSpacing: "2px",
          }}
        >
          ● SYSTEM ONLINE
        </div>

        <h1
          style={{
            margin: "25px 0 12px",
            fontSize: "clamp(42px,8vw,80px)",
            letterSpacing: "-4px",
          }}
        >
          DINSTORE{" "}
          <span style={{ color: "#5dffb0" }}>
            API
          </span>
        </h1>

        <p
          style={{
            maxWidth: "650px",
            margin: "0 auto 30px",
            color: "#899690",
            fontSize: "17px",
            lineHeight: "1.7",
          }}
        >
          Selamat datang di DINSTORE API.
          Sistem authentication berhasil terhubung
          dengan Supabase.
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "13px 17px",
            borderRadius: "12px",
            background: "#111b18",
            border: "1px solid #34463f",
            color: "#b8c4be",
            fontSize: "13px",
          }}
        >
          <Home size={16} color="#5dffb0" />

          Login sebagai:
          <strong style={{ color: "#5dffb0" }}>
            {user?.email || "Member"}
          </strong>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children }) {
  const user = useAuth();

  if (user === undefined) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 70px)",
          display: "grid",
          placeItems: "center",
          color: "#5dffb0",
        }}
      >
        MEMUAT...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =========================================================
   APP
========================================================= */

function AppRoutes() {
  const user = useAuth();

  return (
    <Layout>
      <Routes>
        {/* Belum login */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* Halaman utama hanya setelah login */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Layout>
  );
}

/* =========================================================
   EXPORT
========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
