const { Project, Photo } = require('../models');

exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: {
        userId: req.userId
      },
      include: [
        {
          model: Photo,
          as: 'photos'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(projects);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to fetch projects' });
  }
};