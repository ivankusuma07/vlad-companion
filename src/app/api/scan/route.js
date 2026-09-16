// GET /api/scan?address=0x… — manual contract scan (roadmap phase 1) and the
// validation endpoint the callers feature posts against.
//
// Addresses here are EVM 0x hex with an EIP-55 checksum check — the old base58
// (Solana) validation is gone. Reads are plain ERC20 calls over the RH Chain
// RPC, so this works against any Arbitrum-Orbit endpoint you configure.
import { erc20Abi } from "viem";
import { normalizeAddress } from "@/lib/evm.js";
import { publicClient, explorerUrl, dexUrl } from "@/lib/server/chain.js";
import { rateLimit, clientKey } from "@/lib/server/rate-limit.js";
import { env } from "@/lib/server/env.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const limit = rateLimit(`scan:${clientKey(request)}`, 30, 60_000);
  if (!limit.ok) return Response.json({ error: "slow down." }, { status: 429 });

  const raw = new URL(request.url).searchParams.get("address");
  const address = normalizeAddress(raw);

  if (!address) {
    return Response.json(
      { valid: false, error: "not a valid address. robinhood chain uses 0x… 42-character hex." },
      { status: 400 },
    );
  }

  const links = { explorer: explorerUrl(address), dex: dexUrl(address) };
  const client = publicClient();

  // Address is well-formed but we have no RPC to check it against. Say that,
  // rather than implying the token is fine.
  if (!client) {
    return Response.json({
      valid: true,
      address,
      chain: env.chainName,
      token: null,
      links,
      read: "address is well-formed. no rpc configured — nothing measured.",
    });
  }

  try {
    const code = await client.getCode({ address });
    if (!code || code === "0x") {
      return Response.json({
        valid: true,
        address,
        chain: env.chainName,
        token: null,
        links,
        read: "no contract at this address. it's a wallet, or nothing.",
      });
    }

    const [name, symbol, decimals, totalSupply] = await Promise.all([
      client.readContract({ address, abi: erc20Abi, functionName: "name" }).catch(() => null),
      client.readContract({ address, abi: erc20Abi, functionName: "symbol" }).catch(() => null),
      client.readContract({ address, abi: erc20Abi, functionName: "decimals" }).catch(() => null),
      client.readContract({ address, abi: erc20Abi, functionName: "totalSupply" }).catch(() => null),
    ]);

    const isErc20 = symbol !== null && decimals !== null;

    return Response.json({
      valid: true,
      address,
      chain: env.chainName,
      token: isErc20
        ? { name, symbol, decimals, totalSupply: totalSupply?.toString() ?? null }
        : null,
      links,
      read: isErc20
        ? `contract confirmed. $${symbol}, ${decimals} decimals. supply is what it is — i don't value it for you.`
        : "contract exists but doesn't answer erc20 calls. insufficient data to conclude.",
    });
  } catch (err) {
    console.error("[scan] rpc failed:", err.message);
    return Response.json(
      { valid: true, address, chain: env.chainName, token: null, links, read: "rpc didn't answer. can't measure what i can't read." },
      { status: 502 },
    );
  }
}
