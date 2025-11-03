const express = require('express');
const router = express.Router();
const {Like} = require('../models');


router.post('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.id
        const {userId} = req.body

        const existeLike = await Like.findOne({
            where: {userId, postId}
        })

        if (existeLike){
            await existeLike.destroy()
            res.json({like:true})
        } else{
            await Like.create({userId, postId})
            res.json({like:true})
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el like' });
    }
});

router.get('/posts/:postId/count', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const likeCount = await Like.count({
      where: { postId }
    });

    res.json({likeCount});
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener likes' });
  }
});

router.get('/posts/:postId/check', async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.query;

        const userLike = await Like.findOne({
            where: { userId, postId }
        });

        res.json({ liked: !!userLike });
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar like' });
    }
});

module.exports = router;