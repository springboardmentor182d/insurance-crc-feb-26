const ActionCard = ({ title, description, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-8 text-white shadow-md transition duration-200 hover:scale-[1.02] ${color}`}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm opacity-90">{description}</p>
    </div>
  );
};

export default ActionCard;
