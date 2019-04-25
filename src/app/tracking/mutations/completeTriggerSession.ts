import invariant from 'invariant';
import { ForbiddenError } from 'apollo-server';
import { IDatabase, ITask } from 'pg-promise';
import { ResolverError, SystemError } from '../../Errors';
import { IContext } from '../../../config/apolloFactory';
import logger from '../../../config/logger';

const validateArgs = (args, user) => {
  invariant(args.triggerSessionId, 'triggerSessionId must be included');

  if (!user) {
    throw new ForbiddenError('You must be logged in to complete workout');
  }
};

const completeTriggerSessionMutation = async (_, args, context: IContext) => {
  const { user, dataSources } = context;

  validateArgs(args, user);
  const id = await dataSources.tracking.insertTriggerSessionLog(
    args.triggerSessionId,
    user.id
  );

  return dataSources.tracking.getTriggerSessionLogById(id);
};

export default completeTriggerSessionMutation;
