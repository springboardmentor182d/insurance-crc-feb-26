const ActionCard = ({ title, description, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer text-white p-6 rounded-2xl shadow-md transition transform hover:-translate-y-1 hover:shadow-lg ${color}`}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm opacity-90">{description}</p>
    </div>
  );
};

export default ActionCard;
