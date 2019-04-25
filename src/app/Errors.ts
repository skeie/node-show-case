export class ResolverError extends Error {
  public error: Error;

  // TODO: report to sentry
  constructor(message: string) {
    super(message);
    this.name = 'ResolverError';
  }
}

// TODO send these to sentry as critical errors
export class SystemError extends Error {
  public error: Error;

  // TODO: report to sentry
  constructor(message: string) {
    super(message);
    this.name = 'SystemError';
  }
}
