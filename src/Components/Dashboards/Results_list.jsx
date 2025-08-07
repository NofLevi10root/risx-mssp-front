import React, { useState, useContext, useEffect, useRef } from "react";

import { ReactComponent as IconBIG } from "../icons/ico-Results.svg";
import { ReactComponent as IconNasted } from "../icons/nasted.svg";
import { ReactComponent as Loader } from "../icons/loader_typea.svg";
import { ReactComponent as IconInfo } from "../icons/ico-info.svg";

import ResourceGroup_Action_btns from "../ResourceGroup/ResourceGroup_Action_btns.jsx";
import ResourceGroup_buttomLine from "../ResourceGroup/ResourceGroup_buttomLine.jsx";
import axios from "axios";
import GeneralContext from "../../Context.js";
import {
  format_date_type_a,
  format_date_type_c,
} from "../Features/DateFormat.js";
import {
  Make_url_from_id,
  fix_path,
} from "../../Components/Dashboards/functions_for_dashboards.js";
import "../StatusDisplay.css";
import {
  PopUp_All_Good,
  PopUp_Request_info,
  PopUp_loader,
  PopUp_Under_Construction,
  PopUp_Error,
  PopUp_Result_Line_info,
} from "../PopUp_Smart.js";

import {
  PopUp_For_velociraptor_response,
  PopUp_For__Nuclei__response,
  PopUp_For_Shodan_response,
  PopUp_For_LeakCheck_response,
} from "../PopUp_response_modules.js";
import LMloader from "../Features/LMloader.svg";
import "./Dashboard_Results_all.css";
function Results_list({
  Preview_this_Results,
  set_Preview_this_Results,
  loader,
  get_all_Results,
}) {
  const { backEndURL, all_Tools, front_IP, front_URL, mssp_config_json } =
    useContext(GeneralContext);

  const [checked_items, set_checked_items] = useState([]);
  const [is_search, set_is_search] = useState(false);
  const [isReset, set_isReset] = useState(false);

  const [
    PopUp_velociraptor_response__show,
    set_PopUp_velociraptor_response__show,
  ] = useState(false);

  const [PopUp_Yara_Ai_response__show, set_PopUp_Yara_Ai_response__show] =
    useState(false);

  const [PopUp_For_Shodan_response__show, set_PopUp_For_Shodan_response__show] =
    useState(false);
  const [
    PopUp_For__Nuclei__response__show,
    set_PopUp_For__Nuclei__response__show,
  ] = useState(false);
  const [
    PopUp_For_LeakCheck_response__show,
    set_PopUp_For_LeakCheck_response__show,
  ] = useState(false);

  const [UniqueID_to_expand, set_UniqueID_to_expand] = useState("");

  const [PopUp_Error__show, set_PopUp_Error__show] = useState(false);
  const [PopUp_Error__txt, set_PopUp_Error__txt] = useState({
    HeadLine: "Error",
    paragraph: "Error",
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

  const [PopUp_Under_Construction__show, set_PopUp_Under_Construction__show] =
    useState(false);
  const [PopUp_Under_Construction__txt, set_PopUp_Under_Construction__txt] =
    useState({
      HeadLine: "Coming Soon!",
      paragraph:
        "We are working on creating this section. Stay tuned for updates as we finalize the details.",
      buttonTitle: "Close",
    });

  const [PopUp_Result_Line_info__show, set_PopUp_Result_Line_info__show] =
    useState(false);
  const [PopUp_Result_Line_info__txt, set_PopUp_Result_Line_info__txt] =
    useState({});

  // const status_bar_width = "140px"
  const status_bar_width = "200px";

  const [json_file_info, set_json_file_info] = useState({});
  const [json_file_data, set_json_file_data] = useState({});
  const [PopUp_loader__show, set_PopUp_loader__show] = useState(false);
  const [sort_by, set_sort_by] = useState("StartDate");
  const [firstTimeData, setfirstTimeData] = useState(true); // usewith useeffect to now the first load and to sort

  const get_Json_single_response = async (Info) => {
    // console.log("get_Json_single_response", Info);
    try {
      if (Info?.ResponsePath === undefined) {
        console.log("Info?.ResponsePath", Info?.ResponsePath);
        return;
      }
      const params = { file_name: Info?.ResponsePath };

      set_PopUp_loader__show(true);
      const res = await axios.get(
        `${backEndURL}/results/velociraptor-single-result`,
        { params: params }
      );
      if (typeof res.data === "string") {
        set_PopUp_loader__show(false);
        if (res.data === "No data collected.") {
          console.log(res.data, Info);
          set_PopUp_loader__show(false);
          set_PopUp_Request_info__txt({
            HeadLine:
              Info?.Status === "Hunting"
                ? "No Data Collected yet"
                : Info?.Status === "Complete"
                ? "No Data Collected"
                : "No Data Collected",

            paragraph:
              Info?.Status === "Hunting"
                ? "The process is not complete keep Hunting.."
                : Info?.Status === "Complete"
                ? "the hunt is over, No data collected."
                : "No data collected.",

            buttonTitle: "Close",
          });
          set_PopUp_Request_info__show(true);
        } else {
          set_PopUp_Request_info__txt({
            HeadLine: "No results",
            paragraph: "Looks like no results file been created yet",
            buttonTitle: "Close",
          });
          set_PopUp_loader__show(false);
          set_PopUp_Request_info__show(true);
        }

        return;
      }

      if (res) {
        console.log("got res Info    ", Info);
        console.log("got res.data   ", res.data);

        switch (Info?.ModuleName) {
          case "Velociraptor":
            if (res?.data?.fileSize !== "Too big") {
              set_json_file_info(res.data);
            } else {
              set_json_file_info({
                huntid: Info.UniqueID,
                status: Info?.Status,
                fileSize: "Too big",
                mbSize: res.data?.mbSize,
                ResponsePath: Info?.ResponsePath,
                table: [],
              });
            }
            set_json_file_data(Info);
            set_PopUp_loader__show(false);
            set_PopUp_velociraptor_response__show(true);
            break;

          case "Nuclei":
            const nucleiTool = all_Tools?.find(
              (tool) => tool?.Tool_name === Info?.ModuleName
            );
            console.log("tool", nucleiTool);
            let updatedNucleiInfo = {
              ...Info,
              logoAddress_1: nucleiTool?.logoAddress_1,
            };
            console.log("updatedInfo", updatedNucleiInfo);
            set_json_file_data(updatedNucleiInfo);
            set_json_file_info(res.data);
            set_PopUp_loader__show(false);
            set_PopUp_For__Nuclei__response__show(true);
            break;
          case "Nuclei AI":
            const nucleiTool1 = all_Tools?.find(
              (tool) => tool?.Tool_name === Info?.ModuleName
            );
            console.log("tool", nucleiTool1);
            let updatedNucleiInfo1 = {
              ...Info,
              logoAddress_1: nucleiTool1?.logoAddress_1,
            };
            console.log("updatedInfo", updatedNucleiInfo1);
            set_json_file_data(updatedNucleiInfo1);
            set_json_file_info(res.data);
            set_PopUp_loader__show(false);
            set_PopUp_For__Nuclei__response__show(true);
            break;
          case "Shodan":
            if (res?.data?.fileSize !== "Too big") {
              console.log(
                "111111111111-----------------------  Shodan !== 'Too big  ",
                res.data
              );
              set_json_file_info(res.data);
            } else {
              console.log(
                "222222222222-----------------------  Shodan  'Too big  ",
                Info
              );
              set_json_file_info({
                huntid: Info.UniqueID,
                status: Info?.Status,
                fileSize: "Too big",
                mbSize: res.data?.mbSize,
                ResponsePath: Info?.ResponsePath,
                table: [],
                ModuleName: Info?.ModuleName,
                roni: "roni",
              });
            }

            const shodanTool = all_Tools?.find(
              (tool) => tool?.Tool_name === Info?.ModuleName
            );

            let updatedShodanInfo = {
              ...Info,
              logoAddress_1: shodanTool?.logoAddress_1,
            };

            set_json_file_data(updatedShodanInfo);
            // set_json_file_info(res.data);
            set_PopUp_loader__show(false);
            set_PopUp_For_Shodan_response__show(true);
            break;
          case "LeakCheck":
            if (res?.data?.fileSize !== "Too big") {
              console.log(" LeakChecK IN NOT Too big");
              set_json_file_info(res.data);
            } else {
              console.log("  LeakCheck  'Too big  ", Info);
              set_json_file_info({
                huntid: Info.UniqueID,
                status: Info?.Status,
                fileSize: "Too big",
                ResponsePath: Info?.ResponsePath,
                table: [],
                ModuleName: Info?.ModuleName,
              });
            }

            const LeakCheckTool = all_Tools?.find(
              (tool) => tool?.Tool_name === Info?.ModuleName
            );
            console.log("LeakCheckTool2", LeakCheckTool);

            let updatedLeakCheckInfo = {
              ...Info,
              logoAddress_1: LeakCheckTool?.logoAddress_1,
            };
            console.log("updatedLeakCheckInfo", updatedLeakCheckInfo);

            set_json_file_data(updatedLeakCheckInfo);
            set_PopUp_loader__show(false);
            set_PopUp_For_LeakCheck_response__show(true);
            break;

          case "Yara AI":
            set_json_file_info({
              huntid: Info.UniqueID,
              status: Info?.Status,
              fileSize: "Too big",
              mbSize: res.data?.mbSize,
              ResponsePath: Info?.ResponsePath,
              table: [],
            });

            set_json_file_data(Info);
            set_PopUp_loader__show(false);
            set_PopUp_velociraptor_response__show(true);
            set_PopUp_Yara_Ai_response__show(true);
            break;
          default:
            console.log("Unknown ModuleName:", Info?.ModuleName);
            break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickComingSoon = () => {
    set_PopUp_Under_Construction__txt({
      HeadLine: "Coming Soon!",
      paragraph: `We are working on creating this feature. Stay tuned for updates as we finalize the details.`,
      buttonTitle: "Close",
    });
    set_PopUp_Under_Construction__show(true);
  };

  const handleDelete = async () => {
    try {
      console.log("handleDelete 1111111111111", checked_items);
      // const res = await axios.delete(`${backEndURL}/results/delete-results-by-ids`,{ params: checked_items});
      const res = await axios.delete(
        `${backEndURL}/results/delete-results-by-ids`,
        {
          params: {
            checked_items: checked_items, // Key-value pairs in the query string
          },
        }
      );

      // const res = await axios.get(`${backEndURL}/results/get_all_requests_table`);

      if (res) {
        console.log("handleDelete ", res.data);
      }
    } catch (err) {
      console.log("handleDelete 33333333333333");
      console.log(err.response.data.message);
      console.log(err.response.data.catch_error_message);
      console.log(err.response.status);
      if (err.response.status === 400) {
        set_PopUp_Error__show(true);
        set_PopUp_Error__txt({
          HeadLine: "Error",
          paragraph: err?.response?.data?.message,
          buttonTitle: "Close",
        });
        return;
      } else {
        console.log("handleDelete error", err);
        set_PopUp_Error__show(true);
        set_PopUp_Error__txt({
          HeadLine: "Failed to Delete Items",
          paragraph: `We encountered an issue while trying to delete the requested items. Please check the details and try again. Tecnical: ${err.response.data.catch_error_message}`,
          buttonTitle: "Close",
        });
        return;
      }
    }
  };

  const handle_click_result = (Info) => {
    console.log("-------handle_click_result-------------", Info);

    if (Info.status == "Failed") {
      set_PopUp_Request_info__txt({
        HeadLine: "Failed",
        paragraph: "The process stopped for an unknown reason",
        buttonTitle: "Close",
      });
      set_PopUp_Request_info__show(true);
      return;
    }
    console.log(
      "Info?.ModuleName Info?.ModuleName Info?.ModuleName Info?.ModuleName ",
      Info?.ModuleName
    );

    switch (Info?.ModuleName) {
      case "Nuclei": ////////////////////////// Nuclei //////////////////////////
        if (Info.Status === "Failed") {
          set_PopUp_Request_info__txt({
            HeadLine: "Failed",
            paragraph: "process failed",
            buttonTitle: "Close",
          });
          set_PopUp_Request_info__show(true);
          return;
        } else if (
          Info.Status == null ||
          Info.Status == "" ||
          Info.Status == undefined
        ) {
          set_PopUp_Request_info__txt({
            HeadLine: "Status undefined",
            paragraph:
              "When the mission status will be clear, we can refer to the results",
            buttonTitle: "Close",
          });
          set_PopUp_Request_info__show(true);
          return;
        } else if (Info.Status == "In Progress") {
          set_PopUp_Request_info__txt({
            HeadLine: "In Progress",
            paragraph: "The progress is running, please wait for results",
            buttonTitle: "Close",
          });
          set_PopUp_Request_info__show(true);
          return;
        }

        if (Info.Status === "Complete") {
          get_Json_single_response(Info);
          return;
        } else {
          return;
        }
      case "Nuclei AI": ////////////////////////// Nuclei AI //////////////////////////
        if (Info.Status === "Failed") {
          set_PopUp_Request_info__txt({
            HeadLine: "Failed",
            paragraph: "process failed",
            buttonTitle: "Close",
          });
          set_PopUp_Request_info__show(true);
          return;
        } else if (
          Info.Status == null ||
          Info.Status == "" ||
          Info.Status == undefined
        ) {
          set_PopUp_Request_info__txt({
            HeadLine: "Status undefined",
            paragraph:
              "When the mission status will be clear, we can refer to the results",
            buttonTitle: "Close",
          });
          set_PopUp_Request_info__show(true);
          return;
        } else if (Info.Status == "In Progress") {
          set_PopUp_Request_info__txt({
            HeadLine: "In Progress",
            paragraph: "The progress is running, please wait for results",
            buttonTitle: "Close",
          });
          set_PopUp_Request_info__show(true);
          return;
        }

        if (Info.Status === "Complete") {
          get_Json_single_response(Info);
          return;
        } else {
          return;
        }
      case "Velociraptor": ////////////////////////// Velociraptor //////////////////////////
        if (
          Info.Status === "Failed" ||
          Info.Status == null ||
          Info.Status == "" ||
          Info.Status == undefined
        ) {
          set_PopUp_Request_info__txt({
            HeadLine: "Failed",
            paragraph: `Error Note: ", ${Info?.Error}`,
            buttonTitle: "Close",
          });
          set_PopUp_Request_info__show(true);
          return;
        } else if (Info.SubModuleName === "BestPractice") {
          console.log(" its a BestPractice!!");
          if (Info?.UniqueID === UniqueID_to_expand) {
            set_UniqueID_to_expand("");
          } else {
            set_UniqueID_to_expand(Info?.UniqueID);
          }
          return;
        } else {
          get_Json_single_response(Info);
          return;
        }

      case "TimeSketch": ////////////////////////// TimeSketch //////////////////////////
        if (all_Tools === undefined) {
          console.log("cant make TimeSketch, all_Tools is ", all_Tools);
          return;
        }
        if (all_Tools.length === 0) {
          console.log(
            "cant make TimeSketch, all_Tools.length is ",
            all_Tools.length
          );
          return;
        }
        const TimeSketch = all_Tools.filter(
          (item) => item?.tool_id === "2001002"
        );
        if (TimeSketch === undefined) {
          console.log(
            "cant make TimeSketch, all_Tools TimeSketch is",
            TimeSketch
          );
          return;
        }
        const link = TimeSketch[0]?.toolURL;
        if (link === undefined) {
          console.log("cant make TimeSketch link its", link);
          return;
        }

        console.log("all_Tools --------------- --- - - -", all_Tools);
        console.log("link --------------- --- - - -", link);

        const path = fix_path(link, front_IP, front_URL);

        if (path) {
          console.log("TimeSketch path: ", path);
          window.open(path, "_blank");
        } else {
          console.log("problem with TimeSketch path, it is:", path);
        }

        break;

      case "Shodan": ////////////////////////// Shodan //////////////////////////
        if (
          Info.Status === "Failed" ||
          Info.Status == null ||
          Info.Status == "" ||
          Info.Status == undefined
        ) {
          set_PopUp_Request_info__txt({
            HeadLine: "Failed",
            paragraph: `Error Note: ", ${Info?.Error}`,
            buttonTitle: "Close",
          });
          set_PopUp_Request_info__show(true);
          return;
        } else {
          get_Json_single_response(Info);
        }

        break;

      case "LeakCheck": ////////////////////////// LeakCheck //////////////////////////
        //  set_PopUp_Under_Construction__txt({
        //   HeadLine: "Coming Soon!",
        //   paragraph: `We are working on creating LeakCheck feature. Stay tuned for updates as we finalize the details.`,
        //   buttonTitle: "Close",
        // });
        // set_PopUp_Under_Construction__show(true);
        get_Json_single_response(Info);
        break;

      case "Yara AI": ////////////////////////// Yara AI //////////////////////////
        //  set_PopUp_Under_Construction__txt({
        //   HeadLine: "Coming Soon!",
        //   paragraph: `We are working on creating LeakCheck feature. Stay tuned for updates as we finalize the details.`,
        //   buttonTitle: "Close",
        // });
        // set_PopUp_Under_Construction__show(true);
        console.log(Info, "asdasdasdasdasdasdasd");

        get_Json_single_response(Info);
        break;

      case "Kape":
        console.log("Kape");
        const moduleLinks1 = Array.isArray(mssp_config_json?.moduleLinks)
          ? mssp_config_json.moduleLinks
          : [];
        const VeloURL = moduleLinks1.find(
          (link) => link.toolName === "Velociraptor"
        )?.toolURL;
        const fixed_path1 = fix_path(VeloURL, front_IP, front_URL);
        if (fixed_path1) {
          console.log("AI Vulnerability Management: ", fixed_path1);
          window.open(fixed_path1, "_blank");
        } else {
          console.log(
            "problem with AI Vulnerability Management path, it is:",
            fixed_path1
          );
        }
        break;

      case "AI Vulnerability Management":
        console.log("AI Vulnerability Management");
        const moduleLinks = Array.isArray(mssp_config_json?.moduleLinks)
          ? mssp_config_json.moduleLinks
          : [];
        const threatHuntingURL = moduleLinks.find(
          (link) => link.toolName === "AI vulnerability Dashboard"
        )?.toolURL;
        const fixed_path = fix_path(threatHuntingURL, front_IP, front_URL);
        if (fixed_path) {
          console.log("AI Vulnerability Management: ", fixed_path);
          window.open(fixed_path, "_blank");
        } else {
          console.log(
            "problem with AI Vulnerability Management path, it is:",
            fixed_path
          );
        }

        break;

      default:
        console.log("Unknown Mod ", Info);
    }
  };

  const timerRef = useRef(null);

  const handle_click_info = (info) => {
    set_PopUp_Result_Line_info__txt(info);
    set_PopUp_Result_Line_info__show(true);
  };

  const handle_hover_result = (info) => {
    set_PopUp_Result_Line_info__txt(info);
    set_PopUp_Result_Line_info__show(true);
  };

  const handle_Mouse_Enter = (info) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set a new timer
    timerRef.current = setTimeout(() => {
      handle_hover_result(info);
    }, 2000); //  2 seconds
  };

  const handle_Mouse_Leave = () => {
    // Clear the timer if hover ends before delay
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handle_check_box = (
    UniqueID,
    ResponsePath,
    ModuleName,
    SubModuleName
  ) => {
    if (!UniqueID) {
      console.log("handle_check_box error UniqueID is ", UniqueID);
      return;
    }
    if (!ResponsePath) {
      console.log("handle_check_box error ResponsePath is ", ResponsePath);
      return;
    }

    if (checked_items.length === 0) {
      console.log("checked_items is empty ");
      set_checked_items([
        {
          UniqueID: UniqueID,
          ResponsePath: ResponsePath,
          ModuleName: ModuleName,
          SubModuleName: SubModuleName,
        },
      ]);
    } else {
      console.log("not empty ");
      const position = checked_items.findIndex(
        (item) => item.UniqueID === UniqueID
      );
      console.log("position", position);

      if (position === -1) {
        // If the item is not found, add it to the checked_items array
        set_checked_items([
          ...checked_items,
          {
            UniqueID: UniqueID,
            ResponsePath: ResponsePath,
            ModuleName: ModuleName,
            SubModuleName: SubModuleName,
          },
        ]);
      } else {
        // If the item is found, remove it from the checked_items array
        const newCheckedItems = checked_items.filter(
          (item) => item.UniqueID !== UniqueID
        );
        set_checked_items(newCheckedItems);
      }
    }
  };

  const do_sort = (column) => {
    console.log("sort this column: ", column);

    if (!column) {
      console.log("Can't sort ", column);
      return;
    }
    //
    if (column == "ExpireDate" || column == "StartDate") {
      console.log("flip");

      if (column === sort_by) {
        console.log("It's already sorted like this, reversing the order");
        const sorted = [...Preview_this_Results].sort((a, b) => {
          if (b[column] == null) return -1;
          if (a[column] == null) return 1;
          const DateSplitA = a[column]?.split("-");
          const DateSplitB = b[column]?.split("-");
          const DateA = new Date(
            Date.UTC(
              DateSplitA[2],
              DateSplitA[1] - 1,
              DateSplitA[0],
              DateSplitA[3],
              DateSplitA[4]
            )
          );
          const DateB = new Date(
            Date.UTC(
              DateSplitB[2],
              DateSplitB[1] - 1,
              DateSplitB[0],
              DateSplitB[3],
              DateSplitB[4]
            )
          );

          if (DateB < DateA) return -1;
          if (DateB > DateA) return 1;
          return 0;
        });
        console.log("Sorted descending:", sorted);
        set_Preview_this_Results(sorted);
        set_sort_by(""); // Reset sort_by to allow toggling between asc and desc
      } else {
        set_sort_by(column);
        const sorted = [...Preview_this_Results].sort((a, b) => {
          if (b[column] == null) return 1;
          if (a[column] == null) return -1;
          const DateSplitA = a[column]?.split("-");
          const DateSplitB = b[column]?.split("-");
          const DateA = new Date(
            Date.UTC(
              DateSplitA[2],
              DateSplitA[1] - 1,
              DateSplitA[0],
              DateSplitA[3],
              DateSplitA[4]
            )
          );
          const DateB = new Date(
            Date.UTC(
              DateSplitB[2],
              DateSplitB[1] - 1,
              DateSplitB[0],
              DateSplitB[3],
              DateSplitB[4]
            )
          );

          if (DateA < DateB) return -1;
          if (DateA > DateB) return 1;
          return 0;
        });
        console.log("Sorted ascending:", sorted);
        set_Preview_this_Results(sorted);
      }
    } else {
      if (column === sort_by) {
        console.log("It's already sorted like this, reversing the order");
        const sorted = [...Preview_this_Results].sort((a, b) => {
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
    }
  };

  // for first load  =>  sorting the list
  useEffect(() => {
    if (Preview_this_Results?.length >= 2 && firstTimeData) {
      do_sort("StartDate");
      setfirstTimeData(false);
    }
  }, [Preview_this_Results]);

  async function ClearResultsData() {
    try {
      console.log("ClearResultsData");
      const res = await axios.post(
        backEndURL + "/dashboard/ClearResultsDataDashboard"
      );
      set_isReset(true);
      get_all_Results();
      console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", res.data);
    } catch (error) {
      console.log("Error in ClearResultsData");
    }
  }

  return (
    <div
      className="ResourceGroup-All"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {PopUp_loader__show && <PopUp_loader popUp_show={PopUp_loader__show} />}

      {PopUp_Result_Line_info__show && (
        <PopUp_Result_Line_info
          popUp_show={PopUp_Result_Line_info__show}
          set_popUp_show={set_PopUp_Result_Line_info__show}
          Info={PopUp_Result_Line_info__txt}
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

      {PopUp_For__Nuclei__response__show && (
        <PopUp_For__Nuclei__response
          popUp_show={PopUp_For__Nuclei__response__show}
          set_popUp_show={set_PopUp_For__Nuclei__response__show}
          HeadLine={"Response"}
          logoAddress_1_ForSrc={""}
          buttonTitle={"Close"}
          json_file_info={json_file_info}
          json_file_data={json_file_data}
          set_PopUp_All_Good__show={set_PopUp_All_Good__show}
          set_PopUp_All_Good__txt={set_PopUp_All_Good__txt}
          set_PopUp_Error__show={set_PopUp_Error__show}
          set_PopUp_Error__txt={set_PopUp_Error__txt}
        />
      )}

      {PopUp_velociraptor_response__show && (
        <PopUp_For_velociraptor_response
          popUp_show={PopUp_velociraptor_response__show}
          set_popUp_show={set_PopUp_velociraptor_response__show}
          HeadLine={"Response"}
          logoAddress_1_ForSrc={""}
          buttonTitle={"Close"}
          json_file_info={json_file_info}
          json_file_data={json_file_data}
          set_PopUp_All_Good__show={set_PopUp_All_Good__show}
          set_PopUp_All_Good__txt={set_PopUp_All_Good__txt}
          set_PopUp_Error__show={set_PopUp_Error__show}
          set_PopUp_Error__txt={set_PopUp_Error__txt}
        />
      )}

      {PopUp_For_Shodan_response__show && (
        <PopUp_For_Shodan_response
          popUp_show={PopUp_For_Shodan_response__show}
          set_popUp_show={set_PopUp_For_Shodan_response__show}
          HeadLine={"Response"}
          logoAddress_1_ForSrc={""}
          buttonTitle={"Close"}
          set_json_file_info={set_json_file_info}
          json_file_info={json_file_info}
          json_file_data={json_file_data}
          set_PopUp_All_Good__show={set_PopUp_All_Good__show}
          set_PopUp_All_Good__txt={set_PopUp_All_Good__txt}
          set_PopUp_Error__show={set_PopUp_Error__show}
          set_PopUp_Error__txt={set_PopUp_Error__txt}
        />
      )}

      {PopUp_For_LeakCheck_response__show && (
        <PopUp_For_LeakCheck_response
          popUp_show={PopUp_For_LeakCheck_response__show}
          set_popUp_show={set_PopUp_For_LeakCheck_response__show}
          HeadLine={"Response"}
          logoAddress_1_ForSrc={""}
          buttonTitle={"Close"}
          set_json_file_info={set_json_file_info}
          json_file_info={json_file_info}
          json_file_data={json_file_data}
          set_PopUp_All_Good__show={set_PopUp_All_Good__show}
          set_PopUp_All_Good__txt={set_PopUp_All_Good__txt}
          set_PopUp_Error__show={set_PopUp_Error__show}
          set_PopUp_Error__txt={set_PopUp_Error__txt}
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

      {PopUp_Error__show && (
        <PopUp_Error
          popUp_show={PopUp_Error__show}
          set_popUp_show={set_PopUp_Error__show}
          HeadLine={PopUp_Error__txt.HeadLine}
          paragraph={PopUp_Error__txt.paragraph}
          buttonTitle={PopUp_Error__txt.buttonTitle}
        />
      )}

      <div className="resource-group-list-headline mb-c ">
        <div className="resource-group-list-headline-left ">
          <IconBIG />{" "}
          <p className="font-type-h4   Color-White ml-b">Results list</p>
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
            onClick={ClearResultsData}
            style={{
              marginRight: 15,
              fontSize: 13,
            }}
          >
            Clear
          </div>{" "}
          <ResourceGroup_Action_btns
            items_for_search={Preview_this_Results}
            set_items_for_search={set_Preview_this_Results}
            set_is_search={set_is_search}
            is_search={is_search}
            btn_add_single_show={false}
            // btn_add_single_action={add_resource_item}
            // btn_add_single_value={"add"}
            btn_add_many_show={false}
            // btn_add_many_action={}
            isReset={isReset}
            set_isReset={set_isReset}
            btn_trash_show={true}
            btn_trash_action={handleDelete}
            btn_trash_id={"tmp"}
            btn_gear_show={true}
            btn_gear_action={handleClickComingSoon}
            btn_gear_id={""}
          />
        </div>
      </div>

      {loader ? (
        <>
          {/* /// its the loader when axios working */}
          <div className="  loader-type-a">
            <Loader />
            {/* <img  src={LMloader} className="" alt="Loading Resources"/> */}
          </div>
        </>
      ) : (
        <>
          {false && (
            <table style={{ textAlign: "left" }}>
              {/* <caption>
    Front-end web developer course 2021
  </caption> */}
              <thead style={{}}>
                {/* <div style={{width:"40px"}} />    */}
                <tr className="   ">
                  <th
                    scope="col"
                    className=""
                    onClick={() => do_sort("SubModuleName")}
                    style={{ paddingLeft: "34px" }}
                  >
                    <p className="font-type-menu  make-underline Color-Grey1">
                      Module + Artifact
                    </p>
                  </th>
                  <th
                    scope="col"
                    className=""
                    onClick={() => do_sort("StartDate")}
                  >
                    <p className="font-type-menu  make-underline Color-Grey1">
                      Start Date
                    </p>
                  </th>
                  <th
                    scope="col"
                    className=""
                    onClick={() => do_sort("ExpireDate")}
                  >
                    <p className="font-type-menu  make-underline Color-Grey1">
                      Expire Date
                    </p>
                  </th>
                  <th
                    scope="col"
                    className=""
                    onClick={() => do_sort("Status")}
                  >
                    <p className="font-type-menu  make-underline Color-Grey1">
                      Status
                    </p>
                  </th>
                  <th
                    scope="col"
                    className=""
                    style={{ width: status_bar_width, textAlign: "center" }}
                  >
                    <p className="font-type-menu  make-underline Color-Grey1">
                      Status Display
                    </p>
                  </th>
                </tr>
                {/* no-underline  */}
              </thead>

              <tbody className="  mb-c" style={{}}>
                {Array.isArray(Preview_this_Results) &&
                  Preview_this_Results?.map((Info, index) => (
                    <>
                      <div className="   ">
                        <label
                          className={`container   ${
                            Info?.UniqueID === "" &&
                            !Info?.UniqueID &&
                            "containeroff"
                          } `}
                        >
                          <input
                            type="checkbox"
                            disabled={!Info?.UniqueID} // Disable the checkbox if UniqueID is not present
                            value={""}
                            onChange={() =>
                              handle_check_box(
                                Info?.UniqueID,
                                Info?.ResponsePath,
                                Info?.ModuleName,
                                Info?.SubModuleName
                              )
                            }
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>

                      <tr
                        className=" list-general-line "
                        key={index}
                        onClick={() => handle_click_result(Info)}
                        onMouseEnter={() => handle_Mouse_Enter(Info)}
                        onMouseLeave={handle_Mouse_Leave}
                      >
                        <td
                          className="   display-flex  "
                          style={{ marginLeft: "30px" }}
                        >
                          {Info?.ModuleName === "" &&
                            Info?.SubModuleName === "" && (
                              <p className="ml-b   font-type-txt   Color-Red   ">
                                {" "}
                                Undefined{" "}
                              </p>
                            )}
                          {Info?.ModuleName && Info?.SubModuleName && (
                            <>
                              <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1">
                                Velociraptor
                              </p>
                              <p className="ml-a font-type-very-sml-txt   Color-Grey1  ">
                                +
                              </p>
                              <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1">
                                {Info?.SubModuleName}
                              </p>{" "}
                            </>
                          )}
                          {Info?.ModuleName && !Info?.SubModuleName && (
                            <>
                              <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1">
                                {Info?.ModuleName}
                              </p>
                            </>
                          )}
                        </td>

                        <td className="  font-type-txt  Color-Grey1    list-general-value">
                          {Info?.StartDate &&
                            format_date_type_c(Info?.StartDate)}
                        </td>
                        <td className="  font-type-txt  Color-Grey1   list-general-value">
                          {Info?.ExpireDate &&
                            format_date_type_c(Info?.StartDate)}
                        </td>
                        <td className="  font-type-txt  Color-Grey1   list-general-value">
                          {Info?.Status}
                        </td>
                        <td
                          className="status-bar-and-time  list-general-value"
                          style={{
                            width: status_bar_width,
                            justifyContent: "end",
                          }}
                        >
                          <div className="status-bar">
                            <div
                              className={`status-bar-fill ${Info?.Status}`}
                            />
                          </div>
                          <p
                            className={`font-type-txt   time-general  ${
                              Info?.TimeNote != "In Time"
                                ? "not-in-time"
                                : "in-time"
                            }  `}
                          >
                            {Info?.TimeNote === "In Time"
                              ? null
                              : Info?.TimeNote}
                          </p>
                        </td>
                      </tr>
                    </>
                  ))}
              </tbody>
              {/* <tfoot>
    <tr>
      <th scope="row" colspan="2">Average age</th>
      <td>33</td>
    </tr>
  </tfoot> */}
            </table>
          )}

          {true && (
            <>
              <div className="resource-group-list-keyNames mb-a">
                <div
                  className="resource-group-list-item list-item-biggest  "
                  style={{ marginLeft: "43px" }}
                  onClick={() => do_sort("SubModuleName")}
                >
                  {" "}
                  <p className="font-type-menu  make-underline Color-Grey1  pl-b  ">
                    Module + Artifact
                  </p>
                </div>
                <div
                  className="resource-group-list-item list-item-small"
                  onClick={() => do_sort("StartDate")}
                >
                  {" "}
                  <p className="font-type-menu  make-underline Color-Grey1">
                    Start Date
                  </p>
                </div>
                <div
                  className="resource-group-list-item list-item-small"
                  onClick={() => do_sort("ExpireDate")}
                >
                  {" "}
                  <p className="font-type-menu  make-underline Color-Grey1 ">
                    Expire Date
                  </p>
                </div>
                <div
                  className="resource-group-list-item list-item-small"
                  onClick={() => do_sort("Status")}
                >
                  {" "}
                  <p className="font-type-menu  make-underline Color-Grey1 ">
                    Status
                  </p>
                </div>
                <div
                  className="resource-group-list-item list-item-big  "
                  style={{ marginRight: "60px", width: status_bar_width }}
                >
                  <p className="font-type-menu  no-underline Color-Grey1  ">
                    Status Display
                  </p>
                </div>
              </div>

              <div className="resource-group-list-box mb-c">
                {Array.isArray(Preview_this_Results) &&
                  Preview_this_Results?.map((Info, index) => {
                    let SubModuleName = Info?.SubModuleName; // Get the SubModuleName

                    return (
                      <div>
                        {/* .......  all lists ........... */}

                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "var(--space-b)",
                            width: "100%",
                          }}
                        >
                          <div className="velociraptor-EndpointModules-checkbox  mr-b">
                            <label
                              className={`container   ${
                                Info?.UniqueID === "" &&
                                !Info?.UniqueID &&
                                "containeroff"
                              } `}
                              style={{ marginTop: "5px" }}
                            >
                              <input
                                type="checkbox"
                                disabled={!Info?.UniqueID} // Disable the checkbox if UniqueID is not present
                                value={""}
                                onChange={() =>
                                  handle_check_box(
                                    Info?.UniqueID,
                                    Info?.ResponsePath,
                                    Info?.ModuleName,
                                    Info?.SubModuleName
                                  )
                                }
                              />
                              <span className="checkmark"></span>
                            </label>
                          </div>

                          <div
                            className="resource-group-list-line"
                            key={index}
                            onClick={() => handle_click_result(Info)}
                          >
                            <div className="ml-a  resource-group-list-item display-flex  list-item-biggest">
                              {Info?.ModuleName === "" &&
                                SubModuleName === "" && (
                                  <p className="ml-b   font-type-txt   Color-Red   ">
                                    {" "}
                                    Undefined{" "}
                                  </p>
                                )}
                              {Info?.ModuleName && SubModuleName && (
                                <>
                                  <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1">
                                    Velociraptor
                                  </p>
                                  <p className="ml-a font-type-very-sml-txt   Color-Grey1  ">
                                    +
                                  </p>
                                  <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1">
                                    {SubModuleName}
                                  </p>{" "}
                                </>
                              )}
                              {Info?.ModuleName && !SubModuleName && (
                                <>
                                  <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1">
                                    {Info?.ModuleName}
                                  </p>
                                </>
                              )}
                            </div>
                            {/* <p className='resource-group-list-item  font-type-txt  Color-Grey1  list-item-big'>{ JSON.stringify(Info?.Arguments) }</p>  */}
                            <p className="resource-group-list-item  font-type-txt  Color-Grey1  list-item-small">
                              {Info?.StartDate &&
                                format_date_type_c(Info?.StartDate)}
                            </p>
                            {/* <p className='resource-group-list-item  font-type-txt  Color-Grey1  list-item-small'>{ Info?.StartDate &&  format_date_type_c(Info?.LastIntervalDate)}</p>  */}
                            <p className="resource-group-list-item  font-type-txt  Color-Grey1  list-item-small">
                              {Info?.ExpireDate &&
                                format_date_type_c(Info?.StartDate)}
                            </p>
                            <p className="resource-group-list-item  font-type-txt  Color-Grey1  list-item-small">
                              {Info?.Status}
                            </p>
                            <div
                              className="status-bar-and-time "
                              style={{ width: status_bar_width }}
                            >
                              {" "}
                              <div className="status-bar">
                                <div
                                  className={`status-bar-fill ${Info?.Status}`}
                                />
                              </div>
                              <div
                                className={`font-type-txt   time-general  ${
                                  Info?.TimeNote != "In Time"
                                    ? "not-in-time"
                                    : "in-time"
                                }  `}
                              >
                                {Info?.TimeNote === "In Time"
                                  ? null
                                  : Info?.TimeNote}
                              </div>
                            </div>
                          </div>

                          <div className="  mr-a" style={{}}>
                            {" "}
                            <button
                              className="btn-type1 "
                              onClick={() => handle_click_info(Info)}
                            >
                              <IconInfo className="icon-type1" />
                            </button>{" "}
                          </div>
                        </div>

                        {/* .......  nasted best practice ........... */}
                        {SubModuleName === "BestPractice" &&
                          UniqueID_to_expand === Info?.UniqueID && (
                            <>
                              {Info?.Arguments?.Modules?.map(
                                (SubModuleINFO, index) => {
                                  return (
                                    <div style={{ display: "flex" }}>
                                      <div
                                        className="ml-a "
                                        style={{
                                          marginTop: "5px",
                                          marginRight: "12px",
                                        }}
                                      >
                                        {" "}
                                        <IconNasted />
                                      </div>

                                      <div
                                        className="resource-group-list-line "
                                        key={index}
                                        onClick={() =>
                                          handle_click_result({
                                            ...SubModuleINFO,
                                            ModuleName: "Velociraptor",
                                            SubModulesCollection:
                                              Info?.SubModuleName,
                                          })
                                        }
                                      >
                                        <div className="ml-a  resource-group-list-item display-flex  list-item-biggest">
                                          <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1">
                                            {SubModuleINFO?.SubModuleName}
                                          </p>
                                        </div>

                                        {/* <p className='resource-group-list-item    font-type-txt   Color-Grey1  list-item-big'> </p>  */}
                                        {/* <p className='resource-group-list-item  font-type-txt  Color-Grey1  list-item-small'></p>  */}
                                        <p className="resource-group-list-item  font-type-txt  Color-Grey1  list-item-small"></p>
                                        <p className="resource-group-list-item  font-type-txt  Color-Grey1  list-item-small"></p>
                                        <p className="resource-group-list-item  font-type-txt  Color-Grey1  list-item-small">
                                          {SubModuleINFO?.Status}
                                        </p>
                                        <div
                                          className="status-bar-and-time "
                                          style={{ width: status_bar_width }}
                                        >
                                          <div className="status-bar">
                                            <div
                                              className={`status-bar-fill ${SubModuleINFO?.Status}`}
                                            />
                                          </div>
                                          <div
                                            className={`font-type-txt   time-general  ${
                                              SubModuleINFO?.TimeNote !=
                                              "In Time"
                                                ? "not-in-time"
                                                : "in-time"
                                            }  `}
                                          >
                                            {SubModuleINFO?.TimeNote ===
                                            "In Time"
                                              ? null
                                              : SubModuleINFO?.TimeNote}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="  mr-a ml-b" style={{}}>
                                        {" "}
                                        <button
                                          className="btn-type1 "
                                          onClick={() =>
                                            handle_click_info(Info)
                                          }
                                        >
                                          <IconInfo className="icon-type1" />
                                        </button>{" "}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </>
                          )}
                      </div>
                    );
                  })}
              </div>
            </>
          )}

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

export default Results_list;
