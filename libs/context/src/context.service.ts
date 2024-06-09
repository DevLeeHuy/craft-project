import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ContextService {
  private currentContext: Map<string, any> = new Map();

  setContext<T>(key: string, value: T) {
    this.currentContext.set(key, value);
  }

  getContext<T>(key: string): T {
    return this.currentContext.get(key);
  }
}
