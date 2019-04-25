export type Maybe<T> = T | null;

export enum WeightUnit {
  Kilos = 'kilos',
  Pounds = 'pounds',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
}
/** Mainly used to tell if the workout is trigger session or not */
export enum WorkoutType {
  Trigger = 'TRIGGER',
  Strength = 'STRENGTH',
  Hiit = 'HIIT',
  Cardio = 'CARDIO',
}

// ====================================================
// Types
// ====================================================

export interface Query {
  _?: Maybe<boolean>;

  authenticationError?: Maybe<string>;

  forbiddenError?: Maybe<string>;

  currentProgram: Program;

  triggerSession: TriggerSession;

  triggerSessions: TriggerSession[];

  programs: (Maybe<Program>)[];

  trackingHistory: WorkoutLog[];

  user: User;
}

export interface Program {
  id: string;

  abbreviatedName?: Maybe<string>;

  name: string;

  logoUri?: Maybe<string>;

  descriptionSections?: Maybe<(Maybe<Section>)[]>;

  phases: Phase[];

  introVideos: Video[];

  fullTriggerWorkoutVideos: Video[];
  /** user specifics */
  currentWeekNumber: number;
}

export interface Section {
  sectionText?: Maybe<string>;
}

export interface Phase {
  id: string;

  program: Program;

  descriptionSections?: Maybe<(Maybe<Section>)[]>;

  name: string;

  isCurrent: boolean;

  focus?: Maybe<string>;

  position: number;

  workouts: Workout[];

  introVideo?: Maybe<Video>;

  hasNext: boolean;

  hasPrevious: boolean;
}

export interface Workout {
  id: string;

  position: number;

  workoutExercises: WorkoutExercise[];

  isCurrent: boolean;

  phase?: Maybe<Phase>;

  video?: Maybe<Video>;
  /** should be: currentWorkoutLog */
  workoutLog?: Maybe<WorkoutLog>;
}

export interface WorkoutExercise {
  id: string;

  exercise: Exercise;

  position?: Maybe<number>;

  sets: string;

  reps: string;

  descriptionSections?: Maybe<(Maybe<Section>)[]>;
}

export interface Exercise {
  id: string;

  name: string;

  video?: Maybe<Video>;

  descriptionSections?: Maybe<(Maybe<Section>)[]>;

  muscleTargets?: Maybe<(Maybe<MuscleTarget>)[]>;
  /** previous history, used to see previous lifts */
  history: ExerciseHistoryItem[];
}

export interface Video {
  id: string;

  uri: string;

  thumbnailUri?: Maybe<string>;

  hasSeen?: Maybe<boolean>;

  name?: Maybe<string>;

  position?: Maybe<number>;
}

export interface MuscleTarget {
  id: string;

  name?: Maybe<string>;
}

export interface ExerciseHistoryItem {
  notes?: Maybe<string>;

  name?: Maybe<string>;

  exerciseLogsId: string;

  sets: ExerciseSetLog[];
}

/** a single set in an exercise */
export interface ExerciseSetLog {
  id: string;

  position: number;

  reps: number;

  weight: number;

  notes?: Maybe<string>;

  secondsRested?: Maybe<number>;
}

/** a workout */
export interface WorkoutLog {
  id: string;

  workout: Workout;

  createdAt: string;

  workoutStartDate: string;

  exercises: ExerciseLog[];

  isCompleted: boolean;

  notes?: Maybe<string>;

  weightUnit: WeightUnit;
}

export interface ExerciseLog {
  id: string;

  workoutExerciseId: string;

  workoutExercise: WorkoutExercise;

  notes?: Maybe<string>;

  sets: ExerciseSetLog[];
  /** used to show previous set in current workout */
  previousSets: ExerciseSetLog[];
}

export interface TriggerSession {
  id: string;

  position?: Maybe<number>;

  exercises: Exercise[];

  video?: Maybe<Video>;
}

export interface User {
  id: string;

  email: string;

  userName?: Maybe<string>;

  token?: Maybe<string>;

  gender: Gender;

  weightUnit: WeightUnit;
}

