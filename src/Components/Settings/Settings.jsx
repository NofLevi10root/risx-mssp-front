import React, { useState, useEffect, useContext } from "react";

import { ReactComponent as IconSearch } from "../icons/ico-search.svg";
import axios from "axios";
import "./../Settings/Settings.css";
// import './../Settings/Settings_section_config.jsx';
import Settings_section_config from "./Settings_section_config.jsx";
import Settings_section_ShowInUi from "./Settings_section_ShowInUi.jsx";
import Settings_section_process from "./Settings_section_process.jsx";
import Settings_section_edit_mssp_config_json_paths from "./Settings_section_edit_mssp_config_json_paths.jsx";
// import Settings_section_edit_mssp_config_json_dashboards_paths from "./Settings_section_edit_mssp_config_json_dashboards_paths.jsx";
import { Search_comp, Search_comp_for_logs } from "../Features/Search_comp.jsx";

import Settings_section_logs from "./Settings_section_logs.jsx";
import Users from "../Users/Users.js";
import { PopUp_Under_Construction } from "../PopUp_Smart.js";

import Settings_Menu from "./Settings_Menu.jsx";

import GeneralContext from "../../Context.js";
import VeloConfigMain from "../VeloConfig/VeloConfigMain";
import { AlertsSettings } from "../Alerts/Alert_Settings.jsx";
import { ShowRuleModal } from "../AI_Vulnerability/ShowRule.jsx";
import AI_Vulnerability from "../AI_Vulnerability/AI_Vulnerability.jsx";
import Settings_section_MCP from "./Settings_section_MCP.jsx";

