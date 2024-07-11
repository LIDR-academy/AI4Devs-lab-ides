module.exports = {
  roots: ['<rootDir>/src/tests/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(svg)$': '<rootDir>/src/tests/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy' // Si también necesitas mockear estilos
  },
  testEnvironment: 'jsdom', // Add this line
};