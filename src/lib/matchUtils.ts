import { Match } from "@prisma/client";

export function getDynamicMatches(matches: Match[], predictions?: any[]): Match[] {
  const matchMap = new Map<number, Match & { dynamicTeamA?: string, dynamicTeamB?: string }>();
  
  for (const m of matches) {
    matchMap.set(m.matchNumber, { ...m, dynamicTeamA: m.teamA, dynamicTeamB: m.teamB });
  }

  const resolveTeamName = (teamName: string): string => {
    const ganadorMatch = teamName.match(/Ganador Partido (\d+)/i);
    if (ganadorMatch) {
      const parentMatchNumber = parseInt(ganadorMatch[1], 10);
      const parentMatch = matchMap.get(parentMatchNumber);
      if (parentMatch) {
        if (predictions) {
          const pred = predictions.find(p => p.matchId === parentMatch.id);
          if (pred) {
            const pScoreA = pred.predScoreA;
            const pScoreB = pred.predScoreB;
            if (pScoreA > pScoreB) return parentMatch.dynamicTeamA!;
            if (pScoreA < pScoreB) return parentMatch.dynamicTeamB!;
            if (pred.predWinnerPenalty) return pred.predWinnerPenalty === "A" ? parentMatch.dynamicTeamA! : parentMatch.dynamicTeamB!;
          }
        }
        
        if (parentMatch.isFinished) {
          const pScoreA = parentMatch.realScoreA!;
          const pScoreB = parentMatch.realScoreB!;
          if (pScoreA > pScoreB) return parentMatch.dynamicTeamA!;
          if (pScoreA < pScoreB) return parentMatch.dynamicTeamB!;
          return parentMatch.realWinnerPenalty === "A" ? parentMatch.dynamicTeamA! : parentMatch.dynamicTeamB!;
        } else {
          return `Ganador de ${parentMatch.dynamicTeamA} / ${parentMatch.dynamicTeamB}`;
        }
      }
    }

    const perdedorMatch = teamName.match(/Perdedor Partido (\d+)/i);
    if (perdedorMatch) {
      const parentMatchNumber = parseInt(perdedorMatch[1], 10);
      const parentMatch = matchMap.get(parentMatchNumber);
      if (parentMatch) {
        if (predictions) {
          const pred = predictions.find(p => p.matchId === parentMatch.id);
          if (pred) {
            const pScoreA = pred.predScoreA;
            const pScoreB = pred.predScoreB;
            if (pScoreA > pScoreB) return parentMatch.dynamicTeamB!;
            if (pScoreA < pScoreB) return parentMatch.dynamicTeamA!;
            if (pred.predWinnerPenalty) return pred.predWinnerPenalty === "A" ? parentMatch.dynamicTeamB! : parentMatch.dynamicTeamA!;
          }
        }
        
        if (parentMatch.isFinished) {
          const pScoreA = parentMatch.realScoreA!;
          const pScoreB = parentMatch.realScoreB!;
          if (pScoreA > pScoreB) return parentMatch.dynamicTeamB!;
          if (pScoreA < pScoreB) return parentMatch.dynamicTeamA!;
          return parentMatch.realWinnerPenalty === "A" ? parentMatch.dynamicTeamB! : parentMatch.dynamicTeamA!;
        } else {
          return `Perdedor de ${parentMatch.dynamicTeamA} / ${parentMatch.dynamicTeamB}`;
        }
      }
    }
    
    return teamName;
  };

  const sortedMatches = Array.from(matchMap.values()).sort((a, b) => a.matchNumber - b.matchNumber);

  for (const m of sortedMatches) {
    m.dynamicTeamA = resolveTeamName(m.teamA);
    m.dynamicTeamB = resolveTeamName(m.teamB);
  }

  return sortedMatches.map(m => {
    const { dynamicTeamA, dynamicTeamB, ...rest } = m;
    return {
      ...rest,
      teamA: dynamicTeamA!,
      teamB: dynamicTeamB!
    } as Match;
  });
}
