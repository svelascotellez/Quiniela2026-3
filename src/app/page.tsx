import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TournamentBracket } from "@/components/TournamentBracket";
import { getDynamicMatches } from "@/lib/matchUtils";
import { UserTabs } from "@/components/UserTabs";
import { SignOutButton } from "@/components/SignOutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const rawMatches = await prisma.match.findMany({
    orderBy: { matchNumber: "asc" },
  });
  
  const predictions = await prisma.prediction.findMany({
    where: { userId: session.user.id },
  });

  const matches = getDynamicMatches(rawMatches, predictions);

  const allUsers = await prisma.user.findMany({
    include: { predictions: true },
    orderBy: { totalPoints: "desc" },
  });

  const currentUser = allUsers.find((u) => u.id === session.user.id);
  const rankingUsers = allUsers.filter((u) => u.role !== "ADMIN");
  
  let currentRank = 1;
  let currentPoints = -1;
  const rankedUsers = rankingUsers.map((u, i) => {
    if (u.totalPoints !== currentPoints) {
      currentRank = i + 1;
      currentPoints = u.totalPoints;
    }
    return { ...u, rank: currentRank };
  });

  const finishedMatchesCount = rawMatches.filter(m => m.isFinished).length;
  const maxPointsDisputed = finishedMatchesCount * 3;

  const bracketComponent = (
    <TournamentBracket matches={matches} predictions={predictions} isLocked={currentUser?.isLocked || false} />
  );

  const rankingComponent = (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-[#dcf8c6] rounded-xl shadow-lg border border-[#c1e2a4] p-6 mb-8 text-[#0b132b]">
        <h2 className="text-xl md:text-2xl font-black mb-2 flex items-center gap-2">
          🏆 CLASIFICACIÓN QUINIELA MUNDIAL 2026 🏆
        </h2>
        <p className="text-sm md:text-base font-semibold text-gray-700 flex items-center gap-2 mb-1">
          📊 Actualizado: {new Date().toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short", timeZone: "America/Mexico_City" })}
        </p>
        <p className="text-sm md:text-base font-semibold text-gray-700 flex items-center gap-2">
          🎯 Puntos Máximos Disputados hasta hoy: {maxPointsDisputed}
        </p>
        <hr className="border-t-2 border-dashed border-[#b3d493] my-4" />
        
        <ul className="space-y-3">
          {rankedUsers.map((u, i) => {
            const exactCount = u.predictions.filter(p => p.pointsEarned === 3).length;
            const eff = maxPointsDisputed > 0 ? ((u.totalPoints / maxPointsDisputed) * 100).toFixed(1) : "0.0";
            
            let emoji = "🏃‍♂️";
            if (u.rank === 1) emoji = "🥇";
            else if (u.rank === 2) emoji = "🥈";
            else if (u.rank === 3) emoji = "🥉";

            return (
              <li key={u.id} className={`flex flex-col md:flex-row md:items-center text-sm md:text-base ${u.id === session.user.id ? 'font-black bg-white/50 p-2 rounded -mx-2' : 'font-medium'}`}>
                <div className="flex items-center">
                  <span className="w-6 text-right mr-1">{u.rank}.</span> 
                  <span className="mr-2">{emoji}</span>
                  <span className="uppercase">{u.username}</span> 
                  <span className="mx-2">➔</span> 
                  <span className="font-bold">{u.totalPoints} pts</span>
                </div>
                <span className="text-gray-600 md:ml-2">({exactCount} marcadores exactos | {eff}% efectividad)</span>
              </li>
            )
          })}
        </ul>
        
        {rankingUsers.length > 0 && (
          <>
            <hr className="border-t-2 border-dashed border-[#b3d493] my-4" />
            <p className="font-bold text-center mt-4">
              🔥 ¡Felicidades a {rankingUsers[0].username} que va de líder! ¿Quién ganará? 🍿🚀
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col relative h-screen">
      {/* Top Navbar */}
      <header className="flex justify-between items-center bg-[#0b132b] text-white px-6 py-4 shadow-xl z-20 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#d4af37] tracking-wider uppercase">
            Quiniela Mundial 2026
          </h1>
          <p className="text-gray-300 text-sm font-medium">Panel de {session.user.name}</p>
        </div>
        <div className="flex gap-4 md:gap-6 items-center">
          <div className="text-center hidden sm:block">
            <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Mis Puntos</span>
            <span className="block text-xl font-black text-[#d4af37]">{currentUser?.totalPoints ?? 0}</span>
          </div>
          <a
            href="/api/export"
            className="bg-[#0b132b] border border-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-3 md:px-4 rounded-md transition-colors shadow-lg text-xs md:text-sm flex items-center gap-2"
          >
            <span>📥 Descargar CSV</span>
          </a>
          {session.user.role === "ADMIN" && (
            <Link href="/admin" className="bg-[#d4af37] hover:bg-yellow-500 text-[#0b132b] font-bold py-2 px-3 md:px-4 rounded-md transition-colors shadow-lg text-xs md:text-sm">
              Administración
            </Link>
          )}
          <SignOutButton />
        </div>
      </header>

      {/* Tabs Layout */}
      <UserTabs 
        bracketComponent={bracketComponent} 
        rankingComponent={rankingComponent} 
      />
    </div>
  );
}
