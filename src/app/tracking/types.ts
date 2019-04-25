export interface IDbWorkout {
  wl_id: string;
  wl_user_id: string;
  wl_workout_id: string;
  wl_is_completed: boolean;
  wl_day: string;
  wl_week: string;
  wl_created_at: string;
  wl_workout_weight_unit: string;
  w_position: string;
  w_phase_id: string;
  el_id: string;
  el_workout_logs_id: string;
  el_workout_exercises_id: string;
  sl_id: string;
  sl_exercise_logs_id: string;
  sl_weight: string;
  sl_reps: string;
  sl_position: string;
}

export interface Workout {
  id: string;
  userId: string;
  workoutId: string;
  workoutPosition: string;
  day: string;
  week: string;
  createdAt: string;
  workoutWeightUnit: string;
  exercises: Exercise[];
}

export interface Exercise {}
