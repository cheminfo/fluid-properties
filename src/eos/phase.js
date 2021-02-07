/**
 * Based on comparing the parameters to the critical constants
 * return which phase the system is in
 *
 * @export
 * @param {MolecularFluid} molecularFluid instance of the MolecularFluid class
 * @param {Number} temperature in K
 * @param {Numnber} pressure in bar
 * @param {Number} volumen in L
 * @returns {String} "supercritial", "gas", or "liquid" or null
 */
export function getPhase(molecularFluid, temperature, pressure, volume) {
  let phase = null;
  if (
    (temperature > molecularFluid.criticalTemperature) &
    (pressure > molecularFluid.criticalPressure)
  ) {
    phase = 'supercritical';
  } else {
    if (molecularFluid.criticalVolume) {
      if (volume > molecularFluid.criticalVolume) phase = 'gas';
    } else {
      phase = 'liquid';
    }
  }
  return phase;
}

/**
 * Comparing an array of fugacities to find out in which
 * state the system is
 * @export
 * @param {Array<number>} phis An array of fugacities
 * @returns {Number} Index of the state the system is in
 */
export function getPhasefromPhi(phis) {
  if (phis.length === 1) {
    return 0;
  } else {
    if (phis[1] < phis[0]) {
      return 1;
    } else {
      return 0;
    }
  }
}
