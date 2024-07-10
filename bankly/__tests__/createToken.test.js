const jwt = require("jsonwebtoken");
const createToken = require("../helpers/createToken");


jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mockedToken"),
}));

describe("createToken Function", () => {
  it("returns a string representing the token", () => {
    const token = createToken("testUser");
    expect(typeof token).toBe("string");
    expect(jwt.sign).toHaveBeenCalledWith(expect.objectContaining({ username: "testUser" }), expect.any(String));
  });

  it("includes the expected payload in the token", () => {
    const token = createToken("testUser", true);
    expect(jwt.sign).toHaveBeenCalledWith(expect.objectContaining({ username: "testUser", admin: true }), expect.any(String));
  });
});
