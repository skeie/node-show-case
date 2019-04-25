import { expect } from 'chai';
import { db } from '../../../../test/support/dbHelpers';
import UserStoreDataSource from '../UserStoreDataSource';

describe('UserStoreDataSource', () => {
  let store;

  beforeEach(() => {
    store = new UserStoreDataSource({ store: db });
  });

  describe('upsertUser', () => {
    it('should create a new user when user does not exist', async () => {
      const { count: countBefore } = await db.one('SELECT count(*) FROM users');

      await store.createUser({
        email: 'yolo@mail.com',
        passwordHash: '123',
      });

      const { count: countAfter } = await db.one('SELECT count(*) FROM users');
      expect(+countAfter - +countBefore).to.equal(1);
    });

    it('should not create a new user when user exists', async () => {
      try {
        await store.createUser({
          email: 'yolo@mail.com',
          passwordHash: '123',
        });
        await store.createUser({
          email: 'yolo@mail.com',
          passwordHash: '123',
        });
      } catch (error) {
        // ignore.
      } finally {
        const { count } = await db.one('SELECT count(*) FROM users');
        expect(+count).to.equal(1);
      }
    });

    it('should create 2 different users', async () => {
      await store.createUser({
        email: 'yolo@mail.com',
        passwordHash: '123',
      });
      await store.createUser({
        email: 'swaggins@mail.com',
        passwordHash: '123',
      });
      const { count } = await db.one('SELECT count(*) FROM users');

      expect(+count).to.equal(2);
    });

    it('should return the new user', async () => {
      const res = await store.createUser({
        email: 'mike@mail.com',
        passwordHash: '123',
      });

      expect(res.email).to.equal('mike@mail.com');
      expect(res.password_hash).to.be.exist;
      expect(+res.id).to.be.above(0);
    });
  });
});
