import {
  getVDWParameters,
  getPRparameters,
  getRKParameters,
  getRKSParameters,
} from './getEOSParameters.js';

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
    let parameters;

    switch (eos.lowerCase) {
      case 'vdw':
        parameters = getVDWParameters(molecularFluid);
        break;
      case 'pr':
        parameters = getPRparameters(molecularFluid, temperature);
        break;
      case 'rk':
        parameters = getRKParameters(molecularFluid, temperature);
        break;
      case 'rks':
        parameters = getRKSParameters(molecularFluid, temperature);
        break;
      default:
        throw new Error('Unkown EOS type');
    }

    this.a = parameters.a;
    this.b = parameters.b;
    this.S = parameters.s;
    this.k = parameters.k;
    this.u = parameters.u;
    this.w = parameters.w;
  }
}
