# safe-event-emitter

An `EventEmitter` that isolates the emitter from errors in handlers. If an error is thrown in a handler it is caught and re-thrown inside of a `setTimeout` so as to not interrupt the emitter's code flow.

The API is the same as a core [`EventEmitter`](https://nodejs.org/api/events.html).

### Install

```bash
$ yarn add '@metamask/safe-event-emitter'
```

### Usage

```js
import SafeEventEmitter from 'safe-event-emitter';

const ee = new SafeEventEmitter();
ee.on('boom', () => { throw new Error(); });
ee.emit('boom'); // No error here

// Error is thrown after setTimeout
```
