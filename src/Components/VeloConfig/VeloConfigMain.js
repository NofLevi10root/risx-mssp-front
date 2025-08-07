import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import "./../Settings/Settings.css";
import GeneralContext from "../../Context";
import {
  PopUp_All_Good,
  PopUp_Error,
  PopUp_Under_Construction,
} from "../PopUp_Smart.js";
import TopPageMenuVelo from "./TopPageMenuVelo.js";
import CodeMirror from "@uiw/react-codemirror";
import { json, jsonLanguage, jsonParseLinter } from "@codemirror/lang-json";
import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";
import JsonView from "@uiw/react-json-view";

function VeloConfigMain({ show_SideBar, set_show_SideBar, set_visblePage }) {
  const {
    all_Tools,
    front_URL,
    backEndURL,
    UploadProgressBar,
    setUploadProgressBar,
    setDownloadList,
    UpdateSideBar,
    setUpdateSideBar,
  } = useContext(GeneralContext);
  // Themes For JsonView and editor
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
  // End Of Themes

  // useEffect(() => {
  //   set_visblePage("OPVelociraptor");
  //   if (show_SideBar === false) {
  //     set_show_SideBar(true);
  //   }
  // }, []);

  const [ErrString, setErrString] = useState("");
  const [preview_or_edit, set_preview_or_edit] = useState(true);
  const [config_save_btn, set_config_save_btn] = useState(false);

  const [PopUp_Under_Construction__show, set_PopUp_Under_Construction__show] =
    useState(false);
  const [PopUp_Under_Construction__txt, set_PopUp_Under_Construction__txt] =
    useState({
      HeadLine: "Coming Soon!",
      paragraph:
        "We are working on creating this section. Stay tuned for updates as we finalize the details.",
      buttonTitle: "Close",
    });
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

  const [Preview_This_in_menu, set_Preview_This_in_menu] = useState("Lite");
  const [FullConfigList, setFullConfigList] = useState([]);
  const [ChosenConfig, setChosenConfig] = useState({});
  const [SubMenuOptionsList, setSubMenuOptionsList] = useState([]);

  const GetConfigList = async () => {
    try {
      console.log("sup");
      const res = await axios.get(`${backEndURL}/config/GetAllVeloConfig`);
      if (res.data) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa", res.data);
        const tmpArrOptions = [];
        let indexForConfig = 0;
        res.data.forEach((x, ind) => {
          if (x.config_name == Preview_This_in_menu) {
            indexForConfig = ind;
          }
          tmpArrOptions.push({
            preview_name: x.config_name,
            value: x.config_name,
            id: x.config_id,
          });
        });
        // for (let i = 0; i < 10; i++) {
        //   tmpArrOptions.push({
        //     preview_name: "Add Collector" +i,
        //     value: "Add Collector"+i,
        //     id: "Add"+i,
        //   });
        // }

        setSubMenuOptionsList(tmpArrOptions);
        setFullConfigList(res.data);
        setChosenConfig(res.data[indexForConfig]);
      }
    } catch (error) {
      console.log("Error in Getting Config List", error);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Error Happened While Fetching The Velociraptor Config",
        buttonTitle: "Close",
      });
    }
  };

  const HandleMenuSwitch = async (name, id) => {
    try {
      console.log("flip");
      set_config_save_btn(false);
      if (name == "Add Collector") {
        set_preview_or_edit(false);
      } else {
        set_preview_or_edit(true);
      }
      set_Preview_This_in_menu(name);
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

  useEffect(() => {
    if (backEndURL) {
      GetConfigList();
    }
  }, [Preview_This_in_menu, backEndURL]);

  const handle_view_or_edit = async () => {
    set_config_save_btn(false);
    set_preview_or_edit(!preview_or_edit);
    GetConfigList();
  };

  const HandleSavaVeloConfig = async () => {
    try {
      console.log("save", ChosenConfig);
      if (
        !ChosenConfig.config_name ||
        SubMenuOptionsList.find(
          (x) =>
            x?.value == ChosenConfig?.config_name &&
            x?.id != ChosenConfig?.config_id
        )
      ) {
        console.log("NO Config name ");
        set_PopUp_Error____show(true);
        set_PopUp_Error____txt({
          HeadLine: "Error",
          paragraph: `Change The Name OF the config It cant be empty Or A Duplicate`,
          buttonTitle: "Close",
        });
        return;
      }
      const res = await axios.post(
        `${backEndURL}/config/SaveConfigVelo`,
        ChosenConfig
      );
      console.log("res SaveConfigVelo SaveConfigVelo ", res);
      if (res.data) {
        handle_view_or_edit();
        set_PopUp_All_Good__txt({
          HeadLine: "Success",
          paragraph: "The Changes Where Successfully Saved",
          buttonTitle: "Ok",
        });
        set_PopUp_All_Good__show(true);
        setUpdateSideBar(Math.random());
      } else {
        console.log("error in Save");
        set_PopUp_Error____show(true);
        set_PopUp_Error____txt({
          HeadLine: "Error",
          paragraph: "Failed To save Velociraptor Config",
          buttonTitle: "Close",
        });
      }
    } catch (error) {
      console.log("Error in HandleSavaVeloConfig :", error);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Failed To save Velociraptor Config",
        buttonTitle: "Close",
      });
    }
  };
  const HandleAddVeloConfig = async () => {
    try {
      console.log("save", ChosenConfig);
      if (
        !ChosenConfig.config_name ||
        SubMenuOptionsList.find((x) => x.value == ChosenConfig.config_name)
      ) {
        console.log("NO Config name ");
        set_PopUp_Error____show(true);
        set_PopUp_Error____txt({
          HeadLine: "Error",
          paragraph: `Change The Name OF the config It cant be empty Or A Duplicate`,
          buttonTitle: "Close",
        });
        return;
      }
      const res = await axios.post(
        `${backEndURL}/config/InsertConfigVelo`,
        ChosenConfig
      );
      console.log("res SaveConfigVelo SaveConfigVelo ", res);
      if (res.data) {
        handle_view_or_edit();
        setUpdateSideBar(Math.random());
        set_PopUp_All_Good__txt({
          HeadLine: "Success",
          paragraph: "The New Velociraptor Config was Successfully Added",
          buttonTitle: "Ok",
        });
        set_PopUp_All_Good__show(true);
      } else {
        console.log("error in Add");
        set_PopUp_Error____show(true);
        set_PopUp_Error____txt({
          HeadLine: "Error",
          paragraph: "Failed To Add Velociraptor Config",
          buttonTitle: "Close",
        });
      }
    } catch (error) {
      console.log("Error in HandleAddVeloConfig :", error);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Failed To Add Velociraptor Config",
        buttonTitle: "Close",
      });
    }
  };

  const DeleteFuncCollectorsAll = async () => {
    try {
      console.log("DelFunc DeleteFuncCollectorsAll");

      const res = await axios.delete(
        `${backEndURL}/config/DeleteCollectorFolders`
      );
      console.log("Res sssssssssssssssssssssss", res.data);
    } catch (error) {
      console.log("This Is Error DeleteFuncCollectorsAll", error);
    }
  };

  const HandleFileImportVelo = async (e) => {
    try {
      let FilesToUp = [];
      let FilesToUpUnOff = [...e.target.files];

      console.log("Upload Official Things", FilesToUpUnOff);
      let resValue = "";

      for (let index = 0; index < FilesToUpUnOff.length; index++) {
        const file = FilesToUpUnOff[index];
        console.log("The Devil File", file);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        console.log("formData formData ", formData);
        const IdOfFile = file.name + Math.random();

        const res = await axios.post(
          `${backEndURL}/results/ImportVeloResult`,
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
            },
            onUploadProgress: (prog) => {
              try {
                const value = Math.round(prog.progress * 100);
                // console.log(
                //   UploadProgressBar,
                //   "UploadProgressBarUploadProgressBar",
                //   value
                // );

                if (!UploadProgressBar[IdOfFile]) {
                  console.log("empty 1111111111111111111111");

                  if (value < 100) {
                    UploadProgressBar[IdOfFile] = {
                      progress: value,
                      fileName: file.name,
                    };
                    setUploadProgressBar(UploadProgressBar);
                    setDownloadList(Math.random());
                  }
                }

                if (
                  (UploadProgressBar[IdOfFile]?.progress + 2 < value ||
                    (value >= 100 &&
                      UploadProgressBar[IdOfFile]?.progress != 100)) &&
                  UploadProgressBar[IdOfFile]?.progress !== undefined
                ) {
                  console.log("Download Prog ", value, UploadProgressBar);
                  UploadProgressBar[IdOfFile] = {
                    progress: value,
                    fileName: file.name,
                  };
                  setUploadProgressBar(UploadProgressBar);
                  setDownloadList(Math.random());
                }
              } catch (error) {
                console.log("Error in ONPeofressUpload ", error);
              }
            },
          }
        );

        console.log(res.data, "res of import config velo");
        if (res.data) {
          resValue = res.data;
        }
      }
      if (resValue) {
        set_PopUp_All_Good__txt({
          HeadLine: "Upload Ended",
          paragraph: `The Files have been successfully uploaded to the backend.`,
          buttonTitle: "Close",
        });
        set_PopUp_All_Good__show(true);
      } else {
        set_PopUp_Error____show(true);
        set_PopUp_Error____txt({
          HeadLine: "Error",
          paragraph: "Failed To Upload The Results",
          buttonTitle: "Close",
        });
      }
    } catch (error) {
      console.log("Error in HandleFileImportVelo ", error);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Failed To Upload The Results",
        buttonTitle: "Close",
      });
    }
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
      <div
      // className="app-main"
      >
        {/* <div className="top-of-page">
          <div className="top-of-page-left mb-a">
            <p className="font-type-h3">On Premise Velociraptor</p>
          </div>
          <div className="top-of-page-center"></div>
        </div> */}
        {/* <div className="resource-group-top-boxes mb-c"></div> */}
        <TopPageMenuVelo
          Preview_This_in_menu={Preview_This_in_menu}
          handle_Click_Btn={HandleMenuSwitch}
          sub_menu_options={SubMenuOptionsList}
          InputFunction={HandleFileImportVelo}
          DelFunc={DeleteFuncCollectorsAll}
        />

        <div className="mb-d"></div>
        <div>
          <table className="setting_table  " style={{ lineHeight: "100%" }}>
            <tbody>
              <tr>
                <td className="setting_descriptions">
                  <div>
                    {preview_or_edit ? (
                      <>
                        <p className="font-type-h4 Color-White mb-c">
                          {ChosenConfig.config_name} Config
                        </p>
                        <p
                          className="font-type-menu Color-White mb-a"
                          style={{
                            wordBreak: "break-word",
                            marginBottom: 15,
                          }}
                        >
                          {ChosenConfig.description}
                        </p>{" "}
                        <p className="font-type-txt Color-Grey1 mb-b">
                          To view and edit the general configuration, click
                          'EDIT'
                        </p>
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            // justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <input
                            className="font-type-h4 Color-White mb-c"
                            style={{
                              backgroundColor: "var(--color-Grey5)",
                              borderRadius: 15,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderWidth: 0,
                              width: 80,
                            }}
                            value={ChosenConfig.config_name}
                            onChange={async (e) => {
                              try {
                                console.log(e.target.value);

                                set_config_save_btn(true);
                                setChosenConfig({
                                  config: ChosenConfig?.config,
                                  description: ChosenConfig?.description,
                                  config_name: e.target.value,
                                  config_id: ChosenConfig?.config_id,
                                });
                              } catch (error) {
                                set_config_save_btn(false);
                                console.log("Error In name Change ", error);
                              }
                            }}
                          />
                          <p
                            className="font-type-h4 Color-White mb-c"
                            style={{ paddingLeft: 7 }}
                          >
                            Config
                          </p>
                        </div>
                        <textarea
                          className="font-type-menu Color-White mb-a"
                          style={{
                            wordBreak: "break-word",
                            marginBottom: 15,
                            width: "100%",
                            maxWidth: "100&",
                            minWidth: 100,
                            height: 200,
                            resize: "none",
                            backgroundColor: "var(--color-Grey5)",
                            borderWidth: 0,
                            paddingTop: 10,
                          }}
                          value={ChosenConfig?.description ?? ""}
                          maxLength={1000}
                          onChange={async (e) => {
                            try {
                              console.log(e.target.value);

                              set_config_save_btn(true);
                              setChosenConfig({
                                config: ChosenConfig?.config,
                                description: e.target.value,
                                config_name: ChosenConfig?.config_name,
                                config_id: ChosenConfig?.config_id,
                              });
                            } catch (error) {
                              set_config_save_btn(false);
                              console.log(
                                "Error In Description Change ",
                                error
                              );
                            }
                          }}
                        />{" "}
                        <p className="font-type-txt Color-Orange">
                          {" "}
                          Caution: Incorrect input may damage the functionality
                          of the software.
                        </p>
                      </>
                    )}
                  </div>
                  {/* Legend Start */}
                  <div style={{ position: "relative", bottom: 0 }}>
                    <p className="font-type-h4 Color-White mb-c">Legend:</p>
                    <div className="RowInLegend">
                      <p className="font-type-txt Color-Grey1 RowInLegendValue">
                        <p className="font-type-txt Color-White ">
                          Artifacts:{" "}
                        </p>
                        An Array of the artifacts that the Collector will Run
                      </p>
                    </div>{" "}
                    <div className="RowInLegend">
                      <p className="font-type-txt Color-Grey1 RowInLegendValue">
                        {" "}
                        <p className="font-type-txt Color-White ">name: </p>
                        The Name Of The Artifact In Velociraptor
                      </p>
                    </div>{" "}
                    <div className="RowInLegend">
                      <p className="font-type-txt Color-Grey1 RowInLegendValue">
                        <p className="font-type-txt Color-White ">
                          Parameters:{" "}
                        </p>
                        The Parameters That You Want To Configure For This
                        Artifact As {"{Name Of Parameter:Value Of Parameter"}
                      </p>
                    </div>
                    <div className="RowInLegend">
                      <p className="font-type-txt Color-Grey1 RowInLegendValue">
                        <p className="font-type-txt Color-White ">CpuLimit: </p>
                        How Much Cpu Usage In % Will The Artifact be Allowed To
                        Use
                      </p>
                    </div>{" "}
                    <div className="RowInLegend">
                      <p className="font-type-txt Color-Grey1 RowInLegendValue">
                        {" "}
                        <p className="font-type-txt Color-White ">
                          MaxExecutionTimeInSeconds:{" "}
                        </p>
                        Max Time The Collector will Run
                      </p>
                    </div>
                    <div className="RowInLegend">
                      <p className="font-type-txt Color-Grey1 RowInLegendValue">
                        <p className="font-type-txt Color-White ">
                          MaxIdleTimeInSeconds:{" "}
                        </p>
                        How Long Will The Collector Be Allowed To Idle
                      </p>
                    </div>
                    <div className="RowInLegend">
                      <p className="font-type-txt Color-Grey1 RowInLegendValue">
                        <p className="font-type-txt Color-White ">
                          EncryptionScheme:{" "}
                        </p>
                        The encryptions of the results Options Are None ,
                        Password , X509
                      </p>
                    </div>
                    <div className="RowInLegend">
                      <p className="font-type-txt Color-Grey1 RowInLegendValue">
                        {" "}
                        <p className="font-type-txt Color-White ">
                          EncryptionSchemeValue:{" "}
                        </p>
                        The Password For the Encryption if one was chosen
                      </p>
                    </div>
                  </div>
                  {/* Legend End */}
                </td>

                <td
                  className="setting_element PreviewBox"
                  style={{ height: "auto", width: "68.5vw" }}
                >
                  <div className=" ">
                    {preview_or_edit ? (
                      <div
                        className="setting_element"
                        style={{ overflowY: "scroll" }}
                      >
                        <JsonView
                          value={ChosenConfig?.config ?? {}}
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
                              position: "absolute",
                              zIndex: 5555555,
                              padding: 10,
                            }}
                          >
                            {ErrString}
                          </div>
                        )}

                        <CodeMirror
                          value={JSON.stringify(
                            ChosenConfig?.config ?? {},
                            null,
                            2
                          )}
                          height="600px"
                          // width="100%"
                          // maxWidth="auto"

                          onChange={async (x) => {
                            try {
                              console.log("flip", JSON.parse(x));
                              set_config_save_btn(true);
                              setChosenConfig({
                                config: JSON.parse(x),
                                description: ChosenConfig?.description,
                                config_name: ChosenConfig?.config_name,
                                config_id: ChosenConfig?.config_id,
                              });
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
                  {![].includes(ChosenConfig.config_name) && (
                    <>
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
                          onClick={
                            Preview_This_in_menu == "Add Collector"
                              ? HandleAddVeloConfig
                              : HandleSavaVeloConfig
                          }
                        >
                          <p className="font-type-menu ">
                            {Preview_This_in_menu == "Add Collector"
                              ? "Add"
                              : "Save"}
                          </p>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default VeloConfigMain;
