import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./style.css";

/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState("login");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* -------------------------------------------------------
     CEK SESSION
  ------------------------------------------------------- */

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        setError(error.message);
      }

      setSession(data?.session || null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession);

      if (event === "SIGNED_IN") {
        setPage("dashboard");
        setMessage("");
        setError("");
      }

      if (event === "SIGNED_OUT") {
        setPage("login");
      }

      if (event === "PASSWORD_RECOVERY") {
        setPage("reset");
        setMessage("");
        setError("");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* -------------------------------------------------------
     SUPABASE BELUM DIKONFIGURASI
  ------------------------------------------------------- */

  if (!supabase) {
    return (
      <div className="app">
        <div className="grid-bg" />

        <main className="center">
          <div className="card">
            <div className="logo">D</div>

            <h1>Supabase belum dikonfigurasi</h1>

            <p>
              Tambahkan environment variable berikut ke
              <b> .env.local</b>:
            </p>

            <div className="env-box">
              <code>VITE_SUPABASE_URL</code>
              <code>VITE_SUPABASE_ANON_KEY</code>
            </div>

            <p className="small">
              Setelah mengubah .env.local, restart server Vite.
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* -------------------------------------------------------
     LOADING
  ------------------------------------------------------- */

  if (loading) {
    return (
      <div className="app">
        <div className="grid-bg" />

        <main className="center">
          <div className="loader-card">
            <div className="spinner" />
            <p>Memuat...</p>
          </div>
        </main>
      </div>
    );
  }

  /* -------------------------------------------------------
     DASHBOARD
  ------------------------------------------------------- */

  if (session && page === "dashboard") {
    return (
      <Dashboard
        session={session}
        onLogout={async () => {
          await supabase.auth.signOut();
          setSession(null);
          setPage("login");
        }}
      />
    );
  }

  /* -------------------------------------------------------
     RESET PASSWORD
  ------------------------------------------------------- */

  if (page === "reset") {
    return (
      <ResetPassword
        supabase={supabase}
        message={message}
        error={error}
        setMessage={setMessage}
        setError={setError}
        onBack={() => {
          setPage("login");
          setMessage("");
          setError("");
        }}
      />
    );
  }

  /* -------------------------------------------------------
     AUTH
  ------------------------------------------------------- */

  return (
    <AuthPage
      supabase={supabase}
      page={page}
      setPage={setPage}
      message={message}
      error={error}
      setMessage={setMessage}
      setError={setError}
    />
  );
}

/* =========================================================
   AUTH PAGE
========================================================= */

function AuthPage({
  supabase,
  page,
  setPage,
  message,
  error,
  setMessage,
  setError,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  /* -------------------------------------------------------
     LOGIN
  ------------------------------------------------------- */

  const login = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(getAuthError(error));
      return;
    }

    setMessage("Login berhasil.");
  };

  /* -------------------------------------------------------
     REGISTER
  ------------------------------------------------------- */

  const register = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!name.trim()) {
      setError("Nama wajib diisi.");
      return;
    }

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(getAuthError(error));
      return;
    }

    /*
      Jika Supabase Email Confirmation dimatikan,
      session langsung tersedia.

      Jika masih aktif, user akan mendapatkan email
      konfirmasi dari Supabase.
    */

    if (data?.session) {
      setMessage("Akun berhasil dibuat.");
    } else {
      setMessage(
        "Akun berhasil dibuat. Silakan cek email jika konfirmasi email aktif."
      );
    }
  };

  /* -------------------------------------------------------
     GOOGLE LOGIN
  ------------------------------------------------------- */

  const loginGoogle = async () => {
    clearMessages();
    setLoading(true);

    const redirectTo = window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setLoading(false);
      setError(getAuthError(error));
    }
  };

  /* -------------------------------------------------------
     FORGOT PASSWORD
  ------------------------------------------------------- */

  const forgotPassword = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!email) {
      setError("Masukkan email terlebih dahulu.");
      return;
    }

    setLoading(true);

    const redirectTo = `${window.location.origin}`;

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo,
      }
    );

    setLoading(false);

    if (error) {
      setError(getAuthError(error));
      return;
    }

    setMessage(
      "Link reset password sudah dikirim. Cek inbox email kamu."
    );
  };

  /* -------------------------------------------------------
     LOGIN PAGE
  ------------------------------------------------------- */

  if (page === "login") {
    return (
      <AuthLayout>
        <div className="auth-header">
          <div className="logo">D</div>

          <h1>Selamat datang</h1>

          <p>Login ke DINSTORE</p>
        </div>

        {message && <div className="success">{message}</div>}

        {error && <div className="error">{error}</div>}

        <form onSubmit={login} className="form">
          <label>Email</label>

          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <button
          className="forgot-btn"
          onClick={() => {
            clearMessages();
            setPage("forgot");
          }}
        >
          Lupa password?
        </button>

        <div className="divider">
          <span>atau</span>
        </div>

        <button
          className="google-btn"
          onClick={loginGoogle}
          disabled={loading}
        >
          <GoogleIcon />

          <span>Login dengan Google</span>
        </button>

        <div className="bottom-text">
          Belum punya akun?{" "}
          <button
            onClick={() => {
              clearMessages();
              setPage("register");
            }}
          >
            Daftar
          </button>
        </div>
      </AuthLayout>
    );
  }

  /* -------------------------------------------------------
     REGISTER PAGE
  ------------------------------------------------------- */

  if (page === "register") {
    return (
      <AuthLayout>
        <div className="auth-header">
          <div className="logo">D</div>

          <h1>Buat akun</h1>

          <p>Daftar akun DINSTORE baru</p>
        </div>

        {message && <div className="success">{message}</div>}

        {error && <div className="error">{error}</div>}

        <form onSubmit={register} className="form">
          <label>Nama</label>

          <input
            type="text"
            placeholder="Nama kamu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Membuat akun..." : "Daftar"}
          </button>
        </form>

        <div className="divider">
          <span>atau</span>
        </div>

        <button
          className="google-btn"
          onClick={loginGoogle}
          disabled={loading}
        >
          <GoogleIcon />

          <span>Daftar dengan Google</span>
        </button>

        <div className="bottom-text">
          Sudah punya akun?{" "}
          <button
            onClick={() => {
              clearMessages();
              setPage("login");
            }}
          >
            Login
          </button>
        </div>
      </AuthLayout>
    );
  }

  /* -------------------------------------------------------
     FORGOT PAGE
  ------------------------------------------------------- */

  if (page === "forgot") {
    return (
      <AuthLayout>
        <div className="auth-header">
          <div className="logo">D</div>

          <h1>Lupa password?</h1>

          <p>Masukkan email untuk mendapatkan link reset.</p>
        </div>

        {message && <div className="success">{message}</div>}

        {error && <div className="error">{error}</div>}

        <form onSubmit={forgotPassword} className="form">
          <label>Email</label>

          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </button>
        </form>

        <button
          className="back-btn"
          onClick={() => {
            clearMessages();
            setPage("login");
          }}
        >
          ← Kembali ke Login
        </button>
      </AuthLayout>
    );
  }

  return null;
}

