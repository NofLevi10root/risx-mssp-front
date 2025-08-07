import React, { useState, useContext, useEffect } from "react";
import { ReactComponent as IconBIG } from "../icons/ico-Resource-Group.svg";

import { ReactComponent as IconComputer } from "./asset-icons/ico-computers.svg";
import { ReactComponent as IconEmail } from "./asset-icons/ico-email.svg";
import { ReactComponent as IconNoIcon } from "./asset-icons/ico-no-icon.svg";
import { ReactComponent as IconDns } from "./asset-icons/ico-dns.svg";
import { ReactComponent as IconIp } from "./asset-icons/ico-ip.svg";
import { ReactComponent as IconPhonenumber } from "./asset-icons/ico-phonenumbers.svg";
import { ReactComponent as IconUserNameSocial } from "./asset-icons/ico-username.svg";
import { ReactComponent as IconFullName } from "./asset-icons/ico-fullname.svg";
import { ReactComponent as IconCompany } from "./asset-icons/ico-company.svg";
import { ReactComponent as IconEmailDomain } from "./asset-icons/ico-email-domain.svg";

import ResourceGroup_Action_btns from "./ResourceGroup_Action_btns";

import axios from "axios";
import GeneralContext from "../../Context.js";

import { format_date_type_a } from "../Features/DateFormat.js";

import ResourceGroup_List from "./ResourceGroup_List.jsx";
// Adjust the path as needed based on your project structure

import { Add_Edit_Resource_Item } from "../Add_Edit_Resource_Item";
import { Add_Many_Resource_Items } from "../Add_Many_Resource_Items";

import {
  PopUp_All_Good,
  PopUp_Are_You_Sure,
  PopUp_Under_Construction,
} from "../PopUp_Smart";

import LMloader from "../Features/LMloader.svg";
import { SingularToPlural } from "../Features/UsefulFunctions.js";

