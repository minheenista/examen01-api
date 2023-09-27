const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//srchivo JSON con los datos
const comentarios = require('./coments.json');

//mostrar todos los comentarios
app.get('/posts/all/comentarios', (req, res) => {
    if (comentarios.data.length > 0) {
        res.status(200).json({
            estado: 1,
            mensaje: 'Comentarios encontrados',
            comentarios: comentarios.data,
        })
    } else {
        res.status(404).json({
            estado: 0,
            mensaje: 'No se encontraron comentarios',
        })
    }
});

//mostrar un comentario por id
app.get('/posts/all/comentarios/:id', (req, res) => {
    const id = req.params.id;
    const comentario = comentarios.data.find(comentario => comentario.id == id);

    if (comentario) {
        res.status(200).json({
            estado: 1,
            mensaje: 'Comentario encontrado',
            comentario: comentario,
        })
    } else {
        res.status(404).json({
            estado: 0,
            mensaje: 'Comentario no encontrado',
        })
    }
})

//mostrar comentarios por post
app.get('/posts/:idPost/comentarios/', (req, res) => {
    const idPost = req.params.idPost;
    const comentariosPost = comentarios.data.filter(comentario => comentario.postId == idPost);
    const post = comentarios.data.find(post => post.postId == idPost);

    if (post) {
        if (comentariosPost.length > 0) {
            res.status(200).json({
                estado: 1,
                mensaje: 'Comentarios encontrados',
                comentarios: comentariosPost,
            })
        } else {
            res.status(404).json({
                estado: 0,
                mensaje: 'No se encontraron comentarios',
            })
        }
    } else {
        res.status(404).json({
            estado: 0,
            mensaje: 'Post no encontrado',
        })
    }


})

//mostrar comentarios por usuario
app.get('/posts/usuarios/:idUser/comentarios/', (req, res) => {
    const idUser = req.params.idUser;
    const comentariosUser = comentarios.data.filter(comentario => comentario.userId == idUser);
    const user = comentarios.data.find(user => user.userId == idUser);

    if (user) {
        if (comentariosUser.length > 0) {
            res.status(200).json({
                estado: 1,
                mensaje: 'Comentarios encontrados',
                comentarios: comentariosUser,
            })
        } else {
            res.status(404).json({
                estado: 0,
                mensaje: 'No se encontraron comentarios',
            })
        }
    } else {
        res.status(404).json({
            estado: 0,
            mensaje: 'Usuario no encontrado',
        })
    }


})

//crear un comentario
app.post('/posts/all/comentarios', (req, res) => {
    const { postId, userId, text } = req.body;

    if (postId == undefined || userId == undefined || text == undefined) {
        res.status(400).json({
            estado: 0,
            mensaje: 'Rellena todos los campos',
        });
    } else {
        // Generar un nuevo id
        const id = comentarios.data.length + 1;

        const comentario = {
            id: id,
            postId: postId,
            userId: userId,
            text: text,
        };

        comentarios.data.push(comentario);

        if (comentarios.data.length > id - 1) {
            res.status(201).json({
                estado: 1,
                mensaje: 'Comentario creado',
                data: comentario,
            });
        } else {
            res.status(500).json({
                estado: 0,
                mensaje: 'Error de servidor, no se pudo crear el comentario',
            });
        }
    }
});


//actualizar un comentario
app.put('/posts/all/comentarios/:id', (req, res) => {
    const id = req.params.id;
    const { postId, userId, text } = req.body;

    if (postId == undefined || userId == undefined || text == undefined) {
        res.status(400).json({
            estado: 0,
            mensaje: 'Rellena todos los campos',
        })
    } else {
        const comentario = comentarios.data.findIndex(comentario => comentario.id == id);
        if (comentario) {
            comentarios.data[comentario].postId = postId;
            comentarios.data[comentario].userId = userId;
            comentarios.data[comentario].text = text;
            res.status(200).json({
                estado: 1,
                mensaje: 'Comentario editado correctamente',
                comentario: comentarios.data[comentario],
            })
        } else {
            res.status(404).json({
                estado: 0,
                mensaje: 'Comentario a editar no encontrado',
            })
        }
    }

})


//eliminar un comentario
app.delete('/posts/all/comentarios/:id', (req, res) => {
    const id = req.params.id;

    const comentarioIndex = comentarios.data.findIndex(comentario => comentario.id == id);

    if (comentarioIndex >= 0) {
        comentarios.data.splice(comentarioIndex, 1);
        res.status(200).json({
            estado: 1,
            mensaje: 'Comentario eliminado correctamente',
        })
    } else {
        res.status(404).json({
            estado: 0,
            mensaje: 'Comentario a eliminar no encontrado',
        })
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});