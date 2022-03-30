

FROM cl00e9ment/node.js-builder

# WORKDIR /workspace 
# Create and change to the app directory.
WORKDIR /

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY . .

RUN pnpm install


ENV PORT=3000
ENV NODE_ENV=production

WORKDIR /docs
RUN ls
RUN ls node_modules
RUN ls node_modules/.bin
RUN pnpm run build

ENTRYPOINT [ "pnpm" ]

CMD [ "run", "start" ]
