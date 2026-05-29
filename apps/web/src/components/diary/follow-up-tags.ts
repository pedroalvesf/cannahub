export interface QuickTag {
  key: string
  label: string
  type?: 'positive' | 'negative' | 'neutral'
}

// Tags rápidas exibidas no follow-up. Cada condição tem seu conjunto;
// se não houver mapeamento, usamos o conjunto default.
export const DEFAULT_TAGS: QuickTag[] = [
  { key: 'as_expected', label: 'Como esperado', type: 'positive' },
  { key: 'better_than_expected', label: 'Melhor que esperado', type: 'positive' },
  { key: 'mild_effect', label: 'Efeito leve', type: 'neutral' },
  { key: 'no_effect', label: 'Sem efeito', type: 'negative' },
  { key: 'unexpected_effect', label: 'Efeito inesperado', type: 'negative' },
]

export const FOLLOW_UP_TAGS_BY_CONDITION: Record<string, QuickTag[]> = {
  insomnia: [
    { key: 'slept_well', label: 'Dormi bem', type: 'positive' },
    { key: 'slept_deep', label: 'Sono profundo', type: 'positive' },
    { key: 'fell_asleep_fast', label: 'Peguei no sono rápido', type: 'positive' },
    { key: 'woke_up_rested', label: 'Acordei descansado(a)', type: 'positive' },
    { key: 'vivid_dreams', label: 'Sonhos vívidos', type: 'neutral' },
    { key: 'struggled_to_sleep', label: 'Custei a dormir', type: 'negative' },
    { key: 'woke_up_several_times', label: 'Acordei várias vezes', type: 'negative' },
    { key: 'woke_up_too_early', label: 'Acordei muito cedo', type: 'negative' },
    { key: 'groggy_morning', label: 'Acordei grogue', type: 'negative' },
  ],
  anxiety: [
    { key: 'more_calm', label: 'Mais calmo(a)', type: 'positive' },
    { key: 'less_tense', label: 'Menos tenso(a)', type: 'positive' },
    { key: 'mind_quieter', label: 'Mente mais quieta', type: 'positive' },
    { key: 'still_anxious', label: 'Ainda ansioso(a)', type: 'negative' },
    { key: 'paranoid', label: 'Senti paranoia', type: 'negative' },
    { key: 'panic', label: 'Tive crise', type: 'negative' },
  ],
  chronic_pain: [
    { key: 'pain_reduced', label: 'Dor reduziu', type: 'positive' },
    { key: 'easier_to_move', label: 'Mais fácil me mexer', type: 'positive' },
    { key: 'better_sleep', label: 'Dormi melhor', type: 'positive' },
    { key: 'pain_returned', label: 'Dor voltou em poucas horas', type: 'negative' },
    { key: 'no_pain_relief', label: 'Sem alívio', type: 'negative' },
    { key: 'pain_worse', label: 'Piorou', type: 'negative' },
  ],
  depression: [
    { key: 'mood_better', label: 'Humor melhor', type: 'positive' },
    { key: 'more_motivated', label: 'Mais motivado(a)', type: 'positive' },
    { key: 'more_present', label: 'Mais presente', type: 'positive' },
    { key: 'still_low', label: 'Ainda triste', type: 'negative' },
    { key: 'more_apathy', label: 'Mais apatia', type: 'negative' },
  ],
  epilepsy: [
    { key: 'no_seizures', label: 'Sem crises', type: 'positive' },
    { key: 'fewer_seizures', label: 'Menos crises', type: 'positive' },
    { key: 'shorter_seizures', label: 'Crises mais curtas', type: 'positive' },
    { key: 'aura_only', label: 'Apenas aura', type: 'neutral' },
    { key: 'seizure_happened', label: 'Tive uma crise', type: 'negative' },
  ],
  nausea: [
    { key: 'nausea_reduced', label: 'Náusea reduziu', type: 'positive' },
    { key: 'ate_well', label: 'Consegui comer', type: 'positive' },
    { key: 'still_nauseous', label: 'Ainda com náusea', type: 'negative' },
    { key: 'vomited', label: 'Vomitei', type: 'negative' },
  ],
}

export function getTagsForCondition(condition?: string | null): QuickTag[] {
  if (!condition) return DEFAULT_TAGS
  const keys = condition.split(',').map((c) => c.trim()).filter(Boolean)
  const collected: QuickTag[] = []
  const seen = new Set<string>()
  for (const key of keys) {
    const tags = FOLLOW_UP_TAGS_BY_CONDITION[key] ?? []
    for (const t of tags) {
      if (!seen.has(t.key)) {
        seen.add(t.key)
        collected.push(t)
      }
    }
  }
  if (collected.length === 0) return DEFAULT_TAGS
  // Sempre acrescenta default no final para dar opção genérica
  for (const t of DEFAULT_TAGS) {
    if (!seen.has(t.key)) collected.push(t)
  }
  return collected
}
