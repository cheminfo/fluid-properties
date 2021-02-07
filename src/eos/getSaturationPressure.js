// Find fugacity(Gas)/fugacity(Liquid) = 1 by optimizing p
import fmin from 'fmin';

import { getProperties } from './getEOS.js';

// curried loss function
function loss(molecularFluid, temperature, options) {
  return (p) => {
    let { pressure = p[0], volume = null, eos = 'pr' } = options;
    const wrongLoss = 1000;
    let res = getProperties(molecularFluid, temperature, {
      pressure: pressure,
      volume: volume,
      eos: eos,
    });

    if (res.zList.length === 2) {
      let fgc0 = res.phaseProperties[0].fugacityCoefficient;
      let fgc1 = res.phaseProperties[1].fugacityCoefficient;

      if (Number.isFinite(fgc0) & Number.isFinite(fgc1)) {
        let loss = (Math.min(fgc0 / fgc1, fgc1 / fgc0) - 1) ** 2;
        return loss;
      } else {
        return wrongLoss;
      }
    }
    return wrongLoss;
  };
}

// ToDo: what happens if we do not find anything?

/**
 * Find the saturation pressure of the system by finding the pressure
 * for which the ratios of the fugacities is equal to one.
 * Uses Nedler-Mead minimization which might not converge
 *
 * @export
 * @param {MolecularFluid} molecularFluid instance of the MolecularFluid class
 * @param {Number} temperature in K
 * @param {Number} [startvalue=0.1] starting pressure (in bar) for the minimization
 * @param {Options} [eosOptions={}] options that are passed to the getProperties function
 * @param {Number} eosOptions.eos Type of the equation of states (EOS). Available options: pr (Peng-Robinson), vdw (Van der Waals), rk (Redlich–Kwong), rks (Redlich–Kwong-Soave). Defaults to pr.
 * @returns {Object} fx and x
 */
export function findSaturationPressure(
  molecularFluid,
  temperature,
  startvalue = 0.1,
  eosOptions = {},
) {
  let solution = fmin.nelderMead(
    loss(molecularFluid, temperature, eosOptions),
    [startvalue],
  );
  return solution;
}
