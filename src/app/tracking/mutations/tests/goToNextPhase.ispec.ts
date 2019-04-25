import snapshot from 'snap-shot-it';
import { expect } from 'chai';
import gql from 'graphql-tag';
import { db, createUser } from '../../../../../test/support/dbHelpers';
import createServer from '../../../../../test/support/createServer';

const GO_TO_NEXT_PHASE_MUTATION = gql`
  mutation goToNextPhase {
    goToNextPhase {
      phases {
        isCurrent
        name
      }
    }
  }
`;

const runMutation = async (mutate, workout) => {
  const { data } = await mutate({
    query: GO_TO_NEXT_PHASE_MUTATION,
  });

  return data;
};

describe('goToNextPhase', () => {
  let query, mutate, workout, testUser;

  beforeEach(async () => {
    const testUser = await createUser('emjay@mail.rb');
    const serverRes = await createServer(testUser);
    query = serverRes.query;
    mutate = serverRes.query;
  });

  it('should go to next phase', async () => {
    const data = await runMutation(mutate, workout);

    expect(data.goToNextPhase.phases[0].isCurrent).to.equal(false);
    expect(data.goToNextPhase.phases[1].isCurrent).to.equal(true);

    snapshot(data);
  });
});
