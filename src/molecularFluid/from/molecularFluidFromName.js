import { MolecularFluid } from '../molecularFluid.js';
import moleculeProperties from '../../data/molecules.json';
import { handleError } from './handleError.js';

export function molecularFluidFromName(molName) {
  let thisMol = moleculeProperties.filter((dict) => {
    return dict.name === molName;
  });

  thisMol = handleError(thisMol);
  return new MolecularFluid(
    thisMol.molarMass,
    thisMol.criticalTemperature,
    thisMol.criticalPressure,
    thisMol.accentricFactor,
  );
}
