/**
 * fluid-properties - Calculate thermodynamic properties of molecular fluids
 * @version v0.1.1
 * @link https://github.com/cheminfo/fluid-properties#readme
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FluidProperties = {}));
}(this, (function (exports) { 'use strict';

  const R = 8.314e-5; // ideal gas constant

  function getVDWParameters(molecularFluid) {
    const parameters = {
      a: 0.421875 * R ** 2 * molecularFluid.criticalTemperature ** 2 / molecularFluid.criticalPressure,
      b: 0.125 * R * molecularFluid.tc / molecularFluid.pc,
      S: null,
      k: 1,
      u: 1,
      w: 0
    };
    return parameters;
  }
  function getRKParameters(molecularFluid, temperature) {
    const parameters = {
      a: 0.42748 * R ** 2 * molecularFluid.criticalTemperature ** 2 / molecularFluid.criticalPressure / Math.sqrt(temperature / molecularFluid.criticalTemperature),
      b: 0.08664 * R * molecularFluid.criticalTemperature / molecularFluid.criticalPressure,
      S: null,
      k: 1,
      u: 1,
      w: 0
    };
    return parameters;
  }
  function getRKSParameters(molecularFluid, temperature) {
    const s = 0.48 + 1.574 * molecularFluid.accentricFactor - 0.176 * molecularFluid.accentricFactor ** 2;
    const parameters = {
      a: 0.42748 * R ** 2 * molecularFluid.criticalTemperature ** 2 / molecularFluid.criticalPressure,
      b: 0.08664 * R * molecularFluid.criticalTemperature / molecularFluid.criticalPressure,
      S: s,
      k: (1 + s * (1 - Math.sqrt(temperature / molecularFluid.criticalTemperature))) ** 2,
      u: 1,
      w: 0
    };
    return parameters;
  }
  function getPRParameters(molecularFluid, temperature) {
    const s = 0.37464 + 1.54226 * molecularFluid.accentricFactor - 0.26992 * molecularFluid.accentricFactor ** 2;
    const parameters = {
      a: 0.45724 * R ** 2 * molecularFluid.criticalTemperature ** 2 / molecularFluid.criticalPressure,
      b: 0.0778 * R * molecularFluid.criticalTemperature / molecularFluid.criticalPressure,
      S: s,
      k: (1 + s * (1 - Math.sqrt(temperature / molecularFluid.criticalTemperature))) ** 2,
      u: 2,
      w: -1
    };
    return parameters;
  }

  /**
   * Stores the parametrization of EOS
   *
   * @export
   * @class EOSParameters
   */

  class EOSParameters {
    /**
     *Creates an instance of EOSParameters.
     * @param {MolecularFluid} molecularFluid instance of the MolecularFluid class
     * @param {Object} [options={}]
     * @param {Number} options.temperature temperature in K. Defaults to 298.
     * @param {String} options.eos Type of the equation of states (EOS). Available options: pr (Peng-Robinson), vdw (Van der Waals), rk (Redlich–Kwong), rks (Redlich–Kwong-Soave). Defaults to pr.
     * @memberof EOSParameters
     */
    constructor(molecularFluid, options = {}) {
      let {
        temperature = 298,
        eos = 'pr'
      } = options;
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

      switch (eos) {
        case 'vdw':
          parameters = getVDWParameters(molecularFluid);
          break;

        case 'pr':
          parameters = getPRParameters(molecularFluid, temperature);
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
      this.S = parameters.S;
      this.k = parameters.k;
      this.u = parameters.u;
      this.w = parameters.w;
    }

  }

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
  /**
   * Comparing an array of fugacities to find out in which
   * state the system is
   * @export
   * @param {Array<number>} phis An array of fugacities
   * @returns {Number} Index of the state the system is in
   */

  function getPhasefromPhi(phis) {
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

  /**
   * Based on a MolecularFluid, temperature, and pressure or volume and
   * the choice of equation of state (EOS) return the thermodynamic properties
   * of the system
   *
   * @export
   * @param {MolecularFluid} molecularFluid instance of the MolecularFluid class
   * @param {Number} temperature in Kelvin
   * @param {Object} [options={}]
   * @param {Number} options.pressure in bar
   * @param {Number} options.volume in L
   * @param {String} otpions.eos Type of the equation of states (EOS). Available options: pr (Peng-Robinson), vdw (Van der Waals), rk (Redlich–Kwong), rks (Redlich–Kwong-Soave). Defaults to pr.
   * @returns {Object}
   */

  function getProperties(molecularFluid, temperature, options = {}) {
    let {
      pressure = 1,
      volume = null,
      eos = 'pr'
    } = options;
    validateInput(pressure, volume);
    let eosParameters = new EOSParameters(molecularFluid, temperature, {
      eos: eos
    });
    eosParameters.relativeTemperature = temperature / molecularFluid.criticalTemperature;

    if (Number.isFinite(volume) & !Number.isFinite(pressure)) {
      pressure = getPressure(eosParameters, temperature, volume);
    }

    updateEOSParameters(eosParameters, pressure, temperature);
    let zList = solveZ(eosParameters);
    let phaseProperties = getThermodynamicProperties(zList, eosParameters, eos, molecularFluid, pressure, temperature);
    let phis = [];
    phaseProperties.forEach(properties => {
      phis.push(properties.fugacityCoefficient);
    });
    return {
      temperature: temperature,
      pressure: pressure,
      phaseProperties: phaseProperties,
      zList: zList,
      inPhase: getPhasefromPhi(phis)
    };
  }

  function validateInput(volume, pressure) {
    if (Number.isFinite(volume) & Number.isFinite(pressure)) {
      throw new Error('You need to specify pressure OR volume, not both!');
    }

    if (!Number.isFinite(volume) & !Number.isFinite(pressure)) {
      throw new Error('You need to specify pressure or volume!');
    }
  }

  function getPressure(eosParameters, temperature, volume) {
    return R * temperature / (volume - eosParameters.b) - eosParameters.a / (volume ** 2 + eosParameters.u * eosParameters.b * volume + eosParameters.w * eosParameters.b ** 2);
  }

  function updateEOSParameters(eosParameters, pressure, temperature) {
    eosParameters.A = eosParameters.a * eosParameters.k * pressure / R ** 2 / temperature ** 2;
    eosParameters.B = eosParameters.b * pressure / R / temperature;
    eosParameters.alpha = -1 - eosParameters.B + eosParameters.u * eosParameters.B;
    eosParameters.beta = eosParameters.A + eosParameters.w * eosParameters.B ** 2 - eosParameters.u * eosParameters.B - eosParameters.u * eosParameters.B ** 2;
    eosParameters.gamma = -eosParameters.A * eosParameters.B - eosParameters.w * eosParameters.B ** 2 - eosParameters.w * eosParameters.B ** 3;
    eosParameters.p = eosParameters.beta - eosParameters.alpha ** 2 / 3;
    eosParameters.q = 2 * eosParameters.alpha ** 3 / 27 - eosParameters.alpha * eosParameters.beta / 3 + eosParameters.gamma;
    eosParameters.Delta = eosParameters.q ** 2 / 4 + eosParameters.p ** 3 / 27;
  }
  /**
   *Some background here https://pubs.acs.org/doi/pdf/10.1021/ie2023004
   *
   */


  function solveZ(eosParameters) {
    // Cardano solution formula
    let zList = [];

    if (eosParameters.Delta > 0) {
      zList = solveCardano(eosParameters);
    } else {
      zList = solveTrigonometric(eosParameters);
    }

    return zList;
  }

  function solveCardano(eosParameters) {
    let xSol;
    let zList = [];
    xSol = Math.cbrt(-eosParameters.q / 2 + Math.sqrt(eosParameters.Delta)) + Math.cbrt(-eosParameters.q / 2 - Math.sqrt(eosParameters.Delta));
    zList = [xSol - eosParameters.alpha / 3];
    return zList;
  }

  function solveTrigonometric(eosParameters) {
    let xSol;
    let zList = [];
    let subeq = Math.acos(3 * eosParameters.q / 2 / eosParameters.p * Math.sqrt(-3 / eosParameters.p));

    for (let offset = 0; offset < 3; offset++) {
      xSol = 2 * Math.sqrt(-eosParameters.p / 3) * Math.cos(subeq / 3 - 2 * Math.PI * offset / 3);
      zList.push(xSol - eosParameters.alpha / 3);
    }

    zList.sort(); // [ z_liq, z_meaningless, z_vap ]
    //remove the meaningless value

    zList.splice(1, 1);
    return zList;
  }

  function getThermodynamicProperties(zList, eosParameters, eos, molecularFluid, pressure, temperature) {
    let phaseProperties = [];

    switch (eos) {
      case 'pr':
        zList.forEach(z => {
          phaseProperties.push(getThermodynamicPropertiesPR(z, eosParameters, molecularFluid, pressure, temperature));
        });
        break;

      default:
        throw new Error('Only supported EOS are VDW and PR.');
    }

    return phaseProperties;
  }

  function getThermodynamicPropertiesPR(z, eosParameters, molecularFluid, pressure, temperature) {
    const ecap = eosParameters.S * Math.sqrt(eosParameters.relativeTemperature / eosParameters.k);
    const subeq1 = eosParameters.A / 2 / Math.sqrt(2) / eosParameters.B;
    const subeq2 = Math.log((z + eosParameters.B * (1 + Math.sqrt(2))) / (z + eosParameters.B * (1 - Math.sqrt(2))));
    const residualEnthalpy = z - 1 - subeq1 * (1 + ecap) * subeq2;
    const residualEntropy = Math.log(z - eosParameters.B) - subeq1 * ecap * subeq2;
    const {
      gibbs,
      fugacityCoefficient
    } = computeGibbsFugacity(residualEnthalpy, residualEntropy);
    const molarDensity = computeMolarDensity(pressure, temperature, z);
    return {
      fugacityCoefficient: fugacityCoefficient,
      fugacity: fugacityCoefficient * pressure,
      residualEnthalpy: residualEnthalpy,
      residualEntropy: residualEntropy,
      residualGibbsEnergy: gibbs,
      compressibilityFactor: z,
      molarDensity: molarDensity,
      density: computeDensity(molarDensity, molecularFluid)
    };
  }

  function computeGibbsFugacity(enthalpy, entropy) {
    const gibbs = enthalpy - entropy;
    const fugacityCoefficient = Math.exp(gibbs);
    return {
      gibbs,
      fugacityCoefficient
    };
  }

  function computeMolarDensity(pressure, temperature, compressibilityFactor) {
    return pressure / (R * 1000 * temperature * compressibilityFactor);
  }

  function computeDensity(molarDensity, molecularFluid) {
    return molarDensity * molecularFluid.molarMass / 1000;
  }

  var moleculeProperties = [{
    name: 'methane',
    formula: 'CH4',
    criticalTemperature: 190.56,
    criticalPressure: 45.99,
    accentricFactor: 0.012,
    molarMass: 16.042504,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: 'ethane',
    formula: 'C2H6',
    criticalTemperature: 305.32,
    criticalPressure: 48.72,
    accentricFactor: 0.1,
    molarMass: 30.069126,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: 'propane',
    formula: 'C3H8',
    criticalTemperature: 369.83,
    criticalPressure: 42.48,
    accentricFactor: 0.369,
    molarMass: 44.095748,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: 'butane',
    formula: 'C4H',
    criticalTemperature: 425.12,
    criticalPressure: 37.96,
    accentricFactor: 0.2,
    molarMass: 49.050901,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: '1-hexene',
    formula: 'C6H12',
    criticalTemperature: 504.0,
    criticalPressure: 32.1,
    accentricFactor: 0.28600000000000003,
    molarMass: 84.159732,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: 'hexane',
    formula: 'C6H14',
    criticalTemperature: 507.6,
    criticalPressure: 30.25,
    accentricFactor: 0.301,
    molarMass: 86.17561400000001,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: 'n-octane',
    formula: 'C8H18',
    criticalTemperature: 569.4,
    criticalPressure: 24.97,
    accentricFactor: 0.39799999999999996,
    molarMass: 114.228858,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: 'water',
    formula: 'H2O',
    criticalTemperature: 647.13,
    criticalPressure: 220.55,
    accentricFactor: 0.3449,
    molarMass: 18.015287,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: 'nitrogen',
    formula: 'N2',
    criticalTemperature: 126.2,
    criticalPressure: 34.6,
    accentricFactor: 0.0377,
    molarMass: 28.013406,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: 'helium',
    formula: 'He',
    criticalTemperature: 5.2,
    criticalPressure: 2.28,
    accentricFactor: 0.0,
    molarMass: 4.002602,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: 'neon',
    formula: 'Ne',
    criticalTemperature: 44.4,
    criticalPressure: 26.53,
    accentricFactor: 0.0,
    molarMass: 20.1797,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: 'argon',
    formula: 'Ar',
    criticalTemperature: 150.86,
    criticalPressure: 48.98,
    accentricFactor: 0.0,
    molarMass: 39.948,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: 'krypton',
    formula: 'Kr',
    criticalTemperature: 209.35,
    criticalPressure: 55.02,
    accentricFactor: 0.0,
    molarMass: 83.798,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: 'xenon',
    formula: 'Xe',
    criticalTemperature: 289.74,
    criticalPressure: 58.4,
    accentricFactor: 0.0,
    molarMass: 131.293,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }, {
    name: 'radon',
    formula: 'Rn',
    criticalTemperature: 377.0,
    criticalPressure: 62.8,
    accentricFactor: 0.0,
    molarMass: 222.0176,
    reference: {
      citation: 'Yaws, Carl L. Thermophysical Properties of Chemicals and Hydrocarbons. 2nd ed. Austin, TX: Gulf Publishing Company, 2014. Print.',
      isbn: '978-0-323-28659-6'
    }
  }];

  function handleError(thisMol) {
    if (thisMol.length === 1) {
      return thisMol[0];
    } else if (thisMol.length === 0) {
      throw new Error('No match with database.');
    } else {
      throw new Error('Result not unique!');
    }
  }

  function molecularFluidFromFormula(molFormula) {
    let thisMol = moleculeProperties.filter(dict => {
      return dict.formula === molFormula;
    });
    thisMol = handleError(thisMol);
    return new MolecularFluid(thisMol.molarMass, thisMol.criticalTemperature, thisMol.criticalPressure, thisMol.accentricFactor);
  }

  function molecularFluidFromName(molName) {
    let thisMol = moleculeProperties.filter(dict => {
      return dict.name === molName;
    });
    thisMol = handleError(thisMol);
    return new MolecularFluid(thisMol.molarMass, thisMol.criticalTemperature, thisMol.criticalPressure, thisMol.accentricFactor);
  }

  /**
   * This class stores properties of molecules
   *
   * @export
   * @class MolecularFluid
   */

  class MolecularFluid {
    /**
     *Creates an instance of MolecularFluid.
     * @param {Number} molarMass in g/mol
     * @param {Number} criticalTemperature in K
     * @param {Number} criticalPressure in bar
     * @param {Number} accentricFactor
     * @memberof MolecularFluid
     */
    constructor(molarMass, criticalTemperature, criticalPressure, accentricFactor) {
      this.molarMass = molarMass;
      this.criticalTemperature = criticalTemperature;
      this.criticalPressure = criticalPressure;
      this.accentricFactor = accentricFactor;
    }

  }
  MolecularFluid.fromName = molecularFluidFromName;
  MolecularFluid.fromFormula = molecularFluidFromFormula;

  exports.EOSParameters = EOSParameters;
  exports.MolecularFluid = MolecularFluid;
  exports.getProperties = getProperties;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=fluid-properties.js.map
