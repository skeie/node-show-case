import trackingQueries, { Query } from '../app/tracking/trackingQueries';
import mutations from '../app/tracking/mutations';

export const typeDef = `
  extend type Query {
    trackingHistory: [WorkoutLog!]!
  }

  extend type Mutation {
    trackExerciseSet(reps: Int, weight: Int, notes: String, secondsRested: Int, setId: ID, workoutExerciseId: ID, workoutLogId: ID!, exerciseLogId: ID, setLogId: ID): WorkoutLog!
    startWorkout(workoutId: ID!): Program!
    completeWorkout(workoutLogId: ID!): Program!
    goToNextPhase: Program!
    goToPreviousPhase: Program!
    changePhase(phaseId: ID!): Program!
    completeTriggerSession(triggerSessionId: ID!): TriggerSessionLog
  }

  enum WeightUnit {
    kilos
    pounds
  }

  # a workout
  type WorkoutLog {
    id: ID!
    workout: Workout!
    createdAt: String!
    finishedAt: String!
    workoutStartDate: String!
    exercises: [ExerciseLog!]!
    isCompleted: Boolean!
    notes: String
    weightUnit: WeightUnit!
  }

  type ExerciseLog {
    id: ID!
    workoutExerciseId: ID! # depricated, use workoutExercise instead
    workoutExercise: WorkoutExercise!
    notes: String
    sets: [ExerciseSetLog!]!

    # used to show previous set in current workout
    previousSets: [ExerciseSetLog!]!
  }

  type ExerciseHistoryItem {
    notes: String
    name: String # workout name, mostly for debugging
    exerciseLogsId: ID!
    sets: [ExerciseSetLog!]!
  }

  # a single set in an exercise
  type ExerciseSetLog {
    id: ID!
    position: Int!
    reps: Int!
    weight: Int!
    notes: String
    secondsRested: Int
  }

  type TriggerSessionLog {
    id: ID!
    triggerSession: TriggerSession!
    createdAt: String!
  }
`;

export const resolvers = {
  Query,
  Mutation: mutations,
};
