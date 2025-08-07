import React, { useEffect, useState, useContext } from "react";
import GeneralContext from "../Context.js";
import "./PopUp.css"; // import CSS file for modal styling
import { PreviewBox_type0_static } from "./PreviewBoxes.js";
import { ReactComponent as CloseButton } from "../Components/icons/ico-Close_type1.svg";
import { ReactComponent as SuccessIcon } from "../Components/icons/General-icons-success.svg";
import { ReactComponent as UnderConstruction } from "../Components/icons/General-icons-code.svg";
import { ReactComponent as CarefulIcon } from "../Components/icons/General-icons-careful.svg";
import { ReactComponent as InfofulIcon } from "../Components/icons/General-icons-info.svg";
import { ReactComponent as AlertInfo } from "../Components/icons/General-icons-alert.svg";
import { ReactComponent as Loader } from "../Components/icons/loader_typea.svg";
import { ReactComponent as IconReadMore } from "../Components/icons/ico-readmore.svg";
import { ReactComponent as IconCloseReadMore } from "../Components/icons/ico-close-readmore.svg";
import { ReactComponent as IconOpenReadMore } from "../Components/icons/ico-open-readmore.svg";
import { ReactComponent as IcoModules } from "../Components/icons/ico-menu-modules.svg";

import { ReactComponent as IcoEdit } from "../Components/icons/ico-edit.svg";

// import jsonData from '../tmpjsons/Nuclei.json'
import axios from "axios";
import {
  format_date_type_a,
  format_date_type_c,
} from "./Features/DateFormat.js";

import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

