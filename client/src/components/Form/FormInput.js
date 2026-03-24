export default function FormInput({ label, type = "text", placeholder, value, onChange, name }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-800 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
}
