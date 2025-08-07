import React , {useState , useEffect ,useContext} from 'react';
 


import axios from 'axios';
import './../Settings/Settings.css';
import './custom-json-view.css';
import GeneralContext from '../../Context.js';
import JsonView from '@uiw/react-json-view';
import {PopUp_All_Good } from '../PopUp_Smart.js'

function Settings_section_edit_mssp_config_json({show_SideBar,set_show_SideBar,set_unseen_alert_number, }) {
 
 
    // const [loader , set_loader] = useState(true)
 const {     moduleLinks,mssp_config_json, set_mssp_config_json} = useContext(GeneralContext);
 const [tmp_moduleLinks, set_tmp_moduleLinks] = useState(moduleLinks);
 const [save_btn, set_save_btn] = useState(false);

  
 const handleInputChangeGenerator = (index) => (e) => {
  const newModuleLinks = [...moduleLinks];  // Create a copy of moduleLinks array
  newModuleLinks[index].toolURL = e.target.value;  // Update the toolURL of the specific element
 set_tmp_moduleLinks(newModuleLinks);  // Update state with the new array
 set_save_btn(true);

};


 
 
        
const handle_Save_config = () => {


  console.log("tmp_moduleLinks",tmp_moduleLinks);
  handleClose();};
         
 

function handleClose() {

}


useEffect(() => {  if (show_SideBar === false) {set_show_SideBar(true)}}, []);

 


    return (
 <>
 
 
 <div>
<p className='font-type-h4 Color-White mb-c'>mssp_config.json</p>
<table className='setting_table  ' style={{lineHeight:"100%"}}>
                     
                     <tbody  className="tbody_setting">  
                                    <tr >
                                    <td className="setting_descriptions setting_descriptions" >
                                    <p className='font-type-menu Color-White  mb-a'  >Module paths</p>
                                    <p className='font-type-txt Color-Grey1 '>The changes will be reflected after saving and re-entering</p>
                                    </td>
                                    {/* moduleLinks */}

                                    {Array.isArray(tmp_moduleLinks) && tmp_moduleLinks?.map((Info, index) => {
  const handleInputChange = handleInputChangeGenerator(index);  // Generate handleInputChange function for each index

  return (
    <tr className='' key={index} style={{ height: "50px" }}>
      <td className="" style={{ width: "auto", paddingRight: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        <p className='font-type-txt Color-White'>{Info?.toolName}</p>
      </td>
      <td className="" style={{ width: "100%" }}>
        <input  className="input-type4"  placeholder={Info?.toolURL}  value={Info?.toolURL}  onChange={handleInputChange}  />
      </td>
    </tr>
  );
})}
 
                  
                                </tr>
                    
                     
                                </tbody> 
                    </table>
{save_btn && 
 <div  style={{ marginBottom:"var(--space-d)" ,marginTop:"var(--space-a)" , display:'flex' ,justifyContent:"end", gap:"var(--space-b)"}}>
 <button className="btn-type2" style={{ }} onClick={handle_Save_config}  ><p className='font-type-menu '>Save</p></button> 
</div>


}




</div>
 
 
 </>


 

    );
  }
  
  export default Settings_section_edit_mssp_config_json;
