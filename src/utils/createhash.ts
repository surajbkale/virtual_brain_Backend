import crypto from "crypto";

export function generateUniqueHash(): string {
  return crypto.randomBytes(16).toString("hex");
}
