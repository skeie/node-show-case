import invariant from 'invariant';
import { ForbiddenError } from 'apollo-server';
import { IDatabase, ITask } from 'pg-promise';
import { ResolverError, SystemError } from '../../Errors';
import { IContext } from '../../../config/apolloFactory';
import logger from '../../../config/logger';

const validateArgs = (args, user) => {
  invariant(args.workoutLogId, 'workoutLogId must be included');

  if (!user) {
    throw new ForbiddenError('You must be logged in to complete workout');
  }
};

const completeWorkout = async (_, args, context: IContext) => {
  const { user, dataSources } = context;

  validateArgs(args, user);

  const { workoutLogId } = args;

  // TODO: send via query
  return new Promise((resolve, reject) => {
    return dataSources.tracking.startTransaction(async (tr: IDatabase<any>) => {
      // find workout log where currentworkout = this workout
      // if it doesnt exist, create it
      try {
        await context.dataSources.tracking.setCompleted(workoutLogId, { tr });
        // TODO: clean up old workout logs that has no tracked exercises here
      } catch (error) {
        logger.error('Failed to upsert workout log', error);
        reject(new ForbiddenError('Illegal operation'));
      }

      const program = await context.dataSources.program.fetchCurrentProgram({
        tr,
      });

      return resolve(program);
    });
  });
};

export default completeWorkout;
