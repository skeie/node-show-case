import snapshot from 'snap-shot-it';
import { expect, assert } from 'chai';
import gql from 'graphql-tag';
import createServer from '../../../../../test/support/createServer';

const UPDATE_USER = gql`
  mutation UpdateUserMutation($weightUnit: WeightUnit, $gender: Gender) {
    updateUser(weightUnit: $weightUnit, gender: $gender) {
      weightUnit
      gender
    }
  }
`;

describe('updateUserMutation', () => {
  let mutate;

  beforeEach(async () => {
    const serverRes = await createServer();
    mutate = serverRes.mutate;
  });

  it('should update gender', async () => {
    const { data } = await mutate({
      query: UPDATE_USER,
      variables: {
        gender: 'female',
      },
    });
    snapshot(data);
  });

  it('should update weight unit', async () => {
    const { data } = await mutate({
      query: UPDATE_USER,
      variables: {
        weightUnit: 'pounds',
      },
    });
    snapshot(data);
  });
});
