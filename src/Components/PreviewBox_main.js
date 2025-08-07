import React, { useState, useEffect, useContext } from "react";
//  import { ReactComponent as IconLastRun } from './icons/ico-lastrun.svg';
//  import { ReactComponent as RisxMssp_logo_wide_small} from './Logos/RisxMssp_logo_wide_small.svg';
import { ReactComponent as IconReadMore } from "./icons/ico-readmore.svg";
import { ReactComponent as IcoKey } from "./icons/ico-eye.svg";
import {
  PopUp_For_Read_More,
  PopUp_All_Good,
  PopUp_Mod_Tags,
  PopUp_Mod_Config_Edit,
} from "./PopUp_Smart.js";
import {
  Make_url_from_id,
  fix_path,
} from "../Components/Dashboards/functions_for_dashboards";
import { ReactComponent as IcoModule } from "./icons/ico-module-nonedge-blue.svg";
import { ReactComponent as IcoLink } from "./icons/ico-link-nonedge-blue.svg";
import { ReactComponent as IcoSettings } from ".//icons/ico-settings.svg";
import { ReactComponent as IcoMenuDown } from ".//icons/ico-menu-down.svg";
import { ReactComponent as IcoMenuUp } from ".//icons/ico-menu-up.svg";

//  import jsonData from '../tmpjsons/previewBox-main-velociraptor.json'
import axios from "axios";
import GeneralContext from "../Context.js";

import "./PreviewBoxes.css";
import "./all_tools.css";
import { format_date_type_a } from "./Features/DateFormat.js";

