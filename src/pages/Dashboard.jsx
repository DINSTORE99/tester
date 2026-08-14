import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      if (!supabase) {
        setError("Supabase belum dikonfigurasi.");
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/login", { replace: true });
        return;
      }

      if (!mounted) return;

      setUser(session.user);

      /*
       * Coba mengambil profile.
       *
       * Kalau tabel profiles belum dibuat,
       * dashboard tetap bisa dibuka.
       */

      const { data } = await supabase
        .from("profiles")
        .select(
          "name,email,api_key,status,role,created_at"
        )
        .eq("id", session.user.id)
        .maybeSingle();

      if (mounted && data) {
        setProfile(data);
      }

      setLoading(false);
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function handleLogout() {
    if (!supabase) return;

    await supabase.auth.signOut();

    navigate("/login", {
      replace: true,
    });
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-box">
          <div className="loading-logo">D</div>

          <h2>DINSTORE API</h2>

          <p>
            Memuat dashboard...
          </p>

          <div className="loading-line" />
        </div>
      </div>
    );
  }

  const email =
    profile?.email ||
    user?.email ||
    "-";

  const name =
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "Member";

  const role =
    profile?.role ||
    "member";

  const status =
    profile?.status ||
    "active";

  const apiKey =
    profile?.api_key ||
    "API KEY BELUM TERSEDIA";

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <header className="dashboard-header">

        <Link
          to="/dashboard"
          className="dashboard-brand"
        >
          <div className="dashboard-logo">
            D
          </div>

          <div>
            <strong>
              DINSTORE
            </strong>

            <small>
              API SYSTEM
            </small>
          </div>
        </Link>


        <div className="dashboard-user">

          <div className="avatar">
            {name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="dashboard-user-info">
            <b>{name}</b>
            <span>{email}</span>
          </div>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            LOGOUT
          </button>

        </div>

      </header>


      {/* CONTENT */}

      <main className="dashboard-content">

        <div className="dashboard-welcome">

          <div>

            <small>
              MEMBER DASHBOARD
            </small>

            <h1>
              Selamat datang, {name}.
            </h1>

            <p>
              Kelola akun dan akses
              DINSTORE API kamu di sini.
            </p>

          </div>

          <div className="online-badge">
            <span />
            SYSTEM ONLINE
          </div>

        </div>


        {/* STATISTICS */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <small>
              ACCOUNT
            </small>

            <strong>
              ACTIVE
            </strong>

            <span>
              Akun kamu aktif
            </span>

          </div>


          <div className="stat-card">

            <small>
              ROLE
            </small>

            <strong>
              {role.toUpperCase()}
            </strong>

            <span>
              Member access
            </span>

          </div>


          <div className="stat-card">

            <small>
              API ACCESS
            </small>

            <strong>
              ENABLED
            </strong>

            <span>
              API dapat digunakan
            </span>

          </div>

        </section>


        {/* API KEY */}

        <section className="api-key-card">

          <div className="api-key-header">

            <div>

              <small>
                API ACCESS
              </small>

              <h2>
                API Key
              </h2>

              <p>
                Gunakan API key ini untuk
                autentikasi endpoint member.
              </p>

            </div>

            <div className="key-icon">
              KEY
            </div>

          </div>


          <div className="api-key-box">

            <code>
              {apiKey}
            </code>

            <button
              onClick={() => {
                if (
                  apiKey &&
                  apiKey !==
                    "API KEY BELUM TERSEDIA"
                ) {
                  navigator.clipboard.writeText(
                    apiKey
                  );
                }
              }}
            >
              COPY
            </button>

          </div>


          <div className="api-key-warning">

            <span>
              ●
            </span>

            Jangan bagikan API key kamu
            kepada orang lain.

          </div>

        </section>


        {/* MENU */}

        <section className="dashboard-actions">

          <div className="section-heading">

            <small>
              QUICK ACCESS
            </small>

            <h2>
              Kelola API
            </h2>

          </div>


          <div className="action-grid">

            <Link
              to="/api"
              className="action-card"
            >

              <div className="action-icon">
                API
              </div>

              <div>

                <h3>
                  Connect API
                </h3>

                <p>
                  Hubungkan dan test
                  endpoint DINSTORE API.
                </p>

              </div>

              <span>
                →
              </span>

            </Link>


            <div className="action-card disabled">

              <div className="action-icon">
                DOC
              </div>

              <div>

                <h3>
                  API Documentation
                </h3>

                <p>
                  Dokumentasi endpoint
                  DINSTORE API.
                </p>

              </div>

              <span>
                →
              </span>

            </div>


            <div className="action-card disabled">

              <div className="action-icon">
                KEY
              </div>

              <div>

                <h3>
                  API Key
                </h3>

                <p>
                  Kelola akses API
                  akun kamu.
                </p>

              </div>

              <span>
                →
              </span>

            </div>

          </div>

        </section>


        {/* ACCOUNT */}

        <section className="account-card">

          <div>

            <small>
              ACCOUNT INFORMATION
            </small>

            <h2>
              Informasi Akun
            </h2>

          </div>


          <div className="account-list">

            <div>
              <span>
                Nama
              </span>

              <b>
                {name}
              </b>
            </div>


            <div>
              <span>
                Email
              </span>

              <b>
                {email}
              </b>
            </div>


            <div>
              <span>
                Status
              </span>

              <b className="green-text">
                {status}
              </b>
            </div>


            <div>
              <span>
                Role
              </span>

              <b>
                {role}
              </b>
            </div>


            <div>
              <span>
                User ID
              </span>

              <b className="user-id">
                {user?.id || "-"}
              </b>
            </div>

          </div>

        </section>


        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

      </main>


      {/* FOOTER */}

      <footer className="dashboard-footer">

        <div>
          <strong>
            DINSTORE API
          </strong>

          <span>
            Modern API System
          </span>
        </div>

        <span>
          © {new Date().getFullYear()}
          {" "}
          DINSTORE
        </span>

      </footer>

    </div>
  );
}
