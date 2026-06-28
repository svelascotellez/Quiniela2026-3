import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreateUserForm } from "./CreateUserForm";
import { TournamentBracket } from "@/components/TournamentBracket";
import { getDynamicMatches } from "@/lib/matchUtils";
import { AdminTabs } from "./AdminTabs";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const rawMatches = await prisma.match.findMany({
    orderBy: { matchNumber: "asc" },
  });
  
  const matches = getDynamicMatches(rawMatches);

  const users = await prisma.user.findMany({
    orderBy: { totalPoints: "desc" },
  });

  const getWhatsAppLink = () => {
    let text = "🏆 *Tabla de Posiciones Quiniela Mundial 2026* 🏆\n\n";
    users.forEach((u, i) => {
      text += `${i + 1}. ${u.username} - ${u.totalPoints} pts\n`;
    });
    text += "\nActualizado recientemente.";
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const bracketComponent = (
    <TournamentBracket matches={matches} isAdmin={true} />
  );

  const usersComponent = (
    <div className="flex flex-col md:flex-row gap-8 justify-center w-full">
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold text-[#0b132b] mb-4 uppercase tracking-wider border-b-2 border-gray-200 pb-2">
          Crear Nuevo Usuario
        </h2>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
           <CreateUserForm />
        </div>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold text-[#0b132b] mb-4 uppercase tracking-wider border-b-2 border-gray-200 pb-2 flex justify-between items-center">
          <span>Usuarios Actuales</span>
          <span className="bg-[#d4af37] text-white text-xs px-2 py-1 rounded-full">{users.length}</span>
        </h2>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md max-h-[500px] overflow-y-auto">
          <ul className="space-y-2">
            {users.map((u, i) => (
              <li key={u.id} className="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm border border-gray-100">
                <span className="font-medium text-gray-700">
                  <span className="text-gray-400 mr-2 w-4 inline-block">{i + 1}.</span> 
                  {u.username} 
                  {u.role === "ADMIN" && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">ADMIN</span>}
                </span>
                <span className="font-bold text-[#0b132b]">{u.totalPoints} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col relative h-screen">
      
      {/* Top Navbar */}
      <header className="flex justify-between items-center bg-[#0b132b] text-white px-6 py-4 shadow-xl z-20 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#d4af37] tracking-wider uppercase">
            Panel de Administración
          </h1>
          <p className="text-gray-300 text-sm font-medium">Ingresa resultados oficiales y gestiona usuarios</p>
        </div>
        <div className="flex gap-4 items-center">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md transition-colors shadow-lg flex items-center gap-2"
          >
            <span>Compartir WhatsApp</span>
          </a>
          <Link href="/" className="bg-gray-100 hover:bg-white text-[#0b132b] font-bold py-2 px-4 rounded-md transition-colors shadow-lg">
            Ver mi Quiniela
          </Link>
        </div>
      </header>

      {/* Tabs Layout */}
      <AdminTabs 
        bracketComponent={bracketComponent} 
        usersComponent={usersComponent} 
      />
      
    </div>
  );
}
