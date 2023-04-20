import request from "supertest";
import app from "./../server";

const port = 80; // Set the port number
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

describe("POST /api/guards", () => {
  afterAll(() => {
    server.close();
  });

  it("should create a new guard successfully", async () => {
    const guard = {
      Name: "Jack Doe",
      IsArmed: true,
    };
    const response = await request(app).post("guards").send(guard).expect(201);
    expect(response.body).toMatchObject({
      GuardName: "Jack Doe",
      IsArmed: true,
    });
  });
});
