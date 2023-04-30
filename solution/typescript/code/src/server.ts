import express from "express";
import { router as contractRouter } from "./Routes/contractRouter";
import { router as guardRouter } from "./Routes/guardRouter";
import { router as ptoRouter } from "./Routes/ptoRouter";
import { router as scheduleRouter } from "./Routes/scheduleRouter";

const app = express();
app.use(express.json());

app.use("/api", guardRouter);
app.use("/api", contractRouter);
app.use("/api", ptoRouter);
app.use("/api", scheduleRouter);

export default app;
