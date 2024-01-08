import * as dotenv from "dotenv";
import { initServer } from "./app";

dotenv.config();

async function init() {
  const app = await initServer();
  app.listen(4000, () =>
    console.log("Server is running on http://localhost:4000")
  );
}

init();
