import { R } from '../data/constants.js';

import { EOSParameters } from './eosParameters';

export function getEOS(molecularFluid, temperature, options = {}) {
  let { pressure = 1, volume = null, eos = 'pr' } = options;
  validateInput(pressure, volume);

  let eosParameters = new EOSParameters(molecularFluid, temperature, {
    eos: eos,
  });

  if (Number.isFinite(volume) & !Number.isFinite(pressure)) {
    pressure = getPressure(eosParameters, temperature, volume);
  }

  updateEOSParameters(eosParameters, pressure, temperature);
}

function validateInput(volume, pressure) {
  if (Number.isFinite(volume) & Number.isFinite(pressure)) {
    throw new Error('You need to specify pressure OR volume, not both!');
  }

  if (!Number.isFinite(volume) & !Number.isFinite(pressure)) {
    throw new Error('You need to specify pressure or volume!');
  }
}

function getPressure(eosParameters, temperature, volume) {
  return (
    (R * temperature) / (volume - eosParameters.b) -
    eosParameters.a /
      (volume ** 2 +
        eosParameters.u * eosParameters.b * volume +
        eosParameters.w * eosParameters.b ** 2)
  );
}

function updateEOSParameters(eosParameters, pressure, temperature) {
  eosParameters.A =
    (eosParameters.a * eosParameters.k * pressure) / R ** 2 / temperature ** 2;
  eosParameters.B = (eosParameters.b * pressure) / R / temperature;

  eosParameters.alpha =
    -1 - eosParameters.B + eosParameters.u * eosParameters.B;
  eosParameters.beta =
    eosParameters.A +
    eosParameters.w * eosParameters.B ** 2 -
    eosParameters.u * eosParameters.B -
    eosParameters.u * eosParameters.B ** 2;
  eosParameters.gamma =
    -eosParameters.A * eosParameters.B -
    eosParameters.w * eosParameters.B ** 2 -
    eosParameters.w * eosParameters.B ** 3;

  eosParameters.p = eosParameters.beta - eosParameters.alpha ** 2 / 3;
  eosParameters.q =
    (2 * eosParameters.alpha ** 3) / 27 -
    (eosParameters.alpha * eosParameters.beta) / 3 +
    eosParameters.gamma;
  eosParameters.Delta = eosParameters.q ** 2 / 4 + eosParameters.p ** 3 / 27;
}

/**
 *https://pubs.acs.org/doi/pdf/10.1021/ie2023004
 *
 */
function solveZ(eosParameters) {
  // Cardano solution formula

  if (eosParameters.Delta > 0) {
    let zList = solveCardano(eosParameters);
  } else {
    let zList = solveTrigonometric(eosParameters);
  }
}

function solveCardano(eosParameters) {
  let xSol;
  let zList;
  xSol =
    Math.cbrt(-eosParameters.q / 2 + Math.sqrt(eosParameters.Delta)) +
    Math.cbrt(-eosParameters.q / 2 - Math.sqrt(eosParameters.Delta));
  zList = [xSol - eosParameters.alpha / 3];
  return zList;
}

function solveTrigonometric(eosParameters) {
  let xSol;
  let zList;

  return zList;
}

function getThermodynamicProperties(zList, eosParameters) {}
