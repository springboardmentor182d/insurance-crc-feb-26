import{
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
 const RevenueChart = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Revenue & Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#2564eb" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
export default RevenueChart;