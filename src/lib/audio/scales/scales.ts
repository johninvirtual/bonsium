export type MusicalScaleName =
	'hirajoshi' | 'pentatonic_major' | 'pentatonic_minor' | 'dorian' | 'lydian';

export interface MusicalScale {
	name: MusicalScaleName;
	rootNote: string;
	notes: string[];
	description: string;
}

export const SCALES: Record<MusicalScaleName, MusicalScale> = {
	hirajoshi: {
		name: 'hirajoshi',
		rootNote: 'C4',
		notes: ['C4', 'Db4', 'F4', 'G4', 'Ab4', 'C5', 'Db5', 'F5'],
		description: 'Traditional Japanese pentatonic scale for Bonsai contemplation'
	},
	pentatonic_major: {
		name: 'pentatonic_major',
		rootNote: 'G3',
		notes: ['G3', 'A3', 'B3', 'D4', 'E4', 'G4', 'A4', 'B4', 'D5'],
		description: 'Uplifting organic major scale for Plantarium bloom'
	},
	pentatonic_minor: {
		name: 'pentatonic_minor',
		rootNote: 'A3',
		notes: ['A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5'],
		description: 'Mellow resonance for enclosed Terrarium glass harmonics'
	},
	dorian: {
		name: 'dorian',
		rootNote: 'D3',
		notes: ['D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4'],
		description: 'Modal aquatic depth for submerged Aquarium ambient soundscapes'
	},
	lydian: {
		name: 'lydian',
		rootNote: 'F3',
		notes: ['F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4'],
		description: 'Ethereal floating harmony for caustic water reflections'
	}
};
