import snapshot from 'snap-shot-it';
import { expect, assert } from 'chai';
import gql from 'graphql-tag';
import createServer from '../../../../../test/support/createServer';

const SIGNUP = gql`
  mutation SignupMutation(
    $email: String!
    $password: String!
    $gender: Gender!
  ) {
    signup(email: $email, password: $password, gender: $gender) {
      token
      email
      id
    }
  }
`;

describe('signupUserMutation', () => {
  let mutate;

  beforeEach(async () => {
    const serverRes = await createServer();
    mutate = serverRes.mutate;
  });

  it('should create new user and login', async () => {
    const { data } = await mutate({
      query: SIGNUP,
      variables: {
        email: 'mptestUser1337@mail.com',
        password: '1234',
        gender: 'male',
      },
    });

    const token = data.signup.token;
    const id = data.signup.id;
    delete data.signup.token;
    delete data.signup.id;

    expect(token.length).to.be.above(1);
    expect(+id).to.be.above(1);
    snapshot(data);
  });

  it('should try to create same user twice', async () => {
    await mutate({
      query: SIGNUP,
      variables: {
        email: 'mptestUser@mail.com',
        password: '1234',
        gender: 'male',
      },
    });

    const { errors } = await mutate({
      query: SIGNUP,
      variables: {
        email: 'mptestUser@mail.com',
        password: '1234',
        gender: 'male',
      },
    });
    expect(errors.length).to.equal(1);
    expect(errors[0].message).to.equal(
      'Looks like you already have an account, try to sign in instead'
    );
  });
});
