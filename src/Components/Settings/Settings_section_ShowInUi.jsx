import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import "./../Settings/Settings.css";
import "./custom-json-view.css";
import GeneralContext from "../../Context.js";
import JsonView from "@uiw/react-json-view";
import { PopUp_All_Good, PopUp_Are_You_Sure } from "../PopUp_Smart";

function Settings_section_ShowInUi({
  show_SideBar,
  set_show_SideBar,
  set_unseen_alert_number,
}) {
  const [preview_or_edit, set_preview_or_edit] = useState(true);
  const [config_save_btn, set_config_save_btn] = useState(false);
  // const [loader , set_loader] = useState(true)
  const { backEndURL, set_all_Tools, all_Tools } = useContext(GeneralContext);
  const [loadig, set_loading] = useState(false);
  const [PopUp_Are_You_Sure__show, set_PopUp_Are_You_Sure__show] =
    useState(false);
  const [PopUp_Are_You_Sure__txt, set_PopUp_Are_You_Sure__txt] = useState({
    HeadLine: "Are You Sure?",
    paragraph: "The record will be deleted from the system",
    buttonTrue: "True",
    buttonFalse: "False",
  });

  const Handele_are_you_sure = () => {
    set_PopUp_Are_You_Sure__txt({
      HeadLine: "Change config?",
      paragraph: "Are you sure you want to change config?",
      buttonTrue: "Yes",
      buttonFalse: "No",
    });

    set_PopUp_Are_You_Sure__show(true);
  };

  const handle_Save_config = () => {
    handleClose();
  };

  const handle_Cancel_Save_config = () => {
    handleClose();
  };

  function handleClose() {
    set_PopUp_Are_You_Sure__show(false);
  }

  useEffect(() => {
    if (show_SideBar === false) {
      set_show_SideBar(true);
    }
  }, []);

  async function edit_checked(tool_id, ShowInUi) {
    console.log("now is ------------- ", tool_id);
    console.log("change to  --- ---------- ", ShowInUi);
    if (backEndURL === undefined) {
      return;
    }
    try {
      // set_disable_ShowInUi_btn(true);
      const res = await axios.put(`${backEndURL}/tools/show-in-ui`, {
        params: {
          module_id: tool_id,
          set_ShowInUi_to: !ShowInUi,
        },
      });
      if (res.data) {
        // set_disable_ShowInUi_btn(false);
        const index = all_Tools.findIndex((tool) => tool.tool_id === tool_id);
        if (index !== -1) {
          // Create a new copy of the all_Tools array
          const updatedTools = [...all_Tools];
          // Update the specific tool
          updatedTools[index] = {
            ...updatedTools[index],
            tool_id: tool_id,
            ShowInUi: !ShowInUi,
            isActive: !ShowInUi,
          };
          // Set the state with the updated array
          set_all_Tools(updatedTools);
        }
      }
    } catch (err) {
      // set_disable_ShowInUi_btn(false);
      console.log(err);
    }
  }

  return (
    <>
      {PopUp_Are_You_Sure__show && (
        <PopUp_Are_You_Sure
          popUp_show={PopUp_Are_You_Sure__show}
          set_popUp_show={set_PopUp_Are_You_Sure__show}
          HeadLine={PopUp_Are_You_Sure__txt.HeadLine}
          paragraph={PopUp_Are_You_Sure__txt.paragraph}
          button_True_text={PopUp_Are_You_Sure__txt.buttonTrue}
          button_False_text={PopUp_Are_You_Sure__txt.buttonFalse}
          True_action={handle_Save_config}
          False_action={handle_Cancel_Save_config}
        />
      )}

      <div>
        <table className="setting_table  " style={{ lineHeight: "100%" }}>
          <tbody className="tbody_setting">
            <tr>
              <td className="setting_descriptions">
                <p className="font-type-h4 Color-White mb-c">UI Settings</p>
                <p className="font-type-menu Color-White mb-a">
                  Module Display
                </p>
                <p className="font-type-txt Color-Grey1 mb-b">
                  Toggle module visibility on the 'Modules' page.
                </p>
                {/* <p className='font-type-txt Color-Orange'> Caution: Incorrect....</p> */}
              </td>

              <td className=" PreviewBox" style={{ height: "auto" }}>
                <table className="ShowInUi-table">
                  <thead>
                    <tr className="">
                      <th className="font-type-menu Color-White">UI Display</th>
                      {/* <th className='font-type-menu Color-White'>Developer</th> */}
                      <th className="font-type-menu Color-White">Module</th>
                      <th className="font-type-menu Color-White">
                        Description
                      </th>
                      <th className="font-type-menu Color-White">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadig ? (
                      <>
                        <p>loading</p>
                      </>
                    ) : (
                      <>
                        {all_Tools.map((tool) => (
                          <tr ey={tool?.tool_id}>
                            <td>
                              {/* <div  className='velociraptor-EndpointModules-checkbox mr-b'> */}
                              {tool?.tool_id === "2000000" ? (
                                <label className="container containeroff">
                                  <input type="checkbox" checked={true} />

                                  <span
                                    className="checkmark"
                                    style={{
                                      verticalAlign: "center",
                                      top: "-10px",
                                      bottom: "auto",
                                    }}
                                  ></span>
                                </label>
                              ) : (
                                <label className="container">
                                  <input
                                    type="checkbox"
                                    checked={tool?.ShowInUi}
                                    value={tool?.ShowInUi}
                                    onChange={() =>
                                      edit_checked(
                                        tool?.tool_id,
                                        tool?.ShowInUi
                                      )
                                    }
                                  />

                                  <span
                                    className="checkmark"
                                    style={{
                                      verticalAlign: "center",
                                      top: "-10px",
                                      bottom: "auto",
                                    }}
                                  ></span>
                                </label>
                              )}
                            </td>

                            {/* <img className='velociraptor-EndpointModules-logo' src={tool?.logoAddress_1 ? require(`./../Logos/Shodan.png`) : undefined}></img> */}

                            {/* <img className='velociraptor-EndpointModules-logo' src={tool?.logoAddress_1 ? require(`./.${tool.logoAddress_1}`) : undefined}></img> */}

                            <td className="font-type-menu Color-White">
                              {tool?.Tool_name}
                            </td>
                            {/* <td className=''> <img className='velociraptor-EndpointModules-logo' src={tool?.logoAddress_1 ? require(`./.${tool.logoAddress_1}`) : undefined}></img></td> */}

                            <td className="font-type-txt Color-Grey1">
                              {tool?.description_short}
                            </td>
                            <td
                              className={`font-type-txt ${
                                tool?.isActive
                                  ? "Color-Blue-Glow"
                                  : "Color-Grey1"
                              }`}
                            >
                              {tool?.isActive ? "Active" : "Disabled"}
                            </td>

                            <td className="">
                              {/* {tool.logoAddress_1 && <img className='velociraptor-EndpointModules-logo' src={`./.${tool.logoAddress_1}`} alt="Logo" />} */}
                              {/* {tool.logoAddress_1 && <img className='velociraptor-EndpointModules-logo' src={require(`./.${tool.logoAddress_1}`).default} alt="Logo" />} */}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Settings_section_ShowInUi;
