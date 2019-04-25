import values from 'lodash/values';

export const reduceWorkoutLogs = workoutLogsData => {
  return workoutLogsData.map(workoutLogs => ({
    ...workoutLogs,
    workout: {
      id: workoutLogs.workoutId,
    },
  }));
};

export const reduceWorkoutLogExercises = rows => {
  let mapped = rows.reduce((all, curr) => {
    // if the current exercise hasnt been created yet, create it,
    // else use the existing one
    all[curr.workoutExerciseId] = all[curr.workoutExerciseId] || {
      id: curr.id,
      workoutLogId: curr.workoutLogId,
      workoutExerciseId: curr.workoutExerciseId,
      sets: {},
    };

    if (curr.setId && !all[curr.workoutExerciseId].sets[curr.setId]) {
      all[curr.workoutExerciseId].sets[curr.setId] = {
        id: curr.setId,
        weight: curr.weight,
        reps: curr.reps,
        position: curr.position,
      };
    }

    return all;
  }, {});

  mapped = values(mapped).map(workoutLog => ({
    ...workoutLog,
    sets: values(workoutLog.sets).sort((a, b) => a.position - b.position),
  }));

  return mapped;
};

export const reduceExerciseHistory = rows => {
  if (!rows.length) {
    return [];
  }

  const mapped = rows.reduce((all, curr) => {
    // if the current exercise hasnt been created yet, create it,
    // else use the existing one
    all[curr.exerciseLogsId] = all[curr.exerciseLogsId] || {
      exerciseLogsId: curr.exerciseLogsId,
      exerciseId: curr.exerciseId,
      name: curr.name,
      sets: [],
    };

    if (curr.setId) {
      all[curr.exerciseLogsId].sets.push({
        weight: curr.weight,
        reps: curr.reps,
        position: curr.position,
        id: curr.setId,
      });
    }
    return all;
  }, {});

  // latest one first
  return values(mapped).sort((b, a) => a.exerciseLogsId - b.exerciseLogsId);
};
