const express = require('express')
const validUrl = require('valid-url')
const shortId = require('shortid')

const Url = require('./shortUrl.model')

const router = express.Router()

router.get('/:short', async (req, res, next) =>{
    const param = req.params.short 
    try {
        const url = await Url.findOne({short: param})
        if(!url) {
            res.redirect('/')
        }else{
            res.redirect(url.url)
        }
    } catch (error) {
        
    }
})

router.post('/new', async (req, res, next)=>{
    const host = req.get('host')
    const protocol = req.protocol
    const urlShortId = shortId.generate()
    const reqUrl = req.body.url
    if(!validUrl.isUri(reqUrl)){
        return res.status(422).json({message: 'The Url is invalid'})
    }

    try {
        const url = await Url.findOne({url: reqUrl.trim()})
        console.log(url)
        if(url){
            res.json(url)
        }else{
            const newUrl = new Url({
                url: reqUrl.trim(),
                short: urlShortId,
                count: 0
            })
            newUrl.save().then(doc=>{
                console.log(doc)
                res.json(doc)
            }).catch(err=>{
                res.status(500).json({message:'Server Error'})
            })
        }
    } catch (error) {
        res.status(500).json({message:'Server Error'})
    }
})

module.exports = router


