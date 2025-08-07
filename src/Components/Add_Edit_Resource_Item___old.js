 
import React, { useEffect, useState } from "react";
import '../Components/PopUp.css'; // import CSS file for modal styling
// import CloseButton from "./CloseButton";
import { ReactComponent as CloseButton } from './icons/ico-Close_type1.svg';
import { ReactComponent as IconCart } from './icons/ico-cart.svg';
import axios from 'axios';
// import Tools from '../tmpjsons/previewBoxesTools.json';
import { ReactComponent as IconTrash } from '../Components/icons/ico-trash.svg';
import GeneralContext from '../Context.js';
import { useContext } from "react";
  export const Add_Edit_Resource_Item = (props) => {
    const {popUp_show,
       set_popUp_show
          ,IconBIG
           ,resourceItem,
             set_resourceItem,
                 item_types_list, 
                  set_item_types_list,
                  item_tool_list,
                   set_item_tool_list,
                    popUp_Add_or_Edit__status,
                    set_filter_Resource, 
                    set_PopUp_All_Good__txt,
                    set_PopUp_All_Good__show,
                    Preview_this_Resource,
                    set_Preview_this_Resource,
    
                    set_PopUp_Are_You_Sure__txt,
                    set_PopUp_Are_You_Sure__show
                  } = props;

const {all_Resource_Types ,all_Tools, backEndURL,get_all_resource_types} = useContext(GeneralContext)




     const [resource_string, set_resource_string] = useState(resourceItem?.resource_string || '');
     const [monitoring, set_monitoring] = useState(resourceItem?.monitoring === 1 ? true : false);
     const [description, setDescription] = useState(resourceItem?.description || '');
     const [resource_id, set_resource_id] = useState(resourceItem?.resource_id || '');
     const [error_message, set_error_message] = useState("");
     const [tools_preview, set_tools_preview] = useState(  []);



    console.log("item_tool_list ------------------------------",item_tool_list);
     console.log("tools_preview ------------------------------",tools_preview);
     console.log("item_types_list ------------------------------",item_types_list);


     const Handele_are_you_sure =( ) =>{
   console.log("resource_id" ,resource_id);
    set_popUp_show(false) /// the add adit popup
      
      set_PopUp_Are_You_Sure__txt({
          HeadLine:"Are you sure you want to delete?",
          paragraph:"This record will be permanently deleted from the database",
          buttonTrue:"Yes",
          buttonFalse:"No"
        });
        
        set_PopUp_Are_You_Sure__show(true)
      }
      

  
    const handle_Types_Checkbox_Change = (e, resourceTypeId) => {





      const isChecked = e.target.checked;

      if (isChecked) {
        set_item_types_list([...item_types_list, resourceTypeId]); // Add the resourceTypeId to the array
      } else {
        set_item_types_list(item_types_list.filter(id => id !== resourceTypeId)); // Remove the resourceTypeId from the array
      }



   
    };


const handle_Tools_Checkbox_Change = (e, ToolId) => {
console.log(e.target.checked);
      const isChecked = e.target.checked;
      if (isChecked) {
        set_item_tool_list([...item_tool_list, ToolId]); // Add the resourceTypeId to the array
      } else {
        set_item_tool_list(item_tool_list.filter(id => id !== ToolId)); // Remove the resourceTypeId from the array
      }

   console.log("item_tool_list" , item_tool_list);
    };


    const change_tools_preview_acording_asset_types=()=>{
if(item_types_list.length === 0 ){ set_tools_preview([]); return}


const filtered_tools = all_Tools.filter(tool =>
  item_types_list.some(item_type =>
      tool.useResourceType.includes(item_type)
  )
);
set_tools_preview(filtered_tools);
console.log("filtered_tools",  filtered_tools);


    }



    // useEffect(() => { 
  
    //   if(popUp_Add_or_Edit__status == "add" ){
    //     const idArray = tools_preview.map(item => item.tool_id);
    //   console.log("אאאאאאאאאאאאאא", tools_preview);
    //   console.log("אאאאאאאאאאאאאא"   , idArray);
    //  set_tools_preview(idArray);
    // }
    
    //  }, []);


    useEffect(() => { change_tools_preview_acording_asset_types(); }, [item_types_list]);



    const handleInputChange = (setter) => (event) => setter(event.target.value);
    useEffect(() => {  set_popUp_show(popUp_show) }, [popUp_show]);
  
 

    // function to close modal when user clicks outside of it
    function handleClickOutside(e) {
      // console.log("e.target.className" , e.target.className);
       if (e.target.className === 'PopUp-background') { set_popUp_show(false); } }
  
    function handleClose() {
      set_popUp_show(false);
 
    }
 




    
    function handle_add_or_edit_item(){
      // popUp_Add_or_Edit__status

      const data = {
"resource_id": resource_id,
"resource_string": resource_string,
"monitoring": monitoring ,
"description":description,
"item_tool_list": item_tool_list,
"item_types_list": item_types_list 
      }
 


 
      if(popUp_Add_or_Edit__status == "add"){ 
        console.log("data to add =============== ",data);
        const add_resource = async()=>{
          try{
            set_error_message("")
              const res = await axios.post(`${backEndURL}/resources`,data );

if(res){
  // console.log("ssssssssssssss popUp_Add_or_Edit__status sssssssssssssssssssss",res.data);
}

              if (res?.status === 200){ 
                console.log("res.data" , res.data[0]);
               set_filter_Resource({type_ids:[],tool_ids:[]})// for not have mistakealso will pull all list
               get_all_resource_types(); // for count again

               set_popUp_show(false) // close this popup
               set_PopUp_All_Good__txt({ HeadLine:"Successfully Saved", paragraph:"The resource has been successfully saved in the database.", buttonTitle:"Close"})
               set_PopUp_All_Good__show(true)



                 }} catch(err){ 
                    console.log(  err?.response?.data);  set_error_message(err?.response?.data)        }  }
              add_resource();     

      }
    
    
    
     else if(popUp_Add_or_Edit__status == "edit"){
      console.log("data to edit =============== ",data);

   const edit_Resouce = async()=>{
    try{
      set_error_message("")
        const res = await axios.put(`${backEndURL}/resources`,data );
        if (res?.status === 200){ 

// update the object 
set_filter_Resource({type_ids:[],tool_ids:[]})// for not have mistakealso will pull all list
set_popUp_show(false) // close this popup
set_PopUp_All_Good__txt({ HeadLine:"Successfully Updated", paragraph:"The resource has been successfully update in the database.", buttonTitle:"Close"})
set_PopUp_All_Good__show(true)





           }} catch(err){ 
              console.log(  err?.response?.data);  set_error_message(err?.response?.data)        }  }
              edit_Resouce();     
 


      }
    


    }


 
    useEffect(() => {
      if(popUp_Add_or_Edit__status == "add"){
        console.log("come clean");
        set_resource_id("");
        set_resource_string("");
        set_monitoring(true);
        setDescription("");
        set_item_tool_list([]);
        set_item_types_list([]);
      }

     else if(popUp_Add_or_Edit__status == "edit"){
      set_resource_id(resourceItem?.resource_id  || '');
      set_resource_string(resourceItem?.resource_string  || '');
      set_monitoring(resourceItem?.monitoring === 1 ? true : false);

   
      setDescription(resourceItem?.description || '');
  
      }
   



    }, [ popUp_Add_or_Edit__status]); // Re-initialize state if `resourceItem` changes
  
 
       
 
     

    return (
      <>
   


 {popUp_show && (
          <div className={`PopUp-background`} onClick={handleClickOutside}>
            
            <div className={`PopUp-content`} style={{width:"800px"}}>

<div className="display-flex justify-content-end  " style={{marginRight:"-40px"}}>
            <button className="PopUp-Close-btn" onClick={handleClose} ><CloseButton className="PopUp-Close-btn-img"/> </button>
            </div>



 
<div className='display-flex mb-d' ><IconBIG/> <p className='font-type-h4   Color-White ml-b'>
  {popUp_Add_or_Edit__status === "add" ? (<>Add Asset</>):(<>Edit Asset</> )}
 
  </p></div>


<div className="items_top_center_buttom">

<div className="items_top">

<div className="items_left">
  
<div 
className="item_info_left"
>
<p className='font-type-menu   Color-Grey1 pb-b'>String</p>
<input className="input-type2 mb-a " type="text"
//  style={{width:"100%"}}
  value={resource_string}      placeholder={resourceItem?.Name || 'Name'}
     onChange={handleInputChange(set_resource_string)}
 />
</div>


 

 <div  className="item_info_left"  style={{width:"" ,height:"100%"}}> 
<p className='font-type-menu   Color-Grey1 '>Description</p>
<textarea  className="input-type2 reading-height  "   style={{width:"" ,height:"100%"}}  value={description}      placeholder={resourceItem?.Description || 'Description'}
     onChange={handleInputChange(setDescription)}
 />
 
 </div>






 
</div>

<div className="item_info_left "> 
<p className='font-type-menu   Color-Grey1 '>Asset Type</p>
<div className="item_info_tools_all">
<div className="">
{Array.isArray(all_Resource_Types) &&  all_Resource_Types?.map((Info, index) => {
 
 

    return (

<div key={index} className="toolsData  " style={{width:"180px"}}>
  <div className="toolsData-checkbox " >
  <label className="container" >  
  <input type="checkbox"
  value={item_types_list}
 checked={item_types_list.find((type) => type  == Info?.resource_type_id)}
 onChange={(e) => handle_Types_Checkbox_Change(e, Info?.resource_type_id)}
 />
  <span className="checkmark"></span>
  </label>
  </div>

 <div className='  'style={{marginTop:"auto"}}>
 <p className='    font-type-txt   Color-Grey1 tagit_type1 tagit_type2_on_popup' >{Info?.resource_type_name}  </p>  
 </div>

</div>
   
 
    );
  })}
</div>
</div>

</div>


</div>


<div className="item_info_tools_all"
//  style={{height:"100px"}}
 >
{/* {item_types_list.length != 0 &&  } */}
<div className="titles mb-c"  style={{visibility:item_types_list.length === 0 && "hidden"}}>
<label className="container" style={{visibility:"hidden"}}> 
<input type="checkbox" 
// defaultChecked 
/>
<span className="checkmark"></span>
</label>
<p className='column font-type-menu   Color-Grey1 column-small'>Name</p>
<p className='column font-type-menu   Color-Grey1 '>Description</p>
<p className='column font-type-menu   Color-Grey1 column-small justify-content-center  mr-b'>Developer</p>
 
</div>

<div className="item_info_tools_box"
 
 > 



<div className="item_info_tools"
 >
 

 {tools_preview?.length === 0 && <div style={{  marginTop: "50px" }}> <p  className="font-type-menu  Color-Grey2" style={{   textAlign: "center" }}>Choose Resource Type..</p></div>}

{Array.isArray(tools_preview) && tools_preview?.map((Info, index) => {
 
 

    return (

<div className="toolsData  "
>
  

 
  <div className="toolsData-checkbox">

{/* tools_preview */}
  <label className="container" > 
  <input type="checkbox"
  value={item_tool_list}


  // defaultChecked={true}
  checked={
    // popUp_Add_or_Edit__status === "edit" &&
    item_tool_list.find((type) => type == Info?.tool_id) }
    
    
    // ||

    // popUp_Add_or_Edit__status === "add" &&
    // item_tool_list.includes(Info?.tool_id)
    //  }

     
  onChange={(e) => handle_Tools_Checkbox_Change(e,Info?.tool_id)}
  />
  <span className="checkmark"></span>
  </label>
  </div>
  
 

 <div className='column column-small  '>
  
 <p className='   font-type-txt   Color-Blue-Glow tagit_type1' >{Info?.Tool_name}</p>  

 </div>
 
<p className='column-for-txt font-type-txt     Color-Grey1'>{Info?.description_short}</p>
 
  <div className='column column-small justify-content-center'> 
  <img className='velociraptor-EndpointModules-logo   '          src={Info?.logoAddress_1 ? require(`${Info.logoAddress_1}`) : undefined}></img>
 
  </div>
 
</div>
   
 
    );
  })}

</div>
</div>



 


</div>

<div className="display-flex  ">
 <div className="display-flex  ">
<label className="switch"> <p className='column font-type-menu   Color-Grey1 '>Start Monitoring</p>

  <input type="checkbox" 
 checked={monitoring}
 onChange={()=>set_monitoring(!monitoring)}
  // defaultChecked={Math.random() < 0.7}
   />
  <span className="slider round"></span> 
</label>
</div>



<div style={{marginLeft:"auto" ,display:"flex" ,alignItems:"center", justifyContent:"center", height:"22px"}}>
{popUp_Add_or_Edit__status === "edit" ? (<>
  <p className='column font-type-menu   Color-Grey1 mr-a '  >ID</p>
<p className=' font-type-txt     Color-Grey1'>  {resource_id}</p>

</>):null}


</div>
</div>

</div>

        <div className='display-flex  mt-c' style={{     }}>
          <div style={{   marginLeft:"auto"  }}/> 
          {error_message === "" ? null :(  <p className='  font-type-menu   Color-Red  mr-b' >{error_message}</p>)}
      
        {popUp_Add_or_Edit__status === "edit" &&     <button className="btn-type1"style={{marginRight:"5px"}} onClick={Handele_are_you_sure}><IconTrash className="icon-type1" />  </button>   }     
       <button className="btn-type2" onClick={handle_add_or_edit_item}  ><p className='font-type-menu '>{popUp_Add_or_Edit__status === "add" ? (<>Save</>):(<>Update</> )}</p></button>
     

      </div>

     
            </div>
          </div>)}
    
      </>
    );
  }
  
  