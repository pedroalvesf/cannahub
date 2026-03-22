/**
 * Labels centralizados para exibição de valores do banco.
 * Usado em dashboard, admin, e qualquer página que exiba dados do paciente.
 *
 * Ao adicionar uma nova condição, forma de uso ou tipo de conta,
 * basta atualizar aqui — todas as páginas refletem automaticamente.
 */

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  patient: 'Paciente Adulto',
  guardian: 'Responsável Legal',
  prescriber: 'Médico Prescritor',
  veterinarian: 'Veterinário',
  caregiver: 'Cuidador',
}

export const ACCOUNT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
}

export const ONBOARDING_STATUS_LABELS: Record<string, string> = {
  not_started: 'Não iniciado',
  in_progress: 'Em andamento',
  completed: 'Completo',
  awaiting_prescription: 'Aguardando receita',
  escalated: 'Escalado',
}

export const DOCUMENTS_STATUS_LABELS: Record<string, string> = {
  not_submitted: 'Não enviados',
  pending_review: 'Aguardando revisão',
  approved: 'Aprovados',
  rejected: 'Rejeitados',
}

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  prescription: 'Receita Médica',
  medical_report: 'Laudo Médico',
  id_document: 'RG / CNH',
  proof_of_residence: 'Comprovante de Residência',
}

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
}

export const CONDITION_LABELS: Record<string, string> = {
  chronic_pain: 'Dor Crônica',
  anxiety: 'Ansiedade',
  depression: 'Depressão',
  insomnia: 'Insônia',
  epilepsy: 'Epilepsia',
  autism: 'Autismo / TEA',
  parkinsons: 'Parkinson',
  multiple_sclerosis: 'Esclerose Múltipla',
  fibromyalgia: 'Fibromialgia',
  nausea: 'Náusea / Apetite',
  adhd: 'TDAH',
  ptsd: 'PTSD',
  veterinary: 'Uso Veterinário',
}

export const EXPERIENCE_LABELS: Record<string, string> = {
  never: 'Nunca usei',
  less_than_6m: 'Menos de 6 meses',
  '6m_to_1y': '6 meses a 1 ano',
  '1y_to_3y': '1 a 3 anos',
  more_than_3y: 'Mais de 3 anos',
}

export const FORM_LABELS: Record<string, string> = {
  sublingual_oil: 'Óleo sublingual',
  vaporization: 'Vaporização',
  smoking: 'Fumo',
  topical: 'Uso tópico',
  capsule: 'Cápsula',
  edible: 'Comestível',
}

export const ACCESS_METHOD_LABELS: Record<string, string> = {
  regulated_association: 'Associação regulamentada',
  anvisa_import: 'Importação via Anvisa',
  informal: 'Acesso informal',
  self_cultivation: 'Autocultivo',
  not_accessing: 'Ainda não acessa',
}

/**
 * Converte valor multi-select (CSV) para string legível.
 * Ex: "anxiety,depression" → "Ansiedade, Depressão"
 */
export function formatMultiSelect(value: string | undefined, labels: Record<string, string>): string {
  if (!value) return '—'
  return value.split(',').map((v) => labels[v.trim()] ?? v.trim()).join(', ')
}

/**
 * Classes CSS para badges de status.
 */
export const STATUS_BADGE_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  pending_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  not_started: 'bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400',
  not_submitted: 'bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  awaiting_prescription: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  escalated: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
}
