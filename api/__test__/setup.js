const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const testUserData = {
  name: "Test User",
  email: "test@example.com",
  password: "testpassword",
};
let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
  await request(app).post("/api/user").send(testUserData).expect(201);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    mongo.stop;
  }
  mongoose.connection.close();
});
