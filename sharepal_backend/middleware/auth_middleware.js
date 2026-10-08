const crypto = require("crypto");

function base64UrlDecode(value) {
  const padded =
    value.replace(/-/g, "+").replace(/_/g, "/") + "===";

  return Buffer.from(
    padded.slice(0, padded.length - (padded.length % 4)),
    "base64"
  );
}

function requireAuth(req, res, next) {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: "JWT_SECRET is not configured on the server"
      });
    }

    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const token = header.slice(7).trim();
    const parts = token.split(".");

    if (parts.length !== 3) {
      throw new Error("Invalid token");
    }

    const [
      encodedHeader,
      encodedPayload,
      encodedSignature
    ] = parts;

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const expectedBuffer = Buffer.from(expected);
    const providedBuffer = Buffer.from(encodedSignature);

    if (
      expectedBuffer.length !== providedBuffer.length ||
      !crypto.timingSafeEqual(
        expectedBuffer,
        providedBuffer
      )
    ) {
      throw new Error("Invalid signature");
    }

    const payload = JSON.parse(
      base64UrlDecode(encodedPayload).toString("utf8")
    );

    if (
      !payload.exp ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      throw new Error("Expired token");
    }

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired authentication token"
    });
  }
}

module.exports = {
  requireAuth
};