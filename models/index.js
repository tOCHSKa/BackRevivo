const User = require('./User');
const Project = require('./Project');
const Photo = require('./Photo');
const Video = require('./Video');
const Generation = require('./Generation');
const Subscription = require('./Subscription');
const Payment = require('./Payment');
const Usage = require('./Usage');

// =======================
// USER RELATIONS
// =======================

User.hasMany(Project, { foreignKey: 'userId' });
Project.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Subscription, { foreignKey: 'userId' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Usage, { foreignKey: 'userId' });
Usage.belongsTo(User, { foreignKey: 'userId' });

// =======================
// PROJECT RELATIONS
// =======================

Project.hasMany(Photo, {
  foreignKey: 'projectId',
  as: 'photos'
});
Photo.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(Video, {
  foreignKey: 'projectId',
  as: 'videos'
});
Video.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(Generation, {
  foreignKey: 'projectId',
  as: 'generations'
});
Generation.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(Payment, {
  foreignKey: 'projectId',
  as: 'payments'
});
Payment.belongsTo(Project, { foreignKey: 'projectId' });

// =======================

module.exports = {
  User,
  Project,
  Photo,
  Video,
  Generation,
  Subscription,
  Payment,
  Usage,
};