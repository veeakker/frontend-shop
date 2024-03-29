'use strict';

let browsers = [
  'last 1 Chrome versions',
  'last 1 Firefox versions',
  'last 1 Safari versions'
];

const isCI = !!process.env.CI;
const isProduction = process.env.EMBER_ENV === 'production';

if (isCI || isProduction) {
  browsers = [
    'last 4 Chrome versions',
    'last 4 Firefox versions',
    'last 3 Safari versions'
  ];
}

module.exports = {
  browsers,
};
