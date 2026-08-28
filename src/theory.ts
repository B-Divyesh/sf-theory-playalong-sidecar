export const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'] as const;
export const KEYS = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'] as const;
export type Mode = 'major' | 'minor';

const SCALES: Record<Mode, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10]
};

const DEGREE_NAMES = ['1', '2', '3', '4', '5', '6', '7'];
const ROMAN: Record<Mode, string[]> = {
  major: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
  minor: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']
};

export interface NoteContext {
  name: string;
  pitchClass: number;
  inKey: boolean;
  degree: string | null;
  chords: Chord[];
}

export interface Chord {
  symbol: string;
  notes: number[];
  rootName: string;
}

export function pitchClass(note: number): number {
  return ((note % 12) + 12) % 12;
}

export function keyRoot(key: string): number {
  return NOTE_NAMES.indexOf(key as (typeof NOTE_NAMES)[number]);
}

export function scalePitches(key: string, mode: Mode): number[] {
  const root = keyRoot(key);
  return SCALES[mode].map(interval => (root + interval) % 12);
}

export function chordsForKey(key: string, mode: Mode): Chord[] {
  const scale = scalePitches(key, mode);
  return scale.map((root, index) => ({
    symbol: `${NOTE_NAMES[root]}${ROMAN[mode][index].includes('°') ? '°' : ROMAN[mode][index] === ROMAN[mode][index].toLowerCase() ? 'm' : ''}`,
    rootName: ROMAN[mode][index],
    notes: [root, scale[(index + 2) % 7], scale[(index + 4) % 7]]
  }));
}

export function noteContext(note: number, key: string, mode: Mode): NoteContext {
  const pc = pitchClass(note);
  const scale = scalePitches(key, mode);
  const index = scale.indexOf(pc);
  return {
    name: NOTE_NAMES[pc],
    pitchClass: pc,
    inKey: index >= 0,
    degree: index >= 0 ? DEGREE_NAMES[index] : null,
    chords: chordsForKey(key, mode).filter(chord => chord.notes.includes(pc))
  };
}

export function frequencyForMidi(note: number): number {
  return 440 * 2 ** ((note - 69) / 12);
}
