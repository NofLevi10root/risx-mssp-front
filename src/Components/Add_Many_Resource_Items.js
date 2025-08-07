 
import React, { useEffect, useState } from "react";
import '../Components/PopUp.css'; // import CSS file for modal styling
// import CloseButton from "./CloseButton";
import { ReactComponent as CloseButton } from './icons/ico-Close_type1.svg';
// import { ReactComponent as IconCart } from './icons/ico-cart.svg';
import axios from 'axios';
// import Tools from '../tmpjsons/previewBoxesTools.json';
import { ReactComponent as IconTrash } from '../Components/icons/ico-trash.svg';
import GeneralContext from '../Context.js';
import { useContext } from "react";
  export const Add_Many_Resource_Items = (props) => {
    const {popUp_show,
       set_popUp_show
          ,IconBIG
           ,resourceItem,
            //  set_resourceItem,
                 item_types_list, 
                    set_PopUp_All_Good__txt,
                    set_PopUp_All_Good__show,
    
                    assets_list_from_db,
                    set_assets_list_from_db,
                    group_id
                  } = props;

const {all_Resource_Types ,all_Tools, backEndURL,get_all_resource_types} = useContext(GeneralContext)

     const [resource_string, set_resource_string] = useState(resourceItem?.resource_string || '');
     const [monitoring, set_monitoring] = useState(resourceItem?.monitoring === 1 ? true : false);
     const [description, setDescription] = useState(resourceItem?.description || '');
     const [resource_id, set_resource_id] = useState(resourceItem?.resource_id || '');
     const [error_message, set_error_message] = useState("");
     const [resource_type, set_resource_type] = useState({});
     const [item_tool_list, set_item_tool_list] = useState([]);

const handle_Tools_Checkbox_Change = (e, ToolId) => {
  console.log(e.target.checked);
        const isChecked = e.target.checked;
        if (isChecked) {
          set_item_tool_list([...item_tool_list, ToolId]); // Add the resourceTypeId to the array
        } else {
          set_item_tool_list(item_tool_list.filter(id => id !== ToolId)); // Remove the resourceTypeId from the array
        }
  
  
      };
  
 
 
    

    const handleInputChange = (setter) => (event) => setter(event.target.value);


  
    // function to close modal when user clicks outside of it
    function handleClickOutside(e) {
      // console.log("e.target.className" , e.target.className);
       if (e.target.className === 'PopUp-background') { set_popUp_show(false); } }
  
    function handleClose() { set_popUp_show(false);}
    
    function handle_add_or_edit_item(){
      const data = {
// "resource_id": resource_id,
"resource_string": resource_string,
"monitoring": monitoring ,
"description":description,
"item_tool_list": item_tool_list,
"item_types_list": [group_id]
      }
      // data.item_types_list.push(resource_id);

         console.log("data to add =============== ",data);

        const add_resource = async()=>{
          try{
            set_error_message("")
              const res = await axios.post(`${backEndURL}/resources/many`,data );
              if (res?.status === 200){ 
                console.log("res.data 22" , res.data);
                console.log("res.data 333" , res.data[0]);
              //  set_filter_Resource({type_ids:[],tool_ids:[]})// for not have mistakealso will pull all list

               // Update the state with the new array


               const filteredTools = all_Tools.filter(item => item_tool_list.includes(item.tool_id));
              const modifiedTools = filteredTools.map(({ tool_id, Tool_name }) => ({
                Toolid: tool_id,
                toolname: Tool_name
              }));

              const items =  res.data
              console.log("items1",items);

              items.forEach(item => {
                item.tools = modifiedTools; // Add the tools property
              });

              console.log("items2",items);

              

// console.log("assets_list_from_db 1",assets_list_from_db);

//               const item_and_tools = {...items,tools:modifiedTools} ;

              const updatedAssetsList = [...assets_list_from_db, ...items];
              set_assets_list_from_db(updatedAssetsList);

              console.log("assets_list_from_db 2",assets_list_from_db);
              // Update the state fo the big numbers
               get_all_resource_types();  

               set_popUp_show(false) // close this popup
               set_PopUp_All_Good__txt({ HeadLine:"Successfully Saved", paragraph:"The resource has been successfully saved in the database.", buttonTitle:"Close"})
               set_PopUp_All_Good__show(true)


                 }} catch(err){ 
                    console.log(  err?.response?.data);  set_error_message(err?.response?.data)        }  }
              add_resource();     

    
    
    
    
 


    }


    useEffect(() => {

      const found = all_Resource_Types.find((element) => element.resource_type_id === group_id);
      set_resource_type(found)

        // set_resource_id("");
        set_resource_string("");
        set_monitoring(true);
        setDescription("");
        set_item_tool_list(["0","0"])



        const filteredTools = all_Tools.filter(item => item.useResourceType.includes(group_id));
        console.log("filteredTools",filteredTools);
        const idArray = filteredTools.map(item => item.tool_id);
        console.log("idArray",idArray);
       set_item_tool_list(idArray);


        // const filterWithDelay = async () => {
        //   return new Promise((resolve) => {
        //     setTimeout(() => {


        //       const filteredTools = all_Tools.filter(item => item.useResourceType.includes(group_id));
        //       console.log("filteredTools",filteredTools);
        //       const idArray = filteredTools.map(item => item.tool_id);
        //       console.log("idArray",idArray);
        //      set_item_tool_list(idArray);


        //       resolve(idArray);
        //     }, 800); // 300 milliseconds = 0.3 seconds
        //   });
        // }
        // filterWithDelay();
 

    }, [ popUp_show]);  
 
 
    useEffect(() => {  set_popUp_show(popUp_show) }, [popUp_show]);




    return (
      <>
   


 {popUp_show && (
          <div className={`PopUp-background`} onClick={handleClickOutside}>
            
            <div className={`PopUp-content`} style={{width:"800px"}}>

<div className="display-flex justify-content-end  " style={{marginRight:"-40px"}}>
            <button className="PopUp-Close-btn" onClick={handleClose} ><CloseButton className="PopUp-Close-btn-img"/> </button>
            </div>

<div className='display-flex mb-d' >
  <IconBIG/> 
  <p className='font-type-h4   Color-White ml-b'>Bulk Add {resource_type?.resource_type_name}</p></div>

<div className="items_top_center_buttom">

<div className="items_top">

<div className="items_left">
  
{/* <div className="item_info_left">
<p className='font-type-menu   Color-Grey1 pb-b'>String</p>
<textarea className="input-type2 mb-a " type="text" value={resource_string}      placeholder={resourceItem?.Name || 'Name'} onChange={handleInputChange(set_resource_string)}/>
</div> */}

<div  className="item_info_left"  style={{width:"" ,height:"100%",minHeight:"200px"}}> 

<div style={{display:"flex" , justifyContent:"space-between"  }}>
<p className='font-type-menu   Color-Grey1 'style={{ marginBottom:'var(--space-a)'}}>{resource_type?.resource_type_name} Names</p>
<p className='font-type-txt   Color-Grey1  'style={{ marginBottom:'var(--space-a)'}}>Note: use comma ( , ) to separate.</p>   
</div>


<textarea  className="input-type2 reading-height  "   style={{width:"" ,height:"100%"}}  value={resource_string}      placeholder={`${resource_type?.resource_type_name}1,${resource_type?.resource_type_name}2,${resource_type?.resource_type_name}3... `}
     onChange={handleInputChange(set_resource_string)}
 />
 



 
 </div>
 <div className="item_info_left">
<p className='font-type-menu   Color-Grey1 ' style={{ marginBottom:'var(--space-a)'}}>Description</p>
<input className="input-type2 mb-a " type="text" value={description}      placeholder={'Description for all.. '} onChange={handleInputChange(setDescription)}/>
</div>

 {/* description, setDescription */}

 

</div>



</div>


<div>
<div style={{display:"flex" , justifyContent:"space-between"}}>
<p className='font-type-menu   Color-Grey1  'style={{ marginBottom:'var(--space-a)'}}>Modules</p>  
 <p className='font-type-txt   Color-Grey1  'style={{ marginBottom:'var(--space-a)'}}>Note: When adding assets, the intended modules are selected by default.</p>   
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

<div className="item_info_tools_box"> 

<div className="item_info_tools">
 
{all_Tools?.length === 0 && <div style={{  marginTop: "50px" }}> <p  className="font-type-menu  Color-Grey2" style={{   textAlign: "center" }}>Choose Resource Type..</p></div>}

{Array.isArray(all_Tools) && all_Tools?.map((Info, index) => {
  const checked = item_tool_list.find((type) => type == Info?.tool_id)

  // console.log("checked",checked);
    return (

<div className="toolsData  ">
<div className="toolsData-checkbox">

{/* tools_preview */}
  <label className="container" > 
  <input type="checkbox"
  value={item_tool_list}
   checked={checked}
 
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
 


</div>
</div>

</div>

        <div className='display-flex  mt-c' style={{     }}>
          <div style={{   marginLeft:"auto"  }}/> 
          {error_message === "" ? null :(  <p className='  font-type-menu   Color-Red  mr-b' >{error_message}</p>)}
      
        <button className="btn-type2" onClick={handle_add_or_edit_item}  ><p className='font-type-menu '> Save </p></button>
     

      </div>

     
            </div>
          </div>)}
    
      </>
    );
  }
  
  