import { molecularFluidFromFormula } from './from/molecularFluidFromFormula.js';
import { molecularFluidFromName } from './from/molecularFluidFromName.js';

/**
 * This class stores properties of molecules
 *
 * @export
 * @class MolecularFluid
 */
export class MolecularFluid {
  /**
   *Creates an instance of MolecularFluid.
   * @param {Number} molarMass in g/mol
   * @param {Number} criticalTemperature in K
   * @param {Number} criticalPressure in bar
   * @param {Number} accentricFactor
   * @memberof MolecularFluid
   */
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
