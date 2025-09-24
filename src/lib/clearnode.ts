import { ethers } from 'ethers';
import {
  createAuthRequestMessage,
  createAuthVerifyMessage,
  createGetChannelsMessage,
  createGetLedgerBalancesMessage,
  createAppSessionMessage,
  createCloseAppSessionMessage,
  parseAnyRPCResponse,
  RPCMethod,
  MessageSigner,
} from '@erc7824/nitrolite';
import { YELLOW_SUPPORTED_CHAINS } from '@/constants/yellowNetwork';

export interface ClearNodeConfig {
  url: string;
  autoReconnect: boolean;
  maxReconnectAttempts: number;
  reconnectInterval: number;
}

export interface PayrollSession {
  sessionId: string;
  companyAddress: string;
  employeeAddress: string;
  amount: string;
  asset: string;
  status: 'active' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  lastUpdated: Date;
}

export interface EmployeeBalance {
  asset: string;
  amount: string;
  lastUpdated: Date;
}

export interface ClearNodeEvents {
  connected: () => void;
  authenticated: () => void;
  disconnected: (event: { code: number; reason: string }) => void;
  error: (error: string) => void;
  paymentProcessed: (payment: PayrollSession) => void;
  balanceUpdated: (address: string, balances: EmployeeBalance[]) => void;
}

export class ClearNodeConnection {
  private ws: WebSocket | null = null;
  private config: ClearNodeConfig;
  private stateWallet: ethers.Wallet;
  private isConnected = false;
  private isAuthenticated = false;
  private reconnectAttempts = 0;
  private requestMap = new Map<string, { resolve: (value: any) => void; reject: (error: Error) => void; timeout: NodeJS.Timeout }>();
  private eventHandlers: Partial<ClearNodeEvents> = {};
  private payrollSessions = new Map<string, PayrollSession>();

  constructor(config: ClearNodeConfig, stateWallet: ethers.Wallet) {
    this.config = config;
    this.stateWallet = stateWallet;
  }

  // Event management
  on<K extends keyof ClearNodeEvents>(event: K, handler: ClearNodeEvents[K]) {
    this.eventHandlers[event] = handler;
  }

  off<K extends keyof ClearNodeEvents>(event: K) {
    delete this.eventHandlers[event];
  }

  private emit<K extends keyof ClearNodeEvents>(event: K, ...args: Parameters<ClearNodeEvents[K]>) {
    const handler = this.eventHandlers[event];
    if (handler) {
      (handler as any)(...args);
    }
  }

  // Message signer implementation
  private messageSigner: MessageSigner = async (payload) => {
    try {
      const message = JSON.stringify(payload);
      const digestHex = ethers.utils.id(message);
      const messageBytes = ethers.utils.arrayify(digestHex);
      const signature = this.stateWallet._signingKey().signDigest(messageBytes);
      return ethers.utils.joinSignature(signature) as `0x${string}`;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  };

  // Connection management
  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url);

        const connectionTimeout = setTimeout(() => {
          if (!this.isConnected) {
            this.ws?.close();
            reject(new Error('Connection timeout'));
          }
        }, 10000);

        this.ws.onopen = async () => {
          clearTimeout(connectionTimeout);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connected');

          try {
            await this.authenticate();
            resolve();
          } catch (error) {
            reject(error);
          }
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          this.emit('error', 'WebSocket connection error');
          reject(new Error('WebSocket connection failed'));
        };

        this.ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          this.isConnected = false;
          this.isAuthenticated = false;
          this.emit('disconnected', { code: event.code, reason: event.reason });

