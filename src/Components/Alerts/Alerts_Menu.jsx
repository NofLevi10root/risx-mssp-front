import "./../Settings/Settings_Menu.css";

export function AlertsMenu({
  Preview_This_in_menu,
  handle_Click_Btn,
  sub_menu_options,
}) {
  return (
    <div className="SubMenu-all">
      <div className="SubMenu-in">
        {sub_menu_options.map((item, index) => {

          return (
            <div className="SubMenu-unit" key={index}>
              <button
                disabled={Preview_This_in_menu === item?.value}
                className={`SubMenu-btn ${
                  Preview_This_in_menu === item?.value && "SubMenu-btn-active"
                }                       `}
                onClick={() => {
                  handle_Click_Btn(item?.value);
                }}
              >
                <p className="font-type-menu">{item?.preview_name}</p>
                <div className="SubMenu-gap" />
              </button>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
