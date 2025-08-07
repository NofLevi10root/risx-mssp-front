import React, { useEffect, useState } from "react";
import "../Components/PopUp.css"; // import CSS file for modal styling
// import CloseButton from "./CloseButton";
import { ReactComponent as CloseButton } from "./icons/ico-Close_type1.svg";
// import { ReactComponent as IconCart } from './icons/ico-cart.svg';
import axios from "axios";
// import Tools from '../tmpjsons/previewBoxesTools.json';
import { ReactComponent as IconTrash } from "../Components/icons/ico-trash.svg";
import GeneralContext from "../Context.js";
import { useContext } from "react";
import { ReactComponent as IconFullName } from "./ResourceGroup/asset-icons/ico-fullname.svg";
import { ReactComponent as IconCompany } from "./ResourceGroup/asset-icons/ico-company.svg";
import { ReactComponent as IconComputer } from "./ResourceGroup/asset-icons/ico-computers.svg";
import { ReactComponent as IconNoIcon } from "./ResourceGroup/asset-icons/ico-no-icon.svg";
import { format_date_type_a } from "./Features/DateFormat.js";
import { ReactComponent as IconPlus } from "./icons/ico-plus.svg";
import { fix_path } from "./Dashboards/functions_for_dashboards.js";

export const Add_Edit_Entity = (props) => {
  const {
    popUp_show,
    set_popUp_show,
    IconBIG,
    resourceItem,
    //  set_resourceItem,
    item_types_list,
    set_item_types_list,
    item_tool_list,
    set_item_tool_list,
    popUp_Add_or_Edit__status,
    set_filter_Resource,
    set_PopUp_All_Good__txt,
    set_PopUp_All_Good__show,
    set_PopUp_Are_You_Sure__txt,
    set_PopUp_Are_You_Sure__show,

    assets_list_from_db,
    set_assets_list_from_db,

    ChosenEntityRaw,
    EditTools,
    add_resource_item,
    getFullCategoryAndEntitiesList,

    set_PopUp_Are_You_Sure__Type,
    set_PopUp_Error____show,
    set_PopUp_Error____txt,
    HandleDashboardAssetOpenEndPoints,
    HandleDashboardAssetOpenRest,
    HandleDashboardAlertsOpenEndPoints,
  } = props;
  const [UpdaterValue, setUpdaterValue] = useState(false);
  const [ChooseTypePopUpShow, setChooseTypePopUpShow] = useState(false);

  const {
    all_Resource_Types,
    all_Tools,
    backEndURL,
    get_all_resource_types,
    mssp_config_json,
    front_IP,
    front_URL,
  } = useContext(GeneralContext);
  const [ChosenEntity, setChosenEntity] = useState(ChosenEntityRaw);

  useEffect(() => {
    setChosenEntity(ChosenEntityRaw);
  }, [ChosenEntityRaw]);

  const [error_message, set_error_message] = useState("");
  const [tools_preview, set_tools_preview] = useState([]);
  const [resource_type, set_resource_type] = useState({});

  const HandleHighProfile = async (Info) => {
    Info.highProfile = !Info?.highProfile;
    console.log(Info);

    setUpdaterValue(!UpdaterValue);
  };

  useEffect(() => {
    console.log(
      "-----------------------------========================================3333333333333333333333333333333",
      ChosenEntityRaw
    );

    setUpdaterValue(!UpdaterValue);
  }, [resourceItem]);

  const HandleMonitorOutsideSwitch = async (Info) => {
    try {
      const res = await axios.put(
        `${backEndURL}/Resources/UpdateMonitorSingle`,
        {
          resource_id: Info?.resource_id,
          value: !Info?.monitoring,
        }
      );

      if (res.data) {
        Info.monitoring = !Info?.monitoring;
        setUpdaterValue(!UpdaterValue);
      }
    } catch (error) {
      console.log("Error in :", error);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error IN Monitor Switch ",
        paragraph: "Error Happened Check Logs",
        buttonTitle: "Ok",
      });
    }
  };

  const Handele_are_you_sure = () => {
    set_popUp_show(false); /// the add adit popup
    set_PopUp_Are_You_Sure__Type("Entity");
    set_PopUp_Are_You_Sure__txt({
      HeadLine: "Are you sure you want to delete?",
      paragraph: "This record will be permanently deleted from the database",
      buttonTrue: "Yes",
      buttonFalse: "No",
    });

    set_PopUp_Are_You_Sure__show(true);
  };

  const change_tools_preview_acording_asset_types = () => {
    if (item_types_list.length === 0) {
      set_tools_preview([]);
      return;
    }

    // console.log("item_types_list", item_types_list);
    const filtered_tools = all_Tools.filter((tool) =>
      item_types_list.some((item_type) =>
        tool.useResourceType.includes(item_type)
      )
    );

    set_tools_preview(filtered_tools);
  };

  useEffect(() => {
    if (popUp_Add_or_Edit__status == "add") {
      const idArray = tools_preview.map((item) => item.tool_id);
      set_item_tool_list(idArray);
    }
  }, [tools_preview]);

  useEffect(() => {
    change_tools_preview_acording_asset_types();
  }, [item_types_list]);

  useEffect(() => {
    const found = all_Resource_Types.find(
      (element) => element.resource_type_id === item_types_list[0]
    );
    set_resource_type(found);
  }, []);

  const handleInputChange = (setter) => (event) => {
    const x = { ...ChosenEntity };
    x[setter] = event.target.value;
    setChosenEntity(x);
  };

  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  // function to close modal when user clicks outside of it
  function handleClickOutside(e) {
    // console.log("e.target.className" , e.target.className);
    if (e.target.className === "PopUp-background") {
      setChosenEntity({});
      set_popUp_show(false);
    }
  }

  function handleClose() {
    setChosenEntity({});

    set_popUp_show(false);
  }

  // const HandleDashboardAssetOpenEndPoints = async (id) => {
  //   try {
  //     console.log("start HandleDashboardAssetOpenEndPoints");
  //     const res = await axios.get(
  //       `${backEndURL}/dashboard/GetDashBoardClientIdVelo/${id}`
  //     );
  //     console.log("res res res res 555555555555555555", res);
  //     if (res.data) {
  //       const moduleLinks = Array.isArray(mssp_config_json?.moduleLinks)
  //         ? mssp_config_json.moduleLinks
  //         : [];
  //       const threatHuntingURL = moduleLinks.find(
  //         (link) => link.toolName === "Asset Endpoints Dashboard"
  //       )?.toolURL;
  //       const fixed_path = fix_path(threatHuntingURL, front_IP, front_URL);

  //       const url2 = fixed_path.replace(
  //         "_a=()",
  //         `_a=(filters:!((query:(match_phrase:(ClientId:%22${res.data}%22)))))`
  //       );
  //       console.log(url2, "uuuuuuuuuuuuu");

  //       window.open(url2, "_blank");
  //     } else {
  //       console.log("false");
  //       set_PopUp_Error____show(true);
  //       set_PopUp_Error____txt({
  //         HeadLine: "Error No Data",
  //         paragraph: "There is no Client ID associated with this Entity",
  //         buttonTitle: "Ok",
  //       });
  //     }
  //   } catch (error) {
  //     console.log("Error in HandleDashboardAssetOpenEndPoints : ", error);
  //     set_PopUp_Error____show(true);
  //     set_PopUp_Error____txt({
  //       HeadLine: "Error IN show Data",
  //       paragraph: "Error Happened Check Logs",
  //       buttonTitle: "Ok",
  //     });
  //   }
  // };

  const handle_add_or_edit_item = async () => {
    try {
      console.log(ChosenEntity, "chosenEntittyyyyyyyyyyyyyyyyyyyyyyyyyyy");
      if (!ChosenEntity?.entityName) {
        console.log("Missing data ", ChosenEntity);
        set_PopUp_Error____show(true);
        set_PopUp_Error____txt({
          HeadLine: "Error IN Adding Entity",
          paragraph: "The Name Field Is empty",
          buttonTitle: "Ok",
        });
        return;
      }
      if (popUp_Add_or_Edit__status == "Add") {
        console.log("Add");

        const res = await axios.post(
          `${backEndURL}/Resources/AddEntity`,
          ChosenEntity
        );
        console.log(res, "RESSS ");
        if (res.data) {
          getFullCategoryAndEntitiesList();
          handleClose();
        } else {
          console.log("error handle_add_or_edit_item entity add");
          set_PopUp_Error____show(true);
          set_PopUp_Error____txt({
            HeadLine: "Error IN Adding Entity",
            paragraph: "Error Happened Check Logs",
            buttonTitle: "Ok",
          });
        }
      } else if (popUp_Add_or_Edit__status == "Edit") {
        console.log("Edit", ChosenEntity);
        const res = await axios.put(
          `${backEndURL}/Resources/UpdateEntity`,
          ChosenEntity
        );
        console.log(res, "RESSS ");
        if (res.data) {
          getFullCategoryAndEntitiesList();
          handleClose();
        } else {
          console.log("error handle_add_or_edit_item entity add 2");
          set_PopUp_Error____show(true);
          set_PopUp_Error____txt({
            HeadLine: "Error IN Adding Entity",
            paragraph: "Error Happened Check Logs",
            buttonTitle: "Ok",
          });
        }
      } else {
        console.log("Error");
        set_PopUp_Error____show(true);
        set_PopUp_Error____txt({
          HeadLine: "Error IN Adding Entity",
          paragraph: "Error Happened Check Logs",
          buttonTitle: "Ok",
        });
      }
    } catch (error) {
      console.log("error handle_add_or_edit_item :", error);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error IN Adding Entity",
        paragraph: error?.response?.data
          ? error?.response?.data
          : "Error Happened Check Logs",
        buttonTitle: "Ok",
      });
    }
  };

  const TypeText = (resource_type_id) => {
    if (resource_type_id === "2001") {
      return "Company Domain";
    } else if (resource_type_id === "2002") {
      return "IP Address";
    } else if (resource_type_id === "2003") {
      return "Username";
    } else if (resource_type_id === "2004") {
      return "Phone Number";
    } else if (resource_type_id === "2005") {
      return "Full Name";
    } else if (resource_type_id === "2006") {
      return "Email Address";
    } else if (resource_type_id === "2007") {
      return "Company Name";
    } else if (resource_type_id === "2008") {
      return "Hostname";
    } else if (resource_type_id === "2009") {
      return "Email Domain";
    } else {
      return <IconNoIcon />;
    }
  };

  const renderIcon = (resource_type_id) => {
    if (resource_type_id === "Users") {
      return <IconFullName />;
    } else if (resource_type_id === "Organization") {
      return <IconCompany />;
    } else if (resource_type_id === "Endpoints") {
      return <IconComputer />;
    } else {
      return <IconNoIcon />;
    }
  };

  const HandleMonitorOutsideSwitchMulti = async (info, StateOfSwitch) => {
    try {
      const ids = [];
      if (Array.isArray(info)) {
        info.forEach((x) => {
          ids.push(x?.entitiesId);
        });
      } else {
        ids.push(info?.entitiesId);
      }
      const res = await axios.put(
        `${backEndURL}/Resources/UpdateMonitorMulti`,
        {
          ids: ids,
          value: !StateOfSwitch,
        }
      );
      if (res.data) {
        if (Array.isArray(info)) {
          info.forEach((y) => {
            y?.properties?.forEach((o) => (o.monitoring = !StateOfSwitch));
          });
        } else {
          info?.properties?.forEach((o) => (o.monitoring = !StateOfSwitch));
        }
        setUpdaterValue(!UpdaterValue);
      }
    } catch (error) {
      console.log("Error in HandleMonitorOutsideSwitchMulti :", error);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error IN Monitor Switch ",
        paragraph: "Error Happened Check Logs",
        buttonTitle: "Ok",
      });
    }
  };
  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div className={`PopUp-content`} style={{ width: "1000px" }}>
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            <div className="display-flex mb-d">
              {/* <IconBIG />{" "} */}
              {renderIcon(ChosenEntity?.categoryName)}

              <p className="font-type-h4   Color-White ml-b">
                {popUp_Add_or_Edit__status === "Add" ? (
                  <>
                    Add Entity{" "}
                    {ChosenEntityRaw?.categoryName == "Organization"
                      ? ChosenEntityRaw?.categoryName
                      : ChosenEntityRaw?.categoryName?.slice(0, -1)}
                  </>
                ) : (
                  <>Edit Entity : {ChosenEntityRaw?.entityName}</>
                )}
              </p>
              {popUp_Add_or_Edit__status === "Add" ? (
                ""
              ) : (
                <>
                  <button
                    className="btn-type2"
                    style={{ marginLeft: "auto" }}
                    onClick={() => {
                      if (ChosenEntity.categoryName == "Endpoints") {
                        HandleDashboardAssetOpenEndPoints(
                          ChosenEntity.entitiesId
                        );
                      } else {
                        HandleDashboardAssetOpenRest(ChosenEntity.entitiesId);
                      }
                    }}
                  >
                    <p className="font-type-menu ">Security Dashboard</p>
                  </button>
                  {ChosenEntity.categoryName == "Endpoints" && (
                    <button
                      className="btn-type2"
                      style={{ marginLeft: 15 }}
                      onClick={() => {
                        HandleDashboardAlertsOpenEndPoints(
                          ChosenEntity.entitiesId
                        );
                      }}
                    >
                      <p className="font-type-menu ">Alerts Dashboard</p>
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="items_top_center_buttom">
              <div className="items_top">
                <div
                  className="items_left"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  <div className="item_info_left" style={{ flex: "1 0 47%" }}>
                    <p className="font-type-menu   Color-Grey1 pb-b">Name</p>
                    <input
                      className="input-type2 mb-a "
                      type="text"
                      value={ChosenEntity?.entityName}
                      placeholder={"Name..."}
                      onChange={handleInputChange("entityName")}
                    />
                  </div>
                  {ChosenEntity.categoryName !== "Organization" && (
                    <>
                      <div
                        className="item_info_left"
                        style={{ flex: "1 0 47%" }}
                      >
                        <p className="font-type-menu   Color-Grey1 pb-b">
                          Role
                        </p>
                        <input
                          className="input-type2 mb-a "
                          type="text"
                          value={ChosenEntity?.role}
                          placeholder={"Role In Organization..."}
                          onChange={handleInputChange("role")}
                        />
                      </div>
                      <div
                        className="item_info_left"
                        style={{ flex: "1 0 47%" }}
                      >
                        <p className="font-type-menu   Color-Grey1 pb-b">
                          Organization
                        </p>
                        <input
                          className="input-type2 mb-a "
                          type="text"
                          value={ChosenEntity?.organization}
                          placeholder={`organization that ${
                            ChosenEntityRaw?.categoryName == "Organization"
                              ? ChosenEntityRaw?.categoryName
                              : ChosenEntityRaw?.categoryName?.slice(0, -1)
                          } Belongs To...`}
                          onChange={handleInputChange("organization")}
                        />
                      </div>
                      <div
                        className="item_info_left"
                        style={{ flex: "1 0 47%" }}
                      >
                        <p className="font-type-menu   Color-Grey1 pb-b">
                          Department
                        </p>
                        <input
                          className="input-type2 mb-a "
                          type="text"
                          value={ChosenEntity?.department}
                          placeholder={"Department..."}
                          onChange={handleInputChange("department")}
                        />
                      </div>
                    </>
                  )}
                  <div className="item_info_left" style={{ flex: "1 0 100%" }}>
                    <p className="font-type-menu   Color-Grey1 pb-b">
                      Description
                    </p>
                    <input
                      className="input-type2 mb-a "
                      type="text"
                      value={ChosenEntity?.description}
                      placeholder={ChosenEntity?.description || "Description"}
                      onChange={handleInputChange("description")}
                    />
                  </div>
                </div>
              </div>
              {popUp_Add_or_Edit__status !== "Add" && (
                <>
                  {" "}
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p className="font-type-menu   Color-Grey1 pb-b">
                      Properties
                    </p>
                  </div>
                  <div
                    className="item_info_tools_all"
                    //  style={{height:"100px"}}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignContent: "center",
                      }}
                    >
                      <button
                        className="btn-type1"
                        onClick={() => setChooseTypePopUpShow(true)}
                      >
                        <IconPlus className="icon-type1" />
                      </button>
                    </div>
                    {/* {item_types_list.length != 0 &&  } */}
                    <div
                      className="titles mb-c"
                      style={
                        {
                          // visibility: item_types_list.length === 0 && "hidden",
                        }
                      }
                    >
                      {/* <label className="container" style={{ visibility: "hidden" }}>
                    <input
                      type="checkbox"
                      // defaultChecked
                    />
                    <span className="checkmark"></span>
                  </label> */}
                      <p className="column font-type-menu  list-item-small Color-Grey1 column-small">
                        Monitor
                      </p>
                      <p className="column font-type-menu   Color-Grey1 column-small">
                        Type
                      </p>
                      <p className="column font-type-menu   Color-Grey1 column-small">
                        Value
                      </p>
                      <p className="column font-type-menu   Color-Grey1">
                        Description
                      </p>{" "}
                      <p
                        style={{ minWidth: 150 }}
                        className="column font-type-menu   Color-Grey1 column-small"
                      >
                        Active Tools
                      </p>
                      <p className="column font-type-menu   Color-Grey1 column-small mr-b">
                        Checked
                      </p>
                    </div>

                    <div className="item_info_tools_box">
                      <div className="item_info_tools">
                        {Array.isArray(ChosenEntity?.properties) &&
                          ChosenEntity?.properties?.map((Info, index) => {
                            return (
                              <div
                                className="toolsData  "
                                onClick={() => {
                                  // console.log("Click On Propriety", Info);
                                  EditTools(Info);
                                }}
                              >
                                <div
                                  className="resource-group-list-item list-item-small display-flex "
                                  style={{ width: 120 }}
                                >
                                  <label
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      HandleMonitorOutsideSwitch(Info);
                                    }}
                                    className="switch"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={Info?.monitoring}
                                      // onChange={}
                                      // defaultChecked={Math.random() < 0.7}
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                                <div className="column column-small  ">
                                  <p
                                    style={{ width: 100 }}
                                    className=" column-for-txt   font-type-txt   Color-Blue-Glow tagit_type1"
                                  >
                                    {TypeText(Info?.type)}
                                  </p>
                                </div>
                                <div className="column column-small  ">
                                  <p
                                    className=" column-for-txt   font-type-txt  Color-Grey1  "
                                    style={{ width: 100 }}
                                  >
                                    {Info?.resource_string}
                                  </p>
                                </div>

                                <p className="column-for-txt font-type-txt     Color-Grey1">
                                  {Info?.description}
                                </p>

                                <div
                                  style={{
                                    minWidth: 150,
                                    maxWidth: 150,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                  className="column column-small  "
                                >
                                  {(Info?.tools?.length === 1 &&
                                    Info?.tools[0]?.Toolid === null) ||
                                  Info?.tools[0]?.Toolid === "" ||
                                  Info?.tools[0]?.Toolid === undefined ? (
                                    <p className="ml-a    font-type-txt   Color-Grey1   "></p>
                                  ) : null}
                                  {/* ? (<p className='ml-a    font-type-txt   Color-Red   '> Undefined  </p> ) : null  } */}
                                  {Info?.tools?.length === 1 &&
                                  Info?.tools[0]?.Toolid !== null &&
                                  Info?.tools[0]?.Toolid !== "" &&
                                  Info?.tools[0]?.Toolid !== undefined ? (
                                    <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1">
                                      {Info?.tools[0]?.toolname}
                                    </p>
                                  ) : null}
                                  {/* {Info?.tools?.length === 2 &&
                                  Info?.tools[0]?.Toolid !== null &&
                                  Info?.tools[0]?.Toolid !== "" &&
                                  Info?.tools[0]?.Toolid !== undefined ? (
                                    <>
                                      <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1">
                                        {Info?.tools[0]?.toolname}
                                      </p>
                                      <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1">
                                        {Info?.tools[1]?.toolname}
                                      </p>
                                    </>
                                  ) : null} */}
                                  {Info?.tools?.length > 1 &&
                                  Info?.tools[0]?.Toolid !== null &&
                                  Info?.tools[0]?.Toolid !== "" &&
                                  Info?.tools[0]?.Toolid !== undefined ? (
                                    <>
                                      <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1">
                                        {Info?.tools[0]?.toolname}
                                      </p>{" "}
                                      <p className=" ml-a font-type-txt   Color-Grey1  ">
                                        +{Info?.tools?.length - 1}
                                      </p>
                                    </>
                                  ) : null}{" "}
                                </div>
                                <div
                                  // style={{ visibility: "hidden" }}
                                  className="column column-small  "
                                >
                                  <p
                                    className="   font-type-txt   Color-Blue-Glow tagit_type1"
                                    style={{
                                      visibility: Info?.checked
                                        ? "visible"
                                        : "hidden",
                                    }}
                                  >
                                    {Info?.checked &&
                                    format_date_type_a(Info?.checked) !== "NA"
                                      ? format_date_type_a(Info?.checked)
                                      : "55-05-2024 10:15"}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="display-flex  ">
                {popUp_Add_or_Edit__status !== "Add" && (
                  <>
                    {" "}
                    <div className="display-flex  ">
                      <label className="switch">
                        {" "}
                        <p className="column font-type-menu   Color-Grey1 ">
                          Start Monitoring
                        </p>
                        <input
                          type="checkbox"
                          checked={ChosenEntity?.properties?.some(
                            (o) => o?.monitoring
                          )}
                          onChange={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            HandleMonitorOutsideSwitchMulti(
                              ChosenEntity,
                              ChosenEntity?.properties?.some(
                                (o) => o?.monitoring
                              )
                            );
                          }}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </>
                )}

                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    // alignItems: "center",
                    // justifyContent: "center",
                    // height: "22px",
                    width: 110,
                  }}
                >
                  <div className="display-flex  ">
                    <label className="switch">
                      {" "}
                      <p className="column font-type-menu   Color-Grey1 ">
                        highProfile
                      </p>
                      <input
                        type="checkbox"
                        checked={ChosenEntity?.highProfile}
                        onChange={(e) => {
                          // e.preventDefault();
                          // e.stopPropagation();
                          HandleHighProfile(ChosenEntity);
                          setUpdaterValue(!UpdaterValue);
                        }}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="display-flex  mt-c" style={{}}>
              <div style={{ marginLeft: "auto" }} />
              {error_message === "" ? null : (
                <p className="  font-type-menu   Color-Red  mr-b">
                  {error_message}
                </p>
              )}
              <div
                style={{
                  // marginLeft: 0,
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "22px",
                }}
              >
                {popUp_Add_or_Edit__status === "Edit" ? (
                  <>
                    <p className=" font-type-menu   Color-Grey1 mr-a ">ID</p>
                    <p
                      style={{ flexGrow: 1 }}
                      className=" font-type-txt     Color-Grey1"
                    >
                      {" "}
                      {ChosenEntity.entitiesId}
                    </p>
                  </>
                ) : null}
              </div>
              {popUp_Add_or_Edit__status === "Edit" && (
                <button
                  className="btn-type1"
                  style={{ marginRight: "5px" }}
                  onClick={Handele_are_you_sure}
                >
                  <IconTrash className="icon-type1" />{" "}
                </button>
              )}
              <button className="btn-type2" onClick={handle_add_or_edit_item}>
                <p className="font-type-menu ">
                  {popUp_Add_or_Edit__status === "Add" ? (
                    <>Save</>
                  ) : (
                    <>Update</>
                  )}
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
      {ChooseTypePopUpShow && (
        <div
          className={`PopUp-background`}
          onClick={() => {
            setChooseTypePopUpShow(false);
          }}
        >
          <div
            className={`PopUp-content`}
            style={{ width: "600px", zIndex: 24788888888888888887 }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button
                className="PopUp-Close-btn"
                onClick={() => {
                  setChooseTypePopUpShow(false);
                }}
              >
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>
            <div className="display-flex mb-d">
              {/* <IconBIG />{" "} */}
              {renderIcon(ChosenEntity?.categoryName)}

              <p className="font-type-h4   Color-White ml-b">
                Choose A property type
              </p>
            </div>
            <div className="items_top_center_buttom">
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {all_Resource_Types?.map((Info) => {
                  if (Info?.category_name != ChosenEntityRaw?.categoryName) {
                    return;
                  }

                  return (
                    <div
                      onClick={() => {
                        console.log("click ", Info?.resource_type_id);
                        add_resource_item("add", Info?.resource_type_id);
                        setChooseTypePopUpShow(false);
                      }}
                      className=" font-type-txt   Color-Blue-Glow tagit_type1"
                      style={{
                        width: 250,
                        fontSize: 20,
                        padding: 10,
                        marginBottom: 20,
                        marginRight: 20,
                        justifyContent: "center",
                      }}
                    >
                      {Info?.preview_name?.trim()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
