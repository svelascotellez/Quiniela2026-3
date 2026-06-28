"use client";

export function GroupStageResults() {
  const groupStageRanking = [
    { rank: 1, name: "LUISGAMBINO", points: 72, exact: 13, eff: "33.3%", emoji: "🥇" },
    { rank: 2, name: "Salvador Velasco", points: 63, exact: 10, eff: "29.2%", emoji: "🥈" },
    { rank: 2, name: "Esly Diaz", points: 63, exact: 8, eff: "29.2%", emoji: "🥈" },
    { rank: 4, name: "Final Nancy", points: 62, exact: 9, eff: "28.7%", emoji: "🏃‍♂️" },
    { rank: 5, name: "Joand Hernandez", points: 61, exact: 9, eff: "28.2%", emoji: "🏃‍♂️" },
    { rank: 6, name: "Final Alex Meneses", points: 60, exact: 10, eff: "27.8%", emoji: "🏃‍♂️" },
    { rank: 7, name: "MoisesLeyva Moyejita", points: 59, exact: 7, eff: "27.3%", emoji: "🏃‍♂️" },
    { rank: 8, name: "Cris HerreraR (1)", points: 58, exact: 8, eff: "26.9%", emoji: "🏃‍♂️" },
    { rank: 9, name: "Yadira Estrada Ganadora", points: 55, exact: 9, eff: "25.5%", emoji: "🏃‍♂️" },
    { rank: 10, name: "Final GuillermoDG", points: 54, exact: 6, eff: "25.0%", emoji: "🏃‍♂️" },
    { rank: 10, name: "SCampoamorR Mundial 2026", points: 54, exact: 6, eff: "25.0%", emoji: "🏃‍♂️" },
    { rank: 12, name: "Final Heidi QJ", points: 53, exact: 6, eff: "24.5%", emoji: "🏃‍♂️" },
    { rank: 13, name: "Jose Carlos Aragon", points: 52, exact: 7, eff: "24.1%", emoji: "🏃‍♂️" },
    { rank: 14, name: "Efrain RA", points: 48, exact: 7, eff: "22.2%", emoji: "🏃‍♂️" },
    { rank: 14, name: "Final GriseldaMP", points: 48, exact: 6, eff: "22.2%", emoji: "🏃‍♂️" },
    { rank: 16, name: "Edith Alejandra Pescador", points: 47, exact: 6, eff: "21.8%", emoji: "🏃‍♂️" },
    { rank: 16, name: "Liliana", points: 47, exact: 6, eff: "21.8%", emoji: "🏃‍♂️" },
    { rank: 18, name: "Arnold Ronaldo", points: 45, exact: 4, eff: "20.8%", emoji: "🏃‍♂️" },
    { rank: 19, name: "IVAN MEJIA QUINIELA 8905", points: 43, exact: 5, eff: "19.9%", emoji: "🏃‍♂️" },
    { rank: 20, name: "Paloma Alonso-1", points: 42, exact: 4, eff: "19.4%", emoji: "🏃‍♂️" },
  ];

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
