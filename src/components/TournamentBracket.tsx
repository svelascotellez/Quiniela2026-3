"use client";

import { PredictionForm } from "@/app/PredictionForm";
import { LockQuinielaButton } from "@/components/LockQuinielaButton";
import { AdminMatchForm } from "@/app/admin/AdminMatchForm";

export function TournamentBracket({ 
  matches, 
  predictions,
  isAdmin = false,
  isLocked = false 
}: { 
  matches: any[]; 
  predictions?: any[]; 
  isAdmin?: boolean;
  isLocked?: boolean;
}) {
  // Helpers to get match by number
  const getMatch = (num: number) => matches.find(m => m.matchNumber === num);
  
  // Columns Definition
  const left32 = [74, 77, 73, 75, 83, 84, 81, 82].map(getMatch);
  const left16 = [89, 90, 93, 94].map(getMatch);
  const left8 = [97, 98].map(getMatch);
  const left4 = [101].map(getMatch);
  
  const right32 = [76, 78, 79, 80, 86, 88, 85, 87].map(getMatch);
  const right16 = [91, 92, 95, 96].map(getMatch);
  const right8 = [99, 100].map(getMatch);
  const right4 = [102].map(getMatch);

  const final = getMatch(104);
  const third = getMatch(103);

  const renderMatch = (match: any) => {
    if (!match) return <div className="w-64 h-32 opacity-0"></div>; // Placeholder
    
    if (isAdmin) {
      return <AdminMatchForm key={match.id} match={match} />;
    } else {
      const pred = predictions?.find(p => p.matchId === match.id);
      return <PredictionForm key={match.id} match={match} prediction={pred} isLocked={isLocked} />;
    }
  };

  return (
    <div className="w-full h-full overflow-auto bg-[#f8f9fa] p-8">
      
      {/* Lock Button Section */}
      <div className="min-w-[1200px] max-w-[2000px] mx-auto">
        <LockQuinielaButton isLocked={isLocked} />
      </div>

      {/* Headers Row */}
      <div className="flex justify-between min-w-[2000px] mb-8 sticky top-0 z-10 px-4">
        <div className="w-64 bg-[#0b132b] text-white text-center py-2 rounded-lg font-bold shadow-md">RONDA DE 32</div>
        <div className="w-64 bg-[#0b132b] text-white text-center py-2 rounded-lg font-bold shadow-md">OCTAVOS</div>
        <div className="w-64 bg-[#0b132b] text-white text-center py-2 rounded-lg font-bold shadow-md">CUARTOS</div>
        <div className="w-64 bg-[#0b132b] text-white text-center py-2 rounded-lg font-bold shadow-md">SEMIFINAL</div>
        <div className="w-64 bg-[#d4af37] text-white text-center py-2 rounded-lg font-bold shadow-md">GRAN FINAL</div>
        <div className="w-64 bg-[#0b132b] text-white text-center py-2 rounded-lg font-bold shadow-md">SEMIFINAL</div>
        <div className="w-64 bg-[#0b132b] text-white text-center py-2 rounded-lg font-bold shadow-md">CUARTOS</div>
        <div className="w-64 bg-[#0b132b] text-white text-center py-2 rounded-lg font-bold shadow-md">OCTAVOS</div>
        <div className="w-64 bg-[#0b132b] text-white text-center py-2 rounded-lg font-bold shadow-md">RONDA DE 32</div>
      </div>

      {/* Bracket Body */}
      <div className="flex justify-between min-w-[2000px] h-[1400px] gap-4 px-4 relative">
        
        {/* Left Side */}
        <div className="flex flex-col justify-around h-full">{left32.map(renderMatch)}</div>
        <div className="flex flex-col justify-around h-full py-[4%]" >{left16.map(renderMatch)}</div>
        <div className="flex flex-col justify-around h-full py-[12%]">{left8.map(renderMatch)}</div>
        <div className="flex flex-col justify-around h-full py-[28%]">{left4.map(renderMatch)}</div>
        
        {/* Center: Final and Third Place */}
        <div className="flex flex-col items-center justify-center h-full gap-24 relative">
           {/* Trophy Icon above final */}
           <div className="absolute top-1/2 -mt-40 text-4xl text-[#d4af37]">🏆</div>
           
           <div className="relative z-10 transform scale-110">
              {renderMatch(final)}
           </div>

           {/* Third place slightly below */}
           <div className="relative z-10 opacity-90 scale-90 mt-20 flex flex-col items-center">
              <span className="text-gray-500 font-bold mb-2">TERCER LUGAR</span>
              {renderMatch(third)}
           </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-around h-full py-[28%]">{right4.map(renderMatch)}</div>
        <div className="flex flex-col justify-around h-full py-[12%]">{right8.map(renderMatch)}</div>
        <div className="flex flex-col justify-around h-full py-[4%]">{right16.map(renderMatch)}</div>
        <div className="flex flex-col justify-around h-full">{right32.map(renderMatch)}</div>

      </div>

    </div>
  );
}
