import test from 'node:test';
import assert from 'node:assert/strict';
import { numeroWhatsApp } from '../src/utils/contato.js';

test('distingue o DDD 55 do código de país 55', () => {
  assert.equal(numeroWhatsApp('(55) 99999-1234'), '5555999991234');
  assert.equal(numeroWhatsApp('+55 (47) 99999-1234'), '5547999991234');
  assert.equal(numeroWhatsApp('(47) 3333-1234'), '554733331234');
  assert.equal(numeroWhatsApp('123'), null);
});
