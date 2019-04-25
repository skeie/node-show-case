import { IContext } from '../../config/apolloFactory';
import { assertUser } from '../auth';

export const Query = {
  trackingHistory(_, args, context: IContext, info) {
    assertUser(context.user);

    return context.dataSources.tracking.getCompletedWorkoutLogsForUser(
      context.user.id
    );
  },
};

const resolvers = {};

export default resolvers;
