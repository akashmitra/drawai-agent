import React from "react";
export const BaseNode = ({ children, ...props }) => (
  <div {...props}>{children}</div>
); 