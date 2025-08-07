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
import { ReactComponent as IconBIG } from "../icons/ico-menu-alert.svg";
import ResourceGroup_Action_btns from "../ResourceGroup/ResourceGroup_Action_btns.jsx";
import { ReactComponent as Loader } from "../icons/loader_typea.svg";
import {
  PopUp_Alert_info,
  PopUp_All_Good,
  PopUp_Error,
} from "../PopUp_Smart.js";

function Alerts_main({ show_SideBar, set_show_SideBar, set_visblePage }) {
  set_visblePage("alerts");

  const { backEndURL } = useContext(GeneralContext);
  const [is_search, set_is_search] = useState(false);
  const [AlertsData, setAlertsData] = useState([]);
  const [ShowSubAlert, setShowSubAlert] = useState([]);
  const [TimeObject, setTimeObject] = useState({
    week: "",
    day: "newDateDay",
    hour: "newDateHour",
    lastAlert: "",
  });
  const [PieObjectStatus, setPieObjectStatus] = useState({
    New: 0,
    Unreviewed: 0,
    InProgress: 0,
    "False Positive": 0,
    "True Positive": 0,
    Ignore: 0,
    Closed: 0,
    Reopened: 0,
  });
  const [ArtifactDataPie, setArtifactDataPie] = useState({});
  const [IntervalUpdate, setIntervalUpdate] = useState({});
  const [Loading, SetLoading] = useState(false);
  const [RedDotKill, setRedDotKill] = useState(false);

  const [PopUp_All_Good__show, set_PopUp_All_Good__show] = useState(false);
  const [PopUp_All_Good__txt, set_PopUp_All_Good__txt] = useState({
    HeadLine: "Success",
    paragraph: "successfully",
    buttonTitle: "Close",
  });
  const [PopUp_Error____show, set_PopUp_Error____show] = useState(false);
  const [PopUp_Error____txt, set_PopUp_Error____txt] = useState({
    HeadLine: "",
    paragraph: "",
    buttonTitle: "",
  });
  const [PopUp_Alert_info__show, set_PopUp_Alert_info__show] = useState(false);
  const [PopUp_Alert_info__txt, set_PopUp_Alert_info__txt] = useState({});

  async function ClearAlertData() {
    try {
      console.log("ClearAlertData");
      const res = await axios.post(backEndURL + "/Alerts/ClearAlertDataChange");
      console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", res.data);
      GetData();
    } catch (error) {
      console.log("Error in ClearAlertData");
    }
  }

  async function GetData() {
    try {
      SetLoading(true);
      const res = await axios.get(backEndURL + "/Alerts/GetAlertFileData");
      console.log(
        "GetAlertFileData Data 111116666666666666666666666666666666666666666666666666666666666666666666661111111",
        res.data
      );

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
        Unreviewed: 0,
        InProgress: 0,
        "False Positive": 0,
        "True Positive": 0,
        Ignore: 0,
        Closed: 0,
        Reopened: 0,
      };
      const Artifact = {};

      console.log(
        "ArtifactArtifactArtifactArtifactArtifactArtifactArtifactArtifactArtifact",
        Artifact
      );
      console.log(
        AlertFileData,
        "AlertFileDataAlertFileDataAlertFileDataAlertFileDataAlertFileDataAlertFileDataAlertFileDataAlertFileDataAlertFileDataAlertFileData"
      );

      console.log("ItemItemItemItemItemItemItem", Item);
      setArtifactDataPie(res.data?.Artifact);
      setPieObjectStatus(res.data?.PieData);
      setAlertsData(AlertFileData);
      setTimeObject({
        week: newDateWeek,
        day: newDateDay,
        hour: newDateHour,
        lastAlert: AlertFileData?.[0]?.["_ts"],
      });
      SetLoading(false);
      return;
    } catch (error) {
      console.log("Error in Get Data OF alerts", error);
      set_PopUp_Error____show(true);
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: "Error in Retrieving The Alert Data",
        buttonTitle: "OK",
      });
      SetLoading(false);
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

  const UpdateAlertFileDataMany = async (arrId) => {
    try {
      const Info = {
        AlertIDs: arrId,
        User: "User",
      };
      console.log(Info, "ggghjkiuhbnm,klkiuyhgbnm,kloiuyhgvbnmkliu87y6trdcv");

      const res = await axios.post(
        backEndURL + "/Alerts/UpdateAlertFileDataMany",
        {
          Info,
        }
      );
      console.log("res Of UpdateAlertFileDataMany: ", res.data);
    } catch (error) {
      console.log("Error in UpdateAlertFileDataMany: ", error);
    }
  };

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
      {PopUp_Error____show && (
        <PopUp_Error
          popUp_show={PopUp_Error____show}
          set_popUp_show={set_PopUp_Error____show}
          HeadLine={PopUp_Error____txt.HeadLine}
          paragraph={PopUp_Error____txt.paragraph}
          buttonTitle={PopUp_Error____txt.buttonTitle}
        />
      )}
      {PopUp_Alert_info__show && (
        <PopUp_Alert_info
          popUp_show={PopUp_Alert_info__show}
          set_popUp_show={set_PopUp_Alert_info__show}
          Info={PopUp_Alert_info__txt}
          backEndURL={backEndURL}
          GetData={GetData}
          set_PopUp_All_Good__show={set_PopUp_All_Good__show}
          set_PopUp_All_Good__txt={set_PopUp_All_Good__txt}
          set_PopUp_Error____show={set_PopUp_Error____show}
          set_PopUp_Error____txt={set_PopUp_Error____txt}
        />
      )}
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
          <PreviewBox_type1_number_no_filters
            HeadLine="New Alerts Last Hour"
            resource_type_id={null}
            BigNumber={AlertsData?.reduce((acc, cur) => {
              if (!cur?.Show) {
                return acc;
              }
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
          />
          <PreviewBox_type1_number_no_filters
            HeadLine="New Alerts Today"
            resource_type_id={null}
            BigNumber={AlertsData?.reduce((acc, cur) => {
              if (!cur?.Show) {
                return acc;
              }
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
              if (!cur?.Show) {
                return acc;
              }
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
          {/* <PreviewBox_type2_pie
            HeadLine="Artifact Summary"
            bar_numbers={Object.values(ArtifactDataPie)?.map((x) => x?.Num)}
            bar_headlines={Object.keys(ArtifactDataPie)}
            bar_title_legend={["total"]}
            is_popup={false}
            colors={"Basic"} // Basic , Alert
          /> */}
        </div>

        <div></div>
        <div className="resource-group-list-headline mb-c ">
          <div className="resource-group-list-headline-left ">
            <IconBIG style={{ width: "55px" }} />{" "}
            <p
              className="font-type-h4   Color-White ml-a"
              style={{
                width: "100%",
                overflow: "hidden",
                whiteSpace: "nowrap",
                // textOverflow: "ellipsis",
                marginRight: "20px",
              }}
            >
              Alert list
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <div
              className="log-delete"
              onClick={ClearAlertData}
              style={{
                marginRight: 15,
                fontSize: 13,
              }}
            >
              Clear
            </div>{" "}
            <ResourceGroup_Action_btns
              items_for_search={AlertsData}
              set_items_for_search={setAlertsData}
              set_is_search={set_is_search}
              btn_add_single_show={false}
              // btn_add_single_action={add_resource_item}
              // btn_add_single_value={"add"}
              btn_add_many_show={false}
              // btn_add_many_action={}
            />
          </div>
        </div>
        <div
          className="resource-group-all-the-Lists "
          style={{ gap: 10, marginLeft: 20 }}
        >
          {/* <p  className="font-type-menu" >this page is under development</p>   */}

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingLeft: 10,
            }}
          >
            <div
              className="font-type-menu  make-underline Color-Grey1 "
              style={{ width: "23%", minWidth: 220 }}
            >
              Alert Type
            </div>
            <div
              className="font-type-menu  make-underline Color-Grey1 "
              style={{ width: "70%" }}
            >
              Description
            </div>
            <div
              className="font-type-menu  make-underline Color-Grey1 "
              style={{ width: 120, textAlign: "center" }}
            >
              Alert Count
            </div>
            <div
              className="font-type-menu  make-underline Color-Grey1 "
              style={{ width: 160 }}
            >
              Latest Alert{" "}
            </div>
          </div>
          {Loading && (
            //  <div style={{ color: "red", fontSize: 55 }}>Loading</div>
            <div className="  loader-type-a">
              <Loader />
            </div>
          )}
          {Object.keys(ArtifactDataPie)?.length <= 0 && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p className="font-type-h4   Color-Grey2 ml-a">
                No Active Alerts
              </p>
            </div>
          )}
          {!Loading &&
            Object.keys(ArtifactDataPie).map((x) => {
              console.log(x, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
              console.log(
                AlertsData.filter((y) => y.SimpleName == x),
                "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
                AlertsData
              );
              // if (!ArtifactDataPie[x]?.Show ?? false) {
              //   console.log("Dont Show", ArtifactDataPie[x]);
              //   return;
              // }
              return (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10,
                      paddingBottom: 10,
                      paddingTop: 10,
                      borderRadius: 15,
                      backgroundColor: "var(--color-Grey4)",
                      paddingLeft: 10,
                    }}
                    onClick={() => {
                      if (ShowSubAlert.includes(x)) {
                        setShowSubAlert(ShowSubAlert.filter((yy) => yy != x));
                      } else {
                        if (ArtifactDataPie[x]?.NewNum.length > 0) {
                          const sss = [...ArtifactDataPie[x].NewNum];
                          ArtifactDataPie[x].NewNum = [];
console.log("sss",sss);

                          UpdateAlertFileDataMany(sss);
                        }
                        setShowSubAlert([...ShowSubAlert, x]);
                      }
                    }}
                  >
                    {ArtifactDataPie[x]?.NewNum?.length > 0 ? (
                      <div
                        className={`Bg-Red  light-bulb-type2 `}
                        style={{ marginLeft: "-30px", marginRight: "14px" }}
                      />
                    ) : (
                      ""
                    )}
                    <div
                      className="font-type-txt  Color-Grey1 "
                      style={{ width: "23%", minWidth: 220 }}
                    >
                      {x}
                    </div>

                    <div
                      className="font-type-txt  Color-Grey1 "
                      style={{ width: "70%" }}
                    >
                      {ArtifactDataPie[x]?.Description}
                    </div>

                    <div
                      className="font-type-txt  Color-Grey1 "
                      style={{ width: 120, textAlign: "center" }}
                    >
                      {ArtifactDataPie[x]?.Num}
                    </div>
                    <div
                      className="font-type-txt  Color-Grey1 "
                      style={{ width: 160 }}
                    >
                      {format_date_type_a(ArtifactDataPie[x]?.LastDate)}
                    </div>
                  </div>
                  {ShowSubAlert.includes(x) && (
                    <Alert_list
                      CategoryAlertArr={AlertsData.filter(
                        (y) => y.SimpleName == x
                      )}
                      setCategoryAlertArr={setAlertsData}
                      GetData={GetData}
                      IntervalUpdate={IntervalUpdate}
                      setIntervalUpdate={setIntervalUpdate}
                      ArtifactDataPie={ArtifactDataPie}
                      AlertName={x}
                      set_PopUp_All_Good__show={set_PopUp_All_Good__show}
                      set_PopUp_All_Good__txt={set_PopUp_All_Good__txt}
                      set_PopUp_Error____show={set_PopUp_Error____show}
                      set_PopUp_Error____txt={set_PopUp_Error____txt}
                      PopUp_Alert_info__show={PopUp_Alert_info__show}
                      set_PopUp_Alert_info__show={set_PopUp_Alert_info__show}
                      PopUp_Alert_info__txt={PopUp_Alert_info__txt}
                      set_PopUp_Alert_info__txt={set_PopUp_Alert_info__txt}
                    />
                  )}
                </>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Alerts_main;
