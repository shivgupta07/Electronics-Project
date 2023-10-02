import { makeStyles } from "@mui/styles"
import MaterialTable from "@material-table/core"
import { useState,useEffect } from "react"
import { getData,postData,serverURL } from "../../Services/FetchNodeServices"
import { useNavigate } from "react-router-dom"

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
    center:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    }  
    })
export default function DisplayAllProducts(){
var classes=useStyles()
var navigate=useNavigate()
const [products,setProducts]=useState([])

    
const fetchAllProducts=async()=>{
    var response=await getData('products/display_all_products')
    setProducts(response.data)
}

useEffect(function(){
    fetchAllProducts()
},[])

const handleOpen=(rowData)=>{

}


    function displayproducts(){
        return(
                  <MaterialTable
                    title="Simple Action Preview"
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
            </div>

        </div>
    )
}