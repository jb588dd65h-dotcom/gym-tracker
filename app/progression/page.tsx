'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
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
import { getWorkoutLogsByExercise, getMuscleGroups } from '@/lib/queries'
import { WorkoutLogWithExercise } from '@/lib/types'
import { useLang } from '@/app/providers/AppProvider'
import { useMascot } from '@/app/providers/MascotProvider'

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null
  const entry = payload[0]?.payload
  if (!entry) return null

  return (
    <div className="bg-app-card border border-app-subtle rounded-xl p-3 text-xs shadow-xl min-w-[140px]">
      <p className="text-app-muted font-semibold mb-2">{label}</p>
      <p className="text-yellow-400 font-bold text-sm mb-1.5">{entry.poids} kg</p>
      <div className="text-app-muted space-y-0.5">
        <p>S1: <span className="text-app-secondary">{entry.serie1 ?? '—'}</span></p>
        <p>S2: <span className="text-app-secondary">{entry.serie2 ?? '—'}</span></p>
        <p>S3: <span className="text-app-secondary">{entry.serie3 ?? '—'}</span></p>
      </div>
    </div>
  )
}

interface ExerciseCardProps {
  exerciseName: string
  logs: WorkoutLogWithExercise[]
}

function ExerciseCard({ exerciseName, logs }: ExerciseCardProps) {
  const { t } = useLang()
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
      })),
    [filteredLogs]
  )

  const lastWeight = chartData.at(-1)?.poids ?? null
  const prevWeight = chartData.at(-2)?.poids ?? null
  const weightDiff = lastWeight != null && prevWeight != null ? lastWeight - prevWeight : null
  const weightPct = weightDiff != null && prevWeight ? ((weightDiff / prevWeight) * 100).toFixed(1) : null

  const uniqueDates = new Set(filteredLogs.map((l) => l.session_date)).size
  const tooFewData = uniqueDates < 2

  return (
    <div className="bg-app-card border border-app-subtle rounded-2xl p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-app-primary text-sm flex-1 pr-2">{exerciseName}</h3>
        <div className="flex gap-1 shrink-0">
          {(['1M', '3M', 'Tout'] as TimeFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                timeFilter === f
                  ? 'bg-white text-black'
                  : 'bg-white/8 text-app-muted hover:text-app-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {tooFewData ? (
        <p className="text-app-muted text-sm py-4 text-center">
          {t('notEnoughData')}
        </p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
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
                width={45}
              />
              <YAxis
                yAxisId="reps"
                orientation="right"
                hide
                domain={[0, 20]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceArea
                yAxisId="reps"
                y1={6}
                y2={13}
                fill="#22c55e"
                fillOpacity={0.06}
                stroke="none"
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
            </ComposedChart>
          </ResponsiveContainer>

          {lastWeight != null && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-app-subtle">
              <div>
                <p className="text-xs text-app-muted">{t('lastWeight')}</p>
                <p className="text-yellow-400 font-bold text-lg">{lastWeight} kg</p>
              </div>
              {weightDiff != null && weightPct != null && (
                <div>
                  <p className="text-xs text-app-muted">{t('vsPrev')}</p>
                  <p className={`font-semibold text-sm ${weightDiff > 0 ? 'text-emerald-400' : weightDiff < 0 ? 'text-red-400' : 'text-app-muted'}`}>
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
  const { t } = useLang()
  const { trigger: mascotTrigger } = useMascot()
  const [muscleGroups, setMuscleGroups] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string>('')
  const [logsByExercise, setLogsByExercise] = useState<Record<string, WorkoutLogWithExercise[]>>({})
  const [loading, setLoading] = useState(true)
  const celebratedRef = useRef(false)

  useEffect(() => {
    mascotTrigger('thinking')
    Promise.all([getMuscleGroups(), getWorkoutLogsByExercise()]).then(([groups, logs]) => {
      setMuscleGroups(groups)
      setActiveTab((prev) => (groups.includes(prev) ? prev : groups[0] ?? ''))
      setLogsByExercise(logs)
      setLoading(false)

      // Celebrate once if any exercise has a positive recent trend
      if (!celebratedRef.current) {
        const hasImprovement = Object.values(logs).some((logList) => {
          const sorted = [...logList].sort((a, b) => a.session_date.localeCompare(b.session_date))
          const last = sorted.at(-1)?.poids
          const prev = sorted.at(-2)?.poids
          return last != null && prev != null && last > prev
        })
        if (hasImprovement) {
          celebratedRef.current = true
          mascotTrigger('celebration', 'Tu progresses !')
        } else {
          mascotTrigger('idle')
        }
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const exercisesByGroup = useMemo(() => {
    const grouped: Record<string, { name: string; logs: WorkoutLogWithExercise[] }[]> = {}
    for (const groupe of muscleGroups) grouped[groupe] = []

    for (const [name, logs] of Object.entries(logsByExercise)) {
      const groupe = logs[0]?.exercises?.groupe_musculaire
      if (groupe && grouped[groupe] !== undefined) {
        grouped[groupe].push({ name, logs })
      }
    }
    return grouped
  }, [logsByExercise, muscleGroups])

  const activeExercises = exercisesByGroup[activeTab] ?? []

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-bold mb-2 text-app-primary">{t('progressionTitle')}</h1>
      <p className="text-app-muted text-sm mb-5">{t('progressionSubtitle')}</p>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {muscleGroups.map((groupe) => (
          <button
            key={groupe}
            onClick={() => setActiveTab(groupe)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === groupe
                ? 'bg-white text-black'
                : 'bg-white/8 border border-app-subtle text-app-muted hover:text-app-primary'
            }`}
          >
            {groupe}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-app-muted text-sm">{t('loading')}</div>
        </div>
      ) : activeExercises.length === 0 ? (
        <div className="bg-app-card border border-app-subtle rounded-2xl p-8 text-center">
          <p className="text-app-muted text-sm">{t('noProgressData')} {activeTab}</p>
          <p className="text-app-muted/60 text-xs mt-1">{t('keepGoing')}</p>
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
