import type { BiosphereType } from '#lib/audio/bus/event-bus';
import type { MusicalScaleName } from '#lib/audio/scales/scales';
import { proceduralAudio } from '#lib/audio/engine/procedural-audio';

export type ThemeMode = 'auto' | 'light' | 'dark';

export interface BiosphereItemInfo {
	id: string;
	title: string;
	subtitle: string;
	lore: string;
	scaleName: MusicalScaleName;
	instrumentLore: string;
}

export const BIOSPHERE_ITEMS: Record<BiosphereType, BiosphereItemInfo[]> = {
	bonsai: [
		{
			id: 'bonsai-pine',
			title: 'Contemplative Pine Bonsai',
			subtitle: 'Gnarled Wood & Nebari Roots',
			lore: 'An ancient miniature pine sculpted over generations in an unglazed Japanese ceramic dish with exposed nebari root flare and moss mounds.',
			scaleName: 'hirajoshi',
			instrumentLore: 'Japanese Koto wooden string physical modeling in Hirajoshi tuning'
		},
		{
			id: 'bonsai-sakura',
			title: 'Flowering Sakura Bonsai',
			subtitle: 'Cherry Blossoms & Falling Petals',
			lore: 'An elegant curving cherry blossom tree housed in a white ceramic glazed oval pot, showering soft pink sakura petals into the breeze.',
			scaleName: 'hirajoshi',
			instrumentLore: 'Acoustic bamboo koto resonance with delicate harmonic overtone decays'
		},
		{
			id: 'bonsai-juniper',
			title: 'Windswept Juniper Bonsai',
			subtitle: 'Alpine Winds & Sculpted Deadwood',
			lore: 'A dramatically leaning Fukinagashi juniper sculpted by high alpine mountain gusts, featuring bleached white Shari ribbons and trailing cyan foliage pads.',
			scaleName: 'hirajoshi',
			instrumentLore: 'Resonant temple wood block strikes and sweeping wind filter envelopes'
		}
	],
	terrarium: [
		{
			id: 'terrarium-moss',
			title: 'Living Moss & Quartz Dome',
			subtitle: 'Crawling Snail & Fireflies',
			lore: 'A sealed glass ecosystem layered with volcanic gravel, velvet moss cushions, raw quartz crystal spikes, a living miniature garden snail, and glowing fireflies.',
			scaleName: 'pentatonic_minor',
			instrumentLore:
				'Crystalline inharmonic bells and gentle ASMR water droplet condensation pings'
		},
		{
			id: 'terrarium-desert',
			title: 'Desert Sandstone & Saguaro',
			subtitle: 'Layered Colored Sands & Heat Motes',
			lore: 'Faceted geometric glass terrarium with brass edges housing terracotta and ochre desert sands, weathered sandstone, and a blossoming saguaro cactus.',
			scaleName: 'pentatonic_minor',
			instrumentLore: 'Resonant glass marimba and high-frequency quartz shimmer'
		},
		{
			id: 'terrarium-carnivorous',
			title: 'Carnivorous Pitcher & Sundew',
			subtitle: 'Nepenthes Cups & Dew Droplets',
			lore: 'A bog cloche terrarium featuring tropical crimson Nepenthes pitchers with peristome collars and glistening Drosera sundew rosettes in rich sphagnum moss.',
			scaleName: 'pentatonic_minor',
			instrumentLore: 'Hollow wooden resonant chimes and ambient liquid plop textures'
		}
	],
	aquarium: [
		{
			id: 'aquarium-freshwater',
			title: 'Freshwater River Grass Tank',
			subtitle: 'Vallisneria, Driftwood & Schooling Tropicals',
			lore: 'A peaceful cylindrical aquarium with undulating Vallisneria water grass, arching bogwood, river pebbles, and five colorful schooling tropical fish.',
			scaleName: 'dorian',
			instrumentLore: 'Submerged lowpass ambient pad and organic acoustic air bubble pops'
		},
		{
			id: 'aquarium-coral',
			title: 'Coral Reef & Anemone Lagoon',
			subtitle: 'Staghorn Corals & Clownfish',
			lore: 'White coral sand seabed with vibrant branching staghorn coral, purple shelf formations, a waving sea anemone, and darting clownfish and blue tangs.',
			scaleName: 'dorian',
			instrumentLore: 'Modal Dorian oceanic chords and submerged liquid resonance'
		},
		{
			id: 'aquarium-jellyfish',
			title: 'Moon Jellyfish Abyssal Tank',
			subtitle: 'Hydro-Pulsing Jellies & Marine Snow',
			lore: 'Deep abyssal sapphire aquarium housing translucent Moon Jellyfish (Aurelia aurita) hydro-pulsing in rhythmic contractions amid drifting marine snow.',
			scaleName: 'dorian',
			instrumentLore: 'Deep oceanic sub-bass pad and resonant water chamber harmonics'
		}
	],
	plantarium: [
		{
			id: 'plantarium-lotus',
			title: 'Radiant Sacred Lotus',
			subtitle: 'True Radial Bloom & Solar Spores',
			lore: 'A celadon pedestal basin with floating dewy lily pads and a multi-tiered sacred lotus exhibiting true radial symmetry as it gently breathes.',
			scaleName: 'pentatonic_major',
			instrumentLore: 'Warm analog resonant filter bloom chords and golden shimmer bells'
		},
		{
			id: 'plantarium-fern',
			title: 'Fern Canopy & Wild Orchid',
			subtitle: 'Basalt Rock & Cascading Fronds',
			lore: 'Volcanic basalt pedestal hosting arching maidenhair fern fronds and a delicate blooming wild violet orchid with shimmering green spores.',
			scaleName: 'pentatonic_major',
			instrumentLore: 'Lydian harmonic blooms and acoustic glass bell overtones'
		},
		{
			id: 'plantarium-cereus',
			title: 'Night-Blooming Cereus',
			subtitle: 'Queen of the Night Starburst',
			lore: 'An exotic midnight-blooming starburst flower with slender white-gold lanceolate petals, radiating golden stamens, and phosphorescent spores.',
			scaleName: 'pentatonic_major',
			instrumentLore: 'Ethereal celestial glass harmonica swells and nocturnal ambient pads'
		}
	]
};

