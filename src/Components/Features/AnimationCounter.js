import React, { useState, useEffect } from "react";

const Counter = ({ target, isHovered, txt_color }) => {
  const [count_this_number, set_count_this_number] = useState(0);
  const [is_big_number_type, set_is_big_number_type] = useState(false);
  const [big_number_type, set_big_number_type] = useState("");

  const dont_display_color = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--color-Grey2");
  const [count, setCount] = useState(0);
  const [color, setColor] = useState(
    target !== undefined && target !== null
      ? "rgb(229, 229, 229)"
      : dont_display_color
  );

  useEffect(() => {
    if (!target) {
      return;
    }

    if (target < 999999) {
      set_count_this_number(target);
      // console.log(target, "small number")
    } else if (target >= 1000000 && target <= 999999999) {
      set_is_big_number_type(true);
      set_count_this_number(target / 1000000);
      set_big_number_type("M");
      // console.log(target ,"its milions")
    } else if (target >= 1000000000 && target <= 999999999999) {
      set_is_big_number_type(true);
      set_count_this_number(target / 1000000000);
      set_big_number_type("B");
      // console.log(target ,"its bilions")
    } else if (target >= 100000000000) {
      set_is_big_number_type(true);
      set_count_this_number(target / 1000000000000);
      set_big_number_type("Trillion");
      // console.log(target ,"its Trillion")
    }
    // trillion
  }, [target]);

  useEffect(() => {
    let duration = 1000;
    let fast___set = 40;

    if (count_this_number > 1 && count_this_number < 10) {
      fast___set = 22;
      duration = 1200; // 1.5 seconds in milliseconds
    } else if (11 < count_this_number && count_this_number < 19) {
      fast___set = 20;
      duration = 2200; // 1.5 seconds in milliseconds
    } else if (20 < count_this_number && count_this_number < 200) {
      fast___set = 90;
      duration = 2500; // 1.5 seconds in milliseconds
    } else if (count_this_number > 1000) {
      fast___set = 30;
      duration = 1500; // 1.5 seconds in milliseconds
    } else {
      if (count_this_number > 200 && count_this_number < 999) {
        fast___set = 5;
        duration = 1000;
      }

      if (201 > count_this_number > 0) {
        fast___set = 0.2;
      }

      duration = count_this_number * fast___set;
    }

    let startTimestamp = null;
    const colorTransitionStartTimestamp = duration;
    const endColorTransitionDuration = 500;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsedTime = timestamp - startTimestamp;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeInOutProgress =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      setCount(Math.floor(easeInOutProgress * count_this_number));

      if (elapsedTime <= duration) {
        const colorIntensity = easeInOutProgress;
        const r = Math.floor(229 + (0 - 229) * colorIntensity);
        const g = Math.floor(229 + (219 - 229) * colorIntensity);
        const b = Math.floor(229 + (255 - 229) * colorIntensity);
        setColor(`rgb(${r}, ${g}, ${b})`);
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else if (
        elapsedTime <=
        colorTransitionStartTimestamp + endColorTransitionDuration
      ) {
        const colorElapsedTime = elapsedTime - duration;
        const colorProgress = Math.min(
          colorElapsedTime / endColorTransitionDuration,
          1
        );
        const r = Math.floor(0 + (229 - 0) * colorProgress);
        const g = Math.floor(219 + (229 - 219) * colorProgress);
        const b = Math.floor(255 + (229 - 255) * colorProgress);
        setColor(`rgb(${r}, ${g}, ${b})`);
        window.requestAnimationFrame(step);
      } else {
        if (target == undefined && target == null) {
          setColor(dont_display_color);
        } else {
          setColor("rgb(229, 229, 229)");
        }
      }
    };

    window.requestAnimationFrame(step);
  }, [count_this_number]);

  return (
    <div style={{ transition: "color 0.15s ease-in-out" }}>
      {target !== undefined && target !== null && target !== "NA" ? (
        <p
          className="font-type-h1"
          style={{
            color: isHovered ? "#00DBFF" : txt_color || color,
            transition: "color 0.15s ease-in-out",
          }}
        >
          {count}
          {is_big_number_type && (
            <span className="font-type-h3">{big_number_type}</span>
          )}
        </p>
      ) : (
        <p
          className="font-type-h2"
          style={{
            color: isHovered ? "#00DBFF" : dont_display_color || color,
            transition: "color 0.15s ease-in-out",
          }}
        >
          NA
        </p>
      )}
    </div>
  );
};

export { Counter };
