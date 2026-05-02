/**
 * itemResolvers.js
 * Resolvers para Queries e Mutations relacionadas a Itens e Claim.
 */

const pool = require('../db/pool');

// Helper: converte snake_case do Postgres para camelCase
const toItem = (row) => ({
  id:          row.id,
  name:        row.name,
  description: row.description,
  quantity:    row.quantity,
  category:    row.category,
  claimedAt:   row.claimed_at?.toISOString() ?? null,
  createdAt:   row.created_at?.toISOString(),
  updatedAt:   row.updated_at?.toISOString(),
  // Guardamos o UUID para o field resolver claimedBy
  _claimedById: row.claimed_by ?? null,
});

const itemQueries = {
  items: async () => {
    const { rows } = await pool.query(
      'SELECT * FROM items ORDER BY category ASC, name ASC'
    );
    return rows.map(toItem);
  },

  item: async (_, { id }) => {
    const { rows } = await pool.query(
      'SELECT * FROM items WHERE id = $1',
      [id]
    );
    return rows[0] ? toItem(rows[0]) : null;
  },

  availableItems: async () => {
    const { rows } = await pool.query(
      'SELECT * FROM items WHERE claimed_by IS NULL ORDER BY category ASC, name ASC'
    );
    return rows.map(toItem);
  },

  itemsByCategory: async (_, { category }) => {
    const { rows } = await pool.query(
      'SELECT * FROM items WHERE category ILIKE $1 ORDER BY name ASC',
      [category]
    );
    return rows.map(toItem);
  },

  partySummary: async () => {
    const { rows } = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM guests)                     AS total_guests,
        (SELECT COUNT(*) FROM guests WHERE confirmed)     AS confirmed_guests,
        (SELECT COUNT(*) FROM items)                      AS total_items,
        (SELECT COUNT(*) FROM items WHERE claimed_by IS NOT NULL) AS claimed_items,
        (SELECT COUNT(*) FROM items WHERE claimed_by IS NULL)     AS available_items
    `);
    const r = rows[0];
    return {
      totalGuests:     parseInt(r.total_guests),
      confirmedGuests: parseInt(r.confirmed_guests),
      totalItems:      parseInt(r.total_items),
      claimedItems:    parseInt(r.claimed_items),
      availableItems:  parseInt(r.available_items),
    };
  },
};

const itemMutations = {
  createItem: async (_, { input }) => {
    const { name, description, quantity = 1, category } = input;
    const { rows } = await pool.query(
      `INSERT INTO items (name, description, quantity, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, quantity, category]
    );
    return toItem(rows[0]);
  },

  updateItem: async (_, { id, input }) => {
    const fields = [];
    const values = [];
    let idx = 1;

    const fieldMap = {
      name:        'name',
      description: 'description',
      quantity:    'quantity',
      category:    'category',
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (input[key] !== undefined) {
        fields.push(`${col} = $${idx++}`);
        values.push(input[key]);
      }
    }

    if (fields.length === 0) throw new Error('Nenhum campo para atualizar.');

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE items SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (!rows[0]) throw new Error('Item não encontrado.');
    return toItem(rows[0]);
  },

  deleteItem: async (_, { id }) => {
    const { rowCount } = await pool.query(
      'DELETE FROM items WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },

  claimItem: async (_, { itemId, guestId }) => {
    // Verifica se item existe e está disponível
    const check = await pool.query(
      'SELECT claimed_by FROM items WHERE id = $1',
      [itemId]
    );
    if (!check.rows[0]) throw new Error('Item não encontrado.');
    if (check.rows[0].claimed_by) {
      throw new Error('Este item já foi reivindicado por outro convidado.');
    }

    // Verifica se o convidado existe
    const guestCheck = await pool.query(
      'SELECT id FROM guests WHERE id = $1',
      [guestId]
    );
    if (!guestCheck.rows[0]) throw new Error('Convidado não encontrado.');

    const { rows } = await pool.query(
      `UPDATE items
       SET claimed_by = $1, claimed_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [guestId, itemId]
    );
    return toItem(rows[0]);
  },

  unclaimItem: async (_, { itemId }) => {
    const { rows } = await pool.query(
      `UPDATE items
       SET claimed_by = NULL, claimed_at = NULL
       WHERE id = $1
       RETURNING *`,
      [itemId]
    );
    if (!rows[0]) throw new Error('Item não encontrado.');
    return toItem(rows[0]);
  },
};

// Field resolver: carrega dados do convidado que reivindicou
const itemFields = {
  Item: {
    claimedBy: async (item) => {
      if (!item._claimedById) return null;
      const { rows } = await pool.query(
        'SELECT * FROM guests WHERE id = $1',
        [item._claimedById]
      );
      if (!rows[0]) return null;
      const r = rows[0];
      return {
        id:        r.id,
        name:      r.name,
        phone:     r.phone,
        email:     r.email,
        confirmed: r.confirmed,
        plusOne:   Number(r.plus_one ?? 0),
        notes:     r.notes,
        createdAt: r.created_at?.toISOString(),
        updatedAt: r.updated_at?.toISOString(),
      };
    },
  },
};

module.exports = { itemQueries, itemMutations, itemFields };
