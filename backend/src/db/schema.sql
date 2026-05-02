-- ============================================================
--  Arraiau do Luiz — Schema do Banco de Dados (PostgreSQL)
-- ============================================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Tabela: guests
-- Representa cada convidado da festa
-- ============================================================
CREATE TABLE IF NOT EXISTS guests (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255)  NOT NULL,
  phone       VARCHAR(20),
  email       VARCHAR(255),
  confirmed   BOOLEAN       NOT NULL DEFAULT false,
  plus_one    SMALLINT      NOT NULL DEFAULT 0 CHECK (plus_one BETWEEN 0 AND 5),  -- acompanhantes (0–5)
  notes       TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Tabela: items
-- Lista de insumos / itens para a festa
-- ============================================================
CREATE TABLE IF NOT EXISTS items (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255)  NOT NULL,
  description   TEXT,
  quantity      INTEGER       NOT NULL DEFAULT 1,
  category      VARCHAR(100),               -- ex: 'Comida', 'Bebida', 'Decoração'
  claimed_by    UUID          REFERENCES guests(id) ON DELETE SET NULL,
  claimed_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Índices
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_guests_email    ON guests(email);
CREATE INDEX IF NOT EXISTS idx_items_claimed   ON items(claimed_by);
CREATE INDEX IF NOT EXISTS idx_items_category  ON items(category);

-- ============================================================
-- Trigger: atualiza updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_guests_updated_at ON guests;
CREATE TRIGGER set_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_items_updated_at ON items;
CREATE TRIGGER set_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
