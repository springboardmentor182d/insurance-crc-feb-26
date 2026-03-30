import { useEffect, useState } from "react";
import AdminLayout from "../../layout/admin/AdminLayout";
import { getClaimsTrends } from "../../api/adminApi";

const AnalyticsPage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getClaimsTrends()
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-3xl font-semibold mb-4">Advanced Analytics</h1>

                <div className="p-4 bg-white shadow rounded-xl">
                    <h2 className="font-medium mb-2">Claims Trends</h2>

                    {data.length === 0 ? (
                        <p>Loading...</p>
                    ) : (
                        <ul>
                            {data.map((item, i) => (
                                <li key={i}>
                                    {item.date} → {item.count}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AnalyticsPage;