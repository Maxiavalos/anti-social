const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath
});

// SIN pasar DataTypes a los modelos
const User = require('./user')(sequelize);
const Post = require('./post')(sequelize);
const Comment = require('./comment')(sequelize);
const Tag = require('./tag')(sequelize);
const PostTag = require('./postTag')(sequelize);
const PostImage = require('./postImage')(sequelize);
const Like = require('./like')(sequelize);

User.hasMany(Post);
Post.belongsTo(User);
User.hasMany(Like);
Post.hasMany(Like);
Like.belongsTo(User);
Like.belongsTo(Post);

Post.hasMany(Comment);
Comment.belongsTo(Post);
Comment.belongsTo(User);

Post.belongsToMany(Tag, { through: PostTag });
Tag.belongsToMany(Post, { through: PostTag });

Post.hasMany(PostImage);
PostImage.belongsTo(Post);

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Tag,
  PostTag,
  PostImage,
  Like
};