// Import necessary modules and other dependencies here
const request = require("supertest");
const app = require("../../server");

const testUserData = {
  email: "test@gmail.com",
  password: "test",
};

let authToken;
let userId;
beforeAll(async () => {
  // Register a test user and get the authentication token
  const response = await request(app)
    .post("/api/user/login")
    .send(testUserData)
    .expect(200);
  userId = response.body._id;
  authToken = response.body.token;
});

// userRoutes.test.js
describe("User Routes", () => {
  it("should login a user", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .send({
        name: "test",
        email: `test@gmail.com`,
        password: "test",
      })
      .expect(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should log in an existing user", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .send({
        email: testUserData.email,
        password: testUserData.password,
      })
      .expect(200);

    expect(response.body).toHaveProperty("token");
  });

  it("should get a list of all users", async () => {
    const response = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  // Add more user route test cases as needed
});

// chatRoutes.test.js
describe("Chat Routes", () => {
  let chatId;

  it("should create or fetch a one-to-one chat", async () => {
    // For this test, you can use an existing chat or create a new one
    const chatResponse = await request(app)
      .post("/api/chat")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: userId })
      .expect(200);

    chatId = chatResponse.body._id;
  });

  it("should fetch all chats for a user", async () => {
    // Send a GET request to the fetch all chats for a user endpoint
    const response = await request(app)
      .get("/api/chat")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should check duplicate user in a new group chat", async () => {
    // Send a POST request to create a new group chat
    const response = await request(app)
      .post("/api/chat/group")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "New Group Chat", users: [userId, userId] })
      .expect(400);
  });

  it("should rename a group chat", async () => {
    // Use the chatId of an existing group chat
    // Send a PUT request to rename the group chat
    const response = await request(app)
      .put("/api/chat/rename")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ chatId: chatId, chatName: "Renamed Group Chat" })
      .expect(200);

    expect(response.body).toHaveProperty("_id");
  });

  it("should remove a user from a group chat", async () => {
    // Use the chatId of an existing group chat and user to remove
    // Send a PUT request to remove the user from the group chat
    const response = await request(app)
      .put("/api/chat/groupremove")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ chatId: chatId, userId: userId })
      .expect(200);

    expect(response.body).toHaveProperty("_id");
  });

  it("should add a user to a group chat", async () => {
    // Use the chatId of an existing group chat and user to add
    // Send a PUT request to add the user to the group chat
    const response = await request(app)
      .put("/api/chat/groupadd")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ chatId: chatId, userId: userId })
      .expect(200);

    expect(response.body).toHaveProperty("_id");
  });

  // Add more chat route test cases as needed
});

// messageRoutes.test.js
describe("Message Routes", () => {
  let chatId;

  it("should send a new message", async () => {
    // Create a chat or fetch an existing chat (chatId) for the test
    // For example, you can create a new chat and get its ID
    const chatResponse = await request(app)
      .post("/api/chat")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: userId })
      .expect(200);

    chatId = chatResponse.body._id;

    // Send a POST request to the send message endpoint with message data
    const response = await request(app)
      .post("/api/message")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        content: "Hello, this is a test message",
        chatId: chatId,
      })
      .expect(200);

    expect(response.body).toHaveProperty("sender");
    expect(response.body).toHaveProperty("content");
  });

  it("should get all messages for a chat", async () => {
    // Use the chatId obtained from the previous test
    // Send a GET request to the get messages for chat endpoint
    const response = await request(app)
      .get(`/api/message/${chatId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
