import invariant from 'invariant';
import { ForbiddenError } from 'apollo-server';
import { IDatabase, ITask } from 'pg-promise';
import { ResolverError } from '../../Errors';
import { assertUser } from '../../auth';
import { IContext } from '../../../config/apolloFactory';
import logger from '../../../config/logger';

const validateArgs = (args, user) => {
  assertUser(user);
};

const trackExerciseSet = async (_, args, context: IContext) => {
  const { user, dataSources } = context;
  const { workoutId } = args;

  validateArgs(args, user);

  try {
    await dataSources.tracking.getOngoingOrCreateWorkout(user.id, workoutId);

    return dataSources.program.fetchCurrentProgram();
  } catch (error) {
    logger.error(error);
    // TODO Sentry
    throw new ForbiddenError(error);
  }
};

export default trackExerciseSet;
