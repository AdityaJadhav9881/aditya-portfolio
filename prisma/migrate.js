require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  
  await c.query(`
    CREATE TABLE IF NOT EXISTS "AchievementProject" (
      "achievementId" TEXT NOT NULL,
      "projectId" TEXT NOT NULL,
      CONSTRAINT "AchievementProject_pkey" PRIMARY KEY ("achievementId", "projectId")
    )
  `);
  
  await c.query(`
    DO $$ BEGIN
      ALTER TABLE "AchievementProject" ADD CONSTRAINT "AchievementProject_achievementId_fkey"
        FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);
  
  await c.query(`
    DO $$ BEGIN
      ALTER TABLE "AchievementProject" ADD CONSTRAINT "AchievementProject_projectId_fkey"
        FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);
  
  await c.query(`CREATE INDEX IF NOT EXISTS "AchievementProject_projectId_idx" ON "AchievementProject"("projectId")`);
  
  await c.query(`DO $$ BEGIN ALTER TABLE "Achievement" ADD COLUMN IF NOT EXISTS "event" TEXT; EXCEPTION WHEN duplicate_column THEN null; END $$;`);
  await c.query(`DO $$ BEGIN ALTER TABLE "Achievement" ADD COLUMN IF NOT EXISTS "organization" TEXT; EXCEPTION WHEN duplicate_column THEN null; END $$;`);
  
  console.log('Migration done');
  await c.end();
}

main().catch(e => { console.error(e); process.exit(1); });
