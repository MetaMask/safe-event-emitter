import { EventEmitter } from 'events';

type Handler = (...args: any[]) => void;
type EventMap = {
  [k: string]: Handler | Handler[] | undefined;
};

/* istanbul ignore next */
function _ReflectApply<T, A extends any[], R> (target: (this: T, ...args: A) => R, receiver: T, args: A): R {
  return Function.prototype.apply.call(target, receiver, args);
}

const R = typeof Reflect === 'object'
  ? Reflect
  /* istanbul ignore next */
  : null;

const ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  /* istanbul ignore next */
  : _ReflectApply;

function safeApply<T, A extends any[]> (handler: (this: T, ...args: A) => void, context: T, args: A): void {
  try {
    ReflectApply(handler, context, args);
  } catch (err) {
    // Throw error after timeout so as not to interrupt the stack
    setTimeout(() => {
      throw err;
    });
  }
}

function arrayClone<T> (arr: T[], n: number): T[] {
  const copy = new Array(n);
  for (let i = 0; i < n; ++i) {
    copy[i] = arr[i];
  }
  return copy;
}

export default class SafeEventEmitter extends EventEmitter {
  emit (type: string, ...args: any[]): boolean {
    let doError = (type === 'error');

    const events: EventMap = (this as any)._events;
    if (events !== undefined) {
      doError = (doError && events.error === undefined);
    } else if (!doError) {
      return false;
    }

    // If there is no 'error' event listener then throw.
    if (doError) {
      let er;
      if (args.length > 0) {
        er = args[0];
      }
      if (er instanceof Error) {
        // Note: The comments on the `throw` lines are intentional, they show
        // up in Node's output if this results in an unhandled exception.
        throw er; // Unhandled 'error' event
      }
      // At least give some kind of context to the user
      const err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
      (err as any).context = er;
      throw err; // Unhandled 'error' event
    }

    const handler = events[type];

    if (handler === undefined) {
      return false;
    }

    if (typeof handler === 'function') {
      safeApply(handler, this, args);
    } else {
      const len = handler.length;
      const listeners = arrayClone(handler, len);
      for (let i = 0; i < len; ++i) {
        safeApply(listeners[i], this, args);
      }
    }

    return true;
  }
}
