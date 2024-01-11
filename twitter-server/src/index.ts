import * as dotenv from "dotenv";
import { initServer } from "./app";

dotenv.config();

async function init() {
  const app = await initServer();
  app.listen(process.env.PORT, () =>
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
  );
}

init();
