import React, { useState, useEffect, useContext, useRef } from "react";
import {
  PreviewBox_type1_number_no_filters,
  PreviewBox_type3_bar,
  PreviewBox_type4_legend2,
} from "../PreviewBoxes.js";
// import Results_list from "./Results_list.jsx";
import axios from "axios";
import "./../ResourceGroup/ResourceGroup.css";
import "./Dashboard_iframes.css";
import { fix_path } from "../Dashboards/functions_for_dashboards.js";

import GeneralContext from "../../Context.js";

// import { format_date_type_a,  format_date_type_c,} from "../Features/DateFormat.js";

function Dashboard_Threat_Hunting({
  show_SideBar,
  set_show_SideBar,
  set_visblePage,
}) {
  set_visblePage("dashboard-threat-hunting");

  const {
    // backEndURL,
    // all_Resource_Types,
    // all_artifacts,
    // user_id,
    mssp_config_json,
    front_IP,
    front_URL,
  } = useContext(GeneralContext);

  const [dashboard_URL, set_dashboard_URL] = useState("");

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
    const threatHuntingURL = moduleLinks.find(
      (link) => link.toolName === "Threat Hunting Dashboard"
    )?.toolURL;
    const fixed_path = fix_path(threatHuntingURL, front_IP, front_URL);
    set_dashboard_URL(fixed_path);
  }, [mssp_config_json]);

  return (
    <>
      <div className="app-main">
        <div className="top-of-page">
          <div className="top-of-page-left mb-b">
            {/* <p className="font-type-menu ">Dashboards:</p> */}
            <p className="font-type-h3">Threat Hunting</p>
          </div>
          <div className="top-of-page-center">
            {/* placeholder for dropDown */}
          </div>
        </div>
        {/* 
        <div className="resource-group-top-boxes mb-c">
          <PreviewBox_type1_number_no_filters
            HeadLine="Eventlog Insights Tagged: High(*)"
            resource_type_id={null}
            BigNumber={3} // BigNumber={Preview_this_Results?.length ? (Preview_this_Results.length):(0) }
            // SmallNumber={9}
            SmallNumberTxt={"Hayabusa"}
            StatusColor={"high"}
            date={"NA"} // date={format_date_type_a(last_updated?.Total) || "NA"}
            is_popup={false}
            display_this={display_this}
            set_display_this={set_display_this}
            display_this_value={"Overall Clients"}
            txt_color={""}
          />

          <PreviewBox_type1_number_no_filters
            HeadLine="Eventlog Insights Tagged: Critical(*)"
            resource_type_id={null}
            BigNumber={1} // BigNumber={Preview_this_Results?.length ? (Preview_this_Results.length):(0) }
            // SmallNumber={9}
            SmallNumberTxt={"Hayabusa"}
            StatusColor={"critical"}
            date={"NA"} // date={format_date_type_a(last_updated?.Total) || "NA"}
            is_popup={false}
            display_this={display_this}
            set_display_this={set_display_this}
            display_this_value={"Overall Clients"}
            txt_color={""}
          />

          <PreviewBox_type1_number_no_filters
            HeadLine="Windows Hardening Insights Tagged: High(*)"
            resource_type_id={null}
            BigNumber={11} // BigNumber={Preview_this_Results?.length ? (Preview_this_Results.length):(0) }
            // SmallNumber={9}
            SmallNumberTxt={"Kitty"}
            StatusColor={"high"}
            date={"NA"} // date={format_date_type_a(last_updated?.Total) || "NA"}
            is_popup={false}
            display_this={display_this}
            set_display_this={set_display_this}
            display_this_value={"Overall Clients"}
            txt_color={""}
          />

          <PreviewBox_type1_number_no_filters
            HeadLine="Windows Hardening Insights Tagged: Critical(*)"
            resource_type_id={null}
            BigNumber={8} // BigNumber={Preview_this_Results?.length ? (Preview_this_Results.length):(0) }
            // SmallNumber={9}
            SmallNumberTxt={"Kitty"}
            StatusColor={"critical"}
            date={"NA"} // date={format_date_type_a(last_updated?.Total) || "NA"}
            is_popup={false}
            display_this={display_this}
            set_display_this={set_display_this}
            display_this_value={"Overall Clients"}
            txt_color={""}
          />

          <PreviewBox_type1_number_no_filters
            HeadLine="Persistence Insights Tagged: High"
            resource_type_id={null}
            BigNumber={37} // BigNumber={Preview_this_Results?.length ? (Preview_this_Results.length):(0) }
            // SmallNumber={9}
            SmallNumberTxt={"Persistence"}
            StatusColor={"high"}
            date={"NA"} // date={format_date_type_a(last_updated?.Total) || "NA"}
            is_popup={false}
            display_this={display_this}
            set_display_this={set_display_this}
            display_this_value={"Overall Clients"}
            txt_color={""}
          />

        </div> */}

        <iframe
          src={dashboard_URL}
          height="1200"
          width="100%"
          className="kibana-iframe"
        ></iframe>
        {/*   <div className="resource-group-all-the-Lists">
         <Results_list Preview_this_Results={Preview_this_Results} set_Preview_this_Results={set_Preview_this_Results} filter_Resource={filter_Resource} set_filter_Resource={set_filter_Resource} loader={loader}   set_loader={set_loader} /> 
        </div>*/}
      </div>
    </>
  );
}

export default Dashboard_Threat_Hunting;
