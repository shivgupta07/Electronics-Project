var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer')
/* GET home page. */
router.post('/submit_productdetails',upload.any(), function(req, res) {
   try{
    var filenames =req.files.map((file,index)=>file.filename)
    pool.query('insert into productdetails (categoryid, brandid, productid, modelno, description, color, price, offerprice, stock, status, picture, hsncode) values(?,?,?,?,?,?,?,?,?,?,?,?)',
    [req.body.categoryid, req.body.brandid, req.body.productid,  req.body.modelno, req.body.description, req.body.color, req.body.price, req.body.offerprice, req.body.stock, req.body.status, filenames+'', req.body.hsncode],function(error,result){
       
        if(error)
        {    console.log(error)
            res.status(500).json({status:false,message:'Database error,pls contact database admin'})
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


router.get('/display_all_products_details', function (req, res) {
    try {
        pool.query('select P.*, (select C.categoryname from category C where C.categoryid = P.categoryid) as categoryname, (select B.brandname from brands B where B.brandid = P.brandid) as brandname, (select Pr.productname from products Pr where Pr.productid = P.productid) as productname from productdetails P', function (error, result) {
            if (error) {
                res.status(200).json({ status: false, message: 'Database Error!' })
            }
            else {
                res.status(200).json({ status: true, data: result })
            }
        })
    }
    catch (e) {
        res.status(200).json({ status: false, message: 'Server Error!' })
    }
})
 

module.exports = router;