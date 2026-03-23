function Settings() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Settings</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block font-medium mb-2">Organization Name</label>
          <input
            type="text"
            placeholder="Enter organization name"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Admin Email</label>
          <input
            type="email"
            placeholder="Enter admin email"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default Settings;