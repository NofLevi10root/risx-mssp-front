import React, { useState, useContext, useEffect } from "react";

import { ReactComponent as IconBIG } from "../icons/ico-menu-alert.svg";
import { ReactComponent as Loader } from "../icons/loader_typea.svg";

import ResourceGroup_Action_btns from "../ResourceGroup/ResourceGroup_Action_btns.jsx";
import ResourceGroup_buttomLine from "../ResourceGroup/ResourceGroup_buttomLine.jsx";
import axios from "axios";
import GeneralContext from "../../Context.js";
import CodeMirror from "@uiw/react-codemirror";
import { json, jsonLanguage, jsonParseLinter } from "@codemirror/lang-json";
import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";
import "../StatusDisplay.css";
import JsonView from "@uiw/react-json-view";
// Adjust the path as needed based on your project structure
import "./../Settings/Settings.css";
import "./../Settings/custom-json-view.css";
import {
  PopUp_All_Good,
  PopUp_Alert_info,
  PopUp_loader,
  PopUp_Error,
} from "../PopUp_Smart.js";

import LMloader from "../Features/LMloader.svg";
import { AlertsMenu } from "./Alerts_Menu.jsx";
//  import './Dashboard_Results_all.css'
export function AlertsSettings({}) {
  const { backEndURL, all_Tools, front_IP } = useContext(GeneralContext);

  const [Preview_This_in_menu, set_Preview_This_in_menu] = useState("");
  const [SubMenuOptionsList, setSubMenuOptionsList] = useState([]);
  const [config_save_btn, set_config_save_btn] = useState(false);
  const [ActiveAlertConfig, setActiveAlertConfig] = useState({});
  const [preview_or_edit, set_preview_or_edit] = useState(true);
  const [object, setObject] = useState({});
  const [ErrString, setErrString] = useState("");
  const [AllMonitorObj, setAllMonitorObj] = useState({});

  const [PopUp_Error____show, set_PopUp_Error____show] = useState(false);
  const [PopUp_Error____txt, set_PopUp_Error____txt] = useState({
    HeadLine: "",
    paragraph: "",
    buttonTitle: "",
  });
  const [PopUp_All_Good__show, set_PopUp_All_Good__show] = useState(false);
  const [PopUp_All_Good__txt, set_PopUp_All_Good__txt] = useState({
    HeadLine: "Success",
    paragraph: "successfully",
    buttonTitle: "Close",
  });

  const myTheme = createTheme({
    theme: "dark",
    settings: {
      background: "transperent",
      backgroundImage: "",
      foreground: "var(--color-Grey1)",
      caret: "var(--color-DB-Blue-Active)",
      selection: "var(--color-Grey4)",
      selectionMatch: "var(--color-Grey2)",
      lineHighlight: "transperent",
      gutterBackground: "var(--color-Grey5)",
      gutterForeground: "var(--color-Grey1)",
    },
    styles: [
      { tag: t.comment, color: "var(--color-White)" },
      { tag: t.variableName, color: "var(--color-White)" },
      {
        tag: [t.string, t.special(t.brace)],
        color: "var(--color-DB-Blue-Active)",
      },
      { tag: t.number, color: "var(--color-White)" },
      { tag: t.bool, color: "var(--color-White)" },
      { tag: t.null, color: "var(--color-White)" },
      { tag: t.keyword, color: "var(--color-White)" },
      { tag: t.operator, color: "var(--color-White)" },
      { tag: t.className, color: "var(--color-White)" },
      { tag: t.definition(t.typeName), color: "#5c6166" },
      { tag: t.typeName, color: "var(--color-White)" },
      { tag: t.angleBracket, color: "var(--color-White)" },
      { tag: t.tagName, color: "var(--color-White)" },
      { tag: t.attributeName, color: "var(--color-White)" },
    ],
  });
  const customTheme = {
    "--w-rjv-font-family": "roboto",

    "--w-rjv-background-color": "",
    "--w-rjv-line-color": "var(--color-Grey3)",
    "--w-rjv-arrow-color": "var(--w-rjv-color)",
    "--w-rjv-edit-color": "var(--color-Grey1)",
    "--w-rjv-add-color": "var(--color-Grey1)",
    "--w-rjv-delete-color": "var(--color-Grey1)",
    "--w-rjv-info-color": "red",
    "--w-rjv-update-color": "var(--color-Grey1)",
    "--w-rjv-copied-color": "var(--color-Grey1)",
    "--w-rjv-copied-success-color": "var(--color-Grey1)",

    "--w-rjv-curlybraces-color": "var(--color-Grey1)",
    "--w-rjv-colon-color": "var(--color-Grey1)",
    "--w-rjv-brackets-color": "var(--color-Grey1)",

    "--w-rjv-type-int-color": "var(--color-DB-Blue-Active)",
    "--w-rjv-type-float-color": "var(--color-DB-Blue-Active)",
    "--w-rjv-type-bigint-color": "var(--color-DB-Blue-Active)",
    "--w-rjv-type-boolean-color": "var(--color-DB-Blue-Active)",
    "--w-rjv-type-date-color": "var(--color-DB-Blue-Active)",
    "--w-rjv-type-url-color": "var(--color-DB-Blue-Active)",
    "--w-rjv-type-null-color": "var(--color-DB-Blue-Active)",
    "--w-rjv-type-nan-color": "var(--color-DB-Blue-Active)",
    "--w-rjv-type-undefined-color": "var(--color-DB-Blue-Active)",
    "--w-rjv-type-string-color": "var(--color-DB-Blue-Active)",
    "--w-rjv-type": "var(--color-DB-Blue-Active)",

    "--w-rjv-object-key": "var(--color-Grey1)",
    "--w-rjv-key-string": "var(--color-Grey1)",

    "--w-rjv-color": "var(--color-Orange)",

    "--w-rjv-quotes-color": "var(--color-Grey1)",
  };

  useEffect(() => {
    if (backEndURL) {
      GetAlertsConfig("");
    }
  }, [backEndURL]);

  const HandleAllAlerts = async () => {
    try {
      console.log("Start HandleAllAlerts");
      const res = await axios.get(backEndURL + "/Alerts/GetAllAlertsMonitor");
      setObject(res?.data?.config);
      set_Preview_This_in_menu("");
      setActiveAlertConfig(res?.data);

      console.log("wdhfjwdnhgokwnergojnwegdnwodkgbkdsjgv", res.data);
      console.log("End HandleAllAlerts");
    } catch (error) {
      console.log("Error In HandleAllAlerts : ", error);
    }
  };

  const handle_view_or_edit = () => {
    set_config_save_btn(false);
    set_preview_or_edit(!preview_or_edit);
    // get_config();
  };

  const GetAlertsConfig = async (id) => {
    try {
      console.log("id", id);

      const res = await axios.post(backEndURL + "/Alerts/GetAlertsConfig", {
        id,
      });
      console.log(
        "rrrrrrrrr22222222222222222222222222222",
        res.data,
        res?.data?.AlertConfig?.label
      );

      set_Preview_This_in_menu(res?.data?.AlertConfig?.label);
      if (!id || SubMenuOptionsList?.length != res?.data?.Menu?.length) {
        console.log("change of Length of menu options");

        setSubMenuOptionsList(res?.data?.Menu);
      }

      setObject(res?.data?.AlertConfig?.config ?? {});
      setActiveAlertConfig(res?.data?.AlertConfig);
    } catch (error) {
      console.log("Error In GetAlertsConfig :", error);
    }
  };

  const HandleMenuSwitch = async (name) => {
    try {
      console.log("flip", name);
      set_config_save_btn(false);
      set_preview_or_edit(true);

      GetAlertsConfig(name);
    } catch (error) {
      console.log("this is error in HandleMenuSwitch");
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Error Happened While Switching Configs",
        buttonTitle: "Close",
      });
    }
  };

  const HandleRefreshAllTags = async (name) => {
    try {
      console.log("flip", name);
      set_config_save_btn(false);

      // GetAlertsConfig(ActiveAlertConfig?.label);
    } catch (error) {
      console.log("this is error in HandleMenuSwitch");
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Error Happened While Switching Configs",
        buttonTitle: "Close",
      });
    }
  };

  const HandleSaveAlertConfig = async (id) => {
    try {
      if (!ActiveAlertConfig?.label) {
        console.log("Error id cant be empty");
        set_PopUp_Error____show(true);
        set_PopUp_Error____txt({
          HeadLine: "Error",
          paragraph:
            "Id cant be empty You are trying to update a unknown Config",
          buttonTitle: "Close",
        });
      }
      console.log("Start HandleSaveAlertConfig");
      const res = await axios.post(backEndURL + "/Alerts/UpdateAlertConfig", {
        id: ActiveAlertConfig?.label,
        config: object,
      });
      console.log("KLASNFLJANFOJDNOVJBNSDVNWDVNSWDNVOLDNBVOLDNVOLN", res.data);
      if (res.data?.bool) {
        set_config_save_btn(false);
        set_preview_or_edit(true);
        GetAlertsConfig(ActiveAlertConfig?.label);
      } else {
        set_PopUp_Error____show(true);
        set_PopUp_Error____txt({
          HeadLine: "Error",
          paragraph: "Cant Update Config",
          buttonTitle: "Close",
        });
      }
    } catch (err) {
      console.log("Error in HandleSaveAlertConfig : ", err);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Error In Update Config",
        buttonTitle: "Close",
      });
    }
  };
  return (
    <div
      // className="app-main"
      style={
        {
          // flexDirection:"row"
        }
      }
    >
      {PopUp_All_Good__show && (
        <PopUp_All_Good
          popUp_show={PopUp_All_Good__show}
          set_popUp_show={set_PopUp_All_Good__show}
          HeadLine={PopUp_All_Good__txt.HeadLine}
          paragraph={PopUp_All_Good__txt.paragraph}
          buttonTitle={PopUp_All_Good__txt.buttonTitle}
        />
      )}
      {PopUp_Error____show && (
        <PopUp_Error
          popUp_show={PopUp_Error____show}
          set_popUp_show={set_PopUp_Error____show}
          HeadLine={PopUp_Error____txt.HeadLine}
          paragraph={PopUp_Error____txt.paragraph}
          buttonTitle={PopUp_Error____txt.buttonTitle}
        />
      )}

      <AlertsMenu
        Preview_This_in_menu={Preview_This_in_menu}
        handle_Click_Btn={HandleMenuSwitch}
        sub_menu_options={SubMenuOptionsList}
      />
      <div className="resource-group-top-boxes mb-c"></div>
      <div>
        <table className="setting_table  " style={{ lineHeight: "100%" }}>
          <tbody>
            <tr>
              <td className="setting_descriptions">
                <p className="font-type-h4 Color-White mb-c">Alert Config</p>
                <p className="font-type-menu Color-White mb-a">
                  {ActiveAlertConfig?.fqdn_population?.join(" | ")}
                </p>
                <p className="font-type-txt Color-Grey1 mb-b">
                  To view and edit the general configuration, click 'EDIT' to
                  modify What Alert Is run And with Which Configuration
                </p>
                <p className="font-type-txt Color-Orange">
                  {" "}
                  Caution: Incorrect input may damage the functionality of the
                  software.
                </p>
                <button
                  className="btn-type2"
                  style={{ marginTop: 15 }}
                  onClick={HandleAllAlerts}
                >
                  <p className="font-type-menu ">Available Rules</p>
                </button>
                <button
                  className="btn-type2"
                  style={{ marginTop: 15 }}
                  onClick={HandleRefreshAllTags}
                >
                  <p className="font-type-menu ">Reload Labels</p>
                </button>
              </td>

              <td
                className="setting_element PreviewBox"
                style={{ height: "auto", width: "68.5vw" }}
              >
                <div className=" ">
                  {preview_or_edit ? (
                    <>
                      <div
                        className="setting_element"
                        style={{ overflowY: "scroll" }}
                      >
                        <JsonView
                          value={object}
                          keyName="root"
                          style={customTheme}
                          displayDataTypes={false}
                          enableClipboard={false}
                          name={false}
                          Ellipsis={false}
                        />{" "}
                      </div>
                      {/* {ErrString && (
                        <div
                          style={{
                            // width: "auto",
                            backgroundColor: "var(--color-Orange)",
                            color: "#FFFFFF",
                            opacity: 0.7,
                            position: "absolute",
                            zIndex: 5555555,
                            padding: 10,
                          }}
                        >
                          {ErrString}
                        </div>
                      )}

                      <CodeMirror
                        value={JSON.stringify(object, null, 2)}
                        height="600px"
                        // width="100%"
                        // maxWidth="auto"
                        readOnly={true}
                        onChange={async (x) => {
                          try {
                            console.log("flip", JSON.parse(x));
                            set_config_save_btn(true);
                            setObject(JSON.parse(x));
                            setErrString("");
                          } catch (error) {
                            set_config_save_btn(false);
                            setErrString(error.toString());
                            console.log("Json Error", error.toString());
                          }
                        }}
                        extensions={[json()]}
                        theme={myTheme} // Custom Style For The Editor
                        // theme={vscodeDark} // Pre made style for the editor
                        highlightActiveLine={true} */}
                      {/* /> */}
                    </>
                  ) : (
                    <>
                      {ErrString && (
                        <div
                          style={{
                            // width: "auto",
                            backgroundColor: "var(--color-Orange)",
                            color: "#FFFFFF",
                            opacity: 0.7,
                            position: "absolute",
                            zIndex: 5555555,
                            padding: 10,
                          }}
                        >
                          {ErrString}
                        </div>
                      )}

                      <CodeMirror
                        value={JSON.stringify(object, null, 2)}
                        height="600px"
                        // width="100%"
                        // maxWidth="auto"

                        onChange={async (x) => {
                          try {
                            console.log("flip", JSON.parse(x));
                            set_config_save_btn(true);
                            setObject(JSON.parse(x));
                            setErrString("");
                          } catch (error) {
                            set_config_save_btn(false);
                            setErrString(error.toString());
                            console.log("Json Error", error.toString());
                          }
                        }}
                        extensions={[json()]}
                        theme={myTheme} // Custom Style For The Editor
                        // theme={vscodeDark} // Pre made style for the editor
                        highlightActiveLine={true}
                      />
                    </>
                  )}
                </div>
              </td>

              {ActiveAlertConfig?.label != "all_monitor" && (
                <div
                  style={{
                    // marginTop:"18px",
                    marginBottom: "var(--space-d)",
                    marginTop: "var(--space-b)",
                    display: "flex",
                    justifyContent: "end",
                    gap: "var(--space-b)",
                    width: "70vw",
                  }}
                >
                  <button
                    className="btn-type2"
                    style={{}}
                    onClick={handle_view_or_edit}
                  >
                    <p className="font-type-menu ">
                      {preview_or_edit ? "Edit" : "View"}
                    </p>
                  </button>
                  {config_save_btn && (
                    <button
                      className="btn-type2"
                      style={{}}
                      onClick={HandleSaveAlertConfig}
                    >
                      <p className="font-type-menu ">Save</p>
                    </button>
                  )}
                </div>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// "Custom.10Root.Timestomping.Scenario"
