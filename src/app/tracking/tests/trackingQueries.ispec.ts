import snapshot from 'snap-shot-it';
import { expect } from 'chai';
import gql from 'graphql-tag';
import {
  db,
  createSetLogs,
  createWorkoutLog,
  createUser,
  debugUserData,
} from '../../../../test/support/dbHelpers';
import createServer from '../../../../test/support/createServer';

const TRACKING_HISTORY_QUERY = gql`
  query trackingHistoryQuery {
    trackingHistory {
      isCompleted
      exercises {
        workoutExercise {
          exercise {
            name
          }
        }
        sets {
          reps
          weight
        }
      }
    }
  }
`;

const runQuery = async query => {
  const { data } = await query({
    query: TRACKING_HISTORY_QUERY,
  });

  return data;
};

describe('trackingQueries', () => {
  let query,
    workout,
    user,
    email = 'bobafett@mail.com';

  beforeEach(async () => {
    user = await createUser(email);
    const serverRes = await createServer(user);

    workout = await db.one('SELECT * FROM workouts ORDER BY ID desc LIMIT 1');

    query = serverRes.query;
  });

  it('should get 0 workouts when no exercise has been tracked', async () => {
    const { id } = await createWorkoutLog(user.email, workout.id);

    const data = await runQuery(query);
    expect(data.trackingHistory[0]).to.be.null;
  });

  it('should get 1 workout and 3 sets', async () => {
    const { id } = await createWorkoutLog(user.email, workout.id);

    await createSetLogs(workout.id, id, undefined, 3);
    const data = await runQuery(query);

    snapshot(data);
  });
});
