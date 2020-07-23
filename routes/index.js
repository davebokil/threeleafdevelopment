var express = require('express');
var router = express.Router();
require('dotenv').config()

var Cosmic = require('cosmicjs')
var api = Cosmic()
var bucket = api.bucket({
    slug: process.env.SLUG,
    read_key: process.env.READ_KEY
})

// Get Homepage
router.get('/',async (req, res) =>  {
    try {
        const portfolio = await bucket.getObjects({
          type: 'portfolio',
          metadata: {
            featured: 'Yes'
          }
        })
        // res.json({ 'portfolio': portfolio})
        res.render('index', { 'portfolio': portfolio.objects, 'title': 'Home'});
    }
    catch (err) {
        res.render('error', { title: '404: Error' });
    }
});

router.get('/about',async (req, res) =>  {
    try {
        res.render('about', {title: 'About Us'});
    }
    catch (err) {
        res.render('error', { title: '404: Error' });
    }
});

router.get('/portfolio',async (req, res) =>  {
    try {
        const portfolio = await bucket.getObjects({
          type: 'portfolio',
          sort: 'order'
        })
        const tags = await bucket.getObjects({
          type: 'tags',
        })
        // res.json({ 'portfolio': portfolio})
        console.log(tags)
        res.render('portfolio', { 'portfolio': portfolio.objects, 'tags': tags.objects, 'title': 'Portfolio'});
    }
    catch (err) {
        res.render('error', { title: '404: Error' });
    }
});

router.get('/portfolio/:slug',async (req, res) =>  {
    try {
        const portfolio = await bucket.getObject({
            type: 'portfolio',
            slug: req.params.slug
        })
        res.render('portfolio-single', {'portfolio': portfolio.object, 'title': portfolio.object.title});
        // res.json({ 'portfolio': portfolio.object})
    }
    catch (err) {
        res.render('error', { title: '404: Error' });
    }
});

router.get('/services',async (req, res) =>  {
    try {
        res.render('coming', {title: 'Coming Soon'});
    }
    catch (err) {
        res.render('error', { title: '404: Error' });
    }
})

router.get('/contact',async (req, res) =>  {
    try {
        res.render('contact', {title: 'Contact Us'});
    }
    catch (err) {
        res.render('error', { title: '404: Error' });
    }
})


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;