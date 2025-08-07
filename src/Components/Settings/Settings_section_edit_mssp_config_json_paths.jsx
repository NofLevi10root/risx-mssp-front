import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./../Settings/Settings.css";
import "./custom-json-view.css";
import GeneralContext from "../../Context.js";
import { PopUp_Error } from "../PopUp_Smart.js";

function Settings_section_edit_mssp_config_json_module_paths({
  show_SideBar,
  set_show_SideBar,
  set_unseen_alert_number,
}) {
  const { backEndURL, moduleLinks, front_URL, front_IP } =
    useContext(GeneralContext);
  const [tmp_moduleLinks, set_tmp_moduleLinks] = useState(moduleLinks);
  const [save_btn, set_save_btn] = useState(false);

  const [PopUp_Error____show, set_PopUp_Error____show] = useState(false);
  const [PopUp_Error____txt, set_PopUp_Error____txt] = useState({
    HeadLine: "",
    paragraph: "",
    buttonTitle: "",
  });
  const keyWidth = "160px";
  const handleInputChangeGenerator = (index) => (e) => {
    console.log(
      "ttttttttttttttttttttttttttttttttttttttt e.target.value",
      e.target.value
    );

    const newModuleLinks = [...moduleLinks]; // Create a copy of moduleLinks array
    console.log(
      newModuleLinks[index].toolURL,
      "newModuleLinks[index].toolURL newModuleLinks[index].toolURL newModuleLinks[index].toolURL"
    );

    newModuleLinks[index].toolURL = e.target.value; // Update the toolURL of the specific element
    set_tmp_moduleLinks(newModuleLinks); // Update state with the new array
    set_save_btn(true);
  };

  const handle_Save_config = async () => {
    try {
      const res = await axios.put(
        `${backEndURL}/config/mssp-config-json-links`,
        tmp_moduleLinks
      );
      if (res) {
        console.log("handle_Save_config", res.data);
        set_PopUp_Error____show(true);
        set_PopUp_Error____txt({
          HeadLine: "Saved Data successfully",
          paragraph:
            "The Changes Where Saved Successfully.\nBut There Was an Error In Page Refresh",
          buttonTitle: "Ok",
        });
      } else {
        console.log("handle_Save_config", res);
        set_PopUp_Error____show(true);
        set_PopUp_Error____txt({
          HeadLine: "Error In Saving Data",
          paragraph: "Error Happened Check Logs",
          buttonTitle: "Ok",
        });
      }
    } catch (err) {
      console.log("handle_Save_config", err);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error In Saving Data",
        paragraph: "Error Happened Check Logs",
        buttonTitle: "Ok",
      });
    }
  };

  useEffect(() => {
    if (show_SideBar === false) {
      set_show_SideBar(true);
    }
  }, []);

  useEffect(() => {
    if (tmp_moduleLinks != undefined) {
      return;
    } else {
      set_tmp_moduleLinks(moduleLinks);
    }
  }, [moduleLinks]);

  return (
    <>
      {PopUp_Error____show && (
        <PopUp_Error
          popUp_show={PopUp_Error____show}
          set_popUp_show={set_PopUp_Error____show}
          HeadLine={PopUp_Error____txt.HeadLine}
          paragraph={PopUp_Error____txt.paragraph}
          buttonTitle={PopUp_Error____txt.buttonTitle}
        />
      )}
      <div>
        <table className="setting_table  " style={{ lineHeight: "100%" }}>
          <tbody className="tbody_setting">
            <tr>
              <td className="setting_descriptions setting_descriptions">
                <p className="font-type-h4 Color-White mb-a">Module Paths</p>
                <p className="font-type-menu Color-White  mb-b">
                  {" "}
                  mssp_config.json{" "}
                </p>
                <p className="font-type-txt Color-Grey1 mb-b">
                  Set up URL paths for each module.
                </p>
                <p className="font-type-txt Color-Grey1 mb-b ">
                  the page will automatically refresh to apply the changes.
                </p>
              </td>
              {/* moduleLinks */}
              {/* preview_list={all_artifacts_and_modules.filter(tool => (tool?.tool_id != "2000000"  &&    tool?.parent_id  != "2000000"   &&    tool?.toolType === "link"  &&  tool?.ShowInUi  )) } */}
              <div style={{ marginTop: "-5px", marginBottom: "45px" }}>
                {Array.isArray(tmp_moduleLinks) &&
                  tmp_moduleLinks.map((Info, index) => {
                    if (Info?.URLtype == "Dashboard") {
                      return;
                    }
                    const handleInputChange = handleInputChangeGenerator(index); // Generate handleInputChange function for each index

                    return (
                      <tr className="" key={index} style={{ height: "50px" }}>
                        <td
                          className=""
                          style={{
                            width: "auto",
                            paddingRight: "16px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <p
                            className="font-type-txt Color-White"
                            style={{ width: keyWidth }}
                          >
                            {Info?.toolName}
                          </p>
                        </td>
                        <td className="" style={{ width: "100%" }}>
                          <input
                            className="input-type4"
                            placeholder={Info?.toolURL}
                            value={Info?.toolURL}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </div>
            </tr>

            <tr>
              <td className="setting_descriptions setting_descriptions">
                <p className="font-type-h4 Color-White mb-a">Dashboard paths</p>

                <p className="font-type-txt Color-Grey1 mb-b">
                  Configure the paths for each Dashboard.
                </p>
                {/* <p className="font-type-txt Color-Grey1  ">the page will automatically refresh to apply the changes.</p> */}
                <p className="font-type-menu Color-Grey1  mb-b">
                  {" "}
                  mssp_config.json{" "}
                </p>
              </td>

              <div style={{ marginTop: "-5px" }}>
                {Array.isArray(tmp_moduleLinks) &&
                  tmp_moduleLinks.map((Info, index) => {
                    if (Info?.URLtype != "Dashboard") {
                      return;
                    }
                    const handleInputChange = handleInputChangeGenerator(index); // Generate handleInputChange function for each index

                    return (
                      <tr className="" key={index} style={{ height: "50px" }}>
                        <td
                          className=""
                          style={{
                            width: "auto",
                            paddingRight: "16px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <p
                            className="font-type-txt Color-White"
                            style={{ width: keyWidth }}
                          >
                            {Info?.toolName}
                          </p>
                        </td>
                        <td className="" style={{ width: "100%" }}>
                          <input
                            className="input-type4"
                            placeholder={Info?.toolURL}
                            value={Info?.toolURL}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </div>
            </tr>

            <tr className="" style={{}}>
              <td className=""> </td>
              <td className="" style={{}}>
                <div
                  style={{
                    marginBottom: "var(--space-d)",
                    marginTop: "var(--space-a)",
                    display: "flex",
                    justifyContent: "end",
                    gap: "var(--space-b)",
                    alignItems: "center",
                  }}
                >
                  <p
                    className="font-type-txt Color-Grey1"
                    style={{ marginRight: "auto", marginLeft: keyWidth }}
                  >
                    <span className="mr-c ml-c">{`{FRONT_URL} ${front_URL}`}</span>
                    |<span className="ml-c">{`{FRONT_IP} ${front_IP}`}</span>
                  </p>
                  {save_btn && (
                    <>
                      <p className="font-type-txt Color-Grey1 ">
                        Clicking will refresh the page
                      </p>
                      <button
                        className="btn-type2"
                        style={{}}
                        onClick={handle_Save_config}
                      >
                        <p className="font-type-menu ">Save</p>
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Settings_section_edit_mssp_config_json_module_paths;