function Settings({
  show_SideBar,
  set_show_SideBar,
  set_unseen_alert_number,
  set_visblePage,
  isMainProcessWork,
  set_isMainProcessWork,
}) {
  set_visblePage("Settings");

  const { all_Tools, front_URL } = useContext(GeneralContext);
  const [Preview_This_comp, set_Preview_This_comp] = useState("Main Config");
  const [Preview_This_in_menu, set_Preview_This_in_menu] =
    useState("Main Config");
  const [show_nested, set_show_nested] = useState([]);

  const [PopUp_Under_Construction__show, set_PopUp_Under_Construction__show] =
    useState(false);
  const [PopUp_Under_Construction__txt, set_PopUp_Under_Construction__txt] =
    useState({
      HeadLine: "Coming Soon!",
      paragraph:
        "We are working on creating this section. Stay tuned for updates as we finalize the details.",
      buttonTitle: "Close",
    });
  const [filter_string, set_filter_string] = useState("");
  const [tmp_data, set_tmp_data] = useState("tmp_data");

  const handle_Click_Btn = (value, is_nasted, show_nested, fater_value) => {
    // console.log("Preview_This_comp" , Preview_This_comp);
    // console.log("value        fater_value"    , fater_value);
    // console.log("value             value"    , value);
    // console.log("value        22222"    , value != fater_value);

    if (is_nasted === false) {
      if (value != fater_value) {
        console.log("he has a father");
        console.log("i am your fater ", fater_value);
        set_Preview_This_comp(value);
        set_Preview_This_in_menu(fater_value);
        return;
      } else {
        set_show_nested((prev) => [...prev, value]);
        set_Preview_This_comp(value);
        set_Preview_This_in_menu(value);
        return;
      }
    } else {
      console.log("nested");
      if (show_nested.includes(value)) {
        set_show_nested((prev) => [...prev.filter((x) => x != value)]);
      } else {
        set_show_nested((prev) => [...prev, value]);
      }
    }
  };

  // const handle_Click_child_Btn =(value ,is_nasted , show_nested , fater_value) =>{
  //   console.log("Preview_This_comp" , Preview_This_comp);

  //   console.log("value        22222" , value);

  //   console.log("fater_value  3333" , fater_value);

  //   // set_Preview_This_comp(value);

  //   if (is_nasted === false){
  //     console.log("notnested");
  //     set_show_nested(false)
  //     set_Preview_This_comp(value);

  //   }

  // else{

  //   console.log("nested");

  // if(show_nested === true){
  //   console.log("dddddddddddddddddddddd");

  //   set_show_nested(false)}

  // else{   set_show_nested(true)}

  //    }

  // }

  //  show sidebar in this page
  useEffect(() => {
    if (show_SideBar === false) {
      set_show_SideBar(true);
    }
  }, []);

  const PortAiner = () => {
    console.log("Path To Portainer ", `https://${front_URL}/portainer`);

    return (
      <div style={{ flexDirection: "column", display: "flex" }}>
        <p className="font-type-h4 Color-White mb-a ">Portainer</p>

        <iframe
          style={{ height: 700, marginTop: 0 }}
          src={`https://${front_URL}/portainer`}
          frameborder="0"
        />
      </div>
    );
  };

  return (
    <>
      {PopUp_Under_Construction__show && (
        <PopUp_Under_Construction
          popUp_show={PopUp_Under_Construction__show}
          set_popUp_show={set_PopUp_Under_Construction__show}
          HeadLine={PopUp_Under_Construction__txt.HeadLine}
          paragraph={PopUp_Under_Construction__txt.paragraph}
          buttonTitle={PopUp_Under_Construction__txt.buttonTitle}
        />
      )}

      <div className="app-main">
        <div className="top-of-page">
          <div className="top-of-page-left mb-a">
            {/* <p className="font-type-menu">Settings:</p> */}
            <p className="font-type-h3">General Settings</p>
          </div>
          <div className="top-of-page-center">
            {/* placeholder for dropDown */}
          </div>

          <div
            className="top-of-page-right"
            onClick={() => set_PopUp_Under_Construction__show(true)}
          >
            <Search_comp
              set_items_for_search={set_tmp_data}
              items_for_search={tmp_data}
              filter_string={filter_string}
              set_filter_string={set_filter_string}
            />

            {/* <input className="input-type1 mr-a" placeholder="Search"  onClick={()=>set_PopUp_Under_Construction__show(true)}/>
            <button className="btn-type1 "  onClick={()=>set_PopUp_Under_Construction__show(true)}>
              <IconSearch className="icon-type1" />{" "}
            </button> */}
          </div>
        </div>

        <div className="resource-group-top-boxes mb-c"></div>

        <div className="mb-c">
          <Settings_Menu
            Preview_This_in_menu={Preview_This_in_menu}
            Preview_This_comp={Preview_This_comp}
            show_nested={show_nested}
            set_show_nested={set_show_nested}
            handle_Click_Btn={handle_Click_Btn}
          />{" "}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "45px" }}>
          {Preview_This_comp == "Main Config" && <Settings_section_config />}
          {Preview_This_comp == "UI Settings" && (
            <Settings_section_ShowInUi all_Tools={all_Tools} />
          )}
          {Preview_This_comp == "Paths" && (
            <>
              <Settings_section_edit_mssp_config_json_paths
                all_Tools={all_Tools}
              />
            </>
          )}
          {Preview_This_comp == "Automation" && (
            <Settings_section_process
              isMainProcessWork={isMainProcessWork}
              set_isMainProcessWork={set_isMainProcessWork}
            />
          )}
          {Preview_This_comp == "Portainer" && <PortAiner />}
          {Preview_This_comp == "Backend Log Request" && (
            <Settings_section_logs
              usethis={"log_mssp_backend_requests"}
              fileName={"msspBackRequest.log"}
              headline={"MSSP Backend Request"}
              subline={"Node JS backend Request Log"}
            />
          )}
          {Preview_This_comp == "Backend Log" && (
            <Settings_section_logs
              usethis={"log_mssp_backend"}
              fileName={"BackEndLog.log"}
              headline={"MSSP Backend"}
              subline={"Node JS backend"}
            />
          )}
          {Preview_This_comp == "Python Main Log" && (
            <Settings_section_logs
              usethis={"log_python_main"}
              fileName={"main.log"}
              headline={"Python Main"}
              subline={"Python Main log"}
            />
          )}
          {Preview_This_comp == "Python Interval Log" && (
            <Settings_section_logs
              usethis={"log_python_interval"}
              fileName={"interval.log"}
              headline={"Automation"}
              subline={"Active Now"}
            />
          )}
          {Preview_This_comp == "Collector Log" && (
            <Settings_section_logs
              usethis={"log_collector"}
              fileName={"Collector.log"}
              headline={"Collector Log"}
              subline={"Log for The Creation OF the On premise velociraptor"}
            />
          )}{" "}
          {Preview_This_comp == "Collector Import Log" && (
            <Settings_section_logs
              usethis={"log_collector_import"}
              fileName={"CollectorImport.log"}
              headline={"Collector Import Log"}
              subline={"Log for The Import OF the On premise velociraptor"}
            />
          )}
          {Preview_This_comp == "Alerts Interval Log" && (
            <Settings_section_logs
              usethis={"log_alerts_interval"}
              fileName={"alerts_interval.log"}
              headline={"Alerts"}
              subline={""}
            />
          )}
          {Preview_This_comp == "Crash Log" && (
            <Settings_section_logs
              usethis={"log_crash"}
              fileName={"Crash.log"}
              headline={"Crash"}
              subline={""}
            />
          )}
          {Preview_This_comp == "Daily Update Interval Log" && (
            <Settings_section_logs
              usethis={"log_daily_update_interval"}
              fileName={"daily_update_interval.log"}
              headline={"Daily Update"}
              subline={""}
            />
          )}
          {Preview_This_comp == "Dashboard Log" && (
            <Settings_section_logs
              usethis={"log_dashboard"}
              fileName={"dashboard.log"}
              headline={"Dashboard"}
              subline={""}
            />
          )}
          {Preview_This_comp == "Resource Usage Log" && (
            <Settings_section_logs
              usethis={"log_resource_usage"}
              fileName={"resource_usage.log"}
              headline={"Resource Usage"}
              subline={""}
            />
          )}{" "}
          {Preview_This_comp == "AiManagement Log" && (
            <Settings_section_logs
              usethis={"log_AiManagement"}
              fileName={"alerts_vuln_cve_managment_helper.log"}
              headline={"Ai Management"}
              subline={""}
            />
          )}
          {/* {Preview_This_comp == "Prompt" && (
            <Settings_section_logs
              usethis={"log_Prompt"}
              fileName={"cve_managment_prompt.log"}
              headline={"Prompt"}
              subline={""}
            />
          )} */}
          {Preview_This_comp == "Users" && <Users />}
          {Preview_This_comp == "Velociraptor" && <VeloConfigMain />}
          {Preview_This_comp == "MCP" && <Settings_section_MCP />}
          {Preview_This_comp == "Alerts" && <AlertsSettings />}
          {Preview_This_comp == "AI Vulnerability" && <AI_Vulnerability />}
          {/* {Preview_This_comp == "Nuclie AI" && (
            <ShowRuleModal RuleType={"Nuclei"} />
          )}
          {Preview_This_comp == "Yara AI" && (
            <ShowRuleModal RuleType={"Yara"} />
          )}
          {Preview_This_comp == "Sigma AI" && (
            <ShowRuleModal RuleType={"Sigma"} />
          )} */}
        </div>
      </div>
    </>
  );
}

export default Settings;
