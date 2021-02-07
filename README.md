# fluid-properties

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Calculate thermodynamic properties of molecular fluids. Translation of [Daniele Ongari's package](https://github.com/danieleongari/mol-tdn)

## Installation

`$ npm i fluid-properties`

## Usage

```js
import { MolecularFluid, getProperties } from 'fluid-properties';

MolecularFluid.fromName('methane');
const res = getProperties(methane, 290, { pressure: 100 });

//    {
//         temperature: 290,
//         pressure: 100,
//         phaseProperties: [
//           {
//             fugacityCoefficient: 0.8071942852537269,
//             fugacity: 80.71942852537269,
//             residualEnthalpy: -0.7670409991968398,
//             residualEntropy: -0.5528501095136379,
//             residualGibbsEnergy: -0.21419088968320188,
//             compressibilityFactor: 0.8168115913954548,
//             molarDensity: 5.077735676091721,
//             density: 0.08145959489464415
//           }
//         ],
//         zList: [ 0.8168115913954548 ],
//         inPhase: 0
//       }
```

## [API Documentation](https://cheminfo.github.io/fluid-properties/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/fluid-properties.svg
[npm-url]: https://www.npmjs.com/package/fluid-properties
[ci-image]: https://github.com/cheminfo/fluid-properties/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/fluid-properties/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/fluid-properties.svg
[codecov-url]: https://codecov.io/gh/cheminfo/fluid-properties
[download-image]: https://img.shields.io/npm/dm/fluid-properties.svg
[download-url]: https://www.npmjs.com/package/fluid-properties
