const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  titleSlug: String,
  solution: String,
  language: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default:[] }]
}, {
  timestamps: true
});


const Solution = mongoose.model('Solution', solutionSchema);

module.exports = Solution;
