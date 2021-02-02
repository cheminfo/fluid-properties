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

export function getPhasefromPhi(phi) {
  if (phi.length === 1) {
    return 0;
  } else {
    if (phi[1] < phi[0]) {
      return 1;
    } else {
      return 0;
    }
  }
}
