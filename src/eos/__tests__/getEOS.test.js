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

test('methane', () => {
  const methane = MolecularFluid.fromName('methane');
  let res = getEOS(methane, 290, { pressure: 100 });
  expect(res.zList).toHaveLength(1);
  expect(res.phaseProperties[0].fugacityCoefficient).toBeCloseTo(0.8026, 2);
});
