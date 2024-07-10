const sqlForPartialUpdate = require("../helpers/partialUpdate");

describe("sqlForPartialUpdate Function", () => {
  it("filters out keys starting with '_' and constructs the correct query and values", () => {
    const result = sqlForPartialUpdate("users", { name: "John Doe", age: 30 }, "id", 1);

    expect(result.query).toBe(`UPDATE users SET name=$1, age=$2 WHERE id=$3 RETURNING *`);
    expect(result.values).toEqual(["John Doe", 30, 1]);
  });

  it("throws an error if any parameter is missing", async () => {
    try {
      await sqlForPartialUpdate("", {}, "", "");
    } catch (error) {
      expect(error.message).toBe("All parameters must be provided.");
    }
  });

  it("correctly handles unexpected data types", () => {
    const result = sqlForPartialUpdate("users", { name: "John Doe", age: "thirty" }, "id", 1);

    expect(result.query).toBe(`UPDATE users SET name=$1, age=$2 WHERE id=$3 RETURNING *`);
    expect(result.values).toEqual(["John Doe", "thirty", 1]);
  });
});
