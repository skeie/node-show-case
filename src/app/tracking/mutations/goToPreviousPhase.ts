import invariant from 'invariant';
import { ForbiddenError } from 'apollo-server';
import { IDatabase, ITask } from 'pg-promise';
import { ResolverError, SystemError } from '../../Errors';
import { IContext } from '../../../config/apolloFactory';
import { validateArgs } from './goToNextPhase';
import findIndex from 'lodash/findIndex';

const goToPreviousPhase = async (_, args, context: IContext) => {
  const { user, dataSources } = context;
  validateArgs(user);

  // get program and current user phase
  let phases, userPhase, program;
  try {
    program = await context.dataSources.program.fetchCurrentProgram();
    phases = program.phases;
    userPhase = await context.dataSources.tracking.getUserPhase(user.id);
  } catch (error) {
    throw new SystemError('Failed to get user phase');
  }

  if (!userPhase) {
    // Make sure this is reported to sentry,
    // and
    throw new SystemError(
      `User with id=${user.id} does not have a current phase`
    );
  }

  // find prev phase
  let nextPhase;

  phases.forEach((phase, i) => {
    if (phase.id === userPhase.phaseId && phases[i - 1]) {
      nextPhase = phases[i - 1];
    }
  });

  if (!nextPhase) {
    throw new ForbiddenError(
      'Tried to go to previous phase, but it doesnt exist'
    );
  }

  // set prev user phase in db
  try {
    await context.dataSources.tracking.setUserPhase(user.id, nextPhase.id);
  } catch (error) {
    throw new SystemError(`Failed to update userPhase`);
  }

  return program;
};

export default goToPreviousPhase;
