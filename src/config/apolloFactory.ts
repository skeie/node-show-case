import { ApolloServer } from 'apollo-server-express';
import { Request } from 'express';
import util from 'util';
import { IDatabase } from 'pg-promise';

// program
import ProgramDataSource from '../app/programs/ProgramDataSource';

// tracking
import TrackingDataSource from '../app/tracking/TrackingDataSource';

// user
import UserDataSource from '../app/users/UserDataSource';
import UserStoreDataSource from '../app/users/UserStoreDataSource';
import { authenticateUser } from './util';
import logger from './logger';
import { Program } from '../generated/graphql';

export interface IContextUser {
  id: string;
  email: string;
  gender?: string;
}

interface IPreConfigContext {
  user: IContextUser;
}

interface IApolloContext {
  dataSources: {
    program: ProgramDataSource;
    tracking: TrackingDataSource;
    userStore: UserStoreDataSource;
    user: UserDataSource;
  };
}

export type IContext = IPreConfigContext & IApolloContext;

// this is the one used by the server.
// other contexts are generated in tests
const defaultCreateContext = ({ req }: { req: Request }): IPreConfigContext => {
  return {
    user: authenticateUser(req.headers.authorization),
  };
};

interface IApolloProps {
  db: IDatabase<any>; // tslint:disable-line
  createContext?: () => IPreConfigContext;
}

export const createApollo = (schema, { db, createContext }: IApolloProps) => {
  const dataSources = () => ({
    program: new ProgramDataSource({ store: db }),
    tracking: new TrackingDataSource({ store: db }),
    userStore: new UserStoreDataSource({ store: db }),
    user: new UserDataSource(),
  });

  return new ApolloServer({
    schema,
    dataSources,
    context: createContext || defaultCreateContext,
    formatError: (error: Error) => {
      // TODO: proper error
      /* tslint:disable */
      if (process.env.NODE_ENV === 'production') {
        logger.info('Graphql error', error, util.inspect(error));
      } else {
        console.log(util.inspect(error, false, null, true /* enable colors */));
      }
      /* tslint:enable */
      return error;
    },
  });
};
