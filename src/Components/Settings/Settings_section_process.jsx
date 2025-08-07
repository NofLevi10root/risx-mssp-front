import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import "./../Settings/Settings.css";
import "./custom-json-view.css";
import GeneralContext from "../../Context.js";
import { PopUp_All_Good, PopUp_Are_You_Sure } from "../PopUp_Smart";
import {
  check_and_active_interval_of_python,
  kill_interval_of_python,
} from "../Features/ProcessFunctions.js";
// import { enable_disable_artifact } from '../../../../risx-mssp-back/controllers/ToolsController.js';

function Settings_section_process({
  show_SideBar,
  set_show_SideBar,
  set_unseen_alert_number,
  isMainProcessWork,
  set_isMainProcessWork,
}) {
  const [isHovered, setIsHovered] = useState(false);
  // const [loader , set_loader] = useState(true)
  const { backEndURL, set_all_Tools, all_Tools } = useContext(GeneralContext);
  //  const [loadig, set_loading] = useState(false);
  const [PopUp_Are_You_Sure__show, set_PopUp_Are_You_Sure__show] =
    useState(false);
  const [PopUp_Are_You_Sure__txt, set_PopUp_Are_You_Sure__txt] = useState({
    HeadLine: "Are You Sure?",
    paragraph: "The record will be deleted from the system",
    buttonTrue: "True",
    buttonFalse: "False",
  });

  console.log("isMainProcessWork", isMainProcessWork);

  const enable_disable_MainProcess = () => {
    if (isMainProcessWork) {
      console.log("Main Process is", isMainProcessWork, "go to kill him");
      kill_interval_of_python(
        backEndURL,
        isMainProcessWork,
        set_isMainProcessWork
      );
    } else if (isMainProcessWork === false) {
      console.log("Main Process is", isMainProcessWork, "go start him");
      check_and_active_interval_of_python(
        backEndURL,
        isMainProcessWork,
        set_isMainProcessWork
      );
    } else {
      console.log("Main Process is ", isMainProcessWork, "problem");
    }
  };

  // useEffect(() => {  if (show_SideBar === false) {set_show_SideBar(true)}}, []);

  //  useEffect(() => {    console.log("change", all_Tools);        }, [all_Tools]);

  return (
    <>
      <div>
        <p className="font-type-h4 Color-White mb-c">Process</p>
        <table className="setting_table  " style={{ lineHeight: "100%" }}>
          <tbody className="tbody_setting">
            <tr>
              <td className="setting_descriptions ">
                <p className="font-type-menu Color-White  ">
                  Automation Status
                </p>
              </td>

              <td className="" style={{}}>
                <div className="display-flex  ">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isMainProcessWork}
                      onClick={enable_disable_MainProcess}
                      //  onChange={()=>set_monitoring(!monitoring)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </td>

              <td className="" style={{}}>
                <p className="font-type-txt Color-Grey1  ">
                  {false && "Activation and deactivation of Interval.py"}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Settings_section_process;
