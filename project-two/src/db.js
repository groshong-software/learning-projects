import { default as pg } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

export const db = new pg.Client();
await db.connect();
