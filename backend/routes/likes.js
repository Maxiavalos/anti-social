const express = require('express');
const router = express.Router();
const { Like, sequelize } = require('../models');


router.post('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const { userId } = req.body;

        console.log('Toggle like - postId:', postId, 'userId:', userId);

        if (!userId) {
            return res.status(400).json({ error: 'userId es requerido' });
        }

        const postIdNum = parseInt(postId);
        const userIdNum = parseInt(userId);
        
        if (isNaN(postIdNum) || isNaN(userIdNum)) {
            return res.status(400).json({ error: 'postId y userId deben ser números válidos' });
        }

        console.log('Buscando like existente...');
        
       
        const existeLike = await Like.findOne({
            where: sequelize.literal(`"UserId" = ${userIdNum} AND "PostId" = ${postIdNum}`)
        });

        console.log('Like existente encontrado:', existeLike ? 'Sí' : 'No');

        if (existeLike) {
            console.log('Eliminando like...');
            await existeLike.destroy();
            console.log('Like eliminado exitosamente');
            res.json({ liked: false });
        } else {
            console.log('Creando nuevo like...');
            
            const nuevoLike = Like.build({
                UserId: userIdNum,
                PostId: postIdNum
            });
            
            await nuevoLike.save();
            console.log('Like creado exitosamente. ID:', nuevoLike.id);
            res.json({ liked: true }); 
        }
        
    } catch (error) {
        console.error('Error en like:', error);
        console.error('Error details:', error.errors);
        res.status(500).json({ 
            error: 'Error al procesar el like',
            details: error.message 
        });
    }
});


router.get('/posts/:postId/count', async (req, res) => {
    try {
        const { postId } = req.params;
        
        console.log('Contando likes para post:', postId);

        const postIdNum = parseInt(postId);
        if (isNaN(postIdNum)) {
            return res.status(400).json({ error: 'postId debe ser un número válido' });
        }

        
        const likeCount = await Like.count({
            where: sequelize.literal(`"PostId" = ${postIdNum}`)
        });

        console.log('Like count encontrado:', likeCount);
        res.json({ likeCount });
    } catch (error) {
        console.error('Error contando likes:', error);
        res.status(500).json({ error: 'Error al obtener likes' });
    }
});


router.get('/posts/:postId/check', async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.query; 

        console.log('Verificando like - postId:', postId, 'userId:', userId);

        if (!userId) {
            return res.status(400).json({ error: 'userId es requerido' });
        }

        const postIdNum = parseInt(postId);
        const userIdNum = parseInt(userId);
        
        if (isNaN(postIdNum) || isNaN(userIdNum)) {
            return res.status(400).json({ error: 'postId y userId deben ser números válidos' });
        }

        
        const userLike = await Like.findOne({
            where: sequelize.literal(`"UserId" = ${userIdNum} AND "PostId" = ${postIdNum}`)
        });

        console.log('Like encontrado en check:', userLike ? 'Sí' : 'No');
        res.json({ liked: !!userLike });
    } catch (error) {
        console.error('Error verificando like:', error);
        res.status(500).json({ error: 'Error al verificar like' });
    }
});

router.get('/debug/tabla', async (req, res) => {
    try {
        const [results] = await sequelize.query(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='Likes'
        `);
        
        if (results.length === 0) {
            return res.json({ error: 'La tabla Likes no existe' });
        }

        const [columns] = await sequelize.query('PRAGMA table_info(Likes)');
        const [data] = await sequelize.query('SELECT * FROM Likes');
        
        res.json({
            tablaExiste: true,
            columnas: columns,
            datos: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;