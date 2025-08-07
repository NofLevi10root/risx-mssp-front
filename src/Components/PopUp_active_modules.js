 
import React, { useEffect, useState ,useContext} from "react";
import GeneralContext from '../Context.js';
import './PopUp.css'; // import CSS file for modal styling
import { ReactComponent as CloseButton } from '../Components/icons/ico-Close_type1.svg';
import {ReactComponent as SuccessIcon} from '../Components/icons/General-icons-success.svg';
import axios from 'axios';



const downloadJsonFile = (file) => {
  console.log(file);
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "data.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};









 export const PopUp_before_active_module____Nuclei = (props) => {
    const {  popUp_show, set_popUp_show ,logoAddress_1_ForSrc   ,IconAddressForSrc, popUp_iconSize ,
        Show_PopUp_before_active_module_id,
         set_Show_PopUp_before_active_module_id} = props;
         const {   backEndURL ,moduleLinks, examInnterval_minutes } = useContext(GeneralContext);
         const [PopUp_after_active, set_PopUp_after_active] = useState(false);
         const [nuclei_single_target, set_nuclei_single_target] = useState("");
         const [nuclei_multi_target, set_nuclei_multi_target] = useState([]);
         const [error_message_for_single_target, set_error_message_for_single_target] = useState("");
         const [error_message_for_multi_target, set_error_message_for_multi_target] = useState("");
         const [resources_data_from_db, set_resources_data_from_db] = useState([]);

         const [expiretime, set_expiretime] = useState(60);
         

         const get_resource_from_db = async(resource_types)=>{
          const  filter_Resource  =  {type_ids:resource_types, tool_ids:[]} ;
           try{
             console.log("get_data_from_sql");
          
             const res = await axios.get(`${backEndURL}/Resources/all-resource-filtered`,{ params: filter_Resource});
               if (res){console.log(res.data);}
               set_resources_data_from_db(res.data)
           }
         catch(err){console.log(err);}
         }
 useEffect(() => {get_resource_from_db(["2002","2001"]) }, []);


//  examInnterval_minutes
 
 
useEffect(() => { 

 const tool_from_config_file = moduleLinks.filter(module => module.toolID === Show_PopUp_before_active_module_id);
const expiretime_1 = tool_from_config_file[0]?.expiretime
 
if (expiretime_1 === undefined || expiretime_1 === null ||  expiretime_1 === "" ||  expiretime_1 === 0 ){return}

 set_expiretime(expiretime_1)
 }, []);


 


         const Handle_send_request= async(request)=>{
          try{
            let string_to_nuclei =""
            set_error_message_for_single_target("")
            set_error_message_for_multi_target("")
  
  if(request === "single"){ string_to_nuclei = nuclei_single_target}
  else if(request === "multi"){
    if(nuclei_multi_target.length === 0){ set_error_message_for_multi_target("choose at least 1"); return } 
    else{ const joint1 = nuclei_multi_target.join();  string_to_nuclei = joint1  }
    
  }   
 
              const res = await
              axios.get(`${backEndURL}/tools/active-module`, {
                params: {
                 module_id: Show_PopUp_before_active_module_id ,
                 nuclei_targets:string_to_nuclei,
                 threshold_in_minutes:expiretime,
                 examInnterval_minutes:examInnterval_minutes,
                }
              });
                
      
              if(res.data === "good"){onSuccess(); }
             else if(res.data !== "good"){
               console.log(
                  res.data.response,
                  
                  "make a new pop up for not ");}
                 }catch(err)
                 {console.log(err.response.data)
                  
                  set_error_message_for_single_target(err?.response?.data)
                  ;}
          }
      

    useEffect(() => {  set_popUp_show(popUp_show) }, [popUp_show]);
    const onSuccess = () => {set_PopUp_after_active(true); };
 
  function handleClickOutside(e) {
 
    //   console.log("e.target.className" , e.target.className);

      if (e.target.className === 'PopUp-background') {
        handleClose();
        // console.log("handleClickOutside");
        // set_Show_PopUp_before_active_module_id('')
        // set_popUp_show(false);
   
      }
    }
  
    function handleClose() {
 
        set_Show_PopUp_before_active_module_id('')
      set_popUp_show(false);
 
    }

    const handle_Tools_Checkbox_Change = (e, resource_string) => {
    
      console.log(e);
console.log(e.target);
console.log(e.target.checked);
      const isChecked = e.target.checked;

      if (isChecked) {
        set_nuclei_multi_target([...nuclei_multi_target, resource_string]); // Add the resourceTypeId to the array
      } else {
        set_nuclei_multi_target(nuclei_multi_target.filter(x => x !== resource_string)); // Remove the resourceTypeId from the array
      }


    };
  

const select_all_resorces=(e) =>{

  if(e){
    const tmp_array = []
    for (let index = 0; index < resources_data_from_db.length; index++) {
      tmp_array.push(resources_data_from_db[index]?.resource_string )
      
    }
    set_nuclei_multi_target(tmp_array)

  }
 
 


 
}

 

    return (
      <>
   


 {popUp_show && (
          <div className={`PopUp-background`} onClick={handleClickOutside}>
            
            <div className={`PopUp-content`} style={{width:"80%",maxWidth:PopUp_after_active ? "480px" : "1000px"}}>

<div className="display-flex justify-content-end  " style={{marginRight:"-40px"}}>
            <button className="PopUp-Close-btn" onClick={handleClose} ><CloseButton className="PopUp-Close-btn-img"/> </button>
            </div>


{PopUp_after_active ?   (<>


    {IconAddressForSrc !== undefined && IconAddressForSrc !== "" ? (<><img src={IconAddressForSrc} alt="Icon" width={popUp_iconSize === "Big" ? "200"  : "70" }  height={popUp_iconSize === "Big" ? "100"  : "70" }  className='mb-a'   style={{ marginLeft: popUp_iconSize === "Big" && "-15px" , marginBottom: popUp_iconSize === "Big" && "5px"  } }/> </>):null}
    <SuccessIcon className="mb-a "
alt="Icon" width="100px" height="70px"    style={{ marginLeft:"-15px" }}
/>
                <p className="font-type-h4 Color-White mb-c">Request has been sent to Nuclei</p>
                <p  className="font-type-txt  reading-height Color-White"  >The analysis time between one domain and another may be different</p>
                <div className='display-flex mt-c' style={{  }}>
                <button className="btn-type2" onClick={handleClose}  style={{marginLeft:"auto"}} ><p className='font-type-menu '>Close</p>  </button> 
                </div>


</>):(<>

    {IconAddressForSrc !== undefined && IconAddressForSrc !== "" ? (<><img src={IconAddressForSrc} alt="Icon" width={popUp_iconSize === "Big" ? "200"  : "70" }  height={popUp_iconSize === "Big" ? "100"  : "70" }  className='mb-a'   style={{ marginLeft: popUp_iconSize === "Big" && "-15px" , marginBottom: popUp_iconSize === "Big" && "5px"  } }/> </>):null}
                
                <p className="font-type-h4 Color-White mb-c">Insert Data to Nuclei</p>
                <p  className="font-type-txt  reading-height Color-White"  >Insert a domain or select several domains from the list, The analysis time between one domain and another may be different</p>






<div className="item_info_left mt-c">
<p className='font-type-menu   Color-Grey1 pb-b'>Enter Single URL</p>
<input className="input-type2 mb-a " type="text"
//  style={{width:"100%"}}
  value={nuclei_single_target} 
placeholder={'http..'}
onChange={(e) => set_nuclei_single_target(e.target.value)} // Corrected onChange event
 />
</div>

<div className='display-flex mt-b' style={{  }}>
                <div style={{marginRight:"auto"}}/>


                {error_message_for_single_target === "" ? null :(  <p className='  font-type-menu   Color-Red  mr-b' >{error_message_for_single_target}</p>)}
                <button className="btn-type2" onClick={()=>Handle_send_request("single")} ><p className='font-type-menu '>Active</p>  </button> 

                </div>




<p className='font-type-menu   Color-Grey1   '>Use from resource list</p>
<div className="item_info_tools_all mt-b">

<div className="titles mb-c"   >
<label className="container" style={{visibility:"hidden"}}> 
<input type="checkbox" 
// defaultChecked 
// onChange={(e) =>  select_all_resorces(e.target.checked)}
/>
<span className="checkmark"></span>
</label>
<p className='column font-type-menu   Color-Grey1 column-small  '>Type</p>
<p className='column font-type-menu   Color-Grey1 '>String</p>
<p className='column font-type-menu   Color-Grey1 column-small justify-content-center  ' style={{marginRight:"15px"}}>Description</p>
 
</div>

<div className="item_info_tools_box"> 
<div className="item_info_tools">
 
{Array.isArray(resources_data_from_db) && resources_data_from_db?.map((Info, index) => {
    return (

<div className="toolsData  " key={index}>
<div className="toolsData-checkbox">

<label className="container" > 
<input type="checkbox"
 value={Info?.resource_string}
// checked={item_tool_list.find((type) => type == Info?.tool_id    )}
  onChange={(e) => handle_Tools_Checkbox_Change(e,Info?.resource_string)}
/>
<span className="checkmark"></span>
</label>
</div>

 
 <div className='column column-small  '>
  
 {/* <p className='   font-type-txt   Color-Blue-Glow tagit_type1' > */}
  
 {  Info?.types  === null   ||  Info?.types  === undefined   ||    Info?.types  === ""  ?
  (<p className='ml-a    font-type-txt   Color-Red   '> Undefined  </p> ) : null  }

{/* if there is only one type */}
{Info?.types?.length === 1
  &&  Info?.types[0]?.resource_type_id !== null &&  Info?.types[0]?.resource_type_id !== "" &&  Info?.types[0]?.resource_type_id !== undefined
  ? (<p className='ml-a  font-type-txt   Color-Grey1 tagit_type1 '>{Info?.types[0]?.resource_type_name}</p> ) : null  }


{/* 2 types */}
{Info?.types?.length === 2
  &&  Info?.types[0]?.resource_type_id !== null &&  Info?.types[0]?.resource_type_id !== "" &&  Info?.types[0]?.resource_type_id !== undefined
  ? (<>
  <p className='ml-a  font-type-txt    Color-Grey1 tagit_type1 tagit_type2_on_popup'>{Info?.types[0]?.resource_type_name}</p>
  <p className='ml-a  font-type-txt    Color-Grey1 tagit_type1 tagit_type2_on_popup'>{Info?.types[1]?.resource_type_name}</p>
  </> ) : null  }

{/* > 2 types */}
{Info?.types?.length > 2
  &&  Info?.types[0]?.resource_type_id !== null &&  Info?.types[0]?.resource_type_id !== "" &&  Info?.types[0]?.resource_type_id !== undefined
  ? (<><p className='ml-a  font-type-txt    Color-Grey1 tagit_type1 tagit_type2_on_popup'>{Info?.types[0]?.resource_type_name}</p>  <p className=' ml-a font-type-txt   Color-Grey1  '>+{Info?.types?.length -1} More</p></>) : null  }

  {/* </p>   */}

 </div>

<p className='column-for-txt font-type-txt     Color-Grey1'>{Info?.resource_string}</p>
<p className='column-for-txt  column-small font-type-txt     Color-Grey1'>{Info?.description}</p>
</div>
   
 
    );
  })}

</div>
</div>
</div>

                <div className='display-flex mt-b' style={{  }}>
                <p  className="font-type-very-sml-txt   Color-Grey1 mr-a" >By:</p>
                <img src={logoAddress_1_ForSrc} alt="logo" maxwidth="140px" height="30"  style={{marginRight:"auto"}}/>

                {error_message_for_multi_target === "" ? null :(  <p className='  font-type-menu   Color-Red  mr-b' >{error_message_for_multi_target}</p>)}
                <button className="btn-type2" onClick={()=>Handle_send_request("multi")} ><p className='font-type-menu '>Active</p>  </button> 

                </div>

   
  
  </>)}




 
              
            
            </div>
          </div>)}
    
      </>
    );
  }

  