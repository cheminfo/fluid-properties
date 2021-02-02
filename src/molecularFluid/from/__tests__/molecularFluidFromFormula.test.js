import { molecularFluidFromFormula } from '../molecularFluidFromFormula';

test('fluid from name', () => {
  let res = molecularFluidFromFormula('CH4');
  expect(res.molarMass).toStrictEqual(16.042504);
  expect(res.criticalTemperature).toStrictEqual(190.56);
  expect(res.criticalPressure).toStrictEqual(45.99);
});

test('exception', () => {
  expect(() => {
    return molecularFluidFromFormula('C6H6');
  }).toThrow('No match with database.');
});
