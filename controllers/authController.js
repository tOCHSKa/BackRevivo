const { User, Project } = require('../models');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const hash = await bcrypt.hash(password, 10);

    let sessionId = req.headers['x-session-id'];

    if (!sessionId) {
      sessionId = uuidv4();
    }

    const user = await User.create({
      email,
      password_hash: hash,
    });

    // récupérer projets anonymes
    await Project.update(
      { userId: user.id },
      { where: { session_id: sessionId } }
    );

    res.json({
      message: 'User created',
      userId: user.id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'register failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const sessionId = req.headers['x-session-id'];

    // 🔥 récupérer projets anonymes
    if (sessionId) {
      await Project.update(
        { userId: user.id },
        { where: { session_id: sessionId } }
      );
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'login failed' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'email', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to fetch user' });
  }
};