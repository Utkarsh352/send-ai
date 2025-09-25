import type { Address } from 'viem'

export interface User {
    id: string
    name: string
    walletAddress: Address
    avatar?: string
    bio?: string
}

export const users: User[] = [
    {
        id: 'alice',
        name: 'Alice Chen',
        walletAddress: '0x742d35Cc6511C4b7B1d5c1e3c3e3e3e3e3e3e3e1' as Address,
        avatar: '👩‍💻',
        bio: 'Full-stack developer passionate about Web3 and DeFi protocols'
    },
    {
        id: 'bob',
        name: 'Bob Martinez',
        walletAddress: '0x742d35Cc6511C4b7B1d5c1e3c3e3e3e3e3e3e3e2' as Address,
        avatar: '👨‍🎨',
        bio: 'UI/UX designer creating beautiful decentralized applications'
    },
    {
        id: 'carol',
        name: 'Carol Smith',
        walletAddress: '0x742d35Cc6511C4b7B1d5c1e3c3e3e3e3e3e3e3e3' as Address,
        avatar: '👩‍🔬',
        bio: 'Blockchain researcher exploring layer 2 scaling solutions'
    },
    {
        id: 'david',
        name: 'David Kumar',
        walletAddress: '0x742d35Cc6511C4b7B1d5c1e3c3e3e3e3e3e3e3e4' as Address,
        avatar: '👨‍💼',
        bio: 'Product manager building the future of decentralized finance'
    },
    {
        id: 'eve',
        name: 'Eve Johnson',
        walletAddress: '0x742d35Cc6511C4b7B1d5c1e3c3e3e3e3e3e3e3e5' as Address,
        avatar: '👩‍🚀',
        bio: 'Smart contract developer and security auditor'
    }
]

export const findUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id)
}

export const findUserByAddress = (address: Address): User | undefined => {
    return users.find(user => user.walletAddress.toLowerCase() === address.toLowerCase())
}