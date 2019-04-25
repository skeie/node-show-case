import { RESTDataSource } from 'apollo-datasource-rest';
import { IRemoteUser } from './types';

class UserDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.remote-api.com/';
  }

  async remoteAuthenticate(
    email: string,
    password: string
  ): Promise<IRemoteUser> {
    // TODO: call remote API
    return Promise.resolve({
      remoteId: '10',
      programs: ['Main program'],
      email,
      mpRemoteToken: 'MAKSMDAKSMDAKSMOKDASMDLASMD1337',
    });
  }
}

export default UserDataSource;
