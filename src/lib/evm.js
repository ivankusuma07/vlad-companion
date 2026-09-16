// EVM address handling — replaces the old Solana base58 validation.
// Shared by the API routes and by the callers/manual-scan UI, so it lives
// outside lib/server.
import { isAddress, getAddress } from "viem";

export const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

// Cheap shape check — use it for input masks and instant UI feedback.
export const looksLikeAddress = (value) => typeof value === "string" && ADDRESS_RE.test(value.trim());

// Full check: shape + EIP-55 checksum (mixed-case addresses must checksum).
// Returns the canonical checksummed address, or null.
export function normalizeAddress(value) {
  if (!looksLikeAddress(value)) return null;
  const trimmed = value.trim();
  if (!isAddress(trimmed, { strict: false })) return null;
  const hasMixedCase = /[a-f]/.test(trimmed.slice(2)) && /[A-F]/.test(trimmed.slice(2));
  if (hasMixedCase && !isAddress(trimmed, { strict: true })) return null;
  return getAddress(trimmed);
}

export const shortAddress = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "");
