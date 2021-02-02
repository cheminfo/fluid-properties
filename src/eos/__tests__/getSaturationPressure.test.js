import { MolecularFluid } from '../../molecularFluid/molecularFluid.js';
import { findSaturationPressure } from '../getSaturationPressure.js';

test('find saturation pressure', () => {
  let hexane = MolecularFluid.fromName('hexane');
  let res = findSaturationPressure(hexane, 300);
  expect(res.x[0]).toBeCloseTo(0.21);
  expect(res.fx).toBeCloseTo(0);
});
