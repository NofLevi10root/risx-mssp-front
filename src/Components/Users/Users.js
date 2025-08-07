import React , {useState , useEffect ,useContext} from 'react';
import Users_list from '../Users/Users_list.jsx'
import axios from 'axios';
// import './../ResourceGroup/ResourceGroup.css';
import GeneralContext from '../../Context.js';

import { format_date_type_a,format_date_type_c } from '../Features/DateFormat.js';


function Users({show_SideBar,set_show_SideBar,set_unseen_alert_number,set_visblePage}) {
  // set_visblePage("Users");

    const {   backEndURL  ,all_Resource_Types ,all_artifacts,user_id} = useContext(GeneralContext);
    const [Preview_this_Results, set_Preview_this_Results] = useState([]);
    const [filter_Resource, set_filter_Resource] = useState({type_ids:[],tool_ids:[]});
    const [loader , set_loader] = useState(true)
    const [last_updated , set_last_updated] = useState({default:0})
    const [Status_Legend , set_Status_Legend] = useState({})
    const [counts, setCounts] = useState([]);



  // dont show sidebar in this page
    useEffect(() => {  if (show_SideBar === false) {set_show_SideBar(true)}}, []);




useEffect(() => { 
 
    const get_all_users = async()=>{ 
if (backEndURL === undefined){return}

    try{
        set_loader(true)
        console.log("try get_all_users");
        const res = await axios.get(`${backEndURL}/users`);
        if (res){
          console.log("get_all_users-2",res.data);
          // console.log("typeof",typeof res.data);

            if (res.data === undefined) { console.log("no files ..............,"  ); return}
            if (res.data.length == 0) { console.log("no files ..............,"  ); }
      
          // localStorage.setItem(user_id + '_seeResults', res.data?.results_list?.length);
          // set_unseen_alert_number(0);
          // set_last_updated(res.data?.latest_dates);
           set_Preview_this_Results(res.data);


 
            set_loader(false)
    }}
    catch(err){
        set_loader(false)
        console.log(err);}
                // }





}
    get_all_users();  }, [filter_Resource, backEndURL]);



 

    return (
 
<>

 
<div className='resource-group-all-the-Lists'>

{/*  */}
 <Users_list Preview_this_Results={Preview_this_Results} set_Preview_this_Results={set_Preview_this_Results} filter_Resource={filter_Resource} set_filter_Resource={set_filter_Resource}/>

 

</div>


 
</>


    );
  }
  
  export default Users;

