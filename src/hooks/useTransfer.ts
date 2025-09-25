import { useCallback } from 'react'
import { createTransferMessage, createECDSAMessageSigner } from '@erc7824/nitrolite'
import type { Address } from 'viem'
import { webSocketService } from '@/lib/websocket'
import type { SessionKey } from '@/lib/utils'

export interface TransferResult {
    success: boolean
    error?: string
}

export interface TransferParams {
    recipient: Address
    amount: string
    asset?: string
}

export const useTransfer = (sessionKey: SessionKey | null, isAuthenticated: boolean) => {
    const handleTransfer = useCallback(
        async ({ recipient, amount, asset = 'usdc' }: TransferParams): Promise<TransferResult> => {
            if (!isAuthenticated || !sessionKey) {
                return { success: false, error: 'Please authenticate first' }
            }

            try {
                console.log(`Initiating transfer of ${amount} ${asset.toUpperCase()} to ${recipient}`)

                // Create session signer using the session key's private key
                const sessionSigner = createECDSAMessageSigner(sessionKey.privateKey)

                // Create the transfer message
                const transferPayload = await createTransferMessage(sessionSigner, {
                    destination: recipient,
                    allocations: [
                        {
                            asset: asset.toLowerCase(),
                            amount: amount,
                        }
                    ],
                })

                console.log('Transfer payload created, sending via WebSocket...')
                webSocketService.send(transferPayload)

                return { success: true }
            } catch (error) {
                console.error('Failed to create transfer:', error)
                const errorMsg = error instanceof Error ? error.message : 'Failed to create transfer'
                return { success: false, error: errorMsg }
            }
        },
        [sessionKey, isAuthenticated]
    )

    // Convenience method for USDC transfers
    const sendUSDC = useCallback(
        async (recipient: Address, amount: string): Promise<TransferResult> => {
            return handleTransfer({ recipient, amount, asset: 'usdc' })
        },
        [handleTransfer]
    )

    return { handleTransfer, sendUSDC }
}