# Send-AI

> **Google Maps for Cross-Chain Transactions powered by Yellow Network & AI**

Send-AI is an intelligent cross-chain route optimizer that finds the best paths for moving assets across blockchains. Like Google Maps for navigation, Send-AI analyzes multiple routes across Yellow Network's state channels, traditional bridges, and DEX aggregators to provide optimal transaction paths through natural language commands.

## 🎯 Vision

**Democratize cross-chain DeFi by making multi-blockchain transactions as simple as asking for directions.**

### Key Features

- **🗺️ Route Optimization**: Find the best cross-chain transaction paths like Google Maps finds driving routes
- **🟡 Yellow Network Integration**: Leverage Yellow Network's state channels for bridgeless cross-chain transactions
- **🛡️ Multi-Route Analysis**: Compare traditional bridges, DEX aggregators, and Yellow Network paths
- **📱 Conversational Interface**: Ask "Send 100 USDC from Ethereum to Polygon" in natural language
- **⚡ Real-time Optimization**: Dynamic route selection based on speed, cost, and security
- **🔗 Multi-Chain Support**: Support for all major blockchains and L2 solutions

### Supported Operations

- **Cross-chain asset transfers**: Move tokens between any supported chains
- **Route visualization**: See transaction paths like a map with stops and connections  
- **Bridge comparison**: Compare costs and speeds across traditional bridges vs Yellow Network
- **Portfolio balance checking**: Multi-chain portfolio overview and management
- **Yield farming discovery**: Find cross-chain yield opportunities across protocols
- **DeFi protocol exploration**: Discover new protocols accessible via cross-chain routes

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/en/download)
- **Package Manager** - npm, pnpm, or yarn
- **Multi-Chain Wallet** - MetaMask or compatible wallet configured for Yellow Network and other supported chains

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/send-ai/send-ai.git
   cd send-ai
   ```

2. **Install dependencies**
   ```bash
   # Using pnpm (recommended)
   pnpm install
   
   # Or using npm
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key
   NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
   ```

4. **Start development server**
   ```bash
   # Using pnpm
   pnpm dev
   
   # Or using npm
   npm run dev
   ```

5. **Access the application**
   
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Architecture

### Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 14 | React framework with App Router |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Radix UI + Tailwind components |
| **Animations** | Framer Motion | Smooth interactions and transitions |
| **State Management** | Zustand | Lightweight state management |
| **Blockchain** | Wagmi + Viem | Ethereum-compatible blockchain interactions |
| **Wallet Connection** | RainbowKit | Multi-wallet connection support |
| **AI Integration** | Vercel AI SDK | Language model interactions |
| **Icons** | Lucide React | Consistent icon library |

### Yellow Network Integration

- **Testnet**: Yellow Network Testnet (Chain ID: 999999)
- **Mainnet**: Yellow Network Mainnet (Chain ID: 888888) - *Launching Q2 2025*
- **RPC URLs**: 
  - Testnet: `https://rpc.testnet.yellow.network`
  - Mainnet: `https://rpc.yellow.network`
- **Explorer**: [Yellow Explorer](https://explorer.testnet.yellow.network)
- **Native Token**: YELLOW
- **Features**: ERC-7824 State Channels, Bridge-less Cross-chain, Mesh Network

## 🛠️ Development

### Project Structure

```
send-ai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (landing)/         # Landing page group
│   │   ├── api/               # API routes
│   │   ├── home/              # Main application
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── chat/              # Chat interface components
│   │   ├── landing/           # Landing page components
│   │   └── ui/                # Reusable UI components
│   ├── constants/             # Application constants
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── providers/             # Context providers
│   └── utils/                 # Helper functions
├── public/                    # Static assets
└── docs/                      # Documentation
```

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript check
```

### Environment Configuration

Create a `.env.local` file with the following variables:

```env
# AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key

# Wallet Configuration  
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id

# Optional: Local AI Model
OLLAMA_URL=http://localhost:11434  # If using Ollama locally

# Yellow Network Configuration (Optional)
YELLOW_NETWORK_RPC=https://rpc.testnet.yellow.network
YELLOW_EXPLORER_URL=https://explorer.testnet.yellow.network
```

## 🔧 Configuration

### AI Model Setup

The application supports multiple AI providers:

1. **OpenRouter** (Recommended)
   - Create account at [OpenRouter](https://openrouter.ai)
   - Get API key and add to `.env`
   - Currently using: `moonshotai/kimi-k2:free`

2. **Ollama** (Local, Optional)
   - Install [Ollama](https://ollama.com)
   - Pull a compatible model: `ollama pull llama2`
   - Update configuration in API routes

### Wallet Configuration

1. **MetaMask Setup**
   - Install MetaMask extension
   - Add Yellow Network manually or through [ChainList](https://chainlist.org)

2. **Yellow Network Testnet Details**
   ```
   Network Name: Yellow Network Testnet
   RPC URL: https://rpc.testnet.yellow.network
   Chain ID: 999999
   Currency Symbol: YELLOW
   Block Explorer: https://explorer.testnet.yellow.network
   ```

3. **Yellow Network Mainnet Details** *(Launching Q2 2025)*
   ```
   Network Name: Yellow Network Mainnet
   RPC URL: https://rpc.yellow.network
   Chain ID: 888888
   Currency Symbol: YELLOW
   Block Explorer: https://explorer.yellow.network
   ```

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   npx vercel
   ```

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure production API keys are properly set

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

## 🔐 Security

### Best Practices

- **Never commit private keys** or sensitive data
- **Use environment variables** for all configuration
- **Validate all user inputs** before blockchain interactions
- **Implement proper error handling** for failed transactions
- **Use confirmation dialogs** for all financial operations

### Audit Considerations

- Smart contract interactions are limited to well-established protocols
- All transactions require explicit user confirmation
- Private keys never leave the user's wallet
- Application follows Web3 security best practices

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- **Code Style**: Follow ESLint and Prettier configurations
- **Commits**: Use conventional commit messages
- **Testing**: Add tests for new features
- **Documentation**: Update relevant documentation

### Areas for Contribution

- Additional cross-chain protocol integrations
- Yellow Network mainnet preparation (Q2 2025)
- Route optimization algorithm improvements
- UI/UX improvements for route visualization
- Performance optimizations
- Mobile responsiveness
- Accessibility enhancements
- Internationalization (i18n)
- New blockchain network integrations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

### Official Links
- **Yellow Network**: [Official Website](https://yellow.org)
- **Yellow Docs**: [Developer Documentation](https://docs.yellow.org)
- **Yellow Explorer**: [Block Explorer](https://explorer.testnet.yellow.network)

### Developer Resources
- **Yellow Network SDK**: [Developer Integration](https://docs.yellow.org)
- **Testnet Faucet**: [Get YELLOW Tokens](https://explorer.testnet.yellow.network/faucet)
- **Yellow Hackathon 2025**: [BizThon Platform](https://bizthon.com/yellow-network-hackathon-2025)
- **ERC-7824 Standard**: [State Channels Documentation](https://docs.yellow.org)

### AI & Blockchain
- **Vercel AI SDK**: [Documentation](https://sdk.vercel.ai)
- **Wagmi**: [React Hooks for Ethereum](https://wagmi.sh)
- **Viem**: [TypeScript Interface for Ethereum](https://viem.sh)

---

**Built with ❤️ for the Yellow Network ecosystem**

*Enabling the future of cross-chain DeFi routing*