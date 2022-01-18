const dotenv = require("dotenv");

const result = dotenv.config();
if (result.error) {
  throw result.error;
}
module.exports = {
  apps: [
    {
      name: "Vite",
      script: "npm run dev:vite",
      ignore_watch: ["."],
      env: {
        ...result.parsed,
        NODE_ENV: "development"
      }
    },
    {
      name: "DB",
      script: "npm run db:update && npm run db:studio",
      watch: ["./prisma/schema.prisma"],
      env: {
        ...result.parsed,
        NODE_ENV: "development"
      }
    }
    // {
    //   name: "DB Update",
    //   script: "npm run db:update",
    //   ignore_watch: ["."],
    //   watch: ["./prisma/schema.prisma"],
    //   env: {
    //     ...result.parsed,
    //     NODE_ENV: "development"
    //   }
    // }
    // {
    //   name: "CSS",
    //   script: "npx postcss styles --base styles --dir app/styles -w",
    //   watch: ["styles/"]
    // },
    // {
    //   name: "Express",
    //   script: "npm run dev:server",
    //   ignore_watch: ["."],
    //   env: {
    //     ...result.parsed,
    //     NODE_ENV: "development"
    //   }
    // }
  ]
};
