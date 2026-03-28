'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from 'recharts'
import { getWorkoutLogsByExercise } from '@/lib/queries'
import { WorkoutLogWithExercise } from '@/lib/types'

const MUSCLE_GROUPS = ['Épaules', 'Biceps', 'Dos', 'Triceps', 'Pecs', 'Jambes']

type TimeFilter = '1M' | '3M' | 'Tout'

function filterByTime(logs: WorkoutLogWithExercise[], filter: TimeFilter): WorkoutLogWithExercise[] {
  if (filter === 'Tout') return logs
  const now = new Date()
  const months = filter === '1M' ? 1 : 3
  const cutoff = new Date(now.getFullYear(), now.getMonth() - months, now.getDate())
  return logs.filter((l) => new Date(l.session_date) >= cutoff)
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

function avgReps(log: WorkoutLogWithExercise): number | null {
  const vals = [log.serie1_reps, log.serie2_reps, log.serie3_reps].filter((v) => v != null) as number[]
  if (vals.length === 0) return null
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null
  const entry = payload[0]?.payload
  if (!entry) return null

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs shadow-xl min-w-[140px]">
      <p className="text-gray-300 font-semibold mb-2">{label}</p>
      <p className="text-yellow-400 font-bold mb-1">{entry.poids} kg</p>
      <div className="text-gray-400 space-y-0.5">
        <p>S1: <span className="text-white">{entry.serie1 ?? '—'}</span></p>
        <p>S2: <span className="text-white">{entry.serie2 ?? '—'}</span></p>
        <p>S3: <span className="text-white">{entry.serie3 ?? '—'}</span></p>
      </div>
      {entry.moyReps != null && (
        <p className="text-emerald-400 mt-1.5 font-medium">Moy: {entry.moyReps} reps</p>
      )}
    </div>
  )
}

interface ExerciseCardProps {
  exerciseName: string
  logs: WorkoutLogWithExercise[]
}

function ExerciseCard({ exerciseName, logs }: ExerciseCardProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('3M')

  const filteredLogs = useMemo(() => filterByTime(logs, timeFilter), [logs, timeFilter])

  const chartData = useMemo(() =>
    filteredLogs
      .sort((a, b) => a.session_date.localeCompare(b.session_date))
      .map((log) => ({
        date: formatDate(log.session_date),
        poids: log.poids,
        serie1: log.serie1_reps,
        serie2: log.serie2_reps,
        serie3: log.serie3_reps,
        moyReps: avgReps(log),
      })),
    [filteredLogs]
  )

  const lastWeight = chartData.at(-1)?.poids ?? null
  const prevWeight = chartData.at(-2)?.poids ?? null
  const weightDiff = lastWeight != null && prevWeight != null ? lastWeight - prevWeight : null
  const weightPct = weightDiff != null && prevWeight ? ((weightDiff / prevWeight) * 100).toFixed(1) : null

  // Need at least 2 distinct session dates to draw a meaningful chart
  const uniqueDates = new Set(filteredLogs.map((l) => l.session_date)).size
  const tooFewData = uniqueDates < 2

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white text-sm flex-1 pr-2">{exerciseName}</h3>
        <div className="flex gap-1 shrink-0">
          {(['1M', '3M', 'Tout'] as TimeFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                timeFilter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* DEBUG: remove once data is verified */}
      <p className="text-xs text-gray-600 mb-2">
        {logs.length} log(s) total · {new Set(logs.map((l) => l.session_date)).size} date(s) distincte(s)
        {timeFilter !== 'Tout' && ` · ${filteredLogs.length} dans la période`}
      </p>

      {tooFewData ? (
        <p className="text-gray-500 text-sm py-4 text-center">
          Pas encore assez de données — continue tes séances !
        </p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 40, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="weight"
                orientation="left"
                tick={{ fill: '#fbbf24', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                width={36}
              />
              <YAxis
                yAxisId="reps"
                orientation="right"
                tick={{ fill: '#34d399', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 20]}
                width={24}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceArea
                yAxisId="reps"
                y1={6}
                y2={13}
                fill="#22c55e"
                fillOpacity={0.08}
                stroke="#22c55e"
                strokeOpacity={0.2}
              />
              <Line
                yAxisId="weight"
                type="monotone"
                dataKey="poids"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={{ r: 4, fill: '#fbbf24', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                name="Poids (kg)"
              />
              <Line
                yAxisId="reps"
                type="monotone"
                dataKey="moyReps"
                stroke="#34d399"
                strokeWidth={1.5}
                dot={{ r: 3, fill: '#34d399', strokeWidth: 0 }}
                activeDot={{ r: 4 }}
                name="Moy reps"
              />
            </ComposedChart>
          </ResponsiveContainer>

          {lastWeight != null && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-800">
              <div>
                <p className="text-xs text-gray-500">Dernière charge</p>
                <p className="text-yellow-400 font-bold text-lg">{lastWeight} kg</p>
              </div>
              {weightDiff != null && weightPct != null && (
                <div>
                  <p className="text-xs text-gray-500">vs séance préc.</p>
                  <p className={`font-semibold text-sm ${weightDiff > 0 ? 'text-emerald-400' : weightDiff < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {weightDiff > 0 ? '+' : ''}{weightDiff} kg ({weightDiff > 0 ? '+' : ''}{weightPct}%)
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function ProgressionPage() {
  const [activeTab, setActiveTab] = useState('Épaules')
  const [logsByExercise, setLogsByExercise] = useState<Record<string, WorkoutLogWithExercise[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWorkoutLogsByExercise().then((data) => {
      setLogsByExercise(data)
      setLoading(false)
    })
  }, [])

  const exercisesByGroup = useMemo(() => {
    const grouped: Record<string, { name: string; logs: WorkoutLogWithExercise[] }[]> = {}
    for (const groupe of MUSCLE_GROUPS) grouped[groupe] = []

    for (const [name, logs] of Object.entries(logsByExercise)) {
      const groupe = logs[0]?.exercises?.groupe_musculaire
      if (groupe && grouped[groupe]) {
        grouped[groupe].push({ name, logs })
      }
    }
    return grouped
  }, [logsByExercise])

  const activeExercises = exercisesByGroup[activeTab] ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Progression</h1>
      <p className="text-gray-400 text-sm mb-5">Suivez vos progrès par groupe musculaire</p>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {MUSCLE_GROUPS.map((groupe) => (
          <button
            key={groupe}
            onClick={() => setActiveTab(groupe)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === groupe
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {groupe}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400 text-sm">Chargement...</div>
        </div>
      ) : activeExercises.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-sm">Pas encore de données pour {activeTab}</p>
          <p className="text-gray-600 text-xs mt-1">Enregistrez vos séances pour voir votre progression</p>
        </div>
      ) : (
        <div>
          {activeExercises.map(({ name, logs }) => (
            <ExerciseCard key={name} exerciseName={name} logs={logs} />
          ))}
        </div>
      )}
    </div>
  )
}
