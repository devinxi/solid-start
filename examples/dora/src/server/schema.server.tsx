// import { ApolloServer } from "apollo-server";
import SchemaBuilder from "@giraphql/core";

export const builder = new SchemaBuilder({});

builder.queryType({
  fields: t => ({
    hello: t.string({
      args: {
        name: t.arg.string()
      },
      resolve: (parent, { name }) => `hello, ${name || "World"}`
    })
  })
});

// console.log(builder.toSchema({}));
