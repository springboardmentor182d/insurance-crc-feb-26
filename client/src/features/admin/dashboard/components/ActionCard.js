const ActionCard = ({
  title,
  description,
  color,
  icon,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-2xl p-8 admin-text-inverse shadow-md transition-all duration-200 hover:scale-[1.02] ${color}`}
    >
      <div className="flex flex-col gap-0">
        <div className="text-3xl opacity-90">
          {icon}
        </div>

        <h3 className="text-xl font-semibold">
          {title}
        </h3>

        <p className="text-sm admin-text-inverse-soft leading-relaxed">
          {description}
        </p>

      </div>
    </div>
  );
};

export default ActionCard;
