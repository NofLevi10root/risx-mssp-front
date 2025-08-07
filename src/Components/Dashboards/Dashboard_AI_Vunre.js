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

function Dashboard_AI_Vunre({
  show_SideBar,
  set_show_SideBar,
  set_visblePage,
}) {
  set_visblePage("dashboard-vulnerability-management");

  const {
    backEndURL,
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
      (link) => link.toolName === "AI vulnerability Dashboard"
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
            <p className="font-type-h3">Agentic AI vulnerability management</p>
          </div>
          <div className="top-of-page-center">
            {/* placeholder for dropDown */}
          </div>
        </div>

        <iframe
          src={dashboard_URL}
          height="1200"
          width="100%"
          className="kibana-iframe"
        ></iframe>
      </div>
    </>
  );
}

export default Dashboard_AI_Vunre;
