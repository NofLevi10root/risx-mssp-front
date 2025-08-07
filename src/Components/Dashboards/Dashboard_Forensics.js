import React, { useState, useEffect, useContext } from "react";
import {
  // PreviewBox_type3_bar,
  // PreviewBox_type1_number_no_filters,
  // PreviewBox_type6_list_box,
  // PreviewBox_type2_pie,
  // PreviewBox_type7_wide_bar,
  // PreviewBox_respo_widebar_type7,
  PreviewBox_respo_list_type6,
  PreviewBox_respo_chart,
} from "../PreviewBoxes.js";

import axios from "axios";
import GeneralContext from "../../Context.js";
import { format_date_type_a } from "../Features/DateFormat.js";

function Dashboard_Forensics({
  show_SideBar,
  set_show_SideBar,
  set_visblePage,
}) {
  set_visblePage("dashboard-forensics");

  const { backEndURL } = useContext(GeneralContext);
  // const [filter_Resource, set_filter_Resource] = useState({type_ids:[],tool_ids:[]});
  const [display_data_type, set_display_data_type] = useState("");
  const [DashBoardData, setDashBoardData] = useState({});
  const [TimeOfHostCheck, setTimeOfHostCheck] = useState("N/A");

  const [forensics_list_no_tag, set_forensics_list_no_tag] = useState([]);
  const [forensics_list_tag, set_forensics_list_tag] = useState([]);

  const gap = getComputedStyle(document.documentElement).getPropertyValue(
    "--space-b"
  );
  const box_height = 800;
  const box_height_2of3 = box_height * (3 / 5);
  const box_height_1of3 = box_height * (2 / 5);

  const RemoveTimeSketchTag = async (x) => {
    try {
      console.log("RemoveTimeSketchTag ", x);
      const res = await axios.post(
        backEndURL + "/dashboard/UpdateTimeSketchTagsInConfig",
        { tagName: x }
      );
      console.log("Res RemoveTimeSketchTag ", res.data);
      GetData();
    } catch (error) {
      console.log("Error in RemoveTimeSketchTag : ", error);
    }
  };

  const ClearTimeSketchTag = async (x) => {
    try {
      console.log("ClearTimeSketchTag ", x);
      const res = await axios.get(
        backEndURL + "/dashboard/ClearTimeSketchTagsInConfig"
      );
      console.log("Res ClearTimeSketchTag ", res.data);
      GetData();
    } catch (error) {
      console.log("Error in ClearTimeSketchTag : ", error);
    }
  };

  const get_config = async () => {
    if (backEndURL === undefined) {
      return;
    }
    try {
      const res = await axios.get(`${backEndURL}/config`);
      if (res) {
        console.log("iiiiiiiiii", res.data);
      }

      setTimeOfHostCheck(
        res.data?.General?.IntervalConfigurations?.MispConfiguration
          ?.RecentHostTimeMispInHours
      );
    } catch (err) {
      console.log("errrrrrrrrrrrrrrrrrrrrr", err);
    }
  };
  async function GetData() {
    try {
      const res = await axios.get(backEndURL + "/dashboard/Forensics");
      console.log(
        "ssssssssssssaaaaaaaaaaaaaaaaaawwwwwwwwwwwwwwwwwwwwwwwwww",
        res.data
      );
      res?.data?.Velociraptor?.RecentHosts.forEach((x) => {
        console.log(
          "format_date_type_a(x.LastSeen)",
          format_date_type_a(x.LastSeen * 1000),
          "sssssssssssaaaaas",
          x.LastSeen
        );
        x.LastSeenNum = x.LastSeen
        x.LastSeen = format_date_type_a(x.LastSeen * 1000);
      });
      res?.data?.Velociraptor?.NewUsers.forEach((x) => {
        console.log(
          "format_date_type_a(x.FirstSeen)",
          format_date_type_a(x.FirstSeen),
          "FirstSeen",
          x.FirstSeen
        );
        x.FirstSeen = format_date_type_a(x.FirstSeen);
      });
      setDashBoardData(res.data);
    } catch (error) {
      console.log("Error in Get Data OF dashboard");
    }
  }

  // dont show sidebar in this page
  useEffect(() => {
    if (show_SideBar === false) {
      set_show_SideBar(true);
    }
  }, []);

  useEffect(() => {
    if (backEndURL) {
      get_config();
      GetData();
    }
  }, [backEndURL]);

  useEffect(() => {
    set_forensics_list_no_tag([
      {
        mainKey: "Overall Clients",
        module: "Velociraptor",
        mainValue:
          DashBoardData?.Velociraptor?.NumberOfClients !== undefined
            ? DashBoardData?.Velociraptor?.NumberOfClients
            : "NA",
      },
      {
        mainKey: "Connected Clients",
        module: "Velociraptor",
        mainValue:
          DashBoardData?.Velociraptor?.NumberOfConnectedClients !== undefined
            ? DashBoardData?.Velociraptor?.NumberOfConnectedClients
            : "NA",
      },
      {
        mainKey: "Completed Hunts",
        module: "Velociraptor",
        mainValue:
          DashBoardData?.Velociraptor?.FinishedHunts !== undefined
            ? DashBoardData.Velociraptor.FinishedHunts
            : "NA",
      },
      {
        mainKey: "Uncompleted Hunts",
        module: "Velociraptor",
        mainValue:
          DashBoardData?.Velociraptor?.UnfinishedHunts !== undefined
            ? DashBoardData?.Velociraptor?.UnfinishedHunts
            : "NA",
      },
      {
        mainKey: "Number of Sketches",
        module: "Timesketch",
        mainValue:
          DashBoardData?.TimeSketch?.number_of_sketches !== undefined
            ? DashBoardData?.TimeSketch?.number_of_sketches
            : "NA",
      },
    ]);

    const timeTags = [];
    for (const [key, value] of Object.entries(
      DashBoardData?.TimeSketch?.tag_counts ?? {}
    )) {
      timeTags.push({
        rawKey: key,
        mainKey: `Tag: ${key}`,
        module: "Timesketch",
        mainValue: value,
      });
    }
    set_forensics_list_tag(timeTags);
  }, [DashBoardData]);

  console.log("UnfinishedHunts", DashBoardData?.Velociraptor?.UnfinishedHunts);

  return (
    <>
      <div className="app-main">
        <div className="top-of-page">
          <div className="top-of-page-left mb-b">
            {/* <p className="font-type-menu">Dashboards:</p> */}
            <p className="font-type-h3">Forensics</p>
          </div>
          <div className="top-of-page-center">
            {/* placeholder for dropDown */}
          </div>
        </div>

        <div className="resource-group-top-boxes mb-c">
          <div className="PreviewBox-respo-container">
            {/* <PreviewBox_respo_chart 
display_type={'pie'}  // pie , bar
allow_wide={false}
display_y_axis={false} // for the bar
HeadLine={`Velociraptor Completed / Uncompleted Hunts`}
read_more_icon={''}
description_show={true}
description_short={'Streamlined logistics and inventory management for efficient distribution solutions...'}
description_max_length={79}
read_more={'The "Hunts Distribution" section outlines the status of threat-hunting queries or operations executed within Velociraptor. Completed hunts are those that have successfully finished their analysis, providing results and insights into potential threats or vulnerabilities. In contrast, uncompleted hunts are still in progress or have encountered issues that need resolution. By reviewing this distribution, security teams can assess the effectiveness and progress of their threat-hunting efforts, prioritize investigations based on urgency, and ensure that all potential threats are thoroughly examined and addressed.'}
bar_numbers={[
  DashBoardData?.Velociraptor?.FinishedHunts !== undefined &&
  DashBoardData?.Velociraptor?.FinishedHunts !== null
    ? DashBoardData?.Velociraptor?.FinishedHunts
    : "NA",
  DashBoardData?.Velociraptor?.UnfinishedHunts !== undefined &&
  DashBoardData?.Velociraptor?.UnfinishedHunts !== null
    ? DashBoardData?.Velociraptor?.UnfinishedHunts
    : "NA",
]}
bar_headlines={["Completed", "Uncompleted"]}
is_popup = {false}
enable_hover={false}
display_this_value={"prime_data"}
colors={"Basic"} // Basic , Alert
date={"Near Real-Time"} // "NA"
box_height={box_height}
/> */}
            <div className="PreviewBox_for_2_tools" style={{}}>
              <PreviewBox_respo_chart
                display_type={"pie"} // pie , bar
                allow_wide={false}
                display_y_axis={false} // for the bar
                HeadLine={`Velociraptor Connected Clients`}
                read_more_icon={""}
                description_show={true}
                description_short={
                  "Centralized hub for integrating client data and insights seamlessly..."
                }
                description_max_length={86}
                read_more={
                  "Report aggregates data on all clients that have established connections to the network, regardless of their status or activity level. This comprehensive view includes information on the total number of clients, connection patterns, and any associated metadata. Understanding this distribution helps in assessing the network’s overall exposure and usage trends. It also aids in identifying any unexpected spikes in connections or unusual client behavior, which could signal potential security issues. By analyzing this data, administrators can ensure proper client management and enhance their network’s security posture."
                }
                bar_numbers={[
                  DashBoardData?.Velociraptor?.NumberOfConnectedClients ?? "NA",
                  DashBoardData?.Velociraptor?.FinishedHunts !== undefined &&
                    DashBoardData?.Velociraptor?.FinishedHunts !== null &&
                    DashBoardData?.Velociraptor?.NumberOfClients !== undefined &&
                    DashBoardData?.Velociraptor?.NumberOfClients !== null
                    ? `${DashBoardData?.Velociraptor?.NumberOfClients -
                    DashBoardData?.Velociraptor?.NumberOfConnectedClients
                    }`
                    : "NA",
                ]}
                bar_headlines={["Connected", "UnConnected"]}
                enable_hover={false}
                display_this_value={"prime_data"}
                is_popup={false}
                colors={"Basic"} // Basic , Alert
                date={"Near Real-Time"} // "NA"
                box_height={box_height_2of3 - 50}
              />

              <PreviewBox_respo_list_type6
                HeadLine="Velociraptor list"
                read_more_icon={""}
                //  description_short={'Aggregates all data sourced from Velociraptor for analysis...'}
                description_max_length={74}
                read_more_view={true}
                read_more={
                  "provides a centralized view of all Velociraptor digital forensics and incident response operations, consolidating critical operational metrics and system status information in real-time."
                }
                list_array_column1={{ key: "mainKey", previewName: "Category" }}
                list_array_column2={{ key: "mainValue", previewName: "#" }}
                list_array={forensics_list_no_tag}
                is_popup={false}
                is_tags={false}
                click_on_field={true}
                date={"Near Real-Time"} // "NA"
                box_height={box_height_1of3 + 30}
              />
            </div>
            <div className="PreviewBox_for_2_tools" style={{}}>
              <PreviewBox_respo_list_type6
                read_more_icon={""}
                HeadLine={`Velociraptor New Hosts last ${TimeOfHostCheck} Hr`}
                //  description_short={'Tracks and lists hosts that were online in the past 24 hours...'}
                read_more_view={true}
                description_max_length={64}
                read_more={`This section in Velociraptor's dashboard provides a dynamic view of devices that have recently connected to the network within the past ${TimeOfHostCheck} hours. This metric is crucial for identifying and monitoring newly introduced systems, which could potentially be sources of security vulnerabilities or unauthorized access. By tracking these new hosts, administrators can ensure that all incoming devices are properly vetted and compliant with security policies. The real-time data allows for immediate action if any suspicious or unrecognized hosts are detected, thereby enhancing the organization's ability to respond to emerging threats swiftly and effectively.`}
                list_array_column1={{ key: "Hostname", previewName: "Name" }}
                list_array_column2={{ key: "FirstSeen", previewName: "Date" }}
                list_array={
                  DashBoardData?.Velociraptor?.NewUsers
                    ? DashBoardData?.Velociraptor?.NewUsers
                    : "NA"
                }
                is_popup={false}
                is_tags={false}
                click_on_field={false}
                date={"Near Real-Time"} // "NA"
                box_height={box_height_1of3 - 20}
              />

              <PreviewBox_respo_list_type6
                HeadLine={`Recent Online Hosts last ${TimeOfHostCheck} Hr`}
                read_more_icon={""}
                read_more_view={true}
                description_max_length={0}
                read_more={
                  "a list of all hosts that have been actively connected to the network over the past 24 hours. This information is vital for maintaining an up-to-date view of active devices and their activity patterns. By analyzing this data, security teams can monitor network usage, identify potential anomalies, and ensure that only authorized hosts are interacting with the system. This overview helps in detecting unauthorized access attempts or compromised devices early, allowing for prompt remediation actions to safeguard network integrity and prevent potential breaches."
                }
                list_array_column1={{ key: "Hostname", previewName: "Name" }}
                list_array_column2={{ key: "LastSeen", previewName: "Date" }}
                list_array={
                  DashBoardData?.Velociraptor?.RecentHosts
                    ? DashBoardData?.Velociraptor?.RecentHosts.filter(
                      (xxl) => {
                        return xxl.LastSeenNum * 1000 >
                          Date.now() - TimeOfHostCheck * 60 * 60 * 1000
                      }
                    )
                    : "NA"
                }
                is_popup={false}
                is_tags={false}
                click_on_field={false}
                date={"Near Real-Time"} // "NA"
                box_height={box_height_2of3}
              />
            </div>{" "}
            <PreviewBox_respo_list_type6
              HeadLine="Timeline Insights by Category"
              read_more_icon={""}
              description_max_length={74}
              read_more_view={true}
              read_more={
                'CTI all data from Velociraptor" consolidates all Cyber Threat Intelligence (CTI) data gathered from Velociraptor, providing a comprehensive repository of threat information. This aggregated data includes details on various cyber threats, vulnerabilities, and attack patterns collected by Velociraptors advanced monitoring tools. By centralizing this information, the feature enables security teams to analyze and correlate threat data more effectively, enhancing their ability to detect, respond to, and mitigate security risks. Access to complete and organized CTI data supports informed decision-making and strengthens overall cybersecurity posture..'
              }
              list_array_column1={{ key: "mainKey", previewName: "Category" }}
              list_array_column2={{ key: "mainValue", previewName: "#" }}
              list_array={forensics_list_tag}
              is_popup={false}
              is_tags={true}
              click_on_field={false}
              date={"Near Real-Time"} // "NA"
              box_height={box_height}
              removeBtn={true}
              removeBtnFunc={RemoveTimeSketchTag}
              clearBtnFunc={ClearTimeSketchTag}
            />
          </div>
        </div>
        <div></div>
        <div className="resource-group-all-the-Lists"></div>
      </div>
    </>
  );
}

export default Dashboard_Forensics;
