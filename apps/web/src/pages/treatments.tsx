import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'

// ─── Types ──────────────────────────────────────────────────
type CategoryKey = 'all' | 'neuro' | 'mental' | 'pain' | 'onco'
type CardVariant = 'featured' | 'simple' | 'row'

interface ConditionCard {
  slug: string
  tag: string
  name: string
  tagline: string
  compound: string
  compoundBadge: string
  variant: CardVariant
  category: Exclude<CategoryKey, 'all'>
  icon: React.ReactNode
  large?: boolean
  /** imagem real para substituir o ícone SVG no card featured */
  heroImage?: string
}

// ─── Helper: slug → route ───────────────────────────────────
const slugToPath = (slug: string): string => {
  const existing = ['epilepsia', 'parkinson', 'esclerose-multipla', 'ansiedade', 'insonia', 'autismo', 'dor-cronica', 'oncologia', 'artrite', 'endometriose', 'nauseas-quimio', 'dor-oncologica']
  return existing.includes(slug) ? `/tratamentos/${slug}` : '/tratamentos'
}

// ─── SVG Icons (condition illustrations) ────────────────────
const icons = {
  epilepsia: (
    <svg viewBox="0 0 42 42" fill="none">
      <path d="M21 4 L12 20 H20 L18 38 L30 22 H22 Z" fill="#2D5520" stroke="#1E3A1F" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="8" cy="10" r="2" fill="#4A7C2F" opacity=".35"/>
      <circle cx="34" cy="32" r="2" fill="#4A7C2F" opacity=".35"/>
    </svg>
  ),
  parkinson: (
    <svg viewBox="0 0 26 26" fill="none">
      <path d="M7 17C7 17 6 15 6 12C6 9 7.5 7.5 9 7.5C9.8 7.5 10.2 8 10.2 8V6C10.2 5.17 10.87 4.5 11.7 4.5C12.53 4.5 13.2 5.17 13.2 6V8C13.2 7.17 13.87 6.5 14.7 6.5C15.53 6.5 16.2 7.17 16.2 8V9.5C16.2 8.67 16.87 8 17.7 8C18.53 8 19.2 8.67 19.2 9.5V14.5C19.2 17.81 16.51 20.5 13.2 20.5H10.5C8.5 20.5 7 17 7 17Z" stroke="#1E3A1F" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M3 10.5 C3.8 10 4.8 10.2 5.3 11" stroke="#1E3A1F" strokeWidth="1.2" strokeLinecap="round" opacity=".5"/>
      <path d="M3 13.5 C3.8 13 4.8 13.2 5.3 14" stroke="#1E3A1F" strokeWidth="1.2" strokeLinecap="round" opacity=".5"/>
    </svg>
  ),
  esclerose: (
    <svg viewBox="0 0 26 26" fill="none">
      <path d="M3 13 C5.5 9.5 7 16 9 13 C11 10 13 16 15 13 C17 10 19 16 21 13" stroke="#1E3A1F" strokeWidth="1.7" strokeLinecap="round"/>
      <circle cx="3" cy="13" r="1.8" fill="#2D5520"/>
      <circle cx="21" cy="13" r="1.8" fill="#2D5520"/>
    </svg>
  ),
  ansiedade: (
    <svg viewBox="0 0 42 42" fill="none">
      <path d="M5 21 C8 16 11 26 15 21 C19 16 22 26 26 21 C30 16 33 26 37 21" stroke="#1E4A7A" strokeWidth="2" strokeLinecap="round"/>
      <path d="M5 28 C8 25 11 31 15 28 C19 25 22 31 26 28 C30 25 33 31 37 28" stroke="#5B8DB8" strokeWidth="1.4" strokeLinecap="round" opacity=".45"/>
      <circle cx="21" cy="12" r="3.5" fill="#1E4A7A" opacity=".15"/>
      <circle cx="21" cy="12" r="1.8" fill="#1E4A7A" opacity=".5"/>
    </svg>
  ),
  insonia: (
    <svg viewBox="0 0 26 26" fill="none">
      <path d="M20 15A8 8 0 0 1 11 6 8 8 0 1 0 20 15Z" stroke="#1E4A7A" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M18 4L18.7 6 20.5 6 19 7.3 19.5 9.2 18 8 16.5 9.2 17 7.3 15.5 6 17.3 6Z" fill="#1E4A7A" opacity=".55"/>
    </svg>
  ),
  autismo: (
    <svg viewBox="0 0 26 26" fill="none">
      <path d="M4 4H11V7.5C12 7.5 13.5 8 13.5 9.5C13.5 11 12 11.5 11 11.5V15H4V11.5C3 11.5 1.5 11 1.5 9.5C1.5 8 3 7.5 4 7.5V4Z" stroke="#1E4A7A" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M11 15H4V22H11V19C11 18 11.5 16.5 13 16.5C14.5 16.5 15 18 15 19V22H22V15H19C18 15 16.5 14.5 16.5 13C16.5 11.5 18 11 19 11V4H15" stroke="#1E4A7A" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  dorCronica: (
    <svg viewBox="0 0 42 42" fill="none">
      <circle cx="21" cy="21" r="5.5" stroke="#7A3020" strokeWidth="1.8"/>
      <line x1="21" y1="21" x2="21" y2="7" stroke="#7A3020" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="21" y1="21" x2="32" y2="28" stroke="#7A3020" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="21" y1="21" x2="10" y2="28" stroke="#7A3020" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="21" cy="6" r="2" fill="#C04828"/>
      <circle cx="33" cy="29" r="2" fill="#C04828"/>
      <circle cx="9" cy="29" r="2" fill="#C04828"/>
      <line x1="18" y1="14" x2="15" y2="11" stroke="#C04828" strokeWidth="1" strokeLinecap="round" opacity=".45"/>
      <line x1="24" y1="14" x2="27" y2="11" stroke="#C04828" strokeWidth="1" strokeLinecap="round" opacity=".45"/>
    </svg>
  ),
  artrite: (
    <svg viewBox="0 0 26 26" fill="none">
      <ellipse cx="10" cy="8" rx="3.5" ry="4.5" stroke="#7A3020" strokeWidth="1.4"/>
      <ellipse cx="16" cy="18" rx="3.5" ry="4.5" stroke="#7A3020" strokeWidth="1.4"/>
      <path d="M9 12.5 Q13 11 17 13.5" stroke="#C04828" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  endometriose: (
    <svg viewBox="0 0 26 26" fill="none">
      <path d="M13 5C10 5 7 7.5 7 11C7 14.5 9 16 9 16L10.5 19.5H15.5L17 16C17 16 19 14.5 19 11C19 7.5 16 5 13 5Z" stroke="#7A3020" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M9 16C7.5 16 5.5 17 5.5 19.5" stroke="#7A3020" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M17 16C18.5 16 20.5 17 20.5 19.5" stroke="#7A3020" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="13" cy="10.5" r="2" stroke="#C04828" strokeWidth="1.2"/>
    </svg>
  ),
  paliativos: (
    <svg viewBox="0 0 42 42" fill="none">
      <path d="M21 4L8 9.5V19.5C8 27 14 33 21 36C28 33 34 27 34 19.5V9.5L21 4Z" fill="#F0EBF5" stroke="#4A2D7A" strokeWidth="1.7" strokeLinejoin="round"/>
      <line x1="21" y1="14" x2="21" y2="28" stroke="#4A2D7A" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="14" y1="21" x2="28" y2="21" stroke="#4A2D7A" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  ),
  nauseas: (
    <svg viewBox="0 0 26 26" fill="none">
      <rect x="5" y="9.5" width="16" height="7" rx="3.5" stroke="#4A2D7A" strokeWidth="1.4"/>
      <line x1="13" y1="9.5" x2="13" y2="16.5" stroke="#4A2D7A" strokeWidth="1.2" opacity=".35"/>
      <rect x="5" y="9.5" width="8" height="7" rx="3.5" fill="#4A2D7A" opacity=".12"/>
    </svg>
  ),
  dorOncologica: (
    <svg viewBox="0 0 26 26" fill="none">
      <path d="M13 2.5C13 2.5 5 6.5 5 13C5 17.42 8.58 21 13 21H13C17.42 21 21 17.42 21 13C21 6.5 13 2.5 13 2.5Z" stroke="#4A2D7A" strokeWidth="1.4" strokeLinejoin="round"/>
      <line x1="13" y1="21" x2="13" y2="13.5" stroke="#4A2D7A" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M13 18C13 18 10 16 9 13" stroke="#4A2D7A" strokeWidth="1.1" strokeLinecap="round" opacity=".55"/>
      <path d="M13 15C13 15 16 13 17 10" stroke="#4A2D7A" strokeWidth="1.1" strokeLinecap="round" opacity=".55"/>
    </svg>
  ),
}

// ─── Filter chip SVG icons ──────────────────────────────────
const chipIcons: Record<CategoryKey, React.ReactNode> = {
  all: (
    <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  neuro: (
    <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66Z"/>
    </svg>
  ),
  mental: (
    <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12C3 9 6 5 12 5C18 5 21 9 21 12C21 15 18 19 12 19C6 19 3 15 3 12Z"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
  pain: (
    <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  onco: (
    <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 6V12C4 16.42 7.56 20.57 12 22C16.44 20.57 20 16.42 20 12V6L12 2Z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
}

// ─── Hero category card SVG icons ───────────────────────────
const heroCatIcons: Record<string, React.ReactNode> = {
  neuro: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#B8D09A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66Z"/>
    </svg>
  ),
  mental: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#B8D09A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M3 12C3 9 6 5 12 5C18 5 21 9 21 12C21 15 18 19 12 19C6 19 3 15 3 12Z"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
  pain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#B8D09A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  onco: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#B8D09A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 2L4 6V12C4 16.42 7.56 20.57 12 22C16.44 20.57 20 16.42 20 12V6L12 2Z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
}

// ─── Conditions data ────────────────────────────────────────
const conditions: ConditionCard[] = [
  // ── Neurológicas ──
  { slug: 'epilepsia', tag: 'Maior evidência científica', name: 'Epilepsia refratária', tagline: 'Pacientes que não respondem a anticonvulsivantes convencionais podem ter redução de até 50% nas crises com CBD — o primeiro medicamento à base de cannabis aprovado pela Anvisa.', compound: 'isolado · Óleo sublingual', compoundBadge: 'CBD', variant: 'featured', category: 'neuro', icon: icons.epilepsia, large: true, heroImage: '/treatments/epilepsia-hero.webp' },
  { slug: 'parkinson', tag: 'Neuroproteção', name: 'Parkinson e neurodegenerativas', tagline: 'Melhora de tremores, sono REM e qualidade de vida com CBD+THC balanceado.', compound: 'balanceado', compoundBadge: 'CBD+THC', variant: 'simple', category: 'neuro', icon: icons.parkinson, heroImage: '/treatments/parkinson-card.webp' },
  { slug: 'esclerose-multipla', tag: 'Autoimune', name: 'Esclerose múltipla', tagline: 'Redução de espasticidade e dor neuropática.', compound: '', compoundBadge: 'CBD+THC', variant: 'row', category: 'neuro', icon: icons.esclerose, heroImage: '/treatments/esclerose-multipla-card.webp' },
  // ── Saúde mental ──
  { slug: 'ansiedade', tag: 'Alta evidência', name: 'Ansiedade e TEPT', tagline: 'CBD em 300–600 mg demonstrou efeito ansiolítico superior ao placebo em estudos randomizados. Uma das condições mais frequentes entre quem usa cannabis sem prescrição.', compound: 'predominante · Cápsula ou sublingual', compoundBadge: 'CBD', variant: 'featured', category: 'mental', icon: icons.ansiedade, large: true, heroImage: '/treatments/ansiedade-hero.webp' },
  { slug: 'insonia', tag: 'Sono e humor', name: 'Depressão e insônia', tagline: 'Modulação do ciclo sono-vigília e do eixo HPA com CBD noturno em baixas doses.', compound: 'baixa dose noturna', compoundBadge: 'CBD', variant: 'simple', category: 'mental', icon: icons.insonia, heroImage: '/treatments/insonia-card.webp' },
  { slug: 'autismo', tag: 'Neurodesenvolvimento', name: 'Autismo / TEA', tagline: 'Redução de comportamentos disruptivos e melhora do sono.', compound: '', compoundBadge: 'CBD+THC', variant: 'row', category: 'mental', icon: icons.autismo, heroImage: '/treatments/autismo-card.webp' },
  // ── Dor e inflamação ──
  { slug: 'dor-cronica', tag: 'Dor crônica', name: 'Dor crônica e neuropática', tagline: 'Neuropatia diabética, fibromialgia, dor pós-cirúrgica — CBD+THC como adjuvante aos tratamentos convencionais. Uma das condições mais tratadas de forma irregular no Brasil.', compound: 'balanceado ou noturno', compoundBadge: 'CBD+THC', variant: 'featured', category: 'pain', icon: icons.dorCronica, large: true, heroImage: '/treatments/dor-cronica-hero.webp' },
  { slug: 'artrite', tag: 'Autoimune', name: 'Artrite e artrose', tagline: 'Redução da inflamação articular e melhora da mobilidade com CBD tópico e oral.', compound: 'tópico + oral', compoundBadge: 'CBD', variant: 'simple', category: 'pain', icon: icons.artrite, heroImage: '/treatments/artrite-hero.webp' },
  { slug: 'endometriose', tag: 'Hormonal', name: 'Endometriose', tagline: 'Modulação da dor pélvica crônica e redução de crises inflamatórias.', compound: '', compoundBadge: 'CBD', variant: 'row', category: 'pain', icon: icons.endometriose, heroImage: '/treatments/endometriose-hero.webp' },
  // ── Oncologia ──
  { slug: 'oncologia', tag: 'Paliativo', name: 'Cuidados paliativos oncológicos', tagline: 'Redução de náuseas por quimioterapia, manejo da dor e melhora do apetite com THC+CBD individualizado. Indicação reconhecida internacionalmente.', compound: 'dose individualizada', compoundBadge: 'THC+CBD', variant: 'featured', category: 'onco', icon: icons.paliativos, large: true, heroImage: '/treatments/oncologia-hero.webp' },
  { slug: 'nauseas-quimio', tag: 'Adjuvante', name: 'Náuseas e vômito quimio', tagline: 'Dronabinol e nabilona aprovados internacionalmente como antieméticos oncológicos.', compound: 'sintético reg.', compoundBadge: 'THC', variant: 'simple', category: 'onco', icon: icons.nauseas, heroImage: '/treatments/nauseas-quimio-hero.webp' },
  { slug: 'dor-oncologica', tag: 'Pesquisa avançada', name: 'Dor oncológica crônica', tagline: 'Adjuvante a opioides, reduzindo a dose necessária.', compound: '', compoundBadge: 'CBD+THC', variant: 'row', category: 'onco', icon: icons.dorOncologica, heroImage: '/treatments/dor-oncologica-hero.webp' },
]

// ─── Category metadata ──────────────────────────────────────
interface CategoryMeta {
  key: Exclude<CategoryKey, 'all'>
  categorySlug: string
  num: string
  title: string
  description: string
  tintBg: string
  tintBgDark: string
  illusBg: string
  illusBgDark: string
}

const categories: CategoryMeta[] = [
  {
    key: 'neuro',
    categorySlug: 'neurologicas',
    num: '01 / 04',
    title: 'Condições neurológicas',
    description: 'CBD e THC atuam como neuroprotetores e moduladores da neurotransmissão — epilepsia, Parkinson e esclerose múltipla.',
    tintBg: 'bg-[#EBF2E1]',
    tintBgDark: 'dark:bg-[#1a2a1a]',
    illusBg: 'bg-[#E8F2DF]',
    illusBgDark: 'dark:bg-[#2a3d2a]',
  },
  {
    key: 'mental',
    categorySlug: 'saude-mental',
    num: '02 / 04',
    title: 'Saúde mental',
    description: 'CBD modula receptores de serotonina e endocanabinoides — efeito ansiolítico e neuroprotetor documentado em humanos.',
    tintBg: 'bg-[#E8EEF7]',
    tintBgDark: 'dark:bg-[#1a1f2a]',
    illusBg: 'bg-[#E6EEF7]',
    illusBgDark: 'dark:bg-[#2a2d3d]',
  },
  {
    key: 'pain',
    categorySlug: 'dor-inflamacao',
    num: '03 / 04',
    title: 'Dor e inflamação',
    description: 'Canabinoides interagem com receptores CB1 e CB2 reduzindo a percepção de dor e modulando a resposta inflamatória crônica.',
    tintBg: 'bg-[#F5EDEA]',
    tintBgDark: 'dark:bg-[#2a1f1a]',
    illusBg: 'bg-[#F5EDEA]',
    illusBgDark: 'dark:bg-[#3d2a2a]',
  },
  {
    key: 'onco',
    categorySlug: 'oncologia-paliativos',
    num: '04 / 04',
    title: 'Oncologia e cuidados paliativos',
    description: 'Cannabis medicinal como adjuvante ao tratamento oncológico — controle de náuseas, dor e qualidade de vida.',
    tintBg: 'bg-[#EEE9F5]',
    tintBgDark: 'dark:bg-[#1f1a2a]',
    illusBg: 'bg-[#EEE9F5]',
    illusBgDark: 'dark:bg-[#2d2a3d]',
  },
]

// ─── Filter chip labels ─────────────────────────────────────
const filterChips: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'Todas as condições' },
  { key: 'neuro', label: 'Neurológicas' },
  { key: 'mental', label: 'Saúde mental' },
  { key: 'pain', label: 'Dor e inflamação' },
  { key: 'onco', label: 'Oncologia & paliativos' },
]

// ─── Proof cards data ───────────────────────────────────────
const proofCards = [
  { condition: 'Epilepsia', num: '50%', desc: 'Redução na frequência de crises com CBD 20 mg/kg/dia em Dravet Syndrome', cite: 'Devinsky et al. — NEJM, 2017' },
  { condition: 'Parkinson', num: '4/4', desc: 'Pacientes com Parkinson tiveram redução dos distúrbios de sono REM com CBD isolado', cite: 'Chagas et al. — J. Clin. Pharm. Ther., 2014' },
  { condition: 'Ansiedade', num: '78%', desc: 'Dos pacientes relataram melhora na ansiedade após uso de CBD em estudo observacional', cite: 'Shannon et al. — Permanente Journal, 2019' },
]

// ─── How-to steps data ──────────────────────────────────────
const howSteps = [
  { num: 1, title: 'Consulta médica', desc: 'Médico especializado avalia seu histórico e indica o composto e via de administração certos.' },
  { num: 2, title: 'Produto e associação', desc: 'Prescrição em mãos, você acessa o produto via farmácia ou associação parceira.' },
  { num: 3, title: 'Acompanhamento', desc: 'Ajuste de dose e monitoramento contínuo ao longo de todo o tratamento.' },
]

// ─── Sub-components ─────────────────────────────────────────

function ConditionArrow() {
  return (
    <div className="w-[30px] h-[30px] rounded-full border border-brand-cream-dark dark:border-gray-600 flex items-center justify-center text-brand-muted dark:text-gray-400 text-[13px] shrink-0 transition-all group-hover:bg-brand-green-deep group-hover:border-brand-green-deep group-hover:text-white dark:group-hover:bg-brand-green-light dark:group-hover:border-brand-green-light">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </div>
  )
}

function CompoundBadge({ badge, detail }: { badge: string; detail: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] text-brand-text-xs dark:text-gray-500">
      <span className="bg-brand-green-deep text-white text-[10px] font-medium px-2 py-0.5 rounded tracking-wide">{badge}</span>
      {detail && <span>{detail}</span>}
    </div>
  )
}

function CondTag({ label }: { label: string }) {
  return (
    <span className="inline-block text-[10.5px] text-brand-green-light dark:text-brand-green-xs bg-brand-green-pale dark:bg-brand-green-pale/10 px-2.5 py-0.5 rounded-full font-medium tracking-wide mb-2.5">
      {label}
    </span>
  )
}

// ─── Card components ────────────────────────────────────────

function FeaturedCard({ card, illusBg, illusBgDark }: { card: ConditionCard; illusBg: string; illusBgDark: string }) {
  return (
    <Link
      to={slugToPath(card.slug)}
      className="group col-span-2 max-md:col-span-1 bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-[20px] overflow-hidden cursor-pointer transition-all duration-200 hover:border-brand-green-light hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(20,31,20,0.07)] no-underline text-inherit grid grid-cols-2 max-md:grid-cols-1"
    >
      <div className={`flex items-center justify-center min-h-[220px] max-md:min-h-[160px] overflow-hidden ${card.heroImage ? '' : `p-10 max-md:p-7 ${illusBg} ${illusBgDark}`}`}>
        {card.heroImage ? (
          <img src={card.heroImage} alt={card.name} className="w-full h-full object-cover" loading="lazy" width={480} height={320} />
        ) : (
          <div className="w-[88px] h-[88px] rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.05)] [&>svg]:w-10 [&>svg]:h-10">
            {card.icon}
          </div>
        )}
      </div>
      <div className="p-7 flex flex-col justify-between">
        <div>
          <CondTag label={card.tag} />
          <h3 className="font-serif text-[21px] text-brand-text dark:text-white mb-2 leading-[1.2]">{card.name}</h3>
          <p className="text-[13.5px] text-brand-muted dark:text-gray-400 leading-relaxed mb-5">{card.tagline}</p>
        </div>
        <div className="flex items-center justify-between">
          <CompoundBadge badge={card.compoundBadge} detail={card.compound} />
          <ConditionArrow />
        </div>
      </div>
    </Link>
  )
}

function SimpleCard({ card, illusBg, illusBgDark }: { card: ConditionCard; illusBg: string; illusBgDark: string }) {
  return (
    <Link
      to={slugToPath(card.slug)}
      className="group bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-[20px] overflow-hidden cursor-pointer transition-all duration-200 hover:border-brand-green-light hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(20,31,20,0.07)] no-underline text-inherit block"
    >
      <div className={`flex items-center justify-center min-h-[150px] overflow-hidden ${card.heroImage ? '' : `p-7 ${illusBg} ${illusBgDark}`}`}>
        {card.heroImage ? (
          <img src={card.heroImage} alt={card.name} className="w-full h-full object-cover" loading="lazy" width={320} height={200} />
        ) : (
          <div className="w-[56px] h-[56px] rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.05)] [&>svg]:w-[26px] [&>svg]:h-[26px]">
            {card.icon}
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col justify-between">
        <div>
          <CondTag label={card.tag} />
          <h3 className="font-serif text-[17px] text-brand-text dark:text-white mb-2 leading-tight">{card.name}</h3>
          <p className="text-[13.5px] text-brand-muted dark:text-gray-400 leading-relaxed mb-5">{card.tagline}</p>
        </div>
        <div className="flex items-center justify-between">
          <CompoundBadge badge={card.compoundBadge} detail={card.compound} />
          <ConditionArrow />
        </div>
      </div>
    </Link>
  )
}

function RowCard({ card, illusBg, illusBgDark }: { card: ConditionCard; illusBg: string; illusBgDark: string }) {
  return (
    <Link
      to={slugToPath(card.slug)}
      className="group col-span-full bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-[20px] overflow-hidden cursor-pointer transition-all duration-200 hover:border-brand-green-light hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(20,31,20,0.07)] no-underline text-inherit block"
    >
      <div className="grid grid-cols-[100px_1fr] max-md:grid-cols-1 min-h-[90px]">
        <div className={`flex items-center justify-center overflow-hidden ${card.heroImage ? '' : `p-[18px] max-md:py-6 ${illusBg} ${illusBgDark}`}`}>
          {card.heroImage ? (
            <img src={card.heroImage} alt={card.name} className="w-full h-full object-cover" loading="lazy" width={100} height={100} />
          ) : (
            <div className="w-[56px] h-[56px] rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.05)] [&>svg]:w-[26px] [&>svg]:h-[26px]">
              {card.icon}
            </div>
          )}
        </div>
        <div className="p-4 px-5 flex flex-row max-md:flex-col justify-between items-center max-md:items-start gap-4">
          <div>
            <CondTag label={card.tag} />
            <h3 className="font-serif text-[16px] text-brand-text dark:text-white mb-0.5 leading-tight">{card.name}</h3>
            <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-relaxed">{card.tagline}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <CompoundBadge badge={card.compoundBadge} detail={card.compound} />
            <ConditionArrow />
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Main page ──────────────────────────────────────────────

export function TreatmentsPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [activeFilter, setActiveFilter] = useState<CategoryKey>('all')

  const visibleCategories = activeFilter === 'all'
    ? categories
    : categories.filter((c) => c.key === activeFilter)

  const heroCats = [
    { key: 'neuro', name: 'Neurológicas', count: 'Epilepsia · Parkinson · EM' },
    { key: 'mental', name: 'Saúde mental', count: 'Ansiedade · Insônia · TEA' },
    { key: 'pain', name: 'Dor e inflamação', count: 'Dor crônica · Artrite · Endo' },
    { key: 'onco', name: 'Oncologia', count: 'Paliativos · Náuseas · Dor' },
  ]

  return (
    <div className="min-h-screen bg-brand-off dark:bg-surface-dark">
      <Header />

      {/* ═══════════ HERO ═══════════ */}
      <section className="bg-brand-green-deep relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-[100px] -right-[100px] w-[480px] h-[480px] rounded-full bg-white/[0.025] pointer-events-none" />

        <div className="max-w-[1100px] mx-auto relative z-10 grid grid-cols-[1fr_320px] max-md:grid-cols-1 gap-[72px] max-md:gap-10 items-center pt-[148px] pb-[88px] max-md:pt-[120px] max-md:pb-14 px-6 md:px-10 lg:px-20">
          {/* Left column: text */}
          <div>
            <div className="inline-flex items-center gap-2 text-[11.5px] text-white/40 uppercase tracking-[.1em] font-medium mb-8">
              <span className="w-[5px] h-[5px] bg-brand-green-light rounded-full" />
              Tratamentos médicos com cannabis
            </div>

            <h1 className="font-serif text-[clamp(38px,5vw,60px)] text-white leading-[1.08] tracking-tight mb-6">
              O que você usa<br />
              pode ter <em className="italic text-brand-green-xs">nome,<br />dose e prescrição.</em>
            </h1>

            <p className="text-[17px] text-white/55 max-w-[460px] leading-[1.7] mb-10 font-light">
              Muitas condições tratadas informalmente com cannabis já têm <strong className="text-white/80 font-medium">evidências científicas e protocolo médico</strong> no Brasil. Encontre a sua.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap mb-10">
              {[
                { value: '25+', label: 'produtos Anvisa' },
                { value: '6,9M', label: 'elegíveis no Brasil' },
                { value: '~50 mil', label: 'pacientes ativos' },
              ].map((stat, i) => (
                <div key={i} className={`pr-7 ${i > 0 ? 'pl-7 border-l border-white/10' : ''} max-md:pr-4 max-md:pl-4`}>
                  <div className="font-serif text-[30px] text-white leading-none">{stat.value}</div>
                  <div className="text-[11.5px] text-white/[0.38] mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex gap-2.5 flex-wrap">
              <Link
                to={isAuthenticated ? '/acolhimento' : '/cadastro?redirect=/acolhimento'}
                className="px-6 py-3 bg-white text-brand-green-deep rounded-lg text-[14.5px] font-medium no-underline transition-opacity hover:opacity-90"
              >
                Encontrar minha condição
              </Link>
              <Link
                to="/associacoes"
                className="px-5 py-[11px] bg-transparent text-white/65 border border-white/[0.18] rounded-lg text-[14.5px] no-underline transition-all hover:border-white/40 hover:text-white"
              >
                Como funciona →
              </Link>
            </div>
          </div>

          {/* Right column: 2x2 category preview cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {heroCats.map((cat) => (
              <div
                key={cat.key}
                className="bg-white/[0.06] border border-white/10 rounded-[14px] p-4 cursor-pointer transition-all hover:bg-white/[0.11] hover:border-white/20 block"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center mb-2.5">
                  {heroCatIcons[cat.key]}
                </div>
                <div className="text-[13px] font-medium text-white/75 leading-tight mb-0.5">{cat.name}</div>
                <div className="text-[11px] text-white/30 leading-snug">{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FILTER CHIPS ═══════════ */}
      <section className="bg-brand-cream dark:bg-surface-dark border-b border-brand-cream-dark dark:border-gray-700/40 px-6 md:px-10 lg:px-20 py-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] text-brand-text-xs dark:text-gray-500 uppercase tracking-[.09em] font-medium mb-3.5">
            Filtrar por categoria
          </div>
          <div className="flex flex-wrap gap-2">
            {filterChips.map((chip) => (
              <button
                key={chip.key}
                onClick={() => setActiveFilter(chip.key)}
                className={`inline-flex items-center gap-[7px] px-4 py-2 rounded-full text-[13.5px] border transition-all cursor-pointer ${
                  activeFilter === chip.key
                    ? 'bg-brand-green-deep border-brand-green-deep text-white dark:bg-brand-green-light dark:border-brand-green-light dark:text-brand-text'
                    : 'bg-brand-off dark:bg-surface-dark-card border-brand-cream-dark dark:border-gray-600 text-brand-text-md dark:text-gray-400 hover:border-brand-green-light hover:text-brand-green-deep hover:bg-brand-green-pale/30 dark:hover:border-brand-green-light dark:hover:text-brand-green-light'
                }`}
              >
                {chipIcons[chip.key]}
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main className="max-w-[1100px] mx-auto px-6 md:px-10 lg:px-20 py-[72px] max-md:py-8">

        {visibleCategories.map((cat, catIdx) => {
          const catConditions = conditions.filter((c) => c.category === cat.key)
          const isFirstCategory = catIdx === 0 && (activeFilter === 'all' || activeFilter === 'neuro')
          const showProofAfter = isFirstCategory
          const showHowToStart = cat.key === 'pain' && (activeFilter === 'all' || activeFilter === 'pain')

          return (
            <div key={cat.key}>
              {/* Category tinted block */}
              <div className={`${cat.tintBg} ${cat.tintBgDark} rounded-[22px] max-md:rounded-none p-10 max-md:px-4 max-md:py-6 mb-20 max-md:mb-10`}>
                <section>
                  {/* Category header */}
                  <div className="flex items-end justify-between mb-8 pb-5 border-b border-black/[0.08] dark:border-white/10">
                    <div>
                      <div className="text-[11px] text-brand-text-xs dark:text-gray-500 uppercase tracking-[.1em] mb-1">{cat.num}</div>
                      <h2 className="font-serif text-[28px] text-brand-text dark:text-white">{cat.title}</h2>
                      <p className="text-[13.5px] text-brand-muted dark:text-gray-400 max-w-[440px] leading-relaxed mt-1.5">{cat.description}</p>
                    </div>
                    <Link to={`/tratamentos/categoria/${cat.categorySlug}`} className="text-[13px] text-brand-green-deep dark:text-brand-green-light font-medium whitespace-nowrap hidden md:flex items-center gap-1.5 no-underline hover:underline">
                      Ver todas →
                    </Link>
                  </div>

                  {/* Conditions grid */}
                  <div className="grid grid-cols-3 max-md:grid-cols-1 gap-3.5">
                    {catConditions.map((card) => {
                      if (card.variant === 'featured') return <FeaturedCard key={card.slug} card={card} illusBg={cat.illusBg} illusBgDark={cat.illusBgDark} />
                      if (card.variant === 'row') return <RowCard key={card.slug} card={card} illusBg={cat.illusBg} illusBgDark={cat.illusBgDark} />
                      return <SimpleCard key={card.slug} card={card} illusBg={cat.illusBg} illusBgDark={cat.illusBgDark} />
                    })}
                  </div>
                </section>
              </div>

              {/* ═══ Proof section — after first visible category ═══ */}
              {showProofAfter && (
                <section className="bg-brand-green-deep rounded-[22px] p-12 max-md:p-6 mb-14 max-md:mb-10 relative overflow-hidden">
                  {/* Decorative quote mark */}
                  <div className="absolute -top-5 left-7 font-serif text-[200px] text-white/[0.04] leading-none pointer-events-none select-none">&ldquo;</div>

                  <div className="flex items-start justify-between mb-8 max-md:flex-col max-md:gap-3">
                    <div>
                      <h2 className="font-serif text-[27px] text-white">O que diz a ciência</h2>
                      <p className="text-[13px] text-white/40 mt-1">Estudos revisados por pares, aplicados ao contexto brasileiro</p>
                    </div>
                    <span className="text-[13px] text-brand-green-xs no-underline hover:underline whitespace-nowrap mt-1 cursor-default">
                      Ver todas as referências →
                    </span>
                  </div>

                  <div className="grid grid-cols-3 max-md:grid-cols-1 gap-3.5">
                    {proofCards.map((pc, i) => (
                      <div key={i} className="bg-white/[0.07] border border-white/10 rounded-[14px] p-[22px]">
                        <span className="inline-block text-[10px] bg-white/[0.08] text-brand-green-xs px-2 py-0.5 rounded-full uppercase tracking-wider mb-2.5">{pc.condition}</span>
                        <div className="font-serif text-[64px] max-md:text-[48px] text-brand-green-xs leading-none mb-2">{pc.num}</div>
                        <p className="text-[13.5px] text-white/[0.78] leading-snug mb-2.5">{pc.desc}</p>
                        <div className="text-[11px] text-white/[0.28] italic">{pc.cite}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ═══ How to start — after Dor e inflamação ═══ */}
              {showHowToStart && (
                <section className="bg-brand-cream dark:bg-surface-dark-card rounded-[22px] p-12 max-md:p-6 mb-14 max-md:mb-10 grid grid-cols-[1fr_2fr] max-md:grid-cols-1 gap-12 max-md:gap-6 items-center border border-brand-cream-dark/50 dark:border-gray-700/40">
                  <div>
                    <h2 className="font-serif text-[25px] text-brand-text dark:text-white mb-2.5">Como começar o tratamento</h2>
                    <p className="text-[14px] text-brand-muted dark:text-gray-400 leading-relaxed">Todo tratamento começa com avaliação médica. O CannHub conecta você ao profissional certo e acompanha cada etapa.</p>
                  </div>
                  <div className="grid grid-cols-3 max-md:grid-cols-1 gap-5">
                    {howSteps.map((step) => (
                      <div key={step.num}>
                        <div className="w-[30px] h-[30px] rounded-full bg-brand-green-deep dark:bg-brand-green-light text-white dark:text-brand-text text-[12px] font-medium flex items-center justify-center mb-3">{step.num}</div>
                        <div className="text-[14px] font-medium text-brand-text dark:text-white mb-1">{step.title}</div>
                        <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-snug">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )
        })}

        {/* ═══════════ CTA FINAL ═══════════ */}
        <section className="bg-brand-green-deep rounded-[22px] px-12 py-16 max-md:px-7 max-md:py-11 grid grid-cols-[1fr_auto] max-md:grid-cols-1 gap-20 max-md:gap-7 items-center relative overflow-hidden mb-20 max-md:mb-12">
          {/* Decorative circle */}
          <div className="absolute -top-20 right-20 w-[320px] h-[320px] rounded-full bg-white/[0.025] pointer-events-none" />

          <div className="relative z-10">
            <div className="text-[11px] text-white/[0.38] uppercase tracking-[.1em] font-medium mb-3">Pronto para regularizar?</div>
            <h2 className="font-serif text-[clamp(26px,3.5vw,38px)] text-white leading-[1.1] tracking-tight mb-2.5">
              Sua condição tem<br /><em className="italic text-brand-green-xs">um caminho seguro.</em>
            </h2>
            <p className="text-[15px] text-white/50 leading-relaxed font-light max-w-[460px]">
              A CannHub orienta você do acolhimento clínico até a associação credenciada certa para o seu caso.
            </p>
            <div className="flex gap-4 mt-5 flex-wrap">
              <div className="flex items-center gap-[5px] text-[12px] text-white/[0.32]">
                <span className="w-[14px] h-[14px] bg-white/[0.07] rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-2 h-2" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 5 4 8 8 2"/></svg>
                </span>
                Sigiloso
              </div>
              <div className="flex items-center gap-[5px] text-[12px] text-white/[0.32]">
                <span className="w-[14px] h-[14px] bg-white/[0.07] rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-2 h-2" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 5 4 8 8 2"/></svg>
                </span>
                Sem julgamento
              </div>
              <div className="flex items-center gap-[5px] text-[12px] text-white/[0.32]">
                <span className="w-[14px] h-[14px] bg-white/[0.07] rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-2 h-2" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 5 4 8 8 2"/></svg>
                </span>
                Gratuito para começar
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 min-w-[200px] relative z-10">
            <Link
              to={isAuthenticated ? '/acolhimento' : '/cadastro?redirect=/acolhimento'}
              className="px-7 py-[13px] bg-white text-brand-green-deep rounded-lg text-[14.5px] font-medium text-center no-underline transition-opacity hover:opacity-90 w-full"
            >
              Iniciar acolhimento
            </Link>
            <Link
              to="/associacoes"
              className="px-7 py-[11px] bg-transparent text-white/60 border border-white/[0.18] rounded-lg text-[13.5px] text-center no-underline transition-all hover:border-white/40 hover:text-white/85 w-full"
            >
              Já tenho prescrição — ver associações
            </Link>
          </div>
        </section>

        {/* ═══════════ FOOTER DISCLAIMER ═══════════ */}
        <div className="border-t border-brand-cream-dark dark:border-gray-700/40 pt-6">
          <p className="text-[12px] text-brand-text-xs dark:text-gray-500 leading-relaxed">
            Este site tem caráter exclusivamente informativo e educacional. As informações aqui contidas não substituem consulta médica. O uso de cannabis medicinal no Brasil requer prescrição de profissional habilitado. As informações desta página são baseadas em literatura científica publicada.
          </p>
        </div>
      </main>
    </div>
  )
}
