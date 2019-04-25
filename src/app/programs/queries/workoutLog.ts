import { IContext } from '../../../config/apolloFactory';

const workoutLog = (workout, _, context: IContext) => {
  const userId = context.user.id;
  return context.dataSources.tracking.getLastWorkoutLogByWorkoutId(
    workout.id,
    userId
  );
};

export default workoutLog;
