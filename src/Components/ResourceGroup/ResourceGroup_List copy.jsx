import React, { useState, useContext, useEffect } from "react";
import { ReactComponent as IconMain } from "../icons/ico-Resource-Group.svg";
import { ReactComponent as IconSettings } from "../icons/ico-settings.svg";
import { ReactComponent as IconAdd } from "../icons/ico-plus.svg";

import { ReactComponent as IconComputer } from "./asset-icons/ico-computers.svg";
import { ReactComponent as IconEmail } from "./asset-icons/ico-email.svg";
import { ReactComponent as IconNoIcon } from "./asset-icons/ico-no-icon.svg";
import { ReactComponent as IconDns } from "./asset-icons/ico-dns.svg";
import { ReactComponent as IconIp } from "./asset-icons/ico-ip.svg";
import { ReactComponent as IconPhonenumber } from "./asset-icons/ico-phonenumbers.svg";
import { ReactComponent as IconUserNameSocial } from "./asset-icons/ico-username.svg";
import { ReactComponent as IconFullName } from "./asset-icons/ico-fullname.svg";
import { ReactComponent as IconCompany } from "./asset-icons/ico-company.svg";
import { ReactComponent as IconEmailDomain } from "./asset-icons/ico-email-domain.svg";

import ResourceGroup_Action_btns from "./ResourceGroup_Action_btns";
import ResourceGroup_buttomLine from "./ResourceGroup_buttomLine";
//  import { ReactComponent as IcoResults } from '../icons/ico-menu-Results.svg';

import axios from "axios";
import GeneralContext from "../../Context.js";

//  import { Add_Edit_Resource_Item } from "../Add_Edit_Resource_Item";
import { PopUp_Under_Construction, PopUp_All_Good } from "../PopUp_Smart";

import LMloader from "../Features/LMloader.svg";
import { format_date_type_a } from "../Features/DateFormat.js";

import { SingularToPlural } from "../Features/UsefulFunctions.js";

