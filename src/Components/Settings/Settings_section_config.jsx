import React, { useState, useEffect, useContext, useRef } from "react";

import axios from "axios";
import "./../Settings/Settings.css";
import "./custom-json-view.css";
import GeneralContext from "../../Context.js";
import JsonView from "@uiw/react-json-view";
import {
  PopUp_All_Good,
  PopUp_Are_You_Sure,
  PopUp_Error,
} from "../PopUp_Smart";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { ReactComponent as IconReverse } from "../icons/ico-reverse.svg";
import { ReactComponent as IconTrash } from "../icons/ico-trash.svg";
import { ReactComponent as IconImport } from "../icons/ico-import.svg";
import { ReactComponent as IconExport } from "../icons/ico-export.svg";

function Settings_section_config({
  show_SideBar,
  set_show_SideBar,
  set_unseen_alert_number,
}) {
  const [preview_or_edit, set_preview_or_edit] = useState(true);
  const [config_save_btn, set_config_save_btn] = useState(false);
  // const [loader , set_loader] = useState(true)
  const { backEndURL } = useContext(GeneralContext);
  const textAreaRef = useRef(null);
  const [PopUp_Are_You_Sure__show, set_PopUp_Are_You_Sure__show] =
    useState(false);
  const [PopUpYesFunc, setPopUpYesFunc] = useState(() => {
    console.log("nnnnnnnnnnnnoooooooooooooooooooooo!!!!!!!!!!!!");
  });
  const [PopUp_Are_You_Sure__txt, set_PopUp_Are_You_Sure__txt] = useState({
    HeadLine: "Are You Sure?",
    paragraph: "The record will be deleted from the system",
    buttonTrue: "True",
    buttonFalse: "False",
  });

  const initialObject = { loading: "..." };
  const [PopUp_All_Good__show, set_PopUp_All_Good__show] = useState(false);
  const [PopUp_All_Good__txt, set_PopUp_All_Good__txt] = useState({
    HeadLine: "Success",
    paragraph: "successfully",
    buttonTitle: "Close",
  });
  const [PopUp_Error____show, set_PopUp_Error____show] = useState(false);
  const [PopUp_Error____txt, set_PopUp_Error____txt] = useState({
    HeadLine: "",
    paragraph: "",
    buttonTitle: "",
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

  const [object, setObject] = useState(initialObject);
  const [ErrString, setErrString] = useState("");
  const [editorValue, setEditorValue] = useState("");

  useEffect(() => {
    if (editorValue) {
      return;
    }
    setEditorValue(JSON.stringify(object, null, 2));
  }, [object]);

  console.log("object", object);
  const Handele_are_you_sure = () => {
    set_PopUp_Are_You_Sure__txt({
      HeadLine: "Change config?",
      paragraph: "Are you sure you want to change config?",
      buttonTrue: "Yes",
      buttonFalse: "No",
    });
    setPopUpYesFunc("config");

    set_PopUp_Are_You_Sure__show(true);
  };

  const HandleResetConfig = async () => {
    handleClose();

    console.log("Reset Click!!");
    try {
      const res = await axios.get(`${backEndURL}/config/ResetConfigToBasic`);
      if (res.data == "Updated successfully") {
        console.log("Updated successfully The Config");
        get_config();
        set_PopUp_All_Good__show(true);
        set_PopUp_All_Good__txt({
          HeadLine: "Success",
          paragraph: "The Config Reset was successful",
          buttonTitle: "Close",
        });
      }
    } catch (error) {
      console.log("Error in Reset Config", error);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Error in Reset Config",
        buttonTitle: "OK",
      });
    }
  };

  const DeleteResultHistory = async () => {
    console.log("Delete History");
    const res = await axios.get(`${backEndURL}/config/DeleteResultHistory`);
    console.log("DeleteResultHistory res", res);
    if (res.data == "Updated successfully") {
      console.log("Updated successfully The Config");
      get_config();
      set_PopUp_All_Good__show(true);
      set_PopUp_All_Good__txt({
        HeadLine: "Success",
        paragraph: "The Result History Has Been Deleted Successfully",
        buttonTitle: "Close",
      });
    } else {
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Error in Delete Result History",
        buttonTitle: "OK",
      });
    }
    handleClose();
  };

  const handle_Save_config = () => {
    console.log(
      "ASdas23333333333333333333333333333333333333333333333333333333333333dasdsdasd"
    );
    handleClose();
    // handleTextAreaChange();
    set_config_save_btn(false);
    set_preview_or_edit(true);
    setEditorValue("");
    const save_config = async () => {
      console.log("save_config..");
      try {
        const res = await axios.put(`${backEndURL}/config`, { config: object });

        if (res)
          if (res.data?.error === "failed saving config") {
            console.log("error save", res.data?.error);
            set_PopUp_Error____show(true);
            set_PopUp_Error____txt({
              HeadLine: "Error",
              paragraph: "Error in Saving Changes to Config",
              buttonTitle: "OK",
            });
            return;
          } else if (res.status === 500) {
            console.log("error save", res.data?.error);
            set_PopUp_Error____show(true);
            set_PopUp_Error____txt({
              HeadLine: "Error",
              paragraph: "Error in Saving Changes to Config with error 500",
              buttonTitle: "OK",
            });
          } else if (res.status === 200) {
            console.log("back from backend 200:", res.data);
            set_PopUp_All_Good__show(true);
            set_PopUp_All_Good__txt({
              HeadLine: "Success",
              paragraph: "The Config was Changed successfully",
              buttonTitle: "Close",
            });
          }

        // setObject(res.data)
      } catch (err) {
        console.log(err);
        set_PopUp_Error____show(true);
        set_PopUp_Error____txt({
          HeadLine: "Error",
          paragraph: "Error in Saving Changes to Config",
          buttonTitle: "OK",
        });
      }
    };
    save_config();
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

  const handle_view_or_edit = () => {
    set_config_save_btn(false);
    set_preview_or_edit(!preview_or_edit);
    setErrString(false);
    setEditorValue("");
    get_config();
  };

  const handleTextAreaChange = (event) => {
    console.log(" textAreaRef.current", textAreaRef.current);
    console.log(
      " textAreaRef.current.scrollTop",
      textAreaRef.current.scrollTop
    );
    const scrollTop = textAreaRef.current.scrollTop; // Save the scroll position
    set_config_save_btn(true);
    try {
      const value = JSON.parse(event.target.value);
      setObject(value);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
    setTimeout(() => {
      textAreaRef.current.scrollTop = scrollTop; // Restore the scroll position
    }, 0);
  };

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

  const get_config = async () => {
    if (backEndURL === undefined) {
      return;
    }
    try {
      const res = await axios.get(`${backEndURL}/config`);

      if (res.data) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa", res.data);
        setObject(res.data);
      }
    } catch (err) {
      console.log(err);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Error in Getting Config",
        buttonTitle: "OK",
      });
    }
  };
  useEffect(() => {
    if (backEndURL) {
      get_config();
    }
  }, [backEndURL]);

  const ImportConfigM = async (file) => {
    try {
      const red = new FileReader();
      console.log("import config json ss", file);
      let jj;
      console.log(
        "ttttttttttttttttttttttt888888888888888888888888ttttttttttttttttttttttttttttt"
      );

      red.onload = async (e) => {
        try {
          jj = JSON.parse(e.target.result);
          console.log("jjjjjjjjjjjjjjjjjjjjjjjjjj", jj);

          // setPreviewJsonFile(jj);
          // Update Funcion Of Import
          console.log("........................................");

          const res = await axios.post(
            `${backEndURL}/config/ImportConfigM`,
            jj,
            {}
          );
          console.log(
            "----------------------------------------------------------------------"
          );

          console.log("ImportConfigM Response", res);

          if ((res.data = "Imported successfully")) {
            set_PopUp_All_Good__show(true);
            set_PopUp_All_Good__txt({
              HeadLine: "Success",
              paragraph: "The Config was Imported successfully",
              buttonTitle: "Close",
            });
            get_config();
          } else {
            set_PopUp_Error____show(true);
            set_PopUp_Error____txt({
              HeadLine: "Error",
              paragraph: "Error in Importing Config",
              buttonTitle: "OK",
            });
          }
        } catch (error) {
          console.log("import error", error);
          set_PopUp_Error____show(true);
          set_PopUp_Error____txt({
            HeadLine: "Error",
            paragraph: "Error in Importing Config",
            buttonTitle: "OK",
          });
        }
      };
      await red.readAsText(file);
    } catch (error) {
      console.log("Import error", error);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error IN Import ",
        paragraph: "Error Happened Check Logs",
        buttonTitle: "Ok",
      });
    }
  };
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
          True_action={
            PopUpYesFunc == "Reset"
              ? HandleResetConfig
              : PopUpYesFunc == "History"
              ? DeleteResultHistory
              : handle_Save_config
          }
          False_action={handle_Cancel_Save_config}
        />
      )}
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
      <div>
        <table className="setting_table  " style={{ lineHeight: "100%" }}>
          <tbody>
            <tr>
              <td className="setting_descriptions">
                <p className="font-type-h4 Color-White mb-c">Main Config</p>
                <p className="font-type-menu Color-White mb-a">config.json</p>
                <p className="font-type-txt Color-Grey1 mb-b">
                  To view and edit the general configuration, click 'EDIT' to
                  modify tool options, assets, and more.
                </p>
                <p className="font-type-txt Color-Orange">
                  {" "}
                  Caution: Incorrect input may damage the functionality of the
                  software.
                </p>

                <button
                  className="btn-type4  btn-type4_careful  mt-b"
                  style={{ padding: 0 }}
                  onClick={() => {
                    setPopUpYesFunc("Reset");
                    set_PopUp_Are_You_Sure__txt({
                      HeadLine: "Reset config?",
                      paragraph:
                        "Are you sure you want to Reset the config to Default all changes to the config will be lost?",
                      buttonTrue: "Yes",
                      buttonFalse: "No",
                    });

                    set_PopUp_Are_You_Sure__show(true);
                  }}
                >
                  <div style={{ transform: "scale(1)", marginLeft: "-5px" }}>
                    <IconReverse className="icon-type1 " />
                  </div>
                  <p className="font-type-menu  Color-Grey2  mr-a">Reset</p>{" "}
                </button>

                <button
                  className="btn-type4  btn-type4_careful  mt-a"
                  style={{ padding: 0 }}
                  onClick={() => {
                    setPopUpYesFunc("History");
                    set_PopUp_Are_You_Sure__txt({
                      HeadLine: "Delete Request History?",
                      paragraph:
                        "Are you sure you want to Delete Request History if you do the history will not be recoverable?",
                      buttonTrue: "Yes",
                      buttonFalse: "No",
                    });

                    set_PopUp_Are_You_Sure__show(true);
                  }}
                >
                  <div style={{ transform: "scale(1)", marginLeft: "-5px" }}>
                    <IconTrash className="icon-type1 " />
                  </div>
                  <p className="font-type-menu  Color-Grey2  mr-a">
                    Delete History
                  </p>{" "}
                </button>
                <button
                  className="btn-type4  btn-type4_careful  mt-a"
                  style={{ padding: 0 }}
                  // onClick={ImportConfigM}
                >
                  <label
                    className="btn-type4  btn-type4_careful  mt-a"
                    style={{ padding: 0 }}
                    htmlFor="FileImportConfig"
                  >
                    <div style={{ transform: "scale(1)", marginLeft: "-5px" }}>
                      <IconImport className="icon-type1 " />
                    </div>
                    <p className="font-type-menu  Color-Grey2  mr-a">
                      Import Config
                    </p>{" "}
                  </label>

                  <input
                    onChange={(e) => {
                      ImportConfigM(e.target.files[0]);
                    }}
                    type="file"
                    accept="application/json"
                    id="FileImportConfig"
                    name="FileImportConfig"
                    style={{ opacity: 0, height: 0, width: 0 }}
                  />
                </button>
                <button
                  className="btn-type4  btn-type4_careful  mt-a"
                  style={{ padding: 0 }}
                  onClick={async () => {
                    console.log("export assets json");
                    try {
                      const res = await axios.get(`${backEndURL}/config/`);
                      const file = res.data;
                      const dataStr =
                        "data:text/json;charset=utf-8," +
                        encodeURIComponent(JSON.stringify(file));
                      const downloadAnchorNode = document.createElement("a");
                      downloadAnchorNode.setAttribute("href", dataStr);
                      downloadAnchorNode.setAttribute(
                        "download",
                        `ConfigExport-${new Date().toLocaleDateString(
                          "en-GB"
                        )}.json`
                      );
                      document.body.appendChild(downloadAnchorNode);
                      downloadAnchorNode.click();
                      downloadAnchorNode.remove();
                    } catch (error) {
                      console.log("error", error);
                    }
                  }}
                >
                  <div style={{ transform: "scale(1)", marginLeft: "-5px" }}>
                    <IconExport className="icon-type1 " />
                  </div>
                  <p className="font-type-menu  Color-Grey2  mr-a">
                    Export Config
                  </p>{" "}
                </button>

                {/* <button
                   className="btn-type4  btn-type4_careful  mt-b"
                  style={{ marginTop: 10 }}
                  onClick={() => {
                    setPopUpYesFunc(true);
                    set_PopUp_Are_You_Sure__txt({
                      HeadLine: "Reset config?",
                      paragraph:
                        "Are you sure you want to Reset the config to Default all changes to the config will be lost?",
                      buttonTrue: "Yes",
                      buttonFalse: "No",
                    });

                    set_PopUp_Are_You_Sure__show(true);
                  }}
                >
                  <p className="font-type-menu ">Reset</p>
                </button> */}
              </td>

              <td
                className="setting_element PreviewBox"
                style={{
                  height: "auto",
                  width: "68.5vw",
                  paddingBottom: ErrString ? 50 : 5,
                }}
              >
                <div className=" ">
                  {preview_or_edit ? (
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
                      />{" "}
                    </div>
                  ) : (
                    <>
                      {ErrString && (
                        <div
                          style={{
                            // width: "auto",
                            backgroundColor: "var(--color-Orange)",
                            color: "#FFFFFF",
                            opacity: 0.7,
                            position: "relative",
                            zIndex: 5555555,
                            padding: 10,
                            // top: -10,
                          }}
                        >
                          {ErrString}
                        </div>
                      )}

                      <CodeMirror
                        value={editorValue}
                        height="600px"
                        onChange={(value) => {
                          try {
                            setEditorValue(value);
                            console.log("flip", JSON.parse(value));
                            const parsed = JSON.parse(value);
                            setObject(parsed);
                            setErrString("");
                            set_config_save_btn(true);
                          } catch (error) {
                            set_config_save_btn(false);
                            setErrString(error.toString());
                            console.log("Json Error", error.toString());
                          }
                        }}
                        extensions={[json()]}
                        theme={myTheme}
                        highlightActiveLine={true}
                      />
                    </>
                  )}
                </div>
              </td>
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
                {!preview_or_edit && (
                  <button
                    className="btn-type2"
                    style={{}}
                    onClick={() => {
                      setEditorValue(JSON.stringify(object, null, 2));
                    }}
                  >
                    <p className="font-type-menu ">Format</p>
                  </button>
                )}
                {config_save_btn && (
                  <button
                    className="btn-type2"
                    style={{}}
                    onClick={Handele_are_you_sure}
                  >
                    <p className="font-type-menu ">Save</p>
                  </button>
                )}
              </div>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Settings_section_config;
