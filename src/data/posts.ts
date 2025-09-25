export interface Post {
    id: string
    title: string
    content: string
    authorId: string
    authorName: string
    type: 'Article' | 'Tutorial' | 'News' | 'Discussion'
    createdAt: string
    tags: string[]
    likes: number
    tips: number
}

export const posts: Post[] = [
    {
        id: 'post-1',
        title: 'Building Scalable DeFi Applications with Layer 2',
        content: 'Layer 2 solutions are revolutionizing DeFi by providing faster transactions and lower fees. In this deep dive, we explore the most promising scaling solutions and how to build applications that leverage them effectively.',
        authorId: 'alice',
        authorName: 'Alice Chen',
        type: 'Article',
        createdAt: '2024-09-20T10:30:00Z',
        tags: ['DeFi', 'Layer2', 'Scaling', 'Ethereum'],
        likes: 124,
        tips: 8
    },
    {
        id: 'post-2',
        title: 'Web3 UX Design Principles That Actually Work',
        content: 'Creating intuitive user experiences in Web3 is challenging but crucial for adoption. Here are 10 proven design principles that make complex blockchain interactions feel simple and familiar to users.',
        authorId: 'bob',
        authorName: 'Bob Martinez',
        type: 'Tutorial',
        createdAt: '2024-09-19T14:15:00Z',
        tags: ['UX', 'Design', 'Web3', 'User Experience'],
        likes: 89,
        tips: 12
    },
    {
        id: 'post-3',
        title: 'Security Analysis of Cross-Chain Bridge Protocols',
        content: 'Cross-chain bridges have become critical infrastructure but also prime targets for attacks. This research examines the security models of major bridge protocols and identifies common vulnerabilities.',
        authorId: 'carol',
        authorName: 'Carol Smith',
        type: 'Article',
        createdAt: '2024-09-18T09:45:00Z',
        tags: ['Security', 'Bridges', 'Cross-chain', 'Research'],
        likes: 156,
        tips: 15
    },
    {
        id: 'post-4',
        title: 'Product Strategy for Decentralized Applications',
        content: 'Building products in Web3 requires a different approach than traditional software. Learn how to navigate governance, tokenomics, and community-driven development while maintaining product focus.',
        authorId: 'david',
        authorName: 'David Kumar',
        type: 'Discussion',
        createdAt: '2024-09-17T16:20:00Z',
        tags: ['Product', 'Strategy', 'Governance', 'Tokenomics'],
        likes: 67,
        tips: 6
    },
    {
        id: 'post-5',
        title: 'Smart Contract Audit Checklist for Developers',
        content: 'Before deploying your smart contracts to mainnet, use this comprehensive checklist to identify potential security vulnerabilities and ensure your code follows best practices.',
        authorId: 'eve',
        authorName: 'Eve Johnson',
        type: 'Tutorial',
        createdAt: '2024-09-16T11:30:00Z',
        tags: ['Security', 'Smart Contracts', 'Audit', 'Best Practices'],
        likes: 203,
        tips: 18
    },
    {
        id: 'post-6',
        title: 'The Future of Automated Market Makers',
        content: 'AMMs have evolved significantly since Uniswap v1. Explore the latest innovations in concentrated liquidity, dynamic fees, and oracle integration that are shaping the next generation of DEXs.',
        authorId: 'alice',
        authorName: 'Alice Chen',
        type: 'News',
        createdAt: '2024-09-15T13:45:00Z',
        tags: ['AMM', 'DEX', 'Innovation', 'Trading'],
        likes: 92,
        tips: 7
    }
]

export const getPostsByAuthor = (authorId: string): Post[] => {
    return posts.filter(post => post.authorId === authorId)
}

export const getPostsByTag = (tag: string): Post[] => {
    return posts.filter(post => post.tags.includes(tag))
}

export const getRecentPosts = (limit: number = 10): Post[] => {
    return posts
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit)
}