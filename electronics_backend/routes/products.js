var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer')
/* GET home page. */
router.post('/submit_products',upload.single('picture'), function(req, res, next) {
   try{
    pool.query('insert into products (categoryid,brandid,productname,picture) values(?,?,?,?)',[req.body.categoryid, req.body.brandid,req.body.productname, req.file.filename],function(error,result){
        if(error)
        {
            res.status(200).json({status:false,message:'Database error,pls contact database admin'})
        }
        else
        {
            res.status(200).json({status:true,message:'Products submitted successfully'})
        }
    })
}
catch(e)
{
    res.status(200).json({status:false,message:'Server Error...'})
}
});


router.get('/display_all_products',function(req,res,next){
    try{
       pool.query('select P.*, (select C.categoryname from category C where C.categoryid = P.categoryid) as categoryname,(select B.brandname from brands B where B.brandid = P.brandid) as brandname from products P',function(error,result){
            if(error)
            {
                res.status(200).json({status:false,message:'Database error,pls contact database admin'})
            }
            else
            {
                res.status(200).json({data:result,status:true,message:'Success'})
            }
        })
    }
    catch(e)
    {
        res.status(200).json({status:false,message:'Server Error...'})
    }
})

module.exports = router;