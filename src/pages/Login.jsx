import React, {
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import { supabase } from "../lib/supabase";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    if (!supabase) return;

    supabase.auth.getSession()
      .then(({ data }) => {

        if (data.session) {
          navigate(
            "/dashboard",
            { replace: true }
          );
        }

      });

  }, [navigate]);

  async function handleLogin(e) {

    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError(
        "Email dan password wajib diisi."
      );
      return;
    }

    if (!supabase) {
      setError(
        "Supabase belum dikonfigurasi."
      );
      return;
    }

    setLoading(true);

    const {
      error
    } = await supabase.auth
      .signInWithPassword({
        email,
        password
      });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/dashboard");
  }

  async function loginGoogle() {

    setError("");

    if (!supabase) {
      setError(
        "Supabase belum dikonfigurasi."
      );
      return;
    }

    const {
      error
    } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          window.location.origin +
          "/dashboard"
      }
    });

    if (error) {
      setError(error.message);
    }
  }

  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          D
        </div>

        <div className="auth-title">
          <span>DINSTORE</span>
          <small>API SYSTEM</small>
        </div>

        <h1>
          Selamat datang
        </h1>

        <p className="auth-description">
          Login untuk mengakses
          dashboard DINSTORE API.
        </p>


        {error && (
          <div className="error-box">
            {error}
          </div>
        )}


        <button
          className="google-button"
          onClick={loginGoogle}
          type="button"
        >
          <b>G</b>
          Login dengan Google
        </button>


        <div className="divider">
          <span />
          <small>ATAU</small>
          <span />
        </div>


        <form onSubmit={handleLogin}>

          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />


          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />


          <div className="forgot-row">

            <span />

            <Link to="/forgot-password">
              Lupa password?
            </Link>

          </div>


          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "MEMPROSES..."
              : "LOGIN"}
          </button>

        </form>


        <p className="auth-bottom">

          Belum punya akun?

          <Link to="/register">
            Daftar sekarang
          </Link>

        </p>

      </div>

    </div>
  );
}
