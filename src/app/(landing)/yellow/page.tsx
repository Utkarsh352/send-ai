import React from 'react';

const Page = () => {
  return (
    <div className="container p-6 max-w-3xl mx-auto h-screen">
      <h1 className="text-3xl font-bold mb-4">Send-AI: Cross-Chain Route Optimization on Yellow Network</h1>

      <section className="mb-6 mt-8">
        <p className="mt-2">An AI-powered cross-chain transaction router that finds optimal paths for moving assets across blockchains using Yellow Network&apos;s state channels and traditional bridges.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold">Key Features</h3>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li><strong>Cross-Chain Route Optimization:</strong> Find the best paths for moving assets between blockchains, comparing Yellow Network state channels with traditional bridges for speed, cost, and security.</li>
          <li><strong>Yellow Network Integration:</strong> Leverage Yellow Network&apos;s ERC-7824 state channels for bridge-less cross-chain transactions with minimal fees and instant settlement.</li>
          <li><strong>Maps for DeFi:</strong> Visual route planning showing transaction paths, stops, and alternative routes just like navigation apps.</li>
          <li><strong>Multi-Chain Portfolio Management:</strong> Track balances across all supported chains with Yellow Network compatibility indicators.</li>
          <li><strong>DeFi Protocol Discovery:</strong> Explore cross-chain accessible protocols and yield farming opportunities through optimal routing.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold">Supported Networks</h3>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li><strong>Yellow Network Testnet:</strong> Primary network with state channel capabilities</li>
          <li><strong>Ethereum, Polygon, Arbitrum:</strong> Yellow Network compatible chains</li>
          <li><strong>Base, Optimism, Avalanche:</strong> Traditional bridge routing</li>
          <li><strong>Yellow Network Mainnet:</strong> Coming Q2 2025</li>
        </ul>
      </section>
    </div>
  );
};

export default Page;
