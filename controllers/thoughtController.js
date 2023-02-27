const { User, Thought, Reaction } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // Get a Thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { username: req.body.username },
                { $addToSet: {thoughts: thought._id} },
                { new: true }
            );
        })
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'Thought is created, but user ID is not found' })
            : res.json('Thought is successfully created')
        )
        .catch((err) => res.status(500).json(err));
  },

  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then(() => res.json({ message: 'Thought has been deleted!' }))
        .catch((err) => res.status(500).json(err));
  },

  // Update a user
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, { new: true })
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
  },

  // Add a reaction
  addReaction(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } }, { new: true })
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'Thought with this id is not found' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
  },

  // Delete a reaction
  deleteReaction(req, res) {
    console.log(req.params.thoughtId, req.params.reactionId)
    Thought.updateOne({ _id: req.params.thoughtId }, { $pull: { reactions: {_id: req.params.reactionId} } }, { new: true })
    .then(() => res.json({ message: 'Reaction has been deleted' }))
    .catch((err) => {res.status(500).json(err)});
  }
};