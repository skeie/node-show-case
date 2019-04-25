import snapshot from 'snap-shot-it';
import { expect } from 'chai';
import gql from 'graphql-tag';
import { db, createUser } from '../../../../../test/support/dbHelpers';
import createServer from '../../../../../test/support/createServer';

const START_WORKOUT_MUTATION = gql`
  mutation startWorkoutMutation($workoutId: ID!) {
    startWorkout(workoutId: $workoutId) {
      phases {
        position
        isCurrent
        workouts {
          position
          isCurrent
          workoutLog {
            isCompleted
          }
        }
      }
    }
  }
`;

const START_WORKOUT_MUTATION_WITH_ID = gql`
  mutation startWorkoutMutation($workoutId: ID!) {
    startWorkout(workoutId: $workoutId) {
      phases {
        position
        isCurrent
        workouts {
          id
          isCurrent
          workoutLog {
            id
            isCompleted
          }
        }
      }
    }
  }
`;

const runMutation = async (
  mutate,
  workoutId,
  query = START_WORKOUT_MUTATION
) => {
  const { data } = await mutate({
    query,
    variables: { workoutId },
  });

  return data;
};

describe('startWorkout', () => {
  let query, mutate, workoutId, testUser;

  beforeEach(async () => {
    const testUser = await createUser('argoil-sweiseneger@mail.uk');
    const serverRes = await createServer(testUser);
    const { id } = await db.one(
      'SELECT id FROM workouts ORDER BY id asc LIMIT 1'
    );
    workoutId = id;

    query = serverRes.query;
    mutate = serverRes.query;
  });

  it('should create new workout log', async () => {
    const { count } = await db.one('SELECT count(id) FROM workout_logs');

    const data = await runMutation(mutate, workoutId);

    const { count: newCount } = await db.one(
      'SELECT count(id) FROM workout_logs'
    );
    expect(+newCount - +count).to.equal(1);
    snapshot(data);
  });

  it('should re-use current workout log', async () => {
    const data1 = await runMutation(
      mutate,
      workoutId,
      START_WORKOUT_MUTATION_WITH_ID
    );
    const { count } = await db.one('SELECT count(id) FROM workout_logs');
    const data2 = await runMutation(
      mutate,
      workoutId,
      START_WORKOUT_MUTATION_WITH_ID
    );

    const workoutLog1 = data1.startWorkout.phases[0].workouts[0].workoutLog;
    const workoutLog2 = data1.startWorkout.phases[0].workouts[0].workoutLog;

    expect(workoutLog1).to.eql(workoutLog2);
    expect(workoutLog1.isCompleted).to.equal(false);
    const { count: newCount } = await db.one(
      'SELECT count(id) FROM workout_logs'
    );
    expect(+newCount - +count).to.equal(0);
  });

  it('should create new workout log when the last one is_completed', async () => {
    const { count } = await db.one('SELECT count(id) FROM workout_logs');
    const data1 = await runMutation(mutate, workoutId);

    await db.none('UPDATE workout_logs SET is_completed=True');
    const data2 = await runMutation(mutate, workoutId);

    const { count: newCount } = await db.one(
      'SELECT count(id) FROM workout_logs'
    );
    expect(+newCount - +count).to.equal(2);
  });
});
