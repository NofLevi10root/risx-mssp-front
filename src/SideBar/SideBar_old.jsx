import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./SideBar.css";
import { ReactComponent as RisxMsspLogo } from "../Components/Logos/RisxMssp_logo_Standart.svg";
import { ReactComponent as IcoMonitor } from "../Components/icons/ico-menu-monitor.svg";
import { ReactComponent as IcoModules } from "../Components/icons/ico-menu-modules.svg";
import { ReactComponent as IcoLink } from "../Components/icons/ico-menu-link.svg";
import { ReactComponent as IcoIframe } from "../Components/icons/ico-menu-iframe.svg";
import { ReactComponent as IcoResults } from "../Components/icons/ico-menu-Results.svg";
import { ReactComponent as IcoResourceGroup } from "../Components/icons/ico-menu-Resource-Group.svg";
import { ReactComponent as IcoAccount } from "../Components/icons/ico-menu-account.svg";
import { ReactComponent as IcoSettings } from "../Components/icons/ico-settings.svg";
import { ReactComponent as IcoDownload } from "../Components/icons/ico-menu-download.svg";
import { ReactComponent as IcoACtive } from "../Components/icons/ico-menu-active.svg";
import { ReactComponent as IcoACtiveBlue } from "../Components/icons/ico-menu-active-blue.svg";
import { ReactComponent as IconUsers } from "../Components/icons/ico-menu-users.svg";
import { ReactComponent as IconAlert } from "../Components/icons/ico-menu-alert.svg";

import {
  PopUp_Error,
  PopUp_All_Good,
  PopUp_Under_Construction,
} from "../Components/PopUp_Smart";

import GeneralContext from "../Context";
import axios from "axios";
import { Make_url_from_id } from "../Components/Dashboards/functions_for_dashboards";
import DownloadProgressBarItem from "./DownloadProgressBarItem";

