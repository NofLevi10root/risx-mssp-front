import React, { useState , useContext ,useEffect} from 'react'
 
import { ReactComponent as IconBIG } from '../icons/ico-users.svg';
import { ReactComponent as Loader } from '../icons/loader_typea.svg';
 import ResourceGroup_Action_btns from '../ResourceGroup/ResourceGroup_Action_btns.jsx';
 import ResourceGroup_buttomLine from '../ResourceGroup/ResourceGroup_buttomLine.jsx';
 import axios from 'axios';
 import GeneralContext from '../../Context.js';
 import { format_date_type_a ,format_date_type_c} from '../Features/DateFormat.js';
import {PopUp_All_Good ,PopUp_Request_info ,PopUp_Under_Construction,PopUp_Are_You_Sure} from '../PopUp_Smart.js'
import {Add_Edit_User  } from '../Add_Edit_User.js'



 
 import LMloader from "../Features/LMloader.svg";
 import './Users_list.css'
function Users_list({
  Preview_this_Results ,
  set_Preview_this_Results,
   loader ,
    set_loader,
    filter_Resource,
    set_filter_Resource
  }) {
    const {  backEndURL ,all_Tools } = useContext(GeneralContext);
    const [is_search, set_is_search] = useState(false);

    const [PopUp_Under_Construction__show, set_PopUp_Under_Construction__show] =useState(false);
    const [PopUp_Under_Construction__txt, set_PopUp_Under_Construction__txt] = useState({ HeadLine: "Coming Soon!", paragraph: "We are working on creating this section. Stay tuned for updates as we finalize the details.", buttonTitle: "Close",});
  


  const [PopUp_All_Good__show, set_PopUp_All_Good__show] = useState(false);
  const [PopUp_All_Good__txt, set_PopUp_All_Good__txt] = useState({
    HeadLine:"Success",
    paragraph:"successfully",
    buttonTitle:"Close"
  });


  const [PopUp_Request_info__show, set_PopUp_Request_info__show] = useState(false);
  const [PopUp_Request_info__txt, set_PopUp_Request_info__txt] = useState({
    HeadLine:"In process",
    paragraph:"The request has been sent",
    buttonTitle:"Close"
  });

  const [popUp_Add_or_Edit__show, set_popUp_Add_or_Edit__show] = useState(false);
  const [popUp_Add_or_Edit__status, set_popUp_Add_or_Edit__status] = useState("edit");

  const [PopUp_Are_You_Sure__show, set_PopUp_Are_You_Sure__show] = useState(false);
  const [PopUp_Are_You_Sure__txt, set_PopUp_Are_You_Sure__txt] = useState({
    HeadLine:"Are You Sure?",
    paragraph:"The record will be deleted from the system",
    buttonTrue:"True",
    buttonFalse:"False"
  });

  const [user_Info, set_user_Info] = useState([]);
  

  const  handle_delete_user = () =>{
    console.log("handle_delet_user" ,user_Info );
 

    set_PopUp_Are_You_Sure__show(false)
    set_PopUp_Under_Construction__show(true)
    }



  const  handle_add_user = (add_or_edit,Info) =>{
    console.log("handle_add_user" ,add_or_edit );
    set_user_Info(Info);
    // set_item_types_list([])
    // set_item_tool_list([])
  
   set_popUp_Add_or_Edit__status(add_or_edit)
  set_popUp_Add_or_Edit__show(true)
    }
  
    const handleClickComingSoon = () => {
      set_PopUp_Under_Construction__txt({
        HeadLine: "Coming Soon!",
        paragraph: `We are working on creating this feature. Stay tuned for updates as we finalize the details.`,
        buttonTitle: "Close",
      });
      set_PopUp_Under_Construction__show(true);
    };



 return (
 
 <div className='ResourceGroup-All' style={{  display: "flex", flexDirection: "column" ,height:"100%" }}>
  


  {PopUp_Are_You_Sure__show &&
 <PopUp_Are_You_Sure
 popUp_show={PopUp_Are_You_Sure__show}
 set_popUp_show={set_PopUp_Are_You_Sure__show}

 HeadLine={PopUp_Are_You_Sure__txt.HeadLine}
 paragraph={PopUp_Are_You_Sure__txt.paragraph} 

 button_True_text={PopUp_Are_You_Sure__txt.buttonTrue}
 button_False_text={PopUp_Are_You_Sure__txt.buttonFalse}

 True_action={handle_delete_user}
 False_action={()=>set_PopUp_Are_You_Sure__show(false)}
 /> 
 }






  {PopUp_Under_Construction__show && (
<PopUp_Under_Construction
popUp_show={PopUp_Under_Construction__show}
set_popUp_show={set_PopUp_Under_Construction__show}
HeadLine={PopUp_Under_Construction__txt.HeadLine}
paragraph={PopUp_Under_Construction__txt.paragraph}
buttonTitle={PopUp_Under_Construction__txt.buttonTitle}
/>
)}

  {popUp_Add_or_Edit__show && 
<Add_Edit_User
popUp_show={popUp_Add_or_Edit__show}
set_popUp_show={set_popUp_Add_or_Edit__show}
popUp_Add_or_Edit__status={popUp_Add_or_Edit__status}

IconBIG={IconBIG}
 
 
set_filter_Resource={set_filter_Resource}

set_PopUp_All_Good__txt={set_PopUp_All_Good__txt}
set_PopUp_All_Good__show={set_PopUp_All_Good__show}

set_PopUp_Are_You_Sure__show={set_PopUp_Are_You_Sure__show}
set_PopUp_Are_You_Sure__txt={set_PopUp_Are_You_Sure__txt}
user_Info={user_Info}
Preview_this_Results={Preview_this_Results}
set_Preview_this_Results={set_Preview_this_Results}


       />}


{PopUp_Request_info__show &&
 <PopUp_Request_info
 popUp_show={PopUp_Request_info__show}
 set_popUp_show={set_PopUp_Request_info__show}
 HeadLine={PopUp_Request_info__txt.HeadLine}
 paragraph={PopUp_Request_info__txt.paragraph} 
buttonTitle={PopUp_Request_info__txt.buttonTitle}
 /> 
 }


{PopUp_All_Good__show &&
 <PopUp_All_Good
 popUp_show={PopUp_All_Good__show}
 set_popUp_show={set_PopUp_All_Good__show}
 HeadLine={PopUp_All_Good__txt.HeadLine}
 paragraph={PopUp_All_Good__txt.paragraph} 
buttonTitle={PopUp_All_Good__txt.buttonTitle}
 /> 
 }
 


<div className='resource-group-list-headline mb-c ' >
<div className='resource-group-list-headline-left ' ><IconBIG/> <p className='font-type-h4   Color-White ml-b'>Users List</p></div>

 <ResourceGroup_Action_btns
  items_for_search={Preview_this_Results}
  set_items_for_search={set_Preview_this_Results}
  set_is_search={set_is_search}

  btn_add_single_show={true}
  btn_add_single_action={handle_add_user}
  btn_add_single_value={"add"}

  btn_add_many_show={false}
  // btn_add_single_action={add_resource_item}

  btn_trash_show={true} 
  btn_trash_action={handleClickComingSoon}
  btn_trash_id={"tmp"}
  
  btn_gear_show={true} 
  btn_gear_action={handleClickComingSoon}
  btn_gear_id={""}

 />
 
</div>

{loader ? (<>

<div className='  loader-type-a' > <Loader/> {/* <img  src={LMloader} className="" alt="Loading Resources"/> */}</div>
</>):(


  <>
<div className='resource-group-list-keyNames mb-a  '  >
<div className='resource-group-list-item list-item-big  ml-a '><p className='font-type-menu  make-underline Color-Grey1 ml-a '>User Name</p></div>
<div className='resource-group-list-item list-item-small'><p className='font-type-menu  make-underline Color-Grey1 '>Email</p></div>
<div className='resource-group-list-item list-item-small'><p className='font-type-menu  make-underline Color-Grey1 '>Type</p></div>
<div className='resource-group-list-item list-item-small'><p className='font-type-menu  make-underline Color-Grey1 '>State</p></div>
<div className='resource-group-list-item list-item-small'><p className='font-type-menu  make-underline Color-Grey1 '>Created</p></div>
<div className='resource-group-list-item list-item-small' style={{marginRight:"26px"}}><p className='font-type-menu  make-underline Color-Grey1 '>Last Login</p></div>
{/* <div className='its-only-space-for-the-scroller    '/>  */}
</div>

 
<div className='resource-group-list-box mb-c' style={{height:"auto"}}>
  {Array.isArray(Preview_this_Results) && Preview_this_Results?.map((Info, index) => {
    return (
<div className='resource-group-list-line' key={index}onClick={()=>handle_add_user("edit",Info)}>

<div className='ml-a  resource-group-list-item   list-item-big' > <p className="ml-a  font-type-txt  Color-Grey1  ">{Info?.user_name}</p> </div>
<p className='resource-group-list-item  font-type-txt  Color-Grey1  list-item-small'>{ Info?.email }</p> 
<div className='resource-group-list-item display-flex list-item-small' > <p className="font-type-txt   Color-Blue-Glow tagit_type1">{Info?.type === "type1" && "Admin"}{Info?.type === "type2" && "Editor"} {Info?.type === "type3" && "Viewer"}</p> </div>
 <p className='resource-group-list-item  font-type-txt  Color-Grey1  list-item-small'>{ Info?.state}</p> 
 <p className='resource-group-list-item  font-type-txt  Color-Grey1  list-item-small'> { Info?.createdAt &&  format_date_type_a(Info?.createdAt)}</p> 



 
<p className='resource-group-list-item  font-type-txt  Color-Grey1  list-item-small'>{ Info?.last_login &&  format_date_type_a(Info?.last_login)}</p> 

</div>
 
    );
  })}


{Preview_this_Results?.length === 0 &&   is_search === true &&
<div style={{  height:"100%" ,display:"flex",justifyContent:"center", alignItems:"center"}}>
<p className='  font-type-txt   Color-Grey1 '   >
No Records for this search.
</p>
</div>
}
</div>
{/* <ResourceGroup_buttomLine records_number={Preview_this_Results?.length || 0}/> */}
</>
)}

 




</div>
 


    );
  }
  
  export default Users_list;

