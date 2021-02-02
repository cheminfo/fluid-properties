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

test('methane close to saturation', () => {
  const methane = MolecularFluid.fromName('methane');
  let res = getEOS(methane, 92.15, { pressure: 2.20178 });
  expect(res.zList).toHaveLength(2);
});

test('hexane', () => {
  // Comparing with the spreadsheet accompanying Introductory Chemical Engineering Thermodynamics, 2nd Edition by J. Richard Elliott, Carl T. Lira
  const hexane = MolecularFluid.fromName('hexane');
  let res = getEOS(hexane, 322.29, { pressure: 0.5 });
  expect(res.zList).toHaveLength(2);
  expect(res.zList[0]).toBeCloseTo(0.002);
  expect(res.zList[1]).toBeCloseTo(0.97);
  // We're slightly off in zs and the derived properties we should double check where this stems from
});
