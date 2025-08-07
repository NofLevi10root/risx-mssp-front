import React, { useState, useEffect, useContext } from "react";
import "./Dashboard_iframes.css";
import GeneralContext from "../../Context.js";
import { fix_path, Make_url_from_id } from "./functions_for_dashboards.js";

export default function Dashboard_Alerts({
  show_SideBar,
  set_show_SideBar,
  set_visblePage,
  visblePage,
}) {
  set_visblePage("dashboard-alerts");

  const [iframe_url, set_iframe_url] = useState("");
  const { backEndURL, mssp_config_json, front_IP, front_URL } =
    useContext(GeneralContext); // dont show sidebar in this page

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
    const CTIDashboardURL = moduleLinks.find(
      (link) => link.toolName === "Alerts Dashboard"
    )?.toolURL;
    const fixed_path = fix_path(CTIDashboardURL, front_IP, front_URL);
    set_iframe_url(fixed_path);
  }, [mssp_config_json]);

  return (
    <>
      <div className="app-main">
        <div className="top-of-page">
          <div className="top-of-page-left mb-b">
            {/* <p  className="font-type-menu" >Dashboards:</p> */}
            <p className="font-type-h3">Alerts Dashboard</p>
          </div>
          <div className="top-of-page-center">
            {/* placeholder for dropDown */}
          </div>

          {/* <div className='top-of-page-right'>
<input className="input-type1 mr-a" placeholder="Search" />
<button className="btn-type1 "><IconSearch className="icon-type1" />  </button>
</div> */}
        </div>

        <div>
          <iframe
            src={iframe_url}
            className="iframe_full_screen"
            title={visblePage}
          ></iframe>
        </div>
      </div>
    </>
  );
}
