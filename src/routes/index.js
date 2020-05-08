const { Router } = require('express');
const router = Router();

const Photo = require('../models/Photo');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const fs = require('fs-extra');

router.get('/', async (req,res) => {
    const photos = await Photo.find();
    console.log(photos);
    res.render('images', {photos});
});

router.get('/images/add', (req,res) => {
    res.render('image_form');
});
router.post('/images/add', async (req,res) =>{
    const {title, description} = req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path); // Async 
    console.log(result);
    const newPhoto = new Photo({
        title,
        description,
        imageUrl: result.url,
        public_id: result.public_id
    }) 
    await newPhoto.save();
    await fs.unlink(req.file.path); //erase the file from the server

    res.send('recived');
})
module.exports = router;