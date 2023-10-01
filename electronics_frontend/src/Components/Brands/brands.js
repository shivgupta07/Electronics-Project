import { useEffect, useState } from "react"
import {Grid,Button,TextField, Avatar,MenuItem,FormControl,InputLabel,Select,FormHelperText} from "@mui/material"
import { postData,getData } from "../../Services/FetchNodeServices"
import Swal from "sweetalert2"
import { makeStyles } from "@mui/styles"
import Heading from "../ProjectComponents/Heading"
import categoryimg from "../../assets/category.png"


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
export default function Brands(){

    const useStyle=useStyles()
    const [categoryId,setCategoryId]=useState('')
    const [brandName,setBrandName]=useState('')
    const [logo,setLogo]=useState({bytes:'',filename:''})
    const [categoryList,setCategoryList]=useState([])
    const [errors,setErrors]=useState({})
    


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
    }

    const handleSubmit=async()=>{
        var val=validation()
        if (val==false)
        {
      var formData=new FormData()
      formData.append('brandname',brandName)
      formData.append('logo',logo.bytes)
      formData.append('category', categoryId)
      var response=await postData('brands/submit_brands',formData)
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
        <div className={useStyle.root}>
            <div className={useStyle.box}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                    <Heading image={categoryimg} caption="Brands" link='/displayallbrands'/>
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

              <Grid item xs={6}>
            <Button component="label"
             fullWidth variant="contained" 
             onFocus={()=>handleError('','logo')}>
                <input hidden onChange={handleLogo} type="file" accept="images/*" multiple />
                Logo
            </Button>
            <div style={{color:'#b71540',fontSize:12,marginLeft:10,marginTop:5}}>{errors.logo}</div>
                </Grid>

            <Grid item xs={6} className={useStyle.center}>
            <Avatar src={logo.filename} alt="Brand" variant="rounded"/>
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