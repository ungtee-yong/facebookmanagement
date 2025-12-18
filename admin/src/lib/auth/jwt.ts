import { SignJWT, jwtVerify } from "jose";
import { SESSION_TTL_SECONDS } from "./constants";
import type { SessionPayload } from "./types";

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS)
    .sign(getSecretKey());
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, getSecretKey());

  // jose returns `JWTPayload` which is a generic object; we validate shape minimally
  const userId = payload.userId;
  const email = payload.email;
  const role = payload.role;

  if (typeof userId !== "string" || typeof email !== "string" || typeof role !== "string") {
    throw new Error("Invalid session payload");
  }

  return { userId, email, role } as SessionPayload;
}
