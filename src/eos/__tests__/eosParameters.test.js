import { MolecularFluid } from '../../molecularFluid/molecularFluid.js';
import { EOSParameters } from '../eosParameters.js';

test('constructing EOS object', () => {
  const methane = MolecularFluid.fromName('methane');
  let eos = new EOSParameters(methane);
  expect(eos.w).toStrictEqual(0);
  expect(eos.u).toStrictEqual(1);
  expect(eos.S).toBeGreaterThan(0);
});
