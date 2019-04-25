import get from 'lodash/get';
import moment from 'moment';

const currentWeekNumber = async (_, args, context, info) => {
  // TODO: use cache for this too
  const logs = await context.dataSources.tracking.getWorkoutLogsForUser(
    context.user.id
  );

  const firstDate = get(logs, `[${logs.length - 1}].createdAt`);
  const weekNumber = firstDate ? moment().diff(firstDate, 'weeks') : 1;

  // first week diff will always be 0
  if (weekNumber === 0) {
    return 1;
  }

  return weekNumber;
};

export default currentWeekNumber;
