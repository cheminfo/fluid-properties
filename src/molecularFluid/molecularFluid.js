import { molecularFluidFromName } from './from/molecularFluidFromName.js';

class MolecularFluid {
  constructor(mass, criticalTemperature, criticalPressure, accentricFactor) {
    this.mass = mass;
    this.criticalTemperature = criticalTemperature;
    this.criticalPressure = criticalPressure;
    this.accentricFactor = accentricFactor;
  }
}

MolecularFluid.fromName = molecularFluidFromName;
