/**
 * guestResolvers.js
 * Resolvers para Queries e Mutations relacionadas a Convidados.
 */

const pool = require('../db/pool');

/** Contagem de acompanhantes (0–5); protege contra string e alinha com SMALLINT no DB */
function normalizePlusOne(value) {
  const n = Number.parseInt(String(value ?? '0'), 10);
  if (!Number.isFinite(n)) return 0;
  return Math.min(5, Math.max(0, n));
}

// Helper: converte snake_case do Postgres para camelCase
const toGuest = (row) => ({
  id:        row.id,
  name:      row.name,
  phone:     row.phone,
  email:     row.email,
  confirmed: row.confirmed,
  plusOne:   Number(row.plus_one ?? 0),
  notes:     row.notes,
  createdAt: row.created_at?.toISOString(),
  updatedAt: row.updated_at?.toISOString(),
});

const guestQueries = {
  guests: async () => {
    const { rows } = await pool.query(
      'SELECT * FROM guests ORDER BY name ASC'
    );
    return rows.map(toGuest);
  },

  guest: async (_, { id }) => {
    const { rows } = await pool.query(
      'SELECT * FROM guests WHERE id = $1',
      [id]
    );
    return rows[0] ? toGuest(rows[0]) : null;
  },
};

const guestMutations = {
  createGuest: async (_, { input }) => {
    const { name, phone, email, confirmed = false, plusOne = 0, notes } = input;
    const plus = normalizePlusOne(plusOne);
    const { rows } = await pool.query(
      `INSERT INTO guests (name, phone, email, confirmed, plus_one, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, phone, email, confirmed, plus, notes]
    );
    return toGuest(rows[0]);
  },

  updateGuest: async (_, { id, input }) => {
    // Constrói dinamicamente somente os campos enviados
    const fields = [];
    const values = [];
    let idx = 1;

    const fieldMap = {
      name:      'name',
      phone:     'phone',
      email:     'email',
      confirmed: 'confirmed',
      plusOne:   'plus_one',
      notes:     'notes',
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (input[key] !== undefined) {
        fields.push(`${col} = $${idx++}`);
        values.push(key === 'plusOne' ? normalizePlusOne(input[key]) : input[key]);
      }
    }

    if (fields.length === 0) throw new Error('Nenhum campo para atualizar.');

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE guests SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (!rows[0]) throw new Error('Convidado não encontrado.');
    return toGuest(rows[0]);
  },

  deleteGuest: async (_, { id }) => {
    const { rowCount } = await pool.query(
      'DELETE FROM guests WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },

  confirmGuest: async (_, { id }) => {
    const { rows } = await pool.query(
      'UPDATE guests SET confirmed = true WHERE id = $1 RETURNING *',
      [id]
    );
    if (!rows[0]) throw new Error('Convidado não encontrado.');
    return toGuest(rows[0]);
  },
};

// Field resolver: carrega items do convidado
const guestFields = {
  Guest: {
    items: async (guest) => {
      const { rows } = await pool.query(
        'SELECT * FROM items WHERE claimed_by = $1 ORDER BY name ASC',
        [guest.id]
      );
      // importação circular evitada: inline converter
      return rows.map((row) => ({
        id:          row.id,
        name:        row.name,
        description: row.description,
        quantity:    row.quantity,
        category:    row.category,
        claimedAt:   row.claimed_at?.toISOString(),
        createdAt:   row.created_at?.toISOString(),
        updatedAt:   row.updated_at?.toISOString(),
      }));
    },
  },
};

module.exports = { guestQueries, guestMutations, guestFields };
