class EOS {
  constructor(molecularFluid, options = {}) {
    let { temperature = 298, eos = 'pr' } = options;
    this.eos = eos;
    this.temperature = temperature;
    this.A = null;
    this.B = null;
    this.alpha = null;
    this.beta = null;
    this.gamma = null;
    this.p = null;
    this.q = null;
    this.Delta = null;
    this.relativeTemperature = temperature / molecularFluid.criticalTemperature;
  }
}
