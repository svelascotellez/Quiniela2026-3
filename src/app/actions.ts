"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function savePrediction(matchId: string, data: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "No autorizado" };

  const scoreA = data.get("scoreA") as string;
  const scoreB = data.get("scoreB") as string;
  const penaltyWinner = data.get("penaltyWinner") as string | null;

  if (!scoreA || !scoreB) return { error: "Faltan goles" };

  const numA = parseInt(scoreA);
  const numB = parseInt(scoreB);
  let predWinnerPenalty = null;

  if (numA === numB) {
    if (!penaltyWinner) return { error: "Debe seleccionar ganador en penales" };
    predWinnerPenalty = penaltyWinner;
  }

  // Verificar que el usuario no tenga la quiniela bloqueada
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.isLocked) {
    return { error: "Tu quiniela ya ha sido enviada y no puede modificarse" };
  }

  // Verificar que el partido no haya terminado
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match || match.isFinished) {
    return { error: "El partido ya finalizó o no existe" };
  }

  await prisma.prediction.upsert({
    where: {
      userId_matchId: {
        userId: session.user.id,
        matchId,
      },
    },
    update: {
      predScoreA: numA,
      predScoreB: numB,
      predWinnerPenalty,
    },
    create: {
      userId: session.user.id,
      matchId,
      predScoreA: numA,
      predScoreB: numB,
      predWinnerPenalty,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function lockQuiniela() {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "No autorizado" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { isLocked: true }
  });

  revalidatePath("/");
  return { success: true };
}