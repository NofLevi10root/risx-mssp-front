import React, { useState, useEffect, useContext } from "react";
import {
  PreviewBox_type1_number,
  PreviewBox_type2_pie,
  PreviewBox_respo_chart,
} from "../PreviewBoxes.js";
import ResourceGroup_All from "./ResourceGroup_All.jsx";
import { ReactComponent as IconSearch } from "../icons/ico-search.svg";
import axios from "axios";
import "./../ResourceGroup/ResourceGroup.css";

import GeneralContext from "../../Context.js";
import { format_date_type_a_only_date } from "../Features/DateFormat.js";
import { SingularToPlural } from "../Features/UsefulFunctions.js";
function ResourceGroup({ show_SideBar, set_show_SideBar, set_visblePage }) {
  set_visblePage("assets");

  const { backEndURL, all_Resource_Types } = useContext(GeneralContext);
  const [filter_Resource, set_filter_Resource] = useState({
    type_ids: [],
    tool_ids: [],
  });
  const time = new Date();
  const format_date = format_date_type_a_only_date(time);

  // dont show sidebar in this page
  useEffect(() => {
    if (show_SideBar === false) {
      set_show_SideBar(true);
    }
  }, []);

  // useEffect(() => {
  //     console.log(all_Resource_Types);
  //     const totalCount = all_Resource_Types.reduce((total, item) => total + item.count, 0);
  //       set_total_resource_count(totalCount);
  //        }, [all_Resource_Types   ]);

  return (
    <>
      <div className="app-main">
        <div className="top-of-page">
          <div className="top-of-page-left mb-b">
            {/* <p  className="font-type-menu" >Resource Group:</p> */}
            <p className="font-type-h3">Assets</p>
          </div>
          <div className="top-of-page-center">
            {/* placeholder for dropDown */}
          </div>
        </div>

        <div className="resource-group-top-boxes mb-c">
          {/* <PreviewBox_type2_pie
            HeadLine="Assets types"
            bar_numbers={
              all_Resource_Types && all_Resource_Types.length > 0
                ? all_Resource_Types.map((item) => item?.count)
                : []
            }
            bar_headlines={
              all_Resource_Types && all_Resource_Types.length > 0
                ? all_Resource_Types.map((item) =>
                    SingularToPlural(item?.preview_name)
                  )
                : []
            }
            bar_title_legend={["total"]}
            is_popup={false}
            colors={"Basic"} // Basic , Alert
            minWidth={"440px"}
          />

          <PreviewBox_type1_number
            // HeadLine={"Company Names"}
            HeadLine={
              all_Resource_Types && all_Resource_Types.length > 0
                ? SingularToPlural(
                    all_Resource_Types?.filter(
                      (item) => item?.resource_type_id == "2007"
                    )[0]?.preview_name
                  )
                : null
            }
            resource_type_id={"2007"}
            description_short={
              all_Resource_Types && all_Resource_Types.length > 0
                ? all_Resource_Types?.filter(
                    (item) => item?.resource_type_id == "2007"
                  )[0]?.description_short
                : null
            }
            BigNumber={
              all_Resource_Types && all_Resource_Types.length > 0
                ? all_Resource_Types?.filter(
                    (item) => item?.resource_type_id == "2007"
                  )[0]?.count
                : "NA"
            }
            SmallNumber={""}
            SmallNumberTxt={""}
            StatusColor={"blue"}
            date={format_date}
            filter_Resource={filter_Resource}
            set_filter_Resource={set_filter_Resource}
            txt_color={""}
          />

          <PreviewBox_type1_number
            // HeadLine={"Internal Endpoints"}
            HeadLine={
              all_Resource_Types && all_Resource_Types.length > 0
                ? SingularToPlural(
                    all_Resource_Types?.filter(
                      (item) => item?.resource_type_id == "2008"
                    )[0]?.preview_name
                  )
                : null
            }
            resource_type_id={"2008"}
            description_short={
              all_Resource_Types && all_Resource_Types.length > 0
                ? all_Resource_Types?.filter(
                    (item) => item?.resource_type_id == "2008"
                  )[0]?.description_short
                : null
            }
            BigNumber={
              all_Resource_Types && all_Resource_Types.length > 0
                ? all_Resource_Types?.filter(
                    (item) => item?.resource_type_id == "2008"
                  )[0]?.count
                : "NA"
            }
            SmallNumber={123}
            SmallNumberTxt={""}
            StatusColor={"blue"}
            date={format_date}
            filter_Resource={filter_Resource}
            set_filter_Resource={set_filter_Resource}
            txt_color={""}
          />

          <PreviewBox_type1_number
            // HeadLine={"Company Domains"}
            HeadLine={
              all_Resource_Types && all_Resource_Types.length > 0
                ? SingularToPlural(
                    all_Resource_Types?.filter(
                      (item) => item?.resource_type_id == "2001"
                    )[0]?.preview_name
                  )
                : null
            }
            resource_type_id={"2001"}
            description_short={
              all_Resource_Types && all_Resource_Types.length > 0
                ? all_Resource_Types?.filter(
                    (item) => item?.resource_type_id == "2001"
                  )[0]?.description_short
                : null
            }
            BigNumber={
              all_Resource_Types && all_Resource_Types.length > 0
                ? all_Resource_Types?.filter(
                    (item) => item?.resource_type_id == "2001"
                  )[0]?.count
                : "NA"
            }
            SmallNumber={123}
            SmallNumberTxt={""}
            StatusColor={"blue"}
            date={format_date}
            filter_Resource={filter_Resource}
            set_filter_Resource={set_filter_Resource}
            txt_color={""}
          /> */}

          {/* <PreviewBox_type1_number
// HeadLine={"High-Profile Employees Email Addresses"}
HeadLine={ (all_Resource_Types && all_Resource_Types.length > 0 ) ?  SingularToPlural(all_Resource_Types?.filter(item => item?.resource_type_id == "2006")[0]?.preview_name )  : null}
resource_type_id={"2006"}
description_short={ (all_Resource_Types && all_Resource_Types.length > 0 ) ?   all_Resource_Types?.filter(item => item?.resource_type_id == "2006")[0]?.description_short   : null}
BigNumber={ (all_Resource_Types && all_Resource_Types.length > 0 ) ?   all_Resource_Types?.filter(item => item?.resource_type_id == "2006")[0]?.count   : "NA"}

SmallNumber={123} 
SmallNumberTxt={""}
StatusColor={"blue"}
date={format_date}
filter_Resource={filter_Resource}
set_filter_Resource={set_filter_Resource}
txt_color={""}
/> */}
        </div>
        <div>
          {/* <p className='font-type-menu   Color-Grey1 mb-c'>Resource Edit:</p> */}
        </div>
        <div className="resource-group-all-the-Lists">
          <ResourceGroup_All
            //  Preview_this_Resource={Preview_this_Resource}
            //   set_Preview_this_Resource={set_Preview_this_Resource}
            filter_Resource={filter_Resource}
            set_filter_Resource={set_filter_Resource}
          />
        </div>
      </div>
    </>
  );
}

export default ResourceGroup;
