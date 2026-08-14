import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { createClient } from "@supabase/supabase-js";

/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

/* =========================================================
   API CONFIG
========================================================= */

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  window.location.origin;

/* =========================================================
   API CATEGORIES
========================================================= */

const API_CATEGORIES = [
  {
    name: "AI",
    icon: "✦",
    color: "green",
    endpoints: [
      {
        name: "AI Aiko",
        method: "GET",
        path: "/api/ai/aiko",
        description: "AI chat assistant.",
        params: [
          {
            name: "q",
            label: "Prompt",
            placeholder: "Halo",
            required: true,
          },
          {
            name: "reset",
            label: "Reset",
            placeholder: "false",
            required: false,
          },
        ],
      },
      {
        name: "ChatGPT",
        method: "GET",
        path: "/api/ai/chatgpt",
        description: "AI chat menggunakan endpoint ChatGPT.",
        params: [
          {
            name: "q",
            label: "Question",
            placeholder: "Jelaskan tentang JavaScript",
            required: true,
          },
        ],
      },
      {
        name: "AI Lyrics Generator",
        method: "GET",
        path: "/api/ai/lyricsgen",
        description: "Generate lyrics menggunakan AI.",
        params: [
          {
            name: "theme",
            label: "Theme",
            placeholder: "persahabatan",
            required: true,
          },
          {
            name: "genre",
            label: "Genre",
            placeholder: "pop",
            required: false,
          },
          {
            name: "emotion",
            label: "Emotion",
            placeholder: "happy",
            required: false,
          },
          {
            name: "lang",
            label: "Language",
            placeholder: "Indonesia",
            required: false,
          },
        ],
      },
      {
        name: "AI Coder",
        method: "GET",
        path: "/api/tools/aicoder",
        description: "Generate kode menggunakan AI.",
        params: [
          {
            name: "prompt",
            label: "Prompt",
            placeholder: "buat landing page modern",
            required: true,
          },
        ],
      },
      {
        name: "AI4Chat",
        method: "GET",
        path: "/api/ai/ai4chat",
        description: "AI chat generation.",
        params: [
          {
            name: "q",
            label: "Question",
            placeholder: "Halo",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "ADMIN",
    icon: "◇",
    color: "red",
    endpoints: [
      {
        name: "Admin Status",
        method: "GET",
        path: "/api/admin/status",
        description: "Check admin status.",
        params: [],
      },
      {
        name: "Admin Info",
        method: "GET",
        path: "/api/admin/info",
        description: "Get admin information.",
        params: [],
      },
      {
        name: "Server Status",
        method: "GET",
        path: "/api/admin/server",
        description: "Check server information.",
        params: [],
      },
    ],
  },

  {
    name: "CACHE",
    icon: "▣",
    color: "cyan",
    endpoints: [
      {
        name: "Cache Get",
        method: "GET",
        path: "/api/cache/get",
        description: "Get cached data.",
        params: [
          {
            name: "key",
            label: "Key",
            placeholder: "example",
            required: true,
          },
        ],
      },
      {
        name: "Cache Clear",
        method: "GET",
        path: "/api/cache/clear",
        description: "Clear cache.",
        params: [],
      },
    ],
  },

  {
    name: "DOWNLOAD",
    icon: "⇩",
    color: "blue",
    endpoints: [
      {
        name: "TikTok Downloader",
        method: "GET",
        path: "/api/download/tiktok",
        description: "Download video TikTok.",
        params: [
          {
            name: "url",
            label: "URL",
            placeholder: "https://vt.tiktok.com/...",
            required: true,
          },
        ],
      },
      {
        name: "Instagram Downloader",
        method: "GET",
        path: "/api/download/instagram",
        description: "Download media Instagram.",
        params: [
          {
            name: "url",
            label: "URL",
            placeholder: "https://instagram.com/...",
            required: true,
          },
        ],
      },
      {
        name: "CapCut Downloader",
        method: "GET",
        path: "/api/download/capcut",
        description: "Download CapCut.",
        params: [
          {
            name: "url",
            label: "URL",
            placeholder: "https://www.capcut.com/...",
            required: true,
          },
        ],
      },
      {
        name: "Facebook Downloader",
        method: "GET",
        path: "/api/download/facebook",
        description: "Download Facebook media.",
        params: [
          {
            name: "url",
            label: "URL",
            placeholder: "https://facebook.com/...",
            required: true,
          },
        ],
      },
      {
        name: "MediaFire Downloader",
        method: "GET",
        path: "/api/download/mediafire",
        description: "Download MediaFire.",
        params: [
          {
            name: "url",
            label: "URL",
            placeholder: "https://mediafire.com/...",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "FUN",
    icon: "♣",
    color: "pink",
    endpoints: [
      {
        name: "Random Joke",
        method: "GET",
        path: "/api/fun/joke",
        description: "Generate random joke.",
        params: [],
      },
      {
        name: "Truth",
        method: "GET",
        path: "/api/fun/truth",
        description: "Random truth question.",
        params: [],
      },
      {
        name: "Dare",
        method: "GET",
        path: "/api/fun/dare",
        description: "Random dare.",
        params: [],
      },
      {
        name: "Quotes",
        method: "GET",
        path: "/api/fun/quotes",
        description: "Random quotes.",
        params: [],
      },
    ],
  },

  {
    name: "LEADERBOARD",
    icon: "♛",
    color: "gold",
    endpoints: [
      {
        name: "Leaderboard",
        method: "GET",
        path: "/api/leaderboard",
        description: "Get leaderboard data.",
        params: [],
      },
    ],
  },

  {
    name: "LIBRARY",
    icon: "▤",
    color: "orange",
    endpoints: [
      {
        name: "Library List",
        method: "GET",
        path: "/api/library",
        description: "Get library information.",
        params: [],
      },
      {
        name: "Library Search",
        method: "GET",
        path: "/api/library/search",
        description: "Search library.",
        params: [
          {
            name: "q",
            label: "Search",
            placeholder: "keyword",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "MAKER",
    icon: "✣",
    color: "pink",
    endpoints: [
      {
        name: "Text Maker",
        method: "GET",
        path: "/api/maker/text",
        description: "Create styled text.",
        params: [
          {
            name: "text",
            label: "Text",
            placeholder: "Hello",
            required: true,
          },
        ],
      },
      {
        name: "Sticker Maker",
        method: "GET",
        path: "/api/maker/sticker",
        description: "Create sticker.",
        params: [
          {
            name: "url",
            label: "Image URL",
            placeholder: "https://...",
            required: true,
          },
        ],
      },
      {
        name: "Logo Maker",
        method: "GET",
        path: "/api/maker/logo",
        description: "Generate logo.",
        params: [
          {
            name: "text",
            label: "Text",
            placeholder: "DIN",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "NEWS",
    icon: "▥",
    color: "cyan",
    endpoints: [
      {
        name: "Latest News",
        method: "GET",
        path: "/api/news/latest",
        description: "Get latest news.",
        params: [],
      },
      {
        name: "Search News",
        method: "GET",
        path: "/api/news/search",
        description: "Search news.",
        params: [
          {
            name: "q",
            label: "Keyword",
            placeholder: "teknologi",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "RANDOM",
    icon: "◆",
    color: "purple",
    endpoints: [
      {
        name: "Random Image",
        method: "GET",
        path: "/api/random/image",
        description: "Get random image.",
        params: [],
      },
      {
        name: "Random Number",
        method: "GET",
        path: "/api/random/number",
        description: "Generate random number.",
        params: [
          {
            name: "min",
            label: "Minimum",
            placeholder: "1",
            required: false,
          },
          {
            name: "max",
            label: "Maximum",
            placeholder: "100",
            required: false,
          },
        ],
      },
    ],
  },

  {
    name: "SEARCH",
    icon: "⌕",
    color: "green",
    endpoints: [
      {
        name: "Web Search",
        method: "GET",
        path: "/api/search/web",
        description: "Search information from web.",
        params: [
          {
            name: "q",
            label: "Query",
            placeholder: "OpenAI",
            required: true,
          },
        ],
      },
      {
        name: "Image Search",
        method: "GET",
        path: "/api/search/image",
        description: "Search images.",
        params: [
          {
            name: "q",
            label: "Query",
            placeholder: "robot",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "STALK",
    icon: "◉",
    color: "purple",
    endpoints: [
      {
        name: "TikTok Stalk",
        method: "GET",
        path: "/api/stalk/tiktok",
        description: "Get public TikTok profile information.",
        params: [
          {
            name: "username",
            label: "Username",
            placeholder: "username",
            required: true,
          },
        ],
      },
      {
        name: "Instagram Stalk",
        method: "GET",
        path: "/api/stalk/instagram",
        description: "Get public Instagram profile information.",
        params: [
          {
            name: "username",
            label: "Username",
            placeholder: "username",
            required: true,
          },
        ],
      },
    ],
  },

  {
    name: "TOOLS",
    icon: "⌘",
    color: "orange",
    endpoints: [
      {
        name: "Domain Info",
        method: "GET",
        path: "/api/tools/domaininfo",
        description: "Check domain information.",
        params: [
          {
            name: "domain",
            label: "Domain",
            placeholder: "example.com",
            required: true,
          },
        ],
      },
      {
        name: "QR Generator",
        method: "GET",
        path: "/api/tools/qr",
        description: "Generate QR code.",
        params: [
          {
            name: "text",
            label: "Text",
            placeholder: "Hello World",
            required: true,
          },
        ],
      },
      {
        name: "Short URL",
        method: "GET",
        path: "/api/tools/shorturl",
        description: "Shorten URL.",
        params: [
          {
            name: "url",
            label: "URL",
            placeholder: "https://example.com",
            required: true,
          },
        ],
      },
    ],
  },
];

/* =========================================================
   ROBOT
========================================================= */

function RobotIcon() {
  return (
    <div className="robot-icon">
      <span className="robot-eye left" />
      <span className="robot-eye right" />
      <span className="robot-mouth" />
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [apiKey, setApiKey] = useState(null);

  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetSent, setResetSent] = useState(false);

  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState("dashboard");

  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState("AI");

  const [openEndpoint, setOpenEndpoint] = useState(null);
  const [params, setParams] = useState({});
  const [responses, setResponses] = useState({});
  const [requestLoading, setRequestLoading] = useState({});

  const [members, setMembers] = useState([]);
  const [memberLoading, setMemberLoading] = useState(false);

  const totalEndpoints = API_CATEGORIES.reduce(
    (total, category) => total + category.endpoints.length,
    0
  );

  /* =======================================================
     INITIAL SESSION
  ======================================================= */

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(currentSession);

      if (currentSession?.user) {
        await loadUserData(currentSession.user);
      }

      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);

        if (newSession?.user) {
          await loadUserData(newSession.user);
        } else {
          setProfile(null);
          setApiKey(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* =======================================================
     LOAD PROFILE + KEY
  ======================================================= */

  async function loadUserData(user) {
    if (!supabase || !user) return;

    try {
      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

      if (profileError) {
        console.error(profileError);
      }

      let currentProfile = profileData;

      /*
       * Jika user sudah ada tetapi profile belum dibuat,
       * buat profile dari frontend.
       *
       * API key akan dibuat jika policy/trigger database
       * sudah aktif.
       */
      if (!currentProfile) {
        const { data: createdProfile } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            role: "member",
            status: "active",
            daily_limit: 100,
            requests_today: 0,
          })
          .select()
          .single();

        currentProfile = createdProfile;
      }

      setProfile(currentProfile);

      const { data: keyData, error: keyError } =
        await supabase
          .from("api_keys")
          .select("*")
          .eq("user_id", user.id)
          .eq("active", true)
          .maybeSingle();

      if (keyError) {
        console.error(keyError);
      }

      setApiKey(keyData || null);

      if (
        currentProfile?.role === "admin" &&
        page === "dashboard"
      ) {
        setPage("dashboard");
      }
    } catch (error) {
      console.error("LOAD USER ERROR:", error);
    }
  }

  /* =======================================================
     AUTH
  ======================================================= */

  function clearAuthMessages() {
    setAuthError("");
    setAuthMessage("");
  }

  async function handleLogin(e) {
    e.preventDefault();

    clearAuthMessages();

    if (!supabase) {
      setAuthError(
        "Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY."
      );
      return;
    }

    if (!email || !password) {
      setAuthError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return;
    }

    setAuthMessage("Login berhasil.");

    setPassword("");

    setLoading(false);
  }

  async function handleRegister(e) {
    e.preventDefault();

    clearAuthMessages();

    if (!supabase) {
      setAuthError(
        "Supabase belum dikonfigurasi."
      );
      return;
    }

    if (!email || !password) {
      setAuthError("Email dan password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setAuthError(
        "Password minimal 6 karakter."
      );
      return;
    }

    if (password !== confirmPassword) {
      setAuthError(
        "Konfirmasi password tidak sama."
      );
      return;
    }

    setLoading(true);

    const { data, error } =
      await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return;
    }

    setPassword("");
    setConfirmPassword("");

    if (data.session) {
      setAuthMessage("Register berhasil.");
    } else {
      setAuthMessage(
        "Register berhasil. Silakan cek email untuk verifikasi akun."
      );
    }

    setLoading(false);
  }

  async function handleGoogleLogin() {
    clearAuthMessages();

    if (!supabase) {
      setAuthError(
        "Supabase belum dikonfigurasi."
      );
      return;
    }

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

    if (error) {
      setAuthError(error.message);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();

    clearAuthMessages();

    if (!supabase) {
      setAuthError(
        "Supabase belum dikonfigurasi."
      );
      return;
    }

    if (!email) {
      setAuthError("Masukkan email terlebih dahulu.");
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo:
            `${window.location.origin}/`,
        }
      );

    if (error) {
      setAuthError(error.message);
    } else {
      setResetSent(true);
      setAuthMessage(
        "Link reset password sudah dikirim ke email."
      );
    }

    setLoading(false);
  }

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setSession(null);
    setProfile(null);
    setApiKey(null);
    setMembers([]);
    setPage("dashboard");
  }

  /* =======================================================
     COPY API KEY
  ======================================================= */

  async function copyApiKey() {
    if (!apiKey?.api_key) return;

    try {
      await navigator.clipboard.writeText(
        apiKey.api_key
      );

      alert("API Key berhasil disalin.");
    } catch {
      alert("Gagal menyalin API Key.");
    }
  }

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredCategories = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return API_CATEGORIES;
    }

    return API_CATEGORIES
      .map((category) => {
        const categoryMatch =
          category.name
            .toLowerCase()
            .includes(keyword);

        const endpoints =
          category.endpoints.filter(
            (endpoint) =>
              endpoint.name
                .toLowerCase()
                .includes(keyword) ||
              endpoint.path
                .toLowerCase()
                .includes(keyword) ||
              endpoint.description
                .toLowerCase()
                .includes(keyword)
          );

        if (categoryMatch) {
          return category;
        }

        if (endpoints.length) {
          return {
            ...category,
            endpoints,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [search]);

  /* =======================================================
     API TESTER
  ======================================================= */

  function toggleEndpoint(
    categoryName,
    endpoint
  ) {
    const key =
      `${categoryName}:${endpoint.name}`;

    if (openEndpoint === key) {
      setOpenEndpoint(null);
      return;
    }

    setOpenEndpoint(key);

    const initial = {};

    endpoint.params.forEach((param) => {
      initial[param.name] = "";
    });

    setParams((old) => ({
      ...old,
      [key]: initial,
    }));
  }

  function updateParam(
    endpointKey,
    paramName,
    value
  ) {
    setParams((old) => ({
      ...old,
      [endpointKey]: {
        ...(old[endpointKey] || {}),
        [paramName]: value,
      },
    }));
  }

  async function executeEndpoint(
    category,
    endpoint
  ) {
    const endpointKey =
      `${category.name}:${endpoint.name}`;

    const values =
      params[endpointKey] || {};

    for (const param of endpoint.params) {
      if (
        param.required &&
        !String(values[param.name] || "").trim()
      ) {
        setResponses((old) => ({
          ...old,
          [endpointKey]: {
            success: false,
            error:
              `Parameter "${param.name}" wajib diisi.`,
          },
        }));

        return;
      }
    }

    setRequestLoading((old) => ({
      ...old,
      [endpointKey]: true,
    }));

    try {
      const query = new URLSearchParams();

      Object.entries(values).forEach(
        ([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
          ) {
            query.set(key, value);
          }
        }
      );

      /*
       * API key otomatis ikut dikirim.
       */
      if (apiKey?.api_key) {
        query.set(
          "apikey",
          apiKey.api_key
        );
      }

      const url =
        `${API_BASE}${endpoint.path}` +
        (query.toString()
          ? `?${query.toString()}`
          : "");

      const response =
        await fetch(url, {
          method: endpoint.method || "GET",
          headers: {
            "x-api-key":
              apiKey?.api_key || "",
            Accept:
              "application/json",
          },
        });

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      let result;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      setResponses((old) => ({
        ...old,
        [endpointKey]: {
          http_status: response.status,
          success: response.ok,
          data: result,
        },
      }));

      /*
       * Refresh data member setelah request.
       */
      if (session?.user) {
        await loadUserData(session.user);
      }
    } catch (error) {
      setResponses((old) => ({
        ...old,
        [endpointKey]: {
          success: false,
          error: error.message,
        },
      }));
    } finally {
      setRequestLoading((old) => ({
        ...old,
        [endpointKey]: false,
      }));
    }
  }

  /* =======================================================
     ADMIN
  ======================================================= */

  async function loadMembers() {
    if (!supabase) return;

    if (profile?.role !== "admin") {
      return;
    }

    setMemberLoading(true);

    const { data, error } =
      await supabase
        .from("profiles")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (!error) {
      setMembers(data || []);
    } else {
      console.error(error);
    }

    setMemberLoading(false);
  }

  async function changeMemberLimit(
    memberId,
    value
  ) {
    if (!supabase) return;

    const limit =
      Number(value);

    if (
      !Number.isFinite(limit) ||
      limit < 0
    ) {
      return;
    }

    const { error } =
      await supabase
        .from("profiles")
        .update({
          daily_limit: limit,
          updated_at: new Date().toISOString(),
        })
        .eq("id", memberId);

    if (error) {
      alert(error.message);
      return;
    }

    await loadMembers();
  }

  async function changeMemberStatus(
    memberId,
    status
  ) {
    if (!supabase) return;

    const { error } =
      await supabase
        .from("profiles")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", memberId);

    if (error) {
      alert(error.message);
      return;
    }

    await loadMembers();
  }

  async function resetMemberRequests(
    memberId
  ) {
    if (!supabase) return;

    const { error } =
      await supabase
        .from("profiles")
        .update({
          requests_today: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", memberId);

    if (error) {
      alert(error.message);
      return;
    }

    await loadMembers();
  }

  useEffect(() => {
    if (
      page === "admin" &&
      profile?.role === "admin"
    ) {
      loadMembers();
    }
  }, [page, profile?.role]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading && !session) {
    return (
      <div className="app">
        <div className="auth-screen">
          <div className="auth-card loading-card">
            <RobotIcon />

            <h1>DIN API</h1>

            <p>
              SYSTEM INITIALIZING...
            </p>

            <div className="loading-line">
              <span />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     CONFIG ERROR
  ======================================================= */

  if (!supabase) {
    return (
      <div className="app">
        <div className="auth-screen">
          <div className="auth-card">
            <RobotIcon />

            <div className="auth-brand">
              <small>DIN API</small>
              <h1>CONFIG ERROR</h1>
            </div>

            <div className="auth-alert error">
              Supabase belum dikonfigurasi.
              Tambahkan:
              <br />
              <br />
              <code>
                VITE_SUPABASE_URL
              </code>
              <br />
              <code>
                VITE_SUPABASE_ANON_KEY
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     AUTH SCREEN
  ======================================================= */

  if (!session) {
    return (
      <div className="app">
        <div className="background-grid" />
        <div className="scanlines" />

        <div className="auth-screen">

          <div className="auth-decoration">
            <div className="auth-orbit" />
          </div>

          <div className="auth-card">

            <div className="auth-logo">
              <RobotIcon />
            </div>

            <div className="auth-brand">
              <small>ROBOT API SYSTEM</small>

              <h1>DIN API</h1>

              <span>
                SECURE DEVELOPER PLATFORM
              </span>
            </div>

            {authMode !== "reset" && (
              <div className="auth-tabs">
                <button
                  className={
                    authMode === "login"
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    clearAuthMessages();
                    setAuthMode("login");
                  }}
                >
                  LOGIN
                </button>

                <button
                  className={
                    authMode === "register"
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    clearAuthMessages();
                    setAuthMode("register");
                  }}
                >
                  DAFTAR
                </button>
              </div>
            )}

            {authMode === "reset" ? (
              <form
                className="auth-form"
                onSubmit={
                  handleResetPassword
                }
              >
                <div className="auth-heading">
                  <h2>LUPA PASSWORD</h2>

                  <p>
                    Masukkan email untuk
                    menerima link reset password.
                  </p>
                </div>

                <label>
                  EMAIL

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="nama@email.com"
                    autoComplete="email"
                  />
                </label>

                {authError && (
                  <div className="auth-alert error">
                    {authError}
                  </div>
                )}

                {authMessage && (
                  <div className="auth-alert success">
                    {authMessage}
                  </div>
                )}

                <button
                  className="auth-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "PROCESSING..."
                    : "KIRIM LINK RESET"}
                </button>

                <button
                  type="button"
                  className="auth-link-button"
                  onClick={() => {
                    clearAuthMessages();
                    setResetSent(false);
                    setAuthMode("login");
                  }}
                >
                  ← Kembali ke Login
                </button>
              </form>
            ) : (
              <form
                className="auth-form"
                onSubmit={
                  authMode === "login"
                    ? handleLogin
                    : handleRegister
                }
              >
                <div className="auth-heading">
                  <h2>
                    {authMode === "login"
                      ? "SELAMAT DATANG"
                      : "BUAT AKUN"}
                  </h2>

                  <p>
                    {authMode === "login"
                      ? "Login untuk mengakses DIN API."
                      : "Daftar untuk mendapatkan API Key otomatis."}
                  </p>
                </div>

                <label>
                  EMAIL

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="nama@email.com"
                    autoComplete="email"
                  />
                </label>

                <label>
                  PASSWORD

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    autoComplete={
                      authMode === "login"
                        ? "current-password"
                        : "new-password"
                    }
                  />
                </label>

                {authMode === "register" && (
                  <label>
                    KONFIRMASI PASSWORD

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </label>
                )}

                {authError && (
                  <div className="auth-alert error">
                    {authError}
                  </div>
                )}

                {authMessage && (
                  <div className="auth-alert success">
                    {authMessage}
                  </div>
                )}

                <button
                  className="auth-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "PROCESSING..."
                    : authMode === "login"
                    ? "LOGIN"
                    : "BUAT AKUN"}
                </button>

                <div className="auth-divider">
                  <span>ATAU</span>
                </div>

                <button
                  type="button"
                  className="google-button"
                  onClick={
                    handleGoogleLogin
                  }
                >
                  <span className="google-icon">
                    G
                  </span>

                  Lanjutkan dengan Google
                </button>

                {authMode === "login" && (
                  <button
                    type="button"
                    className="forgot-button"
                    onClick={() => {
                      clearAuthMessages();
                      setAuthMode("reset");
                    }}
                  >
                    Lupa Password?
                  </button>
                )}
              </form>
            )}

            <div className="auth-footer">
              DIN API • SECURE ACCESS
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     DASHBOARD DATA
  ======================================================= */

  const requestUsed =
    Number(profile?.requests_today || 0);

  const dailyLimit =
    Number(profile?.daily_limit || 0);

  const remaining =
    Math.max(
      dailyLimit - requestUsed,
      0
    );

  const usagePercent =
    dailyLimit > 0
      ? Math.min(
          (requestUsed / dailyLimit) * 100,
          100
        )
      : 0;

  /* =======================================================
     MAIN APP
  ======================================================= */

  return (
    <div className="app">

      <div className="background-grid" />
      <div className="scanlines" />

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="header">

        <div className="header-left">

          <button
            className={`menu-button ${
              menuOpen ? "active" : ""
            }`}
            onClick={() =>
              setMenuOpen(true)
            }
          >
            <span />
            <span />
            <span />
          </button>

          <div className="header-brand">
            <RobotIcon />

            <div>
              <strong>
                DIN API🔥
              </strong>

              <small>
                ROBOT SYSTEM
              </small>
            </div>
          </div>

        </div>

        <div className="header-right">

          <div className="connection">
            <span />
            ONLINE
          </div>

          <div className="version">
            {profile?.role === "admin"
              ? "ADMIN"
              : "MEMBER"}
          </div>

        </div>

      </header>

      {/* =====================================================
          OVERLAY
      ===================================================== */}

      <div
        className={`nav-overlay ${
          menuOpen ? "show" : ""
        }`}
        onClick={() =>
          setMenuOpen(false)
        }
      />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`side-nav ${
          menuOpen ? "open" : ""
        }`}
      >

        <div className="side-top">

          <div>
            <small>
              NAVIGATION
            </small>

            <h2>
              DIN API🔥
            </h2>
          </div>

          <button
            className="close-button"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            ×
          </button>

        </div>

        <div className="side-line" />

        <nav className="nav-list">

          <button
            className={`nav-item ${
              page === "dashboard"
                ? "home"
                : ""
            }`}
            onClick={() => {
              setPage("dashboard");
              setMenuOpen(false);
            }}
          >
            <span className="nav-icon">
              ⌂
            </span>

            <b>
              DASHBOARD
            </b>

            <small>
              00
            </small>
          </button>

          <button
            className={`nav-item ${
              page === "docs"
                ? "home"
                : ""
            }`}
            onClick={() => {
              setPage("docs");
              setMenuOpen(false);
            }}
          >
            <span className="nav-icon green">
              ◈
            </span>

            <b>
              API DOCS
            </b>

            <small>
              01
            </small>
          </button>

          <button
            className={`nav-item ${
              page === "apikey"
                ? "home"
                : ""
            }`}
            onClick={() => {
              setPage("apikey");
              setMenuOpen(false);
            }}
          >
            <span className="nav-icon cyan">
              🔑
            </span>

            <b>
              API KEY
            </b>

            <small>
              02
            </small>
          </button>

          <button
            className={`nav-item ${
              page === "profile"
                ? "home"
                : ""
            }`}
            onClick={() => {
              setPage("profile");
              setMenuOpen(false);
            }}
          >
            <span className="nav-icon blue">
              ◉
            </span>

            <b>
              PROFILE
            </b>

            <small>
              03
            </small>
          </button>

          {profile?.role === "admin" && (
            <button
              className={`nav-item ${
                page === "admin"
                  ? "home"
                  : ""
              }`}
              onClick={() => {
                setPage("admin");
                setMenuOpen(false);
              }}
            >
              <span className="nav-icon red">
                ◇
              </span>

              <b>
                ADMIN PANEL
              </b>

              <small>
                AD
              </small>
            </button>
          )}

          <button
            className="nav-item"
            onClick={handleLogout}
          >
            <span className="nav-icon red">
              ↪
            </span>

            <b>
              LOGOUT
            </b>

            <small>
              EX
            </small>
          </button>

        </nav>

        <div className="side-footer">
          <span>
            SYSTEM STATUS
          </span>

          <strong>
            ● OPERATIONAL
          </strong>
        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main">

        {/* ===================================================
            DASHBOARD
        =================================================== */}

        {page === "dashboard" && (
          <>
            <section className="hero">

              <div className="hero-robot-decoration">
                <div className="robot-head">
                  <div className="robot-eye left" />
                  <div className="robot-eye right" />
                  <div className="robot-mouth" />
                </div>
              </div>

              <div className="hero-content">

                <div className="terminal">
                  <span className="terminal-light" />

                  TERMINAL ACTIVE

                  <span className="terminal-lines">
                    /// SYSTEM READY
                  </span>
                </div>

                <div className="hero-title">
                  <h1>
                    DASHBOARD
                  </h1>

                  <span>
                    v1.0.0
                  </span>
                </div>

                <p>
                  Welcome back to DIN API.
                  Manage your API access,
                  requests, and developer
                  tools from one place.
                </p>

                <div className="hero-system">

                  <div className="system-item">
                    <span>
                      ROLE
                    </span>

                    <strong>
                      {(
                        profile?.role ||
                        "MEMBER"
                      ).toUpperCase()}
                    </strong>
                  </div>

                  <div className="system-item active">
                    <span>
                      REQUESTS
                    </span>

                    <strong>
                      {requestUsed}
                    </strong>
                  </div>

                  <div className="system-item">
                    <span>
                      REMAINING
                    </span>

                    <strong>
                      {remaining}
                    </strong>
                  </div>

                </div>

              </div>
            </section>

            {/* STATS */}

            <section className="dashboard-grid">

              <div className="dashboard-card">
                <div className="dashboard-card-icon">
                  🔑
                </div>

                <div>
                  <small>
                    API KEY
                  </small>

                  <strong>
                    {apiKey
                      ? "ACTIVE"
                      : "NOT FOUND"}
                  </strong>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-icon">
                  ⚡
                </div>

                <div>
                  <small>
                    DAILY LIMIT
                  </small>

                  <strong>
                    {dailyLimit}
                  </strong>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-icon">
                  ◉
                </div>

                <div>
                  <small>
                    STATUS
                  </small>

                  <strong>
                    {(
                      profile?.status ||
                      "active"
                    ).toUpperCase()}
                  </strong>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-icon">
                  ✦
                </div>

                <div>
                  <small>
                    ENDPOINTS
                  </small>

                  <strong>
                    {totalEndpoints}
                  </strong>
                </div>
              </div>

            </section>

            {/* USAGE */}

            <section className="content-card">

              <div className="section-title">
                <div>
                  <span className="eyebrow">
                    SYSTEM
                  </span>

                  <h2>
                    REQUEST USAGE
                  </h2>
                </div>

                <span className="section-status">
                  {requestUsed} / {dailyLimit}
                </span>
              </div>

              <div className="usage-bar">
                <div
                  style={{
                    width:
                      `${usagePercent}%`,
                  }}
                />
              </div>

              <div className="usage-info">
                <span>
                  TODAY
                </span>

                <strong>
                  {requestUsed} REQUEST
                </strong>

                <span>
                  REMAINING
                </span>

                <strong>
                  {remaining}
                </strong>
              </div>

            </section>

            {/* API KEY */}

            <section className="key-card">

              <div className="key-header">
                <div>
                  <span className="eyebrow">
                    AUTHENTICATION
                  </span>

                  <h2>
                    YOUR API KEY
                  </h2>
                </div>

                <span className="key-status">
                  ● ACTIVE
                </span>
              </div>

              <div className="key-box">
                <code>
                  {apiKey?.api_key ||
                    "API KEY BELUM TERSEDIA"}
                </code>

                <button
                  onClick={copyApiKey}
                  disabled={!apiKey}
                >
                  COPY
                </button>
              </div>

              <p>
                API key ini otomatis terhubung
                dengan akun kamu dan digunakan
                ketika mengakses endpoint DIN API.
              </p>

            </section>
          </>
        )}

        {/* ===================================================
            API KEY PAGE
        =================================================== */}

        {page === "apikey" && (
          <section className="page-card">

            <div className="page-heading">
              <span className="eyebrow">
                AUTHENTICATION
              </span>

              <h1>
                API KEY
              </h1>

              <p>
                Gunakan API key berikut untuk
                mengakses layanan DIN API.
              </p>
            </div>

            <div className="key-card">

              <div className="key-header">
                <div>
                  <span className="eyebrow">
                    DEFAULT KEY
                  </span>

                  <h2>
                    DIN API KEY
                  </h2>
                </div>

                <span className="key-status">
                  {apiKey?.active
                    ? "● ACTIVE"
                    : "● INACTIVE"}
                </span>
              </div>

              <div className="key-box">
                <code>
                  {apiKey?.api_key ||
                    "API KEY BELUM TERSEDIA"}
                </code>

                <button
                  onClick={copyApiKey}
                  disabled={!apiKey}
                >
                  COPY
                </button>
              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            PROFILE
        =================================================== */}

        {page === "profile" && (
          <section className="page-card">

            <div className="page-heading">
              <span className="eyebrow">
                ACCOUNT
              </span>

              <h1>
                PROFILE
              </h1>

              <p>
                Informasi akun DIN API kamu.
              </p>
            </div>

            <div className="profile-grid">

              <div className="profile-item">
                <small>
                  EMAIL
                </small>

                <strong>
                  {profile?.email ||
                    session.user.email}
                </strong>
              </div>

              <div className="profile-item">
                <small>
                  USER ID
                </small>

                <strong>
                  {session.user.id}
                </strong>
              </div>

              <div className="profile-item">
                <small>
                  ROLE
                </small>

                <strong>
                  {(
                    profile?.role ||
                    "member"
                  ).toUpperCase()}
                </strong>
              </div>

              <div className="profile-item">
                <small>
                  STATUS
                </small>

                <strong>
                  {(
                    profile?.status ||
                    "active"
                  ).toUpperCase()}
                </strong>
              </div>

              <div className="profile-item">
                <small>
                  DAILY LIMIT
                </small>

                <strong>
                  {profile?.daily_limit ||
                    0}
                </strong>
              </div>

              <div className="profile-item">
                <small>
                  REQUESTS TODAY
                </small>

                <strong>
                  {profile?.requests_today ||
                    0}
                </strong>
              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            DOCS
        =================================================== */}

        {page === "docs" && (
          <>
            <section className="hero docs-hero">

              <div className="hero-content">

                <div className="terminal">
                  <span className="terminal-light" />

                  TERMINAL ACTIVE
                </div>

                <div className="hero-title">
                  <h1>
                    DOCS
                  </h1>

                  <span>
                    v3.0.0
                  </span>
                </div>

                <p>
                  A comprehensive API
                  documentation for modern
                  applications.
                </p>

                <div className="hero-system">

                  <div className="system-item">
                    <span>
                      CATEGORIES
                    </span>

                    <strong>
                      {API_CATEGORIES.length}
                    </strong>
                  </div>

                  <div className="system-item active">
                    <span>
                      ENDPOINTS
                    </span>

                    <strong>
                      {totalEndpoints}
                    </strong>
                  </div>

                </div>

              </div>

            </section>

            <div className="search-box">
              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search endpoint, category, or path..."
              />
            </div>

            <section className="categories">

              {filteredCategories.map(
                (category) => {

                  const categoryOpen =
                    openCategory ===
                    category.name;

                  return (
                    <div
                      className={`category-card ${category.color}`}
                      id={`category-${category.name.toLowerCase()}`}
                      key={category.name}
                    >

                      <div
                        className="category-header"
                        onClick={() =>
                          setOpenCategory(
                            categoryOpen
                              ? ""
                              : category.name
                          )
                        }
                      >

                        <div className="category-icon">
                          {category.icon}
                        </div>

                        <div className="category-info">

                          <small>
                            CATEGORY
                          </small>

                          <h2>
                            {category.name}
                          </h2>

                          <span>
                            {
                              category.endpoints
                                .length
                            }{" "}
                            ENDPOINTS
                          </span>

                        </div>

                        <div className="category-action">

                          <span>
                            {categoryOpen
                              ? "CLOSE"
                              : "OPEN"}
                          </span>

                          <button
                            type="button"
                          >
                            {categoryOpen
                              ? "−"
                              : "+"}
                          </button>

                        </div>

                      </div>

                      {categoryOpen && (
                        <>
                          <div className="category-path">
                            /api/
                            {category.name.toLowerCase()}
                          </div>

                          <div className="endpoint-list">

                            {category.endpoints.map(
                              (endpoint) => {

                                const endpointKey =
                                  `${category.name}:${endpoint.name}`;

                                const isOpen =
                                  openEndpoint ===
                                  endpointKey;

                                const response =
                                  responses[
                                    endpointKey
                                  ];

                                const isRequesting =
                                  requestLoading[
                                    endpointKey
                                  ];

                                return (
                                  <div
                                    className="endpoint-item"
                                    key={
                                      endpoint.name
                                    }
                                  >

                                    <div
                                      className="endpoint-row"
                                      onClick={() =>
                                        toggleEndpoint(
                                          category.name,
                                          endpoint
                                        )
                                      }
                                    >

                                      <span className="method-badge">
                                        {
                                          endpoint.method
                                        }
                                      </span>

                                      <div className="endpoint-name">

                                        <strong>
                                          {
                                            endpoint.name
                                          }
                                        </strong>

                                        <small>
                                          {
                                            endpoint.path
                                          }
                                        </small>

                                      </div>

                                      <span className="endpoint-open">
                                        {isOpen
                                          ? "−"
                                          : "+"}
                                      </span>

                                    </div>

                                    {isOpen && (
                                      <div className="endpoint-details">

                                        <div className="endpoint-description">
                                          {
                                            endpoint.description
                                          }
                                        </div>

                                        {endpoint.params.length >
                                          0 && (
                                          <>
                                            <div className="params-title">
                                              PARAMETERS
                                            </div>

                                            <div className="param-list">

                                              {endpoint.params.map(
                                                (param) => (
                                                  <div
                                                    className="param-item"
                                                    key={
                                                      param.name
                                                    }
                                                  >

                                                    <div className="param-top">

                                                      <span className="param-name">
                                                        {
                                                          param.name
                                                        }
                                                      </span>

                                                      {param.required && (
                                                        <span className="required">
                                                          REQUIRED
                                                        </span>
                                                      )}

                                                    </div>

                                                    <input
                                                      value={
                                                        params[
                                                          endpointKey
                                                        ]?.[
                                                          param.name
                                                        ] || ""
                                                      }
                                                      onChange={(
                                                        e
                                                      ) =>
                                                        updateParam(
                                                          endpointKey,
                                                          param.name,
                                                          e.target.value
                                                        )
                                                      }
                                                      placeholder={
                                                        param.placeholder
                                                      }
                                                    />

                                                  </div>
                                                )
                                              )}

                                            </div>
                                          </>
                                        )}

                                        <div className="execute-row">

                                          <button
                                            className="execute-button"
                                            onClick={() =>
                                              executeEndpoint(
                                                category,
                                                endpoint
                                              )
                                            }
                                            disabled={
                                              isRequesting
                                            }
                                          >
                                            {isRequesting
                                              ? "REQUESTING..."
                                              : "EXECUTE"}
                                          </button>

                                          <span className="execute-method">
                                            API KEY AUTOMATIC
                                          </span>

                                        </div>

                                        {response && (
                                          <div className="response-card">

                                            <div className="response-header">

                                              <span>
                                                RESPONSE
                                              </span>

                                              <span className="response-status">
                                                {response.success
                                                  ? `HTTP ${
                                                      response.http_status ||
                                                      200
                                                    }`
                                                  : "ERROR"}
                                              </span>

                                            </div>

                                            <pre className="response-body">
                                              {JSON.stringify(
                                                response,
                                                null,
                                                2
                                              )}
                                            </pre>

                                          </div>
                                        )}

                                      </div>
                                    )}

                                  </div>
                                );
                              }
                            )}

                          </div>
                        </>
                      )}

                    </div>
                  );
                }
              )}

            </section>
          </>
        )}

        {/* ===================================================
            ADMIN
        =================================================== */}

        {page === "admin" &&
          profile?.role === "admin" && (
            <section className="page-card">

              <div className="page-heading">

                <span className="eyebrow">
                  CONTROL CENTER
                </span>

                <h1>
                  ADMIN PANEL
                </h1>

                <p>
                  Kelola member dan penggunaan
                  API DIN API.
                </p>

              </div>

              <div className="admin-toolbar">

                <div>
                  <strong>
                    MEMBER DATABASE
                  </strong>

                  <small>
                    {members.length} ACCOUNT
                  </small>
                </div>

                <button
                  className="refresh-button"
                  onClick={loadMembers}
                >
                  ↻ REFRESH
                </button>

              </div>

              {memberLoading ? (
                <div className="admin-loading">
                  LOADING MEMBERS...
                </div>
              ) : (
                <div className="member-list">

                  {members.map((member) => (
                    <div
                      className="member-card"
                      key={member.id}
                    >

                      <div className="member-main">

                        <div className="member-avatar">
                          {(member.email ||
                            "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {member.email ||
                              "Unknown"}
                          </strong>

                          <small>
                            {member.id}
                          </small>
                        </div>

                      </div>

                      <div className="member-stats">

                        <div>
                          <small>
                            ROLE
                          </small>

                          <strong>
                            {(
                              member.role ||
                              "member"
                            ).toUpperCase()}
                          </strong>
                        </div>

                        <div>
                          <small>
                            REQUEST
                          </small>

                          <strong>
                            {
                              member.requests_today
                            }{" "}
                            /{" "}
                            {
                              member.daily_limit
                            }
                          </strong>
                        </div>

                        <div>
                          <small>
                            STATUS
                          </small>

                          <strong>
                            {(
                              member.status ||
                              "active"
                            ).toUpperCase()}
                          </strong>
                        </div>

                      </div>

                      <div className="member-actions">

                        <label>
                          LIMIT

                          <input
                            type="number"
                            min="0"
                            defaultValue={
                              member.daily_limit
                            }
                            onBlur={(e) =>
                              changeMemberLimit(
                                member.id,
                                e.target.value
                              )
                            }
                          />
                        </label>

                        <button
                          onClick={() =>
                            resetMemberRequests(
                              member.id
                            )
                          }
                        >
                          RESET
                        </button>

                        <button
                          onClick={() =>
                            changeMemberStatus(
                              member.id,
                              member.status ===
                                "active"
                                ? "suspended"
                                : "active"
                            )
                          }
                        >
                          {member.status ===
                          "active"
                            ? "SUSPEND"
                            : "ACTIVE"}
                        </button>

                      </div>

                    </div>
                  ))}

                  {members.length === 0 && (
                    <div className="empty-state">
                      BELUM ADA MEMBER.
                    </div>
                  )}

                </div>
              )}

            </section>
          )}

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">
        DIN API • ROBOT SYSTEM • SECURE API PLATFORM
      </footer>

    </div>
  );
}
