import React, { useState, useContext, useEffect } from "react";

import { ReactComponent as IconBIG } from "../icons/ico-menu-alert.svg";
import { ReactComponent as Loader } from "../icons/loader_typea.svg";

import ResourceGroup_Action_btns from "../ResourceGroup/ResourceGroup_Action_btns.jsx";
import ResourceGroup_buttomLine from "../ResourceGroup/ResourceGroup_buttomLine.jsx";
import axios from "axios";
import GeneralContext from "../../Context.js";
import {
  format_date_type_a,
  format_date_type_c,
} from "../Features/DateFormat.js";
import "../StatusDisplay.css";

// Adjust the path as needed based on your project structure

import {
  PopUp_All_Good,
  // PopUp_Alert_info,
  PopUp_loader,
} from "../PopUp_Smart.js";

import LMloader from "../Features/LMloader.svg";
import ResourceGroup_buttomLineAlert from "./ResourceGroup_buttomLineAlert.jsx";
//  import './Dashboard_Results_all.css'
function Alert_list({
  CategoryAlertArr,
  setCategoryAlertArr,
  loader,
  GetData,
  IntervalUpdate,
  setIntervalUpdate,
  AlertName,
  set_PopUp_All_Good__show,
  set_PopUp_All_Good__txt,
  set_PopUp_Error____show,
  set_PopUp_Error____txt,
  PopUp_Alert_info__show,
  set_PopUp_Alert_info__show,
  PopUp_Alert_info__txt,
  set_PopUp_Alert_info__txt,
}) {
  const { backEndURL, all_Tools, front_IP } = useContext(GeneralContext);
  const [Preview_this_Results, set_Preview_this_Results] = useState([]);
  useEffect(() => {
    set_Preview_this_Results(CategoryAlertArr);
  }, [CategoryAlertArr]);

  console.log("Preview_this_Results", Preview_this_Results);

  const [PopUp_loader__show, set_PopUp_loader__show] = useState(false);
  const [sort_by, set_sort_by] = useState("StartDate");
  const [firstTimeData, setfirstTimeData] = useState(true); // usewith useeffect to now the first load and to sort
  const [SortObjectField, setSortObjectField] = useState("_ts");
  const [SortOrderRevered, setSortOrderRevered] = useState(false);
  const [ListPartitionIndex, setListPartitionIndex] = useState({});

  const handle_click_result = (Info) => {
    console.log("-------handle_click_result-------------", Info);

    Info.buttonTitle = "Close";
    set_PopUp_Alert_info__txt(Info);
    set_PopUp_Alert_info__show(true);
  };

  const do_sortObject = (column, column2, bolRefershData = false) => {
    console.log("sort this column: ", column, column2, sort_by);
    try {
      if (!column) {
        console.log("Can't sort ", column);
        set_PopUp_Error____show(true);
        set_PopUp_Error____txt({
          HeadLine: "Error",
          paragraph: "Error in Sorting Data",
          buttonTitle: "OK",
        });
        return;
      }
      setSortObjectField([column, column2]);
      if (bolRefershData ? SortOrderRevered : column2 === sort_by) {
        console.log("It's already sorted like this, reversing the order");
        setSortOrderRevered(true);
        const sorted = [...Preview_this_Results]?.sort((a, b) => {
          console.log(
            "b[column]222222222222222222222222222222222222222222222222222222222222",
            b[column]?.[column2]
          );

          if (b[column]?.[column2] < a[column]?.[column2]) return -1;
          if (b[column]?.[column2] > a[column]?.[column2]) return 1;
          return 0;
        });
        console.log("Sorted descending:", sorted);
        set_Preview_this_Results(sorted);
        set_sort_by(""); // Reset sort_by to allow toggling between asc and desc
      } else {
        set_sort_by(column2);
        setSortOrderRevered(false);
        const sorted = [...Preview_this_Results]?.sort((a, b) => {
          console.log(
            "b[column]1111111111111111111111111111111111111111111111111111111111111",
            b[column]?.[column2]
          );

          if (b[column]?.[column2] < a[column]?.[column2]) return 1;
          if (b[column]?.[column2] > a[column]?.[column2]) return -1;
          return 0;
        });
        console.log("Sorted ascending:", sorted);
        set_Preview_this_Results(sorted);
      }
    } catch (error) {
      console.log(error);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Error in Sorting Data",
        buttonTitle: "OK",
      });
    }
  };

  const do_sort = (column, bolRefershData = false) => {
    console.log("sort this column: ", column);
    if (!column) {
      console.log("Can't sort ", column);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Error in Sorting Data",
        buttonTitle: "OK",
      });
      return;
    }
    setSortObjectField(column);
    if (bolRefershData ? SortOrderRevered : column === sort_by) {
      console.log("It's already sorted like this, reversing the order");
      setSortOrderRevered(true);
      const sorted = [...Preview_this_Results]?.sort((a, b) => {
        console.log("b[column]", b[column]);
        if (column == "_ts") {
          if (b[column] < a[column]) return 1;
          if (b[column] > a[column]) return -1;
          return 0;
        }
        if (b[column] < a[column]) return -1;
        if (b[column] > a[column]) return 1;
        return 0;
      });
      console.log("Sorted descending:", sorted);
      set_Preview_this_Results(sorted);
      set_sort_by(""); // Reset sort_by to allow toggling between asc and desc
    } else {
      set_sort_by(column);
      setSortOrderRevered(false);
      const sorted = [...Preview_this_Results]?.sort((a, b) => {
        console.log(a[column], "llllllllllllllllllllllllllll");
        if (column == "_ts") {
          if (b[column] < a[column]) return -1;
          if (b[column] > a[column]) return 1;
          return 0;
        }
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
      });
      console.log("Sorted ascending:", sorted);
      set_Preview_this_Results(sorted);
    }
  };

  // for first load  =>  sorting the list
  useEffect(() => {
    if (Preview_this_Results?.length >= 2 && firstTimeData) {
      // do_sort("_ts");
      setfirstTimeData(false);
    }
  }, [Preview_this_Results]);

  useEffect(() => {
    if (IntervalUpdate) {
      if (Array.isArray(SortObjectField)) {
        do_sortObject(SortObjectField[0], SortObjectField[1], true);
      } else {
        do_sort(SortObjectField, true);
      }
      setIntervalUpdate(false);
    }
  }, [IntervalUpdate]);

  return (
    <div
      className="ResourceGroup-All"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {PopUp_loader__show && <PopUp_loader popUp_show={PopUp_loader__show} />}

      {loader ? (
        <>
          {/* /// its the loader when axios working */}
          <div className="  loader-type-a">
            <Loader />
          </div>
        </>
      ) : (
        <>
          <div className="resource-group-list-keyNames mb-a  ">
            {/* <div
              className="resource-group-list-item   list-item-big ml-b"
              onClick={() => do_sort("Artifact")}
            >
              {" "}
              <p className="font-type-menu  make-underline Color-Grey1 ">
                Name
              </p>
            </div>
            <div
              className="resource-group-list-item   list-item-big ml-b"
              onClick={() => do_sort("Artifact")}
            >
              {" "}
              <p className="font-type-menu  make-underline Color-Grey1 ">
                Description
              </p>
            </div> */}
            {/* <div className='resource-group-list-item list-item-biggest' onClick={() => do_sort("StartDate")}>                    <p className='font-type-menu  no-underline Color-Grey1'>Start Date</p></div> */}
            <div
              className="resource-group-list-item list-item-small "
              onClick={() => do_sort("_ts")}
              // style={{ marginRight: "25px" }}
            >
              {" "}
              <p className="font-type-menu  make-underline Color-Grey1 ">
                Detect Time
              </p>
            </div>
            <div
              className="resource-group-list-item   list-item-big ml-b"
              onClick={() => do_sort("Client FQDN")}
            >
              {" "}
              <p className="font-type-menu  make-underline Color-Grey1 ">
                Hostname
              </p>
            </div>
            <div
              className="resource-group-list-item list-item-small "
              onClick={() => do_sortObject("UserInput", "Status")}
              // style={{ marginRight: "25px" }}
              // style={{ textAlign: "center" }}
            >
              {" "}
              <p className="font-type-menu  make-underline Color-Grey1 ">
                Status
              </p>
            </div>
            {/* <div className='resource-group-list-item list-item-small' onClick={() => do_sort("ExpireDate")} >                  <p className='font-type-menu  make-underline Color-Grey1 '>Quota</p></div> */}
            <div
              className="resource-group-list-item list-item-small"
              onClick={() => do_sortObject("UserInput", "UserId")}
              // style={{ marginRight: "25px" }}
            >
              {" "}
              <p className="font-type-menu  make-underline Color-Grey1 ">
                Assigned
              </p>
            </div>
            <div
              className="resource-group-list-item list-item-small "
              onClick={() => do_sortObject("UserInput", "ChangedAt")}
              style={{ marginRight: "25px" }}
            >
              {" "}
              <p className="font-type-menu  make-underline Color-Grey1 ">
                Updated
              </p>
            </div>
          </div>

          <div className="resource-group-list-box mb-c">
            {Array.isArray(Preview_this_Results) &&
              Preview_this_Results?.slice(
                (ListPartitionIndex[AlertName] ?? 0) * 20,
                ((ListPartitionIndex[AlertName] ?? 0) + 1) * 20
              )?.map((Info, index) => {
                // console.log("Info info info info", Info);

                return (
                  <div
                    className="resource-group-list-line"
                    key={index}
                    onClick={() => handle_click_result(Info)}
                  >
                    {/* <p className='resource-group-list-item    font-type-txt   Color-Grey1  list-item-big   '>{ JSON.stringify(Info?.Arguments) }</p>  */}

                    {/* <p className="resource-group-list-item    font-type-txt   Color-Grey1  list-item-big  ml-b ">
                      {Info?.SimpleName}
                    </p>
                    <p className="resource-group-list-item    font-type-txt   Color-Grey1  list-item-big  ml-b ">
                      {Info?.Description}
                    </p> */}
                    {/* <p className='resource-group-list-item  font-type-txt  Color-Grey1 list-item-biggest'>{ JSON.stringify(Info?.Response?.result) }</p>  */}
                    <p className="resource-group-list-item  font-type-txt  Color-Grey1  list-item-small">
                      {format_date_type_a(Info?.["_ts"])}
                    </p>
                    <p className="resource-group-list-item    font-type-txt   Color-Grey1  list-item-big  ml-c">
                      {Info?.["Client FQDN"]}
                    </p>
                    <p className="resource-group-list-item    font-type-txt   Color-Grey1  list-item-small ">
                      {Info?.UserInput?.Status}
                    </p>
                    <p className="resource-group-list-item  font-type-txt  Color-Grey1  list-item-small">
                      {Info?.UserInput?.UserId}{" "}
                    </p>
                    <p className="resource-group-list-item  font-type-txt  Color-Grey1  list-item-small">
                      {format_date_type_a(Info?.UserInput?.ChangedAt) == "NA"
                        ? ""
                        : format_date_type_a(Info?.UserInput?.ChangedAt)}
                    </p>
                    {/* <p className='resource-group-list-item  font-type-txt  Color-Grey1  list-item-small'>{Info?.Response?.quota}</p>  */}

                    {/* list-item-last  */}
                  </div>

                  //  </div>
                );
              })}
          </div>
          {/* <p className='resource-group-list-item    font-type-txt   Color-Grey1   list-item-big '>{Info?.Status}    {Info?.TimeNote}   </p>  */}

          <ResourceGroup_buttomLineAlert
            records_number={Preview_this_Results?.length || 0}
            ListPartitionIndex={ListPartitionIndex}
            setListPartitionIndex={setListPartitionIndex}
            AlertName={AlertName}
          />
        </>
      )}
    </div>
  );
}

export default Alert_list;
