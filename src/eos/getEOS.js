import { R } from '../data/constants.js';

import { EOSParameters } from './eosParameters';
import { getPhasefromPhi } from './phase.js';

export function getEOS(molecularFluid, temperature, options = {}) {
  let { pressure = 1, volume = null, eos = 'pr' } = options;
  validateInput(pressure, volume);

  let eosParameters = new EOSParameters(molecularFluid, temperature, {
    eos: eos,
  });

  eosParameters.relativeTemperature =
    temperature / molecularFluid.criticalTemperature;

  if (Number.isFinite(volume) & !Number.isFinite(pressure)) {
    pressure = getPressure(eosParameters, temperature, volume);
  }

  updateEOSParameters(eosParameters, pressure, temperature);

  let zList = solveZ(eosParameters);
  let phaseProperties = getThermodynamicProperties(
    zList,
    eosParameters,
    eos,
    molecularFluid,
    pressure,
    temperature,
  );
  let phis = [];
  phaseProperties.forEach((properties) => {
    phis.push(properties.fugacityCoefficient);
  });

  return {
    temperature: temperature,
    pressure: pressure,
    phaseProperties: phaseProperties,
    zList: zList,
    inPhase: getPhasefromPhi(phis),
  };
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
 *Some background here https://pubs.acs.org/doi/pdf/10.1021/ie2023004
 *
 */
function solveZ(eosParameters) {
  // Cardano solution formula
  let zList = [];
  if (eosParameters.Delta > 0) {
    zList = solveCardano(eosParameters);
  } else {
    zList = solveTrigonometric(eosParameters);
  }
  return zList;
}

function solveCardano(eosParameters) {
  let xSol;
  let zList = [];
  xSol =
    Math.cbrt(-eosParameters.q / 2 + Math.sqrt(eosParameters.Delta)) +
    Math.cbrt(-eosParameters.q / 2 - Math.sqrt(eosParameters.Delta));
  zList = [xSol - eosParameters.alpha / 3];
  return zList;
}

function solveTrigonometric(eosParameters) {
  let xSol;
  let zList = [];

  let subeq = Math.arccos(
    ((3 * eosParameters.q) / 2 / eosParameters.p) *
      Math.sqrt(-3 / eosParameters.p),
  );
  for (let offset = 0; offset < 3; offset += 1) {
    xSol =
      2 *
      Math.sqrt(-eosParameters.p / 3) *
      Math.cos(subeq / 3 - (2 * Math.pi * offset) / 3);
    zList.push(xSol - eosParameters.alpha / 3);
  }
  zList.sort(); // [ z_liq, z_meaningless, z_vap ]
  zList.pop(1); // remove meaningless central value
  return zList;
}

function getThermodynamicProperties(
  zList,
  eosParameters,
  eos,
  molecularFluid,
  pressure,
  temperature,
) {
  let phaseProperties = [];
  switch (eos) {
    case 'pr':
      zList.forEach((z) => {
        phaseProperties.push(
          getThermodynamicPropertiesPR(
            z,
            eosParameters,
            molecularFluid,
            pressure,
            temperature,
          ),
        );
      });
      break;
    default:
      throw new Error('Only supported EOS are VDW and PR.');
  }
  return phaseProperties;
}

function getThermodynamicPropertiesPR(
  z,
  eosParameters,
  molecularFluid,
  pressure,
  temperature,
) {
  const ecap =
    eosParameters.S *
    Math.sqrt(eosParameters.relativeTemperature / eosParameters.k);
  const subeq1 = eosParameters.A / 2 / Math.sqrt(2) / eosParameters.B;

  const subeq2 = Math.log(
    (z + eosParameters.B * (1 + Math.sqrt(2))) /
      (z + eosParameters.B * (1 - Math.sqrt(2))),
  );
  const residualEnthalpy = z - 1 - subeq1 * (1 + ecap) * subeq2;
  const residualEntropy =
    Math.log(z - eosParameters.B) - subeq1 * ecap * subeq2;

  const { gibbs, fugacityCoefficient } = computeGibbsFugacity(
    residualEnthalpy,
    residualEntropy,
  );
  const molarDensity = computeMolarDensity(pressure, temperature, z);
  return {
    fugacityCoefficient: fugacityCoefficient,
    fugacity: fugacityCoefficient * pressure,
    residualEnthalpy: residualEnthalpy,
    residualEntropy: residualEntropy,
    residualGibbsEnergy: gibbs,
    compressibilityFactor: z,
    molarDensity: molarDensity,
    density: computeDensity(molarDensity, molecularFluid),
  };
}

function computeGibbsFugacity(enthalpy, entropy) {
  const gibbs = enthalpy - entropy;
  const fugacityCoefficient = Math.exp(gibbs);
  return { gibbs, fugacityCoefficient };
}

function computeMolarDensity(pressure, temperature, compressibilityFactor) {
  return pressure / (R * 1000 * temperature * compressibilityFactor);
}

function computeDensity(molarDensity, molecularFluid) {
  return (molarDensity * molecularFluid.molarMass) / 1000;
}
