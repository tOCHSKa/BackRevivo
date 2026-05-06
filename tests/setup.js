// __tests__/setup.js
const { Sequelize } = require('sequelize');

// Configuration base de données de test
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
});

// Mock des services externes
jest.mock('../services/aiService', () => ({
  generatePreview: jest.fn().mockResolvedValue({
    jobId: 'mock-job-123',
    status: 'processing',
    estimatedTime: 10,
  }),
  checkJobStatus: jest.fn().mockResolvedValue({
    status: 'completed',
    processed_url: 'https://mock-cloudinary.com/processed.jpg',
  }),
}));

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: 'https://mock-cloudinary.com/test-image.jpg',
        public_id: 'mock-public-id',
        width: 1920,
        height: 1080,
        format: 'jpg',
        bytes: 2048576,
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
  },
}));

// Variables globales de test
global.testSequelize = sequelize;
global.testUser = {
  id: 'test-user-uuid',
  email: 'test@example.com',
  password: 'hashedPassword123',
};

global.testSession = 'test-session-uuid';

beforeAll(async () => {
  // Synchroniser la DB de test
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

afterEach(() => {
  jest.clearAllMocks();
});