import React, { useState, useEffect } from "react";

import { ReactComponent as IconSearch } from "../icons/ico-search.svg";
import { ReactComponent as IconPlus } from "../icons/ico-plus.svg";
import { ReactComponent as IconPlusMany } from "../icons/ico-plus-many.svg";
import { ReactComponent as IconTrash } from "../icons/ico-trash.svg";
import { ReactComponent as IconSettings } from "../icons/ico-settings.svg";
import { ReactComponent as IconExpend } from "../icons/ico-expend.svg";
import { ReactComponent as IconLine } from "../icons/ico-line.svg";
import { ReactComponent as IconImport } from "../icons/ico-import.svg";
import { ReactComponent as IconExport } from "../icons/ico-export.svg";

import { ReactComponent as IconJsonDown } from "../icons/ico-menu-json-down.svg";

function ResourceGroup_Action_btns({
  items_for_search,
  set_items_for_search,
  is_search,
  set_is_search,
  isReset,
  set_isReset,
  btn_add_single_show,
  btn_add_single_action,
  btn_add_single_value,

  btn_add_many_show,
  btn_add_many_action,
  btn_add_many_id,

  btn_add_single_id,

  btn_collapse_show,
  btn_collapse_action,

  btn_trash_show,
  btn_trash_action,
  btn_trash_id,

  btn_gear_show,
  btn_gear_action,
  btn_gear_id,

  btn_import_show,
  btn_import_action,

  btn_export_show,
  btn_export_action,
}) {
  const [filter_string, set_filter_string] = useState("");
  const [all_items, set_all_items] = useState([]);

  useEffect(() => {
    if (items_for_search?.length === undefined) {
      return;
    }
    if (all_items?.length === undefined) {
      return;
    }

    if (items_for_search?.length > all_items?.length) {
      set_all_items(items_for_search);
    }
    if (isReset) {
      set_all_items(items_for_search);
      set_isReset(false);
    }
  }, [items_for_search]);

  useEffect(() => {
    const filteredItems = all_items.filter((item) => {
      const filterLower = filter_string.toLowerCase();
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          const value = item[key];

          if (
            typeof value === "string" &&
            value.toLowerCase().includes(filterLower)
          ) {
            set_is_search(false);

            return true; // If the filter_string is found in any property, return true to include the item in the filtered list
          }
        }
      }
      set_is_search(true);
      return false; // If no property contains the filter_string, exclude the item from the filtered list
    });

    set_items_for_search(filteredItems);

    // console.log("filteredItems", filteredItems);
  }, [filter_string]);

  return (
    <div className="resource-group-Right-Action_btns">
      <input
        className="input-type1 mr-a"
        placeholder="Search"
        onChange={(e) => set_filter_string(e.target.value)}
      />
      <button className="btn-type1">
        <IconSearch className="icon-type1" />{" "}
      </button>

      {btn_add_many_show && (
        <button
          className="btn-type1"
          onClick={() => btn_add_many_action(btn_add_many_id)}
        >
          <IconPlusMany className="icon-type1" />
        </button>
      )}

      {btn_add_single_show && (
        <button
          className="btn-type1"
          onClick={() =>
            btn_add_single_action(btn_add_single_value, btn_add_single_id)
          }
        >
          <IconPlus className="icon-type1" />
        </button>
      )}

      {btn_import_show && (
        <button className="btn-type1" onClick={() => console.log()}>
          <label htmlFor="FileImportAssets">
            <IconImport className="icon-type1" />
          </label>
          <input
            onChange={(e) => {
              btn_import_action(e.target.files[0]);
            }}
            type="file"
            accept="application/json"
            id="FileImportAssets"
            name="FileImportAssets"
            style={{ opacity: 0, height: 0, width: 0 }}
          />
        </button>
      )}
      {btn_export_show && (
        <button className="btn-type1" onClick={() => btn_export_action()}>
          <IconExport className="icon-type1" />
        </button>
      )}

      {btn_trash_show && (
        <button className="btn-type1">
          <IconTrash
            className="icon-type1"
            onClick={() => btn_trash_action(btn_trash_id)}
          />{" "}
        </button>
      )}

      {btn_gear_show && (
        <button className="btn-type1">
          <IconSettings
            className="icon-type1"
            onClick={() => btn_gear_action(btn_gear_id)}
          />{" "}
        </button>
      )}

      {btn_collapse_show && (
        <>
          {" "}
          <IconLine className=" " />
          <button className="btn-type1" onClick={btn_collapse_action}>
            <IconExpend className="icon-type1" />
          </button>
        </>
      )}
    </div>
  );
}

export default ResourceGroup_Action_btns;
