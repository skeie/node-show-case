import snapshot from 'snap-shot-it';
import util from 'util';
import { expect } from 'chai';
import gql from 'graphql-tag';
import { db, createUser } from '../../../../../test/support/dbHelpers';
import createServer from '../../../../../test/support/createServer';
import workoutLog from '../../../programs/queries/workoutLog';
import { userInfo } from 'os';

const START_WORKOUT = gql`
  mutation startWorkoutMutation($workoutId: ID!) {
    startWorkout(workoutId: $workoutId) {
      id
    }
  }
`;

const TRACK_MUTATION = gql`
  mutation trackExerciseSetMutation(
    $reps: Int
    $weight: Int
    $setId: ID
    $workoutExerciseId: ID
    $workoutLogId: ID!
    $exerciseLogId: ID
    $setLogId: ID
  ) {
    trackExerciseSet(
      reps: $reps
      weight: $weight
      setId: $setId
      workoutExerciseId: $workoutExerciseId
      workoutLogId: $workoutLogId
      exerciseLogId: $exerciseLogId
      setLogId: $setLogId
    ) {
      exercises {
        sets {
          reps
          weight
          position
        }
      }
    }
  }
`;

const fetchExercise = () => {
  return db.one(
    'SELECT w.id as "workoutId", we.id as "workoutExerciseId" FROM workouts w LEFT JOIN workout_exercises AS we ON we.workout_id = w.id ORDER BY w.id DESC LIMIT 1'
  );
};

const getLatestWorkoutLogId = userId => {
  return db.one(
    'SELECT * FROM workout_logs WHERE user_id=$1 ORDER BY id desc LIMIT 1 ',
    [userId]
  );
};

const runMutation = async (mutate, workoutLog, workout) => {
  const { data } = await mutate({
    query: TRACK_MUTATION,
    variables: {
      reps: 10,
      weight: 240,
      setLogId: undefined,
      workoutLogId: workoutLog.id,
      workoutExerciseId: workout.workoutExerciseId,
    },
  });

  return data;
};

const startWorkout = async (mutate, workout) => {
  return await mutate({
    query: START_WORKOUT,
    variables: {
      workoutId: workout.workoutId,
    },
  });
};

describe('trackExerciseSetMutation', () => {
  let query,
    mutate,
    workout,
    workoutLog,
    email = 'tracking-user1337@mail.com',
    testUser;

  beforeEach(async () => {
    testUser = await createUser(email);
    const serverRes = await createServer(testUser);
    workout = await fetchExercise();
    query = serverRes.query;
    mutate = serverRes.query;
    await startWorkout(mutate, workout);
    workoutLog = await getLatestWorkoutLogId(testUser.id);
  });

  it('should create new workout-, exercise- and set log', async () => {
    await runMutation(mutate, workoutLog, workout);
    const res = await db.any('SELECT * FROM exercise_logs');
    expect(res.length).to.equal(1);
    expect(res[0].workout_logs_id).to.equal(workoutLog.id);
  });

  it('should create new set from given exercise log', async () => {
    // log the first set
    await runMutation(mutate, workoutLog, workout);

    // fetch the workout log
    const { exerciseLogId } = await db.one(
      'SELECT el.id as "exerciseLogId" FROM workout_logs wl LEFT JOIN exercise_logs el ON wl.id = el.workout_logs_id WHERE wl.user_id = $1',
      testUser.id
    );

    // log second set
    const { data } = await mutate({
      query: TRACK_MUTATION,
      variables: {
        reps: 5,
        weight: 999,
        exerciseLogId,
        workoutLogId: workoutLog.id,
      },
    });

    expect(data.trackExerciseSet.exercises.length).to.equal(1);
    expect(data.trackExerciseSet.exercises[0].sets.length).to.equal(2);
    snapshot(data);
  });

  it('should update given set', async () => {
    // log the first set
    await runMutation(mutate, workoutLog, workout);

    // fetch the workout log
    const { exerciseLogId, setLogId } = await db.one(
      `SELECT s.id as "setLogId", el.id as "exerciseLogId"
      FROM workout_logs wl
      LEFT JOIN exercise_logs el ON wl.id = el.workout_logs_id
      LEFT JOIN set_logs s ON s.exercise_logs_id = el.id
       WHERE wl.user_id = $1`,
      testUser.id
    );

    // update the first set
    const { data } = await mutate({
      query: TRACK_MUTATION,
      variables: {
        reps: 9,
        weight: 50,
        setLogId, // will cause it to update set
        exerciseLogId,
        workoutLogId: workoutLog.id,
      },
    });

    // TODO: FINISH ME. Something is not working, we seem to get more exercises then whats correct
    expect(data.trackExerciseSet.exercises.length).to.equal(1);
    expect(data.trackExerciseSet.exercises[0].sets.length).to.equal(1);
    snapshot(data);
  });
});