function ResourceGroup_List({
  loader,
  set_popUp_Add_or_Edit__status,
  set_popUp_Add_or_Edit__show,
  popUp_Add_or_Edit__show,
  add_resource_item,
  title,
  EditTools,
  Add_Many,
  asset_type_id,
  handle_back,
  assets_list_from_db,
  set_assets_list_from_db,
}) {
  const { backEndURL } = useContext(GeneralContext);
  const [is_search, set_is_search] = useState(false);

  const [firstTimeData, setfirstTimeData] = useState(true); // usewith useeffect to now the first load and to sort
  const [sort_by, set_sort_by] = useState("");
  // const [item_types_list, set_item_types_list] = useState([]);
  // const [item_tool_list, set_item_tool_list] = useState([]);

  const [PopUp_Under_Construction__show, set_PopUp_Under_Construction__show] =
    useState(false);
  const [PopUp_Under_Construction__txt, set_PopUp_Under_Construction__txt] =
    useState({
      HeadLine: "Coming Soon!",
      paragraph:
        "We are working on creating this section. Stay tuned for updates as we finalize the details.",
      buttonTitle: "Close",
    });

  const [PopUp_All_Good__show, set_PopUp_All_Good__show] = useState(false);
  const [PopUp_All_Good__txt, set_PopUp_All_Good__txt] = useState({
    HeadLine: "Success",
    paragraph: "successfully",
    buttonTitle: "Close",
  });

  // console.log("sort_by",sort_by);
  // console.log("firstTimeData",firstTimeData);
  // console.log("asset_type_id",asset_type_id);
  const [UpdaterValue, setUpdaterValue] = useState(false);
  const HandleMonitorOutsideSwitch = async (Info) => {
    // console.log(Info, "iddddddddddddddddd");

    const res = await axios.put(`${backEndURL}/Resources/UpdateMonitorSingle`, {
      resource_id: Info?.resource_id,
      value: !Info?.monitoring,
    });

    if (res.data) {
      Info.monitoring = !Info?.monitoring;
      setUpdaterValue(!UpdaterValue);
    }
  };

  const HandleMonitorOutsideSwitchMulti = async () => {
    const StateOfSwitch = assets_list_from_db?.some((x) => x?.monitoring);

    const res = await axios.put(`${backEndURL}/Resources/UpdateMonitorMulti`, {
      asset_type_id: asset_type_id,
      value: !StateOfSwitch,
    });

    if (res.data) {
      assets_list_from_db.forEach((Info) => {
        Info.monitoring = !StateOfSwitch;
      });

      setUpdaterValue(!UpdaterValue);
    }
  };

  const renderIcon = (resource_type_id) => {
    if (resource_type_id === "2001") {
      return <IconDns />;
    } else if (resource_type_id === "2002") {
      return <IconIp />;
    } else if (resource_type_id === "2003") {
      return <IconUserNameSocial />;
    } else if (resource_type_id === "2004") {
      return <IconPhonenumber />;
    } else if (resource_type_id === "2005") {
      return <IconFullName />;
    } else if (resource_type_id === "2006") {
      return <IconEmail />;
    } else if (resource_type_id === "2007") {
      return <IconCompany />;
    } else if (resource_type_id === "2008") {
      return <IconComputer />;
    } else if (resource_type_id === "2009") {
      return <IconEmailDomain />;
    } else {
      return <IconNoIcon />;
    }
  };

  const handleClickComingSoon = (x) => {
    console.log(x);
    set_PopUp_Under_Construction__txt({
      HeadLine: "Coming Soon!",
      paragraph: `We are working on creating this feature. Stay tuned for updates as we finalize the details.`,
      buttonTitle: "Close",
    });
    set_PopUp_Under_Construction__show(true);
  };

  useEffect(() => {
    const get_resources_from_same_type = async () => {
      if (backEndURL === undefined) {
        return;
      }

      const data = {
        asset_type_id: asset_type_id,
      };

      try {
        //  set_loader(true)
        const res = await axios.get(`${backEndURL}/Resources/same-type`, {
          params: data,
        });
        if (res) {
          console.log("get_resources_from_same_type", res.data);
          set_assets_list_from_db(res.data);
          //  set_loader(false)
        }
      } catch (err) {
        //  set_loader(false)
        console.log(err);
      }
    };

    get_resources_from_same_type();
  }, [backEndURL]);

  const normal_sort = (column) => {
    console.log("start sort on ", asset_type_id);
    console.log("sort this column: ", column);

    if (!column) {
      console.log("Can't sort ", column);
      return;
    }

    if (column === sort_by) {
      console.log("It's already sorted like this, reversing the order");
      const sorted = [...assets_list_from_db].sort((a, b) => {
        console.log("b[column]", b[column]);
        if (b[column] < a[column]) return -1;
        if (b[column] > a[column]) return 1;
        return 0;
      });
      console.log("Sorted descending:", sorted);
      set_assets_list_from_db(sorted);
      set_sort_by(""); // Reset sort_by to allow toggling between asc and desc
    } else {
      set_sort_by(column);
      const sorted = [...assets_list_from_db].sort((a, b) => {
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
      });
      console.log("Sorted ascending:", sorted);
      set_assets_list_from_db(sorted);
    }
  };

  const complex_sort = (column) => {
    console.log("sort this column:", column);
    if (!column) {
      console.log("Can't sort", column);
      return;
    }

    const getValue = (item, path) => {
      return path.split(".").reduce((acc, part) => {
        const index = part.match(/\[(\d+)\]/);
        if (index) {
          const key = part.split("[")[0];
          return acc[key] ? acc[key][index[1]] : undefined;
        }
        return acc[part];
      }, item);
    };

    // Check if the column is the same as the current sort column
    const isSameColumn = column === sort_by;

    // If it's the same column, reverse the order; otherwise, sort ascending
    const sorted = [...assets_list_from_db].sort((a, b) => {
      const valA = getValue(a, column);
      const valB = getValue(b, column);

      // Ascending if not the same column, descending if it is
      if (isSameColumn) {
        return valB < valA ? -1 : valB > valA ? 1 : 0; // Descending
      } else {
        return valA < valB ? -1 : valA > valB ? 1 : 0; // Ascending
      }
    });

    // Log the sorting direction
    console.log(
      isSameColumn ? "Sorted descending:" : "Sorted ascending:",
      sorted
    );

    // Update state
    set_sort_by(isSameColumn ? "" : column); // Reset sort_by if reversing
    set_assets_list_from_db(sorted);
  };

  // for first load  =>  sorting the list
  useEffect(() => {
    console.log(
      "make sort form use effect",
      asset_type_id,
      "list",
      assets_list_from_db
    );
    if (assets_list_from_db?.length >= 2 && firstTimeData) {
      normal_sort("resource_string");
      setfirstTimeData(false);
    }
  }, [assets_list_from_db]);

  return (
    <>
      {PopUp_All_Good__show && (
        <PopUp_All_Good
          popUp_show={PopUp_All_Good__show}
          set_popUp_show={set_PopUp_All_Good__show}
          HeadLine={PopUp_All_Good__txt.HeadLine}
          paragraph={PopUp_All_Good__txt.paragraph}
          buttonTitle={PopUp_All_Good__txt.buttonTitle}
        />
      )}

      {PopUp_Under_Construction__show && (
        <PopUp_Under_Construction
          popUp_show={PopUp_Under_Construction__show}
          set_popUp_show={set_PopUp_Under_Construction__show}
          HeadLine={PopUp_Under_Construction__txt.HeadLine}
          paragraph={PopUp_Under_Construction__txt.paragraph}
          buttonTitle={PopUp_Under_Construction__txt.buttonTitle}
        />
      )}

      <div
        className="ResourceGroup-All"
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <div
          className="resource-group-list-headline mb-b    "
          //  onClick={()=>{handle_show_list(asset_type_id)}}
        >
          <div className="resource-group-list-headline-left ">
            <div className="resource-group-icon">
              {renderIcon(asset_type_id)}
            </div>{" "}
            <p className={` font-type-h4  Color-White ml-b`}>
              {title && SingularToPlural(title)}
            </p>
          </div>

          <ResourceGroup_Action_btns
            //  set_item_types_list={set_item_types_list}
            //  set_item_tool_list={set_item_tool_list}
            set_popUp_Add_or_Edit__show={set_popUp_Add_or_Edit__show}
            popUp_Add_or_Edit__show={popUp_Add_or_Edit__show}
            set_popUp_Add_or_Edit__status={set_popUp_Add_or_Edit__status}
            items_for_search={assets_list_from_db}
            set_items_for_search={set_assets_list_from_db}
            set_is_search={set_is_search}
            btn_add_single_show={true}
            btn_add_single_action={add_resource_item}
            btn_add_single_value={"add"}
            btn_add_single_id={asset_type_id}
            btn_add_many_show={true}
            btn_add_many_action={Add_Many}
            btn_add_many_id={asset_type_id}
            btn_trash_show={true}
            btn_trash_action={handleClickComingSoon}
            btn_trash_id={"tmp"}
            btn_gear_show={true}
            btn_gear_action={handleClickComingSoon}
            btn_gear_id={""}
            btn_collapse_show={true}
            btn_collapse_action={handle_back}
          />
        </div>

        {loader ? (
          <>
            <div className="  loader-type-a">
              {" "}
              <img src={LMloader} className="" alt="Loading Resources" />
            </div>
          </>
        ) : (
          <>
            <div className="resource-group-list-keyNames mb-a  mt-c ">
              <div
                className="resource-group-list-item list-item-big  ml-b"
                onClick={() => normal_sort("resource_string")}
              >
                <p className="font-type-menu  make-underline Color-Grey1 ">
                  Name
                </p>
              </div>
              <div
                className="resource-group-list-item   list-item-big"
                onClick={() => normal_sort("description")}
              >
                <p className="font-type-menu  make-underline Color-Grey1 ">
                  Description
                </p>
              </div>
              <div
                className="resource-group-list-item list-item-big  "
                onClick={() => complex_sort(`tools[0].Toolid`)}
              >
                <p className="font-type-menu  make-underline Color-Grey1 ">
                  Active Tools
                </p>
              </div>
              <div
                className="resource-group-list-item list-item-small "
                onClick={() => normal_sort("monitoring")}
                style={{ display: "flex", flexDirection: "row" }}
              >
                <p
                  className="font-type-menu  make-underline Color-Grey1"
                  // style={{ width: "100%" }}
                >
                  {/* switchess */}
                  Monitor{" "}
                </p>
                <div
                  className="resource-group-list-item list-item-small display-flex"
                  style={{ width: 80, marginLeft: 10, marginTop: -7 }}
                >
                  <label
                    onClick={(e) => {
                      if (assets_list_from_db?.length == 0) {
                        return;
                      }
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(
                        assets_list_from_db?.length == 0,
                        "press",
                        assets_list_from_db?.length
                      );

                      HandleMonitorOutsideSwitchMulti();
                    }}
                    className="switch"
                  >
                    <input
                      type="checkbox"
                      checked={assets_list_from_db?.some((x) => x?.monitoring)}
                      disabled={assets_list_from_db?.length == 0}
                      // onChange={}
                      // defaultChecked={Math.random() < 0.7}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              <div
                className="resource-group-list-item list-item-small"
                onClick={() => normal_sort("checked")}
              >
                <p className="font-type-menu  make-underline Color-Grey1 ">
                  Checked
                </p>
              </div>
              <div
                className="resource-group-list-item   list-item-status-color  mr-a"
                onClick={() => normal_sort("resource_status")}
                style={{ textAlign: "center", marginRight: "25px" }}
              >
                <p className="font-type-menu  make-underline Color-Grey1  ">
                  Status
                </p>
              </div>

              {/* <div className='its-only-space-for-the-scroller    '/>  */}
            </div>

            <div className="resource-group-list-box  mb-c">
              {Array.isArray(assets_list_from_db) &&
                assets_list_from_db?.map((Info, index) => {
                  const dateString = Info?.checked;
                  let formattedDate = "Never"; // Default value

                  if (dateString) {
                    const date = new Date(dateString);
                    formattedDate = `${date.getDate()}-${
                      date.getMonth() + 1
                    }-${date.getFullYear()}`;
                  }

                  // Determine the class based on StatusColor
                  const StatusColorClass =
                    Info?.resource_status === "red"
                      ? "Bg-Red"
                      : Info?.resource_status === "yellow"
                      ? "Bg-Yellow"
                      : Info?.resource_status === "green"
                      ? "Bg-Green"
                      : "Bg-Grey2";

                  return (
                    <div
                      className="resource-group-list-line"
                      key={index}
                      onClick={() => EditTools(Info)}
                    >
                      <p className="resource-group-list-item    font-type-txt   Color-Grey1  list-item-big ml-b">
                        {Info?.resource_string}
                      </p>
                      <p className="resource-group-list-item    font-type-txt   Color-Grey1  list-item-big">
                        {Info?.description}
                      </p>

                      <div className="resource-group-list-item display-flex list-item-big">
                        {/* <button className="btn-type1"><IconSettings className="icon-type1 " />  </button> */}

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

                        {Info?.tools?.length === 2 &&
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
                        ) : null}

                        {Info?.tools?.length > 2 &&
                        Info?.tools[0]?.Toolid !== null &&
                        Info?.tools[0]?.Toolid !== "" &&
                        Info?.tools[0]?.Toolid !== undefined ? (
                          <>
                            <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1">
                              {Info?.tools[0]?.toolname}
                            </p>{" "}
                            <p className=" ml-a font-type-txt   Color-Grey1  ">
                              +{Info?.tools?.length - 1} More
                            </p>
                          </>
                        ) : null}
                      </div>

                      <div className="resource-group-list-item list-item-small display-flex">
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

                      <p className="resource-group-list-item   list-item-small font-type-txt   Color-Grey1  ">
                        {Info?.checked && format_date_type_a(Info?.checked)}
                      </p>
                      <div className="resource-group-list-item    list-item-last   list-item-status-color   ">
                        <div
                          className={`    ${StatusColorClass}  light-bulb-type1`}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            {assets_list_from_db?.length === 0 && is_search === false && (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p className="  font-type-txt   Color-Grey1 ">
                  No Records of {title && SingularToPlural(title)}. Use the '
                  <span
                    style={{ display: "inline-flex", verticalAlign: "middle" }}
                  >
                    <IconAdd style={{ margin: "0", padding: "0" }} />
                  </span>
                  ' icon to to add assets.
                </p>
              </div>
            )}

            {assets_list_from_db?.length === 0 && is_search === true && (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p className="  font-type-txt   Color-Grey1 ">
                  No Records of {title && SingularToPlural(title)} for this
                  search.
                </p>
              </div>
            )}

            {assets_list_from_db?.length != 0 && is_search === false && (
              <ResourceGroup_buttomLine
                records_number={assets_list_from_db?.length || 0}
              />
            )}
          </>
        )}

        {/* </>} */}
      </div>
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        <button className="btn-type5    mb-a" onClick={handle_back}>
          <p className=" font-type-menu  Color-Grey2  mr-a">
            Back to Assets Type
          </p>
          <div style={{ transform: "scale(0.9)" }}>
            <IconMain className="icon-type1" />
          </div>{" "}
        </button>
      </div>
    </>
  );
}

export default ResourceGroup_List;
