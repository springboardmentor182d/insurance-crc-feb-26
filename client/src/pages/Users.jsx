function Users() {
  const users = [
    { name: "John Doe", email: "john@example.com", status: "Active" },
    { name: "Jane Smith", email: "jane@example.com", status: "Active" },
    { name: "Mike Johnson", email: "mike@example.com", status: "Inactive" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Users</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          {users.map((user, index) => (
            <div key={index} className="border rounded-xl p-4 flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm h-fit">
                {user.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Users;