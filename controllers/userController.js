const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
        .populate({ path: 'thoughts', select: '-__v' })
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
  },

  // Get a User
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
        .populate({ path: 'thoughts', select: '-__v' })
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
  },

  // Create a user
  createUser(req, res) {
    User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
  },

  // Delete a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : Thought.deleteMany({ _id: { $in: user.thoughts }})
        )
        .then(() => res.json({ message: 'User and thoughts are deleted!' }))
        .catch((err) => res.status(500).json(err));
  },

  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true })
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
  },

  // Add a friend
  addFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $push: { friends: req.params.friendId } }, { new: true })
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
  },

  // Delete a friend
  deleteFriend(req, res) {
    User.updateOne({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true })
        .then(() => res.json({ message: 'Friend has been deleted'}))
        .catch((err) => res.status(500).json(err));
  }
};
