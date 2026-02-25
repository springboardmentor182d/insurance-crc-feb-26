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
      className={`cursor-pointer rounded-2xl p-8 text-white shadow-md transition-all duration-200 hover:scale-[1.02] ${color}`}
    >
      <div className="flex flex-col gap-0">

        {/* Icon */}
        <div className="text-3xl opacity-90">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/90 leading-relaxed">
          {description}
        </p>

      </div>
    </div>
  );
};

export default ActionCard;