import "reflect-metadata";
import { config } from "dotenv";
config();
import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import { __PROD__ } from "./constants";
// import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/posts";

(async () => {
  try {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver],
        validate: false,
      }),
      context: () => ({ em: orm.em }),
    });

    apolloServer.applyMiddleware({ app });

    app.listen(5000, () => {
      console.log("Server started on localhost:5000");
    });
  } catch (err) {
    console.log(err);
  }
})();
