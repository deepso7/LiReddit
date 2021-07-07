import "reflect-metadata";
import "dotenv-safe/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection } from "typeorm";
import path from "path";

import { COOKIE_NAME, __PROD__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/posts";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";

(async () => {
  try {
    const conn = await createConnection({
      type: "postgres",
      url: process.env.DATABASE_URL,
      logging: true,
      synchronize: true,
      migrations: [path.join(__dirname, "./migrations/*")],
      entities: [Post, User, Updoot],
    });
    // await conn.runMigrations();
    // await Post.delete({});

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);

    app.set("trust proxy", 1); // For cookies

    app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
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
          domain: __PROD__ ? ".deepso.me" : undefined,
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
      })
    );

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver, UserResolver],
        validate: false,
      }),
      context: ({ req, res }): MyContext => ({
        req,
        res,
        redis,
        userLoader: createUserLoader(),
        updootLoader: createUpdootLoader(),
      }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(parseInt(process.env.PORT), () => {
      console.log("Server started on localhost:4000");
    });
  } catch (err) {
    console.log(err);
  }
})();
