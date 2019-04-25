import invariant from 'invariant';
import { ForbiddenError } from 'apollo-server';
import { IDatabase, ITask } from 'pg-promise';
import { ResolverError } from '../../Errors';
import { IContext } from '../../../config/apolloFactory';
import logger from '../../../config/logger';

const validateArgs = (args, user) => {
  invariant(
    args.workoutExerciseId || args.exerciseLogId || args.setLogId,
    `Must have a way of identifying the exercise: ${JSON.stringify(args)}`
  );

  if (!user) {
    throw new ForbiddenError('You must be logged in to track workout');
  }
};

const trackExerciseSet = async (_, args, context: IContext) => {
  const { user, dataSources } = context;

  let {
    reps,
    weight,
    workoutExerciseId,
    workoutLogId,
    exerciseLogId,
    setLogId,
  } = args;

  validateArgs(args, user);
  const tr = undefined;

  // TODO: bring back transactions,
  // and make integration tests work.
  // There seems to be something wrong with the way we use transactions here.
  // Maybe its not being used in every datasource function?

  // return new Promise((resolve, reject) => {
  // return dataSources.tracking.startTransaction(async (tr: IDatabase<any>) => {
  try {
    // create the exercise-log, if it doesnt exist
    if (!exerciseLogId) {
      exerciseLogId = await dataSources.tracking.getOrCreateExerciseLog(
        workoutLogId,
        workoutExerciseId,
        { tr }
      );
    }

    // create the set, if it doesnt exist
    if (!setLogId) {
      setLogId = await dataSources.tracking.insertSetLog(
        exerciseLogId,
        weight,
        reps,
        { tr }
      );
      // set existed, update existin set
    } else {
      await dataSources.tracking.updateSetLog(setLogId, weight, reps, {
        tr,
      });
    }

    const workoutLog = await dataSources.tracking.getWorkoutLogById(
      workoutLogId,
      { tr }
    );

    // return resolve(workoutLog);
    return workoutLog;
  } catch (error) {
    logger.error(`Track exercise error: `, error);
    return new ResolverError('Failed to track set');
  }
};

export default trackExerciseSet;
