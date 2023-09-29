var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer')
/* GET home page. */
router.post('/submit_brands',upload.single('logo'), function(req, res, next) {
   try{
    pool.query('insert into brands (brandname,logo) values(?,?)',[req.body.brandname,req.file.filename],function(error,result){
        if(error)
        {
            res.status(200).json({status:false,message:'Database error,pls contact database admin'})
        }
        else
        {
            res.status(200).json({status:true,message:'Brands submitted successfully'})
        }
    })
}
catch(e)
{
    res.status(200).json({status:false,message:'Server Error...'})
}
});

module.exports = router;