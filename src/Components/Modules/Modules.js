import React, { useState, useEffect, useContext } from "react";
import { PreviewBoxes_main_modules } from "../PreviewBox_main.js";
import { Search_comp } from "../Features/Search_comp.jsx";
import GeneralContext from "../../Context.js";
import axios from "axios";

// import "../PreviewBoxes.css";
// import "../all_tools.css";
// import "../../SideBar/SideBar.css";

// import { ReactComponent as IcoModule } from '../icons/ico-module.svg';

// import { useNavigate } from 'react-router-dom';

function Modules({
  show_SideBar,
  set_show_SideBar,
  unseen_alert_number,
  set_visblePage,
}) {
  set_visblePage("Modules");
  const {
    all_Tools,
    set_all_Tools,
    backEndURL,
    set_all_artifacts,
    all_artifacts,
    moduleLinks,
    set_moduleLinks,
    GetAllToolAndArtifactFunc,
    AllTags,
  } = useContext(GeneralContext);
  const [all_artifacts_and_modules, set_all_artifacts_and_modules] = useState(
    []
  );

  const [filter_string, set_filter_string] = useState("");
  const [ChosenTag, setChosenTag] = useState("Tags");
  const [DropdownTagsShow, setDropdownTagsShow] = useState(false);
  const [Updater, setUpdater] = useState(false);

  // const navigate = useNavigate();
  // console.log("all_artifacts_and_modules", all_artifacts_and_modules);

  useEffect(() => {
    if (backEndURL == null || backEndURL == undefined || backEndURL == "") {
      return;
    }
    GetAllToolAndArtifactFunc();
  }, [backEndURL]);

  useEffect(() => {
    if (show_SideBar === false) {
      set_show_SideBar(true);
    }
  }, []);

  useEffect(() => {
    if (
      Array.isArray(all_Tools) &&
      all_Tools.length > 0 &&
      Array.isArray(all_artifacts) &&
      all_artifacts.length > 0
    ) {
      console.log(all_Tools, all_artifacts, "55555555555555555555555555");

      set_all_artifacts_and_modules([...all_Tools, ...all_artifacts]);
    }
  }, [all_Tools]);

  useEffect(() => {
    if (
      Array.isArray(all_Tools) &&
      all_Tools.length > 0 &&
      Array.isArray(all_artifacts) &&
      all_artifacts.length > 0
    ) {
      console.log(
        all_Tools,
        all_artifacts,
        "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss"
      );

      set_all_artifacts_and_modules([...all_Tools, ...all_artifacts]);
    }
  }, [all_Tools, all_artifacts]);

  const HandleTagSelection = async (TagName) => {
    try {
      console.log("Turn Tag ON ", TagName);
      const res = await axios.post(backEndURL + "/tools/TagSelection", {
        TagName,
      });
      if (res.data == "All Good") {
        console.log(res.data, "All Good");
        await GetAllToolAndArtifactFunc();
        console.log("ssssssssssss");
        setChosenTag(TagName);
        setDropdownTagsShow(false);
      }
    } catch (error) {
      console.log("Error In Tag Selection : ", error);
    }
  };

  return (
    <>
      <div className="app-main">
        <div className="top-of-page">
          <div className="top-of-page-left mb-b">
            {/* <p className="font-type-menu">Mssp:</p> */}
            <p className="font-type-h3">Modules</p>
          </div>
          {/* <div className='top-of-page-center'> placeholder for dropDown  </div> */}

          <div className="top-of-page-right">
            {/* CSS Grid layout container for proper column alignment */}
            <div className="modules-header-tags-container">
              {/* Empty grid items to align with table columns */}
              <div></div> {/* Checkbox column spacer */}
              <div></div> {/* Logo column spacer */}
              <div></div> {/* Module name column spacer */}
              <div className="hide-on-small-screen1"></div> {/* Description column spacer */}
              <div className="hide-on-small-screen3"></div> {/* Read More button column spacer */}
              <div></div> {/* Action button column spacer */}
              
              {/* Tags dropdown - positioned in 7th grid column */}
              <div
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                <button
                  className={`btn-type2 "btn-type2-no_btn"`}
                  onClick={() => setDropdownTagsShow(!DropdownTagsShow)}
                  style={{
                    width: "100%",
                    minWidth: "115px",
                    maxWidth: "122px",
                    paddingLeft: "var(--space-c)",
                    paddingRight: "calc(var(--space-c) - 5px)",
                    height: 36,
                  }}
                >
                  <p className="font-type-menu cutLongLine">
                    {ChosenTag}
                  </p>
                </button>
                <div
                  className={`dropdown-menu ${DropdownTagsShow ? "open" : ""}`}
                  style={{
                    top: 80,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    zIndex: 10,
                  }}
                >
                  {AllTags?.map((tt) => {
                    // console.log(AllTags, "ttttt", tt);
                    if (tt == ChosenTag) {
                      return;
                    }
                    return (
                      <button
                        key={tt}
                        className={`btn-type2 "btn-type2-no_btn"`}
                        onClick={() => HandleTagSelection(tt)}
                        style={{
                          width: "100%",
                          minWidth: "115px",
                          maxWidth: "122px",
                          paddingLeft: "var(--space-c)",
                          paddingRight: "calc(var(--space-c) - 5px)",
                          backgroundColor: "var(--color-Grey2)",
                        }}
                      >
                        <p className="font-type-menu" style={{}}>
                          {tt}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="hide-on-small-screen2"></div> {/* Last run column spacer */}
              <div></div> {/* Settings column spacer */}
            </div>

            <Search_comp
              set_items_for_search={set_all_artifacts_and_modules}
              items_for_search={all_artifacts_and_modules}
              filter_string={filter_string}
              set_filter_string={set_filter_string}
            />
          </div>
        </div>

        <div
          className=" mb-c"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-c)",
          }}
        >
          {/* {all_artifacts &&
            all_artifacts.length != undefined &&
            typeof all_artifacts != "string" &&
            Array.isArray(all_artifacts) && (
              <PreviewBoxes_main_modules
                // preview_list={all_artifacts}
                preview_list={
                  all_artifacts_and_modules
                    .filter(
                      (tool) =>
                        tool?.tool_id != "2000000" &&
                        tool?.parent_id === "2000000" &&
                        tool?.ShowInUi
                    )
                    .sort((a, b) => a.positionNumber - b.positionNumber) // Sort by positionNumber
                }
                box_type={"velociraptor"}
                main_headline="End-Point Modules"
                main_subtitle="Launching tools and collecting forensic artifacts from the endpoints"
                main_read_more="At the press of a (few) buttons, perform targeted collection of digital forensic evidence simultaneously across your endpoints, with speed and precision. Continuously collect endpoint events such as event logs, file modifications and process execution. Centrally store events indefinitely for historical review and analysis. Don't wait until an event occurs. Actively search for suspicious activities using our library of forensic artifacts, then customize to your specific threat hunting needs."
                logoAddress="./Logos/Velociraptor.svg"
                iconAddress="./icons/General-icons-g.svg"
                // lastrun="17/03/2024"
                is_filtering={filter_string != ""}
                all_artifacts_and_modules={all_artifacts_and_modules}
                set_all_artifacts_and_modules={set_all_artifacts_and_modules}
              />
            )} */}

          {all_artifacts_and_modules &&
            all_artifacts_and_modules.length != undefined &&
            typeof all_artifacts_and_modules != "string" &&
            Array.isArray(all_artifacts_and_modules) && (
              <>
                <PreviewBoxes_main_modules
                  preview_list={
                    all_artifacts_and_modules
                      .filter(
                        (tool) =>
                          tool?.tool_id != "2000000" &&
                          // tool?.parent_id != "2000000" &&
                          (tool?.toolType === "module" ||
                            tool?.parent_id == "2000000") &&
                          tool?.ShowInUi
                      )
                      .sort((a, b) => a.positionNumber - b.positionNumber) // Sort by positionNumber
                  }
                  box_type={"modules"}
                  // main_headline="ASM & CTI Modules"
                  main_subtitle="Forensic timelines, vulnerability scans, device mapping & credential management"
                  main_read_more="At the press of a (few) buttons, perform targeted collection of digital forensic evidence simultaneously across your endpoints, with speed and precision. Continuously collect endpoint events such as event logs, file modifications and process execution. Centrally store events indefinitely for historical review and analysis. Don't wait until an event occurs. Actively search for suspicious activities using our library of forensic artifacts, then customize to your specific threat hunting needs."
                  logoAddress=""
                  iconAddress="./icons/General-icons-k.svg"
                  // lastrun="17/03/2024"
                  is_filtering={filter_string != ""}
                  all_artifacts_and_modules={all_artifacts_and_modules}
                  set_all_artifacts_and_modules={set_all_artifacts_and_modules}
                  ShowAssets={true}
                  setChosenTag={setChosenTag}
                />

                <PreviewBoxes_main_modules
                  preview_list={
                    all_artifacts_and_modules
                      .filter(
                        (tool) =>
                          tool?.parent_id != "2000000" &&
                          tool?.toolType === "link" &&
                          tool?.ShowInUi
                      )
                      .sort((a, b) => a.positionNumber - b.positionNumber) // Sort by positionNumber
                  }
                  box_type={"modules"}
                  // main_headline="Infrastructural Modules"
                  main_subtitle="This suite offers AD security, artifact analysis, threat intelligence, OSINT, sandboxing, hash management, darknet monitoring, credential leak detection, and incident response capabilities"
                  main_read_more="At the press of a (few) buttons, perform targeted collection of digital forensic evidence simultaneously across your endpoints, with speed and precision. Continuously collect endpoint events such as event logs, file modifications and process execution. Centrally store events indefinitely for historical review and analysis. Don't wait until an event occurs. Actively search for suspicious activities using our library of forensic artifacts, then customize to your specific threat hunting needs."
                  logoAddress=""
                  iconAddress="./icons/General-icons-j.svg"
                  // lastrun="17/03/2024"
                  is_filtering={filter_string != ""}
                  all_artifacts_and_modules={all_artifacts_and_modules}
                  set_all_artifacts_and_modules={set_all_artifacts_and_modules}
                  ShowAssets={true}
                  setChosenTag={setChosenTag}
                />
              </>
            )}
        </div>

        {/* <button className="btn-type2 "
//  onClick={handle_active_manual_process}
    style={{
        marginLeft:"auto",
        marginBottom:"var(--space-a)"

    }}
    
    
    >
   <div style={{display:"flex", alignItems:"center"   }}> <IcoACtiveBlue     style={{}}/>
   <p className='font-type-menu'>Run Selected Jobs</p>
   </div>  
   </button>  */}

        {/* {all_artifacts_and_modules?.length > 4    &&   
<button className="btn-type4 mb-a"  onClick={()=>  navigate(`/${"dashboard-general"}`)}><p className='font-type-menu ' >Watch Results</p><IcoResults className="icon-type1 " />  </button>
 } */}
      </div>
    </>
  );
}

export default Modules;