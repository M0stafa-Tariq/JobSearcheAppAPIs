import express from "express";
import { config } from "dotenv";

import userRouter from "./src/modules/user/user.routes.js";
import companyRouter from "./src/modules/company/company.routes.js";
import jobRouter from "./src/modules/job/job.routes.js";
import applicationsRouter from "./src/modules/application/applicaiton.routes.js";
import db_connection from "./DB/connection.js";
import { globalResponse } from "./src/middlewares/globalResponse.js";

config({ path: "./config/dev.config.env" });

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/job", jobRouter);
app.use("/applications", applicationsRouter);

app.use(globalResponse);

await db_connection();

app.listen(port, () => {
  console.log(`App running at prot: ${port}`);
});
