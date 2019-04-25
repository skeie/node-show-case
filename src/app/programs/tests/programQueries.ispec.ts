import snapshot from 'snap-shot-it';
import { expect } from 'chai';
import gql from 'graphql-tag';
import createServer from '../../../../test/support/createServer';
import { db } from '../../../../test/support/dbHelpers';

const TRIGGER_SESSION_QUERY = gql`
  query triggerSessions {
    triggerSessions {
      id
      exercises {
        id
        name
      }
    }
  }
`;

const TRIGGER_WITH_VIDEO_SESSION_QUERY = gql`
  query triggerSessions {
    triggerSessions {
      id
      exercises {
        id
        name
        video {
          uri
        }
      }
    }
  }
`;

export const COMPLETE_TRIGGER_SESSION = gql`
  mutation completeTriggerSessionMutation($triggerSessionId: ID!) {
    completeTriggerSession(triggerSessionId: $triggerSessionId) {
      id
    }
  }
`;

const runMutation = async mutate => {
  const { data } = await mutate({
    query: COMPLETE_TRIGGER_SESSION,
    variables: {
      triggerSessionId: 1,
    },
  });

  return data;
};

const runQuery = async (query, queryStatement) => {
  const { data } = await query({
    query: queryStatement,
  });

  return data;
};

describe('programQueries', () => {
  let query;
  let mutate;
  beforeEach(async () => {
    const serverRes = await createServer();
    query = serverRes.query;
    mutate = serverRes.query;
  });

  describe('trigger sessions', () => {
    it('should match snapshot', async () => {
      const data = await runQuery(query, TRIGGER_SESSION_QUERY);
      snapshot(data);
    });
    it('should match snapshot with videos', async () => {
      const data = await runQuery(query, TRIGGER_WITH_VIDEO_SESSION_QUERY);
      snapshot(data);
    });
    // it('post trigger sessions', async () => {
    //   let logs = await db.any('select * from trigger_session_logs');
    //   expect(logs.length).to.equal(0);
    //   await runMutation(mutate);
    //   logs = await db.any('select * from trigger_session_logs');
    //   expect(logs.length).to.equal(1);
    // });
  });
});
