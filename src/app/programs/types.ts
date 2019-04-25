// TODO: get these automatically generated
export interface IWorkout {
  id: string;
}

export interface IPhase {
  id: string;
  workouts: IWorkout[];
}
export interface IGqlProgram {
  phases: IPhase[];
}
