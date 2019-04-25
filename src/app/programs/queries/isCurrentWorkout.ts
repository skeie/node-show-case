import logger from '../../../config/logger';

// In-memory program cache
// TODO: move this into the programDataStore
// just move the global variable into the get phase functions
// and use that if it exists instead of going to the database
let CURRENT_PROGRAM_CACHE;

const _getCachedUserPhaseId = async context => {
  let userPhaseId;

  if (context.userPhaseId) {
    userPhaseId = context.userPhaseId;
  } else {
    const { phaseId } = await context.dataSources.tracking.getUserPhase(
      context.user.id
    );
    userPhaseId = phaseId;
  }

  context.userPhaseId = userPhaseId;
  return userPhaseId;
};

const _getCachedLogs = async context => {
  const workoutLogs = await context.dataSources.tracking.getWorkoutLogsForUser(
    context.user.id
  );

  // context.workoutLogs = workoutLogs;
  return workoutLogs;
};

const _getCachedCurrentProgram = async context => {
  if (CURRENT_PROGRAM_CACHE) {
    return CURRENT_PROGRAM_CACHE;
  } else {
    CURRENT_PROGRAM_CACHE = await context.dataSources.program.fetchCurrentProgram();
    return CURRENT_PROGRAM_CACHE;
  }
};

// gets the workout that comes after the last logged workout.
// or the first in the phase, is user hasnt done any workouts in this phase
const _getNextWorkout = (currentProgram, workoutLogs, userPhaseId, context) => {
  let currentWorkout;

  // get current phase
  const currentPhase = currentProgram.phases.find(
    phase => phase.id === userPhaseId
  );

  const workoutLogsInPhase = workoutLogs.filter(
    wl => wl.phaseId === userPhaseId
  );

  if (!workoutLogsInPhase.length) {
    return currentPhase.workouts[0];
  }

  const lastestWorkoutLog = workoutLogsInPhase[0];

  // if the last logged workout still ongoing
  if (lastestWorkoutLog && !lastestWorkoutLog.isCompleted) {
    context.currentWorkout = currentPhase.workouts.find(
      w => w.id === lastestWorkoutLog.workoutId
    );

    return context.currentWorkout;
  }

  // get the next workout (after the previous logged one)
  // loop through all workouts until we find the
  // previously logged workout, then return the one after
  currentPhase.workouts.forEach((w, i) => {
    // we are on the current workout
    if (w.id === lastestWorkoutLog.workoutId) {
      // if there is one workout after the previous one, return that
      const nextWorkoutIndex = i + 1;
      if (currentPhase.workouts[nextWorkoutIndex]) {
        currentWorkout = currentPhase.workouts[nextWorkoutIndex];

        // return the first one. Round robin style
      } else {
        currentWorkout = currentPhase.workouts[0];
      }
    }
  });

  // put ut on context
  context.currentWorkout = currentWorkout;
  return currentWorkout;
};

// return wether @workout is the current workout for the user.
// user.currentWorkout is the workout after the previous
// tracked workout.
// If there are no workouts tracked in the user.phase
// return the first workout in that phase
const isCurrent = async (workout, _, context) => {
  try {
    const currentPhaseId = await _getCachedUserPhaseId(context);
    const workoutLogs = await _getCachedLogs(context);
    const currentProgram = await _getCachedCurrentProgram(context);

    const currentWorkout = _getNextWorkout(
      currentProgram,
      workoutLogs,
      currentPhaseId,
      context
    );

    return workout.id === currentWorkout.id;
  } catch (error) {
    logger.error(error);
  }
};

export default isCurrent;
