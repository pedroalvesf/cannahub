import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useDiarySummary, useSymptomTrend } from '@/hooks/use-diary'
import { SYMPTOM_LABELS, ADMINISTRATION_METHOD_LABELS } from '@/constants/labels'

const PERIOD_OPTIONS = [
  { label: '30d', days: 30 },
  { label: '60d', days: 60 },
  { label: '90d', days: 90 },
] as const

export function DiaryInsights() {
  const [days, setDays] = useState(30)

  const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const dateTo = new Date().toISOString()
  const { data: summary, isLoading } = useDiarySummary(dateFrom, dateTo)

  const topSymptoms = (summary?.mostFrequentSymptoms ?? []).slice(0, 3)

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-brand-green-light border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!summary || summary.totalEntries === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-brand-muted dark:text-gray-400">
          Sem dados suficientes para gerar insights. Continue registrando!
        </p>
      </div>
    )
  }

  // Method distribution chart data
  const methodData = Object.entries(summary.methodDistribution).map(([key, count]) => ({
    name: ADMINISTRATION_METHOD_LABELS[key] ?? key,
    count,
  }))

  // Best product (highest avg improvement)
  const bestDelta = summary.symptomDeltas
    .filter((d) => d.avgSeverityAfter !== null)
    .sort((a, b) => (b.avgSeverityBefore - (b.avgSeverityAfter ?? 0)) - (a.avgSeverityBefore - (a.avgSeverityAfter ?? 0)))

  const daysInPeriod = days
  const daysWithEntries = new Set(
    summary.symptomDeltas.length > 0 ? Array.from({ length: summary.totalEntries }, (_, i) => i) : [],
  ).size || summary.totalEntries

  return (
    <div className="space-y-8">
      {/* Period selector */}
      <div className="flex gap-2">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.days}
            onClick={() => setDays(opt.days)}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-medium border transition-colors ${
              days === opt.days
                ? 'bg-brand-green-deep text-white border-brand-green-deep'
                : 'bg-brand-cream dark:bg-surface-dark-card border-brand-cream-dark/40 dark:border-gray-700/40 text-brand-muted dark:text-gray-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Symptom Trends Chart */}
      {topSymptoms.length > 0 && (
        <div className="bg-brand-cream/40 dark:bg-surface-dark-card rounded-[14px] border border-brand-cream-dark/30 dark:border-gray-700/30 p-5">
          <h3 className="text-sm font-semibold text-brand-green-deep dark:text-white mb-4">
            Evolucao dos sintomas
          </h3>
          <div className="space-y-6">
            {topSymptoms.map((s) => (
              <SymptomTrendChart key={s.symptomKey} symptomKey={s.symptomKey} dateFrom={dateFrom} dateTo={dateTo} />
            ))}
          </div>
        </div>
      )}

      {/* Method Distribution */}
      {methodData.length > 0 && (
        <div className="bg-brand-cream/40 dark:bg-surface-dark-card rounded-[14px] border border-brand-cream-dark/30 dark:border-gray-700/30 p-5">
          <h3 className="text-sm font-semibold text-brand-green-deep dark:text-white mb-4">
            Metodos de administracao
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={methodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDD4C3" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5C7260' }} />
              <YAxis tick={{ fontSize: 11, fill: '#5C7260' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3D6A27" radius={[4, 4, 0, 0]} name="Registros" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Best improvement */}
        <div className="bg-brand-cream/40 dark:bg-surface-dark-card rounded-[14px] border border-brand-cream-dark/30 dark:border-gray-700/30 p-5">
          <h3 className="text-xs font-semibold text-brand-muted dark:text-gray-400 uppercase tracking-wide mb-2">
            Maior melhora
          </h3>
          {bestDelta.length > 0 && bestDelta[0] ? (
            <div>
              <p className="text-lg font-bold text-brand-green-deep dark:text-white">
                {SYMPTOM_LABELS[bestDelta[0].symptomKey] ?? bestDelta[0].symptomKey}
              </p>
              <p className="text-xs text-brand-muted dark:text-gray-500 mt-1">
                Media: {bestDelta[0].avgSeverityBefore.toFixed(1)} → {bestDelta[0].avgSeverityAfter?.toFixed(1)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-brand-muted dark:text-gray-400">Re-avalie sintomas para ver</p>
          )}
        </div>

        {/* Consistency */}
        <div className="bg-brand-cream/40 dark:bg-surface-dark-card rounded-[14px] border border-brand-cream-dark/30 dark:border-gray-700/30 p-5">
          <h3 className="text-xs font-semibold text-brand-muted dark:text-gray-400 uppercase tracking-wide mb-2">
            Consistencia
          </h3>
          <p className="text-lg font-bold text-brand-green-deep dark:text-white">
            {Math.min(daysWithEntries, daysInPeriod)} de {daysInPeriod} dias
          </p>
          <p className="text-xs text-brand-muted dark:text-gray-500 mt-1">
            com registros no periodo
          </p>
        </div>
      </div>
    </div>
  )
}

function SymptomTrendChart({ symptomKey, dateFrom, dateTo }: { symptomKey: string; dateFrom: string; dateTo: string }) {
  const { data } = useSymptomTrend(symptomKey, dateFrom, dateTo)

  if (!data?.dataPoints || data.dataPoints.length === 0) return null

  const chartData = data.dataPoints.map((d) => ({
    date: d.date.slice(5), // MM-DD
    before: d.avgSeverityBefore,
    after: d.avgSeverityAfter,
  }))

  return (
    <div>
      <p className="text-xs font-medium text-brand-text-md dark:text-gray-300 mb-2">
        {SYMPTOM_LABELS[symptomKey] ?? symptomKey}
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDD4C3" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5C7260' }} />
          <YAxis domain={[0, 3]} ticks={[0, 1, 2, 3]} tick={{ fontSize: 10, fill: '#5C7260' }} />
          <Tooltip
            formatter={(value, name) => {
              const numVal = typeof value === 'number' ? value : 0
              const labels: Record<number, string> = { 0: 'Nenhum', 1: 'Leve', 2: 'Moderado', 3: 'Severo' }
              return [labels[Math.round(numVal)] ?? String(numVal), name === 'before' ? 'Antes' : 'Depois']
            }}
          />
          <Legend formatter={(value) => (value === 'before' ? 'Antes' : 'Depois')} />
          <Line type="monotone" dataKey="before" stroke="#B8D09A" strokeWidth={2} dot={false} name="before" />
          <Line type="monotone" dataKey="after" stroke="#3D6A27" strokeWidth={2} dot={false} name="after" connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
