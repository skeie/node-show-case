import { DataSource } from 'apollo-datasource';
import { IDatabase, ITask } from 'pg-promise';
import invariant from 'invariant';
import moment from 'moment';
import last from 'lodash/last';
import values from 'lodash/values';
import util from 'util';

import { ExerciseLog, TriggerSessionLog, Phase } from '../../generated/graphql';

import { IContext } from '../../config/apolloFactory';
import {
  reduceWorkoutLogs,
  reduceWorkoutLogExercises,
  reduceExerciseHistory,
} from './trackingReducers';

import {
  GET_WORKOUT_LOGS_FOR_USER,
  GET_COMPLETED_WORKOUT_LOGS_FOR_USER,
  INSERT_WORKOUT_LOG,
  GET_WEIGHT_UNIT,
  GET_WORKOUT_LOG,
  INSERT_EXERCISE_LOG,
  GET_EXERCISE_LOG,
  INSERT_SET_LOG,
  GET_SET_COUNT,
  GET_LAST_WORKOUT_LOG_BY_WORKOUT_ID,
  GET_ONGOING_WORKOUT_LOG,
  GET_EXERCISE_HISTORY,
  GET_EXERICSES_FOR_WORKOUT_LOG,
  UPDATE_WORKOUT_START_DATE,
} from './sqls';

import { decorateWithLogger } from 'graphql-tools';

class TrackingDataSource extends DataSource {
  store: IDatabase<any>;
  context: IContext;

  constructor({ store }: { store: IDatabase<any> }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config: { context: IContext }) {
    this.context = config.context;
  }

  async startTransaction(cb: any): Promise<IDatabase<any>> {
    return this.store.tx(cb);
  }

  async getWorkoutLogsForUser(userId: string): Promise<any> {
    const res = await this.store.any(GET_WORKOUT_LOGS_FOR_USER, [userId]);

    return reduceWorkoutLogs(res);
  }

  public async getCompletedWorkoutLogsForUser(
    userId: string,
    opts: { tr?: IDatabase<any> } = {}
  ): Promise<any> {
    const t = opts.tr || this.store;

    const res = await t.any(GET_COMPLETED_WORKOUT_LOGS_FOR_USER, [userId]);

    return reduceWorkoutLogs(res);
  }

  async setInitialUserPhase(userId: string): Promise<undefined> {
    const { id } = await this.store.one(
      'SELECT id FROM phases WHERE position=1'
    );

    await this.store.none(
      'INSERT INTO user_phase (phase_id, user_id) VALUES ($1, $2)',
      [id, userId]
    );
    return undefined;
  }

  async setUserPhase(userId: string, phaseId: string): Promise<undefined> {
    await this.store.none(
      'UPDATE user_phase set phase_id=$1 WHERE user_id=$2 ',
      [phaseId, userId]
    );
    return undefined;
  }

  async getUserPhase(
    userId: string
  ): Promise<{ userId: string; phaseId: string }> {
    return this.store.one(
      'SELECT user_id as "userId", phase_id as "phaseId" from user_phase WHERE user_id=$1',
      [userId]
    );
  }

  async getLastWorkoutLogByWorkoutId(
    workoutId: string,
    userId,
    opts: { tr?: IDatabase<any> } = {}
  ): Promise<any> {
    const t = opts.tr || this.store;
    const res = await t.any(GET_LAST_WORKOUT_LOG_BY_WORKOUT_ID, [
      workoutId,
      userId,
    ]);

    return reduceWorkoutLogs(res)[0];
  }

  async getWorkoutLogById(
    workoutLogId: string,
    opts: { tr?: IDatabase<any> } = {}
  ): Promise<string> {
    const t = opts.tr || this.store;
    invariant(workoutLogId, 'workoutLogId must be included');

    // try to get
    const workoutLogs = await t.any(GET_WORKOUT_LOG, [workoutLogId]);
    if (workoutLogs.length) {
      return reduceWorkoutLogs(workoutLogs)[0];
    } else {
      return undefined;
    }
  }