function ResourceGroup_All({
  // Preview_this_Resource ,
  // set_Preview_this_Resource,
  loader,
  // set_loader,
  // filter_Resource,
  set_filter_Resource,
}) {
  const {
    backEndURL,
    all_Resource_Types,
    get_all_resource_types,
    Assets_Preview_List,
    set_Assets_Preview_List,
  } = useContext(GeneralContext);

  const [
    popUp_Add_Many_Resource_Items__show,
    set_popUp_Add_Many_Resource_Items__show,
  ] = useState(false);
  const [
    popUp_Add_Many_Resource_Items__group_id,
    set_popUp_Add_Many_Resource_Items__group_id,
  ] = useState("");

  const [popUp_Add_or_Edit__show, set_popUp_Add_or_Edit__show] =
    useState(false);
  const [popUp_Add_or_Edit__status, set_popUp_Add_or_Edit__status] =
    useState("edit");

  const [PopUp_All_Good__show, set_PopUp_All_Good__show] = useState(false);
  const [PopUp_All_Good__txt, set_PopUp_All_Good__txt] = useState({
    HeadLine: "Success",
    paragraph: "successfully",
    buttonTitle: "Close",
  });

  const [PopUp_Are_You_Sure__show, set_PopUp_Are_You_Sure__show] =
    useState(false);
  const [PopUp_Are_You_Sure__txt, set_PopUp_Are_You_Sure__txt] = useState({
    HeadLine: "Are You Sure?",
    paragraph: "The record will be deleted from the system",
    buttonTrue: "True",
    buttonFalse: "False",
  });

  const [resourceItem, set_resourceItem] = useState({});
  const [item_types_list, set_item_types_list] = useState([]);

  const [item_tool_list, set_item_tool_list] = useState([]);
  const [show_this_list, set_show_this_list] = useState("");

  const [use_this_resource_type, set_use_this_resource_type] = useState({});
  // const [Assets_Preview_List, set_Assets_Preview_List] = useState(false);

  const time = new Date();
  const format_date = format_date_type_a(time);
  const [assets_list_from_db, set_assets_list_from_db] = useState([]);
  // console.log("all_Resource_Types ",all_Resource_Types);
  //  console.log("use_this_resource_type",use_this_resource_type);
  console.log("Assets_Preview_List", Assets_Preview_List);
  const [is_search, set_is_search] = useState(false);
  const [PreviewJsonFile, setPreviewJsonFile] = useState({});
  const [FullCategoryAndEntitiesList, setFullCategoryAndEntitiesList] =
    useState([]);

  const getFullCategoryAndEntitiesList = async () => {
    try {
      console.log("get FullCategoryAndEntitiesList");
      const res = await axios.get(
        `${backEndURL}/Resources/getFullCategoryAndEntitiesList`
      );
      console.log(
        res.data,
        "sssssssssssssssssssssssss22222222222222222222222222222222222222222222222222"
      );
      setFullCategoryAndEntitiesList(res.data ?? []);
    } catch (error) {
      console.log("error in FullCategoryAndEntitiesList :", error);
    }
  };

  useEffect(() => {
    if (backEndURL) {
      getFullCategoryAndEntitiesList();
    }
  }, [backEndURL]);

  const import_assets_json = async (file) => {
    try {
      const red = new FileReader();
      console.log("import assets json ss", file);
      let jj;
      console.log(
        "uuuuuuuuuuuuuuuuuuuuuuuuuuu888888888888888888888888888888888888888888888uuuuuuu"
      );

      red.onload = async (e) => {
        try {
          jj = JSON.parse(e.target.result);
          setPreviewJsonFile(jj);
          // Update Funcion Of Import
          const res = await axios.post(
            `${backEndURL}/config/ImportAllAssets`,
            jj,
            {}
          );
          get_all_resource_types();
          console.log("uuuuuuuuuuuuuu", res);
        } catch (error) {
          console.log("import error", error);
        }
      };
      await red.readAsText(file);
    } catch (error) {}
  };

  const export_assets_json = async () => {
    console.log("export assets json");
    try {
      const res = await axios.get(`${backEndURL}/config/ExportAllAssets`);
      const file = res.data;
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(file));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute(
        "download",
        `AssetsExport-${new Date().toLocaleDateString("en-GB")}.json`
      );
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.log("error", error);
    }
  };

  const EditTools = (Info) => {
    console.log(Info?.type);

    set_resourceItem(Info);

    set_item_types_list([Info?.type]);

    //  make array from item types
    // const resource_arrary =[]
    //   if(Info?.types)
    //   {
    //     for (let x of Info?.types) {
    //       resource_arrary.push(x.resource_type_id)
    //     }
    //     set_item_types_list(resource_arrary)

    //   }

    //make array from item tools

    const item_arrary = [];
    if (Info?.tools) {
      for (let x of Info?.tools) {
        item_arrary.push(x.Toolid);
      }
      set_item_tool_list(item_arrary);
    }
    set_popUp_Add_or_Edit__status("edit");
    set_popUp_Add_or_Edit__show(true);
  };

  const Add_Many = (btn_add_many_id) => {
    set_popUp_Add_Many_Resource_Items__group_id(btn_add_many_id);
    set_popUp_Add_Many_Resource_Items__show(true);
  };

  const handle_Confirm_Delete = () => {
    const delete_item = async () => {
      console.log("Deleting item...", resourceItem.resource_id);
      try {
        const res = await axios.delete(
          `${backEndURL}/Resources/${resourceItem.resource_id}`
        );
        if (res) {
          if (res.data === true) {
            const list_without_the_updated_item = assets_list_from_db.filter(
              (item) => item.resource_id !== resourceItem.resource_id
            );

            set_assets_list_from_db(list_without_the_updated_item);

            set_PopUp_Are_You_Sure__show(false);
            set_PopUp_All_Good__txt({
              HeadLine: "Deleted",
              paragraph: "The resources is deleted",
              buttonTitle: "Close",
            });
            set_PopUp_All_Good__show(true);
            set_filter_Resource({ type_ids: [], tool_ids: [] }); // for not have mistakealso will pull all list
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    delete_item();
  };

  const handle_Cancel_Delete = () => {
    console.log("CancelDelete item...");
    set_popUp_Add_or_Edit__show(true);
    set_PopUp_Are_You_Sure__show(false);
  };

  const add_resource_item = (btn_add_single_value, btn_add_single_id) => {
    // console.log("add_resource_item 00",btn_add_single_value,btn_add_single_id);

    set_item_types_list([btn_add_single_id]);
    set_item_tool_list([]);

    set_popUp_Add_or_Edit__status("add");
    set_popUp_Add_or_Edit__show(true);
  };

  const handle_show_list = (resource_type_id) => {
    const [resource_type_filtered] = all_Resource_Types.filter(
      (type) => type.resource_type_id === resource_type_id
    );
    set_use_this_resource_type(resource_type_filtered);

    if (resource_type_id === show_this_list) {
      set_Assets_Preview_List(false);
      return;
    } else {
      set_Assets_Preview_List(true);
    }
  };

  const handle_show_all_assets_type_list = () => {
    console.log("handle_show_all_assets_type_list");
    set_Assets_Preview_List(false);
    set_assets_list_from_db([]);
  };

  const renderIcon = (resource_type_id) => {
    if (resource_type_id === "2001") {
      return <IconDns />;
    } else if (resource_type_id === "2002") {
      return <IconIp />;
    } else if (resource_type_id === "2003") {
      return <IconUserNameSocial />;
    } else if (resource_type_id === "2004") {
      return <IconPhonenumber />;
    } else if (resource_type_id === "2005") {
      return <IconFullName />;
    } else if (resource_type_id === "2006") {
      return <IconEmail />;
    } else if (resource_type_id === "2007") {
      return <IconCompany />;
    } else if (resource_type_id === "2008") {
      return <IconComputer />;
    } else if (resource_type_id === "2009") {
      return <IconEmailDomain />;
    } else {
      return <IconNoIcon />;
    }
  };

  return (
    <div
      className="ResourceGroup-All"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {PopUp_Are_You_Sure__show && (
        <PopUp_Are_You_Sure
          popUp_show={PopUp_Are_You_Sure__show}
          set_popUp_show={set_PopUp_Are_You_Sure__show}
          HeadLine={PopUp_Are_You_Sure__txt.HeadLine}
          paragraph={PopUp_Are_You_Sure__txt.paragraph}
          button_True_text={PopUp_Are_You_Sure__txt.buttonTrue}
          button_False_text={PopUp_Are_You_Sure__txt.buttonFalse}
          True_action={handle_Confirm_Delete}
          False_action={handle_Cancel_Delete}
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

      {popUp_Add_or_Edit__show && (
        <Add_Edit_Resource_Item
          popUp_show={popUp_Add_or_Edit__show}
          set_popUp_show={set_popUp_Add_or_Edit__show}
          popUp_Add_or_Edit__status={popUp_Add_or_Edit__status}
          IconBIG={IconBIG}
          resourceItem={resourceItem}
          set_resourceItem={set_resourceItem}
          item_types_list={item_types_list}
          set_item_types_list={set_item_types_list}
          item_tool_list={item_tool_list}
          set_item_tool_list={set_item_tool_list}
          assets_list_from_db={assets_list_from_db}
          set_assets_list_from_db={set_assets_list_from_db}
          set_filter_Resource={set_filter_Resource}
          set_PopUp_All_Good__txt={set_PopUp_All_Good__txt}
          set_PopUp_All_Good__show={set_PopUp_All_Good__show}
          set_PopUp_Are_You_Sure__show={set_PopUp_Are_You_Sure__show}
          set_PopUp_Are_You_Sure__txt={set_PopUp_Are_You_Sure__txt}
        />
      )}

      {popUp_Add_Many_Resource_Items__show && (
        <Add_Many_Resource_Items
          popUp_show={popUp_Add_Many_Resource_Items__show}
          set_popUp_show={set_popUp_Add_Many_Resource_Items__show}
          IconBIG={IconBIG}
          group_id={popUp_Add_Many_Resource_Items__group_id}
          resourceItem={resourceItem}
          // set_resourceItem={set_resourceItem}
          item_types_list={item_types_list}
          set_item_types_list={set_item_types_list}
          // item_tool_list={item_tool_list}
          // set_item_tool_list={set_item_tool_list}

          assets_list_from_db={assets_list_from_db}
          set_assets_list_from_db={set_assets_list_from_db}
          set_filter_Resource={set_filter_Resource}
          set_PopUp_All_Good__txt={set_PopUp_All_Good__txt}
          set_PopUp_All_Good__show={set_PopUp_All_Good__show}
          set_PopUp_Are_You_Sure__show={set_PopUp_Are_You_Sure__show}
          set_PopUp_Are_You_Sure__txt={set_PopUp_Are_You_Sure__txt}
        />
      )}

      {loader ? (
        <>
          <div className="  loader-type-a">
            {" "}
            <img src={LMloader} className="" alt="Loading Resources" />
          </div>
        </>
      ) : (
        <>
          {!Assets_Preview_List && (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0 var(--space-b)",
                }}
                className="mb-c"
              >
                {/* <div
                // style={{visibility:"hidden"}}
                >
                  <IconBIG />
                </div> */}

                <p
                  className={`font-type-h4   Color-White ml-b`}
                  style={{
                    width: "100%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {/* Asset List */}
                </p>

                <ResourceGroup_Action_btns
                  //  set_item_types_list={set_item_types_list}
                  //  set_item_tool_list={set_item_tool_list}
                  // set_popUp_Add_or_Edit__show={set_popUp_Add_or_Edit__show}
                  // popUp_Add_or_Edit__show={popUp_Add_or_Edit__show}

                  set_popUp_Add_or_Edit__status={set_popUp_Add_or_Edit__status}
                  items_for_search={assets_list_from_db}
                  set_items_for_search={set_assets_list_from_db}
                  set_is_search={set_is_search}
                  btn_add_single_show={false}
                  btn_add_single_action={""}
                  btn_add_single_value={"add"}
                  btn_add_single_id={""}
                  btn_add_many_show={false}
                  btn_add_many_action={""}
                  btn_add_many_id={""}
                  btn_trash_show={false}
                  btn_trash_action={""}
                  btn_trash_id={"tmp"}
                  btn_gear_show={false}
                  btn_gear_action={""}
                  btn_gear_id={""}
                  btn_import_show={true}
                  btn_import_action={import_assets_json}
                  btn_export_show={true}
                  btn_export_action={export_assets_json}
                  btn_collapse_show={false}
                  btn_collapse_action={""}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0 var(--space-b)",
                }}
                className="mb-b "
              >
                <div style={{ visibility: "hidden" }}>
                  <IconBIG />
                </div>

                <p
                  className={`font-type-menu Color-Grey1 ml-b`}
                  style={{
                    width: "25%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  Type
                </p>

                <p
                  className={`font-type-txt Color-Grey1 ml-b`}
                  style={{
                    width: "60%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {/* Description */}
                </p>

                <p
                  className={`font-type-menu Color-Grey1  ml-b`}
                  style={{ width: "5%", textAlign: "center" }}
                >
                  Count
                </p>

                <p
                  className={`font-type-menu  Color-Grey1`}
                  style={{
                    width: "10%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    textAlign: "right",
                  }}
                >
                  Last Update
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* {Array.isArray(all_Resource_Types) &&  all_Resource_Types?.map((Info, index) => { */}

                {Array.isArray(all_Resource_Types) &&
                  all_Resource_Types.length > 0 &&
                  all_Resource_Types
                    .sort((a, b) =>
                      a.resource_type_name.localeCompare(b.resource_type_name)
                    )
                    .map((Info, index) => {
                      return (
                        <div
                          className="resource_type_list"
                          style={{
                            display: "flex",
                            flexDirection: "",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            handle_show_list(Info?.resource_type_id);
                          }}
                        >
                          {renderIcon(Info?.resource_type_id)}

                          <p
                            className={`font-type-menu Color-Grey1 ml-b`}
                            style={{
                              width: "25%",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {Info?.preview_name &&
                              SingularToPlural(Info?.preview_name)}
                          </p>

                          <p
                            className={`font-type-txt Color-Grey1 ml-b`}
                            style={{
                              width: "60%",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {/* {Info?.description_short} */}
                          </p>

                          <p
                            className={`font-type-menu Color-Grey1 ml-b`}
                            style={{ width: "5%", textAlign: "center" }}
                          >
                            {Info?.count}
                          </p>

                          <p
                            className={`font-type-txt Color-Grey1`}
                            style={{
                              width: "10%",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              textAlign: "right",
                            }}
                          >
                            {format_date}
                          </p>
                        </div>
                      );
                    })}
              </div>
            </>
          )}

          {Assets_Preview_List && (
            <>
              <ResourceGroup_List
                title={use_this_resource_type?.preview_name}
                asset_type_id={use_this_resource_type?.resource_type_id}
                set_popUp_Add_or_Edit__status={set_popUp_Add_or_Edit__status}
                set_popUp_Add_or_Edit__show={set_popUp_Add_or_Edit__show}
                popUp_Add_or_Edit__show={popUp_Add_or_Edit__show}
                add_resource_item={add_resource_item}
                EditTools={EditTools}
                Add_Many={Add_Many}
                //  handle_show_list={handle_show_list}
                //  show_this_list={show_this_list}
                assets_list_from_db={assets_list_from_db}
                set_assets_list_from_db={set_assets_list_from_db}
                handle_back={handle_show_all_assets_type_list}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ResourceGroup_All;
