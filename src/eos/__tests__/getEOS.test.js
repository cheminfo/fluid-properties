import { MolecularFluid } from '../../molecularFluid/molecularFluid.js';
import { getEOS } from '../getEOS.js';

test('wrong intitialization', () => {
  const methane = MolecularFluid.fromName('methane');

  expect(() => {
    return getEOS(methane, 298, { pressure: null, volume: null });
  }).toThrow('You need to specify pressure or volume!');

  expect(() => {
    return getEOS(methane, 298, { pressure: 1, volume: 1 });
  }).toThrow('You need to specify pressure OR volume, not both!');
});
