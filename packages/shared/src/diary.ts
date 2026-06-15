// --- Diary Enums ---

export enum AdministrationMethod {
  OIL = 'oil',
  FLOWER = 'flower',
  VAPE = 'vape',
  EDIBLE = 'edible',
  TOPICAL = 'topical',
  CAPSULE = 'capsule',
  OTHER = 'other',
}

export enum DoseUnit {
  DROPS = 'drops',
  ML = 'ml',
  MG = 'mg',
  G = 'g',
  PUFFS = 'puffs',
  UNITS = 'units',
}

// Severidade agora segue escala numérica clínica 0..10 (NRS).
// 0 = nenhuma, 5 = moderada, 10 = pior possível.
export type SymptomSeverityScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export const SEVERITY_MIN = 0
export const SEVERITY_MAX = 10

// --- Predefined Lists ---

export const PREDEFINED_SYMPTOMS = [
  'pain',
  'anxiety',
  'insomnia',
  'nausea',
  'inflammation',
  'fatigue',
  'depression',
  'appetite_loss',
  'headache',
  'muscle_spasm',
  'stress',
  'ptsd',
] as const

export type PredefinedSymptom = (typeof PREDEFINED_SYMPTOMS)[number]

export const PREDEFINED_EFFECTS_POSITIVE = [
  'relaxed',
  'pain_relief',
  'sleepy',
  'calm',
  'focused',
  'euphoric',
  'hungry',
  'creative',
  'energized',
] as const

export type PredefinedEffectPositive = (typeof PREDEFINED_EFFECTS_POSITIVE)[number]

export const PREDEFINED_EFFECTS_NEGATIVE = [
  'dry_mouth',
  'dizzy',
  'paranoia',
  'anxious',
  'headache',
  'nausea',
  'drowsy',
  'red_eyes',
] as const

export type PredefinedEffectNegative = (typeof PREDEFINED_EFFECTS_NEGATIVE)[number]
