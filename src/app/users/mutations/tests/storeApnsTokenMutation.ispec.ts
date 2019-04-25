import snapshot from 'snap-shot-it';
import { expect, assert } from 'chai';
import gql from 'graphql-tag';
import createServer, {
  testUser,
} from '../../../../../test/support/createServer';
import { db } from '../../../../../test/support/dbHelpers';

const STORE_TOKEN = gql`
  mutation storeApnsTokenMutation($token: String!) {
    storeApnsToken(token: $token) {
      success
      error
    }
  }
`;

describe('storeApnsTokenMutation', () => {
  let mutate;

  beforeEach(async () => {
    const serverRes = await createServer();
    mutate = serverRes.mutate;
  });

  it('should store token', async () => {
    const { count } = await db.one('SELECT count(*) from apns_tokens');
    expect(+count).to.equal(0);

    const { data } = await mutate({
      query: STORE_TOKEN,
      variables: {
        token: 'DickHarder',
      },
    });

    const res = await db.one('SELECT token, user_id from apns_tokens');
    expect(data.storeApnsToken.success).to.be.true;
    expect(res.token).to.equal('DickHarder');
    expect(res.user_id).to.equal(testUser.id);
  });

  it('should store a second token', async () => {
    const { count } = await db.one('SELECT count(*) from apns_tokens');
    expect(+count).to.equal(0);
    await mutate({
      query: STORE_TOKEN,
      variables: {
        token: 'DickHarder',
      },
    });

    await mutate({
      query: STORE_TOKEN,
      variables: {
        token: 'DickHardrrrrrr',
      },
    });

    const { count: newCount } = await db.one(
      'SELECT count(*) from apns_tokens'
    );
    expect(+newCount).to.equal(2);
  });

  it('should not duplicate an existing token', async () => {
    await mutate({
      query: STORE_TOKEN,
      variables: {
        token: 'DickHarder',
      },
    });

    const { count } = await db.one('SELECT count(*) from apns_tokens');

    const { data } = await mutate({
      query: STORE_TOKEN,
      variables: {
        token: 'DickHarder',
      },
    });

    const { count: newCount } = await db.one(
      'SELECT count(*) from apns_tokens'
    );

    expect(count).to.equal(newCount);
  });

  it('should not error if token exists', async () => {
    await mutate({
      query: STORE_TOKEN,
      variables: {
        token: 'DickHarder',
      },
    });

    const { data } = await mutate({
      query: STORE_TOKEN,
      variables: {
        token: 'DickHarder',
      },
    });

    expect(data.storeApnsToken.success).to.equal(true);
  });
});
