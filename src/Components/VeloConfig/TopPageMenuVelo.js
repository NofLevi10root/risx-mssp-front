import "./../Settings/Settings_Menu.css";

function TopPageMenuVelo({
  Preview_This_in_menu,
  handle_Click_Btn,
  sub_menu_options,
  InputFunction,
  DelFunc,
}) {
  return (
    <div className="SubMenu-all">
      <div className="SubMenu-in">
        {sub_menu_options.map((item, index) => {
          const fater_value = item?.value;

          return (
            <div className="SubMenu-unit" key={index}>
              <button
                disabled={
                  Preview_This_in_menu === item?.value && !item?.is_nasted
                }
                className={`SubMenu-btn ${
                  Preview_This_in_menu === item?.value &&
                  !item?.is_nasted &&
                  "SubMenu-btn-active"
                }    ${
                  Preview_This_in_menu === item?.value &&
                  item?.is_nasted &&
                  "SubMenu-btn-active-and-clickable"
                }                     `}
                onClick={() => {
                  handle_Click_Btn(item?.value, item?.is_nasted, fater_value);
                }}
              >
                <p className="font-type-menu">{item?.preview_name}</p>
                <div className="SubMenu-gap" />
              </button>
            </div>
          );
        })}
        <div
          className="SubMenu-unit"
          style={{ marginLeft: "auto", display: "flex" }}
        >
          <button
            className={`SubMenu-btn  `}
            onClick={DelFunc}
          >
            <p className="font-type-menu">Cleanup Collectors</p>
          </button>

          <div className={`SubMenu-btn  `}>
            <label for="myfile">
              <p className="font-type-menu">Import Results</p>
            </label>
            <input
              type="file"
              id="myfile"
              name="myfile"
              hidden
              onChange={InputFunction}
              multiple
            />
            <div className="SubMenu-gap" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopPageMenuVelo;