function SideBar({
  visblePage,
  set_visblePage,
  unseen_alert_number,
  set_unseen_alert_number,
  isMainProcessWork,
  set_isMainProcessWork,
}) {
  // const [isHovered, setIsHovered] = useState(false);
  // const [unseen_alert_number, set_unseen_alert_number] = useState(0)
  // const [openSubMenu, set_openSubMenu] = useState("none")
  const navigate = useNavigate();
  const [user_name, set_user_name] = useState("user");
  const {
    backEndURL,
    user_id,
    moduleLinks,
    front_IP,
    front_URL,
    mssp_config_json,
    DownloadProgressBar,
    setDownloadProgressBar,
    DownloadList,
    setDownloadList,
  } = useContext(GeneralContext);

  const [PopUp_Error____show, set_PopUp_Error____show] = useState(false);
  const [PopUp_Error____txt, set_PopUp_Error____txt] = useState({
    HeadLine: "",
    paragraph: "",
    buttonTitle: "",
  });

  const [PopUp_All_Good__show, set_PopUp_All_Good__show] = useState(false);
  const [PopUp_All_Good__txt, set_PopUp_All_Good__txt] = useState({
    HeadLine: "Success",
    paragraph: "successfully",
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

  const [download_drop_down, set_download_drop_down] = useState(false);
  const [Dashboards_drop_down, set_Dashboards_drop_down] = useState(false);

  const [object, setObject] = useState({});

  const get_config = async () => {
    if (backEndURL === undefined) {
      return;
    }
    try {
      const res = await axios.get(`${backEndURL}/config`);

      if (res) {
        console.log("get_config", res.data);
      }
      setObject(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (backEndURL) {
      get_config();
    }
  }, [backEndURL]);

  const handleClick = (page_name) => {
    set_visblePage(page_name);
    localStorage.setItem("visiblePage", page_name); // Store current page in localStorage
    navigate(`/${page_name.toLowerCase()}`); // This navigates to the path specified by page_name\
  };

  const handleNewWindow = (dashboard_name) => {
    const url = Make_url_from_id(dashboard_name, moduleLinks, front_IP);
    console.log("handleNewWindow url - ", url);

    if (url) {
      window.open(url, "_blank");
    }
  };

  const handle_Dashboards_drop_down = () => {
    set_Dashboards_drop_down(!Dashboards_drop_down);
  };

  const handle_download_drop_down = () => {
    set_download_drop_down(!download_drop_down);
  };

  const handleDownload = async (os) => {
    console.log("os", os);
    // window.open(object?.General?.AgentLinks[os]);
    try {
      set_PopUp_All_Good__txt({
        HeadLine: `Download ${os} Agent Start`,
        paragraph:
          "This download can take a few minutes. The file will appear in your download folder once the process is complete.",
        buttonTitle: "Close",
      });
      // set_PopUp_All_Good__show(true);
      const fileName = object?.General?.AgentLinks[os]?.split("/")?.pop();
      const fileName2 =
        object?.General?.AgentLinks[os]?.split("/")?.pop() + Math.random();

      const res = await axios.post(
        `${backEndURL}/config/DownloadAgent`,
        {
          PathOs: object?.General?.AgentLinks[os],
        },
        {
          responseType: "blob",
          onDownloadProgress: (prog) => {
            const value = Math.round((prog.loaded / prog.total ?? 1) * 100);
            if (!DownloadProgressBar[fileName2]) {
              console.log("empty");
              // const copy = DownloadList.map((x) => x);
              // copy.push(fileName);
              // console.log(
              //   "DownloadListDownloadListDownloadListDownloadListDownloadListDownloadListDownloadListDownloadListDownloadList",
              //   DownloadList
              // );
              // setDownloadList(copy);
              DownloadProgressBar[fileName2] = {
                progress: value,
                fileName: fileName,
              };
            }

            if (
              DownloadProgressBar[fileName2].progress + 5 < value ||
              (value >= 100 && DownloadProgressBar[fileName2].progress != 100)
            ) {
              console.log("Download Prog ", value, DownloadProgressBar);
              DownloadProgressBar[fileName2] = {
                progress: value,
                fileName: fileName,
              };
              setDownloadProgressBar(DownloadProgressBar);
              setDownloadList(Math.random());
            }
          },
        }
      );

      if (res) {
        // console.log("ssssssssssssssssssssssss", fileName);
        const url = window.URL.createObjectURL(res.data);
        console.log(url);

        // window.open(url)
        // console.log(fileName, "zzzzzzzzzzzzzzzzzzzzzzzzzzzz");
        var link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handle_click_user = async () => {
    set_PopUp_Error____txt({
      HeadLine: "Work in Progress..",
      paragraph:
        "Final touches underway; anticipate completion shortly. Stay tuned for updates.",
      buttonTitle: "Close",
    });
    set_PopUp_Error____show(true);
  };

  const handle_active_manual_process = async () => {
    console.log("handle_active_manual_process");
    try {
      const res = await axios.get(
        `${backEndURL}/process/active-manual-process`,
        { params: { param1: "param1value" } }
      );

      if (res.data) {
        console.log("handle_active_manual_process - data", res?.data);
        console.log("handle_active_manual_process - status", res?.status);
        // console.log("handle_active_manual_process - message", res?.data?.message);
        // console.log("handle_active_manual_process - success", res?.data?.success);

        if (res?.data?.success === true) {
          console.log(
            "A Manual Process has Started to run",
            "message;",
            res?.data?.message
          );
          set_PopUp_All_Good__txt({
            HeadLine: "Activated",
            paragraph: "A Manual Process has Started to run",
            // paragraph: res?.data?.message,
            buttonTitle: "Close",
          });
          set_PopUp_All_Good__show(true);
        } else {
          set_PopUp_Error____txt({
            HeadLine: "Error",
            paragraph: `${res?.data?.message}`,
            buttonTitle: "Close",
          });
          set_PopUp_Error____show(true);
        }
      }
    } catch (err) {
      set_PopUp_Error____txt({
        HeadLine: "Error",
        paragraph: `${err?.response?.data?.message}`,
        buttonTitle: "Close",
      });
      set_PopUp_Error____show(true);

      // The Manual process could not be started. Error Message:
      console.log(
        "catch handle_active_manual_process - data",
        err?.response?.data
      );
      // console.log("catch handle_active_manual_process - error", err?.response?.data?.error);
      // console.log("catch handle_active_manual_process - message", err?.response?.data?.message);
      // console.log("catch handle_active_manual_process - success", err?.response?.data?.success);
      console.log(err);
    }
  };

  useEffect(() => {
    const name = localStorage.getItem("username");

    if (name) {
      set_user_name(name);
    } else {
      console.log("No username found in local storage.");
    }
  }, []);

  const handleClickComingSoon = (page_name) => {
    set_PopUp_Under_Construction__txt({
      HeadLine: "Coming Soon!",
      paragraph: `We are working on creating the ${page_name} section. Stay tuned for updates as we finalize the details.`,
      buttonTitle: "Close",
    });
    set_PopUp_Under_Construction__show(true);
  };

  return (
    <div className="side-bar-desktop-out">
      {PopUp_Under_Construction__show && (
        <PopUp_Under_Construction
          popUp_show={PopUp_Under_Construction__show}
          set_popUp_show={set_PopUp_Under_Construction__show}
          HeadLine={PopUp_Under_Construction__txt.HeadLine}
          paragraph={PopUp_Under_Construction__txt.paragraph}
          buttonTitle={PopUp_Under_Construction__txt.buttonTitle}
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

      {PopUp_Error____show && (
        <PopUp_Error
          popUp_show={PopUp_Error____show}
          set_popUp_show={set_PopUp_Error____show}
          HeadLine={PopUp_Error____txt.HeadLine}
          paragraph={PopUp_Error____txt.paragraph}
          buttonTitle={PopUp_Error____txt.buttonTitle}
        />
      )}

      <RisxMsspLogo className="mt-c mb-b" />

      <button className="btn-menu  " onClick={handle_click_user}>
        <div className="display-flex">
          <IcoAccount className="btn-menu-icon-placeholder  mr-a " />
          <p className="font-type-menu ">{user_name}</p>
          {/* <span className='notification'><p className='font-type-very-sml-txt'>2</p></span> */}
        </div>
        <div className="btn-menu-icon-placeholder  ">
          {" "}
          {/*  <MenuArrowDown  />*/}
        </div>
      </button>

      <div
        className="Bg-Grey2"
        style={{ width: "100%", height: "2px", borderRadius: "5px" }}
      />

      <div className="btn-menu-list  ">
        {/* ..........Dashboards.......srart.... */}

        <div
          className="btn-menu-list"
          // onMouseLeave={() => set_Dashboards_drop_down(false)}
          //  onMouseEnter={()=>set_download_drop_down(true)}
        >
          <button
            className={`btn-menu  ${
              Dashboards_drop_down || visblePage.startsWith("dashboard")
                ? "btn_look_hover"
                : ""
            } `}
            onClick={handle_Dashboards_drop_down}
          >
            <div className="display-flex">
              <IcoMonitor className="btn-menu-icon-placeholder  mr-a " />

              <p className="font-type-menu ">
                Dashboards{visblePage.startsWith("dashboard") && ":"}
              </p>

              {visblePage.startsWith("dashboard") && (
                <p
                  className="ml-a font-type-very-sml-txt"
                  style={{ textAlign: "left" }}
                >
                  {visblePage
                    .replace("dashboard-", "")
                    .split("-")
                    .map((word, index) => {
                      if (index === 0 && word.length === 3) {
                        return word?.toUpperCase();
                      }
                      return word
                        .split(" ")
                        .map(
                          (subWord) =>
                            subWord?.charAt(0)?.toUpperCase() +
                            subWord?.slice(1)
                        )
                        .join(" ");
                    })
                    .join(" ")}
                </p>
              )}
            </div>
            <div className="btn-menu-icon-placeholder  ">
              {" "}
              {/*  <MenuArrowDown  />*/}
            </div>
          </button>

          <div
            className={`dropdown-menu ${Dashboards_drop_down ? "open" : ""} `}
          >
            <button
              className="btn-menu"
              onClick={() => handleClick("dashboard-general")}
              disabled={visblePage === "dashboard-general"}
            >
              <div className="display-flex">
                <IcoDownload
                  className="btn-menu-icon-placeholder  mr-a "
                  style={{ visibility: "hidden" }}
                />
                <p className="font-type-menu ">General</p>
              </div>
              <div
                className="btn-menu-icon-placeholder"
                style={{ scale: "0.95" }}
              >
                {" "}
                <IcoResults />
              </div>
            </button>

            <button
              className="btn-menu"
              onClick={() => handleClick("dashboard-forensics")}
              disabled={visblePage === "dashboard-forensics"}
            >
              <div className="display-flex">
                <IcoDownload
                  className="btn-menu-icon-placeholder  mr-a "
                  style={{ visibility: "hidden" }}
                />
                <p className="font-type-menu ">Forensics</p>
              </div>
              <div
                className="btn-menu-icon-placeholder"
                style={{ scale: "0.95" }}
              >
                <IcoResults />
              </div>
            </button>

            <button
              className="btn-menu"
              onClick={() => handleClick("dashboard-threat-hunting")}
              disabled={visblePage === "dashboard-threat-hunting"}
            >
              <div className="display-flex">
                <IcoDownload
                  className="btn-menu-icon-placeholder  mr-a "
                  style={{ visibility: "hidden" }}
                />
                <p className="font-type-menu ">Threat Hunting</p>
              </div>
              <div
                className="btn-menu-icon-placeholder"
                style={{ scale: "0.95" }}
              >
                <IcoResults />
              </div>
            </button>

            <button
              className="btn-menu"
              onClick={() => handleClick("dashboard-cti")}
              disabled={visblePage === "dashboard-cti"}
            >
              <div className="display-flex">
                <IcoDownload
                  className="btn-menu-icon-placeholder  mr-a "
                  style={{ visibility: "hidden" }}
                />
                <p className="font-type-menu ">CTI</p>
              </div>
              <div
                className="btn-menu-icon-placeholder"
                style={{ scale: "0.95" }}
              >
                <IcoResults />
              </div>
            </button>
            {/* Cyber Threat Intelligence
        ASM     Attack Surface Management */}
            <button
              className="btn-menu"
              onClick={() => handleClick("dashboard-asm")}
              disabled={visblePage === "dashboard-asm"}
            >
              <div className="display-flex">
                <IcoDownload
                  className="btn-menu-icon-placeholder  mr-a "
                  style={{ visibility: "hidden" }}
                />
                <p className="font-type-menu ">ASM</p>
              </div>
              <div
                className="btn-menu-icon-placeholder"
                style={{ scale: "0.95" }}
              >
                <IcoResults />
              </div>
            </button>

            {/* <div
              className="Bg-Grey2"
              style={{
                width: "90%",
                height: "2px",
                borderRadius: "5px",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "5px",
                marginBottom: "5px",
              }}
            /> */}

            <button
              className="btn-menu"
              // onClick={() => handleClick("dashboard-risx")}
              onClick={() => handleNewWindow("2001000")}
              disabled={visblePage === "dashboard-risx"}
            >
              <div className="display-flex">
                <IcoDownload
                  className="btn-menu-icon-placeholder  mr-a "
                  style={{ visibility: "hidden" }}
                />
                <p className="font-type-menu ">Active Directory</p>
              </div>
              <div
                className="btn-menu-icon-placeholder"
                style={{ scale: "0.95" }}
              >
                {" "}
                <IcoLink />
              </div>
            </button>

            {/* <button

              className="btn-menu"
              onClick={() => handleNewWindow("dashboard-timesketch")}
              // onClick={() => handleClick("dashboard-timesketch")}
              disabled={visblePage === "dashboard-timesketch"}
            >
              <div className="display-flex">
                <IcoDownload
                  className="btn-menu-icon-placeholder  mr-a "
                  style={{ visibility: "hidden" }}
                />
                <p className="font-type-menu ">Timesketch</p>
              </div>
              <div
                className="btn-menu-icon-placeholder"
                style={{ scale: "0.95" }}
              >
                {" "}
                <IcoLink />
              </div>
            </button> */}

            {/* <button
              className="btn-menu"
              onClick={() => handleNewWindow("dashboard-misp")}
              // disabled={visblePage === "dashboard-misp"}
            >
              <div className="display-flex">
                <IcoDownload
                  className="btn-menu-icon-placeholder  mr-a "
                  style={{ visibility: "hidden" }}
                />
                <p className="font-type-menu ">Misp</p>
              </div>
              <div
                className="btn-menu-icon-placeholder"
                style={{ scale: "0.95" }}
              >
                {" "}
                <IcoLink />
              </div>
            </button> */}

            {/* <button
              className="btn-menu"
              onClick={() => handleNewWindow("dashboard-cti")}
              // disabled={visblePage === "dashboard-cti"}
            >
              <div className="display-flex">
                <IcoDownload
                  className="btn-menu-icon-placeholder  mr-a "
                  style={{ visibility: "hidden" }}
                />
                <p className="font-type-menu ">CTI</p>
              </div>
              <div
                className="btn-menu-icon-placeholder"
                style={{ scale: "0.95" }}
              >
                {" "}
                <IcoLink />
              </div>
            </button> */}

            {/* <button
              className="btn-menu"
              onClick={() => handleNewWindow("dashboard-iris")}
              // disabled={visblePage === "dashboard-iris"}
            >
              <div className="display-flex">
                <IcoDownload
                  className="btn-menu-icon-placeholder  mr-a "
                  style={{ visibility: "hidden" }}
                />
                <p className="font-type-menu ">IRIS</p>
              </div>
              <div
                className="btn-menu-icon-placeholder"
                style={{ scale: "0.95" }}
              >
                {" "}
                <IcoLink />
              </div>
            </button> */}
          </div>
        </div>

        {/* ..........Dashboards..........end. */}

        <button
          className="btn-menu  "
          onClick={() => handleClick("Modules")}
          disabled={visblePage === "Modules"}
        >
          <div className="display-flex">
            <IcoModules className="btn-menu-icon-placeholder  mr-a " />
            <p className="font-type-menu ">Modules</p>
          </div>
          <div className="btn-menu-icon-placeholder  ">
            {" "}
            {/*  <MenuArrowDown  />*/}
          </div>
        </button>

        <button
          className="btn-menu  "
          onClick={() => handleClick("assets")}
          disabled={visblePage === "assets"}
        >
          <div className="display-flex">
            <IcoResourceGroup className="btn-menu-icon-placeholder  mr-a " />
            <p className="font-type-menu ">Assets</p>
          </div>
          <div className="btn-menu-icon-placeholder  ">
            {" "}
            {/*  <MenuArrowDown  />*/}
          </div>
        </button>

        <button
          className="btn-menu  "
          onClick={() => handleClick("Settings")}
          disabled={visblePage === "Settings"}
        >
          <div className="display-flex">
            <IcoSettings className="btn-menu-icon-placeholder  mr-a " />
            <p className="font-type-menu ">Settings</p>
          </div>
          <div className="btn-menu-icon-placeholder  ">
            {" "}
            {/*  <MenuArrowDown  />*/}
          </div>
        </button>

        {/* <button
          className="btn-menu  "
          onClick={() => handleClick("Users")}
          disabled={visblePage === "Users"}
        >
          <div className="display-flex">
            <IconUsers className="btn-menu-icon-placeholder  mr-a " />
            <p className="font-type-menu ">Users</p>
          </div>
          <div className="btn-menu-icon-placeholder  ">
            {" "}
         
          </div>
        </button> */}

        <button
          className="btn-menu  "
          onClick={() => handleClick("Alerts")}
          // onClick={() => handleClickComingSoon("Alerts")}
          disabled={visblePage === "Alerts"}
        >
          <div className="display-flex">
            <IconAlert className="btn-menu-icon-placeholder  mr-a " />
            <p className="font-type-menu ">Alerts</p>

            {/* <div className="notification"><p className="font-type-very-sml-txt   Color-White">{unseen_alert_number ||  unseen_alert_number != 0 &&   unseen_alert_number}</p></div> */}
            <div
              className={`Bg-Red  light-bulb-type2 `}
              style={{ marginLeft: "2px", marginBottom: "12px" }}
            />
          </div>
          <div className="btn-menu-icon-placeholder  "> </div>
        </button>

        <div
          className="btn-menu-list"
          onMouseLeave={() => set_download_drop_down(false)}
          //  onMouseEnter={()=>set_download_drop_down(true)}
        >
          <button
            className={`btn-menu  ${
              download_drop_down ? "btn_look_hover" : ""
            } `}
            onClick={handle_download_drop_down}
          >
            <div className="display-flex">
              <IcoDownload className="btn-menu-icon-placeholder  mr-a " />
              <p className="font-type-menu ">Download Agent</p>
            </div>
            <div className="btn-menu-icon-placeholder  ">
              {" "}
              {/*  <MenuArrowDown  />*/}
            </div>
          </button>
          {/* fix */}
          <div className={`dropdown-menu ${download_drop_down ? "open" : ""}`}>
            <button
              className="btn-menu  "
              onClick={(e) => {
                handleDownload("Windows");
              }}
            >
              <div className="display-flex">
                <IcoDownload
                  className="btn-menu-icon-placeholder  mr-a "
                  style={{ visibility: "hidden" }}
                />
                <p className="font-type-menu ">Windows</p>
              </div>
              <div className="btn-menu-icon-placeholder  ">
                {" "}
                {/*  <MenuArrowDown  />*/}
              </div>
            </button>

            <button
              className="btn-menu  "
              onClick={(e) => {
                handleDownload("Linux");
              }}
            >
              <div className="display-flex">
                <IcoDownload
                  className="btn-menu-icon-placeholder  mr-a "
                  style={{ visibility: "hidden" }}
                />
                <p className="font-type-menu ">linux</p>
              </div>
              <div className="btn-menu-icon-placeholder  ">
                {" "}
                {/*  <MenuArrowDown  />*/}
              </div>
            </button>

            <button
              className="btn-menu  "
              onClick={(e) => {
                handleDownload("Mac");
              }}
            >
              <div className="display-flex">
                <IcoDownload
                  className="btn-menu-icon-placeholder  mr-a "
                  style={{ visibility: "hidden" }}
                />
                <p className="font-type-menu ">Mac</p>
              </div>
              <div className="btn-menu-icon-placeholder  ">
                {" "}
                {/*  <MenuArrowDown  />*/}
              </div>
            </button>
          </div>
        </div>
      </div>
      <div
        className="Bg-Grey2"
        style={{ width: "100%", height: "2px", borderRadius: "5px" }}
      />

      <button
        className="btn-type2"
        onClick={handle_active_manual_process}
        style={{
          width: "100%",
          paddingLeft: "var(--space-a) ",
          //  paddingRight: Info?.toolType !== undefined &&
          //  Info?.toolType !== "" &&
          //  Info?.toolType !== null
          //    ? "calc(var(--space-d) - 5px)"
          //  : undefined
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <IcoACtiveBlue
            style={{
              // height:"var(--space-c)" ,width:"var(--space-c)" ,
              marginRight: "var(--space-a)",
            }}
          />

          <p className="font-type-menu">Run Selected Jobs</p>
        </div>
      </button>

      {/* <button className="btn-menu" onClick={handle_active_manual_process}>
        <div className="display-flex">
          {" "}
          <IcoACtive className="btn-menu-icon-placeholder  mr-a " />{" "}
          <p className="font-type-menu ">Run Selected</p>{" "}
        </div>
        <div className="btn-menu-icon-placeholder  "> </div>
      </button>
       */}

      {/* <div    className="Bg-Grey2"  style={{ width: "100%", height: "2px", borderRadius: "5px" }} /> */}

      {Object.keys(DownloadProgressBar).length > 0 && (
        <div
          style={{
            paddingRight: "calc(var(--space-c) + var(--space-b))",
            paddingLeft: "calc(var(--space-c) + var(--space-b))",
            // width: '100%',
            position: "fixed", // Use fixed positioning
            bottom: "var(--space-d)", // Position it at the bottom of the viewport
            width: "-webkit-fill-available",
          }}
        >
          <p className="font-type-menu  Color-Grey1  mb-a">
            Downloads Progress:
          </p>
          <div className=" " style={{ width: "100% " }}>
            {Object.values(DownloadProgressBar).map((item) => (
              <DownloadProgressBarItem item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SideBar;

{
  /* 

<div style={{width:"100%"  }} >
<button className="btn-menu "  style={{marginBottom:"var(--space-a)"}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
  onClick={handle_active_interval_process}
>  
        <div className='display-flex'>
          <IconLastRun className="btn-menu-icon-placeholder  mr-a " />
          <p className='font-type-menu'>Output:
            {isMainProcessWork && !isHovered &&   <span className='font-type-menu Color-Blue-Glow ml-a'>on</span>}
            {isMainProcessWork && isHovered &&  <span className='font-type-menu Color-Orange ml-a'>turn off</span>}
            {!isMainProcessWork && isHovered &&  <span className='font-type-menu Color-Blue-Glow ml-a'>turn on</span> }
            {!isMainProcessWork && !isHovered &&  <span className='font-type-menu Color-Orange ml-a'>off</span>}
         </p>
        
            </div> 
       <div className="btn-menu-icon-placeholder  "> </div> 
</button>  

<button className="btn-menu"  onClick={handle_active_manual_process}>  
        <div className='display-flex'> <IcoACtive className="btn-menu-icon-placeholder  mr-a " />  <p className='font-type-menu '>Run Selected</p> </div> 
       <div className="btn-menu-icon-placeholder  "> </div> 
</button>  
</div> */
}

// const countVelociraptorResponses = async () => {
//   try {

//     const res = await axios.get(`${backEndURL}/results/count-responses-files`);

//     if (res) {
//       const list  = res.data.number

//       const listResults =  list
//       const seeResults =  localStorage.getItem(user_id + '_seeResults');

//       console.log(parseFloat(seeResults));

//    if(parseFloat(seeResults) != listResults){
// const note_gap  = listResults - parseFloat(seeResults)
// set_unseen_alert_number(note_gap)
//    }
// else if(parseFloat(seeResults) === listResults){set_unseen_alert_number(0)}

//       // console.log(parseFloat(seeResults) === listResults);
//       // console.log(parseFloat(seeResults) < listResults);

//       // set_unseen_alert_number
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
