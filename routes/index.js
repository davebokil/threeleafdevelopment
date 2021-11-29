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
        const news = await bucket.getObjects({
          type: 'news',
        })
        const description = await bucket.getObject({
          slug: 'seo-home-page'
        })
        const introtext = await bucket.getObject ({
            slug: 'intro-text'
        })
        // res.json({ 'introtext': introtext})
        res.render('index', { 'introtext': introtext.object, 'portfolio': portfolio.objects, 'news': news.objects, title: 'Home', 'description': description.object.metadata.seo});
    }
    catch (err) {
        res.render('error', { title: '404: Error' });
    }
});

router.get('/about',async (req, res) =>  {
    try {
        const header = await bucket.getObject({
          slug: 'about-header-image'
        })
        const news = await bucket.getObjects({
          type: 'news',
        })
        const description = await bucket.getObject({
          slug: 'seo-about-page'
        })
        // res.json({ 'about': about.objects[0].metafields[0].url,})
        res.render('about', { 'header': header.object.metafields[0].url, 'news': news.objects, title: 'About Us', 'description': description.object.metadata.seo});
    }
    catch (err) {
        res.render('error', { title: '404: Error' });
    }
});

router.get('/leasings',async (req, res) =>  {
    try {
        const header = await bucket.getMedia({
          folder: 'leasing-page'
        })
        const leasings = await bucket.getObjects({
          type: 'leasings',
          sort: 'order'
        })
        const description = await bucket.getObject({
          slug: 'seo-leasings-page'
        })
        // res.json({ 'header': header})
        res.render('leasings', { 'leasings': leasings.objects, 'title': 'Leasings', 'header': header.media[0].imgix_url, 'description': description.object.metadata.seo});
    }
    catch (err) {
        res.render('error', { title: '404: Error' });
    }
});

router.get('/leasings/:slug',async (req, res) =>  {
    try {
        const leasings = await bucket.getObject({
            type: 'leasings',
            slug: req.params.slug
        })
        const description = await bucket.getObject({
          slug: 'seo-leasings-page'
        })
        res.render('leasings-single', {'leasings': leasings.object, 'title': 'Leasings', 'description': description.object.metadata.seo });
        // res.json({ 'portfolio': portfolio.object})
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
          sort: 'order'
        })
        const description = await bucket.getObject({
          slug: 'seo-portfolio-page'
        })
        // res.json({ 'portfolio': portfolio})
        // console.log(tags)
        res.render('portfolio', { 'portfolio': portfolio.objects, 'tags': tags.objects, 'title': 'Portfolio', 'description': description.object.metadata.seo});
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
        const description = await bucket.getObject({
          slug: 'seo-portfolio-page'
        })
        res.render('portfolio-single', {'portfolio': portfolio.object, 'title': portfolio.object.title, 'description': description.object.metadata.seo});
        // res.json({ 'portfolio': portfolio.object})
    }
    catch (err) {
        res.render('error', { title: '404: Error' });
    }
});

router.get('/services',async (req, res) =>  {
    try {
        const header = await bucket.getObject({
          slug: "services-header-image"
        })
        const wedo = await bucket.getObject({
          slug: "what-we-do"
        })
        const pm = await bucket.getObject({
          slug: "property-management"
        })
        const development = await bucket.getObject({
          slug: "development"
        })
        const description = await bucket.getObject({
          slug: 'seo-services-page'
        })
        // res.json({ 'wedo': wedo.object})
        res.render('services', { 'header': header.object.metafields[0].url, 'wedo': wedo.object, 'pm': pm.object, 'development': development.object, title: 'Services', 'description': description.object.metadata.seo});
    }
    catch (err) {
        res.render('error', { title: '404: Error' });
    }
});

router.get('/contact',async (req, res) =>  {
    try {
        const description = await bucket.getObject({
          slug: 'seo-contact-page'
        })
        res.render('contact', {title: 'Contact Us', 'description': description.object.metadata.seo});
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