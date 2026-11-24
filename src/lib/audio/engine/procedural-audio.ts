import type { BiosphereType } from '#lib/audio/bus/event-bus';
import { SCALES } from '#lib/audio/scales/scales';

/**
 * 100% Procedural Generative Audio Engine for Bonsium.
 * Uses native Web Audio API with zero external audio assets.
 * Features ASMR ambient pads, category-specific procedural synths, and click-free crossfades.
 */
export class ProceduralAudioEngine {
	private ctx: AudioContext | null = null;
	private masterGain: GainNode | null = null;
	private compressor: DynamicsCompressorNode | null = null;
	private reverbNode: ConvolverNode | null = null;
	private reverbGain: GainNode | null = null;

	// Ambient Pad Nodes
	private ambientGain: GainNode | null = null;
	private ambientOscs: OscillatorNode[] = [];
	private ambientFilter: BiquadFilterNode | null = null;
	private ambientLfo: OscillatorNode | null = null;
	private noiseNode: AudioBufferSourceNode | null = null;
	private noiseGain: GainNode | null = null;

	// Biosphere Specific Sub-Gains for Crossfading
	private categoryGains: Map<BiosphereType, GainNode> = new Map();
	private activeCategory: BiosphereType = 'bonsai';
	private categoryLoopTimer: number | null = null;

	private isInitialized = false;
	private isMuted = false;
	private masterVolume = 0.75;

	/**
	 * Initialize the AudioContext on first user interaction to comply with autoplay policy.
	 */
	async init(): Promise<void> {
		if (this.isInitialized && this.ctx) {
			if (this.ctx.state === 'suspended') {
				await this.ctx.resume();
			}
			return;
		}

		const AudioCtx =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
		this.ctx = new AudioCtx();

		if (this.ctx.state === 'suspended') {
			await this.ctx.resume();
		}

		// Master Compressor (Soft Limiter)
		this.compressor = this.ctx.createDynamicsCompressor();
		this.compressor.threshold.setValueAtTime(-3, this.ctx.currentTime);
		this.compressor.knee.setValueAtTime(8, this.ctx.currentTime);
		this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
		this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
		this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);
		this.compressor.connect(this.ctx.destination);

		// Master Gain
		this.masterGain = this.ctx.createGain();
		this.masterGain.gain.setValueAtTime(
			this.isMuted ? 0.0001 : this.masterVolume,
			this.ctx.currentTime
		);
		this.masterGain.connect(this.compressor);

		// Algorithmic Reverb Impulse Response
		this.setupReverb();

		// Setup Category Sub-Gains
		const categories: BiosphereType[] = ['bonsai', 'terrarium', 'aquarium', 'plantarium'];
		for (const cat of categories) {
			const gain = this.ctx.createGain();
			gain.gain.setValueAtTime(cat === this.activeCategory ? 0.8 : 0.0001, this.ctx.currentTime);
			gain.connect(this.masterGain);
			this.categoryGains.set(cat, gain);
		}

		// Start Generative Ambient ASMR Drone Pad
		this.startAmbientDrone();

		// Start Generative Background Sequence
		this.startGenerativeScheduler();

