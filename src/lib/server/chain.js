// Robinhood Chain wiring. RH Chain is an Ethereum L2 on the Arbitrum Orbit
// stack: EVM semantics, 0x addresses, ETH gas. Nothing Solana-shaped survives
// here — no base58, no bonding curve, no graduation %.
import { createPublicClient, http, defineChain } from "viem";
import { env, hasRpc } from "./env.js";

let cachedClient = null;

export function rhChain() {
  return defineChain({
    id: env.chainId,
    name: env.chainName,
    nativeCurrency: { name: env.nativeSymbol, symbol: env.nativeSymbol, decimals: 18 },
    rpcUrls: { default: { http: [env.rpcUrl] } },
    blockExplorers: env.explorerBase
      ? { default: { name: `${env.chainName} Explorer`, url: env.explorerBase } }
      : undefined,
  });
}

// Returns null when the RPC isn't configured — callers degrade instead of throwing.
export function publicClient() {
  if (!hasRpc()) return null;
  if (!cachedClient) {
    cachedClient = createPublicClient({
      chain: rhChain(),
      transport: http(env.rpcUrl, { batch: true, retryCount: 2, timeout: 10_000 }),
    });
  }
  return cachedClient;
}

const join = (base, addr) => (base ? base.replace(/\/+$/, "") + "/" + addr : null);

export const explorerUrl = (address) => join(env.explorerBase, address);
export const dexUrl = (address) => join(env.dexBase, address);
