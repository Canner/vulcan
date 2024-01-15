import * as microCors from 'micro-cors';
import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { ApolloServer } from 'apollo-server-micro';
import { typeDefs, resolvers } from '@vulcan-sql/admin-ui/apollo/server';

const cors = microCors();

export const config: PageConfig = {
  api: {
    bodyParser: false
  }
}

const apolloServer: ApolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
});

const startServer = apolloServer.start();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
};


export default cors((req: NextApiRequest, res: NextApiResponse) =>
  req.method === 'OPTIONS' ? res.status(200).end() : handler(req, res)
);
