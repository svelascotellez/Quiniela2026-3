import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, "../../Copa_Mundial_ FIFA 2026.md");
  const content = fs.readFileSync(filePath, "utf-8");

  const lines = content.split("\n");
  
  let currentDate: Date | null = null;
  const matchRegex = /Partido\s+(\d+)\s*[-–]\s*(\d{2}:\d{2})\s*[-–]\s*(.+?)\s+v(?:s\.?)?\s+(.+?)\s*[-–]\s*(.+)/i;

  const matches = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Detect date lines (e.g. "Domingo, 28 de junio 2026" or "Sábado, 4 de julio 2026")
    if (line.match(/^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo),\s+(\d+)\s+de\s+(.+)\s+(\d{4})/i)) {
      const parts = line.match(/^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo),\s+(\d+)\s+de\s+(.+)\s+(\d{4})/i);
      if (parts) {
        const day = parts[2];
        const monthStr = parts[3].toLowerCase();
        const year = parts[4];
        let month = 5; // default june (0-indexed)
        if (monthStr === "julio") month = 6;
        currentDate = new Date(parseInt(year), month, parseInt(day));
      }
    }

    const matchMatch = line.match(matchRegex);
    if (matchMatch && currentDate) {
      const matchNumber = parseInt(matchMatch[1], 10);
      const timeParts = matchMatch[2].split(":");
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      
      const matchDate = new Date(currentDate.getTime());
      matchDate.setHours(hours, minutes, 0, 0);

      matches.push({
        matchNumber,
        date: matchDate,
        teamA: matchMatch[3].trim(),
        teamB: matchMatch[4].trim(),
        stadium: matchMatch[5].trim(),
      });
    }
  }

  console.log(`Encontrados ${matches.length} partidos. Insertando en la base de datos...`);

  for (const match of matches) {
    await prisma.match.upsert({
      where: { matchNumber: match.matchNumber },
      update: {
        date: match.date,
        teamA: match.teamA,
        teamB: match.teamB,
        stadium: match.stadium,
      },
      create: {
        matchNumber: match.matchNumber,
        date: match.date,
        teamA: match.teamA,
        teamB: match.teamB,
        stadium: match.stadium,
      },
    });
  }
  console.log("Partidos insertados exitosamente.");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      role: "ADMIN"
    }
  });
  console.log("Usuario admin creado (username: admin, password: admin123).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
