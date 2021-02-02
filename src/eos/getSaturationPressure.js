// Find fugacity(Gas)/fugacity(Liquid) = 1 by optimizing p
import fmin from 'fmin';

import { getEOS } from './getEOS.js';

// curried loss function
function loss(molecularFluid, temperature, options) {
  return (p) => {
    let { pressure = p[0], volume = null, eos = 'pr' } = options;
    const wrongLoss = 1000;
    let res = getEOS(molecularFluid, temperature, {
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
