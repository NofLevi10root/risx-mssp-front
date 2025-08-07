import React, { useState, useContext, useEffect } from "react";

import { ReactComponent as IconBIG } from "../icons/ico-Results.svg";
import { ReactComponent as IconSettings } from "../icons/ico-settings.svg";
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
  PopUp_Request_info,
  PopUp_loader,
  PopUp_Under_Construction,
} from "../PopUp_Smart.js";

import LMloader from "../Features/LMloader.svg";
import "./Dashboard_Results_all.css";
function CTI_list({ Preview_this_Results, set_Preview_this_Results, loader }) {
  const { backEndURL, all_Tools, front_IP } = useContext(GeneralContext);
  const [is_search, set_is_search] = useState(false);

  console.log("Preview_this_Results", Preview_this_Results);

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

  const [PopUp_Request_info__show, set_PopUp_Request_info__show] =
    useState(false);
  const [PopUp_Request_info__txt, set_PopUp_Request_info__txt] = useState({
    HeadLine: "In process",
    paragraph: "The request has been sent",
    buttonTitle: "Close",
  });

  // const status_bar_width = "140px"
  const status_bar_width = "200px";

  const [PopUp_loader__show, set_PopUp_loader__show] = useState(false);
  const [sort_by, set_sort_by] = useState("StartDate");
  const [firstTimeData, setfirstTimeData] = useState(true); // usewith useeffect to now the first load and to sort

  const handle_click_result = (Info) => {
    console.log("-------handle_click_result-------------", Info);
  };

  const handleClickComingSoon = () => {
    set_PopUp_Under_Construction__txt({
      HeadLine: "Coming Soon!",
      paragraph: `We are working on creating this feature. Stay tuned for updates as we finalize the details.`,
      buttonTitle: "Close",
    });
    set_PopUp_Under_Construction__show(true);
  };

  const do_sort = (column) => {
    console.log("sort this column: ", column);

    if (!column) {
      console.log("Can't sort ", column);
      return;
    }

    if (column === sort_by) {
      console.log("It's already sorted like this, reversing the order");
      const sorted = [...Preview_this_Results].sort((a, b) => {
        console.log("b[column]", b[column]);
        if (b[column] < a[column]) return -1;
        if (b[column] > a[column]) return 1;
        return 0;
      });
      console.log("Sorted descending:", sorted);
      set_Preview_this_Results(sorted);
      set_sort_by(""); // Reset sort_by to allow toggling between asc and desc
    } else {
      set_sort_by(column);
      const sorted = [...Preview_this_Results].sort((a, b) => {
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
      do_sort("StartDate");
      setfirstTimeData(false);
    }
  }, [Preview_this_Results]);

  return (
    <div
      className="ResourceGroup-All"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {PopUp_loader__show && <PopUp_loader popUp_show={PopUp_loader__show} />}

      {PopUp_Under_Construction__show && (
        <PopUp_Under_Construction
          popUp_show={PopUp_Under_Construction__show}
          set_popUp_show={set_PopUp_Under_Construction__show}
          HeadLine={PopUp_Under_Construction__txt.HeadLine}
          paragraph={PopUp_Under_Construction__txt.paragraph}
          buttonTitle={PopUp_Under_Construction__txt.buttonTitle}
        />
      )}

      {PopUp_Request_info__show && (
        <PopUp_Request_info
          popUp_show={PopUp_Request_info__show}
          set_popUp_show={set_PopUp_Request_info__show}
          HeadLine={PopUp_Request_info__txt.HeadLine}
          paragraph={PopUp_Request_info__txt.paragraph}
          buttonTitle={PopUp_Request_info__txt.buttonTitle}
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

      <div className="resource-group-list-headline mb-c ">
        <div className="resource-group-list-headline-left ">
          <IconBIG />{" "}
          <p className="font-type-h4   Color-White ml-b">LeakCheck list</p>
        </div>

        <ResourceGroup_Action_btns
          items_for_search={Preview_this_Results}
          set_items_for_search={set_Preview_this_Results}
          set_is_search={set_is_search}
          btn_add_single_show={false}
          // btn_add_single_action={add_resource_item}
          // btn_add_single_value={"add"}

          btn_add_many_show={false}
          // btn_add_many_action={}

          btn_trash_show={true}
          btn_trash_action={handleClickComingSoon}
          btn_trash_id={"tmp"}
          btn_gear_show={true}
          btn_gear_action={handleClickComingSoon}
          btn_gear_id={""}
        />
      </div>

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
            <div className="resource-group-list-item   list-item-big ml-b">
              {" "}
              <p className="font-type-menu  no-underline Color-Grey1 ">Name</p>
            </div>
            <div
              className="resource-group-list-item list-item-biggest"
              onClick={() => do_sort("StartDate")}
            >
              {" "}
              <p className="font-type-menu  make-underline Color-Grey1">
                Start Date
              </p>
            </div>
            <div
              className="resource-group-list-item list-item-small"
              onClick={() => do_sort("LastIntervalDate")}
            >
              {" "}
              <p className="font-type-menu  make-underline Color-Grey1 ">
                Success
              </p>
            </div>
            <div
              className="resource-group-list-item list-item-small"
              onClick={() => do_sort("ExpireDate")}
            >
              {" "}
              <p className="font-type-menu  make-underline Color-Grey1 ">
                Quota
              </p>
            </div>
            <div
              className="resource-group-list-item list-item-small "
              onClick={() => do_sort("Status")}
              style={{ marginRight: "25px" }}
            >
              {" "}
              <p className="font-type-menu  make-underline Color-Grey1 ">
                Found
              </p>
            </div>
          </div>

          <div className="resource-group-list-box mb-c">
            {Array.isArray(Preview_this_Results) &&
              Preview_this_Results?.map((Info, index) => {
                console.log(
                  "Info?.Response?.success ",
                  Info?.Response?.success
                );
                return (
                  <div
                    className="resource-group-list-line"
                    key={index}
                    onClick={() => handle_click_result(Info)}
                  >
                    {/* <p className='resource-group-list-item    font-type-txt   Color-Grey1  list-item-big   '>{ JSON.stringify(Info?.Arguments) }</p>  */}

                    <p className="resource-group-list-item    font-type-txt   Color-Grey1  list-item-big  ml-b ">
                      {Info?.Name?.asset_string}
                    </p>
                    <p className="resource-group-list-item  font-type-txt  Color-Grey1 list-item-biggest">
                      {JSON.stringify(Info?.Response?.result)}
                    </p>
                    <p className="resource-group-list-item  font-type-txt  Color-Grey1  list-item-small">
                      {Info?.Response?.success ? "True" : "False"}
                    </p>
                    <p className="resource-group-list-item  font-type-txt  Color-Grey1  list-item-small">
                      {Info?.Response?.quota}
                    </p>
                    <p className="resource-group-list-item  font-type-txt  Color-Grey1  list-item-small">
                      {Info?.Response?.found}
                    </p>
                  </div>

                  //  </div>
                );
              })}
          </div>
          {/* <p className='resource-group-list-item    font-type-txt   Color-Grey1   list-item-big '>{Info?.Status}    {Info?.TimeNote}   </p>  */}

          {Preview_this_Results?.length === 0 && is_search === true && (
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p className="  font-type-txt   Color-Grey1 ">
                No Records for this search.
              </p>
            </div>
          )}

          <ResourceGroup_buttomLine
            records_number={Preview_this_Results?.length || 0}
          />
        </>
      )}
    </div>
  );
}

export default CTI_list;
