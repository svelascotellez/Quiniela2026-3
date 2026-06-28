import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { predictions: { include: { match: true } } }
  });

  if (!user) {
    return new NextResponse("Usuario no encontrado", { status: 404 });
  }

  // Generar contenido CSV
  let csv = "Partido,Fecha,Estadio,Equipo A,Equipo B,Pronostico A,Pronostico B,Ganador Penales,Puntos Obtenidos\n";
  
  // Ordenar pronósticos por número de partido
  const sortedPredictions = user.predictions.sort((a, b) => a.match.matchNumber - b.match.matchNumber);

  for (const p of sortedPredictions) {
    // Evitar errores con las comas en los textos usando comillas
    const stadium = `"${p.match.stadium}"`;
    const date = `"${p.match.date.toISOString()}"`;

    const row = [
      `M${p.match.matchNumber}`,
      date,
      stadium,
      p.match.teamA,
      p.match.teamB,
      p.predScoreA,
      p.predScoreB,
      p.predWinnerPenalty || "N/A",
      p.pointsEarned
    ].map(String).join(",");
    
    csv += row + "\n";
  }

  // Configurar las cabeceras para que el navegador descargue el archivo
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pronosticos-${user.username}.csv"`
    }
  });
}
