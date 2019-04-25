import { AuthenticationError } from 'apollo-server-errors';
import isCurrentWorkout from './queries/isCurrentWorkout';
import isCurrentPhase from './queries/isCurrentPhase';

import workoutLog from './queries/workoutLog';
import currentWeekNumber from './queries/currentWeekNumber';
import { IContext } from '../../config/apolloFactory';
import { IDbVideo } from './ProgramDataSource';
import {
  Exercise,
  Phase,
  ExerciseLog,
  TriggerSession,
  WorkoutLog,
  Gender,
  Workout,
  Program,
} from '../../generated/graphql';

// TODO: figure out how to use enum types with graphql here instead
const MALE = 'male';
const HIGH_POSITION_NUMBER = 1337;

const resolveGenderValue = (gender, maleVal, femaleVal) => {
  if (gender === MALE) {
    return maleVal ? maleVal : femaleVal;
  }

  return femaleVal ? femaleVal : maleVal;
};

const reduceVideo = async (video: IDbVideo, context) => {
  if (!video) {
    return null;
  }

  const gender = await getUserGender(context);

  const uri = resolveGenderValue(
    gender,
    video.maleVideoUri,
    video.femaleVideoUri
  );
  const thumbnailUri =
    gender === MALE ? video.maleThumbnailUri : video.femaleThumbnailUri;

  // Until we have data for everything, if we don't have this clause it will throw an error that uri is not present
  if (!uri) {
    return null;
  }

  return {
    uri,
    thumbnailUri,
    name: video.name,
    id: video.id,
    position: video.position,
  };
};

type Video = {
  maleVideoUri: string;
  femaleVideoUri: string;
  maleThumbnailUri: string;
  femaleThumbnailUri: string;
};

const reduceVideoArray = async (videos: IDbVideo[], context: IContext) => {
  const reducesVideos = [];

  for (const video of videos) {
    const reducedVideo = await reduceVideo(video, context);
    reducesVideos.push({
      ...reducedVideo,
      position: video.position,
      name: video.name,
    });
  }
  return reducesVideos.sort((a, b) => {
    const aPosition = a.position || HIGH_POSITION_NUMBER;
    const bPosition = b.position || HIGH_POSITION_NUMBER;
    return aPosition - bPosition;
  });
};

const getUserGender = async (context: IContext) => {
  const { user } = context;
  if (user.gender) {
    return user.gender;
  }
  const { gender } = await context.dataSources.userStore.getUserById(user.id);
  user.gender = gender;
  return gender;
};

const getVideoObject = async (context: IContext, video: Video) => {
  const gender = await getUserGender(context);

  return {
    uri: resolveGenderValue(gender, video.maleVideoUri, video.femaleVideoUri),
    thumbnailUri: resolveGenderValue(
      gender,
      video.maleThumbnailUri,
      video.femaleThumbnailUri
    ),
  };
};

export const Query = {
  async currentProgram(_, args, context: IContext, info) {
    const user = context.user;
    if (!user) {
      throw new AuthenticationError('User is not authenticated');
    }

    const program = await context.dataSources.program.fetchCurrentProgram();
    return program;
  },
  triggerSession(
    _,
    { triggerSessionId }: { triggerSessionId: string },
    context: IContext,
    __
  ) {
    return context.dataSources.program.getTriggerSessionByIdOrFirst(
      triggerSessionId
    );
  },
  programs: (_, args, { dataSources }, info) => {
    return dataSources.program.fetchPrograms();
  },

  triggerSessions(_, args, context, info) {
    const user = context.user;
    if (!user) {
      throw new AuthenticationError('User is not authenticated');
    }
    return context.dataSources.program.getTriggerSessions();
  },
};

export default {
  Program: {
    currentWeekNumber,
    introVideos: async (program: Program, _, context: IContext) => {
      const introVidz = await context.dataSources.program.getIntroVideos();
      return reduceVideoArray(introVidz, context);
    },
  },
  TriggerSession: {
    exercises: (triggerSession: TriggerSession, _, context: IContext) => {
      return context.dataSources.program.getExercisesForTriggerSession(
        triggerSession.id
      );
    },
    video: async (triggerSession: TriggerSession, _, context: IContext) => {
      const fullTriggerWorkoutVideo = (await context.dataSources.program.getFullTriggerWorkoutVideo(
        triggerSession.position
      )) as IDbVideo;

      const reducedVideo = await reduceVideo(fullTriggerWorkoutVideo, context);

      return reducedVideo;
    },
  },
  Phase: {
    isCurrent: isCurrentPhase,
    hasNext: async (currentPhase: Phase, __, context: IContext) => {
      const {
        phases,
      } = await context.dataSources.program.fetchCurrentProgram();
      return currentPhase.position !== phases.length;
    },
    hasPrevious: async (currentPhase: Phase) => {
      return currentPhase.position !== 1;
    },

    introVideo: async (phase: Phase, _, context) => {
      // @ts-ignore
      return getVideoObject(context, phase.introVideo);
    },
  },
  Workout: {
    workoutLog,
    isCurrent: isCurrentWorkout,
    video: async (workout: Workout, _, context: IContext) => {
      const video = await context.dataSources.program.getVideoForWorkout(
        workout
      );

      return reduceVideo(video, context);
    },
  },
  WorkoutLog: {
    exercises: (workoutLog: WorkoutLog, args, context: IContext) => {
      return context.dataSources.tracking.getExercisesForWorkoutLog(
        workoutLog.id
      );
    },
    workout: (workoutLog, args, context: IContext) => {
      return context.dataSources.program.getWorkoutById(workoutLog.workoutId);
    },
  },
  ExerciseLog: {
    workoutExercise: (exercise: ExerciseLog, args, context: IContext) => {
      return context.dataSources.program.getWorkoutExerciseById(
        exercise.workoutExerciseId
      );
    },
  },
  Exercise: {
    history: (exercise: Exercise, args, context: IContext) => {
      const userId = context.user.id;
      return context.dataSources.tracking.getExerciseHistory(
        exercise.id,
        userId
      );
    },
    video: (exercise, args, context: IContext) => {
      return reduceVideo(exercise.video, context);
    },
  },
};
