import snapshot from 'snap-shot-it';
import { expect, assert } from 'chai';
import gql from 'graphql-tag';
import createServer from '../../../../../test/support/createServer';

const LOGIN = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      email
      id
    }
  }
`;

describe('loginUserMutation', () => {
  let mutate;

  beforeEach(async () => {
    const serverRes = await createServer();
    mutate = serverRes.mutate;
  });

  it('should login', async () => {
    const { data } = await mutate({
      query: LOGIN,
      variables: {
        email: 'mptestUser@mail.com',
        password: '1234',
      },
    });
    const token = data.login.token;
    const id = data.login.id;
    delete data.login.token;
    delete data.login.id;

    expect(token.length).to.be.above(1);
    expect(+id).to.be.above(1);
    snapshot(data);
  });

  it('should throw if password is incorrect', async () => {
    const res = await mutate({
      query: LOGIN,
      variables: {
        email: 'mptestUser@mail.com',
        password: 'a-password-that-is-defo-incorrect',
      },
    });

    expect(res.data).to.be.null;
    expect(res.errors.length).to.be.above(0);
  });
});
