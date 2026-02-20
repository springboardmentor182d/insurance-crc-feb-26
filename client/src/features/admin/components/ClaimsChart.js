import{
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
 const ClaimsChart = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font- semibold mb-4">Claims Trends</h2>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="approved" fill="#10b981" />
                    <Bar dataKey="rejected" fill="#ef4444" />
                    <Bar dataKey="fraudulent" fill="#f59e0b" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ClaimsChart;
