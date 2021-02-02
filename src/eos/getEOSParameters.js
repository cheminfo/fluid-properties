import { R } from '../data/constants.js';

export function getVDWParameters(molecularFluid) {
  const parameters = {
    a:
      (0.421875 * R ** 2 * molecularFluid.criticalTemperature ** 2) /
      molecularFluid.criticalPressure,
    b: (0.125 * R * molecularFluid.tc) / molecularFluid.pc,
    S: null,
    k: 1,
    u: 1,
    w: 0,
  };
  return parameters;
}

export function getRKParameters(molecularFluid, temperature) {
  const parameters = {
    a:
      (0.42748 * R ** 2 * molecularFluid.criticalTemperature ** 2) /
      molecularFluid.criticalPressure /
      Math.sqrt(temperature / molecularFluid.criticalTemperature),
    b:
      (0.08664 * R * molecularFluid.criticalTemperature) /
      molecularFluid.criticalPressure,
    S: null,
    k: 1,
    u: 1,
    w: 0,
  };
  return parameters;
}

export function getRKSParameters(molecularFluid, temperature) {
  const s =
    0.48 +
    1.574 * molecularFluid.accentricFactor -
    0.176 * molecularFluid.accentricFactor ** 2;
  const parameters = {
    a:
      (0.42748 * R ** 2 * molecularFluid.criticalTemperature ** 2) /
      molecularFluid.criticalPressure,
    b:
      (0.08664 * R * molecularFluid.criticalTemperature) /
      molecularFluid.criticalPressure,
    S: s,
    k:
      (1 +
        s *
          (1 - Math.sqrt(temperature / molecularFluid.criticalTemperature))) **
      2,
    u: 1,
    w: 0,
  };
  return parameters;
}

export function getPRParameters(molecularFluid, temperature) {
  const s =
    0.37464 +
    1.54226 * molecularFluid.accentricFactor -
    0.26992 * molecularFluid.accentricFactor ** 2;
  const parameters = {
    a:
      (0.45724 * R ** 2 * molecularFluid.criticalTemperature ** 2) /
      molecularFluid.criticalPressure,
    b:
      (0.0778 * R * molecularFluid.criticalTemperature) /
      molecularFluid.criticalPressure,
    S: s,
    k:
      (1 +
        s *
          (1 - Math.sqrt(temperature / molecularFluid.criticalTemperature))) **
      2,
    u: 1,
    w: 0,
  };
  return parameters;
}
