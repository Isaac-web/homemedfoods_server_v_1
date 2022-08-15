const crypto = require("crypto");
const request = require("supertest");
const { Customer } = require("../../models/Customer");
const app = require("../../index");
const mongoose = require("mongoose");

let server = null;
let payload;
describe("/api/customers", () => {
  beforeEach(async () => {
    server = app.listen();
  });

  afterEach(async () => {
    await Customer.deleteMany();
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  const run = () => {
    return request(server).post("/api/customers/register").send(payload);
  };

  describe("POST /register", () => {
    beforeEach(() => {
      payload = {
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@gmail.com",
        password: "1234567",
        confirmPassword: "1234567",
        phone: "0553039567",
      };
    });

    it("it should return 400 if no input is provided", async () => {
      payload = null;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).not.toBeFalsy();
      expect(res.text).toMatch("is required");
    });

    it("should return 400 if firstname is not provided", async () => {
      delete payload.firstname;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain("is required");
    });

    it("should return 400 if firstname is less than 2 characters", async () => {
      payload.firstname = "1";

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain("at least 2 characters");
    });

    it("should return 400 if firstname is more than 100 characters", async () => {
      const str = new Array(102).join("*"); // does not work when provided as string
      payload.firstname = str;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain(
        "must be less than or equal to 100 characters"
      );
    });

    it("should return 400 if lastname is not provided", async () => {
      delete payload.lastname;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain("is required");
    });

    it("should return 400 if lastname less than 2 characters", async () => {
      payload.lastname = "1";

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain("at least 2 characters");
    });

    it("should return 400 if firstname is more than 100 characters", async () => {
      const str = new Array(102).join("*"); // does not work when provided as string
      payload.lastname = str;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain(
        "must be less than or equal to 100 characters"
      );
    });

    it("should return 400 if email is not provided", async () => {
      delete payload.email;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain("is required");
    });

    it("should return 400 if email is invalid", async () => {
      payload.email = "invalid_email";

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain("must be a valid email");
    });

    it("should return 400 if phone is not provided", async () => {
      delete payload.phone;

      const res = await run();

      expect(res.status).toBe(400);
    });

    it("should return 400 if phone is less than 3 characters", async () => {
      payload.phone = "12";

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch(
        '"phone" length must be at least 3 characters long'
      );
    });

    it("should return 400 if phone is more than 15 characters", async () => {
      const str = new Array(17).join("*");
      payload.phone = str;

      const res = await run();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is not provided", async () => {
      delete payload.password;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain("required");
    });

    it("should return 400 if password is less than 7 characters", async () => {
      payload.password = "1234";

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain("must be at least 7 characters");
    });

    it("should return 400 if password is more than 150 charaters", async () => {
      const str = crypto.randomBytes(152);
      payload.password = str;

      const res = await run();

      expect(res.status).toBe(400);
    });

    it("should return 400 if confirmPassword is not provided", async () => {
      delete payload.confirmPassword;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain("is required");
    });

    it("should return 400 if confirmPassword is less than 7 characters", async () => {
      payload.confirmPassword = "1234";

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain("at least 7 characters");
    });

    it("should return 400 if confirmPassword is more than 150 charaters", async () => {
      const str = new Array(152).join("*");
      payload.password = str;
      payload.confirmPassword = str;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain("less than or equal to");
    });

    it("should return 400 if password and confirmPassword are different", async () => {
      const password = new Array(10).join("*");
      const confirmPassword = new Array(10).join("#");

      payload.password = password;
      payload.confirmPassword = confirmPassword;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch("Passwords donnot match.");
    });

    it("should return 400 if user already exists", async () => {
      await Customer.insertMany([payload]);

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch("Email is already taken.");
    });

    it("should return 200 if all required inputs are provided", async () => {
      const res = await run();

      expect(res.status).toBe(200);
    });

    it("should save the user in the database", async () => {
      await run();

      const customer = await Customer.findOne({ email: payload.email });

      delete payload.password;
      delete payload.confirmPassword;

      expect(customer).not.toBeNull();
      expect(customer).toHaveProperty("firstname", payload.firstname);
      expect(customer).toHaveProperty("lastname", payload.lastname);
      expect(customer).toHaveProperty("email", payload.email);
      expect(customer).toHaveProperty("phone", payload.phone);
    });

    it("should return the user to the client", async () => {
      const res = await run();

      expect(res.body).not.toBeNull();
      expect(res.body).toHaveProperty("firstname", payload.firstname);
      expect(res.body).toHaveProperty("lastname", payload.lastname);
      expect(res.body).toHaveProperty("email", payload.email);
      expect(res.body).toHaveProperty("phone", payload.phone);
    });
  });

  describe("POST /login", () => {
    beforeEach(async () => {
      await request(server).post("/api/customers/register").send({
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@gmail.com",
        password: "1234567",
        confirmPassword: "1234567",
        phone: "0553039567",
      });

      payload = {
        email: "johndoe@gmail.com",
        password: "1234567",
      };
    });

    afterEach(async () => {
      await Customer.deleteMany();
    });

    const run = () => {
      return request(server).post("/api/customers/login").send(payload);
    };

    it("should return 400 if no input is provided", async () => {
      payload = null;

      const res = await run();

      expect(res.status).toBe(400);
    });

    it("should return 400 if email is not provided", async () => {
      delete payload.email;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch('"email" is required');
    });

    it("should return 400 if email is invalid", async () => {
      payload.email = "invalid_email";

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch('"email" must be a valid email');
    });

    it("should return 400 if password is not provided", async () => {
      delete payload.password;

      const res = await run();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is less than 7 characters", async () => {
      payload.password = "123456";

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch(
        '"password" length must be at least 7 characters long'
      );
    });

    it("should return 400 if password length is more than 150 characters", async () => {
      const str = new Array(152).join("*");
      payload.password = str;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch(
        '"password" length must be less than or equal to 150 characters long'
      );
    });

    it("should return 404 if user with given email is not found", async () => {
      payload.email = "__missing@gmail.com";

      const res = await run();

      expect(res.status).toBe(404);
      expect(res.text).toMatch("Invalid email or password.");
    });

    it("should return 400 if password is invalid", async () => {
      payload.password = "dummy_password";

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch("Invalid email or password.");
    });

    it("should return 200 if inputs are valid", async () => {
      const res = await run();

      expect(res.status).toBe(200);
    });

    it("should return a token in the body", async () => {
      const res = await run();

      expect(res.status).toBe(200);
      expect(res.body).not.toBeNull();
      expect(res.body).toHaveProperty("token");
      expect(res.body.token.length).not.toBeLessThan(50);
    });
  });
});
