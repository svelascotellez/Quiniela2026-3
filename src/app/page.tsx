import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TournamentBracket } from "@/components/TournamentBracket";
import { getDynamicMatches } from "@/lib/matchUtils";

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

  const users = await prisma.user.findMany({
    orderBy: { totalPoints: "desc" },
  });

  const currentUser = users.find((u) => u.id === session.user.id);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col relative">
      {/* Top Navbar */}
      <header className="flex justify-between items-center bg-[#0b132b] text-white px-6 py-4 shadow-xl z-20 sticky top-0">
        <div>
          <h1 className="text-2xl font-black text-[#d4af37] tracking-wider uppercase">
            Quiniela Mundial 2026
          </h1>
          <p className="text-gray-300 text-sm font-medium">Panel de {session.user.name}</p>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-center">
            <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Mis Puntos</span>
            <span className="block text-xl font-black text-[#d4af37]">{currentUser?.totalPoints ?? 0}</span>
          </div>
          {session.user.role === "ADMIN" && (
            <Link href="/admin" className="bg-[#d4af37] hover:bg-yellow-500 text-[#0b132b] font-bold py-2 px-4 rounded-md transition-colors shadow-lg">
              Administración
            </Link>
          )}
        </div>
      </header>

      {/* Bracket Area */}
      <main className="flex-1 overflow-hidden relative">
         <TournamentBracket matches={matches} predictions={predictions} />
      </main>

      {/* Leaderboard Section (Bottom) */}
      <section className="bg-white border-t-4 border-[#d4af37] p-8 shadow-2xl relative z-10">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0b132b] mb-6 text-center uppercase tracking-wider flex items-center justify-center gap-3">
              <span>🏆</span> Tabla de Posiciones Global <span>🏆</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((u, i) => (
                <div key={u.id} className={`flex justify-between items-center p-4 rounded-lg border-2 ${u.id === session.user.id ? 'border-[#d4af37] bg-yellow-50' : 'border-gray-100 bg-white shadow-sm'}`}>
                  <div className="flex items-center gap-4">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shadow-sm ${i === 0 ? 'bg-[#d4af37] text-white' : i === 1 ? 'bg-gray-300 text-gray-800' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {i + 1}
                    </span>
                    <span className={`font-bold text-lg ${u.id === session.user.id ? 'text-[#0b132b]' : 'text-gray-700'}`}>
                      {u.username}
                    </span>
                  </div>
                  <span className="font-black text-[#0b132b] text-xl">{u.totalPoints} <span className="text-xs text-gray-500 font-normal">pts</span></span>
                </div>
              ))}
            </div>
         </div>
      </section>
    </div>
  );
}