          if (this.config.autoReconnect) {
            this.attemptReconnect();
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private async authenticate(): Promise<void> {
    const authRequest = await createAuthRequestMessage({
      wallet: this.stateWallet.address,
      participant: this.stateWallet.address,
      app_name: 'Send-AI Payroll',
      expire: (Math.floor(Date.now() / 1000) + 3600).toString(),
      scope: 'payroll',
      application: '0x0000000000000000000000000000000000000000',
      allowances: [],
    });

    this.ws?.send(authRequest);
  }

  private handleMessage(data: string) {
    try {
      const message = parseAnyRPCResponse(data);

      switch (message.method) {
        case RPCMethod.AuthChallenge:
          this.handleAuthChallenge(message);
          break;
        case RPCMethod.AuthVerify:
          this.handleAuthVerify(message);
          break;
        case RPCMethod.GetChannels:
        case RPCMethod.GetLedgerBalances:
        case RPCMethod.CreateAppSession:
        case RPCMethod.CloseAppSession:
          this.handleGenericResponse(message);
          break;
        default:
          console.log('Unhandled message:', message);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private async handleAuthChallenge(message: any) {
    try {
      const authVerify = await createAuthVerifyMessage(this.messageSigner, message);
      this.ws?.send(authVerify);
    } catch (error) {
      this.emit('error', `Authentication verification failed: ${error}`);
    }
  }

  private handleAuthVerify(message: any) {
    if (message.params?.success) {
      this.isAuthenticated = true;
      this.emit('authenticated');

      if (message.params.jwtToken) {
        localStorage.setItem('clearnode_jwt', message.params.jwtToken);
      }
    } else {
      this.emit('error', 'Authentication failed');
    }
  }

  private handleGenericResponse(message: any) {
    const requestId = message.requestId;
    const handler = this.requestMap.get(requestId);

    if (handler) {
      clearTimeout(handler.timeout);
      handler.resolve(message.params);
      this.requestMap.delete(requestId);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.emit('error', 'Maximum reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      this.connect().catch(error => {
        console.error(`Reconnection attempt ${this.reconnectAttempts} failed:`, error);
      });
    }, delay);
  }

  // Payroll-specific methods
  async createPayrollSession(
    employeeAddress: string,
    amount: string,
    asset: string = 'usdc'
  ): Promise<PayrollSession> {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated with ClearNode');
    }

    const sessionId = Date.now().toString();
    const companyAddress = this.stateWallet.address;

    const appDefinition = {
      protocol: 'nitrolite-payroll',
      participants: [companyAddress as `0x${string}`, employeeAddress as `0x${string}`],
      weights: [100, 0],
      quorum: 100,
      challenge: 0,
      nonce: Date.now(),
    };

    const allocations = [
      {
        participant: companyAddress,
        asset,
        amount,
      },
      {
        participant: employeeAddress,
        asset,
        amount: '0',
      },
    ];

    const request = {
      definition: appDefinition,
      allocations,
    };

    const signedMessage = await createAppSessionMessage(this.messageSigner, request);
    const response = await this.sendRequest(signedMessage, 'create_app_session');

    const session: PayrollSession = {
      sessionId: response.app_session_id || sessionId,
      companyAddress,
      employeeAddress,
      amount,
      asset,
      status: 'active',
      createdAt: new Date(),
      lastUpdated: new Date(),
    };

    this.payrollSessions.set(session.sessionId, session);
    return session;
  }

  async processPayment(sessionId: string): Promise<PayrollSession> {
    const session = this.payrollSessions.get(sessionId);
    if (!session) {
      throw new Error(`Payroll session ${sessionId} not found`);
    }

    session.status = 'processing';
    session.lastUpdated = new Date();

    try {
      const allocations = [
        {
          participant: session.companyAddress,
          asset: session.asset,
          amount: '0',
        },
        {
          participant: session.employeeAddress,
          asset: session.asset,
          amount: session.amount,
        },
      ];

      const closeRequest = {
        app_session_id: sessionId as `0x${string}`,
        allocations,
      };

      const signedMessage = await createCloseAppSessionMessage(this.messageSigner, closeRequest);
      await this.sendRequest(signedMessage, 'close_app_session');

      session.status = 'completed';
      session.lastUpdated = new Date();

      this.emit('paymentProcessed', session);
      return session;
    } catch (error) {
      session.status = 'failed';
      session.lastUpdated = new Date();
      throw error;
    }
  }

  async getEmployeeBalances(employeeAddress: string): Promise<EmployeeBalance[]> {
    const message = await createGetLedgerBalancesMessage(this.messageSigner, employeeAddress as any);
    const response = await this.sendRequest(message, 'get_ledger_balances');

    const balances: EmployeeBalance[] = response.map((balance: any) => ({
      asset: balance.asset,
      amount: balance.amount,
      lastUpdated: new Date(),
    }));

    this.emit('balanceUpdated', employeeAddress, balances);
    return balances;
  }

  async getChannels() {
    const message = await createGetChannelsMessage(this.messageSigner, this.stateWallet.address as any);
    return this.sendRequest(message, 'get_channels');
  }

  private sendRequest(message: string, expectedMethod: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const requestId = Date.now().toString();
      const timeout = setTimeout(() => {
        this.requestMap.delete(requestId);
        reject(new Error(`Request timeout for ${expectedMethod}`));
      }, 30000);

      this.requestMap.set(requestId, { resolve, reject, timeout });
      this.ws.send(message);
    });
  }

  getPayrollSessions(): PayrollSession[] {
    return Array.from(this.payrollSessions.values());
  }

  getPayrollSession(sessionId: string): PayrollSession | undefined {
    return this.payrollSessions.get(sessionId);
  }

  disconnect() {
    if (this.ws) {
      this.requestMap.forEach(({ timeout, reject }) => {
        clearTimeout(timeout);
        reject(new Error('Connection closed'));
      });
      this.requestMap.clear();

      this.ws.close(1000, 'User initiated disconnect');
      this.ws = null;
    }
  }

  get connected(): boolean {
    return this.isConnected;
  }

  get authenticated(): boolean {
    return this.isAuthenticated;
  }
}

// Default configuration
export const DEFAULT_CLEARNODE_CONFIG: ClearNodeConfig = {
  url: 'wss://clearnet.yellow.com/ws',
  autoReconnect: true,
  maxReconnectAttempts: 5,
  reconnectInterval: 3000,
};

// Factory function to create ClearNode connection
export function createClearNodeConnection(stateWallet: ethers.Wallet, config: Partial<ClearNodeConfig> = {}): ClearNodeConnection {
  const finalConfig = { ...DEFAULT_CLEARNODE_CONFIG, ...config };
  return new ClearNodeConnection(finalConfig, stateWallet);
}