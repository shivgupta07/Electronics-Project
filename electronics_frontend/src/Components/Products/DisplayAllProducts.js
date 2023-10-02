import { makeStyles } from "@mui/styles"
import MaterialTable from "@material-table/core"
import { useState,useEffect } from "react"
import { getData,postData,serverURL } from "../../Services/FetchNodeServices"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { DialogTitle,DialogContent,Dialog,DialogActions } from "@mui/material"
import { Grid,TextField,Button,Select,FormControl,InputLabel,FormHelperText,MenuItem,Avatar } from "@mui/material"
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

var useStyles=makeStyles({
    root:{
        width:'100vw',
        height:'100%',
        display:'flex',
        justifyContent:'center',
    },
    box:{
        width:900,
        height:'auto',
        background:'#f1f2f6',
        padding:10,
        margin:10,
        borderRadius:10
    },
    reportRoot:{
        width:'100vw',
        height:'100%',
        display:'flex',
        justifyContent:'center',
    },
    reportBox:{
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
    },
    right:{
        display:'flex',
        justifyContent:'right',
        alignItems:'center' 
    }
    })
export default function DisplayAllProducts(){
var classes=useStyles()
var navigate=useNavigate()
const [products,setProducts]=useState([])
const [open,setOpen]=useState(false)


    
const fetchAllProducts=async()=>{
    var response=await getData('products/display_all_products')
    setProducts(response.data)
}

useEffect(function(){
    fetchAllProducts()
},[])

//////////////////////////////Edit Products///////////////////////////////////

    const [categoryId,setCategoryId]=useState()
    const [categoryName,setCategoryName]=useState('')
    const [categoryList,setCategoryList]=useState([])
    const [brandId,setBrandId]=useState()
    const [brandName,setBrandnName]=useState('')
    const [brandList,setBrandList]=useState([])
    const [errors,setErrors]=useState({})
    const[productName,setProductName]=useState('')
    const[productId,setProductId]=useState()
    const [picture,setPicture]=useState({bytes:'',filename:''})
    const [tempPicture,setTempPicture]=useState('')
    const [statusCamera,setStatusCamera]=useState(false)
    const [statusBtn,setStatusBtn]=useState(false)

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


const productForm=()=>{
    return(
        <div >
           <div className={classes.reportBox}>
            <Grid container spacing={3}>
            <Grid item xs={12}  className={classes.right}>
            { statusBtn?<SaveCancelBtn/>:<></>}
        <Button onMouseLeave={()=>setStatusCamera(false)} onMouseEnter={()=>setStatusCamera(true)} component="label" style={{position:'relative'}} onFocus={()=>handleError('','picture')} >
        {statusCamera?
              <div style={{bottom:8,right:10,position:'absolute',zIndex:2,background:'#f2f2f2',width:26,height:26,borderRadius:12,padding:2,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <AddAPhotoIcon style={{color:'#000'}}/>
               </div>
               :<></>}
            <input hidden onChange={handlePicture} type="file" accept="images/*" multiple />
           
            <Avatar src={picture.filename} alt="Picture" sx={{width:100,height:100}} variant="rounded"/>
        </Button>
        <div style={{color:'#b71540',fontSize:12,marginLeft:10,marginTop:5}}>{errors.picture}</div>
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

              
           

           



            </Grid>
           </div>
        </div>
    )
}

const handleOpen=(rowData)=>{
setCategoryId(rowData.categoryid)
setBrandId(rowData.brandid)
setProductId(rowData.productid)
setProductName(rowData.productname)
setPicture({filename:`${serverURL}/images/${rowData.picture}`,bytes:''})
setTempPicture(`${serverURL}/images/${rowData.picture}`)
setOpen(true)
}

const handlePicture=(event)=>{
    setPicture({bytes:event.target.files[0],filename:URL.createObjectURL(event.target.files[0])})
    setStatusBtn(true)
}
const handleEditPicture=async()=>{
    setStatusBtn(false)
      var error=validation()
      if (error==false)
      {
      var formData=new FormData()
      formData.append('productid',productId)
      formData.append('picture',picture.bytes)
      var response=await postData('products/edit_product_picture',formData)
      if(response.status)
      {
          Swal.fire({
              icon: 'success',
              title: 'Products',
              text: response.message,
              toast:true
            })
            fetchAllProducts()
      }
      else
      {
          Swal.fire({
              icon: 'error',
              title: 'Products',
              text: response.message,
              toast:true
            })
      }

      }
  }

  const handleCancel=()=>{
    setStatusBtn(false)
    setPicture({filename:tempPicture,bytes:''})

  }
  const SaveCancelBtn=()=>{
    return(
      <div>
        <Button  onClick={handleEditPicture}>Save</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </div>
    )
  }
const handleSubmit=async()=>{
    var val=validation()
    if (val==false)
    {

  var body={categoryid:categoryId,categoryname:categoryName,brandid:brandId,brandname:brandName,productid:productId,productname:productName}
  var response=await postData('products/edit_product_data',body)
    if(response.status)
    {
        Swal.fire({
            icon: 'success',
            title: 'Brands',
            text: response.message,
            toast:true
          })
          fetchAllProducts() 
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

const handleClose=()=>{
    setOpen(false)
}



const showProductDialog=()=>{
    return(
      <Dialog open={open}>
      <DialogTitle>
      Update Products
      </DialogTitle>
      <DialogContent>
     {productForm()}
      </DialogContent>
      <DialogActions>
      
      <Button onClick={handleSubmit}>Edit Data</Button>
      <Button onClick={handleClose}>Close</Button>
      </DialogActions>
      </Dialog>
  
    )
  }

/////////////////////////////////////////////////////////////////////////////////////

const handleDelete=(rowData)=>{
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async(result) => {
        if (result.isConfirmed) {
          var result=await postData('products/delete_product',{productid:rowData.productid})
          if (result.status)
         { Swal.fire(
            'Deleted!',
            'Product has been deleted.',
            'success'
          )
          fetchAllProducts()
        }
        else
        { Swal.fire(
          'Failed!',
          'Fail to delete Product',
          'error'
        )
      }}
      })
}

    function displayproducts(){
        return(
                  <MaterialTable
                    title="Products"
                    columns={[
                      { title: 'Product Id', field: 'productid' },
                      { title: 'ProductName', field: 'productname' },
                      { title: 'BrandId/Name', render:(rowData)=><div>{rowData.brandid}/{rowData.brandname}</div>},
                      { title: 'CategoryId/Name', render:(rowData)=> <div>{rowData.categoryid}/{rowData.categoryname}</div>},
                      { title: 'Picture', render:(rowData)=><img src={`${serverURL}/images/${rowData.picture}`} width='60' />}
                      
                    ]}
                    data={products}        
                    actions={[
                      {
                        icon: 'edit',
                        tooltip: 'Edit User',
                        onClick: (event, rowData) => handleOpen(rowData)
                      },
                      {
                        icon: 'delete',
                        tooltip: 'Delete Product',
                        onClick: (event, rowData) => handleDelete(rowData)
                      },
                      {
                        icon: 'add',
                        tooltip: 'Add Products',
                        isFreeAction: true,
                        onClick: (event) => navigate("/products")
                      }

                    ]}
                  />
                )
              }
        
    
var classes=useStyles()
    return(
        <div className={classes.root}>
            <div className={classes.box}>
            {displayproducts()}
            {showProductDialog()}
            </div>

        </div>
    )
}