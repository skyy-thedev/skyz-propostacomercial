import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// ============================================
// ADMIN AUTH API - V4
// Server-side password validation with HMAC-signed tokens
// Password is NEVER exposed to the client
// Stateless: works perfectly on Vercel serverless
// ============================================

const ADMIN_TOKEN_COOKIE = "admin_token";
const TOKEN_EXPIRY_HOURS = 24;

/**
 * Creates an HMAC-signed token containing the expiry timestamp.
 * The token is self-validating — no server-side state needed.
 * Secret key = ADMIN_PASSWORD itself (always available on server).
 */
function createSignedToken(): string {
  const secret = process.env.ADMIN_PASSWORD!;
  const expiresAt = Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;
  const payload = `admin:${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  // Token format: payload.signature (base64-encoded payload for safety)
  const encodedPayload = Buffer.from(payload).toString("base64");
  return `${encodedPayload}.${signature}`;
}

/**
 * Validates a signed token without any server-side state.
 * Verifies HMAC signature + checks expiry.
 */
function validateSignedToken(token: string): boolean {
  try {
    const secret = process.env.ADMIN_PASSWORD;
    if (!secret) return false;

    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return false;

    const payload = Buffer.from(encodedPayload, "base64").toString("utf-8");

    // Verify HMAC signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    // Timing-safe comparison to prevent timing attacks
    if (signature.length !== expectedSignature.length) return false;
    const isValidSignature = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    if (!isValidSignature) return false;

    // Check expiry
    const parts = payload.split(":");
    const expiresAt = parseInt(parts[1], 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

    return true;
  } catch {
    return false;
  }
}

// POST - Login
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("❌ ADMIN_PASSWORD não configurada no .env");
      return NextResponse.json(
        { error: "Autenticação não configurada no servidor" },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 401 }
      );
    }

    // Generate self-validating signed token
    const token = createSignedToken();
    const expiresAt = new Date(
      Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
    );

    // Store token in httpOnly cookie (not accessible via JS)
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: expiresAt,
    });

    console.log(`✅ Admin login bem-sucedido`);
    return response;
  } catch (error) {
    console.error("Erro no login admin:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}

// GET - Check if authenticated
export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!token || !validateSignedToken(token)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

// DELETE - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_TOKEN_COOKIE);
  return response;
}
