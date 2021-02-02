import { molecularFluidFromFormula } from './from/molecularFluidFromFormula.js';
import { molecularFluidFromName } from './from/molecularFluidFromName.js';

export class MolecularFluid {
  constructor(
    molarMass,
    criticalTemperature,
    criticalPressure,
    accentricFactor,
  ) {
    this.molarMass = molarMass;
    this.criticalTemperature = criticalTemperature;
    this.criticalPressure = criticalPressure;
    this.accentricFactor = accentricFactor;
  }
}

MolecularFluid.fromName = molecularFluidFromName;
MolecularFluid.fromFormula = molecularFluidFromFormula;