  public async getOngoingOrCreateWorkout(
    userId: string,
    workoutId: string,
    weightUnit?: string,
    opts: { tr?: IDatabase<any> } = {}
  ): Promise<string> {
    const t = opts.tr || this.store;
    invariant(workoutId, 'workout id must be included');
    let updatedWeightUnit = weightUnit;

    // transfer weight unit from user
    if (!weightUnit) {
      const { weight_unit } = await t.one(GET_WEIGHT_UNIT, [userId]);
      updatedWeightUnit = weight_unit;
    }

    const ongoingWorkouts = await t.any(GET_ONGOING_WORKOUT_LOG, [
      workoutId,
      userId,
    ]);

    // workout exists. Update workout_start_date if its
    // > 2 hours since last time we updated
    if (ongoingWorkouts.length) {
      const { id: logId, workout_start_date } = ongoingWorkouts[0];
      if (moment().diff(moment(workout_start_date), 'minutes') > 120) {
        await t.none(UPDATE_WORKOUT_START_DATE, [logId]);
      }

      return logId;
    }

    const { id } = await t.one(INSERT_WORKOUT_LOG, [
      userId,
      workoutId,
      updatedWeightUnit,
    ]);

    return id;
  }

  public async setCompleted(
    workoutLogId: string,
    opts: { tr?: IDatabase<{ id: string; isCompleted: boolean }> } = {}
  ): Promise<any> {
    const t = opts.tr || this.store;

    await t.none(
      'UPDATE workout_logs SET is_completed=true, finished_at=now() WHERE id=$1',
      [workoutLogId]
    );
    return t.one(
      'SELECT id, is_completed as "isCompleted" FROM workout_logs where id=$1',
      [workoutLogId]
    );
  }

  async getOrCreateExerciseLog(
    workoutLogId: string,
    workoutExerciseId: string,
    opts: { tr?: IDatabase<any> } = {}
  ): Promise<string> {
    const t = opts.tr || this.store;
    invariant(workoutLogId, 'workoutLogId must be included');
    invariant(workoutExerciseId, 'workoutExerciseId must be included');

    const exercises = await t.any(GET_EXERCISE_LOG, [
      workoutLogId,
      workoutExerciseId,
    ]);
    if (exercises.length) {
      return exercises[0].id;
    }

    const { id } = await t.one(INSERT_EXERCISE_LOG, [
      workoutLogId,
      workoutExerciseId,
    ]);
    return id;
  }

  async insertSetLog(
    exerciseLogId: string,
    weight: string,
    reps: string,
    opts: { tr?: IDatabase<any> } = {}
  ): Promise<string> {
    const t = opts.tr || this.store;
    invariant(exerciseLogId, 'exerciseLogId must be included');
    invariant(reps, 'reps must be included');
    invariant(weight, 'weight must be included');

    const { count } = await t.one(GET_SET_COUNT, [exerciseLogId]);
    const position = (parseInt(count) || 0) + 1;

    const { id } = await t.one(INSERT_SET_LOG, [
      exerciseLogId,
      weight,
      reps,
      position,
    ]);
    return id;
  }

  async updateSetLog(
    setLogId: string,
    weight: string,
    reps: string,
    opts: { tr?: IDatabase<any> } = {}
  ): Promise<string> {
    const t = opts.tr || this.store;
    invariant(setLogId, 'setLogId must be included');
    invariant(reps || weight, 'reps or weight must be included');

    let sql = `UPDATE set_logs SET `;
    if (reps) sql += 'reps=${reps} ';
    if (reps && weight) sql += ', ';
    if (weight) sql += 'weight=${weight}';
    sql += ' WHERE id=${setLogId}';

    return t.none(sql, { weight, reps, setLogId });
  }

  // WorkoutLog.Exercises
  async getExercisesForWorkoutLog(
    workoutLogId: string
  ): Promise<ExerciseLog[]> {
    invariant(!!workoutLogId, 'workoutLogIds must be included');

    const res = await this.store.any(GET_EXERICSES_FOR_WORKOUT_LOG, [
      workoutLogId,
    ]);

    return reduceWorkoutLogExercises(res);
  }

  // exercise.history
  public async getExerciseHistory(exerciseId: string, userId: string) {
    invariant(!!exerciseId, 'exerciseId must be included');

    const res = await this.store.any(GET_EXERCISE_HISTORY, [
      exerciseId,
      userId,
    ]);
    return reduceExerciseHistory(res);
  }

  public async insertTriggerSessionLog(
    triggerSessionId: string,
    userId: string
  ): Promise<string> {
    const { id } = await this.store.one(
      'INSERT INTO trigger_session_logs (user_id, trigger_session_id) VALUES ($1, $2) RETURNING id',
      [userId, triggerSessionId]
    );

    return id;
  }

  public getTriggerSessionLogById(id: string): Promise<TriggerSessionLog> {
    return this.store.one(
      'SELECT id, created_at as "createdAt" FROM trigger_session_logs WHERE id = $1',
      [id]
    );
  }
}

export default TrackingDataSource;
