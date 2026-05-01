const { Payment } = require('../models');

exports.create = async (req, res) => {
  const payment = await Payment.create({
    userId: null,
    projectId: req.body.projectId,
    amount: 9,
    status: 'pending',
  });

  res.json(payment);
};