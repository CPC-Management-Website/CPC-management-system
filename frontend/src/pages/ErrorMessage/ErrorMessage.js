import React from "react";
import { useState } from "react";
import style from "./style.module.css"
import css from "classnames";

// Type: The type of message to be displayed, i.e., error, success, warning. Type also determines the style applied to the alert message element
// Message: A text message to explain the error or warning to the user
// Children: The elements containing the content to be displayed
function ErrorMessage({ children, type, message }) {

  //message? setIsShow(false) : setIsShow(true)

  const renderElAlert = function () {
    return React.cloneElement(children);
  };

  return (
    <div className={css(style.alert, style[type])}>
      {children ? renderElAlert() : message}
    </div>
  );
}

export default ErrorMessage