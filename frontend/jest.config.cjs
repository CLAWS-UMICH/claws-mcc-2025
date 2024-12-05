// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom', // Use jsdom environment
    transform: {
      "^.+\\.(ts|tsx)$": "babel-jest",
    },
  };