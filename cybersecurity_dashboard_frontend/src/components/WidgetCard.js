import React from "react";

function WidgetCard({ title, content }) {
  return (
    <div className="widget-card">
      <h3>{title}</h3>
      <div className="widget-content">{content}</div>
    </div>
  );
}

export default WidgetCard;
