const crypto = require("crypto");
const User = require("../models/auth_model");

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

function normalizePhone(value) {
  const raw = String(value || "").trim();
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  return null;
}

function createOtp() {
  if (process.env.NODE_ENV !== "production" && process.env.DEV_OTP) {
    return String(process.env.DEV_OTP)
      .padStart(6, "0")
      .slice(-6);
  }

  return String(crypto.randomInt(100000, 1000000));
}

function hashOtp(otp) {
  return crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");
}

function base64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function createToken(user) {
  const secret = process.env.JWT_SECRET;

  const header = base64Url(
    JSON.stringify({
      alg: "HS256",
      typ: "JWT"
    })
  );

  const payload = base64Url(
    JSON.stringify({
      id: user._id.toString(),
      phone: user.phone,
      name: user.name || "",
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    })
  );

  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${payload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${header}.${payload}.${signature}`;
}

function publicUser(user) {
  return {
    id: user._id,
    phone: user.phone,
    name: user.name || "",
    role: user.role
  };
}

/*
|--------------------------------------------------------------------------
| SEND OTP
|--------------------------------------------------------------------------
*/

exports.sendOtp = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is not configured on the server"
      });
    }

    const phone = normalizePhone(req.body?.phone);

    if (!phone) {
      return res.status(400).json({
        message: "Enter a valid 10-digit WhatsApp number"
      });
    }

    const otp = createOtp();

    await User.findOneAndUpdate(
      { phone },
      {
        $set: {
          otpHash: hashOtp(otp),
          otpExpiresAt: new Date(Date.now() + OTP_TTL_MS),
          otpAttempts: 0
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    /*
     * Development/local mode.
     *
     * In production this section should be replaced
     * with your WhatsApp Business API provider.
     */
    console.log(`SharePal OTP for ${phone}: ${otp}`);

    const response = {
      message: "OTP sent successfully",
      expiresInSeconds: OTP_TTL_MS / 1000
    };

    /*
     * Only expose OTP outside production.
     * This makes local testing easy.
     */
    if (process.env.NODE_ENV !== "production") {
      response.devOtp = otp;
    }

    return res.json(response);
  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      message: "Unable to send OTP"
    });
  }
};

/*
|--------------------------------------------------------------------------
| VERIFY OTP
|--------------------------------------------------------------------------
*/

exports.verifyOtp = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is not configured on the server"
      });
    }

    const phone = normalizePhone(req.body?.phone);
    const otp = String(req.body?.otp || "").trim();

    if (!phone || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Enter the 6-digit OTP"
      });
    }

    const user = await User.findOne({ phone }).select(
      "+otpHash +otpExpiresAt +otpAttempts"
    );

    if (!user || !user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({
        message: "Please request a new OTP"
      });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      user.otpHash = "";
      user.otpExpiresAt = null;
      user.otpAttempts = 0;

      await user.save();

      return res.status(400).json({
        message: "OTP has expired. Please request a new one"
      });
    }

    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({
        message: "Too many incorrect attempts. Please request a new OTP"
      });
    }

    if (hashOtp(otp) !== user.otpHash) {
      user.otpAttempts += 1;

      await user.save();

      return res.status(400).json({
        message: "Incorrect OTP"
      });
    }

    user.otpHash = "";
    user.otpExpiresAt = null;
    user.otpAttempts = 0;

    await user.save();

    const token = createToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: publicUser(user)
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      message: "Unable to verify OTP"
    });
  }
};

/*
|--------------------------------------------------------------------------
| CURRENT USER
|--------------------------------------------------------------------------
*/

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.json({
      user: publicUser(user)
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Unable to load account"
    });
  }
};