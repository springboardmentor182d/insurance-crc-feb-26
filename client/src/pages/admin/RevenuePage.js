import AdminLayout from "../../layout/admin/AdminLayout";

const RevenuePage = () => {
    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-3xl font-semibold mb-4">Revenue Growth</h1>

                <div className="p-4 bg-white shadow rounded-xl">
                    <h2 className="font-medium mb-2">Monthly Revenue</h2>
                    <p>💰 Revenue chart will come here</p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default RevenuePage;