export interface Mutation {
  _?: Maybe<boolean>;

  userInputError?: Maybe<string>;

  exampleTrackingMutation?: Maybe<Program>;

  trackExerciseSet: WorkoutLog;

  startWorkout: Program;

  completeWorkout: Program;

  goToNextPhase: Program;

  goToPreviousPhase: Program;

  completeTriggerSession?: Maybe<TriggerSessionLog>;

  login: User;

  signup: User;

  updateUser: User;

  storeApnsToken: GenericResponse;
}

export interface TriggerSessionLog {
  id: string;

  triggerSession: TriggerSession;

  createdAt: string;
}

export interface GenericResponse {
  success: boolean;

  error?: Maybe<string>;
}

// ====================================================
// Arguments
// ====================================================

export interface TriggerSessionQueryArgs {
  triggerSessionId?: Maybe<string>;
}
export interface UserInputErrorMutationArgs {
  input?: Maybe<string>;
}
export interface ExampleTrackingMutationMutationArgs {
  abbreviatedName: string;
}
export interface TrackExerciseSetMutationArgs {
  reps?: Maybe<number>;

  weight?: Maybe<number>;

  notes?: Maybe<string>;

  secondsRested?: Maybe<number>;

  setId?: Maybe<string>;

  workoutExerciseId?: Maybe<string>;

  workoutLogId: string;

  exerciseLogId?: Maybe<string>;

  setLogId?: Maybe<string>;
}
export interface StartWorkoutMutationArgs {
  workoutId: string;
}
export interface CompleteWorkoutMutationArgs {
  workoutLogId: string;
}
export interface CompleteTriggerSessionMutationArgs {
  triggerSessionId: string;
}
export interface LoginMutationArgs {
  email: string;

  password: string;
}
export interface SignupMutationArgs {
  email: string;

  password: string;

  gender: Gender;
}
export interface UpdateUserMutationArgs {
  weightUnit?: Maybe<WeightUnit>;

  gender?: Maybe<Gender>;
}
export interface StoreApnsTokenMutationArgs {
  token: string;
}

