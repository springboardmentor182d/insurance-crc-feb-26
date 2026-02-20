import{
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const COLORS = ['#2563eb', '#10b981','#f59e0b', '#ef4444',];

const PolicyDistribution = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Policy Distribution</h2>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                    data={data}
                    dataKey="percentage"
                    nameKey="policyType"
                    outerRadius={80}
                    label
                    >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
export default PolicyDistribution;

                