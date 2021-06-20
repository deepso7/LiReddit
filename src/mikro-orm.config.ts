import { MikroORM } from "@mikro-orm/core";
import path from "path";

import { __PROD__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "lireddit",
  type: "postgresql",
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  debug: !__PROD__,
} as Parameters<typeof MikroORM.init>[0];
