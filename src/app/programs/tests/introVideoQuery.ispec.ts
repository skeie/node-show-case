import snapshot from 'snap-shot-it';
import { expect } from 'chai';
import gql from 'graphql-tag';
import createServer from '../../../../test/support/createServer';
import { db } from '../../../../test/support/dbHelpers';

const INTRO_VIDEO = gql`
  query videos {
    currentProgram {
      introVideos {
        name
        position
        uri
      }
    }
  }
`;

const runQuery = async (query, queryStatement) => {
  const { data } = await query({
    query: queryStatement,
  });

  return data;
};

describe('introVideoQueries', () => {
  let query;
  let mutate;

  beforeEach(async () => {
    const serverRes = await createServer();

    query = serverRes.query;
    mutate = serverRes.query;
  });

  it('should match snapshot', async () => {
    const data = await runQuery(query, INTRO_VIDEO);
    snapshot(data);
  });
});