		this.isInitialized = true;
	}

	/**
	 * Generates a smooth algorithmic stereo reverb impulse response buffer (3.2s decay).
	 */
	private setupReverb(): void {
		if (!this.ctx || !this.masterGain) return;

		const sampleRate = this.ctx.sampleRate;
		const length = Math.floor(sampleRate * 3.2);
		const decay = 2.4;
		const impulse = this.ctx.createBuffer(2, length, sampleRate);
		const left = impulse.getChannelData(0);
		const right = impulse.getChannelData(1);

		for (let i = 0; i < length; i++) {
			const n = i / length;
			const env = Math.pow(1 - n, decay);
			left[i] = (Math.random() * 2 - 1) * env * 0.45;
			right[i] = (Math.random() * 2 - 1) * env * 0.45;
		}

		this.reverbNode = this.ctx.createConvolver();
		this.reverbNode.buffer = impulse;

		this.reverbGain = this.ctx.createGain();
		this.reverbGain.gain.setValueAtTime(0.45, this.ctx.currentTime);

		this.reverbNode.connect(this.reverbGain);
		this.reverbGain.connect(this.masterGain);
	}

	/**
	 * ASMR Ambient Drone: 432Hz harmonic foundation with slow breathing LFO filter and warm pink noise.
	 */
	private startAmbientDrone(): void {
		if (!this.ctx || !this.masterGain) return;

		this.ambientGain = this.ctx.createGain();
		this.ambientGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
		this.ambientGain.connect(this.masterGain);

		// 432 Hz Pythagorean Tuning Base: A3 (216Hz), E4 (324Hz), A4 (432Hz), C#5 (540Hz)
		const freqs = [216, 324, 432, 540];
		this.ambientFilter = this.ctx.createBiquadFilter();
		this.ambientFilter.type = 'lowpass';
		this.ambientFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
		this.ambientFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);
		this.ambientFilter.connect(this.ambientGain);

		// Slow LFO for breathing filter modulation (0.05 Hz ~ 20 seconds per breath cycle)
		this.ambientLfo = this.ctx.createOscillator();
		this.ambientLfo.frequency.setValueAtTime(0.05, this.ctx.currentTime);
		const lfoGain = this.ctx.createGain();
		lfoGain.gain.setValueAtTime(110, this.ctx.currentTime);
		this.ambientLfo.connect(lfoGain);
		lfoGain.connect(this.ambientFilter.frequency);
		this.ambientLfo.start();

		for (const f of freqs) {
			const osc = this.ctx.createOscillator();
			osc.type = 'sine';
			osc.frequency.setValueAtTime(f + (Math.random() * 0.4 - 0.2), this.ctx.currentTime);

			const oscGain = this.ctx.createGain();
			oscGain.gain.setValueAtTime(0.035, this.ctx.currentTime);

			osc.connect(oscGain);
			oscGain.connect(this.ambientFilter);
			osc.start();
			this.ambientOscs.push(osc);
		}

		// Gentle Pink Noise Breeze
		const noiseLength = this.ctx.sampleRate * 4;
		const noiseBuffer = this.ctx.createBuffer(1, noiseLength, this.ctx.sampleRate);
		const output = noiseBuffer.getChannelData(0);
		let b0 = 0,
			b1 = 0,
			b2 = 0,
			b3 = 0,
			b4 = 0,
			b5 = 0,
			b6 = 0;
		for (let i = 0; i < noiseLength; i++) {
			const white = Math.random() * 2 - 1;
			b0 = 0.99886 * b0 + white * 0.0555179;
			b1 = 0.99332 * b1 + white * 0.0750759;
			b2 = 0.969 * b2 + white * 0.153852;
			b3 = 0.8665 * b3 + white * 0.3104856;
			b4 = 0.55 * b4 + white * 0.5329522;
			b5 = -0.7616 * b5 - white * 0.016898;
			output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.02;
			b6 = white * 0.115926;
		}

		this.noiseNode = this.ctx.createBufferSource();
		this.noiseNode.buffer = noiseBuffer;
		this.noiseNode.loop = true;

		const noiseFilter = this.ctx.createBiquadFilter();
		noiseFilter.type = 'bandpass';
		noiseFilter.frequency.setValueAtTime(360, this.ctx.currentTime);
		noiseFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

		this.noiseGain = this.ctx.createGain();
		this.noiseGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

		this.noiseNode.connect(noiseFilter);
		noiseFilter.connect(this.noiseGain);
		this.noiseGain.connect(this.ambientGain);
		this.noiseNode.start();
	}

	/**
	 * Crossfade to another category smoothly over 1.4 seconds.
	 */
	setCategory(category: BiosphereType): void {
		if (this.activeCategory === category || !this.ctx) {
			this.activeCategory = category;
			return;
		}

		const now = this.ctx.currentTime;
		const fadeDuration = 1.4;

		// Fade out previous category
		const prevGain = this.categoryGains.get(this.activeCategory);
		if (prevGain) {
			prevGain.gain.cancelScheduledValues(now);
			prevGain.gain.setValueAtTime(prevGain.gain.value, now);
			prevGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeDuration);
		}

		// Fade in next category
		const nextGain = this.categoryGains.get(category);
		if (nextGain) {
			nextGain.gain.cancelScheduledValues(now);
			nextGain.gain.setValueAtTime(Math.max(nextGain.gain.value, 0.0001), now);
			nextGain.gain.exponentialRampToValueAtTime(0.8, now + fadeDuration);
		}

		this.activeCategory = category;

		// Trigger welcome harmonic chime for the new category
		this.triggerCategoryChime(category);
	}

	/**
	 * Periodic subtle generative musical triggers tailored to the active category.
	 */
	private startGenerativeScheduler(): void {
		const scheduleNext = () => {
			if (!this.ctx) return;
			const delay = 4000 + Math.random() * 5000; // 4 to 9 seconds
			this.categoryLoopTimer = window.setTimeout(() => {
				if (this.isInitialized && !this.isMuted) {
					this.playProceduralAmbientNote();
				}
				scheduleNext();
			}, delay);
		};
		scheduleNext();
	}

	private playProceduralAmbientNote(): void {
		switch (this.activeCategory) {
			case 'bonsai':
				this.triggerBonsaiPluck(false);
				break;
			case 'terrarium':
				this.triggerGlassChime(false);
				break;
			case 'aquarium':
				this.triggerBubble(false);
				break;
			case 'plantarium':
				this.triggerBloomHarmonic(false);
				break;
		}
	}

	/**
	 * 1. Bonsai Sound: Warm wooden koto / plucked acoustic string in Hirajoshi scale.
	 * Uses filtered sine + triangle blend with smooth warm decay.
	 */
	triggerBonsaiPluck(isInteraction = true): void {
		if (!this.ctx) return;
		const now = this.ctx.currentTime;
		const scale = SCALES.hirajoshi.notes;
		const note = scale[Math.floor(Math.random() * scale.length)];
		const freq = this.noteToFreq(note);

		const osc1 = this.ctx.createOscillator();
		osc1.type = 'sine';
		osc1.frequency.setValueAtTime(freq, now);

		const osc2 = this.ctx.createOscillator();
		osc2.type = 'triangle';
		osc2.frequency.setValueAtTime(freq * 1.002, now);

		const filter = this.ctx.createBiquadFilter();
		filter.type = 'lowpass';
		filter.Q.setValueAtTime(0.9, now);
		filter.frequency.setValueAtTime(freq * 2.2, now);
		filter.frequency.exponentialRampToValueAtTime(freq * 0.7, now + (isInteraction ? 2.0 : 2.8));

		const oscGain1 = this.ctx.createGain();
		oscGain1.gain.setValueAtTime(0.7, now);
		const oscGain2 = this.ctx.createGain();
		oscGain2.gain.setValueAtTime(0.3, now);

		osc1.connect(oscGain1);
		osc2.connect(oscGain2);
		oscGain1.connect(filter);
		oscGain2.connect(filter);

		const gain = this.ctx.createGain();
		const volume = isInteraction ? 0.16 : 0.08;
		gain.gain.setValueAtTime(0.0001, now);
		gain.gain.linearRampToValueAtTime(volume, now + 0.025);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + (isInteraction ? 2.4 : 3.2));

		filter.connect(gain);

		const catGain = this.categoryGains.get('bonsai') || this.masterGain!;
		gain.connect(catGain);
		if (this.reverbNode) gain.connect(this.reverbNode);

		osc1.start(now);
		osc2.start(now);
		osc1.stop(now + 3.4);
		osc2.stop(now + 3.4);
	}

	/**
	 * 2. Terrarium Sound: Inharmonic crystalline bell & glass marimba in Pentatonic Minor.
	 * Rich crystal partials with gentle ASMR water droplet.
	 */
	triggerGlassChime(isInteraction = true): void {
		if (!this.ctx) return;
		const now = this.ctx.currentTime;
		const scale = SCALES.pentatonic_minor.notes;
		const note = scale[Math.floor(Math.random() * scale.length)];
		const baseFreq = this.noteToFreq(note);

		// Inharmonic partials for resonant quartz / crystal glass
		const partials = [1.0, 2.76, 5.404];
		const catGain = this.categoryGains.get('terrarium') || this.masterGain!;

		for (let i = 0; i < partials.length; i++) {
			const osc = this.ctx.createOscillator();
			osc.type = 'sine';
			osc.frequency.setValueAtTime(baseFreq * partials[i], now);

			const filter = this.ctx.createBiquadFilter();
			filter.type = 'lowpass';
			filter.frequency.setValueAtTime(4500, now);
			filter.Q.setValueAtTime(0.7, now);

			const gain = this.ctx.createGain();
			const vol = (isInteraction ? 0.14 : 0.07) * Math.pow(0.45, i);
			gain.gain.setValueAtTime(0.0001, now);
			gain.gain.linearRampToValueAtTime(vol, now + 0.015);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + (isInteraction ? 2.2 : 3.0));

			osc.connect(filter);
			filter.connect(gain);
			gain.connect(catGain);
			if (this.reverbNode) gain.connect(this.reverbNode);

			osc.start(now);
			osc.stop(now + 3.1);
		}

		// Subtle ASMR water ping on user tap
		if (isInteraction) {
			this.triggerWaterDroplet(now + 0.06);
		}
	}

	private triggerWaterDroplet(startTime: number): void {
		if (!this.ctx) return;
		const osc = this.ctx.createOscillator();
		osc.type = 'sine';
		osc.frequency.setValueAtTime(480, startTime);
		osc.frequency.exponentialRampToValueAtTime(860, startTime + 0.035);
		osc.frequency.exponentialRampToValueAtTime(420, startTime + 0.15);

		const filter = this.ctx.createBiquadFilter();
		filter.type = 'lowpass';
		filter.frequency.setValueAtTime(1200, startTime);

		const gain = this.ctx.createGain();
		gain.gain.setValueAtTime(0.0001, startTime);
		gain.gain.linearRampToValueAtTime(0.08, startTime + 0.015);
		gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.2);

		osc.connect(filter);
		filter.connect(gain);
		gain.connect(this.categoryGains.get('terrarium') || this.masterGain!);
		if (this.reverbNode) gain.connect(this.reverbNode);

		osc.start(startTime);
		osc.stop(startTime + 0.22);
	}

	/**
	 * 3. Aquarium Sound: Submerged organic air bubble pop with gentle resonant cavity.
	 */
	triggerBubble(isInteraction = true): void {
		if (!this.ctx) return;
		const now = this.ctx.currentTime;
		const count = isInteraction ? 2 : 1;
		const catGain = this.categoryGains.get('aquarium') || this.masterGain!;

		for (let i = 0; i < count; i++) {
			const delay = i * 0.14;
			const startT = now + delay;
			const baseF = 160 + Math.random() * 50;
			const endF = baseF * (1.5 + Math.random() * 0.35);

			const osc = this.ctx.createOscillator();
			osc.type = 'sine';
			osc.frequency.setValueAtTime(baseF, startT);
			osc.frequency.exponentialRampToValueAtTime(endF, startT + 0.1);

			const bpFilter = this.ctx.createBiquadFilter();
			bpFilter.type = 'bandpass';
			bpFilter.frequency.setValueAtTime(280, startT);
			bpFilter.Q.setValueAtTime(1.5, startT);

			const gain = this.ctx.createGain();
			const vol = isInteraction ? 0.12 : 0.06;
			gain.gain.setValueAtTime(0.0001, startT);
			gain.gain.linearRampToValueAtTime(vol, startT + 0.015);
			gain.gain.exponentialRampToValueAtTime(0.0001, startT + 0.14);

			osc.connect(bpFilter);
			bpFilter.connect(gain);
			gain.connect(catGain);
			if (this.reverbNode) gain.connect(this.reverbNode);

			osc.start(startT);
			osc.stop(startT + 0.18);
		}
	}

	/**
	 * 4. Plantarium Sound: Warm analog blooming chord in Major Pentatonic / Lydian.
	 * Soft triangle envelopes with breathing lowpass resonance.
	 */
	triggerBloomHarmonic(isInteraction = true): void {
		if (!this.ctx) return;
		const now = this.ctx.currentTime;
		const scale = SCALES.pentatonic_major.notes;
		const notes = [
			scale[Math.floor(Math.random() * 3)],
			scale[3 + Math.floor(Math.random() * 3)],
			scale[5 + Math.floor(Math.random() * 3)]
		];

		const catGain = this.categoryGains.get('plantarium') || this.masterGain!;

		notes.forEach((note, idx) => {
			if (!this.ctx) return;
			const noteTime = now + (isInteraction ? idx * 0.1 : 0);
			const freq = this.noteToFreq(note);

			const osc = this.ctx.createOscillator();
			osc.type = 'triangle';
			osc.frequency.setValueAtTime(freq, noteTime);

			const filter = this.ctx.createBiquadFilter();
			filter.type = 'lowpass';
			filter.Q.setValueAtTime(1.2, noteTime);
			filter.frequency.setValueAtTime(freq * 1.2, noteTime);
			filter.frequency.exponentialRampToValueAtTime(freq * 2.5, noteTime + 0.5);
			filter.frequency.exponentialRampToValueAtTime(freq * 0.9, noteTime + 2.8);

			const gain = this.ctx.createGain();
			const vol = isInteraction ? 0.09 : 0.05;
			gain.gain.setValueAtTime(0.0001, noteTime);
			gain.gain.linearRampToValueAtTime(vol, noteTime + 0.14);
			gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 3.0);

			osc.connect(filter);
			filter.connect(gain);
			gain.connect(catGain);
			if (this.reverbNode) gain.connect(this.reverbNode);

			osc.start(noteTime);
			osc.stop(noteTime + 3.2);
		});
	}

	private triggerCategoryChime(category: BiosphereType): void {
		switch (category) {
			case 'bonsai':
				this.triggerBonsaiPluck(true);
				break;
			case 'terrarium':
				this.triggerGlassChime(true);
				break;
			case 'aquarium':
				this.triggerBubble(true);
				break;
			case 'plantarium':
				this.triggerBloomHarmonic(true);
				break;
		}
	}

	setMasterVolume(vol: number): void {
		this.masterVolume = Math.max(0, Math.min(1, vol));
		if (!this.ctx || !this.masterGain) return;
		const now = this.ctx.currentTime;
		this.masterGain.gain.cancelScheduledValues(now);
		this.masterGain.gain.linearRampToValueAtTime(
			this.isMuted ? 0.0001 : this.masterVolume,
			now + 0.05
		);
	}

	toggleMute(): boolean {
		this.isMuted = !this.isMuted;
		if (!this.ctx || !this.masterGain) return this.isMuted;
		const now = this.ctx.currentTime;
		this.masterGain.gain.cancelScheduledValues(now);
		this.masterGain.gain.linearRampToValueAtTime(
			this.isMuted ? 0.0001 : this.masterVolume,
			now + 0.05
		);
		return this.isMuted;
	}

	private noteToFreq(note: string): number {
		const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
		const match = note.match(/^([A-G][b#]?)([0-9])$/);
		if (!match) return 440;
		const noteName = match[1];
		const octave = parseInt(match[2], 10);
		const semitone = notes.indexOf(noteName);
		// A4 is 432 Hz Pythagorean / Contemplative base (432 * 2^((n - 69)/12))
		const midi = (octave + 1) * 12 + semitone;
		return 432 * Math.pow(2, (midi - 69) / 12);
	}

	dispose(): void {
		if (this.categoryLoopTimer !== null) {
			clearTimeout(this.categoryLoopTimer);
			this.categoryLoopTimer = null;
		}
		for (const osc of this.ambientOscs) {
			try {
				osc.stop();
				osc.disconnect();
			} catch {
				// Ignore cleanup errors
			}
		}
		this.ambientOscs = [];
		if (this.ambientLfo) {
			try {
				this.ambientLfo.stop();
				this.ambientLfo.disconnect();
			} catch {
				// Ignore cleanup errors
			}
		}
		if (this.noiseNode) {
			try {
				this.noiseNode.stop();
				this.noiseNode.disconnect();
			} catch {
				// Ignore cleanup errors
			}
		}
		if (this.ctx && this.ctx.state !== 'closed') {
			void this.ctx.close();
		}
		this.isInitialized = false;
	}
}

export const proceduralAudio = new ProceduralAudioEngine();