class WorldState {
	theme = $state<ThemeMode>('auto');
	activeThemeActual = $state<'light' | 'dark'>('dark');

	activeBiosphere = $state<BiosphereType>('bonsai');
	// Per-category active item indices
	private activeIndices = $state<Record<BiosphereType, number>>({
		bonsai: 0,
		terrarium: 0,
		aquarium: 0,
		plantarium: 0
	});

	isAudioInitialized = $state<boolean>(false);
	isMuted = $state<boolean>(false);
	masterVolume = $state<number>(0.75);
	hudVisible = $state<boolean>(true);
	breatheMode = $state<boolean>(false);
	prefersReducedMotion = $state<boolean>(false);
	announcement = $state<string>('');

	activeItemIndex = $derived.by(() => this.activeIndices[this.activeBiosphere] ?? 0);

	activeItemsList = $derived.by(() => BIOSPHERE_ITEMS[this.activeBiosphere]);

	activeItem = $derived.by(() => {
		const list = this.activeItemsList;
		return list[this.activeItemIndex] ?? list[0];
	});

	biosphereTitle = $derived.by(() => this.activeItem.title);
	currentScale = $derived.by(() => this.activeItem.scaleName);

	initTheme() {
		if (typeof window === 'undefined') return;

		// Load saved theme preference
		const saved = localStorage.getItem('bonsium_theme') as ThemeMode | null;
		if (saved && (saved === 'auto' || saved === 'light' || saved === 'dark')) {
			this.theme = saved;
		}

		this.evaluateTheme();

		// Listen to system OS color scheme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', () => {
			if (this.theme === 'auto') {
				this.evaluateTheme();
			}
		});

		// Check reduced motion preference
		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		this.prefersReducedMotion = motionQuery.matches;
		motionQuery.addEventListener('change', (e) => {
			this.prefersReducedMotion = e.matches;
		});
	}

	setTheme(newTheme: ThemeMode) {
		this.theme = newTheme;
		if (typeof window !== 'undefined') {
			localStorage.setItem('bonsium_theme', newTheme);
		}
		this.evaluateTheme();
		this.announce(`Theme set to ${newTheme}`);
	}

	private evaluateTheme() {
		if (typeof window === 'undefined') return;

		const resolved: 'light' | 'dark' =
			this.theme === 'auto'
				? window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light'
				: this.theme;

		this.activeThemeActual = resolved;

		const root = document.documentElement;
		if (resolved === 'dark') {
			root.classList.add('dark');
			root.setAttribute('data-theme', 'dark');
		} else {
			root.classList.remove('dark');
			root.setAttribute('data-theme', 'light');
		}
	}

	switchBiosphere(next: BiosphereType) {
		this.activeBiosphere = next;
		proceduralAudio.setCategory(next);
		this.announce(`Switched to ${next} biosphere: ${this.activeItem.title}`);
	}

	selectItem(index: number) {
		if (index >= 0 && index < this.activeItemsList.length) {
			this.activeIndices[this.activeBiosphere] = index;
			this.triggerCategorySound();
			this.announce(`Selected variant ${index + 1}: ${this.activeItem.title}`);
		}
	}

	triggerCategorySound() {
		switch (this.activeBiosphere) {
			case 'bonsai':
				proceduralAudio.triggerBonsaiPluck(true);
				break;
			case 'terrarium':
				proceduralAudio.triggerGlassChime(true);
				break;
			case 'aquarium':
				proceduralAudio.triggerBubble(true);
				break;
			case 'plantarium':
				proceduralAudio.triggerBloomHarmonic(true);
				break;
		}
	}

	toggleMute() {
		this.isMuted = proceduralAudio.toggleMute();
		this.announce(this.isMuted ? 'Audio muted' : 'Audio unmuted');
	}

	setVolume(vol: number) {
		this.masterVolume = vol;
		proceduralAudio.setMasterVolume(vol);
	}

	toggleHud() {
		this.hudVisible = !this.hudVisible;
		this.announce(this.hudVisible ? 'Zen HUD displayed' : 'Zen HUD hidden');
	}

	toggleBreatheMode() {
		this.breatheMode = !this.breatheMode;
		this.hudVisible = !this.breatheMode;
		this.announce(this.breatheMode ? 'Breathe mode entered' : 'Breathe mode exited');
	}

	announce(msg: string) {
		this.announcement = msg;
	}
}

export const worldState = new WorldState();
