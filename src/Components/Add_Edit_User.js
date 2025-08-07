 
import React, { useEffect, useState ,useContext} from "react";
import '../Components/PopUp.css'; // import CSS file for modal styling
// import CloseButton from "./CloseButton";
import { ReactComponent as CloseButton } from './icons/ico-Close_type1.svg';
import { ReactComponent as IconCart } from './icons/ico-cart.svg';
import axios from 'axios';
// import Tools from '../tmpjsons/previewBoxesTools.json';
import { ReactComponent as IconTrash } from '../Components/icons/ico-trash.svg';
import GeneralContext from '../Context.js';
 
  export const Add_Edit_User = (props) => {
    const {popUp_show,
       set_popUp_show
          ,IconBIG,
             user_Info,
                    popUp_Add_or_Edit__status,
                    set_filter_Resource, 
                    set_PopUp_All_Good__txt,
                    set_PopUp_All_Good__show,
                    set_PopUp_Are_You_Sure__txt,
                    set_PopUp_Are_You_Sure__show,
                    Preview_this_Results,
                    set_Preview_this_Results,
                    

                  } = props;

const {   backEndURL,get_all_resource_types} = useContext(GeneralContext)
const [user_name, set_user_name]       = useState(user_Info?.user_name || '');
const [email, set_email]               = useState(user_Info?.email || '');
const [phone_number, set_phone_number] = useState(user_Info?.phone_number || '');
const [address, set_address]           = useState(user_Info?.address || '');
const [state, set_state]           = useState(user_Info?.state || '');


const [password, set_password] = useState('');
const [error_message, set_error_message] = useState("");




 
 console.log("user_Info",user_Info);

   const validateInputs = () => {
    if (!user_name.trim()) return "Username cannot be empty";
    if (!email.trim()) return "Email cannot be empty";
    if (!password.trim()) return "Password cannot be empty";
    // Add more validation as needed (e.g., email format, password strength)
    return null;
  };
     

 
     const Handele_are_you_sure_delete =(id ) =>{
 console.log("Handele_are_you_sure_delete 2" , id);
    set_popUp_show(false) /// the add adit popup
      
      set_PopUp_Are_You_Sure__txt({
          HeadLine:"Are you sure?",
          paragraph:"This User will be permanently deleted",
          buttonTrue:"Yes",
          buttonFalse:"No"
        });
        
        set_PopUp_Are_You_Sure__show(true)
      }
      







      
    const handleInputChange = (setter) => (event) => setter(event.target.value);
    useEffect(() => {  set_popUp_show(popUp_show) }, [popUp_show]);
  
 
    function handleClickOutside(e) {  // modal when user clicks outside of it
       if (e.target.className === 'PopUp-background') { set_popUp_show(false); } }
  
    function handleClose() {
      set_popUp_show(false);
 
    }
 
 
    useEffect(() => {
      if(popUp_Add_or_Edit__status == "add"){
        set_user_name("");
        set_email("");
        set_password("");
        set_phone_number("");
        set_address("");
        set_state("");
      }

     else if(popUp_Add_or_Edit__status == "edit"){
      set_user_name(user_Info?.user_name  || '');
      set_email(user_Info?.email  || '');
      set_phone_number(user_Info?.phone_number  || '');
      set_address(user_Info?.address  || '');
      set_state(user_Info?.state  || '');
      set_password("");
      }
    }, [ popUp_Add_or_Edit__status]); // Re-initialize state if `resourceItem` changes
  
 


//     function handle_add_or_edit_item(){
// const data = {
// "user_name": user_name,
// "email": email ,
// "password":password,
// }
 

//       if(popUp_Add_or_Edit__status == "add"){ 
   

//         const handleRegister = async (e) => {
//           e.preventDefault();
          
//           const validationError = validateInputs();
//           if (validationError) {
//             set_error_message(validationError);
//             return;
//           }
      
//           set_error_message('');
//           try {
//             const response = await axios.post(`${backEndURL}/users/create-user`, {
//               user_name,
//               email,
//               password
//             });
      
//             if (response.data.success) {
//               alert('Registration successful! Please log in.');
//               // navigate('/login');
//             } else {
//               set_error_message(response.data.message);
//             }
//           } catch (error) {
//             console.error('Registration error:', error);
//             if (error.response) {
//               // The request was made and the server responded with a status code
//               // that falls out of the range of 2xx
//               set_error_message(error.response.data.message || 'An error occurred during registration.');
//             } else if (error.request) {
//               // The request was made but no response was received
//               set_error_message('No response received from server. Please try again later.');
//             } else {
//               // Something happened in setting up the request that triggered an Error
//               set_error_message('An error occurred during registration. Please try again.');
//             }
//           }
//         };

        
//         // const handleRegister  = async()=>{
//         //   console.log("handleRegister this user",data);
//         //   try{
//         //     set_error_message("")
//         //       const response = await axios.post(`${backEndURL}/users/create-user`,data );

//         //       if(response){
//         //         console.log("ggggggggg1",response)
//         //         console.log("ggggggggg2",response.data.success)
//         //         console.log("ggggggggg3",response.data.message)
//         //         console.log("ggggggggg4",response.data.status)
//         //         console.log("ggggggggg5",response.status)
//         //         console.log("ggggggggg6",response.message)
//         //         ;}
                

//         //       if (response.data.success) {
//         //         // alert('Registration successful! Please log in.');
//         //        set_PopUp_All_Good__txt({ HeadLine:"Registration successful!", paragraph:"Please log in", buttonTitle:"Close"})
//         //        set_PopUp_All_Good__show(true)
//         //         // navigate('/login');
//         //       } else {
//         //         set_error_message(response.data.message);
//         //       }
//         //     } catch (error) {
//         //       console.error('Registration error:', error);
//         //       set_error_message('An error occurred during registration. Please try again.');
//         //     }



//         //       // if (res?.status === 200){ 
//         //       //   console.log("res.data" , res.data[0]);
//         //       //  set_filter_Resource({type_ids:[],tool_ids:[]})// for not have mistakealso will pull all list
//         //       //  get_all_resource_types(); // for count again

//         //       //  set_popUp_show(false) // close this popup
//         //       //  set_PopUp_All_Good__txt({ HeadLine:"Successfully Saved", paragraph:"The resource has been successfully saved in the database.", buttonTitle:"Close"})
//         //       //  set_PopUp_All_Good__show(true)



//         //       //    }} catch(err){ 
//         //       //       console.log(  err?.response?.data);  set_error_message(err?.response?.data)        } 
                  
                  
                  
                  
                  
                  
                  
                  
//         //           }








//               handleRegister ();     






//       }
    
    
    
//      else if(popUp_Add_or_Edit__status == "edit"){
//       console.log("data to edit =============== ",data);

//    const edit_Resouce = async()=>{
//     try{
//       set_error_message("")
//         const res = await axios.put(`${backEndURL}/resources`,data );
//         if (res?.status === 200){ 

// // update the object 
// set_filter_Resource({type_ids:[],tool_ids:[]})// for not have mistakealso will pull all list
// set_popUp_show(false) // close this popup
// set_PopUp_All_Good__txt({ HeadLine:"Successfully Updated", paragraph:"The resource has been successfully update in the database.", buttonTitle:"Close"})
// set_PopUp_All_Good__show(true)





//            }} catch(err){ 
//               console.log(  err?.response?.data);  set_error_message(err?.response?.data)        }  }
//               edit_Resouce();     
 


//       }
    


//     }

 
function handle_Registration_Successful(new_id){
  console.log("handle_Registration_Successful");
    set_error_message("");

  

const new_User = {
    user_id: new_id,
    type: "type1",
    email: email,
    Address:address,
    state: state,
    user_name: user_name,
    phone_number: phone_number,
    name: "First User",
    last_login:  "",
    createdAt: new Date(),
    updatedAt: new Date(),
}









    set_Preview_this_Results([...Preview_this_Results, new_User])

    set_PopUp_All_Good__txt({
      HeadLine:"Success",
      paragraph:"Registration successful",
      buttonTitle:"Close"
    });




    set_PopUp_All_Good__show(true);

    handleClose();
 


  }

  const handleRegister = async (e) => {
    // if (e && e.preventDefault) {
    //   e.preventDefault();
    // }
    
    const validationError = validateInputs();
    if (validationError) {
      set_error_message(validationError);
      return;
    }

    set_error_message('');


    try {
      const response = await axios.post(`${backEndURL}/users/create-user`, {
            user_name,
            email,
            password,
            type: "type1",
            address,
            state,
            phone_number,
      });

      if (response) {console.log("response.data",response.data); }


      if (response.data.success) {
        const new_id =  response.data.new_id
       
        handle_Registration_Successful(new_id);
        // alert('Registration successful! Please log in.');
        // navigate('/login');
      } else {
        set_error_message(response.data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        set_error_message(error.response.data.message || 'An error occurred during registration.');
      } else if (error.request) {
        // The request was made but no response was received
        set_error_message('No response received from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        set_error_message('An error occurred during registration. Please try again.');
      }
    }
  }
 

 
     

    return (
      <>
   






 {popUp_show && (
          <div className={`PopUp-background`} onClick={handleClickOutside}>
            
            <div className={`PopUp-content`} style={{width:"800px"}}>

<div className="display-flex justify-content-end  " style={{marginRight:"-40px"}}>
            <button className="PopUp-Close-btn" onClick={handleClose} ><CloseButton className="PopUp-Close-btn-img"/> </button>
            </div>



 
<div className='display-flex mb-d' ><IconBIG/> <p className='font-type-h4   Color-White ml-b'>
  {popUp_Add_or_Edit__status === "add" ? (<>Add User</>):(<>Edit User</> )} </p>
  
  
  
  
  </div>


<div className="items_top_center_buttom">

<div className="items_top">

<div className="items_left">
  


<div className=" " style={{display:"flex",  gap:"var(--space-d)"}}>


<div className="inputs">

<div>
<p className='font-type-menu  Color-Grey1 mb-a'>User Name</p>
<input className="input-type2  " type="text" value={user_name}      placeholder={user_Info?.Name || 'Choose Name'} onChange={handleInputChange(set_user_name)}/>
</div>

<div className="mt-c">
<p className='font-type-menu   Color-Grey1 mb-a '>Email</p>
<input className="input-type2 " type="text" value={email}      placeholder={user_Info?.email || 'Enter Valid Email'} onChange={handleInputChange(set_email)}/>
</div>

<div className="mt-c">
<p className='font-type-menu   Color-Grey1  mb-a'>Phone Number</p>
<input className="input-type2  " type="number" value={phone_number}      placeholder={user_Info?.PhoneNumber || '052..'} onChange={handleInputChange(set_phone_number)}/>
</div>

</div>


<div className="inputs">

<div className=" ">
<p className='font-type-menu   Color-Grey1  mb-a '>State </p>
<input className="input-type2 " type="text" value={state}      placeholder={user_Info?.state  || 'Select state'} onChange={handleInputChange(set_state)}/>
</div>

<div className="mt-c">
<p className='font-type-menu   Color-Grey1  mb-a '>Address</p>
<input className="input-type2  " type="text" value={address}      placeholder={user_Info?.Address || 'Your Address'} onChange={handleInputChange(set_address)}/>
</div>

{popUp_Add_or_Edit__status === "add" &&
<div className="mt-c">
<p className='font-type-menu   Color-Grey1 mb-a '>Password</p>
<input className="input-type2  " type="text" value={password}      placeholder={password || 'Enter Valid Password'} onChange={handleInputChange(set_password)}/>
</div>
}

</div>

</div>




 
</div>
 


</div>

 
 


 





{/* //////////////////// */}
 

  <div className="display-flex  ">
 




</div>  

</div>




        <div className='display-flex  mt-c' style={{     }}>
          <div style={{   marginLeft:"auto"  }}/> 
          {error_message === "" ? null :(  <p className='  font-type-menu   Color-Red  mr-b' >{error_message}</p>)}
      

          <div style={{marginLeft:"auto" ,display:"flex" ,alignItems:"center", justifyContent:"center", height:"22px"}}>
{popUp_Add_or_Edit__status === "edit" ? (<>
  <p className='column font-type-menu   Color-Grey1 mr-a '  >ID</p>
<p className=' font-type-txt     Color-Grey1 mr-a'>  {user_Info?.user_id}</p>

</>):null}


</div>

        {popUp_Add_or_Edit__status === "edit" &&     <button className="btn-type1"style={{marginRight:"5px"}}
         onClick={()=>Handele_are_you_sure_delete(user_Info?.user_id)}
        
        >
       
          
          <IconTrash className="icon-type1" />  </button>   }     
       <button className="btn-type2"
        onClick={popUp_Add_or_Edit__status === "add" && handleRegister   }  >
          <p className='font-type-menu '>{popUp_Add_or_Edit__status === "add" ? (<>Add</>):(<>Update</> )}</p></button>
     

      </div>

     
            </div>
          </div>)}
    
      </>
    );
  }
  
  