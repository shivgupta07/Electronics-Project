import list from "../../assets/list.png"
import {useNavigate} from "react-router-dom"


export default function Heading(props){
    var navigate=useNavigate()
    return(
        <div style={{display:'flex',flexDirection:'row'}} >
        <div>
            <img src={props.image} width="30" />
        </div>
        <div style={{fontFamily:'kanit',fontsize:25,fontWeight:'bold', paddingLeft:7}}>
            {props.caption}
        </div>
        <div style={{marginLeft:'auto', cursor:'pointer'}}>
            <img src={list} width="30" onClick={()=>navigate(props.link)}/>
        </div>

        </div>
    )
}