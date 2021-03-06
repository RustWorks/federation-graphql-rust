const Fastify = require("fastify")
const mercurius = require('mercurius')

const {config} = require("./config")

const gateway = Fastify()

const main = async () => {
  gateway.register(mercurius, {
    graphiql: "playground",
    subscription: true,
    federationMetadata: true,
    allowBatchedQueries: true,
    pollingInterval: 2000,
    persistedQueryProvider: mercurius.persistedQueryDefaults.automatic(5000),
    gateway: {
      services: [
        {
          name: 'accounts',
          url: 'http://127.0.0.1:4001/graphql',
          // mandatory: true,
          // Forward all headers
          rewriteHeaders: (headers) => headers,
        },
        {
          name: 'products',
          url: 'http://127.0.0.1:4002/graphql',
          // Forward all headers
          rewriteHeaders: (headers) => headers,
        }
      ]
    },
    // errorHandler: (error, service) => {
    //   console.error("Service: ", service);
    //   console.error("Error: ", error);
    //   return
    // },
  })
  
  await gateway.listen(config.gateway.port);
  
  console.log("API Gateway available at http://localhost:4000/graphql")
}

main()

/*
const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "accounts", url: "http://localhost:4001/graphql" },
    { name: "products", url: "http://localhost:4002/graphql" },
  ]
});

const server = new ApolloServer({ gateway, subscriptions: false });

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
*/