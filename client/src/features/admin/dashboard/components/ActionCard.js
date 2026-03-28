import React from "react";

const ActionCard = ({ title, description, color, icon, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full cursor-pointer rounded-2xl p-8 text-left shadow-md transition-all duration-200 hover:scale-[1.02]",
        "admin-text-inverse",
        color || "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3">
        {icon ? <div className="text-3xl opacity-90">{icon}</div> : null}
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm leading-relaxed admin-text-inverse-soft">
          {description}
        </p>
      </div>
    </button>
  );
};

export default ActionCard;
