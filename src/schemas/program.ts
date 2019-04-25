import programQueries, { Query } from '../app/programs/programQueries';
import mutations from '../app/programs/mutations';

export const typeDef = `
  extend type Query {
    currentProgram: Program!
    triggerSession(triggerSessionId: ID): TriggerSession!
    triggerSessions: [TriggerSession!]!
    programs: [Program]!
  }

  extend type Mutation {
    exampleTrackingMutation(abbreviatedName: String!): Program
  }

  type Video {
    id: ID!
    uri: String!
    thumbnailUri: String
    hasSeen: Boolean
    name: String!
    position: Int
  }

  type Program {
    id: ID!
    abbreviatedName: String
    name: String!
    logoUri: String
    descriptionSections: [Section]
    phases: [Phase!]!
    introVideos: [Video!]!

    # user specifics
    currentWeekNumber: Int!
  }

  type Section {
    sectionText: String
  }

  # Mainly used to tell if the workout is trigger session or not
  enum WorkoutType {
    TRIGGER
    STRENGTH
    HIIT
    CARDIO
  }

  type Phase {
    id: ID!
    program: Program!
    descriptionSections: [Section]
    name: String!
    isCurrent: Boolean!
    focus: String
    position: Int!
    workouts: [Workout!]!
    introVideo: Video
    hasNext: Boolean!
    hasPrevious: Boolean!
  }

  type Workout {
    id: ID!
    position: Int!
    workoutExercises: [WorkoutExercise!]!
    isCurrent: Boolean!
    phase: Phase
    video: Video
    # should be: currentWorkoutLog
    workoutLog: WorkoutLog
  }

  type WorkoutExercise {
    id: ID!
    exercise: Exercise!
    position: Int
    sets: String!
    reps: String!
    restTime: String!
    descriptionSections: [Section]
  }

  type Exercise {
    id: ID!
    name: String!
    video: Video
    descriptionSections: [Section]
    muscleTargets: [MuscleTarget]

    # previous history, used to see previous lifts
    history: [ExerciseHistoryItem!]!
  }

  type MuscleTarget {
    id: ID!
    name: String
  }

  type TriggerSession {
    id: ID!
    position: Int
    exercises: [Exercise!]!
    video: Video!
  }
  
`;

export const resolvers = {
  Query,
  Mutation: mutations,
  ...programQueries,
};
