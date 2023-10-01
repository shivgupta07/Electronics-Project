import MaterialTable from "@material-table/core";
import { useState,useEffect, } from "react";
import { makeStyles } from "@mui/styles"
import {Grid,TextField, Avatar} from "@mui/material"
import { getData,postData,serverURL } from "../../Services/FetchNodeServices";
import {MenuItem,FormControl,InputLabel,Select,FormHelperText} from "@mui/material"
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Swal from "sweetalert2"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import {useNavigate} from "react-router-dom"
import brndimg from "../../assets/category.png"
import Heading from "../ProjectComponents/Heading";
import List from "../../assets/list.png"
var useStyles=makeStyles({
reportRoot:{
    width:'100vw',
    height:'100%',
    display:'flex',
    justifyContent:'center',
},
reportBox:{
    width:900,
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
box:{
    width:500,
    height:'auto',
    background:'#f1f2f6',
    padding:10,
    margin:10,
    borderRadius:10
},
right:{
    display:'flex',
    justifyContent:'right',
    alignItems:'right' 
}
})

export default function DisplayAllBrands()
{  var classes=useStyles()
    var navigate=useNavigate()
    const [brands,setBrands]=useState([])
    const [open,setOpen]=useState(false)
 
/////////////////////Brands Edit //////////////////////
const [categoryName,setCategoryName]=useState('')
const [categoryId,setCategoryId]=useState()
const [brandId,setBrandId]=useState()
const [brandName,setBrandName]=useState('')
const [logo,setLogo]=useState({bytes:'',filename:''})
const [categoryList,setCategoryList]=useState([])
const [errors,setErrors]=useState({})
const [tempPicture,setTempPicture]=useState('')
const [statusCamera,setStatusCamera]=useState(false)
const [statusBtn,setStatusBtn]=useState(false)



const handleError=(error,label)=>{
    setErrors((prev)=>({...prev,[label]:error}))
}

const validation=()=>{
    var error=false
    if (brandName.length==0)
    {
        error=true
        handleError('Please Input Brand Name','brandName')
    }

    if (logo.filename.length==0)
    {
        error=true
        handleError('Please upload logo','logo')
    }
    if(!categoryId)
    {
      handleError('Please Select Category','logo')
      
      error=true
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

const handleLogo=(event)=>{
 setLogo({bytes:event.target.files[0],filename:URL.createObjectURL(event.target.files[0])})
 setStatusBtn(true)
}

const handleSubmit=async()=>{
    var error=validation()
    if (error==false)
    {
    var body={categoryid:categoryId,categoryname:categoryName,brandname:brandName,brandid:brandId,}
  var response=await postData('brands/edit_brand_data',body)
    if(response.status)
    {
        Swal.fire({
            icon: 'success',
            title: 'Brands',
            text: response.message,
            toast:true
          })
          fetchAllBrands()
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

const handleOpen=(rowData)=>{
setBrandName(rowData.brandname)
setBrandId(rowData.brandid)
setCategoryName(rowData.categoryname)
setCategoryId(rowData.categoryid)
setLogo({filename:`${serverURL}/images/${rowData.logo}`,bytes:''})
setTempPicture(`${serverURL}/images/${rowData.logo}`)
    setOpen(true)
    }

const handleClose=()=>{
    setOpen(false)
}

const handleEditPicture=async()=>{
    setStatusBtn(false)
      var error=validation()
      if (error==false)
      {
      var formData=new FormData()
      formData.append('brandid',brandId)
      formData.append('logo',logo.bytes)
      var response=await postData('brands/edit_brand_logo',formData)
      if(response.status)
      {
          Swal.fire({
              icon: 'success',
              title: 'Brands',
              text: response.message,
              toast:true
            })
            fetchAllBrands()
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

  const handleCancel=()=>{
    setStatusBtn(false)
    setLogo({filename:tempPicture,bytes:''})

  }
  const SaveCancelBtn=()=>{
    return(
      <div>
        <Button  onClick={handleEditPicture}>Save</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </div>
    )
  }


const brandForm=()=>{
return(
    <div className={classes.root}>
        <div className={classes.box}>
            <Grid container spacing={3}>
            <Grid item xs={12}  className={classes.right}>
            { statusBtn?<SaveCancelBtn/>:<></>}
        <Button onMouseLeave={()=>setStatusCamera(false)} onMouseEnter={()=>setStatusCamera(true)} component="label" style={{position:'relative'}} onFocus={()=>handleError('','logo')} >
        {statusCamera?
              <div style={{bottom:8,right:10,position:'absolute',zIndex:2,background:'#f2f2f2',width:26,height:26,borderRadius:12,padding:2,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <AddAPhotoIcon style={{color:'#000'}}/>
               </div>
               :<></>}
            <input hidden onChange={handleLogo} type="file" accept="images/*" multiple />
           
            <Avatar src={logo.filename} alt="Brand" sx={{width:100,height:100}} variant="rounded"/>
        </Button>
        <div style={{color:'#b71540',fontSize:12,marginLeft:10,marginTop:5}}>{errors.logo}</div>
            </Grid>

                <Grid item xs={12}>
    <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">Category</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={categoryId}
      label="Category"
      onChange={(event)=>setCategoryId(event.target.value)}
      onFocus={()=>handleError('','categoryId')}
          helperText={errors.categoryId}
    >
      {fillAllCategory()}
    </Select>
    <FormHelperText style={{color:'#b71540'}}>{errors.categoryId}</FormHelperText>
  </FormControl>
                </Grid>

            <Grid item xs={12}>
            <TextField
            value={brandName}
            onChange={(event)=>setBrandName(event.target.value)}
            onFocus={()=>handleError('','brandName')}
            error={errors.brandName}
            helperText={errors.brandName}
            label="Brand Name" fullWidth/>
          </Grid>

         

        <Grid item xs={6} className={classes.center}>
        
       </Grid>

            </Grid>
        </div>
    </div>
)
}
//////////////////////////////////////////////////////
    
    

    const fetchAllBrands=async()=>{
        var response=await getData('brands/display_all_brands')
        setBrands(response.data)
    }

    useEffect(function(){
        fetchAllBrands()
    },[])


    const showBrandsDialog=()=>{
        return(
          <Dialog open={open}>
          <DialogTitle>
          Update Category
          </DialogTitle>
          <DialogContent>
         {brandForm()}
          </DialogContent>
          <DialogActions>
          
          <Button onClick={handleSubmit}>Edit Data</Button>
          <Button onClick={handleClose}>Close</Button>
          </DialogActions>
          </Dialog>
      
        )
      }
      
    function displayBrands() {
        
        return (
          <MaterialTable
            title="Brands"
            columns={[
              { title: 'Brand  Id', field: 'brandid' },
              { title: 'Brand  Name', field: 'brandname' },
              { title: 'Category Id/Name', render:(rowData)=> <div>{rowData.categoryid}/{rowData.categoryname}</div>},
              { title: 'Logo', render:(rowData)=><img src={`${serverURL}/images/${rowData.logo}`} width='40' />}
              
              
            ]}
            data={brands}      
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Brands',
                onClick: (event, rowData) => handleOpen(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Brands',
                onClick: (event, rowData) => alert("You saved " + rowData.name)
              },
              {
                icon: 'add',
                tooltip: 'Add Brands',
                isFreeAction: true,
                onClick: (event) => navigate("/brands")
              }
            ]}
          />
        )
      }
      return(<div className={classes.reportRoot}>
        <div className={classes.reportBox}>
       {displayBrands()}
       {showBrandsDialog()}
       </div>
       </div>
    )
}