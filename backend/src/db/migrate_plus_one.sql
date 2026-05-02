-- Migração: plus_one de BOOLEAN → SMALLINT (0–5).
-- BOOLEAN não aceita valores 2+; o app usa contagem de acompanhantes.
-- Rode: npm run migrate:plus-one (usa DATABASE_URL do .env)

ALTER TABLE guests DROP CONSTRAINT IF EXISTS plus_one_range;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'guests'
      AND column_name = 'plus_one'
      AND data_type = 'boolean'
  ) THEN
    ALTER TABLE guests ALTER COLUMN plus_one DROP DEFAULT;
    ALTER TABLE guests
      ALTER COLUMN plus_one TYPE SMALLINT
      USING (CASE WHEN plus_one THEN 1 ELSE 0 END);
    ALTER TABLE guests ALTER COLUMN plus_one SET DEFAULT 0;
  END IF;
END $$;

ALTER TABLE guests ADD CONSTRAINT plus_one_range CHECK (plus_one BETWEEN 0 AND 5);
