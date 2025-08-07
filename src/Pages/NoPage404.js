import React , {useState , useEffect} from 'react';
 
import { ReactComponent as Login_circle } from '../Pages/Login/Images/Login_circle.svg';
import { ReactComponent as Login_bar } from '../Pages/Login/Images/Login_bar.svg';
import  './NoPage404.css'
 
function NoPage404( ) {

  
 
    return (
 
<>

<div className='login-page-all'> 

<div className='nopage-design' >


<Login_circle style={{
  position: "absolute",
  left: "0", 
  top: "0", 
  transform: "translate(-50%, -50%)",
  width: "35vw", 
  height: "35vw" 
   }}/> 

<div className='login-marketing-center'  style={{maxWidth:"750px"}}>
<h1 className='font-type-h1    Color-White  '  style={{fontWeight:"600"}}>Where will you go?</h1>
<h1 className='font-type-h1     Color-Blue-Glow mb-c'  style={{fontWeight:"600" ,fontSize:"251px" ,lineHeight:"90%"}}>404</h1>
 
</div>
<Login_bar style={{
  position: "absolute",
  right: "0px", 
  bottom: "0",
  transform: "translate(0, 0)",
  // width: "370px",
  height: "",
 
   }}/> 

</div>


</div>
 

 
 



 
 
 
</>


    );
  }
  
  export default NoPage404;

