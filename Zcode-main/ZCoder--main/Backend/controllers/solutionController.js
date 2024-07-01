const Solution = require('../model/solution');

// const postSolution = async (req, res) => {
//   const { titleSlug, solution, language, userId } = req.body;
//   try {
//     const newSolution = new Solution({ userId, titleSlug, solution, language });
//     if (newSolution.solution) {
//       await newSolution.save();
//       res.status(201).json({ msg: 'Solution posted successfully' });
//     } else {
//       res.status(300).json({ msg: 'Nothing is posted' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const postSolution = async (req, res) => {
  const { userId, titleSlug, title, solution, language, username, topicTags} = req.body;
  try {
    if (!solution) {
      return res.status(400).json({ msg: 'Please enter a solution' });
    }
    const newSolution = new Solution({ userId, titleSlug, solution, language });
    await newSolution.save();
    res.status(201).json({ msg: 'Solution posted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getSolutionsByTitleSlug = async (req, res) => {
  const { titleSlug } = req.params;
  try {
    const solutions = await Solution.find({ titleSlug }).populate('userId');
    res.status(200).json(solutions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getUserSubmissions = async (req,res) =>{
  const {userId} = req.params;
  try {
    console.log(userId);
    const solutions = await Solution.find({ userId });
    console.log(solutions);
    res.status(200).json(solutions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { postSolution,getSolutionsByTitleSlug,getUserSubmissions };
