"use client";

import { savePrediction } from "./actions";
import { useState } from "react";

// Helper simple para banderas (ejemplo, se puede ampliar)
const getFlag = (team: string) => {
  const flags: Record<string, string> = {
    "Alemania": "🇩🇪",
    "Argentina": "🇦🇷",
    "Brasil": "🇧🇷",
    "Francia": "🇫🇷",
    "España": "🇪🇸",
    "Portugal": "🇵🇹",
    "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "México": "🇲🇽",
    "EE. UU.": "🇺🇸",
    "Canadá": "🇨🇦",
    "Bélgica": "🇧🇪",
    "P. Bajos": "🇳🇱",
    "Senegal": "🇸🇳",
    "Japón": "🇯🇵",
    "Marruecos": "🇲🇦",
    "Croacia": "🇭🇷",
    "Suiza": "🇨🇭",
    "Uruguay": "🇺🇾",
    "Colombia": "🇨🇴",
    "Ecuador": "🇪🇨",
    "Corea del Sur": "🇰🇷",
    "Australia": "🇦🇺",
    "Ghana": "🇬🇭",
    "Paraguay": "🇵🇾",
    "Suecia": "🇸🇪",
    "Sudáfrica": "🇿🇦",
    "Austria": "🇦🇹",
    "Bosnia": "🇧🇦",
    "Noruega": "🇳🇴",
    "Argelia": "🇩🇿",
    "Egipto": "🇪🇬",
    "Cabo Verde": "🇨🇻",
    "DR Congo": "🇨🇩",
    "C. Marfil": "🇨🇮"
  };
  
  // Buscar coincidencia parcial si el nombre tiene texto extra como "Ganador de..."
  for (const key of Object.keys(flags)) {
    if (team.includes(key)) return flags[key];
  }
  return "🏳️";
};

