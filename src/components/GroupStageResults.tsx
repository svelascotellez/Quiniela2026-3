"use client";

import { groupStageRanking } from "@/lib/groupStageData";

export function GroupStageResults() {

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-[#e8f4f8] rounded-xl shadow-lg border border-[#a2c8e0] p-6 mb-8 text-[#0b132b]">
        <h2 className="text-xl md:text-2xl font-black mb-2 flex items-center gap-2">
          ⚽ RESULTADOS: FASE DE GRUPOS ⚽
        </h2>
        <p className="text-sm md:text-base font-medium text-gray-700 mb-4">
          Esta tabla muestra los resultados finales e históricos de la Fase de Grupos.
        </p>
        <hr className="border-t-2 border-dashed border-[#a2c8e0] my-4" />
        
        <ul className="space-y-3">
          {groupStageRanking.map((u, i) => (
            <li key={i} className="flex flex-col md:flex-row md:items-center text-sm md:text-base font-medium">
              <div className="flex items-center">
                <span className="w-6 text-right mr-1">{u.rank}.</span> 
                <span className="mr-2">{u.emoji}</span>
                <span className="uppercase">{u.name}</span> 
                <span className="mx-2">➔</span> 
                <span className="font-bold">{u.points} pts</span>
              </div>
              <span className="text-gray-600 md:ml-2">
                ({u.exact} marcadores exactos | {u.eff} efectividad)
              </span>
            </li>
          ))}
        </ul>
        
        <hr className="border-t-2 border-dashed border-[#a2c8e0] my-4" />
        <p className="font-bold text-center mt-4">
          ¡Felicidades a LUISGAMBINO por coronarse campeón de la Fase de Grupos! 🎉
        </p>
      </div>
    </div>
  );
}
