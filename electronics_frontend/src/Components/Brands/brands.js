import { useState } from "react"
import {Grid,Button,TextField, Avatar} from "@mui/material"
import { postData } from "../../Services/FetchNodeServices"
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
    const [brandName,setBrandName]=useState('')
    const [logo,setLogo]=useState({bytes:'',filename:''})

    const handleLogo=(event)=>{
     setLogo({bytes:event.target.files[0],filename:URL.createObjectURL(event.target.files[0])})
    }

    const handleSubmit=async()=>{
      var formData=new FormData()
      formData.append('brandname',brandName)
      formData.append('logo',logo.bytes)
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

    const handleReset=()=>{
        
    }
    return(
        <div className={useStyle.root}>
            <div className={useStyle.box}>
                <Grid container spacing={3}>
                <Grid item xs={12}>
                <Heading image={categoryimg} caption="Brands" link='/displayallcategory'/>
                <TextField
                value={brandName}
                onChange={(event)=>setBrandName(event.target.value)}
              label="Brand Name" fullWidth/>
              </Grid>

              <Grid item xs={6}>
            <Button component="label"
             fullWidth variant="contained" >
                <input hidden onChange={handleLogo} type="file" accept="images/*" multiple/>
                Logo
            </Button>
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