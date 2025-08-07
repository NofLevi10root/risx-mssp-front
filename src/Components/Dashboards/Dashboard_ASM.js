import React, { useState, useEffect, useContext } from "react";
import {
  PreviewBox_type1_number_no_filters,
  PreviewBox_type3_bar,
  PreviewBox_type2_pie,
} from "../PreviewBoxes.js";
import { ReactComponent as IconSearch } from "../icons/ico-search.svg";
import axios from "axios";
import "./../ResourceGroup/ResourceGroup.css";
import GeneralContext from "../../Context.js";

import {
  format_date_type_a,
  format_date_type_c,
} from "../Features/DateFormat.js";
import { fix_path } from "../Dashboards/functions_for_dashboards.js";

function Dashboard_ASM({
  show_SideBar,
  set_show_SideBar,
  set_unseen_alert_number,
  set_visblePage,
}) {
  set_visblePage("dashboard-asm");

  const {
    backEndURL,
    all_Resource_Types,
    all_artifacts,
    user_id,
    mssp_config_json,
    front_IP,
    front_URL,
  } = useContext(GeneralContext);
  const [Preview_this_Results, set_Preview_this_Results] = useState([]);
  const [filter_Resource, set_filter_Resource] = useState({
    type_ids: [],
    tool_ids: [],
  });
  const [loader, set_loader] = useState(false);
  const [last_updated, set_last_updated] = useState({ default: 0 });
  const [Status_Legend, set_Status_Legend] = useState({});
  const [counts, setCounts] = useState([]);
  const [display_this, set_display_this] = useState("");
  const [dashboard_URL, set_dashboard_URL] = useState("");
  // dont show sidebar in this page
  useEffect(() => {
    if (show_SideBar === false) {
      set_show_SideBar(true);
    }
  }, []);

  useEffect(() => {
    if (!mssp_config_json) {
      return;
    }
    const moduleLinks = Array.isArray(mssp_config_json?.moduleLinks)
      ? mssp_config_json.moduleLinks
      : [];
    // console.log("moduleLinks" , moduleLinks);

    const threatHuntingURL = moduleLinks.find(
      (link) => link.toolName === "ASM Dashboard"
    )?.toolURL;
    // console.log("threatHuntingURL" , threatHuntingURL);

    const fixed_path = fix_path(threatHuntingURL, front_IP, front_URL);
    set_dashboard_URL(fixed_path);
  }, [mssp_config_json]);

  return (
    <>
      <div className="app-main">
        <div className="top-of-page">
          <div className="top-of-page-left mb-b">
            {/* <p className="font-type-menu">Dashboards:</p> */}
            <p className="font-type-h3">Attack Surface Management</p>
          </div>
          <div className="top-of-page-center">
            {/* placeholder for dropDown */}
          </div>

          {/* <div className='top-of-page-right'>
<input className="input-type1 mr-a" placeholder="Search" />
<button className="btn-type1 "><IconSearch className="icon-type1" />  </button>
</div> */}
        </div>

        <div className="resource-group-top-boxes mb-c">
          {/* 
<PreviewBox_type1_number_no_filters
HeadLine="Nuclei Insights Tagged: Critical(*)"
resource_type_id={null}
BigNumber={37773113}// BigNumber={Preview_this_Results?.length ? (Preview_this_Results.length):(0) }
// SmallNumber={9}
SmallNumberTxt={"Nuclei"}
StatusColor={"Critical"}
  date={"NA"}// date={format_date_type_a(last_updated?.Total) || "NA"}
is_popup={false}
display_this={display_this}
set_display_this={set_display_this}
display_this_value={""}
txt_color={""}
/>

<PreviewBox_type2_pie
HeadLine="Nuclei Insights by Severity(*)"
bar_numbers={["4","32","261","113" ]}
bar_headlines = { ['Critical', 'High', 'Medium', 'Low'] }
bar_title_legend = {["total"]}
is_popup = {false}
colors={"Alert"} // Basic , Alert
/>
 <PreviewBox_type1_number_no_filters
HeadLine="Nuclei Insights Tagged: High(*)"
resource_type_id={null}
BigNumber={8342}// BigNumber={Preview_this_Results?.length ? (Preview_this_Results.length):(0) }
// SmallNumber={9}
SmallNumberTxt={"Nuclei"}
StatusColor={"high"}
  date={"NA"}// date={format_date_type_a(last_updated?.Total) || "NA"}
is_popup={false}
display_this={display_this}
set_display_this={set_display_this}
display_this_value={""}
txt_color={""}
/> */}
        </div>
        <iframe
          src={dashboard_URL}
          height="1200"
          width="100%"
          className="kibana-iframe"
        ></iframe>
        {/*<div className='resource-group-all-the-Lists'>
  <Results_list Preview_this_Results={Preview_this_Results} set_Preview_this_Results={set_Preview_this_Results} filter_Resource={filter_Resource} set_filter_Resource={set_filter_Resource} loader={loader}   set_loader={set_loader} /> 
</div>*/}
      </div>
    </>
  );
}

export default Dashboard_ASM;
