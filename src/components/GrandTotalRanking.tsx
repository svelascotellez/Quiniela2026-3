"use client";

import { groupStageRanking } from "@/lib/groupStageData";
import { RefreshButton } from "./RefreshButton";

interface DbUser {
  id: string;
  username: string;
  totalPoints: number;
}

export function GrandTotalRanking({
  dbUsers,
  maxPointsDisputed
}: {
  dbUsers: DbUser[];
  maxPointsDisputed: number;
}) {
  // Combine points
  const combinedData = dbUsers.map(dbUser => {
    // Attempt to match names case-insensitively and ignoring extra spaces
    const cleanDbName = dbUser.username.trim().toLowerCase();
    const groupMatch = groupStageRanking.find(g => g.name.trim().toLowerCase() === cleanDbName);
    
    const groupPoints = groupMatch ? groupMatch.points : 0;
    const knockoutPoints = dbUser.totalPoints;
    const totalPoints = groupPoints + knockoutPoints;

    return {
      id: dbUser.id,
      username: dbUser.username,
      groupPoints,
      knockoutPoints,
      totalPoints
    };
  });

  // Sort descending
  combinedData.sort((a, b) => b.totalPoints - a.totalPoints);

  // Apply Olympic Ranking
  let currentRank = 1;
  let currentPoints = -1;
  const rankedUsers = combinedData.map((u, i) => {
    if (u.totalPoints !== currentPoints) {
      currentRank = i + 1;
      currentPoints = u.totalPoints;
    }
    return { ...u, rank: currentRank };
  });

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-[#fff9e6] rounded-xl shadow-lg border border-[#f5d97d] p-6 mb-8 text-[#0b132b]">
        <h2 className="text-xl md:text-2xl font-black mb-2 flex items-center gap-2">
          🌟 RANKING ACUMULADO (GRUPOS + ELIMINATORIAS) 🌟
        </h2>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div>
            <p className="text-sm md:text-base font-medium text-gray-700 mb-1">
              Esta tabla suma los puntos históricos de la Fase de Grupos con los puntos actuales.
            </p>
            <p className="text-sm md:text-base font-semibold text-gray-700 flex items-center gap-2 mb-1">
              📊 Actualizado: {new Date().toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short", timeZone: "America/Mexico_City" })}
            </p>
          </div>
          <div>
            <RefreshButton />
          </div>
        </div>
        <hr className="border-t-2 border-dashed border-[#f5d97d] my-4" />
        
        <ul className="space-y-3">
          {rankedUsers.map((u, i) => {
            let emoji = "🏃‍♂️";
            if (u.rank === 1) emoji = "🥇";
            else if (u.rank === 2) emoji = "🥈";
            else if (u.rank === 3) emoji = "🥉";

            return (
              <li key={u.id} className="flex flex-col md:flex-row md:items-center text-sm md:text-base font-medium p-2 hover:bg-white/50 rounded transition-colors">
                <div className="flex items-center flex-1">
                  <span className="w-6 text-right mr-1 font-bold">{u.rank}.</span> 
                  <span className="mr-2">{emoji}</span>
                  <span className="uppercase">{u.username}</span> 
                </div>
                <div className="flex items-center md:ml-4 text-gray-600">
                  <span className="text-xs mr-2">Grupos: <span className="font-bold text-[#0b132b]">{u.groupPoints}</span></span>
                  <span className="text-xs mr-2">+ F.Final: <span className="font-bold text-[#0b132b]">{u.knockoutPoints}</span></span>
                  <span className="mx-2">➔</span> 
                  <span className="font-bold text-lg text-[#d4af37]">{u.totalPoints} pts</span>
                </div>
              </li>
            );
          })}
        </ul>
        
        {rankedUsers.length > 0 && (
          <>
            <hr className="border-t-2 border-dashed border-[#f5d97d] my-4" />
            <p className="font-bold text-center mt-4">
              🔥 ¡{rankedUsers[0].username} encabeza el Ranking Acumulado Absoluto! 👑
            </p>
          </>
        )}
      </div>
    </div>
  );
}