const downloadJsonFile = (file) => {
  console.log(file);
  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "data.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const PopUp_Request_info = (props) => {
  const { HeadLine, paragraph, popUp_show, set_popUp_show, buttonTitle } =
    props;
  const [active, setActive] = useState(false);
  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  useEffect(() => {
    if (popUp_show) {
      setTimeout(() => setActive(true), 100); // Wait for animation to finish before removing
    }
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      setActive(false); // Trigger exit animation
      setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
    }
  }

  function handleClose() {
    setActive(false); // Trigger exit animation
    setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
  }

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div
            className={`PopUp-content  ${active ? "popup-enter-active" : "popup-enter"
              }`}
            style={{ width: "auto", paddingBottom: " " }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            <InfofulIcon
              className="mb-a "
              alt="Icon"
              width="100px"
              height="70px"
              style={{ marginLeft: "-15px" }}
            />

            <p className="font-type-h4 Color-White mb-a">{HeadLine}</p>
            <p className="font-type-txt  reading-height Color-White">
              {paragraph}
            </p>

            <div className="display-flex mt-c" style={{}}>
              <button
                className="btn-type2   '"
                style={{ marginLeft: "auto" }}
                onClick={handleClose}
              >
                <p className="font-type-menu ">{buttonTitle}</p>{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_All_Good = (props) => {
  const { HeadLine, paragraph, popUp_show, set_popUp_show, buttonTitle } =
    props;
  const [active, setActive] = useState(false);

  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  useEffect(() => {
    if (popUp_show) {
      setTimeout(() => setActive(true), 100); // Wait for animation to finish before removing
    }
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      setActive(false); // Trigger exit animation
      setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
    }
  }

  function handleClose() {
    setActive(false); // Trigger exit animation
    setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
  }

  return (
    <>
      {popUp_show && (
        <div
          className={`PopUp-background`}
          onClick={handleClickOutside}
          style={{ wordWrap: "break-word" }}
        >
          <div
            className={`PopUp-content  ${active ? "popup-enter-active" : "popup-enter"
              }`}
            style={{ width: "250px", paddingBottom: " " }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            <SuccessIcon
              className="mb-a "
              alt="Icon"
              width="100px"
              height="70px"
              style={{ marginLeft: "-15px" }}
            />

            <p className="font-type-h4 Color-White mb-a">{HeadLine}</p>
            <p className="font-type-txt  reading-height Color-White">
              {paragraph}
            </p>

            <div className="display-flex mt-c" style={{}}>
              <button
                className="btn-type2   '"
                style={{ marginLeft: "auto" }}
                onClick={handleClose}
              >
                <p className="font-type-menu ">{buttonTitle}</p>{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_Mod_Tags = (props) => {
  const {
    popUp_show,
    set_popUp_show,
    ModObj,
    backEndURL,
    GetAllToolAndArtifactFunc,
  } = props;
  const [active, setActive] = useState(false);
  const [NewTagName, setNewTagName] = useState("");
  const [TagsArray, SetTagsArray] = useState([]);
  const [UpdaterThing, SetUpdaterThing] = useState(false);
  const [AlreadyExistsError, setAlreadyExistsError] = useState(false);

  useEffect(() => {
    set_popUp_show(popUp_show);
    SetTagsArray(ModObj?.tags);
  }, [popUp_show]);

  useEffect(() => {
    if (popUp_show) {
      setTimeout(() => setActive(true), 100); // Wait for animation to finish before removing
    }
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      setActive(false); // Trigger exit animation
      setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
    }
  }

  function handleClose() {
    setActive(false); // Trigger exit animation
    setAlreadyExistsError(false);
    setNewTagName("");
    GetAllToolAndArtifactFunc();
    setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
  }

  async function HandleAddTag() {
    try {
      console.log("HandleAddTag Start");
      if (NewTagName.trim() == "") {
        setAlreadyExistsError("Empty");
        console.log("Cant add an empty string");
        return;
      }
      if (
        ModObj?.tags?.some((xArrTem) =>
          xArrTem?.toLowerCase()?.trim() == NewTagName.trim()
        )
      ) {
        setAlreadyExistsError("Exits");
        console.log("Cant Add Tag Already Exists");
        return;
      }
      if (NewTagName.trim() == "Tags") {
        setAlreadyExistsError("Reserved");
        console.log("Cant Add Tag as it is a Reserved name");
        return;
      }

      const res = await axios.post(`${backEndURL}/Resources/AddTagToResource`, {
        id: ModObj.id,
        tag: NewTagName.trim(),
      });
      ModObj?.tags?.push(NewTagName.trim());
      setNewTagName("");
      SetTagsArray(ModObj?.tags);
    } catch (err) {
      console.log("Error in HandleAddTag : ", err);
    }
  }

  async function HandleDeleteTag(tag) {
    try {
      console.log("HandleDeleteTag Start");
      const res = await axios.post(
        `${backEndURL}/Resources/DeleteTagToResource`,
        {
          id: ModObj?.id,
          tag: tag,
        }
      );
      console.log("res 44444", res.data?.newTags);
      const indexo = ModObj?.tags?.indexOf(tag);
      if (indexo > -1) {
        console.log("555555555555", indexo);

        ModObj?.tags?.splice(indexo, 1);

        SetTagsArray(ModObj?.tags);
        SetUpdaterThing(!UpdaterThing);
      }
    } catch (err) {
      console.log("Error in HandleDeleteTag : ", err);
    }
  }

  return (
    <>
      {popUp_show && (
        <div
          className={`PopUp-background`}
          onClick={handleClickOutside}
          style={{ wordWrap: "break-word" }}
        >
          <div
            className={`PopUp-content  ${active ? "popup-enter-active" : "popup-enter"
              }`}
            style={{ width: "450px", paddingBottom: " " }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            <p className="font-type-h4 Color-White mb-a">
              Existing Tags For {ModObj?.name} {UpdaterThing ? "" : ""}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 3,
                marginTop: 15,
                marginBottom: 35,
                // overflowX: "auto",
                // width: "95%",
                flexWrap: "wrap",
              }}
            >
              {TagsArray?.map((yyu) => (
                <p
                  onClick={() => HandleDeleteTag(yyu)}
                  className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1"
                  style={{ fontSize: 18 }}
                >
                  {yyu}
                </p>
              ))}
            </div>
            {AlreadyExistsError &&
              (AlreadyExistsError === "Empty" ? (
                <p style={{ color: "var(--color-Red)" }}>Cant Add Empty Tag</p>
              ) : AlreadyExistsError === "Exits" ? (
                <p style={{ color: "var(--color-Red)" }}>
                  Tag Already Assigned To This Module
                </p>
              ) : (
                <p style={{ color: "var(--color-Red)" }}>
                  Tag Name IS a Reserved Name
                </p>
              ))}
            <p className="font-type-h4 Color-White mb-a">
              Add Tag For {ModObj?.name}
            </p>
            <input
              className="input-type1 search_filter "
              placeholder="Tag Name"
              value={NewTagName}
              onKeyPress={(event) => {
                if (event.key == "Enter") {
                  console.log("Well Hello Mate yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
                  );
                  HandleAddTag()
                }
              }}

              onChange={(e) => {
                if (AlreadyExistsError) {
                  setAlreadyExistsError(false);
                }
                setNewTagName(e.target.value);
              }}
            />
            <div className="display-flex mt-c" style={{}}>
              <button
                className="btn-type2   '"
                style={{ marginLeft: "auto" }}
                onClick={HandleAddTag}
              >
                <p className="font-type-menu ">Add</p>{" "}
              </button>
              <button
                className="btn-type2   '"
                style={{ marginLeft: "auto" }}
                onClick={handleClose}
              >
                <p className="font-type-menu ">Close</p>{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_Mod_Config_Edit = (props) => {
  const { popUp_show, set_popUp_show, infoConf, backEndURL } = props;
  const [active, setActive] = useState(false);
  const [object, setObject] = useState({ infoConf });
  const [ErrString, setErrString] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const [config_save_btn, set_config_save_btn] = useState(false);

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

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      setActive(false); // Trigger exit animation
      setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
    }
  }

  function handleClose() {
    setActive(false); // Trigger exit animation
    setEditorValue("");
    setObject({});
    set_config_save_btn(false);
    setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
  }

  async function BringConfig() {
    try {
      console.log("Start BringConfig");
      const res = await axios.post(backEndURL + "/config/BringSpecificConfig", {
        id: infoConf?.tool_id ?? infoConf?.artifact_id,
        artifactOrTool: infoConf?.parent_id ? true : false,
        name: infoConf?.Tool_name ?? infoConf?.Toolname,
      });
      console.log("res res res", res);

      setObject(res.data);
      console.log(
        "Object.entries()Object.entries()Object.entries()Object.entries()Object.entries()",
        Object.entries(res.data)
      );

      setEditorValue(JSON.stringify(res.data, null, 2));
    } catch (error) {
      console.log("Error in BringConfig : ", error);
    }
  }

  async function SaveSpecificConfig() {
    try {
      console.log("Start SaveSpecificConfig");
      const res = await axios.post(backEndURL + "/config/SaveSpecificConfig", {
        cho: object,
        artifactOrTool: infoConf?.parent_id ? true : false,
        name: infoConf?.Tool_name ?? infoConf?.Toolname,
      });
      console.log("res res res", res);
      if (res.data) {
        handleClose();
      } else {
        setErrString("Error Happened IN Saving");
      }
    } catch (error) {
      console.log("Error in SaveSpecificConfig : ", error);
    }
  }

  useEffect(() => {
    console.log(infoConf, "infoConf infoConf infoConf infoConf infoConf");
    if (popUp_show) {
      BringConfig();
    }
  }, [popUp_show]);

  useEffect(() => {
    if (editorValue) {
      console.log("asdasdasd");

      return;
    }
    setEditorValue(JSON.stringify(object, null, 2));
  }, [object]);

  useEffect(() => {
    if (popUp_show) {
      setTimeout(() => setActive(true), 100); // Wait for animation to finish before removing
    }
  }, [popUp_show]);

  return (
    <>
      {popUp_show && (
        <div
          className={`PopUp-background`}
          onClick={handleClickOutside}
          style={{ wordWrap: "break-word" }}
        >
          <div
            className={`PopUp-content  ${active ? "popup-enter-active" : "popup-enter"
              }`}
            style={{ width: "70%", paddingBottom: " " }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            <p className="font-type-h4 Color-White mb-a">
              Edit{" "}
              {infoConf?.Toolname ??
                (infoConf?.Tool_name == "AIVulnerability"
                  ? "AI Vulnerability"
                  : infoConf?.Tool_name)}{" "}
              Config
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 3,
                marginTop: 15,
                marginBottom: 35,
                // overflowX: "auto",
                // width: "95%",
                flexWrap: "wrap",
              }}
            ></div>
            {/* <p className="font-type-h4 Color-White mb-a">Config 2</p> */}
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

            <div
              className="display-flex mt-c"
              style={{ justifyContent: "flex-end" }}
            >
              {config_save_btn && (
                <button
                  className="btn-type2   '"
                  style={{ marginLeft: 10 }}
                  onClick={SaveSpecificConfig}
                >
                  <p className="font-type-menu ">Save</p>{" "}
                </button>
              )}
              <button
                className="btn-type2   '"
                style={{ marginLeft: 10 }}
                onClick={() => {
                  setEditorValue(JSON.stringify(object, null, 2));
                }}
              >
                <p className="font-type-menu ">Format</p>{" "}
              </button>
              <button
                className="btn-type2   '"
                style={{ marginLeft: 10 }}
                onClick={handleClose}
              >
                <p className="font-type-menu ">Close</p>{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_Alert_info = (props) => {
  const {
    Info,
    popUp_show,
    set_popUp_show,
    backEndURL,
    set_Preview_this_Results,
    GetData,
    set_PopUp_All_Good__show,
    set_PopUp_All_Good__txt,
    set_PopUp_Error____show,
    set_PopUp_Error____txt,
  } = props;

  const [active, setActive] = useState(false);
  const [AlertColors, set_AlertColors] = useState(false);
  const [IsCollapseMetaDataOpen, setISCollapseMetaDataOpen] = useState(false);
  const [open_long_text_key, set_open_long_text_key] = useState("");
  const [download_drop_down, set_download_drop_down] = useState(false);

  const handle_download_drop_down = () => {
    set_download_drop_down(!download_drop_down);
  };

  const StatusTags = [
    // "New",
    "Unreviewed",

    "InProgress",
    "False Positive",
    "True Positive",
    "Ignore",
    "Closed",
    "Reopened",
  ];
  // useEffect(() => {
  //   set_popUp_show(popUp_show);
  // }, [popUp_show]);

  useEffect(() => {
    if (popUp_show) {
      setTimeout(() => setActive(true), 100); // Wait for animation to finish before removing
    }
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      setActive(false); // Trigger exit animation
      setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
    }
  }

  function handleClose() {
    setActive(false); // Trigger exit animation
    setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
  }

  const SelectDropHandle = async (val) => {
    try {
      console.log(
        "2222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        val
      );
      Info.UserInput.Status = val;
      Info.UserInput.ChangedAt = new Date();
      const res = await axios.post(backEndURL + "/Alerts/UpdateAlertFileData", {
        Info,
      });
      console.log(
        res,
        "33333333333333333333333333ttttttttttttttttttttttttttttttttttttttt"
      );
      if (res.data) {
        console.log(
          "tyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        );
        GetData();
      }
      set_popUp_show(false);
    } catch (error) {
      console.log(error, " Error In Select Status");
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Error in Select Status",
        buttonTitle: "OK",
      });
    }
  };

  const handle_open_long_text = (key) => {
    console.log("handle_open_long_text", key);

    if (!key) {
      return;
    }
    if (open_long_text_key === key) {
      set_open_long_text_key("");
    } else {
      set_open_long_text_key(key);
    }
  };

  const keyStyle = {
    width: "250px",
    textOverflow: "ellipsis",
    overflowX: "hidden",
  };

  const LineStyle = {
    // maxHeight: "20px",
    display: "flex",
    transition: "height 0.3s ease",
    marginTop: "calc(var(--space-a)/1 )",
    textOverflow: "ellipsis",
  };

  const LineStyleOpen = {
    maxHeight: "1110px",
  };

  const maxCharacters = 69;

  const firstValueStayle = {
    // width:"100%",
    // maxHeight:"150px" ,
    overflowY: "auto",
    // whiteSpace: "pre-wrap",

    wordBreak: "break-word",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const fullValueStayle = {
    // width:"100%",
    wordBreak: "break-word",
    maxHeight: "180px",
    overflowY: "scroll",
    paddingRight: "10px",

    // whiteSpace: "pre-wrap",
    // wordWrap: "break-word",
    //  wordBreak: "break-word",
    // textOverflow: "ellipsis",
    // whiteSpace: "nowrap",
    // overflow: "hidden",
    // textOverflow: "ellipsis",
  };

  return (
    <>
      {popUp_show && (
        <div
          className={`PopUp-background`}
          style={{}}
          onClick={handleClickOutside}
        >
          <div
            className={`PopUp-content  ${active ? "popup-enter-active" : "popup-enter"
              }`}
            style={{
              width: "820px",
              maxHeight: "85%",
              paddingBottom: " ",
              overflowY: "auto",
            }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <div
                className={`${AlertColors}   light-bulb-type1`}
                style={{
                  // marginLeft:"auto", marginRight:"auto"
                  left: "44px",
                  top: "1px",
                  position: "absolute",
                }}
              />
              <div
                style={{ display: "flex", alignItems: "center", gap: "80px" }}
              >
                <AlertInfo
                  className="mb-a "
                  alt="Icon"
                  width="48px"
                  height="70px"
                  style={{ marginLeft: " " }}
                />

                <p className="font-type-h4 Color-White ">
                  {format_date_type_a(Info?._ts)}
                </p>
              </div>
            </div>

            {IsCollapseMetaDataOpen ? (
              <div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p
                    className="font-type-menu reading-height  Color-White"
                    style={{
                      ...keyStyle,
                    }}
                  >
                    Metadata
                  </p>{" "}
                  <button
                    className="btn-type3 "
                    onClick={() => {
                      setISCollapseMetaDataOpen(false);
                    }}
                    style={{
                      height: "12px",
                      // marginLeft: "auto",
                      // marginBottom: "auto",
                      // marginTop: "auto",
                      padding: 0,
                    }}
                  >
                    <p className=" font-type-txt">Collapse</p>
                    <IconCloseReadMore
                      className="icon-type1 "
                      style={{ height: "24px" }}
                    />{" "}
                  </button>
                </div>

                <div
                  style={{
                    height: "36px",
                    marginBottom: "var(--space-c)",
                  }}
                >
                  <div
                    style={{
                      // backgroundColor:"yellow",
                      height: "100%",
                      display: "flex",
                    }}
                  >
                    <p
                      className="font-type-menu reading-height  Color-White"
                      style={{
                        ...keyStyle,
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      {" "}
                      Status:
                    </p>

                    <div style={{}}>
                      <div
                        className="btn-menu-list"
                        onMouseLeave={() => set_download_drop_down(false)}
                        //  onMouseEnter={()=>set_download_drop_down(true)}
                        style={{
                          marginLeft: "-13px",
                          width: "auto",
                          position: "absolute",
                          zIndex: 1000,
                          // backgroundColor:"green"
                        }}
                      >
                        <button
                          className={`btn-menu  ${download_drop_down ? "btn_look_hover" : ""
                            } `}
                          onClick={handle_download_drop_down}
                        >
                          <div className="display-flex">
                            {/* <IcoEdit className="btn-menu-icon-placeholder  mr-a " /> */}

                            <p className="font-type-menu ml-b">
                              {" "}
                              {Info.UserInput?.Status}
                            </p>
                          </div>
                          <div
                            className="btn-menu-icon-placeholder  "
                            style={{
                              justifyContent: "flex-start",
                              backgroundColor: "",
                              marginLeft: "5px",
                              marginRight: "auto",
                            }}
                          >
                            <IcoEdit className="btn-menu-icon-placeholder " />
                          </div>
                        </button>

                        {/* fix */}
                        <div
                          className={`dropdown-menu ${download_drop_down ? "open" : ""
                            }`}
                        >
                          {StatusTags.map((y) => {
                            if (y == Info.UserInput?.Status) return;
                            return (
                              <button
                                className="btn-menu"
                                onClick={() => SelectDropHandle(y)}
                              >
                                <div className="display-flex">
                                  {/* <IcoEdit  className="btn-menu-icon-placeholder  mr-a "  style={{ visibility: "hidden" }} /> */}
                                  <p className="font-type-menu ml-b">{y}</p>
                                </div>

                                <div className="btn-menu-icon-placeholder  ">
                                  <IcoEdit
                                    className="btn-menu-icon-placeholder  mr-a "
                                    style={{ visibility: "hidden" }}
                                  />
                                  {/*  <MenuArrowDown  />*/}{" "}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div style={LineStyle}>
                  <p
                    className="font-type-menu reading-height  Color-White"
                    style={keyStyle}
                  >
                    AlertID:
                  </p>
                  <p
                    className="font-type-txt  reading-height Color-Grey1  "
                    style={firstValueStayle}
                  >
                    {Info?.AlertID}
                  </p>
                </div> */}
                <div style={LineStyle}>
                  <p
                    className="font-type-menu reading-height  Color-White"
                    style={keyStyle}
                  >
                    Alert Name:
                  </p>
                  <p
                    className="font-type-txt  reading-height Color-Grey1  "
                    style={firstValueStayle}
                  >
                    {Info?.Artifact}
                  </p>
                </div>
                <div style={LineStyle}>
                  <p
                    className="font-type-menu reading-height  Color-White"
                    style={keyStyle}
                  >
                    Simple Name:
                  </p>
                  <p
                    className="font-type-txt  reading-height Color-Grey1  "
                    style={firstValueStayle}
                  >
                    {Info?.SimpleName}
                  </p>
                </div>
                <div style={LineStyle}>
                  <p
                    className="font-type-menu reading-height  Color-White"
                    style={keyStyle}
                  >
                    Description:
                  </p>
                  <p
                    className="font-type-txt  reading-height Color-Grey1  "
                    style={firstValueStayle}
                  >
                    {Info?.Description}
                  </p>
                </div>

                {/* <div style={LineStyle} >
                  <p className="font-type-menu reading-height  Color-White" style={keyStyle}         >Time:</p>
                  <p className="font-type-txt  reading-height Color-Grey1  " style={firstValueStayle}>{format_date_type_a(Info?._ts)}</p>
                  </div> */}

                <div style={LineStyle}>
                  <p
                    className="font-type-menu reading-height  Color-White"
                    style={keyStyle}
                  >
                    {" "}
                    Owner:
                  </p>
                  <p
                    className="font-type-txt  reading-height Color-Grey1  "
                    style={firstValueStayle}
                  >
                    {Info.UserInput?.UserId}
                  </p>
                </div>

                {/* <div style={LineStyle}>
                  <p
                    className="font-type-menu reading-height  Color-White"
                    style={keyStyle}
                  >
                    {" "}
                    StatusChangedAt:
                  </p>
                  <p
                    className="font-type-txt  reading-height Color-Grey1  "
                    style={firstValueStayle}
                  >
                    {format_date_type_a(Info.UserInput?.ChangedAt)}
                  </p>
                </div> */}

                <p
                  className="font-type-txt  reading-height Color-Grey1  "
                  style={firstValueStayle}
                >
                  ----------------------------------------------------------------------------------------
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p
                  className="font-type-menu reading-height  Color-White"
                  style={{
                    ...keyStyle,
                  }}
                >
                  Meta Data
                </p>{" "}
                <button
                  className="btn-type3 "
                  onClick={() => {
                    setISCollapseMetaDataOpen(true);
                  }}
                  style={{
                    height: "12px",
                    // marginLeft: "auto",
                    // marginBottom: "auto",
                    // marginTop: "auto",
                    padding: 0,
                  }}
                >
                  <p className=" font-type-txt">Expand</p>
                  <IconOpenReadMore
                    className="icon-type1 "
                    style={{ height: "24px" }}
                  />{" "}
                </button>
              </div>
            )}

            {Object.keys(Info).map((key) => {
              if (
                [
                  "UserInput",
                  "_ts",
                  "Artifact",
                  "buttonTitle",
                  "Show",
                  "AlertID",
                  "Description",
                  "SimpleName",
                ].includes(key)
              ) {
                return;
              }

              // const paragraph = typeof Info[key] !== "object" ? Info[key] : JSON.stringify(Info[key])
              const paragraph =
                typeof Info[key] !== "object"
                  ? String(Info[key])
                  : JSON.stringify(Info[key]);

              return (
                <div style={{ ...LineStyle }}>
                  {/* open_long_text_key === key && ...LineStyleOpen */}
                  <p
                    className="font-type-menu reading-height  Color-White"
                    style={{
                      ...keyStyle,
                      marginTop: open_long_text_key === key && "23px",
                      // {open_long_text_key === key  ?
                    }}
                  >
                    {key}:{" "}
                  </p>

                  <div
                    style={{
                      height: " ",
                      display: "flex",
                      // width: "100%",
                      flexDirection: "row",
                    }}
                  >
                    {open_long_text_key === key ? (
                      <>
                        <div className="mb-b">
                          <button
                            className="btn-type3 "
                            onClick={() => {
                              handle_open_long_text(key);
                            }}
                            style={{
                              // height:"12px",
                              marginLeft: "auto",
                              marginBottom: "auto",
                              marginTop: "auto",
                              padding: 0,
                            }}
                          >
                            <p className=" font-type-txt">Collapse</p>
                            <IconCloseReadMore
                              className="icon-type1 "
                              style={{ height: "24px" }}
                            />{" "}
                          </button>

                          <p
                            className="font-type-txt  reading-height Color-Grey1 mb-b "
                            style={fullValueStayle}
                          >
                            {" "}
                            {paragraph}{" "}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p
                          className="font-type-txt  reading-height Color-Grey1 "
                          style={firstValueStayle}
                        >
                          {" "}
                          {paragraph.slice(0, maxCharacters)}{" "}
                          {paragraph?.length > maxCharacters && "..."}{" "}
                        </p>
                        {paragraph?.length > maxCharacters && (
                          <button
                            className="btn-type3 "
                            onClick={() => {
                              handle_open_long_text(key);
                            }}
                            style={{
                              height: "12px",
                              marginLeft: "auto",
                              marginBottom: "auto",
                              marginTop: "auto",
                              padding: 0,
                            }}
                          >
                            <p className=" font-type-txt">Expand</p>
                            <IconOpenReadMore
                              className="icon-type1 "
                              style={{ height: "24px" }}
                            />{" "}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="display-flex mt-c" style={{}}>
              <button
                className="btn-type2   '"
                style={{ marginLeft: "auto" }}
                onClick={handleClose}
              >
                <p className="font-type-menu ">{Info?.buttonTitle}</p>{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_Are_You_Sure = (props) => {
  const {
    HeadLine,
    paragraph,
    popUp_show,
    set_popUp_show,
    button_True_text,
    button_False_text,
    True_action,
    False_action,
  } = props;
  const [active, setActive] = useState(false);
  const [disable_buttons, set_disable_buttons] = useState(false);

  useEffect(() => {
    if (popUp_show) {
      setTimeout(() => setActive(true), 100); // Wait for animation to finish before removing
    }
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      setActive(false); // Trigger exit animation
      setTimeout(() => False_action()); // Wait for animation to finish before removing
    }
  }

  function handleClose() {
    setActive(false); // Trigger exit animation
    setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
  }

  // function handleClose() {
  //   // False_action();
  //   setActive(false); // Trigger exit animation
  //   setTimeout(() => False_action(), 100); // Wait for animation to finish before removing
  // }

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div
            className={`PopUp-content  ${active ? "popup-enter-active" : "popup-enter"
              }`}
            style={{ width: "250px", paddingBottom: " " }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            <CarefulIcon
              className="mb-a "
              alt="Icon"
              width="100px"
              height="70px"
              style={{ marginLeft: "-15px" }}
            />

            <p className="font-type-h4 Color-White mb-a">{HeadLine}</p>
            <p className="font-type-txt  reading-height Color-White">
              {paragraph}
            </p>

            <div className="display-flex mt-c" style={{}}>
              <button
                className="btn-type2"
                disabled={disable_buttons}
                style={{ marginLeft: "auto" }}
                onClick={() => {
                  True_action();
                  set_disable_buttons(true); // Assuming disable_buttons is a function that accepts a boolean argument
                }}
              >
                <p className="font-type-menu ">{button_True_text}</p>{" "}
              </button>
              <button
                className="btn-type2"
                disabled={disable_buttons}
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  False_action();
                  set_disable_buttons(true); // Assuming disable_buttons is a function that accepts a boolean argument
                }}
              >
                <p className="font-type-menu ">{button_False_text}</p>{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_For_Read_More = (props) => {
  const {
    HeadLine,
    readMoreText,
    popUp_show,
    set_popUp_show,
    logoAddress_1_ForSrc,
    toolURL,
    buttonTitle,
    IconAddressForSrc,
    popUp_iconSize,
  } = props;
  const [active, setActive] = useState(false);

  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  useEffect(() => {
    if (popUp_show) {
      setTimeout(() => setActive(true), 100); // Wait for animation to finish before removing
    }
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      setActive(false); // Trigger exit animation
      setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
    }
  }

  function handleClose() {
    setActive(false); // Trigger exit animation
    setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
  }

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div
            className={`PopUp-content  ${active ? "popup-enter-active" : "popup-enter"
              }`}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            {IconAddressForSrc !== undefined && IconAddressForSrc !== "" ? (
              <>
                <img
                  src={IconAddressForSrc}
                  alt="Icon"
                  width={popUp_iconSize === "Big" ? "200" : "70"}
                  height={popUp_iconSize === "Big" ? "100" : "70"}
                  className="mb-a"
                  style={{
                    marginLeft: popUp_iconSize === "Big" && "-15px",
                    marginBottom: popUp_iconSize === "Big" && "5px",
                  }}
                />
              </>
            ) : null}

            <p className="font-type-h4 Color-White mb-b">{HeadLine}</p>
            <p className="font-type-txt  reading-height Color-White">
              {readMoreText}
            </p>

            <div className="display-flex mt-c" style={{}}>
              {logoAddress_1_ForSrc !== "" && (
                <>
                  <p className="font-type-very-sml-txt   Color-Grey1 mr-a">
                    By:
                  </p>
                  <img
                    src={logoAddress_1_ForSrc}
                    alt="logo"
                    maxwidth="140px"
                    height="30"
                  />
                </>
              )}
              {buttonTitle === "Close" ? (
                <button
                  className="btn-type2"
                  onClick={handleClose}
                  style={{ marginLeft: "auto" }}
                >
                  <p className="font-type-menu ">{buttonTitle}</p>{" "}
                </button>
              ) : (
                <a
                  href={toolURL}
                  target="_blank"
                  style={{ marginLeft: "auto" }}
                >
                  {" "}
                  <button className="btn-type2">
                    <p className="font-type-menu ">{buttonTitle}</p>{" "}
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_For_Dehashed_data = (props) => {
  const {
    HeadLine,
    popUp_show,
    set_popUp_show,
    logoAddress_1_ForSrc,
    toolURL,
    buttonTitle,
    IconAddressForSrc,
    popUp_iconSize,
  } = props;
  const { backEndURL } = useContext(GeneralContext);
  const [Dehashed_data, set_Dehashed_data] = useState({});
  const [active, setActive] = useState(false);

  // get json HashR data
  useEffect(() => {
    const tmpdata2 = {};

    set_Dehashed_data(tmpdata2);
  }, []);

  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  useEffect(() => {
    if (popUp_show) {
      setTimeout(() => setActive(true), 100); // Wait for animation to finish before removing
    }
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      setActive(false); // Trigger exit animation
      setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
    }
  }

  function handleClose() {
    setActive(false); // Trigger exit animation
    setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
  }

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div
            className={`PopUp-content  ${active ? "popup-enter-active" : "popup-enter"
              }`}
            style={{ width: "80%" }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            {IconAddressForSrc !== undefined && IconAddressForSrc !== "" ? (
              <>
                <img
                  src={IconAddressForSrc}
                  alt="Icon"
                  width={popUp_iconSize === "Big" ? "200" : "70"}
                  height={popUp_iconSize === "Big" ? "100" : "70"}
                  className="mb-a"
                  style={{
                    marginLeft: popUp_iconSize === "Big" && "-15px",
                    marginBottom: popUp_iconSize === "Big" && "5px",
                  }}
                />{" "}
              </>
            ) : null}

            <p className="font-type-h4 Color-White mb-b">{HeadLine} </p>

            <div
              className="display-flex   align-items-center    mb-c"
              style={{ height: "30px" }}
            >
              <div
                className="display-flex   align-items-center     mr-c"
                style={{ height: "30px" }}
              >
                <p className="font-type-txt Color-Blue-Glow mr-a">Balance </p>
                <p className="font-type-menu  Color-Blue-Glow  ">
                  {" "}
                  {Dehashed_data?.balance}
                </p>
              </div>

              <div
                className="display-flex   align-items-center    mr-c "
                style={{ height: "30px" }}
              >
                <p className="font-type-txt Color-Blue-Glow mr-a">Took </p>
                <p className="font-type-menu  Color-Blue-Glow  ">
                  {" "}
                  {Dehashed_data?.took}
                </p>
              </div>

              <div
                className="display-flex   align-items-center   mr-c  "
                style={{ height: "30px" }}
              >
                <p className="font-type-txt Color-Blue-Glow mr-a">Success </p>
                <p className="font-type-menu  Color-Blue-Glow  ">
                  {" "}
                  {Dehashed_data?.success === true ? "True" : "False"}
                </p>
              </div>

              <div
                className="display-flex   align-items-center   mr-c  "
                style={{ height: "30px" }}
              >
                <p className="font-type-txt Color-Blue-Glow mr-a">
                  Total Count
                </p>
                <p className="font-type-menu  Color-Blue-Glow  ">
                  {" "}
                  {Dehashed_data?.total}{" "}
                </p>
              </div>
            </div>

            <div
              style={{
                height: "100px",
                overflowY: "auto",
                margin: 0,
                padding: 0,
              }}
            >
              <div className="display-flex   align-items-center" style={{}}>
                <table className="pop_up_table">
                  <thead>
                    <tr>
                      <th>database_name</th>
                      <th>email</th>
                      <th>hashed_password</th>
                      <th>id</th>

                      <th>ip_address</th>
                      <th>name</th>
                      <th>password</th>
                      <th>phone</th>
                      <th>username</th>
                      <th>vin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Dehashed_data?.entries?.map((item, index) => (
                      <tr key={index} style={{ height: "20px" }}>
                        <td>
                          <p>{item?.database_name}</p>
                        </td>
                        <td>
                          <p>{item?.email}</p>
                        </td>
                        <td>
                          <p>{item?.hashed_password}</p>
                        </td>
                        <td>
                          <p>{item?.id}</p>
                        </td>

                        <td>
                          <p>{item?.ip_address}</p>
                        </td>
                        <td>
                          <p>{item?.name}</p>
                        </td>
                        <td>
                          <p>{item?.password}</p>
                        </td>
                        <td>
                          <p>{item?.phone}</p>
                        </td>
                        <td>
                          <p>{item?.username}</p>
                        </td>
                        <td>
                          <p>{item?.vin}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* <p  className="font-type-txt  reading-height Color-White"  >{Info?.template} </p> */}
                {/* <p  className="font-type-txt  reading-height Color-White"  >{jsonData} </p> */}
              </div>

              {/* ))} */}
            </div>

            <div className="display-flex mt-c" style={{}}>
              <p className="font-type-very-sml-txt   Color-Grey1 mr-a">By:</p>
              <img
                src={logoAddress_1_ForSrc}
                alt="logo"
                maxwidth="140px"
                height="30"
                style={{ marginRight: "auto" }}
              />

              {buttonTitle === "Close" ? (
                <button className="btn-type2" onClick={handleClose}>
                  <p className="font-type-menu ">{buttonTitle}</p>{" "}
                </button>
              ) : (
                <div>
                  <button
                    className="btn-type2   "
                    onClick={() => downloadJsonFile(Dehashed_data)}
                  >
                    <p className="font-type-menu ">Download JSON File</p>{" "}
                  </button>
                  <a href={toolURL} target="_blank" className="  ml-b">
                    {" "}
                    <button className="btn-type2">
                      <p className="font-type-menu ">{buttonTitle}</p>{" "}
                    </button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_Error = (props) => {
  const { HeadLine, paragraph, popUp_show, set_popUp_show, buttonTitle } =
    props;
  const [active, setActive] = useState(false);

  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  useEffect(() => {
    if (popUp_show) {
      setTimeout(() => setActive(true), 100); // Wait for animation to finish before removing
    }
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      setActive(false); // Trigger exit animation
      setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
    }
  }

  function handleClose() {
    setActive(false); // Trigger exit animation
    setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
  }

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div
            className={`PopUp-content  ${active ? "popup-enter-active" : "popup-enter"
              }`}
            style={{
              width: "auto",
              //  width: "-webkit-fill-available"
              //   ,

              minWidth: "250px",
              paddingBottom: " ",
            }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            <CarefulIcon
              className="mb-a "
              alt="Icon"
              width="100px"
              height="70px"
              style={{ marginLeft: "-15px" }}
            />

            <p className="font-type-h4 Color-White mb-a">{HeadLine}</p>
            <p className="font-type-txt  reading-height Color-White">
              {paragraph}
            </p>

            <div className="display-flex mt-c" style={{}}>
              <button
                className="btn-type2   '"
                style={{ marginLeft: "auto" }}
                onClick={handleClose}
              >
                <p className="font-type-menu ">{buttonTitle}</p>{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_loader = (props) => {
  const { popUp_show, set_popUp_show } = props;
  const [active, setActive] = useState(false);

  // useEffect(() => {
  //   set_popUp_show(popUp_show)
  // }, [popUp_show]);

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`}>
          <div className="PopUp-loader">
            {" "}
            <Loader />
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_Under_Construction = (props) => {
  const { HeadLine, paragraph, popUp_show, set_popUp_show, buttonTitle } =
    props;
  const [active, setActive] = useState(false);

  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  useEffect(() => {
    if (popUp_show) {
      setTimeout(() => setActive(true), 100); // Wait for animation to finish before removing
    }
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      setActive(false); // Trigger exit animation
      setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
    }
  }

  function handleClose() {
    setActive(false); // Trigger exit animation
    setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
  }

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div
            className={`PopUp-content  ${active ? "popup-enter-active" : "popup-enter"
              }`}
            style={{ width: "250px", paddingBottom: " " }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            <UnderConstruction
              className="mb-a "
              alt="Icon"
              width="100px"
              height="70px"
              style={{ marginLeft: "-15px" }}
            />

            <p className="font-type-h4 Color-White mb-a">{HeadLine}</p>
            <p className="font-type-txt  reading-height Color-White">
              {paragraph}
            </p>

            <div className="display-flex mt-c" style={{}}>
              <button
                className="btn-type2   '"
                style={{ marginLeft: "auto" }}
                onClick={handleClose}
              >
                <p className="font-type-menu ">{buttonTitle}</p>{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_Result_Line_info = (props) => {
  const { Info, popUp_show, set_popUp_show } = props;
  console.log(
    props,
    "sadsadasfadgcvsbgasdfbnfsssfgsnvdnsdfSGFNDFSDFGDSHNGHGGMRHGJEFASDFSFAFGSgdghj"
  );

  const [active, setActive] = useState(false);

  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  useEffect(() => {
    if (popUp_show) {
      setTimeout(() => setActive(true), 100); // Wait for animation to finish before removing
    }
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      setActive(false); // Trigger exit animation
      setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
    }
  }

  function handleClose() {
    setActive(false); // Trigger exit animation
    setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
  }

  const keyStyle = { width: "150px", minWidth: "150px" };

  const LineStyle = {
    // maxHeight: "20px",
    display: "flex",
    transition: "height 0.3s ease",
    marginTop: "calc(var(--space-a)/1 )",
  };

  const firstValueStayle = {
    // width:"100%",
    // maxHeight:"150px" ,
    overflowY: "auto",
    // whiteSpace: "pre-wrap",

    wordBreak: "break-word",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const renderArguments = () => {
    if (!Info?.Arguments || Object.keys(Info.Arguments).length === 0)
      return null;

    console.log(
      Info.Arguments,
      "Info.ArgumentsInfo.ArgumentsInfo.ArgumentsInfo.Arguments"
    );

    return (
      <>
        {Object.entries(Info.Arguments)?.map(([key, value]) => (
          <div
            key={key}
            style={{
              ...LineStyle,
              marginTop: "",
              gap: "5px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              className="font-type-menu reading-height Color-White"
              style={{ ...keyStyle }}
            >
              {key}:
            </p>
            <p
              className="font-type-txt reading-height Color-Grey1 mb-a"
            // style={firstValueStayle}
            >
              {typeof value === "object" && value !== null
                ? JSON.stringify(value, null, 2)
                : value}
            </p>
          </div>
        ))}
      </>
    );
  };

  const renderPop = () => {
    if (!Info?.Population || Object.keys(Info.Population).length === 0)
      return null;

    console.log(Info.Population, "Info.Population.Population.Population");
    let arr = [];
    if (typeof Info?.Population[0] === "object") {
      Info?.Population?.map((x) => {
        arr.push(x?.asset_string);
      });
    } else {
      arr = Info?.Population;
    }
    return (
      <>
        <p
          style={{ textWrap: "auto" }}
          className="font-type-txt reading-height Color-Grey1 mb-a"
        // style={firstValueStayle}
        >
          {arr.join(", ")}
        </p>

        {/* {Info.Population?.map((x) => (
          <div
            key={x?.asset_parent_id ?? Math.random(10000000000)}
            style={{
              ...LineStyle,
              marginTop: "",
              gap: "5px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              className="font-type-txt reading-height Color-Grey1 mb-a"
              // style={firstValueStayle}
            >
              {typeof x === "object" ? x?.asset_string : x}
            </p>
          </div>
        ))} */}
      </>
    );
  };

  return (
    <>
      {popUp_show && (
        <div
          className={`PopUp-background`}
          style={{}}
          onClick={handleClickOutside}
        >
          <div
            className={`PopUp-content  ${active ? "popup-enter-active" : "popup-enter"
              }`}
            style={{
              width: "auto",
              maxWidth: "80%",
              maxHeight: "85%",
              paddingBottom: " ",
              overflowY: "auto",
              overflowX: "auto",
            }}
          >
            <InfofulIcon
              className="mb-a mt-c"
              alt="Icon"
              width="100px"
              height="70px"
              style={{ marginLeft: "-15px" }}
            />

            <div style={LineStyle}>
              <p
                className="font-type-menu reading-height  Color-White"
                style={keyStyle}
              >
                {" "}
                ModuleName:
              </p>
              <p
                className="font-type-txt   Color-Blue-Glow tagit_type1"
                style={{ ...firstValueStayle, marginLeft: "-5px" }}
              >
                {Info?.ModuleName}
              </p>
            </div>

            {Info?.SubModuleName && (
              <>
                <div style={LineStyle}>
                  <p
                    className="font-type-menu reading-height  Color-White"
                    style={keyStyle}
                  >
                    {" "}
                    SubModuleName:
                  </p>
                  <p
                    className="font-type-txt   Color-Blue-Glow tagit_type1"
                    style={{ ...firstValueStayle, marginLeft: "-5px" }}
                  >
                    {Info?.SubModuleName}
                  </p>
                </div>
              </>
            )}

            <div style={LineStyle}>
              <p
                className="font-type-menu reading-height  Color-White"
                style={keyStyle}
              >
                Status:
              </p>
              <p
                className="font-type-txt  reading-height Color-Grey1  "
                style={firstValueStayle}
              >
                {Info?.Status}
              </p>
            </div>

            {Info?.Error && (
              <>
                <div style={LineStyle}>
                  <p
                    className="font-type-menu reading-height  Color-White"
                    style={keyStyle}
                  >
                    {" "}
                    Error:
                  </p>
                  <p
                    className="font-type-txt  reading-height Color-Grey1  "
                    style={firstValueStayle}
                  >
                    {Info?.Error}
                  </p>
                </div>
              </>
            )}

            <div style={LineStyle}>
              <p
                className="font-type-menu reading-height  Color-White"
                style={keyStyle}
              >
                {" "}
                Population:
              </p>
              <p
                className="font-type-txt  reading-height Color-Grey1  "
                style={firstValueStayle}
              >
                {renderPop()}
              </p>
            </div>

            {Info?.ResponsePath && (
              <>
                <div style={LineStyle}>
                  <p
                    className="font-type-menu reading-height  Color-White"
                    style={keyStyle}
                  >
                    {" "}
                    ResponsePath:
                  </p>
                  <p
                    className="font-type-txt  reading-height Color-Grey1  "
                    style={firstValueStayle}
                  >
                    {Info?.ResponsePath}
                  </p>
                </div>
              </>
            )}

            <div style={LineStyle}>
              <p
                className="font-type-menu reading-height  Color-White"
                style={keyStyle}
              >
                {" "}
                Arguments:
              </p>
              <p
                className="font-type-txt  reading-height Color-Grey1  "
                style={{ ...firstValueStayle, whiteSpace: "none" }}
              >
                {" "}
                {renderArguments()}
              </p>
            </div>

            {Info?.TimeInterval && (
              <>
                {" "}
                <div style={LineStyle}>
                  <p
                    className="font-type-menu reading-height  Color-White"
                    style={keyStyle}
                  >
                    Interval in Minute:
                  </p>
                  <p
                    className="font-type-txt  reading-height Color-Grey1  "
                    style={firstValueStayle}
                  >
                    {Info?.TimeInterval}
                  </p>
                </div>
              </>
            )}

            <div style={LineStyle}>
              <p
                className="font-type-menu reading-height  Color-White"
                style={keyStyle}
              >
                Start Date:
              </p>
              <p
                className="font-type-txt  reading-height Color-Grey1  "
                style={firstValueStayle}
              >
                {Info?.StartDate && format_date_type_c(Info?.StartDate)}
              </p>
            </div>

            <div style={LineStyle}>
              <p
                className="font-type-menu reading-height  Color-White"
                style={keyStyle}
              >
                {" "}
                Expire Date:
              </p>
              <p
                className="font-type-txt  reading-height Color-Grey1  "
                style={firstValueStayle}
              >
                {Info?.ExpireDate && format_date_type_c(Info?.ExpireDate)}
              </p>
            </div>

            <div style={LineStyle}>
              <p
                className="font-type-menu reading-height  Color-White"
                style={keyStyle}
              >
                {" "}
                Last Interval:
              </p>
              <p
                className="font-type-txt  reading-height Color-Grey1  "
                style={firstValueStayle}
              >
                {Info?.LastIntervalDate &&
                  format_date_type_c(Info?.LastIntervalDate)}
              </p>
            </div>

            <div style={LineStyle}>
              <p
                className="font-type-menu reading-height  Color-White"
                style={keyStyle}
              >
                {" "}
                UniqueID:
              </p>
              <p
                className="font-type-txt  reading-height Color-Grey1  "
                style={firstValueStayle}
              >
                {typeof Info?.UniqueID === "string" && Info?.UniqueID}
              </p>
            </div>

            <div className="display-flex mt-c" style={{}}>
              <button
                className="btn-type2   '"
                style={{ marginLeft: "auto" }}
                onClick={handleClose}
              >
                <p className="font-type-menu ">Close</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_Confirm_Run_selected = (props) => {
  const {
    popUp_show,
    set_popUp_show,

    True_action,
    False_action,
  } = props;
  const [active, setActive] = useState(false);
  const [disable_buttons, set_disable_buttons] = useState(false);
  const { all_artifacts, all_Tools, backEndURL, GetAllToolAndArtifactFunc } =
    useContext(GeneralContext);
  const [allow_continue, set_allow_continue] = useState(false);
  const [object, setObject] = useState({});

  const get_config = async () => {
    if (backEndURL === undefined) {
      return;
    }
    try {
      const res = await axios.get(`${backEndURL}/config`);

      if (res.data) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa", res.data?.ClientData);
        setObject(res.data?.ClientData?.API);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (popUp_show) {
      GetAllToolAndArtifactFunc();

      setTimeout(() => setActive(true), 100); // Wait for animation to finish before removing
    }
  }, [popUp_show]);

  useEffect(() => {
    if (!all_artifacts) {
      return;
    }
    if (!all_Tools) {
      return;
    }
    get_config();
    if (
      all_artifacts &&
      Array.isArray(all_artifacts) &&
      all_artifacts.length > 0 &&
      typeof all_artifacts !== "string" &&
      all_Tools &&
      Array.isArray(all_Tools) &&
      all_Tools.length > 0 &&
      typeof all_Tools !== "string" &&
      all_Tools.filter(
        (tool) =>
          (tool?.isActive === 1 || tool?.isActive === true) &&
          tool?.toolType === "module" &&
          tool?.tool_id != "2000000"
      ).length === 0 &&
      all_artifacts.filter(
        (tool) =>
          (tool?.isActive === 1 || tool?.isActive === true) &&
          tool?.tool_id != "2000000"
      ).length === 0
    ) {
      console.log("dont go to python");
    } else {
      set_allow_continue(true);
    }
  }, [popUp_show, all_artifacts, all_Tools]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      setActive(false); // Trigger exit animation
      setTimeout(() => False_action()); // Wait for animation to finish before removing
    }
  }

  function handleClose() {
    setActive(false); // Trigger exit animation
    setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
  }

  const cell_height = "38px";
  const NoApiKeyText = ({ Name }) => {
    console.log("Name Name 55555555555555", Name, object);
    if (Name == "AIVulnerability") {
      if (
        object["NVD"]?.trim() == "" ||
        object["NVD"]?.trim() == "APIKey" ||
        object["VulnerabilityLLM"]?.trim() == "" ||
        object["VulnerabilityLLM"]?.trim() == "APIKey"
      ) {
        set_disable_buttons(true);
        return `No ${object["NVD"]?.trim() == "" || object["NVD"]?.trim() == "APIKey"
          ? "NVD "
          : ""
          }${object["VulnerabilityLLM"]?.trim() == "" || object["VulnerabilityLLM"]?.trim() == "APIKey"
            ? "VulnerabilityLLM "
            : ""
          }Api Key`;
      } else {
        return "";
      }
    }

    if (object[Name]?.trim() == "" || object[Name]?.trim() == "APIKey") {
      set_disable_buttons(true);
      return "No Api Key";
    } else {
      return "";
    }
  };

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div
            className={`PopUp-content  ${active ? "popup-enter-active" : "popup-enter"
              }`}
            style={{
              width: "auto",
              minWidth: allow_continue ? "300px" : "auto",
              paddingBottom: " ",
            }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            {allow_continue ? (
              <SuccessIcon
                className="mb-a "
                alt="Icon"
                width="100px"
                height="70px"
                style={{ marginLeft: "-15px" }}
              />
            ) : (
              <InfofulIcon
                className="mb-a "
                alt="Icon"
                width="100px"
                height="70px"
                style={{ marginLeft: "-15px" }}
              />
            )}

            <p className="font-type-h4 Color-White mb-a">
              {allow_continue ? "Confirm Selection" : "Selection Required"}
            </p>
            <p className="font-type-txt  reading-height Color-Grey1 mb-c">
              {allow_continue
                ? "Please review and confirm your choices before activating them:"
                : "Please select at least one module and artifact."}
            </p>
            {allow_continue && (
              <div
                className="display-flex"
                style={{
                  gap: "24px",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                {all_artifacts &&
                  Array.isArray(all_artifacts) &&
                  all_artifacts.length > 0 &&
                  typeof all_artifacts !== "string" && (
                    <>
                      <div style={{ display: "flex" }}>
                        {all_artifacts.filter(
                          (tool) =>
                            (tool?.isActive === 1 || tool?.isActive === true) &&
                            tool?.tool_id != "2000000"
                        ).length > 0 && (
                            <div
                              style={{
                                height: cell_height,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <p className="font-type-txt reading-height Color-Grey1   mr-c">
                                Artifacts:
                              </p>
                            </div>
                          )}

                        <table
                          className=" "
                          style={{ margin: 0, padding: 0, border: 0 }}
                        >
                          <tbody style={{ margin: 0, padding: 0, border: 0 }}>
                            {all_artifacts
                              .filter(
                                (tool) =>
                                  (tool?.isActive === 1 ||
                                    tool?.isActive === true) &&
                                  tool?.tool_id != "2000000"
                              )
                              .map((info, index) => (
                                <>
                                  <tr
                                    key={index}
                                    className="font-type-menu Color-White"
                                    style={{ height: cell_height }}
                                  >
                                    <td
                                      className="pr-b"
                                      style={{
                                        marginLeft: "0",
                                        paddingLeft: 0,
                                      }}
                                    >
                                      <img
                                        src={
                                          info?.logoAddress_1
                                            ? require(`${info?.logoAddress_1}`)
                                            : undefined
                                        }
                                        alt="Icon"
                                        style={{
                                          maxHeight: "32px",
                                          width: "auto",
                                          maxWidth: "100px",
                                          marginTop: "4px",
                                          marginLeft: "0",
                                          paddingLeft: 0,
                                        }}
                                      />
                                    </td>
                                    <td className="pl-b">{info?.headline} </td>
                                  </tr>
                                </>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                {all_Tools &&
                  Array.isArray(all_Tools) &&
                  all_Tools.length > 0 &&
                  typeof all_Tools !== "string" && (
                    <>
                      <div style={{ display: "flex" }}>
                        {/* {all_Tools.filter(tool => tool?.isActive === 1 || tool?.isActive === true).length > 0 && (

  <div  style={{ height: cell_height , display:"flex"  ,  alignItems:"center"}}> 
    <p className="font-type-txt reading-height Color-Grey1  mr-c"  >Modules:</p>

     </div>
)} */}

                        {all_Tools.filter(
                          (tool) =>
                            (tool?.isActive === 1 || tool?.isActive === true) &&
                            tool?.toolType === "module" &&
                            tool?.tool_id != "2000000"
                        ).length > 0 && (
                            <div
                              style={{
                                height: cell_height,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <p className="font-type-txt reading-height Color-Grey1   mr-c">
                                Modules:
                              </p>
                            </div>
                          )}

                        <table
                          className=" "
                          style={{ margin: 0, padding: 0, border: 0 }}
                        >
                          <tbody style={{ margin: 0, padding: 0, border: 0 }}>
                            {all_Tools
                              .filter(
                                (tool) =>
                                  (tool?.isActive === 1 ||
                                    tool?.isActive === true) &&
                                  tool?.toolType === "module" &&
                                  tool?.tool_id != "2000000"
                              )
                              .map((info, index) => (
                                <>
                                  <tr
                                    key={index}
                                    className="font-type-menu Color-White"
                                    style={{ height: cell_height }}
                                  >
                                    <td
                                      className="pr-b"
                                      style={{
                                        marginLeft: "0",
                                        paddingLeft: 0,
                                      }}
                                    >
                                      <img
                                        src={
                                          info?.logoAddress_1
                                            ? require(`${info?.logoAddress_1}`)
                                            : undefined
                                        }
                                        alt="Icon"
                                        style={{
                                          maxHeight: "32px",
                                          width: "auto",
                                          maxWidth: "100px",
                                          marginLeft: "0",
                                          paddingLeft: 0,
                                        }}
                                      />
                                    </td>
                                    <td className="pl-b">{info?.headline}</td>
                                    <td
                                      className="pl-b"
                                      style={{ color: "red" }}
                                    >
                                      <NoApiKeyText Name={info?.Tool_name} />
                                    </td>
                                  </tr>
                                </>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
              </div>
            )}

            <div
              className="display-flex mt-c"
              style={{ justifyContent: "flex-end", gap: "var(--space-b)" }}
            >
              {allow_continue && (
                <button
                  className="btn-type2"
                  disabled={disable_buttons}
                  style={{}}
                  onClick={() => {
                    True_action();
                    set_disable_buttons(true); // Assuming disable_buttons is a function that accepts a boolean argument
                  }}
                >
                  <p className="font-type-menu ">Run</p>{" "}
                </button>
              )}

              <button
                className="btn-type2"
                disabled={disable_buttons}
                style={{}}
                onClick={() => {
                  False_action();
                  set_disable_buttons(true); // Assuming disable_buttons is a function that accepts a boolean argument
                }}
              >
                <p className="font-type-menu ">
                  {allow_continue ? "Cancel" : "Continue"}
                </p>{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PopUpStorageVelociraptor = (props) => {
  const {
    popUp_show,
    set_popUp_show,
    set_PopUp_Error____txt,
    set_PopUp_Error____show,
    set_PopUp_All_Good__txt,
    set_PopUp_All_Good__show,
  } = props;
  const [active, setActive] = useState(false);
  const [StoragePath, setStoragePath] = useState("");
  const [Hostname, setHostname] = useState("");
  const [ChosenOs, setChosenOs] = useState("OS");
  const [DropdownOsShow, setDropdownOsShow] = useState(false);
  const { backEndURL } = useContext(GeneralContext);
  useEffect(() => {
    set_popUp_show(popUp_show);
    if (popUp_show) {
      setTimeout(() => setActive(true), 100); // Wait for animation to finish before removing
    }
  }, [popUp_show]);

  const handleClickOutside = (e) => {
    if (e.target.className === "PopUp-background") {
      setActive(false); // Trigger exit animation
      setDropdownOsShow(false);
      setChosenOs("OS");
      setHostname("");
      setStoragePath("");
      setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
    }
  };

  const handleClose = () => {
    setActive(false); // Trigger exit animation
    setDropdownOsShow(false);
    setChosenOs("OS");
    setHostname("");
    setStoragePath("");
    setTimeout(() => set_popUp_show(false), 100); // Wait for animation to finish before removing
  };

  const HandleStorageActivation = async () => {
    try {
      console.log("Start HandleStorageActivation");
      if (
        StoragePath.trim() == "" ||
        Hostname.trim() == "" ||
        !["Windows", "Linux", "MacOs"].includes(ChosenOs)
      ) {
        const arrNot = [];
        const x =
          StoragePath.trim() == ""
            ? arrNot.push("StoragePath Cant be Empty")
            : "";
        const y =
          Hostname.trim() == "" ? arrNot.push("Hostname Cant be Empty") : "";
        const z = !["Windows", "Linux", "MacOs"].includes(ChosenOs)
          ? arrNot.push("Os Cant be Empty")
          : "";
        console.log(arrNot.join(" and "));
        set_PopUp_Error____txt({
          HeadLine: "Error",
          paragraph: arrNot.join(" and "),
          buttonTitle: "Close",
        });
        set_PopUp_Error____show(true);
        return;
      }

      const data = {
        StoragePath,
        Hostname,
        ChosenOs,
      };

      console.log("data sssssssssssssssssssssssssssssssssssssss ", data);
      // const res = await axios.post(
      //   `${backEndURL}/config/CreateStorageVeloDiskAgent`,
      //   data
      // );
      // console.log("resssssssssssss", res);

      set_PopUp_All_Good__txt({
        HeadLine: "Successes",
        paragraph: "The Virtual disk has Started",
        buttonTitle: "Close",
      });
      set_PopUp_All_Good__show(true);
      handleClose();
    } catch (error) {
      console.log("Error In HandleStorageActivation", error);
    }
  };

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div
            className={`PopUp-content  ${active ? "popup-enter-active" : "popup-enter"
              }`}
            style={{ width: "50%", paddingBottom: " " }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            <p className="font-type-h4 Color-White mb-a">Attach Offline Disk</p>
            {/* <p className="font-type-txt  reading-height Color-White">
              In here we will set up a velociraptor agent in a 
            </p> */}
            <div style={{ marginTop: 25 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <p
                  className="font-type-txt  reading-height Color-White"
                  style={{ width: 170, marginRight: 10 }}
                >
                  Mount Point Of Disk{" "}
                </p>
                <input
                  className="input-type1 search_filter "
                  placeholder="Absolute Path"
                  onChange={(e) => setStoragePath(e.target.value)}
                  value={StoragePath}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: 20,
                  alignItems: "center",
                }}
              >
                <p
                  className="font-type-txt  reading-height Color-White"
                  style={{ width: 170, marginRight: 10 }}
                >
                  Client Name
                </p>
                <input
                  className="input-type1 search_filter "
                  placeholder="Hostname"
                  onChange={(e) => setHostname(e.target.value)}
                  value={Hostname}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: 20,
                  alignItems: "center",
                }}
              >
                <p
                  className="font-type-txt  reading-height Color-White"
                  style={{ width: 133 }}
                >
                  Image Os{" "}
                </p>
                <div
                  style={{
                    width: 150,
                    // marginRight: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <button
                    className={`btn-type2 "btn-type2-no_btn"`}
                    onClick={() => setDropdownOsShow(!DropdownOsShow)}
                    style={{
                      width: "100%",
                      minWidth: "115px",
                      maxWidth: "122px",
                      paddingLeft: "var(--space-c)",
                      paddingRight: "calc(var(--space-c) - 5px)",
                    }}
                  >
                    <p className="font-type-menu" style={{}}>
                      {ChosenOs}
                    </p>
                  </button>
                  <div
                    className={`dropdown-menu ${DropdownOsShow ? "open" : ""}`}
                    style={{
                      top: 235,
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                      position: "absolute",
                    }}
                  >
                    {["Windows", "Linux", "MacOs"]?.map((tt) => {
                      // console.log(AllTags, "ttttt", tt);
                      if (tt == ChosenOs) {
                        return;
                      }
                      return (
                        <button
                          className={`btn-type2 "btn-type2-no_btn"`}
                          onClick={() => {
                            setChosenOs(tt);
                            setDropdownOsShow(false);
                          }}
                          style={{
                            width: "100%",
                            minWidth: "115px",
                            maxWidth: "122px",
                            paddingLeft: "var(--space-c)",
                            paddingRight: "calc(var(--space-c) - 5px)",
                            backgroundColor: "var(--color-Grey2)",
                          }}
                        >
                          <p className="font-type-menu" style={{}}>
                            {tt}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="display-flex mt-c" style={{}}>
              <button
                className="btn-type2   '"
                style={{ marginLeft: "auto" }}
                onClick={HandleStorageActivation}
              >
                <p className="font-type-menu ">Run</p>{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
