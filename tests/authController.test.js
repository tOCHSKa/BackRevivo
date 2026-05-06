// __tests__/controllers/authController.test.js
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const User = require('../models/User');
const Project = require('../models/Project');

// Mock des modèles
jest.mock('../models/User');
jest.mock('../models/Project');

const app = express();
app.use(express.json());
app.post('/register', authController.register);
app.post('/login', authController.login);
app.get('/me', authController.authenticate, authController.getMe);

describe('Auth Controller Tests', () => {
  describe('POST /register - Inscription utilisateur', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('Devrait créer un utilisateur avec succès', async () => {
      const mockUser = {
        id: 'user-uuid-123',
        email: 'newuser@test.com',
        password: await bcrypt.hash('Password123!', 10),
        toJSON: function() {
          return { id: this.id, email: this.email };
        },
      };

      User.findOne.mockResolvedValue(null); // Email n'existe pas
      User.create.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/register')
        .send({
          email: 'newuser@test.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('newuser@test.com');
      expect(User.create).toHaveBeenCalledWith({
        email: 'newuser@test.com',
        password: expect.any(String),
      });
    });

    test('Devrait rejeter si email déjà existant', async () => {
      User.findOne.mockResolvedValue({ email: 'existing@test.com' });

      const response = await request(app)
        .post('/register')
        .send({
          email: 'existing@test.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('existe déjà');
    });

    test('Devrait rejeter si email invalide', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('Devrait rejeter si mot de passe trop court', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          email: 'test@test.com',
          password: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('mot de passe');
    });
  });

  describe('POST /login - Connexion utilisateur', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('Devrait connecter un utilisateur valide', async () => {
      const password = 'Password123!';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const mockUser = {
        id: 'user-uuid-456',
        email: 'valid@test.com',
        password: hashedPassword,
        toJSON: function() {
          return { id: this.id, email: this.email };
        },
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/login')
        .send({
          email: 'valid@test.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('valid@test.com');
    });

    test('Devrait migrer les projets invités lors du login', async () => {
      const password = 'Password123!';
      const hashedPassword = await bcrypt.hash(password, 10);
      const sessionId = 'guest-session-uuid';
      
      const mockUser = {
        id: 'user-uuid-789',
        email: 'migrating@test.com',
        password: hashedPassword,
        toJSON: function() {
          return { id: this.id, email: this.email };
        },
      };

      User.findOne.mockResolvedValue(mockUser);
      Project.update.mockResolvedValue([3]); // 3 projets migrés

      const response = await request(app)
        .post('/login')
        .set('x-session-id', sessionId)
        .send({
          email: 'migrating@test.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('migratedProjects');
      expect(Project.update).toHaveBeenCalledWith(
        { userId: mockUser.id },
        { where: { session_id: sessionId } }
      );
    });

    test('Devrait rejeter avec mauvais mot de passe', async () => {
      const hashedPassword = await bcrypt.hash('GoodPassword123!', 10);
      
      const mockUser = {
        id: 'user-uuid-999',
        email: 'test@test.com',
        password: hashedPassword,
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@test.com',
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Identifiants invalides');
    });

    test('Devrait rejeter si utilisateur non trouvé', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Identifiants invalides');
    });
  });

  describe('GET /me - Profil utilisateur', () => {
    test('Devrait retourner le profil avec token valide', async () => {
      const mockUser = {
        id: 'user-uuid-profile',
        email: 'profile@test.com',
        created_at: new Date(),
      };

      User.findByPk.mockResolvedValue(mockUser);

      const token = jwt.sign({ userId: mockUser.id }, process.env.JWT_SECRET || 'test-secret');

      const response = await request(app)
        .get('/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('email', 'profile@test.com');
    });

    test('Devrait rejeter sans token', async () => {
      const response = await request(app).get('/me');

      expect(response.status).toBe(401);
    });

    test('Devrait rejeter avec token invalide', async () => {
      const response = await request(app)
        .get('/me')
        .set('Authorization', 'Bearer invalid-token-xyz');

      expect(response.status).toBe(401);
    });
  });
});