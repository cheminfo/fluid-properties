import { MolecularFluid } from '../molecularFluid.js';
import moleculeProperties from '../../data/molecules.json';
import { handleError } from './handleError.js';

export function molecularFluidFromFormula(molFormula) {
  let thisMol = moleculeProperties.filter((dict) => {
    return dict.formula === molFormula;
  });

  thisMol = handleError(thisMol);
  return new MolecularFluid(
    thisMol.molarMass,
    thisMol.criticalTemperature,
    thisMol.criticalPressure,
    thisMol.accentricFactor,
  );
}
