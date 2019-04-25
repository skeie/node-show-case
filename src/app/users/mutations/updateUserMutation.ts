import { AuthenticationError } from 'apollo-server-errors';
import logger from '../../../config/logger';
import { IContext } from '../../../config/apolloFactory';

async function updateUser(
  _,
  { weightUnit, gender }: { weightUnit: string; gender: string },
  context: IContext
) {
  try {
    const { user } = context;
    if (!user) {
      throw new AuthenticationError(
        `User must be logged in to perform this action`
      );
    }

    if (gender) {
      await context.dataSources.userStore.updateGender(gender, user.id);
    } else if (weightUnit) {
      await context.dataSources.userStore.updateWeightUnit(weightUnit, user.id);
    }
    return context.dataSources.userStore.getUserById(user.id);
  } catch (error) {
    logger.info(`Update user error`, error);
    throw error;
  }
}

export default updateUser;
