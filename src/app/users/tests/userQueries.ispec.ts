import snapshot from 'snap-shot-it';
import { expect, assert } from 'chai';
import gql from 'graphql-tag';
import createServer from '../../../../test/support/createServer';

const USER_QUERY = gql`
  query UserQuery {
    user {
      gender
      weightUnit
      email
    }
  }
`;

describe('userQueries', () => {
  let query;

  beforeEach(async () => {
    const serverRes = await createServer();
    query = serverRes.query;
  });

  it('should query user', async () => {
    const { data } = await query({
      query: USER_QUERY,
    });
    snapshot(data);
  });
});
