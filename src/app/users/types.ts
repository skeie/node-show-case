export enum WeightUnit {
  PUNDS,
  KILOS,
}

export interface IRemoteUser {
  email: string;
  mpRemoteToken: string;
  remoteId: string;
  programs: string[];
}

export interface IGqlUser {
  passwordHash?: string;
  id: number;
  programs?: ReadonlyArray<string>;
  email: string;
  gender?: string;
  mpToken?: string;
  currentPhaseId?: string;
}

export interface IDbUser {
  id: number;
  email: string;
  gender: 'male' | 'female';
  weightUnit: WeightUnit;
  passwordHash: string;
}
