import { molecularFluidFromName } from '../molecularFluidFromName';

test('fluid from name', () => {
  let res = molecularFluidFromName('methane');
  expect(res.molarMass).toStrictEqual(16.042504);
  expect(res.criticalTemperature).toStrictEqual(190.56);
  expect(res.criticalPressure).toStrictEqual(45.99);
});
