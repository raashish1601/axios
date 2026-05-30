import { describe, it, vi } from 'vitest';
import platform from '../../lib/platform/index.js';
import assert from 'assert';

describe('generateString', () => {
  it('should generate a string of the specified length using the default alphabet', () => {
    const size = 10;
    const str = platform.generateString(size);

    assert.strictEqual(str.length, size);
  });

  it('should generate a string using only characters from the default alphabet', () => {
    const size = 10;
    const alphabet = platform.ALPHABET.ALPHA_DIGIT;

    const str = platform.generateString(size, alphabet);

    for (let char of str) {
      assert.ok(alphabet.includes(char), `Character ${char} is not in the alphabet`);
    }
  });

  it('should detect web worker environments without WorkerGlobalScope', async () => {
    const originalSelf = globalThis.self;
    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;
    const originalWorkerGlobalScope = globalThis.WorkerGlobalScope;

    try {
      delete globalThis.window;
      delete globalThis.document;
      delete globalThis.WorkerGlobalScope;
      globalThis.self = { postMessage() {} };

      vi.resetModules();
      const { hasStandardBrowserWebWorkerEnv } = await import('../../lib/platform/common/utils.js');

      assert.strictEqual(hasStandardBrowserWebWorkerEnv, true);
    } finally {
      if (originalSelf === undefined) {
        delete globalThis.self;
      } else {
        globalThis.self = originalSelf;
      }

      if (originalWindow === undefined) {
        delete globalThis.window;
      } else {
        globalThis.window = originalWindow;
      }

      if (originalDocument === undefined) {
        delete globalThis.document;
      } else {
        globalThis.document = originalDocument;
      }

      if (originalWorkerGlobalScope === undefined) {
        delete globalThis.WorkerGlobalScope;
      } else {
        globalThis.WorkerGlobalScope = originalWorkerGlobalScope;
      }

      vi.resetModules();
    }
  });
});
