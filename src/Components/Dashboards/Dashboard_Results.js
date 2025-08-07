import React, { useState, useEffect, useContext } from "react";
import {
  PreviewBox_type1_number,
  PreviewBox_type3_bar,
  PreviewBox_type4_legend2,
} from "../PreviewBoxes.js";
import Results_list from "./Results_list.jsx";

import axios from "axios";
import "./../ResourceGroup/ResourceGroup.css";
import GeneralContext from "../../Context.js";

import {
  format_date_type_a,
  format_date_type_c,
} from "../Features/DateFormat.js";

function Results({ show_SideBar, set_show_SideBar, set_visblePage }) {
  set_visblePage("dashboard-general");

  const { backEndURL, all_Resource_Types, all_artifacts, user_id } =
    useContext(GeneralContext);
  const [Preview_this_Results, set_Preview_this_Results] = useState([]);
  const [filter_Resource, set_filter_Resource] = useState({
    type_ids: [],
    tool_ids: [],
  });
  const [loader, set_loader] = useState(false);
  const [last_updated, set_last_updated] = useState({ default: 0 });
  const [Status_Legend, set_Status_Legend] = useState({});
  const [counts, setCounts] = useState([]);

  // dont show sidebar in this page
  useEffect(() => {
    if (show_SideBar === false) {
      set_show_SideBar(true);
    }
  }, []);
  const get_all_Results = async () => {
    if (backEndURL === undefined) {
      return;
    }

    try {
      set_loader(true);
      const res = await axios.get(
        `${backEndURL}/results/get_all_requests_table`
      );
      if (res) {
        console.log("new_Results --------", res.data);
        // console.log("typeof",typeof res.data);

        if (res.data === undefined) {
          console.log("no files ..............,");
          return;
        }
        if (res.data.length == 0) {
          console.log("no files ..............,");
        }

        localStorage.setItem(
          user_id + "_seeRessults",
          res.data?.results_list?.length
        );
        set_last_updated(res.data?.latest_dates);
        set_Preview_this_Results(res.data?.results_list);
        set_loader(false);
      }
    } catch (err) {
      set_loader(false);
      console.log(err);
    }
    // }
  };
  useEffect(() => {
    get_all_Results();
  }, [filter_Resource, backEndURL]);

  // make statistics to ---  Status Legend

  useEffect(() => {
    if (Preview_this_Results === undefined) {
      return;
    }

    const BestPractice = "BestPractice";
    // count the best practice
    const countOccurrences = () => {
      // const countUniqueStartDates = (Preview_this_Results) => {
      //   const uniqueStartDates = new Set();

      //   Preview_this_Results.forEach(({ SubModuleName, StartDate }) => {
      //     // Check if SubModuleName starts with "BestPractice"
      //     if (SubModuleName.startsWith(BestPractice)) {
      //       uniqueStartDates.add(StartDate); // Add StartDate to the Set
      //     }
      //   });

      //   return uniqueStartDates.size; // Return the count of unique StartDate
      // };

      // const count_Best_Practice_per_date = countUniqueStartDates(Preview_this_Results);

      // Count all entries except those where SubModuleName starts with "BestPractice"

      const countsMap = Preview_this_Results?.reduce(
        (acc, { SubModuleName, ModuleName }) => {
          // Ignore SubModuleName that starts with "bbbbbbbb"
          if (
            SubModuleName ||
            ModuleName
            //  && !SubModuleName.startsWith(BestPractice)
          ) {
            const key = SubModuleName || ModuleName;
            acc[key] = acc[key] ? acc[key] + 1 : 1;
          }
          return acc;
        },
        {}
      );

      console.log("countsMap", countsMap);

      // Convert the countsMap object to an array, sort it, and then format it
      const countsArray = Object.entries(countsMap)
        .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
        .map(([name, count]) => ({ [name]: count }));

      console.log("countsArray", countsArray);
      // setCounts([ ...countsArray,{"BP (Best Practice)": count_Best_Practice_per_date}]);

      setCounts(countsArray);

      const completed_InTime_Count =
        (Preview_this_Results || []).length > 0
          ? (Preview_this_Results || []).filter(
              (item) =>
                item?.Status === "Complete" && item?.TimeNote === "In Time"
            ).length
          : "NA";
      const completed_not_InTime_Count =
        (Preview_this_Results || []).length > 0
          ? (Preview_this_Results || []).filter(
              (item) =>
                item?.Status === "Complete" && item?.TimeNote != "In Time"
            ).length
          : "NA";

      const inProgress_InTime_Count =
        (Preview_this_Results || []).length > 0
          ? (Preview_this_Results || []).filter(
              (item) =>
                item?.Status === "In Progress" && item?.TimeNote === "In Time"
            ).length
          : "NA";
      const inProgress_not_InTime_Count =
        (Preview_this_Results || []).length > 0
          ? (Preview_this_Results || []).filter(
              (item) =>
                item?.Status === "in Progress" && item?.TimeNote != "In Time"
            ).length
          : "NA";

      const hunt_InTime_Count =
        (Preview_this_Results || []).length > 0
          ? (Preview_this_Results || []).filter(
              (item) =>
                item?.Status === "Hunting" && item?.TimeNote === "In Time"
            ).length
          : "NA";
      const hunt_not_InTime_Count =
        (Preview_this_Results || []).length > 0
          ? (Preview_this_Results || []).filter(
              (item) =>
                item?.Status === "Hunting" && item?.TimeNote != "In Time"
            ).length
          : "NA";
      const Failed_Count =
        (Preview_this_Results || []).length > 0
          ? (Preview_this_Results || []).filter(
              (item) => item?.Status === "Failed"
            ).length
          : "NA";

      console.log("Preview_this_Results", Preview_this_Results);
      console.log("inProgress_InTime_Count", inProgress_InTime_Count);
      console.log("inProgress_not_InTime_Count", inProgress_not_InTime_Count);

      set_Status_Legend({
        completed_InTime_Count: completed_InTime_Count,
        completed_not_InTime_Count: completed_not_InTime_Count,
        inProgress_InTime_Count: inProgress_InTime_Count,
        inProgress_not_InTime_Count: inProgress_not_InTime_Count,
        hunt_InTime_Count: hunt_InTime_Count,
        hunt_not_InTime_Count: hunt_not_InTime_Count,
        Failed_Count: Failed_Count,
      });
    };

    countOccurrences();
  }, [Preview_this_Results]);

  console.log("last_updated", last_updated);

  return (
    <>
      <div className="app-main">
        <div className="top-of-page">
          <div className="top-of-page-left mb-b">
            {/* <p  className="font-type-menu" >Dashboards:</p> */}
            <p className="font-type-h3">General</p>
          </div>
          <div className="top-of-page-center">
            {/* placeholder for dropDown */}
          </div>

          {/* <div className='top-of-page-right'>
<input className="input-type1 mr-a" placeholder="Search" />
<button className="btn-type1 "><IconSearch className="icon-type1" />  </button>
</div> */}
        </div>

        <div className="resource-group-top-boxes mb-c">
          <PreviewBox_type3_bar
            HeadLine="Results Summary"
            bar_numbers={counts?.map((item) => Object.values(item))}
            bar_headlines={counts?.map((item) => Object.keys(item))}
            // bar_numbers = {[ "11","22","41","5"]}
            // bar_headlines = {["URL","IP Address","User Name","Phone Number"]}
            bar_title_legend={"Count"}
            is_popup={false}
            display_y_axis={true}
            colors={"Basic"}
          />

          <PreviewBox_type1_number
            HeadLine="Active Hunts"
            resource_type_id={null}
            BigNumber={
              Preview_this_Results?.filter((item) => item?.Status == "Hunting")
                .length
                ? Preview_this_Results?.filter(
                    (item) => item?.Status == "Hunting"
                  ).length
                : 0
            }
            SmallNumber={
              Preview_this_Results?.length ? Preview_this_Results.length : 0
            }
            SmallNumberTxt={"Total"}
            StatusColor={"blue"}
            date={format_date_type_a(last_updated?.Velociraptor) || "NA"}
            filter_Resource={filter_Resource}
            set_filter_Resource={set_filter_Resource}
            txt_color={""}
          />

          <PreviewBox_type1_number
            HeadLine="Hunts Count"
            resource_type_id={null}
            BigNumber={
              Preview_this_Results?.length ? Preview_this_Results.length : 0
            }
            SmallNumber={
              Preview_this_Results?.length ? Preview_this_Results.length : 0
            }
            SmallNumberTxt={"Total"}
            StatusColor={"blue"}
            date={format_date_type_a(last_updated?.Total) || "NA"}
            filter_Resource={filter_Resource}
            set_filter_Resource={set_filter_Resource}
            txt_color={""}
          />

          <PreviewBox_type1_number
            HeadLine="Complete Hunts"
            resource_type_id={null}
            BigNumber={
              Preview_this_Results?.filter((item) => item?.Status == "Complete")
                .length
                ? Preview_this_Results?.filter(
                    (item) => item?.Status == "Complete"
                  ).length
                : 0
            }
            SmallNumber={
              Preview_this_Results?.length ? Preview_this_Results.length : 0
            }
            SmallNumberTxt={"Total"}
            StatusColor={"blue"}
            date={format_date_type_a(last_updated?.Complete) || "NA"}
            filter_Resource={filter_Resource}
            set_filter_Resource={set_filter_Resource}
            txt_color={""}
          />

          <PreviewBox_type4_legend2
            HeadLine="Status Legend"
            // Count_Failed={Preview_this_Results?.filter(item => item?.Status == "Failed").length? (Preview_this_Results?.filter(item => item?.Status == "Failed").length):(0) }
            Status_Legend={Status_Legend}
            // Count_Failed={Status_Legend?.Failed_Count === undefined ? "NA" : (Status_Legend?.Failed_Count) }

            // bar_numbers = {[ "11","22","41","5"]}
            // bar_headlines = {["URL","IP Address","User Name","Phone Number"]}
            bar_title_legend={"Count"}
          />
        </div>
        <div>
          {/* <p className='font-type-menu   Color-Grey1 mb-c'>Results Edit:</p> */}
        </div>
        <div className="resource-group-all-the-Lists">
          {/*  */}
          <Results_list
            Preview_this_Results={Preview_this_Results}
            set_Preview_this_Results={set_Preview_this_Results}
            filter_Resource={filter_Resource}
            set_filter_Resource={set_filter_Resource}
            loader={loader}
            set_loader={set_loader}
            get_all_Results={get_all_Results}
          />
        </div>
      </div>
    </>
  );
}

export default Results;
