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
    res.render('images', { photos: photos.map(kitten => kitten.toJSON())});
});

router.get('/images/add', async (req,res) => {
    console.log('get images addd');
    const photos = await Photo.find();
    res.render('image_form', { photos: photos.map(kitten => kitten.toJSON())});
});
router.post('/images/add', async (req,res) =>{
    const {title, description} = req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path); // Async 
    const newPhoto = new Photo({
        title,
        description,
        imageUrl: result.url,
        public_id: result.public_id
    }) 
    await newPhoto.save();
    await fs.unlink(req.file.path); //erase the file from the server

    res.redirect('/images/add');
})
router.get('/images/delete/:photo_id', async(req,res) => {
    const {photo_id} = req.params;
    const photo = await Photo.findByIdAndDelete(photo_id);
    cloudinary.v2.uploader.destroy(photo.public_id);
    res.redirect('/images/add');
})

module.exports = router;