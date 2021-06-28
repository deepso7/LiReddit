import "reflect-metadata";
import { config } from "dotenv";
config();
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection } from "typeorm";

import { COOKIE_NAME, __PROD__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/posts";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import { User } from "./entities/User";
import { Post } from "./entities/Post";

(async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "lireddit2",
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    logging: true,
    synchronize: true,
    entities: [Post, User],
  });

  try {
    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );
    app.use(
      session({
        name: COOKIE_NAME,
        store: new RedisStore({ client: redis, disableTouch: true }), // disableTouch is true to create a infinitly long session
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
          httpOnly: true,
          sameSite: "lax", // CSRF
          secure: __PROD__, // If true cookie only work in https
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET || "",
        resave: false,
      })
    );

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver, UserResolver],
        validate: false,
      }),
      context: ({ req, res }): MyContext => ({ req, res, redis }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(4000, () => {
      console.log("Server started on localhost:4000");
    });
  } catch (err) {
    console.log(err);
  }
})();
