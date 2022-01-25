import { createResource } from "solid-js";
import server from "solid-start/server";
import { builder } from "~/server/schema.server";
import { processRequest } from "graphql-helix";
import superjson from "superjson";

superjson.registerCustom<
  Request,
  {
    __type: "Request";
    url: string;
    method: string;
    headers: { [key: string]: string };
    body: string;
  }
>(
  {
    isApplicable: (value): value is Request => value instanceof Request,
    serialize: value => {
      console.log(value, Object.fromEntries(value.headers.entries()));
      return {
        __type: "Request",
        url: value.url,
        method: value.method,
        headers: Object.fromEntries(value.headers.entries()),
        body: value.body
      };
    },
    deserialize: value => {
      return new Request(value.url, {
        method: value.method,
        headers: value.headers,
        body: value.body
      });
    }
  },
  "Request"
);

const graphQLServer = server(async (query, vars, request) => {
  try {
    let req = superjson.deserialize(request);
    const schema = builder.toSchema({});
    const response = await processRequest({
      query,
      variables: vars ?? {},
      request: {
        // body: req.body,
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
        // query: req.query,
      },
      schema
    });

    switch (response.type) {
      case "RESPONSE": {
        return response.payload;
      }
      default: {
        throw new Error("Hello world");
      }
    }
  } catch (e) {
    console.log(e);
  }
});

const graphQLQuery = <Text,>(query: string, vars: any) =>
  graphQLServer(
    query,
    vars,
    // JSON.stringify(
    //   {
    //     obj: new Request(import.meta.url, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json"
    //       }
    //       // body: JSON.stringify({
    //       //   query,
    //       //   variables: vars
    //       // })
    //     })
    //   },
    //   (key, value) => {
    //     console.log(key, value);
    //     if (value instanceof Request) {
    //       return {
    //         __type: "Request",
    //         url: value.url,
    //         method: value.method,
    //         headers: value.headers,
    //         body: value.body
    //       };
    //     }
    //     return value;
    //   }
    // )
    superjson.serialize(
      new Request(import.meta.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
        // body: JSON.stringify({
        //   query,
        //   variables: vars
        // })
      })
    )
  );

export default function App() {
  const [data] = createResource(async () => await graphQLQuery("{hello}"));
  return <div></div>;
}