import { GraphQLResolveInfo } from 'graphql';

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  Context = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export namespace QueryResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    _?: _Resolver<Maybe<boolean>, TypeParent, Context>;

    authenticationError?: AuthenticationErrorResolver<
      Maybe<string>,
      TypeParent,
      Context
    >;

    forbiddenError?: ForbiddenErrorResolver<Maybe<string>, TypeParent, Context>;

    currentProgram?: CurrentProgramResolver<Program, TypeParent, Context>;

    triggerSession?: TriggerSessionResolver<
      TriggerSession,
      TypeParent,
      Context
    >;

    triggerSessions?: TriggerSessionsResolver<
      TriggerSession[],
      TypeParent,
      Context
    >;

    programs?: ProgramsResolver<(Maybe<Program>)[], TypeParent, Context>;

    trackingHistory?: TrackingHistoryResolver<
      WorkoutLog[],
      TypeParent,
      Context
    >;

    user?: UserResolver<User, TypeParent, Context>;
  }

  export type _Resolver<
    R = Maybe<boolean>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type AuthenticationErrorResolver<
    R = Maybe<string>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ForbiddenErrorResolver<
    R = Maybe<string>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type CurrentProgramResolver<
    R = Program,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TriggerSessionResolver<
    R = TriggerSession,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, TriggerSessionArgs>;
  export interface TriggerSessionArgs {
    triggerSessionId?: Maybe<string>;
  }

  export type TriggerSessionsResolver<
    R = TriggerSession[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ProgramsResolver<
    R = (Maybe<Program>)[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TrackingHistoryResolver<
    R = WorkoutLog[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type UserResolver<R = User, Parent = {}, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace ProgramResolvers {
  export interface Resolvers<Context = {}, TypeParent = Program> {
    id?: IdResolver<string, TypeParent, Context>;

    abbreviatedName?: AbbreviatedNameResolver<
      Maybe<string>,
      TypeParent,
      Context
    >;

    name?: NameResolver<string, TypeParent, Context>;

    logoUri?: LogoUriResolver<Maybe<string>, TypeParent, Context>;

    descriptionSections?: DescriptionSectionsResolver<
      Maybe<(Maybe<Section>)[]>,
      TypeParent,
      Context
    >;

    phases?: PhasesResolver<Phase[], TypeParent, Context>;

    introVideos?: IntroVideosResolver<Video[], TypeParent, Context>;

    fullTriggerWorkoutVideos?: FullTriggerWorkoutVideosResolver<
      Video[],
      TypeParent,
      Context
    >;
    /** user specifics */
    currentWeekNumber?: CurrentWeekNumberResolver<number, TypeParent, Context>;
  }

  export type IdResolver<R = string, Parent = Program, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type AbbreviatedNameResolver<
    R = Maybe<string>,
    Parent = Program,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string,
    Parent = Program,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LogoUriResolver<
    R = Maybe<string>,
    Parent = Program,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DescriptionSectionsResolver<
    R = Maybe<(Maybe<Section>)[]>,
    Parent = Program,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PhasesResolver<
    R = Phase[],
    Parent = Program,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type IntroVideosResolver<
    R = Video[],
    Parent = Program,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type FullTriggerWorkoutVideosResolver<
    R = Video[],
    Parent = Program,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type CurrentWeekNumberResolver<
    R = number,
    Parent = Program,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace SectionResolvers {
  export interface Resolvers<Context = {}, TypeParent = Section> {
    sectionText?: SectionTextResolver<Maybe<string>, TypeParent, Context>;
  }

  export type SectionTextResolver<
    R = Maybe<string>,
    Parent = Section,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace PhaseResolvers {
  export interface Resolvers<Context = {}, TypeParent = Phase> {
    id?: IdResolver<string, TypeParent, Context>;

    program?: ProgramResolver<Program, TypeParent, Context>;

    descriptionSections?: DescriptionSectionsResolver<
      Maybe<(Maybe<Section>)[]>,
      TypeParent,
      Context
    >;

    name?: NameResolver<string, TypeParent, Context>;

    isCurrent?: IsCurrentResolver<boolean, TypeParent, Context>;

    focus?: FocusResolver<Maybe<string>, TypeParent, Context>;

    position?: PositionResolver<number, TypeParent, Context>;

    workouts?: WorkoutsResolver<Workout[], TypeParent, Context>;

    introVideo?: IntroVideoResolver<Maybe<Video>, TypeParent, Context>;

    hasNext?: HasNextResolver<boolean, TypeParent, Context>;

    hasPrevious?: HasPreviousResolver<boolean, TypeParent, Context>;
  }

  export type IdResolver<R = string, Parent = Phase, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type ProgramResolver<
    R = Program,
    Parent = Phase,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DescriptionSectionsResolver<
    R = Maybe<(Maybe<Section>)[]>,
    Parent = Phase,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameResolver<R = string, Parent = Phase, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type IsCurrentResolver<
    R = boolean,
    Parent = Phase,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type FocusResolver<
    R = Maybe<string>,
    Parent = Phase,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PositionResolver<
    R = number,
    Parent = Phase,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type WorkoutsResolver<
    R = Workout[],
    Parent = Phase,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type IntroVideoResolver<
    R = Maybe<Video>,
    Parent = Phase,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type HasNextResolver<
    R = boolean,
    Parent = Phase,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type HasPreviousResolver<
    R = boolean,
    Parent = Phase,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace WorkoutResolvers {
  export interface Resolvers<Context = {}, TypeParent = Workout> {
    id?: IdResolver<string, TypeParent, Context>;

    position?: PositionResolver<number, TypeParent, Context>;

    workoutExercises?: WorkoutExercisesResolver<
      WorkoutExercise[],
      TypeParent,
      Context
    >;

    isCurrent?: IsCurrentResolver<boolean, TypeParent, Context>;

    phase?: PhaseResolver<Maybe<Phase>, TypeParent, Context>;

    video?: VideoResolver<Maybe<Video>, TypeParent, Context>;
    /** should be: currentWorkoutLog */
    workoutLog?: WorkoutLogResolver<Maybe<WorkoutLog>, TypeParent, Context>;
  }

  export type IdResolver<R = string, Parent = Workout, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type PositionResolver<
    R = number,
    Parent = Workout,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type WorkoutExercisesResolver<
    R = WorkoutExercise[],
    Parent = Workout,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type IsCurrentResolver<
    R = boolean,
    Parent = Workout,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PhaseResolver<
    R = Maybe<Phase>,
    Parent = Workout,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VideoResolver<
    R = Maybe<Video>,
    Parent = Workout,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type WorkoutLogResolver<
    R = Maybe<WorkoutLog>,
    Parent = Workout,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace WorkoutExerciseResolvers {
  export interface Resolvers<Context = {}, TypeParent = WorkoutExercise> {
    id?: IdResolver<string, TypeParent, Context>;

    exercise?: ExerciseResolver<Exercise, TypeParent, Context>;

    position?: PositionResolver<Maybe<number>, TypeParent, Context>;

    sets?: SetsResolver<string, TypeParent, Context>;

    reps?: RepsResolver<string, TypeParent, Context>;

    descriptionSections?: DescriptionSectionsResolver<
      Maybe<(Maybe<Section>)[]>,
      TypeParent,
      Context
    >;
  }

  export type IdResolver<
    R = string,
    Parent = WorkoutExercise,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ExerciseResolver<
    R = Exercise,
    Parent = WorkoutExercise,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PositionResolver<
    R = Maybe<number>,
    Parent = WorkoutExercise,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type SetsResolver<
    R = string,
    Parent = WorkoutExercise,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RepsResolver<
    R = string,
    Parent = WorkoutExercise,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DescriptionSectionsResolver<
    R = Maybe<(Maybe<Section>)[]>,
    Parent = WorkoutExercise,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace ExerciseResolvers {
  export interface Resolvers<Context = {}, TypeParent = Exercise> {
    id?: IdResolver<string, TypeParent, Context>;

    name?: NameResolver<string, TypeParent, Context>;

    video?: VideoResolver<Maybe<Video>, TypeParent, Context>;

    descriptionSections?: DescriptionSectionsResolver<
      Maybe<(Maybe<Section>)[]>,
      TypeParent,
      Context
    >;

    muscleTargets?: MuscleTargetsResolver<
      Maybe<(Maybe<MuscleTarget>)[]>,
      TypeParent,
      Context
    >;
    /** previous history, used to see previous lifts */
    history?: HistoryResolver<ExerciseHistoryItem[], TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Exercise,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string,
    Parent = Exercise,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VideoResolver<
    R = Maybe<Video>,
    Parent = Exercise,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DescriptionSectionsResolver<
    R = Maybe<(Maybe<Section>)[]>,
    Parent = Exercise,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MuscleTargetsResolver<
    R = Maybe<(Maybe<MuscleTarget>)[]>,
    Parent = Exercise,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type HistoryResolver<
    R = ExerciseHistoryItem[],
    Parent = Exercise,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace VideoResolvers {
  export interface Resolvers<Context = {}, TypeParent = Video> {
    id?: IdResolver<string, TypeParent, Context>;

    uri?: UriResolver<string, TypeParent, Context>;

    thumbnailUri?: ThumbnailUriResolver<Maybe<string>, TypeParent, Context>;

    hasSeen?: HasSeenResolver<Maybe<boolean>, TypeParent, Context>;

    name?: NameResolver<Maybe<string>, TypeParent, Context>;

    position?: PositionResolver<Maybe<number>, TypeParent, Context>;
  }

  export type IdResolver<R = string, Parent = Video, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UriResolver<R = string, Parent = Video, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type ThumbnailUriResolver<
    R = Maybe<string>,
    Parent = Video,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type HasSeenResolver<
    R = Maybe<boolean>,
    Parent = Video,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = Maybe<string>,
    Parent = Video,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PositionResolver<
    R = Maybe<number>,
    Parent = Video,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace MuscleTargetResolvers {
  export interface Resolvers<Context = {}, TypeParent = MuscleTarget> {
    id?: IdResolver<string, TypeParent, Context>;

    name?: NameResolver<Maybe<string>, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = MuscleTarget,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = Maybe<string>,
    Parent = MuscleTarget,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace ExerciseHistoryItemResolvers {
  export interface Resolvers<Context = {}, TypeParent = ExerciseHistoryItem> {
    notes?: NotesResolver<Maybe<string>, TypeParent, Context>;

    name?: NameResolver<Maybe<string>, TypeParent, Context>;

    exerciseLogsId?: ExerciseLogsIdResolver<string, TypeParent, Context>;

    sets?: SetsResolver<ExerciseSetLog[], TypeParent, Context>;
  }

  export type NotesResolver<
    R = Maybe<string>,
    Parent = ExerciseHistoryItem,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = Maybe<string>,
    Parent = ExerciseHistoryItem,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ExerciseLogsIdResolver<
    R = string,
    Parent = ExerciseHistoryItem,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type SetsResolver<
    R = ExerciseSetLog[],
    Parent = ExerciseHistoryItem,
    Context = {}
  > = Resolver<R, Parent, Context>;
}
/** a single set in an exercise */
export namespace ExerciseSetLogResolvers {
  export interface Resolvers<Context = {}, TypeParent = ExerciseSetLog> {
    id?: IdResolver<string, TypeParent, Context>;

    position?: PositionResolver<number, TypeParent, Context>;

    reps?: RepsResolver<number, TypeParent, Context>;

    weight?: WeightResolver<number, TypeParent, Context>;

    notes?: NotesResolver<Maybe<string>, TypeParent, Context>;

    secondsRested?: SecondsRestedResolver<Maybe<number>, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = ExerciseSetLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PositionResolver<
    R = number,
    Parent = ExerciseSetLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RepsResolver<
    R = number,
    Parent = ExerciseSetLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type WeightResolver<
    R = number,
    Parent = ExerciseSetLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NotesResolver<
    R = Maybe<string>,
    Parent = ExerciseSetLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type SecondsRestedResolver<
    R = Maybe<number>,
    Parent = ExerciseSetLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
}
/** a workout */
export namespace WorkoutLogResolvers {
  export interface Resolvers<Context = {}, TypeParent = WorkoutLog> {
    id?: IdResolver<string, TypeParent, Context>;

    workout?: WorkoutResolver<Workout, TypeParent, Context>;

    createdAt?: CreatedAtResolver<string, TypeParent, Context>;

    workoutStartDate?: WorkoutStartDateResolver<string, TypeParent, Context>;

    exercises?: ExercisesResolver<ExerciseLog[], TypeParent, Context>;

    isCompleted?: IsCompletedResolver<boolean, TypeParent, Context>;

    notes?: NotesResolver<Maybe<string>, TypeParent, Context>;

    weightUnit?: WeightUnitResolver<WeightUnit, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = WorkoutLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type WorkoutResolver<
    R = Workout,
    Parent = WorkoutLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type CreatedAtResolver<
    R = string,
    Parent = WorkoutLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type WorkoutStartDateResolver<
    R = string,
    Parent = WorkoutLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ExercisesResolver<
    R = ExerciseLog[],
    Parent = WorkoutLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type IsCompletedResolver<
    R = boolean,
    Parent = WorkoutLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NotesResolver<
    R = Maybe<string>,
    Parent = WorkoutLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type WeightUnitResolver<
    R = WeightUnit,
    Parent = WorkoutLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace ExerciseLogResolvers {
  export interface Resolvers<Context = {}, TypeParent = ExerciseLog> {
    id?: IdResolver<string, TypeParent, Context>;

    workoutExerciseId?: WorkoutExerciseIdResolver<string, TypeParent, Context>;

    workoutExercise?: WorkoutExerciseResolver<
      WorkoutExercise,
      TypeParent,
      Context
    >;

    notes?: NotesResolver<Maybe<string>, TypeParent, Context>;

    sets?: SetsResolver<ExerciseSetLog[], TypeParent, Context>;
    /** used to show previous set in current workout */
    previousSets?: PreviousSetsResolver<ExerciseSetLog[], TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = ExerciseLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type WorkoutExerciseIdResolver<
    R = string,
    Parent = ExerciseLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type WorkoutExerciseResolver<
    R = WorkoutExercise,
    Parent = ExerciseLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NotesResolver<
    R = Maybe<string>,
    Parent = ExerciseLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type SetsResolver<
    R = ExerciseSetLog[],
    Parent = ExerciseLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PreviousSetsResolver<
    R = ExerciseSetLog[],
    Parent = ExerciseLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace TriggerSessionResolvers {
  export interface Resolvers<Context = {}, TypeParent = TriggerSession> {
    id?: IdResolver<string, TypeParent, Context>;

    position?: PositionResolver<Maybe<number>, TypeParent, Context>;

    exercises?: ExercisesResolver<Exercise[], TypeParent, Context>;

    video?: VideoResolver<Maybe<Video>, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = TriggerSession,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PositionResolver<
    R = Maybe<number>,
    Parent = TriggerSession,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ExercisesResolver<
    R = Exercise[],
    Parent = TriggerSession,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VideoResolver<
    R = Maybe<Video>,
    Parent = TriggerSession,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace UserResolvers {
  export interface Resolvers<Context = {}, TypeParent = User> {
    id?: IdResolver<string, TypeParent, Context>;

    email?: EmailResolver<string, TypeParent, Context>;

    userName?: UserNameResolver<Maybe<string>, TypeParent, Context>;

    token?: TokenResolver<Maybe<string>, TypeParent, Context>;

    gender?: GenderResolver<Gender, TypeParent, Context>;

    weightUnit?: WeightUnitResolver<WeightUnit, TypeParent, Context>;
  }

  export type IdResolver<R = string, Parent = User, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type EmailResolver<R = string, Parent = User, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UserNameResolver<
    R = Maybe<string>,
    Parent = User,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TokenResolver<
    R = Maybe<string>,
    Parent = User,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type GenderResolver<
    R = Gender,
    Parent = User,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type WeightUnitResolver<
    R = WeightUnit,
    Parent = User,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    _?: _Resolver<Maybe<boolean>, TypeParent, Context>;

    userInputError?: UserInputErrorResolver<Maybe<string>, TypeParent, Context>;

    exampleTrackingMutation?: ExampleTrackingMutationResolver<
      Maybe<Program>,
      TypeParent,
      Context
    >;

    trackExerciseSet?: TrackExerciseSetResolver<
      WorkoutLog,
      TypeParent,
      Context
    >;

    startWorkout?: StartWorkoutResolver<Program, TypeParent, Context>;

    completeWorkout?: CompleteWorkoutResolver<Program, TypeParent, Context>;

    goToNextPhase?: GoToNextPhaseResolver<Program, TypeParent, Context>;

    goToPreviousPhase?: GoToPreviousPhaseResolver<Program, TypeParent, Context>;

    completeTriggerSession?: CompleteTriggerSessionResolver<
      Maybe<TriggerSessionLog>,
      TypeParent,
      Context
    >;

    login?: LoginResolver<User, TypeParent, Context>;

    signup?: SignupResolver<User, TypeParent, Context>;

    updateUser?: UpdateUserResolver<User, TypeParent, Context>;

    storeApnsToken?: StoreApnsTokenResolver<
      GenericResponse,
      TypeParent,
      Context
    >;
  }

  export type _Resolver<
    R = Maybe<boolean>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type UserInputErrorResolver<
    R = Maybe<string>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, UserInputErrorArgs>;
  export interface UserInputErrorArgs {
    input?: Maybe<string>;
  }

  export type ExampleTrackingMutationResolver<
    R = Maybe<Program>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, ExampleTrackingMutationArgs>;
  export interface ExampleTrackingMutationArgs {
    abbreviatedName: string;
  }

  export type TrackExerciseSetResolver<
    R = WorkoutLog,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, TrackExerciseSetArgs>;
  export interface TrackExerciseSetArgs {
    reps?: Maybe<number>;

    weight?: Maybe<number>;

    notes?: Maybe<string>;

    secondsRested?: Maybe<number>;

    setId?: Maybe<string>;

    workoutExerciseId?: Maybe<string>;

    workoutLogId: string;

    exerciseLogId?: Maybe<string>;

    setLogId?: Maybe<string>;
  }

  export type StartWorkoutResolver<
    R = Program,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, StartWorkoutArgs>;
  export interface StartWorkoutArgs {
    workoutId: string;
  }

  export type CompleteWorkoutResolver<
    R = Program,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, CompleteWorkoutArgs>;
  export interface CompleteWorkoutArgs {
    workoutLogId: string;
  }

  export type GoToNextPhaseResolver<
    R = Program,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type GoToPreviousPhaseResolver<
    R = Program,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type CompleteTriggerSessionResolver<
    R = Maybe<TriggerSessionLog>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, CompleteTriggerSessionArgs>;
  export interface CompleteTriggerSessionArgs {
    triggerSessionId: string;
  }

  export type LoginResolver<R = User, Parent = {}, Context = {}> = Resolver<
    R,
    Parent,
    Context,
    LoginArgs
  >;
  export interface LoginArgs {
    email: string;

    password: string;
  }

  export type SignupResolver<R = User, Parent = {}, Context = {}> = Resolver<
    R,
    Parent,
    Context,
    SignupArgs
  >;
  export interface SignupArgs {
    email: string;

    password: string;

    gender: Gender;
  }

  export type UpdateUserResolver<
    R = User,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, UpdateUserArgs>;
  export interface UpdateUserArgs {
    weightUnit?: Maybe<WeightUnit>;

    gender?: Maybe<Gender>;
  }

  export type StoreApnsTokenResolver<
    R = GenericResponse,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, StoreApnsTokenArgs>;
  export interface StoreApnsTokenArgs {
    token: string;
  }
}

export namespace TriggerSessionLogResolvers {
  export interface Resolvers<Context = {}, TypeParent = TriggerSessionLog> {
    id?: IdResolver<string, TypeParent, Context>;

    triggerSession?: TriggerSessionResolver<
      TriggerSession,
      TypeParent,
      Context
    >;

    createdAt?: CreatedAtResolver<string, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = TriggerSessionLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TriggerSessionResolver<
    R = TriggerSession,
    Parent = TriggerSessionLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type CreatedAtResolver<
    R = string,
    Parent = TriggerSessionLog,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GenericResponseResolvers {
  export interface Resolvers<Context = {}, TypeParent = GenericResponse> {
    success?: SuccessResolver<boolean, TypeParent, Context>;

    error?: ErrorResolver<Maybe<string>, TypeParent, Context>;
  }

  export type SuccessResolver<
    R = boolean,
    Parent = GenericResponse,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ErrorResolver<
    R = Maybe<string>,
    Parent = GenericResponse,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  {}
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  {}
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  {}
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string;
}

export interface IResolvers {
  Query?: QueryResolvers.Resolvers;
  Program?: ProgramResolvers.Resolvers;
  Section?: SectionResolvers.Resolvers;
  Phase?: PhaseResolvers.Resolvers;
  Workout?: WorkoutResolvers.Resolvers;
  WorkoutExercise?: WorkoutExerciseResolvers.Resolvers;
  Exercise?: ExerciseResolvers.Resolvers;
  Video?: VideoResolvers.Resolvers;
  MuscleTarget?: MuscleTargetResolvers.Resolvers;
  ExerciseHistoryItem?: ExerciseHistoryItemResolvers.Resolvers;
  ExerciseSetLog?: ExerciseSetLogResolvers.Resolvers;
  WorkoutLog?: WorkoutLogResolvers.Resolvers;
  ExerciseLog?: ExerciseLogResolvers.Resolvers;
  TriggerSession?: TriggerSessionResolvers.Resolvers;
  User?: UserResolvers.Resolvers;
  Mutation?: MutationResolvers.Resolvers;
  TriggerSessionLog?: TriggerSessionLogResolvers.Resolvers;
  GenericResponse?: GenericResponseResolvers.Resolvers;
}

export interface IDirectiveResolvers<Result> {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
}
