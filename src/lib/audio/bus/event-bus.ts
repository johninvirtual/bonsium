/**
 * Strongly-typed event definitions for audio-visual interactions.
 * The 3D scene emits these events, and the audio synthesis engine listens to them.
 */

export type BiosphereType = 'bonsai' | 'terrarium' | 'aquarium' | 'plantarium';

export interface BaseAVEvent {
	timestamp: number;
	biosphere: BiosphereType;
}

export interface BranchPrunedEvent extends BaseAVEvent {
	type: 'BRANCH_PRUNED';
	branchLength: number;
	cutHeight: number; // 0 (base) to 1 (tip)
	force: number;
}

export interface WaterRippledEvent extends BaseAVEvent {
	type: 'WATER_RIPPLED';
	position: [number, number, number];
	intensity: number;
	radius: number;
}

export interface GlassTappedEvent extends BaseAVEvent {
	type: 'GLASS_TAPPED';
	hitPoint: [number, number, number];
	velocity: number;
}

export interface DropletFallenEvent extends BaseAVEvent {
	type: 'DROPLET_FALLEN';
	surfaceType: 'soil' | 'leaf' | 'glass' | 'water';
	size: number;
}

export interface SunlightChangedEvent extends BaseAVEvent {
	type: 'SUNLIGHT_CHANGED';
	elevation: number; // 0 (horizon) to 90 (zenith)
	azimuth: number;
	intensity: number;
}

export interface BiosphereChangedEvent extends BaseAVEvent {
	type: 'BIOSPHERE_CHANGED';
	previousBiosphere: BiosphereType;
	nextBiosphere: BiosphereType;
}

export type AudioVisualEvent =
	| BranchPrunedEvent
	| WaterRippledEvent
	| GlassTappedEvent
	| DropletFallenEvent
	| SunlightChangedEvent
	| BiosphereChangedEvent;

export type AVEventListener<T extends AudioVisualEvent = AudioVisualEvent> = (event: T) => void;

class AudioVisualEventBus {
	private listeners: Map<string, Set<AVEventListener<AudioVisualEvent>>> = new Map();

	on<T extends AudioVisualEvent>(type: T['type'], listener: AVEventListener<T>): () => void {
		if (!this.listeners.has(type)) {
			this.listeners.set(type, new Set());
		}
		const set = this.listeners.get(type)!;
		const typedListener = listener as unknown as AVEventListener<AudioVisualEvent>;
		set.add(typedListener);

		return () => {
			set.delete(typedListener);
		};
	}

	emit<T extends AudioVisualEvent>(event: T): void {
		const set = this.listeners.get(event.type);
		if (set) {
			for (const listener of set) {
				listener(event);
			}
		}
	}

	clear(): void {
		this.listeners.clear();
	}
}

export const avEventBus = new AudioVisualEventBus();
