var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer')
/* GET home page. */
router.post('/submit_brands',upload.single('logo'), function(req, res, next) {
   try{
    pool.query('insert into brands (brandname,categoryid,logo) values(?,?,?)',[req.body.brandname, req.body.category, req.file.filename],function(error,result){
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

router.get('/display_all_brands',function(req,res,next){
    try{
       pool.query('select B.*, (select C.categoryname from category C where C.categoryid = B.categoryid) as categoryname from brands B',function(error,result){
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

router.post('/edit_brands_data',function(req, res, next) {
    try{
     pool.query('update brands set  categoryid = ?,categoryname=?, brandname = ?, where brandid = ?' ,[req.body.categoryid,req.body.categoryname,req.body.brandname,req.body.brandid],function(error,result){
         if(error)
         {
             res.status(200).json({status:false,message:'Database error,pls contact database admin'})
         }
         else
         {
             res.status(200).json({status:true,message:'Brand Updated successfully'})
         }
     })
 }
 catch(e)
 {
     res.status(200).json({status:false,message:'Server Error...'})
 }
 });
 

router.post('/edit_brand_logo',upload.single('logo'),function(req, res, next) {
    try{
     pool.query('update brands set logo = ? where brandid = ?', [req.file.filename, req.body.brandid],function(error,result){
         if(error)
         {
             res.status(200).json({status:false,message:'Database error,pls contact database admin'})
         }
         else
         {
             res.status(200).json({status:true,message:'Logo Updated successfully'})
         }
     })
 }
 catch(e)
 {
     res.status(200).json({status:false,message:'Server Error...'})
 }
 });
module.exports = router;