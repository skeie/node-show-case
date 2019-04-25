const GET_WORKOUT_LOG_FULL_QUERY = `
SELECT 
wl.id AS "id",
wl.is_completed AS "isCompleted",
wl.user_id AS "userId",
wl.workout_id AS "workoutId",
wl.created_at AS "createdAt",
wl.finished_at AS "finishedAt",
wl.workout_start_date AS "workoutStartDate",
wl.workout_weight_unit AS "weightUnit",
w.position AS "position",
w.phase_id as "phaseId"
FROM workout_logs wl
LEFT JOIN workouts AS w ON w.id = wl.workout_id
`;

export const GET_WORKOUT_LOGS_FOR_USER =
  GET_WORKOUT_LOG_FULL_QUERY +
  `
WHERE wl.user_id = $1
ORDER BY wl.id DESC
`;

export const GET_COMPLETED_WORKOUT_LOGS_FOR_USER =
  GET_WORKOUT_LOG_FULL_QUERY +
  `
WHERE wl.user_id = $1 AND wl.is_completed = True
ORDER BY wl.id DESC
`;

export const GET_LAST_WORKOUT_LOG_BY_WORKOUT_ID =
  GET_WORKOUT_LOG_FULL_QUERY +
  `
WHERE wl.workout_id = $1 AND wl.user_id = $2
ORDER BY wl.id DESC
`;

export const GET_ONGOING_WORKOUT_LOG =
  'SELECT * FROM workout_logs wl WHERE wl.workout_id = $1 AND wl.user_id=$2 AND wl.is_completed=False ORDER BY id DESC';

export const GET_WORKOUT_LOG =
  GET_WORKOUT_LOG_FULL_QUERY +
  `
WHERE wl.id = $1
`;

export const GET_EXERCISE_HISTORY = `
SELECT 
sl.id as "setId",
sl.position,
sl.weight,
sl.reps,
el.id as "exerciseLogsId",
e.name as "name",
e.id as "exerciseId"
FROM set_logs sl
LEFT JOIN exercise_logs AS el ON el.id = sl.exercise_logs_id
LEFT JOIN workout_exercises AS we ON we.id = el.workout_exercises_id
LEFT JOIN exercises AS e ON e.id = we.exercise_id
LEFT JOIN workout_logs AS wl ON wl.id = el.workout_logs_id
WHERE we.exercise_id = $1 AND wl.is_completed = True AND wl.user_id = $2
ORDER BY el.id desc
`;

export const GET_EXERICSES_FOR_WORKOUT_LOG = `SELECT
wl.id AS "workoutLogId",
el.id AS "id",
el.workout_exercises_id as "workoutExerciseId",
sl.id AS "setId",
sl.weight AS "weight",
sl.reps AS "reps",
sl.position AS "position"
FROM workout_logs wl
INNER JOIN exercise_logs AS el ON el.workout_logs_id = wl.id
LEFT JOIN set_logs AS sl ON sl.exercise_logs_id = el.id
WHERE wl.id=$1`;

export const INSERT_WORKOUT_LOG = `INSERT INTO workout_logs (user_id, workout_id, workout_weight_unit) VALUES($1, $2, $3) RETURNING id`;

export const GET_WEIGHT_UNIT = 'SELECT weight_unit FROM users where id = $1';

export const INSERT_EXERCISE_LOG = `INSERT INTO exercise_logs (workout_logs_id, workout_exercises_id) VALUES($1, $2) RETURNING id`;

export const GET_EXERCISE_LOG =
  'SELECT id FROM exercise_logs WHERE workout_logs_id=$1 AND workout_exercises_id=$2';

export const INSERT_SET_LOG = `INSERT INTO set_logs (exercise_logs_id, weight, reps, position) VALUES ($1, $2, $3, $4) RETURNING id`;

export const GET_SET_COUNT =
  'SELECT count(*) FROM set_logs WHERE exercise_logs_id=$1';

export const UPDATE_WORKOUT_START_DATE =
  'UPDATE workout_logs SET workout_start_date=now() WHERE id=$1';
