export class AgentError extends Error {
  constructor(
    message: string,
    readonly status: number,
    /** Si es true, reintentar el mismo mensaje tiene sentido. */
    readonly retryable: boolean = false,
    /** Segundos a esperar antes de reintentar, si el servidor lo indico. */
    readonly retryAfter: number = 0,
  ) {
    super(message);
    this.name = 'AgentError';
  }
}
