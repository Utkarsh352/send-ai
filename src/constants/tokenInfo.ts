export class Token {
  constructor(
    public readonly chainId: number,
    public readonly address: string,
    public readonly decimals: number,
    public readonly symbol: string,
    public readonly name: string
  ) {}
}

const CORE_CHAIN_ID = 1116;

const WCORE = new Token(
  CORE_CHAIN_ID,
  "0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f",
  18, // Assuming 18 decimals for WCORE, this is a common value
  "WCORE",
  "Wrapped Core"
);

const USDC = new Token(
  CORE_CHAIN_ID,
  "0xa4151b2b3e269645181dccf2d426ce75fcbdeca9",
  6, // Assuming 6 decimals for USDC
  "USDC",
  "USD Coin"
);

const USDT = new Token(
  CORE_CHAIN_ID,
  "0x900101d06A7426441Ae63e9AB3B9b02131A0E145",
  6, // Assuming 6 decimals for USDT
  "USDT",
  "Tether USD"
);

export function getTokenCore(tokenName: string): Token {
  if (tokenName.toUpperCase() === "USDC") {
    return USDC;
  } else if (tokenName.toUpperCase() === "USDT") {
    return USDT;
  } else {
    return WCORE;
  }
}

export function getBaseCore(): Token[] {
  return [WCORE, USDC, USDT];
}

// Legacy export for backward compatibility
export const getTokenAvax = getTokenCore;
