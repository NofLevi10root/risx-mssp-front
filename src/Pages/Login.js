import React , {useState , useEffect ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GeneralContext from '../Context.js';
 
import { ReactComponent as RisxMsspLogo } from '../Components/Logos/RisxMssp_logo_Standart.svg';
 
import { ReactComponent as IcoKey } from '../Pages/Login/Images/ico-login-key.svg';
import { ReactComponent as IcoUser } from '../Pages/Login/Images/ico-login-user.svg';

import { ReactComponent as Login_circle } from '../Pages/Login/Images/Login_circle.svg';
import { ReactComponent as Login_bar } from '../Pages/Login/Images/Login_bar.svg';


/// png & svg logos  
import Logo1 from '../Pages/Login/Images/OPENCTI.png';
import { ReactComponent as Logo2 } from '../Pages/Login/Images/TLSH.svg';
import { ReactComponent as Logo3 } from '../Pages/Login/Images/Kitty.svg';
import { ReactComponent as Logo4 } from '../Pages/Login/Images/10Root.svg';

import Logo5 from '../Pages/Login/Images/CAPE.png';
import { ReactComponent as Logo6 } from '../Pages/Login/Images/Velociraptor.svg';
import { ReactComponent as Logo7 } from '../Pages/Login/Images/Zircolite.svg';
import { ReactComponent as Logo8 } from '../Pages/Login/Images/Elasticsearch.svg';

import Logo9 from '../Pages/Login/Images/MISP.png';
import { ReactComponent as Logo10 } from '../Pages/Login/Images/dehashed.svg';
import { ReactComponent as Logo11 } from '../Pages/Login/Images/Nuclei.svg';
import { ReactComponent as Logo12 } from '../Pages/Login/Images/ELK.svg';

import Logo13 from '../Pages/Login/Images/Hasher.png';
import { ReactComponent as Logo14 } from '../Pages/Login/Images/Timesketch.svg';
 


import  './Login.css'
 

  
  
 
 
 
function Login({ set_show_SideBar, show_SideBar,set_visblePage}) {
  set_visblePage("login");
const [input_email, set_input_email]                   = useState("");
const [input_password, set_input_password] = useState("");

const necessaryUser1  = "DorAmit"
const necessaryUser2  = "YanivR"
const necessaryUser3  = "7Ci"
const necessaryUser4  = "admin@admin"
const necessaryUser5  = "ChallengeGroup"

const user4password   = "the1Admin"
const user3password   = "oBf5@$fj!cYT"

// challenge group

const  necessaryPassword  = "123" ;
const [errorMessage , set_errorMessage] = useState("");
const {   backEndURL } = useContext(GeneralContext)


///for logo animation
const [activeGroup, setActiveGroup] = useState('logoBulk1');
 
  
  const navigate = useNavigate();




  const valitator = () => {
    if (!input_email.trim()) {
      console.log("Email cannot be empty");
      set_errorMessage("Email cannot be empty"); return true;
    }
   else if (!input_password.trim()) {
      console.log("Password cannot be empty");
      set_errorMessage("Password cannot be empty"); return true;
    }
    else if (backEndURL === undefined) {
      console.log("backEndURL undefined");
      set_errorMessage("backEndURL undefined"); return true;
    }

    return null; // No error
  };



  const handleLogin = async (e) => {


    e.preventDefault();

  

    const validationError = valitator();

    if (validationError) { console.log("validationError find problem");  return; }



 
    set_errorMessage("")
    try {
      const response = await axios.post(`${backEndURL}/users/login`, {input_email , input_password }, {
        withCredentials: true // This is important for including cookies in the request
      });
      if (response.data.success) {
        console.log("response.data.success");

        // No need to manually store the token
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate(`/${"Modules"}`); 
      } else {
        console.log("response.data.success false");

        set_errorMessage(response.data.message)
  
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  }








    useEffect(() => {
      set_show_SideBar(false) 
        }, [show_SideBar]);
      
        const handlePasswordChange = (event) => {
          set_input_password(event.target.value);  
        };

        const handleUserChange = (event) => {
          set_input_email(event.target.value);  
        };


const handleClick = (event) => {

  event.preventDefault(); // Prevent form submission and page reload
  set_errorMessage("")
if ( necessaryUser1 === input_email  && necessaryPassword === input_password) {
  localStorage.setItem('username', "Dor Amit");  
  navigate(`/${"Modules"}`);  
}

else if ( necessaryUser2 === input_email  && necessaryPassword === input_password) {
  localStorage.setItem('username', "Yaniv Radunsky");  
  navigate(`/${"Modules"}`);  
}

else if ( necessaryUser3 === input_email  && user3password === input_password) {
  localStorage.setItem('username', necessaryUser3);  
  navigate(`/${"Modules"}`);  
}

else if ( necessaryUser4 === input_email  && user4password === input_password) {
  localStorage.setItem('username', "Admin");  
  navigate(`/${"Modules"}`);  
}


else if ( necessaryUser5 === input_email  && user3password === input_password) {
  localStorage.setItem('username', necessaryUser5);  
  navigate(`/${"Modules"}`);  
}





else{
  set_errorMessage("Username or Password Incorrect")
}

         
        };
        










        
        useEffect(() => {
          let nextGroup = 'logoBulk1';
          const interval = setInterval(() => {
            setActiveGroup(''); // Temporarily clear the active group to hide all
      
            setTimeout(() => {
              // Determine the next group
              if (nextGroup === 'logoBulk1') nextGroup = 'logoBulk2';
              else if (nextGroup === 'logoBulk2') nextGroup = 'logoBulk3';
              else if (nextGroup === 'logoBulk3') nextGroup = 'logoBulk4';
              else if (nextGroup === 'logoBulk4') nextGroup = 'logoBulk1';
              setActiveGroup(nextGroup); // Set the next group as active
            }, 500); // This timeout should match the fade-out animation duration
          }, 3000); // Total cycle duration
      
          return () => clearInterval(interval);
        }, []);

    return (
 
<>

<div className='login-page-all'> 

<div className='login-left-design'>


<Login_circle style={{
  position: "absolute",
  left: "0", 
  top: "0", 
  transform: "translate(-50%, -50%)",
  width: "35vw", 
  height: "35vw" 
   }}/> 

<div className='login-marketing-center'  style={{maxWidth:"760px"}}>
<h1 className='font-type-h1    Color-Grey5 mb-c'  style={{fontWeight:"600"}}><span className='Color-Blue-Glow '>All-in-one </span>Mssp for improved,<br/>  streamlined Cybersecurity</h1>
<h2 className='font-type-h5 reading-height-less Color-Grey5 mb-e' >Alongside our services, benefit from advanced risk management capabilities, sophisticated threat detection, proactive measures against attacks, and continuous monitoring to prevent data breaches and operational disruptions</h2>

<div className="logosBox-out  ">


<div className={`logosBox-in logoBulk1 ${activeGroup === 'logoBulk1' ? 'show fade-in' : 'fade-out'}`}>
<img src={Logo1} alt="OPENCTI" className='logos' /> 
<Logo2 className='logos'/>
<Logo3 className='logos'/>
<Logo4 className='logos'/>
  </div>

  <div className={`logosBox-in logoBulk2 ${activeGroup === 'logoBulk2' ? 'show fade-in' : 'fade-out'}`}>
<img src={Logo5} alt="CAPE" className='logos' /> 
<Logo6 className='logos'/>
<Logo7 className='logos'/>
<Logo8 className='logos'/>
  </div>

  <div className={`logosBox-in logoBulk3 ${activeGroup === 'logoBulk3' ? 'show fade-in' : 'fade-out'}`}>
<img src={Logo9} alt="MISP" className='logos' /> 
<Logo10 className='logos'/>
<Logo11 className='logos'/>
<Logo12 className='logos'/>
  </div>

  <div className={`logosBox-in logoBulk4 ${activeGroup === 'logoBulk4' ? 'show fade-in' : 'fade-out'}`}>
<img src={Logo13} alt="Hasher" className='logos' /> 
<Logo14 className='logos'/>
  </div>



</div>


</div>


</div>
 

 

<div className='login-right-design'> 


 <form className="login-form" >

<div className='mb-c' style={{width:"100%" ,  textAlign:"center"}}>  <RisxMsspLogo style={{height:"auto", width:"154px" }}/></div>


<p className='font-type-menu   Color-Grey1  ' >Login</p>

<div className="input-wrapper">
    <IcoUser />
    <input className="input-type2 mb-a " type="text"  value={input_email}  onChange={handleUserChange}  placeholder="Email" autoComplete="off" />
  </div>
  <div className="input-wrapper">
    <IcoKey />
    <input className="input-type2 mb-a " type="password"  value={input_password}  onChange={handlePasswordChange}   placeholder="Password" autoComplete="off" />
  </div>


 
  
 
<label className="container mb-a"> 
<input type="checkbox" defaultChecked />
<span className="checkmark "> </span>
<p className='font-type-txt  Color-Grey1  ' style={{marginTop:"1px", marginLeft:"7px"  }}>Remember me</p>

</label>
 

{/* <div style={{width:"100%" ,textAlign:"center"  }} className="mt-a "> */}


<div>
<button className="btn-type2 "
 style={{
  height:"40px" ,width:"100%"
  // paddingRight:"60px" ,paddingLeft:"45px"
 }} 


//  onClick={handleLogin}
  onClick={handleClick}
  >
    
    
    <p className='font-type-menu '>Log in</p>  </button> 
<p className='font-type-txt   Color-Red  ' style={{height:"20px", marginBottom:"-4px" ,marginTop:"2px"}}>{errorMessage}</p>

</div>

{/* </div> */}



<div
//  style={{  textAlign:"center" }}
 >
 
 <div>
 <p className='font-type-txt  make-underline-regular-txt Color-Grey1   '>No account yet? Sign Up</p>
 </div>
 <div>
 <p className='font-type-txt  make-underline-regular-txt Color-Grey1  '>Forgot Password?</p>
 </div>

 </div>


</form>


<Login_bar 

className="animated-login-bar"
style={{
  position: "absolute",
  left: "-92px", 
  bottom: "0",
  transform: "translate(-50%, 0)",
  // width: "370px",
  height: "",
 
   }}/> 

</div>






</div>
 
 
 
</>


    );
  }
  
  export default Login;

