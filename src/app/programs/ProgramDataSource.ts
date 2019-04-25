import { DataSource } from 'apollo-datasource';
import { IDatabase, ITask } from 'pg-promise';

import invariant from 'invariant';
import { reduceProgram, reduceVideos, reduceVideo } from './programReducers';
import { GET_PROGRAM, GET_TRIGGER_SESSION_EXERCISES } from './sqls';

export interface IDbVideo {
  maleVideoUri: string;
  femaleVideoUri: string;
  maleThumbnailUri: string;
  femaleThumbnailUri: string;
  name: string;
  id: number;
  position: number;
}

import {
  Exercise,
  TriggerSession,
  Program,
  Gender,
  Video,
} from '../../generated/graphql';

let PROGRAM_CACHE = null;

class ProgramRepository extends DataSource {
  store: any;
  context: any;

  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  public initialize(config) {
    this.context = config.context;
  }

  public async fetchCurrentProgram(
    opts: { tr?: IDatabase<any> } = {}
  ): Promise<Program> {
    if (PROGRAM_CACHE) {
      return PROGRAM_CACHE;
    }
    const t = opts.tr || this.store;
    const MAPS_ANB_ID = 1;
    const res = await t.any(GET_PROGRAM, [MAPS_ANB_ID]);
    PROGRAM_CACHE = reduceProgram(res);
    return PROGRAM_CACHE;
  }

  public async fetchProgramById(id: String) {
    const res = await this.store.any(GET_PROGRAM, [id]);
    return reduceProgram(res);
  }

  public async assignProgramToUser(userId: number): Promise<undefined> {
    const phases = await this.store.one(
      'SELECT id FROM phases WHERE position=1'
    );

    await this.store.any(
      'INSERT INTO user_phase (phase_id, user_id) VALUES ($1, $2)',
      [phases.id, userId]
    );
    return undefined;
  }

  public async getWorkoutExerciseById(workoutExerciseId: string) {
    invariant(workoutExerciseId, 'workoutExerciseId must be included');
    const res = await this.store.one(
      `
    SELECT 
      we.id,
      e.name as "name",
      e.id as "exerciseId"
      FROM workout_exercises we
      LEFT JOIN exercises e ON we.exercise_id = e.id
      WHERE we.id = $1
    `,
      [workoutExerciseId]
    );

    const mapped = {
      id: res.id,
      exercise: {
        id: res.exerciseId,
        name: res.name,
      },
    };

    return mapped;
  }

  public getWorkoutById(workoutId) {
    return this.store.one('SELECT * FROM workouts WHERE id=$1', workoutId);
  }

  public getTriggerSessionByIdOrFirst(triggerSessionId: string) {
    if (triggerSessionId) {
      return this.store.one(
        'SELECT * FROM trigger_sessions WHERE id=$1',
        triggerSessionId
      );
    }
    return this.store.one('SELECT * FROM trigger_sessions LIMIT 1');
  }

  public getTriggerSessions(): Promise<TriggerSession[]> {
    return this.store.any('SELECT * FROM trigger_sessions');
  }

  public async getVideoForWorkout(workout): Promise<IDbVideo | undefined> {
    if (workout.videoId) {
      const res = await this.store.any('SELECT * FROM videos WHERE id = $1', [
        workout.videoId,
      ]);

      if (res.length) {
        return reduceVideos(res)[0];
      }
    }
    return undefined;
  }

  public async getExercisesForTriggerSession(
    triggerSessionId: string
  ): Promise<Exercise[]> {
    const res = await this.store.any(GET_TRIGGER_SESSION_EXERCISES, [
      triggerSessionId,
    ]);

    return res.map(exercise => {
      const {
        videoId,
        maleVideoUri,
        femaleVideoUri,
        maleThumbnailUri,
        femaleThumbnailUri,
      } = exercise;
      delete exercise.maleVideoUri;
      delete exercise.femaleVideoUri;
      delete exercise.maleThumbnailUri;
      delete exercise.femaleThumbnailUri;
      delete exercise.videoId;
      return {
        ...exercise,
        video: {
          maleVideoUri,
          femaleVideoUri,
          maleThumbnailUri,
          femaleThumbnailUri,
          id: videoId,
        },
      };
    });
  }

  public async getIntroVideos() {
    const rows = await this.store.any(
      `SELECT * FROM videos WHERE video_type='intro'`
    );

    return reduceVideos(rows);
  }

  public async getFullTriggerWorkoutVideo(index: number) {
    const row = await this.store.one(
      `SELECT * FROM videos WHERE video_type='trigger' AND POSITION = $1`,
      [index]
    );

    return reduceVideo(row);
  }
}

export default ProgramRepository;
