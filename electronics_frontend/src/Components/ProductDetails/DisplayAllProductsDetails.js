import { useEffect,useState } from "react"
import { Grid,TextField,Button,Select,FormControl,InputLabel,FormHelperText,MenuItem,Avatar,FormControlLabel,Radio,RadioGroup, FormLabel } from "@mui/material"
import { makeStyles } from "@mui/styles"
import Swal from "sweetalert2"
import { getData,postData } from "../../Services/FetchNodeServices"
import Heading from "../ProjectComponents/Heading"
import productimg from "../../assets/category.png"
import list from "../../assets/list.png"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';
import { useMemo } from "react"
import { DropzoneArea } from "material-ui-dropzone"
import { useNavigate } from "react-router-dom"
import MaterialTable from "@material-table/core"
var useStyles=makeStyles({
    root:{
        width:'100vw',
        height:'100%',
        display:'flex',
        justifyContent:'center',
    },
    box:{
        width:800,
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

    export default function DisplayAllProductsDetails(){
        var classes=useStyles()
        var navigate=useNavigate()
        const [productsDetails,setProductsDetails]=useState([])


        const fetchAllProductsDetails=async()=>{
            var response=await getData('productdetails/display_all_products_details')
            setProductsDetails(response.data)
        }
        
        useEffect(function(){
            fetchAllProductsDetails()
        },[])


    function displayproductsdetails(){
        return(
                  <MaterialTable
                    title="Productsdetails"
                    columns={[
                      { title: 'Product Id', field: 'productid' },
                      { title: 'Product Name', field: 'productname' },
                      { title: 'Brand Name', field: 'brandname'},
                      { title: 'Category Name', field: 'categoryname'},
                      
                      
                    ]}
                    data={productsDetails}        
                    actions={[
                      {
                        icon: 'edit',
                        tooltip: 'Edit User',
                       
                      },
                      {
                        icon: 'delete',
                        tooltip: 'Delete Product',
                       
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
            {displayproductsdetails()}
            
            </div>

        </div>
    )
}