/* =========================================================
   RESET PASSWORD
========================================================= */

function ResetPassword({
  supabase,
  message,
  error,
  setMessage,
  setError,
  onBack,
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const updatePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirm) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(getAuthError(error));
      return;
    }

    setMessage("Password berhasil diubah.");

    setTimeout(() => {
      onBack();
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="auth-header">
        <div className="logo">D</div>

        <h1>Password baru</h1>

        <p>Buat password baru untuk akun kamu.</p>
      </div>

      {message && <div className="success">{message}</div>}

      {error && <div className="error">{error}</div>}

      <form onSubmit={updatePassword} className="form">
        <label>Password baru</label>

        <input
          type="password"
          placeholder="Minimal 6 karakter"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <label>Konfirmasi password</label>

        <input
          type="password"
          placeholder="Ulangi password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="primary-btn"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Password"}
        </button>
      </form>
    </AuthLayout>
  );
}

/* =========================================================
   AUTH LAYOUT
========================================================= */

function AuthLayout({ children }) {
  return (
    <div className="app">
      <div className="grid-bg" />

      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <main className="auth-container">
        <div className="auth-card">{children}</div>

        <p className="copyright">
          © {new Date().getFullYear()} DINSTORE
        </p>
      </main>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ session, onLogout }) {
  const user = session?.user;

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <div className="app">
      <div className="grid-bg" />

      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <main className="dashboard">
        <header className="topbar">
          <div className="brand">
            <div className="brand-logo">D</div>

            <div>
              <strong>DINSTORE</strong>
              <small>API Dashboard</small>
            </div>
          </div>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </header>

        <section className="welcome-card">
          <div className="avatar">
            {name.charAt(0).toUpperCase()}
          </div>

          <div>
            <span className="eyebrow">WELCOME</span>

            <h1>Halo, {name} 👋</h1>

            <p>
              Kamu berhasil login ke DINSTORE.
            </p>
          </div>
        </section>

        <section className="info-grid">
          <div className="info-card">
            <span>Status</span>
            <strong className="online">
              ● Online
            </strong>
          </div>

          <div className="info-card">
            <span>Email</span>
            <strong>{user?.email || "-"}</strong>
          </div>

          <div className="info-card">
            <span>Provider</span>
            <strong>
              {user?.app_metadata?.provider || "email"}
            </strong>
          </div>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   GOOGLE ICON
========================================================= */

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
      />

      <path
        fill="#34A853"
        d="M12 21.7c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.7z"
      />

      <path
        fill="#FBBC05"
        d="M6.53 13.79a5.86 5.86 0 0 1 0-3.58V7.68H3.28a9.73 9.73 0 0 0 0 8.64l3.25-2.53z"
      />

      <path
        fill="#EA4335"
        d="M12 6.18c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.3 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.72 5.38l3.25 2.53C7.3 7.9 9.46 6.18 12 6.18z"
      />
    </svg>
  );
}

/* =========================================================
   AUTH ERROR
========================================================= */

function getAuthError(error) {
  if (!error?.message) {
    return "Terjadi kesalahan. Silakan coba lagi.";
  }

  const message = error.message.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "Email atau password salah.";
  }

  if (message.includes("email not confirmed")) {
    return "Email belum dikonfirmasi.";
  }

  if (message.includes("user already registered")) {
    return "Email tersebut sudah terdaftar.";
  }

  if (message.includes("password should be at least")) {
    return "Password terlalu pendek.";
  }

  if (message.includes("provider is not enabled")) {
    return "Login Google belum diaktifkan di Supabase.";
  }

  if (message.includes("redirect")) {
    return "Redirect URL belum diizinkan di Supabase.";
  }

  return error.message;
}
