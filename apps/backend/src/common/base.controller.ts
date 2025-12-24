import type { ApiServer } from '@main';

/**
 * Base Controller abstract class
 *
 * All controllers should extend this class and implement applyRoutes()
 * The applyRoutes() method is called in the constructor to automatically
 * register routes when the controller is instantiated.
 */
export abstract class BaseController {
  constructor(protected readonly server: ApiServer) {
    this.applyRoutes();
  }

  /**
   * Implement this method to register routes on the server
   * This is called automatically in the constructor
   */
  protected abstract applyRoutes(): void;
}
