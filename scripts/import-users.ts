import * as xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Reading Excel file...');
  const workbook = xlsx.readFile('Usuarios-quiniela.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[] = xlsx.utils.sheet_to_json(sheet);

  console.log(`Found ${rows.length} users in the Excel file.`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const row of rows) {
    // Trim whitespace from username to avoid accidental spaces
    const rawUsername = row.Usuario ? String(row.Usuario).trim() : null;
    const rawPassword = row.Password ? String(row.Password).trim() : null;

    if (!rawUsername || !rawPassword) {
      console.log(`Skipping invalid row: ${JSON.stringify(row)}`);
      continue;
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { username: rawUsername }
    });

    if (existing) {
      console.log(`Skipping user '${rawUsername}' (already exists).`);
      skippedCount++;
      continue;
    }

    // Hash the password (cost 10)
    const hashedPassword = await hash(rawPassword, 10);

    await prisma.user.create({
      data: {
        username: rawUsername,
        password: hashedPassword,
        role: "USER"
      }
    });

    console.log(`Created user: ${rawUsername}`);
    createdCount++;
  }

  console.log(`\nImport complete! Created: ${createdCount}, Skipped: ${skippedCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
