import SafeEventEmitter from './index';

describe('SafeEventEmitter', () => {
  test('can be constructed without error', () => {
    expect(new SafeEventEmitter()).toBeDefined();
  });

  test('can emit a value with no listeners', () => {
    const see = new SafeEventEmitter();
    expect(see.emit('foo', 42)).toBe(false);
  });

  test('can emit a value with 1 listeners', () => {
    expect.assertions(2);

    const see = new SafeEventEmitter();
    see.on('foo', (x) => expect(x).toBe(42));
    expect(see.emit('foo', 42)).toBe(true);
  });

  test('can emit a value with 2 listeners', () => {
    expect.assertions(3);

    const see = new SafeEventEmitter();
    see.on('foo', (x) => expect(x).toBe(42));
    see.on('foo', (x) => expect(x).toBe(42));
    expect(see.emit('foo', 42)).toBe(true);
  });

  test('returns false when _events is somehow undefined', () => {
    const see = new SafeEventEmitter();
    see.on('foo', () => { /* */ });
    delete (see as any)._events;
    expect(see.emit('foo', 42)).toBe(false);
  });

  test('throws error from handler after setTimeout', () => {
    jest.useFakeTimers();
    const see = new SafeEventEmitter();
    see.on('boom', () => {
      throw new Error('foo');
    });
    expect(() => {
      see.emit('boom');
    }).not.toThrow();
    expect(() => {
      jest.runAllTimers();
    }).toThrow('foo');
  });

  test('throws error emitted when there is no error handler', () => {
    const see = new SafeEventEmitter();
    expect(() => {
      see.emit('error', new Error('foo'));
    }).toThrow('foo');
  });

  test('throws error emitted when there is no error handler AND _events is somehow undefined', () => {
    const see = new SafeEventEmitter();
    delete (see as any)._events;
    expect(() => {
      see.emit('error', new Error('foo'));
    }).toThrow('foo');
  });

  test('throws default error when there is no error handler and error event emitted', () => {
    const see = new SafeEventEmitter();
    expect(() => {
      see.emit('error');
    }).toThrow('Unhandled error.');
  });

  test('throws error when there is no error handler and error event emitted', () => {
    const see = new SafeEventEmitter();
    expect(() => {
      see.emit('error', { message: 'foo' });
    }).toThrow('Unhandled error. (foo)');
  });
});
