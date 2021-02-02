function getVDWParameters(molecularFluid, temperature) {
  const parameters = {
    a:
      (0.421875 * R ** 2 * molecularFluid.criticalTemperature ** 2) /
      molecularFluid.criticalPressure,
    b: (0.125 * R * molecularFluid.tc) / molecularFluid.pc,
    S: null,
    k: 1,
    u: 1,
    w: 0,
  };
  return parameters;
}