function PreviewBoxes_main_modules({
  preview_list,
  box_type,
  main_headline,
  main_read_more,
  main_subtitle,
  logoAddress,
  iconAddress,
  lastrun,
  is_filtering,
  all_artifacts_and_modules,
  set_all_artifacts_and_modules,
  ShowAssets = false,
  setChosenTag,
  ChosenTag,
  DropdownTagsShow,
  setDropdownTagsShow,
  HandleTagSelection,
  AllTags,
}) {
  const StatusColor = "blue";

  const StatusColorClass =
    StatusColor === "red"
      ? "Bg-Red"
      : StatusColor === "blue"
      ? "Bg-Blue-Glow"
      : "Bg-Grey2";

  const {
    backEndURL,
    all_artifacts,
    set_all_artifacts,
    all_Tools,
    set_all_Tools,
    front_IP,
    front_URL,
    GetAllToolAndArtifactFunc,
  } = useContext(GeneralContext);
  const [popUp_show, set_popUp_show] = useState(false);
  const [popUp_headline, set_popUp_headline] = useState("");
  const [popUp_ReadMoreText, set_popUp_ReadMoreText] = useState("");
  const [popUp_btnTitle, set_popUp_btnTitle] = useState("");
  const [popUp_logoAddress_1, set_popUp_logoAddress_1] = useState("");
  const [popUp_iconAddress, set_popUp_iconAddress] = useState("");
  const [popUp_iconSize, set_popUp_iconSize] = useState("Small");
  const [popUp_all_good____show, set_popUp_all_good____show] = useState(false);
  const [popUp_all_good____txt, set_popUp_all_good____txt] = useState({
    HeadLine: "",
    paragraph: "",
    buttonTitle: "",
  });
  const [popUp_Tags_Show, set_popUp_Tags_Show] = useState(false);
  const [popUp_Config_Show, set_popUp_Config_Show] = useState(false);

  const [popUp_Tags_ModObj, set_popUp_Tags_ModObj] = useState({});

  const [toolURL, set_toolURL] = useState("https://docs.velociraptor.app");

  const [disabled, set_disabled] = useState(false);

  const [checked_artifacts2, set_checked_artifacts2] = useState([]);
  const [download_drop_down, set_download_drop_down] = useState(false);
  const [ChosenArtifact, setChosenArtifact] = useState({});

  const [openIndex, setOpenIndex] = useState(null); // State to keep track of which dropdown is open

  // const getResourceToModuleObj = async () => {
  //   try {
  //     const obj = await axios.get(
  //       `${backEndURL}/Resources/getResourceToModuleObj`
  //     );
  //     console.log(obj, "ssssssadqwrq3144t457578uhjgnge56464ssset");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   if (backEndURL) {
  //     // getResourceToModuleObj();
  //   }
  // }, [backEndURL]);

  const handleDropdownToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle dropdown for the clicked row
  };

  const HandleConfigEditOpen = async (info) => {
    try {
      console.log("Start HandleConfigEditOpen ", info);
      setChosenArtifact(info);
      set_popUp_Config_Show(true);
    } catch (error) {
      console.log("Error in HandleConfigEditOpen : ", error);
    }
  };

  const change_order_in_db = (info, operator) => {
    console.log(info, operator);
    setOpenIndex(null);

    if (info?.artifact_id && !info?.tool_id) {
      console.log("change_order for - Artifact");
      ChangePreviewNumber(
        "Artifact",
        "Artifact",
        info?.positionNumber,
        operator,
        info
      );
    }

    if (!info?.artifact_id && info?.tool_id) {
      console.log("change_order for - Module");
      ChangePreviewNumber(
        "Module",
        info?.toolType,
        info?.positionNumber,
        operator,
        info
      );
    }
  };

  const HandleAddTagPopup = async (id, name, tags) => {
    try {
      console.log("HandleAddTagPopup open");
      set_popUp_Tags_ModObj({ id: id, name: name, tags });
      set_popUp_Tags_Show(true);
    } catch (err) {
      console.log("Error in HandleAddTagPopup : ", err);
    }
  };

  const change_order_in_preview = (info, operator) => {
    const all_artifacts_and_modules___copy1 = [...all_artifacts_and_modules];
    const [the_item] =
      info.artifact_id != null
        ? preview_list.filter((item) => item?.artifact_id === info.artifact_id)
        : preview_list.filter((item) => item?.tool_id === info.tool_id);
    const [the_item_above] = preview_list.filter(
      (item) =>
        item?.positionNumber === the_item?.positionNumber - 1 &&
        item?.BoxType != "Velociraptor"
    );
    const [the_item_below] = preview_list.filter(
      (item) =>
        item?.positionNumber === the_item?.positionNumber + 1 &&
        item?.BoxType != "Velociraptor"
    );

    if (operator == -1) {
      ///go up
      // console.log("go up");
      // console.log("change item ",the_item?.Tool_name," number from "  , the_item.positionNumber , "to "  ,the_item.positionNumber -1);
      // console.log("change above ",the_item_above?.Tool_name," number from "  , the_item_above.positionNumber , "to "  ,the_item_above.positionNumber +1);

      const all_artifacts_and_modules___copy2 =
        info.artifact_id != null
          ? all_artifacts_and_modules___copy1.map((aaa) =>
              aaa.artifact_id === the_item.artifact_id
                ? { ...aaa, positionNumber: the_item.positionNumber - 1 }
                : aaa
            )
          : all_artifacts_and_modules___copy1.map((aaa) =>
              aaa.tool_id === the_item.tool_id
                ? { ...aaa, positionNumber: the_item.positionNumber - 1 }
                : aaa
            );

      const all_artifacts_and_modules___copy3 =
        info.artifact_id != null
          ? all_artifacts_and_modules___copy2.map((aaa) =>
              aaa.artifact_id === the_item_above.artifact_id
                ? { ...aaa, positionNumber: the_item_above.positionNumber + 1 }
                : aaa
            )
          : all_artifacts_and_modules___copy2.map((aaa) =>
              aaa.tool_id === the_item_above.tool_id
                ? { ...aaa, positionNumber: the_item_above.positionNumber + 1 }
                : aaa
            );
      set_all_artifacts_and_modules(all_artifacts_and_modules___copy3);
    }

    if (operator == +1) {
      ///go down
      //     console.log("go down");
      //  console.log("change item ",the_item?.Tool_name," number from "  , the_item.positionNumber , "to "  ,the_item.positionNumber +1);
      //  console.log("change below ",the_item_below?.Tool_name," number from "  , the_item_below.positionNumber , "to "  ,the_item_below.positionNumber -1);

      const all_artifacts_and_modules___copy2 =
        info.artifact_id != null
          ? all_artifacts_and_modules___copy1.map((aaa) =>
              aaa.artifact_id === the_item.artifact_id
                ? { ...aaa, positionNumber: the_item.positionNumber + 1 }
                : aaa
            )
          : all_artifacts_and_modules___copy1.map((aaa) =>
              aaa.tool_id === the_item.tool_id
                ? { ...aaa, positionNumber: the_item.positionNumber + 1 }
                : aaa
            );

      const all_artifacts_and_modules___copy3 =
        info.artifact_id != null
          ? all_artifacts_and_modules___copy2.map((aaa) =>
              aaa.artifact_id === the_item_below.artifact_id
                ? { ...aaa, positionNumber: the_item_below.positionNumber - 1 }
                : aaa
            )
          : all_artifacts_and_modules___copy2.map((aaa) =>
              aaa.tool_id === the_item_below.tool_id
                ? { ...aaa, positionNumber: the_item_below.positionNumber - 1 }
                : aaa
            );
      set_all_artifacts_and_modules(all_artifacts_and_modules___copy3);
    }
  };

  const change_order = (info, operator) => {
    // console.log(info, operator);

    if (info?.artifact_id && !info?.tool_id) {
      console.log("change Artifact");

      const all_artifacts_and_modules___copy1 = [...all_artifacts_and_modules];

      const item_Local_Index = preview_list.findIndex(
        (tool) => tool?.artifact_id === info?.artifact_id
      );

      const local_item_id_to_jump_over =
        preview_list[item_Local_Index + operator]?.artifact_id;
      //  console.log("local_item_id_to_jump_over", local_item_id_to_jump_over);

      const general_item_index_to_jump_over =
        all_artifacts_and_modules.findIndex(
          (tool) => tool?.artifact_id === local_item_id_to_jump_over
        );

      // console.log("general_item_index_to_jump_over", general_item_index_to_jump_over);

      const [item] = all_artifacts_and_modules___copy1.filter(
        (item) => item?.artifact_id === info?.artifact_id
      );
      const all_list_without_the_item =
        all_artifacts_and_modules___copy1.filter(
          (item) => item?.artifact_id != info?.artifact_id
        );

      //  console.log("item", item);
      //   console.log("item_General_Index", item_General_Index);
      //   console.log("item_Local_Index", item_Local_Index);

      const new_list = [
        ...all_list_without_the_item.slice(0, general_item_index_to_jump_over),
        item,
        ...all_list_without_the_item.slice(general_item_index_to_jump_over),
      ];

      // console.log("old_list", all_artifacts_and_modules);
      // console.log("new_list", new_list);
      set_all_artifacts_and_modules(new_list);
    }

    if (!info?.artifact_id && info?.tool_id) {
      console.log("its MODULE");

      const all_artifacts_and_modules___copy1 = [...all_artifacts_and_modules];

      const item_Local_Index = preview_list.findIndex(
        (tool) => tool?.tool_id === info?.tool_id
      );

      const local_item_id_to_jump_over =
        preview_list[item_Local_Index + operator]?.tool_id;
      //  console.log("local_item_id_to_jump_over", local_item_id_to_jump_over);

      const general_item_index_to_jump_over =
        all_artifacts_and_modules.findIndex(
          (tool) => tool?.tool_id === local_item_id_to_jump_over
        );

      // console.log("general_item_index_to_jump_over", general_item_index_to_jump_over);

      const [item] = all_artifacts_and_modules___copy1.filter(
        (item) => item?.tool_id === info?.tool_id
      );
      const all_list_without_the_item =
        all_artifacts_and_modules___copy1.filter(
          (item) => item?.tool_id != info?.tool_id
        );

      //  console.log("item", item);
      //   console.log("item_General_Index", item_General_Index);
      //   console.log("item_Local_Index", item_Local_Index);

      const new_list = [
        ...all_list_without_the_item.slice(0, general_item_index_to_jump_over),
        item,
        ...all_list_without_the_item.slice(general_item_index_to_jump_over),
      ];

      // console.log("old_list", all_artifacts_and_modules);
      // console.log("new_list", new_list);
      set_all_artifacts_and_modules(new_list);
    }
  };

  const handleReadMore = (
    headline,
    main_read_more,
    logoAddress_1,
    btnTitle,
    iconAddress,
    iconSize
  ) => {
    console.log(iconAddress);
    set_popUp_headline(headline);
    set_popUp_ReadMoreText(main_read_more);
    if (logoAddress_1) {
      set_popUp_logoAddress_1(require(`${logoAddress_1}`));
    }

    set_popUp_btnTitle(btnTitle);
    set_popUp_iconSize(iconSize);

    if (iconAddress !== null && iconAddress !== undefined) {
      set_popUp_iconAddress(require(`${iconAddress}`));
    } else {
      set_popUp_iconAddress("");
    }

    set_popUp_show(true);
  };

  const handle_Main_Btn = (toolURL) => {
    console.log("handle_Main_Btn", toolURL);
    const path = fix_path(toolURL, front_IP, front_URL);
    if (path) {
      console.log("Velo path: ", path);
      window.open(path, "_blank");
    } else {
      console.log("problem with velociraptor path, it is:", path);
    }
  };

  async function ShowInUi(Info) {
    if (Info.parent_id === "2000000" || Info.parent_id === 2000000) {
      set_popUp_all_good____txt({
        HeadLine: "Stays on",
        paragraph: "Velociraptor artifacts configured to always be visible.",
        buttonTitle: "Close",
      });
      set_popUp_all_good____show(true);
    }

    try {
      const res = await axios.put(`${backEndURL}/tools/show-in-ui`, {
        params: {
          module_id: Info?.tool_id,
          set_ShowInUi_to: !Info?.ShowInUi,
        },
      });
      if (res.data) {
        // set_disable_ShowInUi_btn(false);
        const index = all_Tools.findIndex(
          (tool) => tool.tool_id === Info?.tool_id
        );

        if (index !== -1) {
          // Create a new copy of the all_Tools array
          const updatedTools = [...all_Tools];
          console.log("updatedTools", updatedTools);

          // Update the specific tool
          updatedTools[index] = {
            ...updatedTools[index],
            tool_id: Info?.tool_id,
            ShowInUi: !Info?.ShowInUi,
            isActive: !Info?.ShowInUi,
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

  async function ChangePreviewNumber(
    type,
    subtype,
    positionNumber,
    operator,
    info
  ) {
    // ChangePositionNumber("Module", info?.positionNumber , operator);
    try {
      const res = await axios.put(
        `${backEndURL}/tools/change-modules-preview-position`,
        {
          params: {
            type: type,
            positionNumber: positionNumber,
            operator: operator,
            subtype: subtype,
          },
        }
      );
      if (res.data === true) {
        console.log("ChangePositionNumber true");
        change_order_in_preview(info, operator);
      }
      if (res.data === false) {
        console.log("ChangePositionNumber false");
      }
    } catch (err) {
      // set_disable_ShowInUi_btn(false);
      console.log(err);
    }
  }

  useEffect(() => {
    const all = all_artifacts.map(
      ({ artifact_id, Toolname, logoAddress_1 }) => ({
        artifact_id,
        Toolname,
        logoAddress_1,
      })
    );
    set_checked_artifacts2(all);
  }, [all_artifacts]);

  async function edit_checked_artifacts(Info) {
    if (Info.isActive === undefined) {
      console.log("isActive is undefined cant change");
      return;
    }

    if (!Info?.artifact_id && !Info?.tool_id) {
      console.log("artifact_id & tool_id are undefined  ");
      return;
    }

    /// enable disable for artifact
    if (Info?.artifact_id && !Info?.tool_id) {
      console.log("change Artifact");
      try {
        set_disabled(true);
        const res = await axios.put(
          `${backEndURL}/tools/enable-disable-artifact`,
          {
            params: {
              artifact_id: Info.artifact_id,
              set_enable_disable_to: !Info.isActive,
            },
          }
        );

        if (res.data) {
          const index = all_artifacts.findIndex(
            (art) => art.artifact_id === Info.artifact_id
          );
          if (index !== -1) {
            const updatedARTS = [...all_artifacts];
            updatedARTS[index] = {
              ...updatedARTS[index],
              artifact_id: Info.artifact_id,
              isActive: !Info.isActive,
            };
            // Set the state with the updated array
            set_all_artifacts(updatedARTS);
            setChosenTag("Tags");
            set_disabled(false);
          }
        }
      } catch (err) {
        set_disabled(false);
        console.log(err);
      }
    }

    /// enable disable for module
    if (!Info?.artifact_id && Info?.tool_id) {
      console.log("its MODULE");
      try {
        set_disabled(true);
        const res = await axios.put(
          `${backEndURL}/tools/enable-disable-module`,
          {
            params: {
              module_id: Info?.tool_id,
              set_enable_disable_to: !Info?.isActive,
            },
          }
        );

        if (res.data) {
          const index = all_Tools.findIndex(
            (tool) => tool.tool_id === Info?.tool_id
          );
          if (index !== -1) {
            // Create a new copy of the all_Tools array
            const updatedTools = [...all_Tools];
            // Update the specific tool
            updatedTools[index] = {
              ...updatedTools[index],
              tool_id: Info?.tool_id,
              isActive: !Info?.isActive,
            };
            // Set the state with the updated array
            set_all_Tools(updatedTools);
            setChosenTag("Tags");
            set_disabled(false);
          }
        }
      } catch (err) {
        set_disabled(false);
        console.log(err);
      }
    }
  }

  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  useEffect(() => {
    const url = all_Tools.filter((item) => item.tool_id === "2000000")[0]
      ?.toolURL;
    if (url === undefined) {
      return;
    }
    set_toolURL(url);
  }, [all_Tools]);

  return (
    <>
      <PopUp_All_Good
        set_popUp_show={set_popUp_all_good____show}
        popUp_show={popUp_all_good____show}
        HeadLine={popUp_all_good____txt.HeadLine}
        buttonTitle={popUp_all_good____txt.buttonTitle}
        paragraph={popUp_all_good____txt.paragraph}
      />
      <PopUp_Mod_Tags
        set_popUp_show={set_popUp_Tags_Show}
        popUp_show={popUp_Tags_Show}
        ModObj={popUp_Tags_ModObj}
        backEndURL={backEndURL}
        GetAllToolAndArtifactFunc={GetAllToolAndArtifactFunc}
      />

      <PopUp_Mod_Config_Edit
        set_popUp_show={set_popUp_Config_Show}
        popUp_show={popUp_Config_Show}
        infoConf={ChosenArtifact}
        backEndURL={backEndURL}
      />
      <PopUp_For_Read_More
        HeadLine={popUp_headline}
        readMoreText={popUp_ReadMoreText}
        logoAddress_1_ForSrc={popUp_logoAddress_1}
        // toolURL={toolURL}
        buttonTitle={popUp_btnTitle}
        IconAddressForSrc={popUp_iconAddress}
        set_popUp_show={set_popUp_show}
        popUp_show={popUp_show}
        popUp_iconSize={popUp_iconSize}
      />

      <div className=" all-tools-main  ">
        {/* ---------------------left-box----------------------------- */}
        <div
          className={`${StatusColorClass}  light-bulb-type1 view-on-small-screen_if_vertical`}
          style={{ marginLeft: "auto" }}
        />

        {/* -----------------------right-box------------------------ */}
        <div className="velociraptor-right-side display-flex  flex-direction-column">
          {/* <div
          // blue point
            className=" display-flex  justify-content-space-between"
            style={{ width: "100%", height: "24px" }}
          >
            <div style={{ width: "1px" }} />
            <div
              className={`${StatusColorClass}  light-bulb-type1 hide-on-small-screen_if_vertical`}
            />
          </div> */}

          {/* <div className='Bg-Grey2' style={{width:"100%", height:"2px" ,borderRadius:"5px"}}/> */}

          <div
            style={{
              // width: "100%",
              color: "var(--color-White)",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            {main_headline}
          </div>

          <div className="all-tools-right-side">
            <table
              className="all-tools-table"
              style={{ margin: 0, padding: 0, border: 0 }}
            >
              {/* Table Header with column titles */}
              <thead style={{ 
                position: 'sticky', 
                top: 0, 
                backgroundColor: 'var(--color-Black)', 
                zIndex: 10,
                borderBottom: '2px solid var(--color-Grey3)'
              }}>
                <tr style={{ height: "45px" }}>
                  <th style={{ width: "30px" }}></th>
                  <th style={{ width: "108px" }}></th>
                  <th style={{ width: "250px" }}>
                    <p className="font-type-menu Color-Grey1">Module</p>
                  </th>
                  <th className="hide-on-small-screen1" style={{ width: "30%" }}>
                    <p className="font-type-menu Color-Grey1">Description</p>
                  </th>
                  <th className="hide-on-small-screen3">
                    <p className="font-type-menu Color-Grey1"></p>
                  </th>
                  <th style={{ minWidth: "115px", maxWidth: "122px" }}>
                    <p className="font-type-menu Color-Grey1">Action</p>
                  </th>
                  {ShowAssets && (
                    <th style={{ minWidth: "150px", maxWidth: "150px", position: "relative" }}>
                      {/* Tags dropdown button in header */}
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <button
                          className={`btn-type2 "btn-type2-no_btn"`}
                          onClick={() => setDropdownTagsShow(!DropdownTagsShow)}
                          style={{
                            minWidth: "115px",
                            maxWidth: "122px",
                            paddingLeft: "var(--space-c)",
                            paddingRight: "calc(var(--space-c) - 5px)",
                            height: 36,
                            margin: 0,
                          }}
                        >
                          <p className="font-type-menu cutLongLine">
                            {ChosenTag}
                          </p>
                        </button>
                        <div
                          className={`dropdown-menu ${DropdownTagsShow ? "open" : ""}`}
                          style={{
                            top: "calc(100% + 4px)",
                            left: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            display: DropdownTagsShow ? "flex" : "none",
                            flexDirection: "column",
                            position: "absolute",
                            zIndex: 100,
                            minWidth: "115px",
                            maxWidth: "122px",
                            width: "100%",
                            backgroundColor: "var(--color-Grey3)",
                            borderRadius: "var(--elemtns-round-corner-medium)",
                            padding: "var(--space-a) 0",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          {AllTags?.map((tt, index) => {
                            if (tt == ChosenTag) {
                              return null;
                            }
                            return (
                              <button
                                key={index}
                                className={`btn-type2 "btn-type2-no_btn"`}
                                onClick={() => HandleTagSelection(tt)}
                                style={{
                                  width: "calc(100% - var(--space-a) * 2)",
                                  margin: "2px var(--space-a)",
                                  paddingLeft: "var(--space-c)",
                                  paddingRight: "calc(var(--space-c) - 5px)",
                                  backgroundColor: "var(--color-Grey2)",
                                  height: 32,
                                }}
                              >
                                <p className="font-type-menu">
                                  {tt}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </th>
                  )}
                  <th className="hide-on-small-screen2" style={{ minWidth: "95px" }}>
                    <p className="font-type-menu Color-Grey1">Last Run</p>
                  </th>
                  <th style={{ width: "40px" }}></th>
                </tr>
              </thead>
              <tbody style={{ margin: 0, padding: 0, border: 0 }}>
                {!is_filtering &&
                  preview_list.length === 0 &&
                  all_Tools.length > 0 &&
                  all_artifacts.length > 0 && (
                    <tr>
                      <td colSpan="9">
                        <div style={{ textAlign: "center", padding: "20px" }}>
                          <p className="font-type-txt  Color-Grey1   cutLongLine">
                            It seems that all Modules are hidden in the UI. To
                            change:
                          </p>
                          <p className="font-type-txt  Color-Grey1   cutLongLine">
                            Click{" "}
                            <span className="font-type-menu Color-White">
                              Settings
                            </span>{" "}
                            in the side menu
                          </p>
                          <p className="font-type-txt  Color-Grey1   cutLongLine">
                            Choose{" "}
                            <span className="font-type-menu Color-White">
                              UI Stings
                            </span>{" "}
                            from the top menu
                          </p>
                          <p className="font-type-txt  Color-Grey1   cutLongLine">
                            Check the boxes to set UI display
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                {is_filtering &&
                  preview_list.length === 0 &&
                  all_Tools.length > 0 &&
                  all_artifacts.length > 0 && (
                    <tr>
                      <td colSpan="9">
                        <div style={{ textAlign: "center", padding: "20px" }}>
                          <p className="font-type-txt  Color-Grey1   cutLongLine">
                            There are no results for this filter
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                {Array.isArray(preview_list) &&
                  preview_list?.map((Info, index) => (
                    <>
                      <tr key={index} className="all-tools-line">
                        <td
                          style={{
                            visibility: Info?.toolType === "link" && "hidden",
                          }}
                        >
                          <label
                            className={`container   ${
                              Info?.toolType === "link" && "containeroff"
                            }`}
                            style={{ marginTop: "-11px" }}
                          >
                            <input
                              type="checkbox"
                              checked={Info?.isActive}
                              disabled={disabled || Info?.toolType === "link"}
                              value={Info?.artifact_id}
                              onChange={() => edit_checked_artifacts(Info)}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </td>
                        <td className="" style={{ width: "108px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              className="logo-cell  "
                              style={{
                                width: Info?.logoAddress_1.includes("ChatGpt")
                                  ? "108px"
                                  : "108px",
                                height: "100%",
                                maxHeight: "40px",
                                marginRight: "5px",
                                marginLeft: "5px",
                              }}
                              src={
                                Info?.logoAddress_1
                                  ? require(`${Info.logoAddress_1}`)
                                  : undefined
                              }
                            ></img>
                          </div>
                        </td>
                        <td style={{ width: "250px" }}>
                          <p className="font-type-menu  Color-White  cutLongLine   hide-on-small-screen0">
                            {Info?.headline}
                          </p>
                        </td>
                        <td
                          className="hide-on-small-screen1 "
                          style={{ width: "30%" }}
                        >
                          {" "}
                          <p className="font-type-txt   Color-Grey1   cutLongLine">
                            {Info?.description_short ?? Info?.description}

                            {/* {box_type === "modules" && Info?.description_short}
                            {box_type === "velociraptor" && Info?.description} */}
                          </p>
                        </td>
                        <td
                          className="hide-on-small-screen3  "
                          // style={{ width:"100px",maxWidth:"100px" ,backgroundColor:"yellow" , }}
                        >
                          <button
                            className="btn-type3"
                            onClick={() => {
                              let descriptionText;
                              if (box_type === "velociraptor") {
                                descriptionText = Info?.readMoreText;
                              } else if (
                                box_type === "module" ||
                                box_type === "link"
                              ) {
                                descriptionText =
                                  Info?.description_long ?? Info?.readMoreText;
                              } else {
                                descriptionText =
                                  Info?.description_long ?? Info?.readMoreText;
                              }
                              handleReadMore(
                                Info?.headline,
                                descriptionText,
                                Info?.logoAddress_1,
                                "Close",
                                null,
                                "Small"
                              );
                            }}
                          >
                            <p
                              className="font-type-txt"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              Read More
                            </p>
                            <IconReadMore
                              className="icon-type1"
                              style={{ width: 20, height: 20 }}
                            />
                          </button>
                        </td>
                        <td
                          style={{
                            visibility: box_type === "velociraptor" && "hidden",
                            minWidth: "115px",
                            maxWidth: "122px",
                          }}
                          className={`${
                            box_type === "velociraptor" &&
                            "spacer-for-non-buttom"
                          } `}
                        >
                          <button
                            className={`btn-type2 ${
                              Info?.toolURL === "" && "btn-type2-no_btn"
                            }`}
                            onClick={() => handle_Main_Btn(Info?.toolURL)}
                            style={{
                              width: "100%",
                              minWidth: "115px",
                              maxWidth: "122px",
                              paddingLeft: "var(--space-c)",
                              paddingRight: "calc(var(--space-c) - 5px)",
                              disabled: Info?.toolURL === "",

                              // paddingRight: Info?.toolType !== undefined &&
                              // Info?.toolType !== "" &&
                              // Info?.toolType !== null
                              //   ? "calc(var(--space-d) - 5px)"
                              // : undefined
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <p className="font-type-menu" style={{}}>
                                {Info?.buttonTitle}
                              </p>
                              {Info?.toolType === "link" && (
                                <IcoLink
                                  style={{
                                    height: "var(--space-c)",
                                    width: "var(--space-c)",
                                    marginLeft: "4px",
                                  }}
                                />
                              )}
                              {Info?.toolType === "module" && (
                                <IcoModule
                                  style={{
                                    height: "var(--space-c)",
                                    width: "var(--space-c)",
                                    marginLeft: "3px",
                                  }}
                                />
                              )}
                            </div>
                          </button>
                        </td>
                        {/* Assets btn */}
                        <td
                          style={{
                            visibility: box_type === "velociraptor" && "hidden",
                            minWidth: "115px",
                            maxWidth: "122px",
                          }}
                          className={`${
                            box_type === "velociraptor" &&
                            "spacer-for-non-buttom"
                          } `}
                        >
                          {ShowAssets && (
                            <div
                              style={{
                                minWidth: 150,
                                maxWidth: 150,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              className="column column-small  "
                              onClick={() =>
                                HandleAddTagPopup(
                                  Info?.artifact_id ?? Info?.tool_id,
                                  Info?.Toolname ?? Info?.Tool_name,
                                  Info?.arguments.tags
                                )
                              }
                            >
                              {Info?.arguments?.tags?.length === 1 ? (
                                <p className="ml-a    font-type-txt   Color-Grey1   "></p>
                              ) : null}
                              {/* ? (<p className='ml-a    font-type-txt   Color-Red   '> Undefined  </p> ) : null  } */}
                              {Info?.arguments?.tags?.length == 0 ? (
                                <p className="ml-a  font-type-txt    tagit_type1">
                                  No Tags
                                </p>
                              ) : null}
                              {Info?.arguments?.tags?.length === 1 ? (
                                <p
                                  className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1 cutLongLine"
                                  style={{ maxWidth: "60%" }}
                                >
                                  {Info?.arguments?.tags[0]}
                                </p>
                              ) : null}
                              {Info?.arguments?.tags?.length > 1 ? (
                                <>
                                  <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1">
                                    {Info?.arguments?.tags[0]}
                                  </p>{" "}
                                  <p className=" ml-a font-type-txt   Color-Grey1  ">
                                    +{Info?.arguments?.tags?.length - 1}
                                  </p>
                                </>
                              ) : null}{" "}
                            </div>
                          )}
                        </td>

                        <td className="hide-on-small-screen2">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "auto",
                              minWidth: "95px",
                              justifyContent: "center",
                            }}
                          >
                            {/* <IconLastRun /> */}
                            <p className="font-type-very-sml-txt Color-Grey1 cutLongLine">
                              {Info?.LastRun &&
                                format_date_type_a(Info?.LastRun)}
                            </p>
                          </div>
                        </td>
                        {/* <td><button  className= { `${ box_type ===     "velociraptor"  ?   "btn-type5 btn-type5-no-hover"   :  'btn-type5'}`} 
// disabled={ box_type ===     "velociraptor" }
  onClick={() => ShowInUi(Info)}
  > <IcoKey className="icon-type1 " 
 /></button></td> 


<td >
  <div style={{display:"flex" , flexDirection:"column"  , alignItems:"center" , justifyContent:"center"  }}>
  <button  className="btn-type5" onClick={()=>change_order_in_db(Info,-1)}><p className='font-type-menu'  style={{height:"15px" }}>+</p> </button>
  <button  className="btn-type5" onClick={()=>change_order_in_db(Info,+1)}><p className='font-type-menu'  style={{ height:"15px"}}>-</p> </button>
  </div>
  </td>  */}
                        <td>
                          <div
                            className="btn-menu-list"
                            // onMouseLeave={() => set_download_drop_down(false)}
                            onMouseLeave={() =>
                              openIndex === index && setOpenIndex(null)
                            } // Close dropdown on mouse leave
                            style={{ position: "relative" }}

                            //  onMouseEnter={()=>set_download_drop_down(true)}
                          >
                            <button
                              className={`${"btn-type5"}`}
                              style={{ padding: 0 }}
                              //  onClick={()=>    set_download_drop_down(!download_drop_down)}
                              onClick={() => handleDropdownToggle(index)}
                            >
                              {" "}
                              <IcoSettings className="icon-type1 " />
                            </button>

                            <div
                              // className={`dropdown-menu ${download_drop_down ? "open" : ""}`}
                              // IcoMenuDown
                              // IcoMenuUp
                              className={`dropdown-menu ${
                                openIndex === index ? "open" : ""
                              }`}
                              style={{
                                position: "absolute",
                                right: -5,
                                zIndex: 2,
                                top: -4,
                              }}
                            >
                              <p
                                className="font-type-menu ml-c pl-a mr-c mt-b mb-b "
                                style={{ minWidth: "150px" }}
                              >
                                {Info?.Tool_name &&
                                Info?.Tool_name == "AIVulnerability"
                                  ? "AI Vulnerability"
                                  : Info?.Tool_name}
                                {Info?.Toolname && Info?.Toolname} Options
                              </p>
                              <div
                                className="Bg-Grey2 mb-b"
                                style={{
                                  width: "100%",
                                  height: "2px",
                                  borderRadius: "5px",
                                }}
                              />
                              <button
                                onClick={() => HandleConfigEditOpen(Info)}
                                className="btn-menu "
                              >
                                <div className="display-flex">
                                  {" "}
                                  <p className="font-type-menu ml-c mr-c">
                                    Config
                                  </p>{" "}
                                </div>
                                {/* <div className="btn-menu-icon-placeholder  "> <p className="font-type-menu ml-b mr-b">+</p> */}
                                {/* <div className="btn-menu-icon-placeholder  ">
                                  {" "}
                                  <IcoMenuUp
                                    className="btn-menu-icon-placeholder  mr-a  "
                                    style={{ visibility: "" }}
                                  />
                                </div> */}
                              </button>
                              <button
                                onClick={() => ShowInUi(Info)}
                                className="btn-menu "
                              >
                                <div className="display-flex">
                                  {" "}
                                  <p className="font-type-menu ml-c mr-c ">
                                    Hide
                                  </p>{" "}
                                </div>
                                <div className="btn-menu-icon-placeholder  ">
                                  {" "}
                                  <IcoKey
                                    className="btn-menu-icon-placeholder  mr-a  "
                                    style={{ visibility: "" }}
                                  />
                                </div>
                              </button>
                              <button
                                onClick={() => change_order_in_db(Info, -1)}
                                className="btn-menu "
                              >
                                <div className="display-flex">
                                  {" "}
                                  <p className="font-type-menu ml-c mr-c">
                                    Move Up
                                  </p>{" "}
                                </div>
                                {/* <div className="btn-menu-icon-placeholder  "> <p className="font-type-menu ml-b mr-b">+</p> */}
                                <div className="btn-menu-icon-placeholder  ">
                                  {" "}
                                  <IcoMenuUp
                                    className="btn-menu-icon-placeholder  mr-a  "
                                    style={{ visibility: "" }}
                                  />
                                </div>
                              </button>
                              <button
                                onClick={() => change_order_in_db(Info, +1)}
                                className="btn-menu "
                              >
                                <div className="display-flex">
                                  {" "}
                                  <p className="font-type-menu ml-c mr-c">
                                    Move Down
                                  </p>{" "}
                                </div>
                                <div className="btn-menu-icon-placeholder  ">
                                  {" "}
                                  <IcoMenuDown
                                    className="btn-menu-icon-placeholder  mr-a  "
                                    style={{ visibility: "" }}
                                  />
                                </div>
                              </button>
                              <button
                                onClick={() =>
                                  HandleAddTagPopup(
                                    Info?.artifact_id ?? Info?.tool_id,
                                    Info?.Toolname ?? Info?.Tool_name,
                                    Info?.arguments.tags
                                  )
                                }
                                className="btn-menu "
                              >
                                <div className="display-flex">
                                  {" "}
                                  <p className="font-type-menu ml-c mr-c">
                                    Add tags
                                  </p>{" "}
                                </div>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </div>

          {/* <div className='Bg-Grey2' style={{width:"100%", height:"2px" ,borderRadius:"5px"}}/> */}

          {/* buttom buttons */}
          {box_type === "velociraptor" ? (
            <div
              className="display-flex justify-content-end mb-b"
              style={{ width: "100%" }}
            >
              {/* {checked_artifacts2?.length === 0 ? (
                <p className="ml-a font-type-txt  Color-Red mr-b">
                  Choose at least 1 Artifact
                </p>
              ) : (
                <>
                  <p className="ml-a font-type-txt  Color-Grey1 mr-b">
                    <b> </b>Agent required
                  </p>
                </>
              )}

              <div className=" ">
                <button
                  className="btn-type2"
                  onClick={() => handle_Main_Btn(toolURL)}
                >
                  <p className="font-type-menu">Site</p>
                </button>
              </div> */}
            </div>
          ) : (
            <div className="spacer_for_flex_box" />
          )}
        </div>
      </div>
    </>
  );
}

export {
  // PreviewBox_velociraptor2,
  PreviewBoxes_main_modules,
};

// const handle_click_velociraptor= async()=>{
// //  window.open( toolURL , '_blank');
//   try{
//       const res = await
//       axios.get(`${backEndURL}/tools/active-velociraptor-artifact`, {
//         params: {
//           checked_artifacts:  checked_artifacts2 ,
//           resource_list: JSON.stringify(['test_0000001', 'test_0000002' ])
//         }
//       });

//       set_popUp_all_good____txt({  HeadLine:"Beginning of data processing",paragraph:"This process may take several minutes. The information will be displayed on the 'Results' section." ,buttonTitle:"Ok"})
//       set_popUp_all_good____show(true)
//       if(res.data){
//         console.log("res.data 44444444444444", res.data);

//       }

//          }catch(err)
//          {console.log(err);}
//   }
