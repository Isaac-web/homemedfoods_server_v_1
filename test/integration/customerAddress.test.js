const request = require("supertest");
const mongooses = require("mongoose");

const app = require("../../index");
const { Customer } = require("../../models/Customer");
const { CustomerAddress } = require("./../../models/CustomerAddress.js");
const { default: mongoose } = require("mongoose");

describe("/api/customer/addresses", () => {
  let server = null;
  beforeEach(async () => {
    server = app.listen();
  });

  afterEach(async () => {
    await Customer.remove({});
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  const createCustomer = async () => {
    const signUpData = {
      firstname: "John",
      lastname: "Doe",
      email: "johndoe@gmail.com",
      password: "1234567",
      confirmPassword: "1234567",
      phone: "0553039567",
    };
    const res = await request(server)
      .post("/api/customers/register")
      .send(signUpData);

    const token = res.headers["x-auth-token"] || null;
    const customer = res.body;

    return { token, customer };
  };

  describe("POST/", () => {
    let payload = null;
    let token = null;
    beforeEach(async () => {
      payload = {
        line_1: "Address Line 1",
        line_2: "Address Line 2",
        line_3: "Address line 3",
        suburb: "Adum",
        city: "Kumasi",
        digitalAddress: "AUI11003X",
        coords: {
          long: 100,
          lat: 100,
        },
      };

      customer = await createCustomer();
      token = customer.token;
    });

    const run = () => {
      const req = request(server)
        .post("/api/customers/addresses")
        .send(payload);

      if (token) req.set("x-auth-token", token);

      return req;
    };

    it("should return 401 if user is not logged in", async () => {
      token = undefined;

      const res = await run();
      expect(res.status).toBe(401);
    });

    it("should return 400 if no input is provided", async () => {
      payload = null;
      const res = await run();
      expect(res.status).toBe(400);
      expect(res.text).toContain("is required");
    });

    it("should return 400 if line_1 is not provided", async () => {
      delete payload.line_1;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain('"line_1" is required');
    });

    it("should return 400 if line_1 is more than 100 characters", async () => {
      payload.line_1 = new Array(102).join("*");

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain(
        '"line_1" length must be less than or equal to 100 characters long'
      );
    });

    it("should return 400 if line_2 is more than 100 characters", async () => {
      payload.line_2 = new Array(102).join("*");

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toContain(
        '"line_2" length must be less than or equal to 100 characters long'
      );
    });

    it("should return 400 if line_3 is more than 100 characters", async () => {
      payload.line_3 = new Array(102).join("*");

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch(
        '"line_3" length must be less than or equal to 100 characters long'
      );
    });

    it("should return 400 if suburb is not provided", async () => {
      delete payload.suburb;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch('"suburb" is required');
    });

    it("should return 400 if suburb is less than 2 characters", async () => {
      payload.suburb = "1";

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toBe(
        '"suburb" length must be at least 2 characters long'
      );
    });

    it("should return 400 if suburb is more than 100 characters", async () => {
      payload.suburb = await Array(102).join("*");

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch(
        '"suburb" length must be less than or equal to 100 characters long'
      );
    });

    it("should return 400 if city is not provided", async () => {
      delete payload.city;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch('"city" is required');
    });

    it("should return 400 if city is less than 2 characters", async () => {
      payload.city = "1";

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch('"city" length must be at least 2 characters');
    });

    it("should return 400 if city is more than 100 characters", async () => {
      payload.city = new Array(102).join("*");

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch(
        '"city" length must be less than or equal to 100 characters'
      );
    });

    it("should return 400 when digitalAddress is not a string if provided", async () => {
      payload.digitalAddress = 1234;

      const res = await run();

      expect(res.status).toBe(400);
      expect(res.text).toMatch('"digitalAddress" must be a string');
    });

    it("should return 400 when coords is not an object if provided", async () => {
      payload.coords = "Not An Object";

      const res = await run();

      expect(res.status).toBe(400);
    });

    it("should return 200 if all required inputs are provided", async () => {
      const res = await run();

      expect(res.status).toBe(200);
    });

    it("should save the address in the database", async () => {
      await run();

      const address = await CustomerAddress.findOne();

      expect(address).not.toBeNull();
      expect(address).toHaveProperty("customerId");
      expect(address).toHaveProperty("line_1", payload.line_1);
      expect(address).toHaveProperty("line_2", payload.line_2);
      expect(address).toHaveProperty("city", payload.city);
    });
  });

  const createAddress = (customer) => {
    const payload = {
      line_1: "Address Line 1",
      line_2: "Address Line 2",
      line_3: "Address line 3",
      suburb: "Adum",
      city: "Kumasi",
      digitalAddress: "AUI11003X",
      coords: {
        long: 100,
        lat: 100,
      },
    };

    return request(server)
      .post("/api/customers/addresses")
      .send(payload)
      .set("x-auth-token", customer.token);
  };

  describe("GET /", () => {
    let customer = null;
    let address = null;
    beforeEach(async () => {
      customer = await createCustomer();
      address = await createAddress(customer);
    });

    afterEach(async () => {
      await CustomerAddress.remove({});
      await Customer.remove({});
    });

    const run = () => {
      const req = request(server).get("/api/customers/addresses");

      if (customer.token) req.set("x-auth-token", customer.token);

      return req;
    };

    it("should return 401 if customer is not logged in", async () => {
      delete customer.token;

      const res = await run();

      expect(res.status).toBe(401);
    });

    it("should return 200 if user is logged in", async () => {
      const res = await run();

      expect(res.status).toBe(200);
    });

    it("should return the addresses in the body", async () => {
      const res = await run();

      console.log(res.body);
      expect(res.body).not.toBe(null);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).toHaveProperty("customerId");
      expect(res.body[0]).toHaveProperty("city");
      expect(res.body[0]).toHaveProperty("suburb");
      expect(res.body[0]).toHaveProperty("coords");
    });
  });
});
