export class Token {
  constructor(
    public readonly chainId: number,
    public readonly address: string,
    public readonly decimals: number,
    public readonly symbol: string,
    public readonly name: string
  ) {}
}

// Ethereum mainnet chain ID
const ETHEREUM_CHAIN_ID = 1;

// Yellow Network testnet chain ID
const YELLOW_TESTNET_CHAIN_ID = 54321;

const YELLOW = new Token(
  YELLOW_TESTNET_CHAIN_ID,
  "0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f",
  18,
  "YELLOW",
  "Yellow Network Token"
);

const USDC = new Token(
  ETHEREUM_CHAIN_ID,
  "0xa4151b2b3e269645181dccf2d426ce75fcbdeca9",
  6,
  "USDC",
  "USD Coin"
);

const USDT = new Token(
  ETHEREUM_CHAIN_ID,
  "0x900101d06A7426441Ae63e9AB3B9b02131A0E145",
  6,
  "USDT",
  "Tether USD"
);

const ETH = new Token(
  ETHEREUM_CHAIN_ID,
  "0x0000000000000000000000000000000000000000",
  18,
  "ETH",
  "Ethereum"
);

export function getToken(tokenName: string): Token {
  switch (tokenName.toUpperCase()) {
    case "USDC":
      return USDC;
    case "USDT":
      return USDT;
    case "ETH":
      return ETH;
    case "YELLOW":
      return YELLOW;
    default:
      return USDC; // Default to USDC
  }
}

export function getBaseTokens(): Token[] {
  return [YELLOW, USDC, USDT, ETH];
}

// Legacy exports for backward compatibility
export const getTokenAvax = getToken;