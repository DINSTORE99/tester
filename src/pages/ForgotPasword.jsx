import React, {
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import { supabase } from "../lib/supabase";

export default function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function handleReset(e) {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError(
        "Masukkan email terlebih dahulu."
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
    } =
      await supabase.auth
        .resetPasswordForEmail(
          email,
          {
            redirectTo:
              window.location.origin +
              "/dashboard"
          }
        );

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(
      "Link reset password sudah dikirim ke email kamu."
    );
  }

  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          D
        </div>

        <div className="auth-title">
          <span>DINSTORE</span>
          <small>RESET PASSWORD</small>
        </div>

        <h1>
          Lupa password?
        </h1>

        <p className="auth-description">
          Masukkan email akun kamu
          untuk mendapatkan link reset.
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


        <form onSubmit={handleReset}>

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


          <button
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "MENGIRIM..."
              : "KIRIM LINK RESET"}
          </button>

        </form>


        <p className="auth-bottom">

          <Link to="/login">
            ← Kembali ke Login
          </Link>

        </p>

      </div>

    </div>
  );
}
