/**
 * Generate a selective update query based on a request body:
 *
 * - table: where to make the query
 * - items: the list of columns you want to update
 * - key: the column that we query by (e.g. username, handle, id)
 * - id: current record ID
 *
 * Returns object containing a DB query as a string, and array of
 * string values to be updated
 *
 */

function sqlForPartialUpdate(table, items, key, id) {
  // Validate inputs
  if (!table || !items || !key || !id) {
    throw new Error("All parameters must be provided.");
  }

  // Keep track of item indexes
  let idx = 1;
  let columns = [];

  // Filter out keys that start with "_" -- we don't want these in DB
  for (let key in items) {
    if (key.startsWith("_")) {
      delete items[key];
    }
  }

  for (let column in items) {
    columns.push(`${column}=$${idx}`);
    idx += 1;
  }

  // Build query
  let cols = columns.length ? columns.join(", ") : ""; // Only join columns if there are any
  let query = `UPDATE ${table} SET ${cols} WHERE ${key}=$${idx} RETURNING *`;

  let values = Object.values(items);
  values.push(id);

  return { query, values };
}



module.exports = sqlForPartialUpdate;
