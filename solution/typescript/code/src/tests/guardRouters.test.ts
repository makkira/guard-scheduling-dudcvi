import request from "supertest";
import express from "express";
import { CreateGuard, DeleteGuard } from "./../services/guardService";
import { Guard } from "./../models/Guard";
import { router } from "./../Routes/guardRouter";

/**
 * Building Test
 **/

const app = express();

app.use(express.json());
app.use("/api", router);

app.use(function (req, res, next) {
  console.log("Request:", req.method, req.url);
  res.on("finish", function () {
    console.log("Response:", res.statusCode);
  });
  next();
});

test("POST /guards should add a guard to the list of guards", async () => {
  const guard: Guard = { Name: "Jackson", HasArmedCredentials: false };
  const response = await request(app).post("/api/guards").send(guard);
  expect(response.status).toBe(201);
  expect(response.text).toBe(`${guard.Name} created successfully`);
});

/**
 * Tested via PostMan, Guard works but the test case doesn't. Need to figure out why exactly.
 */
test("DELETE /guards/:name should delete guard from list", async () => {
  const guard: Guard = { Name: "Jackson", HasArmedCredentials: false };
  CreateGuard(guard);
  const response = await request(app).delete(`/guards/${guard.Name}`);
  expect(response.status).toBe(204);
  expect(response.text).toBe(`${guard.Name} deleted successfully`);
});

test("DELETE /guards/:name should return 404 if guard not found", async () => {
  const guard: Guard = { Name: "Muna", HasArmedCredentials: false };
  const response = await request(app).delete(`/guards/${guard.Name}`);
  expect(response.status).toBe(404);
  expect(response.text).toContain(`${guard.Name} not found!`);
});
