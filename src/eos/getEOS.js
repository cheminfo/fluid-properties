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
