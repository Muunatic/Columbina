import { EventEmitter } from 'node:events';
import { PlayerManager } from '../../core/playerManager';
import { Track } from '../../utils/interface';

interface PlayerEventMap {
    playerStart: [player: PlayerManager, track: Track];
    emptyQueue: [player: PlayerManager];
    emptyChannel: [player: PlayerManager];
    playerError: [player: PlayerManager, error: Error];
    error: [player: PlayerManager, error: Error];
}

class PlayerEventEmitter extends EventEmitter {
    on<K extends keyof PlayerEventMap>(event: K, listener: (...args: PlayerEventMap[K]) => void): this {
        return super.on(event, listener as (...args: unknown[]) => void);
    }

    emit<K extends keyof PlayerEventMap>(event: K, ...args: PlayerEventMap[K]): boolean {
        return super.emit(event, ...args);
    }
}

export const playerEvents = new PlayerEventEmitter();
