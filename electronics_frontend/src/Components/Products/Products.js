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


export default function Products(){
    const classes= useStyles()
    const [categoryId,setCategoryId]=useState()
    const [categoryList,setCategoryList]=useState([])
    const [brandId,setBrandId]=useState()
    const [brandList,setBrandList]=useState([])
    const [errors,setErrors]=useState({})
    const[productName,setProductName]=useState('')
    const [picture,setPicture]=useState({bytes:'',filename:''})

    const handleError=(error,label)=>{
        setErrors((prev)=>({...prev,[label]:error}))
    }

    const validation=()=>{
        var error=false
        if (productName.length==0)
        {
            error=true
            handleError('Please Input Product Name','productName')
        }

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

    const handleCategoryChange=(event)=>{
      setCategoryId(event.target.value)
      fetchBrandsByCategory(event.target.value)
    }

    const handlePicture=(event)=>{
     setPicture({bytes:event.target.files[0],filename:URL.createObjectURL(event.target.files[0])})
    }

    const handleSubmit=async()=>{
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
        
    }
    return(
        <div className={classes.root}>
           <div className={classes.box}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Heading image={productimg} caption="Products"/>
                </Grid>
                <Grid item xs={6}>
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

                    <Grid item xs={6}>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Brands</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={brandId}
          label="Brands"
          onChange={(event)=>setBrandId(event.target.value)}
          onFocus={()=>handleError('','brandId')}
              helperText={errors.brandId}
        >
          {fillAllBrands()}
        </Select>
        <FormHelperText style={{color:'#b71540'}}>{errors.brandId}</FormHelperText>
      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                <TextField
                value={productName}
                onChange={(event)=>setProductName(event.target.value)}
                onFocus={()=>handleError('','productName')}
                error={errors.productName}
                helperText={errors.productName}
                label="Product Name" fullWidth/>
              </Grid>

              <Grid item xs={6}>
            <Button component="label"
             fullWidth variant="contained" 
             onFocus={()=>handleError('','picture')}>
                <input hidden onChange={handlePicture} type="file" accept="images/*" multiple />
                Picture
            </Button>
            <div style={{color:'#b71540',fontSize:12,marginLeft:10,marginTop:5}}>{errors.picture}</div>
                </Grid>

            <Grid item xs={6} className={classes.center}>
            <Avatar src={picture.filename} alt="Brand" variant="rounded"/>
           </Grid>

           <Grid item xs={6}>
            <Button  variant="contained" fullWidth onClick={handleSubmit}>
                Submit
            </Button>
         </Grid>
         <Grid item xs={6}>
            <Button onClick={handleReset} variant="contained" fullWidth>
                Reset
            </Button>
         </Grid>



            </Grid>
           </div>
        </div>
    )
}