export function PredictionForm({ match, prediction, isLocked = false }: { match: any, prediction: any, isLocked?: boolean }) {
  const [scoreA, setScoreA] = useState(prediction?.predScoreA ?? "");
  const [scoreB, setScoreB] = useState(prediction?.predScoreB ?? "");
  const [penaltyWinner, setPenaltyWinner] = useState(prediction?.predWinnerPenalty ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const isFinished = match.isFinished;
  const disabled = isFinished || isLocked;

  // Auto-save on blur instead of explicit button to keep it clean (bracket style)
  const handleSave = async (sA: string, sB: string, pWinner: string) => {
    if (isFinished || sA === "" || sB === "") return;
    setLoading(true);
    const formData = new FormData();
    formData.append("scoreA", sA);
    formData.append("scoreB", sB);
    if (sA === sB && pWinner) formData.append("penaltyWinner", pWinner);
    
    const res = await savePrediction(match.id, formData);
    setLoading(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const isTie = scoreA !== "" && scoreB !== "" && scoreA === scoreB;

  // Render logic for winner checkmark
  const getWinner = () => {
    if (isFinished) {
       if (match.realScoreA > match.realScoreB) return "A";
       if (match.realScoreA < match.realScoreB) return "B";
       return match.realWinnerPenalty;
    } else {
       if (scoreA !== "" && scoreB !== "") {
         if (parseInt(scoreA) > parseInt(scoreB)) return "A";
         if (parseInt(scoreA) < parseInt(scoreB)) return "B";
         return penaltyWinner;
       }
    }
    return null;
  };

  const winner = getWinner();

  return (
    <div className={`w-64 bg-white rounded-lg border-2 shadow-sm flex flex-col relative transition-all ${saved ? 'border-green-400' : 'border-[#d4af37]'}`}>
      {/* Header */}
      <div className="bg-[#fcfaf2] px-3 py-1 text-[10px] text-gray-500 font-medium flex justify-between items-center border-b border-gray-100 rounded-t-lg">
        <span className="font-bold text-gray-700">M{match.matchNumber}</span>
        <span>{new Date(match.date).toLocaleDateString("en-US", {month:"2-digit", day:"2-digit"})} - {new Date(match.date).toLocaleTimeString("en-US", {hour:"2-digit", minute:"2-digit", hour12:false})}</span>
      </div>
      
      {/* Stadium & Location */}
      <div className="px-3 py-1 flex items-center justify-between border-b border-gray-100 bg-[#fdfdfc]">
        <div className="flex items-center text-[10px] text-gray-500">
          <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="truncate max-w-[120px]">{match.stadium}</span>
        </div>
        <span className="text-[10px] font-bold text-[#d4af37]">USA/MEX/CAN</span>
      </div>

      {/* Team A */}
      <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100 group relative">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <span className="text-lg">{getFlag(match.teamA)}</span>
          <span className={`font-semibold text-sm truncate ${winner === "A" ? 'text-gray-900' : 'text-gray-500'}`}>{match.teamA}</span>
        </div>
        <div className="flex items-center gap-2">
          {winner === "A" && <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            disabled={disabled}
            className={`w-8 h-8 text-center text-sm font-bold bg-gray-50 border rounded-md outline-none transition-colors disabled:opacity-70 disabled:bg-gray-100 ${winner === "A" ? 'text-gray-900 border-gray-300' : 'text-gray-500 border-gray-200'}`}
            value={isFinished ? (match.realScoreA ?? "") : scoreA}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              setScoreA(val);
              if (val !== "" && scoreB !== "" && val !== scoreB) handleSave(val, scoreB, penaltyWinner);
            }}
            onBlur={() => {
              if (scoreA !== "" && scoreB !== "") handleSave(scoreA, scoreB, penaltyWinner);
            }}
          />
        </div>
      </div>

      {/* Team B */}
      <div className="px-3 py-2 flex items-center justify-between group relative">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <span className="text-lg">{getFlag(match.teamB)}</span>
          <span className={`font-semibold text-sm truncate ${winner === "B" ? 'text-gray-900' : 'text-gray-500'}`}>{match.teamB}</span>
        </div>
        <div className="flex items-center gap-2">
          {winner === "B" && <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            disabled={disabled}
            className={`w-8 h-8 text-center text-sm font-bold bg-gray-50 border rounded-md outline-none transition-colors disabled:opacity-70 disabled:bg-gray-100 ${winner === "B" ? 'text-gray-900 border-gray-300' : 'text-gray-500 border-gray-200'}`}
            value={isFinished ? (match.realScoreB ?? "") : scoreB}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              setScoreB(val);
              if (val !== "" && scoreA !== "" && val !== scoreA) handleSave(scoreA, val, penaltyWinner);
            }}
            onBlur={() => {
              if (scoreA !== "" && scoreB !== "") handleSave(scoreA, scoreB, penaltyWinner);
            }}
          />
        </div>
      </div>

      {/* Penalty Selector */}
      {!isFinished && !isLocked && isTie && (
        <div className="bg-amber-50 p-2 text-xs text-amber-900 border-t border-amber-100 rounded-b-lg flex flex-col items-center">
          <span className="font-medium mb-1">Empate. Selecciona ganador:</span>
          <div className="flex gap-4">
             <label className="flex items-center gap-1 cursor-pointer">
                <input type="radio" name={`pen_${match.id}`} checked={penaltyWinner === "A"} onChange={() => { setPenaltyWinner("A"); handleSave(scoreA, scoreB, "A"); }} className="accent-amber-600" />
                <span className="truncate max-w-[60px]">{match.teamA}</span>
             </label>
             <label className="flex items-center gap-1 cursor-pointer">
                <input type="radio" name={`pen_${match.id}`} checked={penaltyWinner === "B"} onChange={() => { setPenaltyWinner("B"); handleSave(scoreA, scoreB, "B"); }} className="accent-amber-600" />
                <span className="truncate max-w-[60px]">{match.teamB}</span>
             </label>
          </div>
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
          <div className="w-5 h-5 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
