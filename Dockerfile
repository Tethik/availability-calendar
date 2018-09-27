FROM node:8.9 as builder

# Set the default working directory
WORKDIR /usr/src

COPY frontend .

# Build the react app
RUN yarn install --production
RUN yarn build

FROM mhart/alpine-node

# Set the default working directory
WORKDIR /usr/src

# Install dependencies
COPY . .
RUN yarn install --production

COPY --from=builder /usr/src/build ./frontend/build

# Run the server
EXPOSE 4000
CMD ["node", "server.js"]
