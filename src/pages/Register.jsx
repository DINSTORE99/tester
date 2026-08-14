import React, {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import { supabase } from "../lib/supabase";

export default function Register() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirm, setConfirm] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function handleRegister(e) {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !name ||
      !email ||
      !password ||
      !confirm
    ) {
      setError(
        "Semua data wajib diisi."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password minimal 6 karakter."
      );
      return;
    }

    if (password !== confirm) {
      setError(
        "Konfirmasi password tidak sama."
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
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(
      "Pendaftaran berhasil. Silakan cek email untuk verifikasi."
    );

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          D
        </div>

        <div className="auth-title">
          <span>DINSTORE</span>
          <small>CREATE ACCOUNT</small>
        </div>

        <h1>
          Buat akun
        </h1>

        <p className="auth-description">
          Daftar untuk mulai menggunakan
          DINSTORE API.
        </p>


        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {success && (
          <div className="success-box">
            {success}
          </div>
        )}


        <form onSubmit={handleRegister}>

          <label>
            Nama
          </label>

          <input
            type="text"
            placeholder="Nama kamu"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />


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
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />


          <label>
            Konfirmasi Password
          </label>

          <input
            type="password"
            placeholder="Ulangi password"
            value={confirm}
            onChange={(e) =>
              setConfirm(e.target.value)
            }
          />


          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "MEMBUAT AKUN..."
              : "DAFTAR"}
          </button>

        </form>


        <p className="auth-bottom">

          Sudah punya akun?

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}
