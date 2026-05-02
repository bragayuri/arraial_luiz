-- Convidado fixo para desenvolvimento (mesmo UUID que o redirect em frontend/src/router/index.js)
INSERT INTO guests (id, name, phone, email, confirmed, plus_one)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Convidado Demo',
  NULL,
  NULL,
  false,
  0
)
ON CONFLICT (id) DO NOTHING;
