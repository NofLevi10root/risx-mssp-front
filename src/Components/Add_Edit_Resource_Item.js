import React, { useEffect, useState } from "react";
import "../Components/PopUp.css"; // import CSS file for modal styling
// import CloseButton from "./CloseButton";
import { ReactComponent as CloseButton } from "./icons/ico-Close_type1.svg";
// import { ReactComponent as IconCart } from './icons/ico-cart.svg';
import axios from "axios";
// import Tools from '../tmpjsons/previewBoxesTools.json';
import { ReactComponent as IconTrash } from "../Components/icons/ico-trash.svg";
import GeneralContext from "../Context.js";
import { useContext } from "react";
export const Add_Edit_Resource_Item = (props) => {
  const {
    ChosenEntityRaw,
    popUp_show,
    set_popUp_show,
    IconBIG,
    resourceItem,
    set_resourceItem,
    item_types_list,
    set_item_types_list,
    item_tool_list,
    set_item_tool_list,
    popUp_Add_or_Edit__status,
    set_filter_Resource,
    set_PopUp_All_Good__txt,
    set_PopUp_All_Good__show,
    set_PopUp_Are_You_Sure__txt,
    set_PopUp_Are_You_Sure__show,

    assets_list_from_db,
    set_assets_list_from_db,
    getFullCategoryAndEntitiesList,
    set_PopUp_Are_You_Sure__Type,
  } = props;

  const { all_Resource_Types, all_Tools, backEndURL, get_all_resource_types } =
    useContext(GeneralContext);

  const [resource_string, set_resource_string] = useState(
    resourceItem?.resource_string || ""
  );
  const [monitoring, set_monitoring] = useState(
    resourceItem?.monitoring === 1 ? true : false
  );
  const [description, setDescription] = useState(
    resourceItem?.description || ""
  );
  const [resource_id, set_resource_id] = useState(
    resourceItem?.resource_id || ""
  );
  const [error_message, set_error_message] = useState("");
  const [tools_preview, set_tools_preview] = useState([]);
  const [resource_type, set_resource_type] = useState({});

  console.log("popUp_Add_or_Edit__status", popUp_Add_or_Edit__status);
  //  console.log("all_Tools" ,all_Tools);
  //  console.log("tools_preview" ,tools_preview);
  // console.log("item_tool_list ------------------------------",item_tool_list);
  //  console.log("item_tool_list ------------------------------",all_Tools.filter(item => item.tool_id === ["2222, "3333"]);

  const Handele_are_you_sure = () => {
    console.log("resource_id", resource_id);
    set_popUp_show(false); /// the add adit popup
    set_PopUp_Are_You_Sure__Type("Resource");
    set_PopUp_Are_You_Sure__txt({
      HeadLine: "Are you sure you want to delete?",
      paragraph: "This record will be permanently deleted from the database",
      buttonTrue: "Yes",
      buttonFalse: "No",
    });

    set_PopUp_Are_You_Sure__show(true);
  };

  // const handle_Types_Checkbox_Change = (e, resourceTypeId) => {

  //   // if(popUp_Add_or_Edit__status == "add" ){  set_item_tool_list([]);}

  //   const isChecked = e.target.checked;
  //   if (isChecked) {
  //     set_item_types_list([...item_types_list, resourceTypeId]); // Add the resourceTypeId to the array
  //   } else {
  //     set_item_types_list(item_types_list.filter(id => id !== resourceTypeId)); // Remove the resourceTypeId from the array
  //   }
  // };

  const handle_Tools_Checkbox_Change = (e, ToolId) => {
    console.log(e.target.checked);
    const isChecked = e.target.checked;
    if (isChecked) {
      set_item_tool_list([...item_tool_list, ToolId]); // Add the resourceTypeId to the array
    } else {
      set_item_tool_list(item_tool_list.filter((id) => id !== ToolId)); // Remove the resourceTypeId from the array
    }

    console.log("item_tool_list", item_tool_list);
  };

  const change_tools_preview_acording_asset_types = () => {
    if (item_types_list.length === 0) {
      set_tools_preview([]);
      return;
    }

    console.log("item_types_list", item_types_list);
    const filtered_tools = all_Tools.filter((tool) =>
      item_types_list.some((item_type) =>
        tool.useResourceType.includes(item_type)
      )
    );

    set_tools_preview(filtered_tools);
  };

  useEffect(() => {
    if (popUp_Add_or_Edit__status == "add") {
      const idArray = tools_preview.map((item) => item.tool_id);
      set_item_tool_list(idArray);
    }
  }, [tools_preview]);

  useEffect(() => {
    change_tools_preview_acording_asset_types();
  }, [item_types_list]);

  useEffect(() => {
    const found = all_Resource_Types.find(
      (element) => element.resource_type_id === item_types_list[0]
    );
    set_resource_type(found);
  }, []);

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  // function to close modal when user clicks outside of it
  function handleClickOutside(e) {
    // console.log("e.target.className" , e.target.className);
    if (e.target.className === "PopUp-background") {
      set_popUp_show(false);
      set_resourceItem({});
    }
  }

  function handleClose() {
    set_popUp_show(false);
    set_resourceItem({});
  }

  function handle_add_or_edit_item() {
    const data = {
      resource_id: resource_id,
      resource_string: resource_string,
      monitoring: monitoring,
      description: description,
      item_tool_list: item_tool_list,
      item_types_list: item_types_list,
      parent_id: ChosenEntityRaw?.entitiesId,
    };

    if (popUp_Add_or_Edit__status == "add") {
      console.log("data to add =============== ", data);
      const add_resource = async () => {
        try {
          set_error_message("");
          const res = await axios.post(`${backEndURL}/resources`, data);
          if (res?.status === 200) {
            console.log("res.data", res.data[0]);
            //  set_filter_Resource({type_ids:[],tool_ids:[]})// for not have mistakealso will pull all list

            // Update the state with the new array

            const filteredTools = all_Tools.filter((item) =>
              item_tool_list.includes(item.tool_id)
            );
            // Extract only tool_id and tool_name
            const modifiedTools = filteredTools.map(
              ({ tool_id, Tool_name }) => ({
                Toolid: tool_id,
                toolname: Tool_name,
              })
            );

            const item = res.data[0];
            const item_and_tools = { ...item, tools: modifiedTools };
            ChosenEntityRaw?.properties?.push(item_and_tools); // const updatedAssetsList = [...assets_list_from_db, item_and_tools];
            // set_assets_list_from_db(updatedAssetsList);

            getFullCategoryAndEntitiesList();
            // Update the state fo the big numbers
            get_all_resource_types();

            set_popUp_show(false); // close this popup
            set_PopUp_All_Good__txt({
              HeadLine: "Successfully Saved",
              paragraph:
                "The resource has been successfully saved in the database.",
              buttonTitle: "Close",
            });
            set_PopUp_All_Good__show(true);
          }
        } catch (err) {
          console.log(err);
          set_error_message(err?.response?.data);
        }
      };
      add_resource();
    } else if (popUp_Add_or_Edit__status == "edit") {
      const edit_Resouce = async () => {
        try {
          set_error_message("");

          const res = await axios.put(`${backEndURL}/resources`, data);
          if (res?.status === 200) {
            console.log("res.data1", res.data[0].resource_id);
            console.log("res.data2", res.data);

            // const list_without_the_updated_item = assets_list_from_db.filter(
            //   (item) => item.resource_id !== resource_id
            // );

            const filteredTools = all_Tools.filter((item) =>
              item_tool_list.includes(item.tool_id)
            );
            // Extract only tool_id and tool_name
            const modifiedTools = filteredTools.map(
              ({ tool_id, Tool_name }) => ({
                Toolid: tool_id,
                toolname: Tool_name,
              })
            );

            const item = res.data[0];
            const item_and_tools = { ...item, tools: modifiedTools };

            // const updatedAssetsList = [
            //   ...list_without_the_updated_item,
            //   item_and_tools,
            // ];

            const tempObj = [...ChosenEntityRaw?.properties];
            set_resourceItem(item_and_tools);
            tempObj.forEach((x) => {
              console.log(x);
              if (x?.resource_id == resource_id) {
                console.log("hhhhhhhh", x.tools, item_and_tools);
                x.checked = item_and_tools.checked;
                x.createdAt = item_and_tools.createdAt;
                x.description = item_and_tools.description;
                x.monitoring = item_and_tools.monitoring;
                x.resource_status = item_and_tools.resource_status;
                x.resource_string = item_and_tools.resource_string;
                x.type = item_and_tools.type;
                x.updatedAt = item_and_tools.updatedAt;
                x.tools = item_and_tools.tools;
              }
            });

            // resourceItem = item_and_tools;
            // set_assets_list_from_db(updatedAssetsList);

            // update the object
            // set_filter_Resource({type_ids:[],tool_ids:[]})// for not have mistakealso will pull all list
            set_popUp_show(false); // close this popup

            getFullCategoryAndEntitiesList();
            set_PopUp_All_Good__txt({
              HeadLine: "Successfully Updated",
              paragraph:
                "The resource has been successfully update in the database.",
              buttonTitle: "Close",
            });
            set_PopUp_All_Good__show(true);
          }
        } catch (err) {
          console.log(err);
          set_error_message(err?.response?.data);
        }
      };
      edit_Resouce();
    }
  }

  useEffect(() => {
    if (popUp_Add_or_Edit__status == "add") {
      console.log("come clean");
      set_resource_id("");
      set_resource_string("");
      set_monitoring(true);
      setDescription("");
      set_item_tool_list([]);
      // set_item_types_list([]);
    } else if (popUp_Add_or_Edit__status == "edit") {
      set_resource_id(resourceItem?.resource_id || "");
      set_resource_string(resourceItem?.resource_string || "");
      set_monitoring(resourceItem?.monitoring === 1 ? true : false);
      setDescription(resourceItem?.description || "");
    }
  }, [popUp_Add_or_Edit__status]); // Re-initialize state if `resourceItem` changes

  console.log("resource_type ssssssssss", resource_type);

  const DisplayText = () => {
    if (resource_type?.resource_type_name === "Computer") {
      return "Computer Name";
    } else if (resource_type?.resource_type_name === "Full Name") {
      return "Full Name";
    } else if (resource_type?.resource_type_name === "Company Name") {
      return "Company Name";
    } else if (resource_type?.resource_type_name === "Domain") {
      return "Domain Name";
    } else if (resource_type?.resource_type_name === "Email Address") {
      return "Email Address";
    } else if (resource_type?.resource_type_name === "Email Domain") {
      return "Email Domain";
    } else if (resource_type?.resource_type_name === "IP Address") {
      return "IP Address Number";
    } else if (resource_type?.resource_type_name === "Phone Number") {
      return "Phone Number";
    } else if (resource_type?.resource_type_name === "Username (Social)") {
      return "Username";
    } else {
      return "Name";
    }
  };

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div className={`PopUp-content`} style={{ width: "800px" }}>
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            <div className="display-flex mb-d">
              <IconBIG />{" "}
              <p className="font-type-h4   Color-White ml-b">
                {popUp_Add_or_Edit__status === "add" ? (
                  <>Add {resource_type?.preview_name}</>
                ) : (
                  <>Edit {resource_type?.preview_name}</>
                )}
              </p>
            </div>

            <div className="items_top_center_buttom">
              <div className="items_top">
                <div className="items_left">
                  <div className="item_info_left">
                    <p className="font-type-menu   Color-Grey1 pb-b">
                      {DisplayText()}
                    </p>
                    <input
                      className="input-type2 mb-a "
                      type="text"
                      value={resource_string}
                      placeholder={resourceItem?.Name || `${DisplayText()}..`}
                      onChange={handleInputChange(set_resource_string)}
                    />
                  </div>

                  <div className="item_info_left">
                    <p className="font-type-menu   Color-Grey1 pb-b">
                      Description
                    </p>
                    <input
                      className="input-type2 mb-a "
                      type="text"
                      value={description}
                      placeholder={resourceItem?.Description || "Description"}
                      onChange={handleInputChange(setDescription)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p className="font-type-menu   Color-Grey1 pb-b">Modules</p>
                {popUp_Add_or_Edit__status === "add" && (
                  <p className="font-type-txt   Color-Grey1 pb-b">
                    Note: When adding assets, the intended modules are selected
                    by default.
                  </p>
                )}
              </div>

              <div
                className="item_info_tools_all"
                //  style={{height:"100px"}}
              >
                {/* {item_types_list.length != 0 &&  } */}
                <div
                  className="titles mb-c"
                  style={{
                    visibility: item_types_list.length === 0 && "hidden",
                  }}
                >
                  <label className="container" style={{ visibility: "hidden" }}>
                    <input
                      type="checkbox"
                      // defaultChecked
                    />
                    <span className="checkmark"></span>
                  </label>
                  <p className="column font-type-menu   Color-Grey1 column-small">
                    Name
                  </p>
                  <p className="column font-type-menu   Color-Grey1 ">
                    Description
                  </p>
                  <p className="column font-type-menu   Color-Grey1 column-small justify-content-center  mr-b">
                    Developer
                  </p>
                </div>

                <div className="item_info_tools_box">
                  <div className="item_info_tools">
                    {all_Tools?.length === 0 && (
                      <div style={{ marginTop: "50px" }}>
                        {" "}
                        <p
                          className="font-type-menu  Color-Grey2"
                          style={{ textAlign: "center" }}
                        >
                          Choose Resource Type..
                        </p>
                      </div>
                    )}

                    {Array.isArray(all_Tools) &&
                      all_Tools?.map((Info, index) => {
                        const bbb = () => {
                          try {
                            require(`${Info.logoAddress_1}`);
                            return true;
                          } catch (error) {
                            return false;
                            console.log("Error In Logo Of ", Info);
                          }
                        };
                        const bbbBool = bbb();
                        return (
                          <div className="toolsData  ">
                            <div className="toolsData-checkbox">
                              {/* tools_preview */}
                              <label className="container">
                                <input
                                  type="checkbox"
                                  value={item_tool_list}
                                  // defaultChecked={ popUp_Add_or_Edit__status === "add" }
                                  checked={item_tool_list.find(
                                    (type) => type == Info?.tool_id
                                  )}
                                  onChange={(e) =>
                                    handle_Tools_Checkbox_Change(
                                      e,
                                      Info?.tool_id
                                    )
                                  }
                                />
                                <span className="checkmark"></span>
                              </label>
                            </div>

                            <div className="column column-small  ">
                              <p className="   font-type-txt   Color-Blue-Glow tagit_type1">
                                {Info?.Tool_name}
                              </p>
                            </div>

                            <p className="column-for-txt font-type-txt     Color-Grey1">
                              {Info?.description_short}
                            </p>

                            <div className="column column-small justify-content-center">
                              <img
                                className="velociraptor-EndpointModules-logo   "
                                src={
                                  Info?.logoAddress_1 && bbbBool
                                    ? require(`${Info.logoAddress_1}`)
                                    : undefined
                                }
                              ></img>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              <div className="display-flex  ">
                <div className="display-flex  ">
                  <label className="switch">
                    {" "}
                    <p className="column font-type-menu   Color-Grey1 ">
                      Start Monitoring
                    </p>
                    <input
                      type="checkbox"
                      checked={monitoring}
                      onChange={() => set_monitoring(!monitoring)}
                      // defaultChecked={Math.random() < 0.7}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "22px",
                  }}
                >
                  {popUp_Add_or_Edit__status === "edit" ? (
                    <>
                      <p className="column font-type-menu   Color-Grey1 mr-a ">
                        ID
                      </p>
                      <p className=" font-type-txt     Color-Grey1">
                        {" "}
                        {resource_id}
                      </p>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="display-flex  mt-c" style={{}}>
              <div style={{ marginLeft: "auto" }} />
              {error_message === "" ? null : (
                <p className="  font-type-menu   Color-Red  mr-b">
                  {error_message}
                </p>
              )}

              {popUp_Add_or_Edit__status === "edit" && (
                <button
                  className="btn-type1"
                  style={{ marginRight: "5px" }}
                  onClick={Handele_are_you_sure}
                >
                  <IconTrash className="icon-type1" />{" "}
                </button>
              )}
              <button className="btn-type2" onClick={handle_add_or_edit_item}>
                <p className="font-type-menu ">
                  {popUp_Add_or_Edit__status === "add" ? (
                    <>Save</>
                  ) : (
                    <>Update</>
                  )}
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
