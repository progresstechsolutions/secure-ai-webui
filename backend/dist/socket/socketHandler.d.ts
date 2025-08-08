import { Server } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../types/index.js';
export declare const initializeSocket: (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => void;
//# sourceMappingURL=socketHandler.d.ts.map