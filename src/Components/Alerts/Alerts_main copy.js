import React, { useState, useEffect, useContext } from "react";
import {
  PreviewBox_type1_number_no_filters,
  PreviewBox_type3_bar,
  PreviewBox_type2_pie,
  PreviewBox_type8_time,
} from "../PreviewBoxes.js";
import {
  format_date_type_a,
  format_date_type_c,
  format_date_type_a_only_hours,
  format_date_type_a_only_date,
} from "../Features/DateFormat.js";
import axios from "axios";
import GeneralContext from "../../Context.js";
import Alert_list from "./Alerts_list.jsx";

function Alerts_main({ show_SideBar, set_show_SideBar, set_visblePage }) {
  set_visblePage("alerts");

  const { backEndURL } = useContext(GeneralContext);
  const [AlertsData, setAlertsData] = useState([]);
  const [TimeObject, setTimeObject] = useState({
    week: "",
    day: "newDateDay",
    hour: "newDateHour",
    lastAlert: "",
  });
  const [PieObjectStatus, setPieObjectStatus] = useState({
    New: 0,
    InProgress: 0,
    "False Positive": 0,
    "True Positive": 0,
    Ignore: 0,
    Closed: 0,
    Reopened: 0,
  });
  const [ArtifactDataPie, setArtifactDataPie] = useState({});
  const [IntervalUpdate, setIntervalUpdate] = useState({});

  async function GetData() {
    try {
      const res = await axios.get(backEndURL + "/Alerts/GetAlertFileData");
      console.log("GetAlertFileData Data 111111111111", res.data);

      const AlertFileData = res.data.Alerts;
      const AletDic = res.data.AletDic;

      // const TestDate = AlertFileData[1]["_ts"];
      const newDateWeek = new Date();
      const newDateDay = new Date().setUTCHours(0, 0, 0);
      const newDateHour = new Date();
      newDateWeek.setDate(newDateWeek.getDate() - 7);
      newDateHour.setHours(newDateHour.getHours() - 1);

      const Item = {
        New: 0,
        InProgress: 0,
        "False Positive": 0,
        "True Positive": 0,
        Ignore: 0,
        Closed: 0,
        Reopened: 0,
      };
      const Artifact = {};

      AlertFileData.forEach((x) => {
        Item[x?.UserInput?.Status]++;
        if (!Artifact[AletDic[x?.Artifact?.trim()]?.Name ?? x?.Artifact]) {
          Artifact[AletDic[x?.Artifact?.trim()]?.Name ?? x?.Artifact] = {};
          Artifact[AletDic[x?.Artifact?.trim()]?.Name ?? x?.Artifact].LastDate =
            x?._ts;
          Artifact[AletDic[x?.Artifact?.trim()]?.Name ?? x?.Artifact].Num = 0;
        }
        Artifact[AletDic[x?.Artifact?.trim()]?.Name ?? x?.Artifact].Num++;

        x.SimpleName = AletDic[x?.Artifact?.trim()]?.Name ?? x?.Artifact;
        x.Description = AletDic[x?.Artifact?.trim()]?.Description;
      });
      console.log(
        "ArtifactArtifactArtifactArtifactArtifactArtifactArtifactArtifactArtifact",
        Artifact
      );
      console.log(
        AlertFileData,
        "AlertFileDataAlertFileDataAlertFileDataAlertFileDataAlertFileDataAlertFileDataAlertFileDataAlertFileDataAlertFileDataAlertFileData"
      );

      console.log("ItemItemItemItemItemItemItem", Item);
      setArtifactDataPie(Artifact);
      setPieObjectStatus(Item);
      setAlertsData(AlertFileData);
      setTimeObject({
        week: newDateWeek,
        day: newDateDay,
        hour: newDateHour,
        lastAlert: AlertFileData?.[0]?.["_ts"],
      });
      return;
    } catch (error) {
      console.log("Error in Get Data OF alerts", error);
    }
  }

  useEffect(() => {
    let IntervalAlerts;
    if (backEndURL) {
      GetData();
      IntervalAlerts = setInterval(() => {
        console.log("inttttttttttttttttttt");
        const a = async () => {
          await GetData();
          setIntervalUpdate(true);
        };
        a();
      }, 1000 * 60);
    }
    return () => {
      console.log(IntervalAlerts, "enqkjnrkq");

      clearInterval(IntervalAlerts);
      console.log("asdasdasdasd");
    };
  }, [backEndURL]);

  const [display_this, set_display_this] = useState("");

  const dateA = new Date();
  console.log(dateA);
  // dont show sidebar in this page
  useEffect(() => {
    if (show_SideBar === false) {
      set_show_SideBar(true);
    }
  }, []);

  return (
    <>
      <div
        className="app-main"
        style={
          {
            // flexDirection:"row"
          }
        }
      >
        <div className="top-of-page">
          <div className="top-of-page-left mb-b">
            {/* <p  className="font-type-menu" >Dashboards:</p> */}
            <p className="font-type-h3">Alerts</p>
          </div>
          <div className="top-of-page-center">
            {/* placeholder for dropDown */}
          </div>
        </div>
        <div className="resource-group-top-boxes mb-c">
          <PreviewBox_type2_pie
            HeadLine="Alert Summary"
            bar_numbers={Object.values(PieObjectStatus)}
            bar_headlines={Object.keys(PieObjectStatus)}
            bar_title_legend={["total"]}
            is_popup={false}
            colors={"Basic"} // Basic , Alert
          />
          {/* <PreviewBox_type1_number_no_filters
            HeadLine="New Alerts Last Hour"
            resource_type_id={null}
            BigNumber={AlertsData?.reduce((acc, cur) => {
              if (cur?.["_ts"] > TimeObject?.hour) {
                return acc + 1;
              } else {
                return acc;
              }
            }, 0)} // BigNumber={Preview_this_Results?.length ? (Preview_this_Results.length):(0) }
            // SmallNumber={9}
            SmallNumberTxt={"Total"}
            StatusColor={"blue"}
            date={"NA"} // date={format_date_type_a(last_updated?.Total) || "NA"}
            is_popup={false}
            txt_color={""}
            display_this={display_this}
            set_display_this={set_display_this}
            display_this_value={""}
          /> */}
          <PreviewBox_type1_number_no_filters
            HeadLine="New Alerts Today"
            resource_type_id={null}
            BigNumber={AlertsData?.reduce((acc, cur) => {
              if (cur?.["_ts"] > TimeObject?.day) {
                return acc + 1;
              } else {
                return acc;
              }
            }, 0)} // BigNumber={Preview_this_Results?.length ? (Preview_this_Results.length):(0) }
            // SmallNumber={9}
            SmallNumberTxt={"Total"}
            StatusColor={"blue"}
            date={"NA"} // date={format_date_type_a(last_updated?.Total) || "NA"}
            is_popup={false}
            display_this={display_this}
            set_display_this={set_display_this}
            display_this_value={""}
            txt_color={""}
          />
          <PreviewBox_type1_number_no_filters
            HeadLine="New Alerts This Week"
            resource_type_id={null}
            BigNumber={AlertsData?.reduce((acc, cur) => {
              if (cur?.["_ts"] > TimeObject?.week) {
                return acc + 1;
              } else {
                return acc;
              }
            }, 0)} // BigNumber={Preview_this_Results?.length ? (Preview_this_Results.length):(0) }
            // SmallNumber={9}
            SmallNumberTxt={"Total"}
            StatusColor={"blue"}
            date={"NA"} // date={format_date_type_a(last_updated?.Total) || "NA"}
            is_popup={false}
            display_this={display_this}
            set_display_this={set_display_this}
            display_this_value={""}
            txt_color={""}
          />
          {/* <PreviewBox_type8_time
            HeadLine="Latest Alert"
            resource_type_id={null}
            BigNumber={format_date_type_a_only_hours(TimeObject?.lastAlert)} // BigNumber={Preview_this_Results?.length ? (Preview_this_Results.length):(0) }
            SmallNumber={format_date_type_a_only_date(TimeObject?.lastAlert)}
            StatusColor={"blue"}
            date={"NA"} // date={format_date_type_a(last_updated?.Total) || "NA"}
            is_popup={false}
            display_this={display_this}
            set_display_this={set_display_this}
            display_this_value={""}
            txt_color={""}
          />{" "} */}
          <PreviewBox_type2_pie
            HeadLine="Artifact Summary"
            bar_numbers={Object.values(ArtifactDataPie)?.map((x) => x?.Num)}
            bar_headlines={Object.keys(ArtifactDataPie)}
            bar_title_legend={["total"]}
            is_popup={false}
            colors={"Basic"} // Basic , Alert
          />
        </div>

        <div></div>
        <div className="resource-group-all-the-Lists">
          {/* <p  className="font-type-menu" >this page is under development</p>   */}

          <Alert_list
            Preview_this_Results={AlertsData}
            set_Preview_this_Results={setAlertsData}
            GetData={GetData}
            IntervalUpdate={IntervalUpdate}
            setIntervalUpdate={setIntervalUpdate}
          />
        </div>
      </div>
    </>
  );
}

export default Alerts_main;
