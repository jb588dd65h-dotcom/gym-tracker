'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Legend,
} from 'recharts'
import { supabase } from '@/lib/supabase'
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
  const date = new Date(dateStr)
  return `${date.getDate()}/${date.getMonth() + 1}`
}

interface ExerciseChartProps {
  exerciseName: string
  logs: WorkoutLogWithExercise[]
}

function ExerciseChart({ exerciseName, logs }: ExerciseChartProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('3M')

  const filteredLogs = useMemo(() => filterByTime(logs, timeFilter), [logs, timeFilter])

  const chartData = useMemo(() => {
    return filteredLogs
      .sort((a, b) => a.session_date.localeCompare(b.session_date))
      .map((log) => ({
        date: formatDate(log.session_date),
        fullDate: log.session_date,
        serie1: log.serie1_reps,
        serie2: log.serie2_reps,
        serie3: log.serie3_reps,
        poids: log.poids,
      }))
  }, [filteredLogs])

  if (logs.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
        <h3 className="font-semibold text-white mb-2">{exerciseName}</h3>
        <p className="text-gray-500 text-sm">Pas encore de données</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white flex-1 pr-2 text-sm">{exerciseName}</h3>
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

      {chartData.length === 0 ? (
        <p className="text-gray-500 text-sm">Pas de données sur cette période</p>
      ) : (
        <div>
          {/* Reps chart */}
          <p className="text-xs text-gray-500 mb-1">Répétitions</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                  fontSize: '12px',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: '#9CA3AF' }}
              />
              {/* Target zone band */}
              <ReferenceArea y1={6} y2={13} fill="#22c55e" fillOpacity={0.08} />
              <ReferenceLine y={6} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.5} />
              <ReferenceLine y={13} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.5} />
              <Line
                type="monotone"
                dataKey="serie1"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ r: 3, fill: '#60a5fa' }}
                name="Série 1"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="serie2"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={{ r: 3, fill: '#a78bfa' }}
                name="Série 2"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="serie3"
                stroke="#fb923c"
                strokeWidth={2}
                dot={{ r: 3, fill: '#fb923c' }}
                name="Série 3"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Weight chart */}
          <p className="text-xs text-gray-500 mt-3 mb-1">Charge (kg)</p>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                  fontSize: '12px',
                }}
                formatter={(value) => [`${value} kg`, 'Poids']}
              />
              <Line
                type="monotone"
                dataKey="poids"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={{ r: 3, fill: '#fbbf24' }}
                name="Poids (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default function ProgressionPage() {
  const [activeTab, setActiveTab] = useState('Épaules')
  const [allLogs, setAllLogs] = useState<WorkoutLogWithExercise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*, exercises(*)')
        .order('session_date', { ascending: true })

      if (!error && data) {
        setAllLogs(data as WorkoutLogWithExercise[])
      }
      setLoading(false)
    }
    fetchLogs()
  }, [])

  const logsByGroup = useMemo(() => {
    const grouped: Record<string, Record<string, WorkoutLogWithExercise[]>> = {}
    for (const groupe of MUSCLE_GROUPS) {
      grouped[groupe] = {}
    }
    for (const log of allLogs) {
      const groupe = log.exercises?.groupe_musculaire
      const exercice = log.exercises?.exercice
      if (groupe && exercice) {
        if (!grouped[groupe]) grouped[groupe] = {}
        if (!grouped[groupe][exercice]) grouped[groupe][exercice] = []
        grouped[groupe][exercice].push(log)
      }
    }
    return grouped
  }, [allLogs])

  const activeGroupLogs = logsByGroup[activeTab] ?? {}
  const exerciseNames = Object.keys(activeGroupLogs)

  // Get ordered exercise names from logs
  const orderedExercises = useMemo(() => {
    if (exerciseNames.length === 0) return []
    return exerciseNames
  }, [exerciseNames])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Progression</h1>
      <p className="text-gray-400 text-sm mb-5">Suivez vos progrès par groupe musculaire</p>

      {/* Tabs */}
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

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400 text-sm">Chargement...</div>
        </div>
      ) : orderedExercises.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-sm">Pas encore de données pour {activeTab}</p>
          <p className="text-gray-600 text-xs mt-1">Enregistrez vos séances pour voir votre progression</p>
        </div>
      ) : (
        <div>
          {orderedExercises.map((exerciceName) => (
            <ExerciseChart
              key={exerciceName}
              exerciseName={exerciceName}
              logs={activeGroupLogs[exerciceName] ?? []}
            />
          ))}
        </div>
      )}
    </div>
  )
}
