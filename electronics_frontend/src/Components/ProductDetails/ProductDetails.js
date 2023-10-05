import { useEffect,useState } from "react"
import { Grid,TextField,Button,Select,FormControl,InputLabel,FormHelperText,MenuItem,Avatar } from "@mui/material"
import { makeStyles } from "@mui/styles"
import Swal from "sweetalert2"
import { getData,postData } from "../../Services/FetchNodeServices"
import Heading from "../ProjectComponents/Heading"
import productimg from "../../assets/category.png"
import list from "../../assets/list.png"


var useStyles=makeStyles({
    root:{
        width:'100vw',
        height:'100%',
        display:'flex',
        justifyContent:'center',
    },
    box:{
        width:500,
        height:'auto',
        background:'#f1f2f6',
        padding:10,
        margin:10,
        borderRadius:10
    },
    center:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    }  
    })


    export default function ProductDetails(){
        const classes= useStyles()
        const [categoryId,setCategoryId]=useState()
        const [categoryList,setCategoryList]=useState([])
        const [brandId,setBrandId]=useState()
        const [brandList,setBrandList]=useState([])
        const [errors,setErrors]=useState({})
        const[productId,setProductId]=useState()
        const[productList,setProductList]=useState([])
        const[description,setDescription]=useState('')
        const[price,setPrice]=useState()
        const[offerPrice,setOfferPrice]=useState()
        const[color,setColor]=useState('')
        const[stock,setStock]=useState()
        const[status,setStatus]=useState('')
        const[modelNo,setModelNo]=useState('')
        const[hsnCode,setHsnCode]=useState('')
        const [picture,setPicture]=useState({bytes:'',filename:''})
     

        const handleError=(error,label)=>{
            setErrors((prev)=>({...prev,[label]:error}))
        }
    
        const validation=()=>{
            var error=false
            
    
            if (picture.filename.length==0)
            {
                error=true
                handleError('Please upload Picture','picture')
            }
    
            if (!brandId)
            {
                error=true
                handleError('Please Select Brand','brandId')
            }
            if(!categoryId)
            {
              error=true
              handleError('Please Select Category','categoryId')
              
            }
            if(!productId)
            {
              error=true
              handleError('Please Select Product','productId')
              
            }
            return error
        }
    
        const fetchAllCategory=async()=>{
            var result=await getData('category/display_all_category')
            setCategoryList(result.data)
        }
    
        useEffect(function(){
            fetchAllCategory()
        },[])
    
        const fillAllCategory=()=>{
            return categoryList.map((item)=>{
                return <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem>
            })
        }
    
        
    
        const fetchBrandsByCategory=async(cid)=>{
            var result=await postData('brands/fetch_brands_by_category',{categoryid:cid})
             setBrandList(result.data)
        }
        
       

        const fillAllBrands=()=>{
            return brandList.map((item)=>{
                return <MenuItem value={item.brandid}>{item.brandname}</MenuItem>
            })
        }

        const fetchProductsByBrands=async(bid)=>{
            var body={'brandid': bid,categoryid:categoryId}
            var result=await postData('products/fetch_products_by_brands',body)
             setProductList(result.data)
        }
        
        const fillAllProducts=()=>{
            return productList.map((item)=>{
                return <MenuItem value={item.productid}>{item.productname}</MenuItem>
            })
        }
    
        const handleCategoryChange=(event)=>{
          setCategoryId(event.target.value)
          fetchBrandsByCategory(event.target.value)
        }

        const handleBrandChange=(event)=>{
            setBrandId(event.target.value)
            fetchProductsByBrands(event.target.value)
          }
      
        const handlePicture=(event)=>{
         setPicture({bytes:event.target.files[0],filename:URL.createObjectURL(event.target.files[0])})
        }
    
       /* const handleSubmit=async()=>{
            var val=validation()
            if (val==false)
            {
          var formData=new FormData()
          formData.append('productname',productName)
          formData.append('picture',picture.bytes)
          formData.append('categoryid', categoryId)
          formData.append('brandid', brandId)
    
          var response=await postData('products/submit_products',formData)
            if(response.status)
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Brands',
                    text: response.message,
                    toast:true
                  })
                  
            }
            else
            {
                Swal.fire({
                    icon: 'error',
                    title: 'Brands',
                    text: response.message,
                    toast:true
                  })
            }
    
        }
        
        }
    
        const handleReset=()=>{
            
        } */

        return(
            <div className={classes.root}>
               <div className={classes.box}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Heading image={productimg} caption="Products" link='/displayallproducts'/>
                    </Grid>
                    <Grid item xs={4}>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={categoryId}
              label="Category"
              onChange={handleCategoryChange}
              onFocus={()=>handleError('','categoryId')}
                  helperText={errors.categoryId}
            >
              {fillAllCategory()}
            </Select>
            <FormHelperText style={{color:'#b71540'}}>{errors.categoryId}</FormHelperText>
          </FormControl>
                        </Grid>
    
                        <Grid item xs={4}>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Brands</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={brandId}
              label="Brands"
              onChange={handleBrandChange}
              onFocus={()=>handleError('','brandId')}
                  helperText={errors.brandId}
            >
              {fillAllBrands()}
            </Select>
            <FormHelperText style={{color:'#b71540'}}>{errors.brandId}</FormHelperText>
          </FormControl>
                        </Grid>

                        <Grid item xs={4}>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Products</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={productId}
              label="Products"
              onChange={(event)=>setProductId(event.target.value)}
              onFocus={()=>handleError('','productId')}
                  helperText={errors.productId}
            >
              {fillAllProducts()}
            </Select>
            <FormHelperText style={{color:'#b71540'}}>{errors.productId}</FormHelperText>
          </FormControl>
                        </Grid>
    
                   
    
                </Grid>
               </div>
            </div>
        )
    }