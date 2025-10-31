const { sequelize, User, Post, Comment, Tag, PostImage } = require('./models');

async function seed() {
  await sequelize.sync({ force: true });

  const user1 = await User.create({ nickName: 'luna', email: 'luna@example.com' });
  const user2 = await User.create({ nickName: 'sol', email: 'sol@example.com' });

  const tag1 = await Tag.create({ name: 'arte' });
  const tag2 = await Tag.create({ name: 'unahur' });

  const post1 = await Post.create({ description: 'Mi primer post', UserId: user1.id });
  const post2 = await Post.create({ description: 'Reflexiones nocturnas', UserId: user2.id });

  await post1.setTags([tag1, tag2]);
  await post2.setTags([tag1]);

  await Comment.create({ content: 'Muy bueno!', UserId: user2.id, PostId: post1.id });
  await Comment.create({ content: 'Gracias por compartir', UserId: user1.id, PostId: post2.id });

  await PostImage.bulkCreate([
    {
      url: 'https://placeholder.pics/svg/300x400/DEDEDE/555555/Imagen%201',
      PostId: post1.id
    },
    {
      url: 'https://placeholder.pics/svg/300x400/DEDEDE/555555/Imagen%202',
      PostId: post1.id
    },
    {
      url: 'https://placeholder.pics/svg/300x400/DEDEDE/555555/Imagen%203',
      PostId: post2.id
    }
  ]);

  console.log('Base de datos poblada!');
  process.exit();
}

seed();
