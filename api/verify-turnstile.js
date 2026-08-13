export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { token } = req.body || {};

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Turnstile token missing",
      });
    }

    const secret =
      process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
      return res.status(500).json({
        success: false,
        message:
          "TURNSTILE_SECRET_KEY belum dikonfigurasi di Vercel.",
      });
    }

    const formData =
      new URLSearchParams();

    formData.append(
      "secret",
      secret
    );

    formData.append(
      "response",
      token
    );

    const cloudflareResponse =
      await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );

    const result =
      await cloudflareResponse.json();

    if (!result.success) {
      return res.status(403).json({
        success: false,
        message:
          "Cloudflare verification failed",
        errors:
          result["error-codes"] || [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Verification successful",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
}
