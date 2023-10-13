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
        const[files,setFiles]=useState([])
        

        const modules = useMemo(() => ({
          toolbar: {
            container: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', "strike"],
              [{ 'list': 'ordered' }, { 'list': 'bullet' },
              { 'indent': '-1' }, { 'indent': '+1' }],
              ['image', "link",'video'],
              [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }]
            ],
            
          },
        }), [])
  
      const handleQuill = (newValue) => {
          setDescription(newValue)
          if (newValue.trim() !== '') {
              handleError('', 'description');
          }
      }
     

        const handleError=(error,label)=>{
            setErrors((prev)=>({...prev,[label]:error}))
        }
    
        const validation=()=>{
            var error=false
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
            if(description.length==0)
            {
              error=true
              handleError('Please Enter Description','description')
              
            }
            if(files.length==0)
            {
                error=true
                handleError('Please upload Picture','files')
            }
            if (price.length==0)
            {
              error=true
              handleError('Please Enter Price','price')
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
      
       
    
        const handleSubmit=async()=>{
            var val=validation()
            if (val==false)
            {
          var formData=new FormData()
            formData.append('productid',productId)
            formData.append('categoryid', categoryId)
            formData.append('brandid', brandId)
            formData.append('description', description)
            formData.append('modelno', modelNo)
            formData.append('color', color)
            formData.append('price', price)
            formData.append('offerprice', offerPrice)
            formData.append('stock', stock)
            formData.append('status', status)
            formData.append('hsncode', hsnCode)
            files.map((file,index)=>{
                formData.append('picture'+index, file)
              })
    
          var response=await postData('productdetails/submit_productdetails',formData)
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
            <FormHelperText style={{color:'#FF0000'}}>{errors.categoryId}</FormHelperText>
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
            <FormHelperText style={{color:'#FF0000'}}>{errors.brandId}</FormHelperText>
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
            <FormHelperText style={{color:'#FF0000'}}>{errors.productId}</FormHelperText>
          </FormControl>
                        </Grid>
    
                        <Grid item xs={4}>
                <TextField
                value={modelNo}
                onChange={(event)=>setModelNo(event.target.value)}
                onFocus={()=>handleError('','modelNo')}
                error={errors?.modelNo}
                helperText={errors?.modelNo}
                label="Model No" fullWidth/>
              </Grid>

              <Grid item xs={4}>
                <TextField
                value={color}
                onChange={(event)=>setColor(event.target.value)}
                onFocus={()=>handleError('','color')}
                error={errors.color}
                helperText={errors.color}
                label="Color" fullWidth/>
              </Grid>

              <Grid item xs={4}>
                <TextField
                value={hsnCode}
                onChange={(event)=>setHsnCode(event.target.value)}
                onFocus={()=>handleError('','hsnCode')}
                error={errors.hsnCode}
                helperText={errors.hsnCode}
                label="HSN Code" fullWidth/>
              </Grid>

              <Grid item xs={6}>
                <TextField
                value={price}
                onChange={(event)=>setPrice(event.target.value)}
                onFocus={()=>handleError('','price')}
                error={errors.price}
                helperText={errors.price}
                label="Price" fullWidth/>
              </Grid>

              <Grid item xs={6}>
                <TextField
                value={offerPrice}
                onChange={(event)=>setOfferPrice(event.target.value)}
                onFocus={()=>handleError('','offerPrice')}
                error={errors.offerPrice}
                helperText={errors.offerPrice}
                label="Offer Price" fullWidth/>
              </Grid>

                     
              <Grid item xs={6}>
                <TextField
                value={stock}
                onChange={(event)=>setStock(event.target.value)}
                onFocus={()=>handleError('','stock')}
                error={errors.stock}
                helperText={errors.stock}
                label="Stock" fullWidth/>
              </Grid>

              <Grid item xs={6}>
                        <FormControl>
                            <FormLabel>Status</FormLabel>
                            <RadioGroup row value={status} onChange={(event) => setStatus(event.target.value)}>
                                <FormControlLabel value='continue' control={<Radio />} label="Continue" />
                                <FormControlLabel value='discontinue' control={<Radio />} label="Discountinue" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <ReactQuill modules={modules} theme="snow" value={description} onChange={handleQuill} />
                        <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: '0' }}>{errors.description}</p>
                    </Grid>

                    <Grid item xs={12} className={classes.center}>
                    <div style={{width:'100%'}}>
                    <DropzoneArea  acceptedFiles={['image/*']} dropzoneText={"Drag and drop an image here or click"}  onChange={(files) => setFiles(files)} filesLimit={7} fullWidth />  
                     </div>      
                    </Grid>
                    <Grid item xs={12}>
                        <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: '0' }}>{errors.files}</p>
                    </Grid>


                    <Grid item xs={6} className={classes.center}>
                        <Button onClick={handleSubmit} variant="contained" fullWidth style={{ background: '#004cef', padding: '5% 0', fontWeight: '500' }}>Add</Button>
                    </Grid>
                    <Grid item xs={6} className={classes.center}>
                        <Button onClick={handleReset} variant="contained" fullWidth style={{ background: '#004cef', padding: '5% 0', fontWeight: '500' }}>Reset</Button>
                    </Grid>

                    


              


            
                </Grid>
               </div>
            </div>
        )
    }