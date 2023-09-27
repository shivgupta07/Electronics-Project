import MaterialTable from "@material-table/core";
import { useState,useEffect, } from "react";
import { makeStyles } from "@mui/styles"
import {Grid,TextField, Avatar} from "@mui/material"
import { postData } from "../Services/FetchNodeServices"
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Swal from "sweetalert2"
import categoryimg from '../../src/assets/category.png'
import { getData,serverURL } from "../Services/FetchNodeServices";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import {useNavigate} from "react-router-dom"
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
    padding:10,
    margin:10,
    borderRadius:10
},
right:{
    display:'flex',
    justifyContent:'right',
    alignItems:'center' 
}
})


export default function DisplayAllCategory()
{
var classes=useStyles()
var navigate=useNavigate()
const [category,setCategory]=useState([])
const [open,setOpen]=useState(false)

/////////////Category Edit Action///////////////

  const useStyle=useStyles()
  const [categoryName,setCategoryName]=useState('')
  const [image,setImage]=useState({bytes:'',filename:''})
  const [errors,setErrors]=useState({})
  const [statusCamera,setStatusCamera]=useState(false)
  const [statusBtn,setStatusBtn]=useState(false)
  const [tempPicture,setTempPicture]=useState('')
  const [categoryId,setCategoryId]=useState()
  const handleReset=()=>{
      setCategoryName('')
      setImage({bytes:'',filename:''})
  }
  const handleError=(error,label)=>{
      setErrors((prev)=>({...prev,[label]:error}))
  }
  const validation=()=>{
      var error=false
      if(categoryName.length==0)
      {
      error=true
      handleError('Pls Input Category Name..','categoryName')
      }
      if(image.filename.length==0)
      {
          error=true
          handleError('Pls Select Image..','image')
          }
    return error
  }

  const handleImage=(event)=>{
      setImage({bytes:event.target.files[0],filename:URL.createObjectURL(event.target.files[0])})
      setStatusBtn(true)
  }

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
        var result=await postData('category/delete_category',{categoryid:rowData.categoryid})
        if (result.status)
       { Swal.fire(
          'Deleted!',
          'Category has been deleted.',
          'success'
        )
        fetchAllCategory()
      }
      else
      { Swal.fire(
        'Failed!',
        'Fail to delete category',
        'error'
      )
    }}
    })
  }

  const handleSubmit=async()=>{
    var error=validation()
    if (error==false)
    {
    var body={categoryid:categoryId,categoryname:categoryName}
    
    var response=await postData('category/edit_category_data',body)
    if(response.status)
    {
        Swal.fire({
            icon: 'success',
            title: 'Category',
            text: response.message,
            toast:true
          })
          fetchAllCategory()
    }
    else
    {
        Swal.fire({
            icon: 'error',
            title: 'Category',
            text: response.message,
            toast:true
          })
    }

    }
  }

  const handleEditPicture=async()=>{
    setStatusBtn(false)
      var error=validation()
      if (error==false)
      {
      var formData=new FormData()
      formData.append('categoryid',categoryId)
      formData.append('image',image.bytes)
      var response=await postData('category/edit_category_picture',formData)
      if(response.status)
      {
          Swal.fire({
              icon: 'success',
              title: 'Category',
              text: response.message,
              toast:true
            })
            fetchAllCategory()
      }
      else
      {
          Swal.fire({
              icon: 'error',
              title: 'Category',
              text: response.message,
              toast:true
            })
      }

      }
  }

  const handleCancel=()=>{
    setStatusBtn(false)
    setImage({filename:tempPicture,bytes:''})

  }
  const SaveCancelBtn=()=>{
    return(
      <div>
        <Button  onClick={handleEditPicture}>Save</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </div>
    )
  }


  const categoryForm=()=>{
  
    return (
        
         <div className={classes.box}>
         <Grid container spacing={3}>
          
         <Grid item xs={12} className={classes.right}>
         { statusBtn?<SaveCancelBtn/>:<></>}
         <Button onMouseLeave={()=>setStatusCamera(false)} onMouseEnter={()=>setStatusCamera(true)} component="label" style={{position:'relative'}}
             
             onFocus={()=>handleError('','image')}
            > 
             {statusCamera?
              <div style={{bottom:8,right:10,position:'absolute',zIndex:2,background:'#f2f2f2',width:26,height:26,borderRadius:12,padding:2,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <AddAPhotoIcon style={{color:'#000'}}/>
               </div>
               :<></>}
                <input hidden onChange={handleImage} type="file" accept="images/*" multiple/>
                <Avatar src={image.filename} sx={{width:100,height:100}} alt="Category" variant="rounded"/>
               
            </Button>
            <div style={{color:'#b71540',fontSize:12,marginLeft:10,marginTop:5}}>{errors.image}</div>
            
           </Grid>
           <Grid item xs={12}>
           <TextField
           value={categoryName} onFocus={()=>handleError('','categoryName')}
            onChange={(event)=>setCategoryName(event.target.value)} 
            label="Category Name" fullWidth
            error={errors.categoryName}
            helperText={errors.categoryName} />
           </Grid>
           
          
         </Grid>
         </div>
        
    )
}
///////////////////////////////////////////////
const fetchAllCategory=async()=>{
    var response=await getData('category/display_all_category')
    setCategory(response.data)
}

useEffect(function(){
fetchAllCategory()
},[])

const handleClose=()=>{
  setOpen(false)
}
const handleOpen=(rowData)=>{
setCategoryId(rowData.categoryid)
setCategoryName(rowData.categoryname)
setImage({filename:`${serverURL}/images/${rowData.image}`,bytes:''})
setTempPicture(`${serverURL}/images/${rowData.image}`)
setOpen(true)
}


const showCategoryDialog=()=>{
  return(
    <Dialog open={open}>
    <DialogTitle>
    Update Category
    </DialogTitle>
    <DialogContent>
   {categoryForm()}
    </DialogContent>
    <DialogActions>
    
    <Button onClick={handleSubmit}>Edit Data</Button>
    <Button onClick={handleClose}>Close</Button>
    </DialogActions>
    </Dialog>

  )
}

    function displayCategory() {
        return (
          <MaterialTable
            title={
              <div style={{display:'flex',flexDirection:'row'}} >
              <div>
                  <img src={categoryimg} width="30"/>
              </div>
              <div style={{fontFamily:'kanit',fontsize:25,fontWeight:'bold', paddingLeft:7}}>
                  Category List
              </div>
              </div>
            }
            columns={[
              { title: 'Category Id', field: 'categoryid' },
              { title: 'Category Name', field: 'categoryname' },
              { title: 'Image', render:(rowData)=><img src={`${serverURL}/images/${rowData.image}`} width='40' />}
            ]}
            data={category}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Category',
                onClick: (event, rowData) => handleOpen(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Category',
                onClick: (event, rowData) => handleDelete(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Category',
                isFreeAction: true,
                onClick: (event) => navigate("/category")
              }
            ]}
          />
        )
      }
    return(<div className={classes.reportRoot}>
        <div className={classes.reportBox}>
       {displayCategory()}
       {showCategoryDialog()}
       </div>
    </div>)
}