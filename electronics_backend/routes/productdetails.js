var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer')
/* GET home page. */
router.post('/submit_productdetails',upload.single('picture'), function(req, res, next) {
   try{
    pool.query('insert into productdetails (categoryid, brandid, productid, productdetailsid, modelno, description, color, price, offerprice, stock, status, picture, hsncode) values(?,?,?,?,?,?,?,?,?,?,?,?,?)',[req.body.categoryid, req.body.brandid, req.body.productid, req.body.productdetailsid, req.body.modelno, req.body.description, req.body.color, req.body.price, req.body.offerprice, req.body.stock, req.body.status, req.body.file.filename, req.body.hsncode],function(error,result){
        if(error)
        {    
            res.status(200).json({status:false,message:'Database error,pls contact database admin'})
        }
        else
        { 
            res.status(200).json({status:true,message:'Productdetails submitted successfully'})
        }
    })
}
catch(e)
{
    res.status(200).json({status:false,message:'Server Error...'})
}
});


module.exports = router;