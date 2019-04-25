import invariant from 'invariant';
import { ForbiddenError } from 'apollo-server';
import { IDatabase, ITask } from 'pg-promise';
import { ResolverError, SystemError } from '../../Errors';
import { IContext } from '../../../config/apolloFactory';

export const validateArgs = user => {
  if (!user) {
    throw new ForbiddenError('You must be logged in to complete workout');
  }
};

const changePhase = async (_, args, context: IContext) => {
  const { user, dataSources } = context;
  const { phaseId } = args;

  validateArgs(user);

  // set next user phase in db
  try {
    await context.dataSources.tracking.setUserPhase(user.id, phaseId);
    return context.dataSources.program.fetchCurrentProgram();
  } catch (error) {
    throw new SystemError(`Failed to create userPhase`);
  }
};

export default changePhase;
