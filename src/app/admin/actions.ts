"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createUser(data: FormData) {
  const username = data.get("username") as string;
  const password = data.get("password") as string;

  if (!username || !password) return { error: "Faltan campos" };

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "El usuario ya existe o hubo un error" };
  }
}

export async function changeUserPassword(userId: string, data: FormData) {
  const newPassword = data.get("password") as string;
  if (!newPassword || newPassword.length < 4) return { error: "La contraseña debe tener al menos 4 caracteres." };

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    revalidatePath("/admin");
    return { success: true };
  } catch(error) {
    return { error: "No se pudo actualizar la contraseña" };
  }
}

export async function updateMatchResult(matchId: string, data: FormData) {
  const scoreA = data.get("scoreA") as string;
  const scoreB = data.get("scoreB") as string;
  const penaltyWinner = data.get("penaltyWinner") as string | null;

  if (!scoreA || !scoreB) return { error: "Faltan goles" };

  const numA = parseInt(scoreA);
  const numB = parseInt(scoreB);

  let realWinnerPenalty = null;
  if (numA === numB) {
    if (!penaltyWinner) return { error: "Debe seleccionar ganador en penales" };
    realWinnerPenalty = penaltyWinner;
  }

  // Actualizar el partido
  await prisma.match.update({
    where: { id: matchId },
    data: {
      isFinished: true,
      realScoreA: numA,
      realScoreB: numB,
      realWinnerPenalty,
    },
  });

  // Recalcular puntos
  await recalculatePoints(matchId, numA, numB, realWinnerPenalty);

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

async function recalculatePoints(matchId: string, realA: number, realB: number, realWinnerPenalty: string | null) {
  const predictions = await prisma.prediction.findMany({
    where: { matchId },
  });

  for (const p of predictions) {
    let points = 0;

    // Verificar ganador del partido
    const realWinner = realA > realB ? "A" : realA < realB ? "B" : realWinnerPenalty;
    const predWinner = p.predScoreA > p.predScoreB ? "A" : p.predScoreA < p.predScoreB ? "B" : p.predWinnerPenalty;

    const isExactScore = p.predScoreA === realA && p.predScoreB === realB;
    const isExactPenalty = realWinnerPenalty ? p.predWinnerPenalty === realWinnerPenalty : true;

    if (isExactScore && isExactPenalty) {
      points = 3; // Marcador exacto (y penales exacto si aplica)
    } else if (realWinner === predWinner) {
      points = 1; // Acertó el resultado (quién avanza)
    }

    await prisma.prediction.update({
      where: { id: p.id },
      data: { pointsEarned: points },
    });
  }

  // Actualizar total de puntos por usuario
  const users = await prisma.user.findMany();
  for (const user of users) {
    const userPreds = await prisma.prediction.aggregate({
      where: { userId: user.id },
      _sum: { pointsEarned: true },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { totalPoints: userPreds._sum.pointsEarned || 0 },
    });
  }
}
