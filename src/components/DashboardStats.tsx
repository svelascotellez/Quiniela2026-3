"use client";

interface DashboardStatsProps {
  totalParticipants: number;
  lockedQuinielas: number;
  totalMatches: number;
  finishedMatches: number;
  averagePoints: number;
  totalPredictions: number;
  maxPointsPossible: number;
}

export function DashboardStats({
  totalParticipants,
  lockedQuinielas,
  totalMatches,
  finishedMatches,
  averagePoints,
  totalPredictions,
  maxPointsPossible
}: DashboardStatsProps) {
  const tournamentProgress = totalMatches > 0 ? (finishedMatches / totalMatches) * 100 : 0;
  const lockedPercentage = totalParticipants > 0 ? (lockedQuinielas / totalParticipants) * 100 : 0;
  const avgEfficiency = maxPointsPossible > 0 ? (averagePoints / maxPointsPossible) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-[#0b132b] uppercase tracking-wider mb-2">
          Dashboard de Estadísticas
        </h2>
        <p className="text-gray-600 font-medium">
          Descubre cómo va el torneo y el desempeño general de la comunidad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Participantes */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Participantes</h3>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-[#0b132b]">{totalParticipants}</span>
            <p className="text-sm text-gray-500 mt-2 font-medium">Usuarios registrados</p>
          </div>
        </div>

        {/* Quinielas Listas */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-10"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Quinielas Listas</h3>
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-[#0b132b]">{lockedQuinielas}</span>
            <p className="text-sm text-gray-500 mt-2 font-medium">Ya enviaron su pronóstico ({lockedPercentage.toFixed(0)}%)</p>
          </div>
        </div>

        {/* Predicciones Totales */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Predicciones Hechas</h3>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-[#0b132b]">{totalPredictions}</span>
            <p className="text-sm text-gray-500 mt-2 font-medium">Marcadores registrados en BD</p>
          </div>
        </div>

        {/* Avance del Torneo */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:col-span-2 lg:col-span-2 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Avance del Torneo</h3>
            <span className="font-bold text-[#d4af37]">{tournamentProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
            <div className="bg-[#d4af37] h-4 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${tournamentProgress}%` }}>
               <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Se han jugado <strong>{finishedMatches}</strong> de {totalMatches} partidos
          </p>
        </div>

        {/* Promedio de Puntos */}
        <div className="bg-gradient-to-br from-[#0b132b] to-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 font-bold uppercase text-xs tracking-wider">Promedio de Puntos</h3>
            <div className="bg-white/10 p-2 rounded-lg text-[#d4af37]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-[#d4af37]">{averagePoints.toFixed(1)}</span>
            <p className="text-sm text-gray-400 mt-2 font-medium">
              Efectividad promedio: {avgEfficiency.toFixed(1)}%
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
