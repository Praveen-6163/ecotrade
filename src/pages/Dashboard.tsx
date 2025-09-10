import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaLeaf, FaShoppingCart, FaChartLine, FaUser } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

// ✅ Fix: Added Tailwind custom colors in tailwind.config.js
// saffron, royal-blue, teal

interface Profile {
  id: string;
  name: string;
  email: string;
  credits_owned: number;
  total_co2_offset: number;
  badges: string[];
}

interface Project {
  id: string;
  name: string;
  type: string;
  price_per_credit: number;
  description: string;
}

interface Transaction {
  id: string;
  project_name: string;
  credits: number;
  price: number;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"marketplace" | "impact" | "profile">("marketplace");
  const [notification, setNotification] = useState<string>("");

  // ✅ Fetch profile & data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);

      // Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) setProfile(profileData);

      // Projects
      const { data: projectData } = await supabase.from("projects").select("*");
      if (projectData) setProjects(projectData);

      // Transactions
      const { data: transactionData } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (transactionData) setTransactions(transactionData);

      setLoading(false);
    };

    fetchData();
  }, [user]);

  // ✅ Buy credits
  const handleBuy = async (project: Project) => {
    if (!user || !profile) return;

    const cost = project.price_per_credit * quantity;

    // Insert transaction
    const { error: txError } = await supabase.from("transactions").insert([
      {
        user_id: user.id,
        project_id: project.id,
        project_name: project.name,
        credits: quantity,
        price: cost,
      },
    ]);

    if (txError) {
      setNotification("❌ Error processing transaction");
      return;
    }

    // Update profile credits & CO2 offset
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        credits_owned: profile.credits_owned + quantity,
        total_co2_offset: profile.total_co2_offset + quantity * 0.5,
      })
      .eq("id", user.id);

    if (profileError) {
      setNotification("❌ Error updating profile");
      return;
    }

    setProfile({
      ...profile,
      credits_owned: profile.credits_owned + quantity,
      total_co2_offset: profile.total_co2_offset + quantity * 0.5,
    });

    setNotification("✅ Purchase successful!");
  };

  // ✅ Chart data
  const chartData = transactions.map((t) => ({
    date: new Date(t.created_at).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }),
    credits: t.credits,
    price: t.price,
  }));

  if (loading) return <div className="p-6 text-center">Loading Dashboard...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaLeaf className="text-green-600" /> EcoTrade Dashboard
      </h1>

      {/* ✅ Notification */}
      {notification && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg shadow">
          {notification}
        </div>
      )}

      {/* ✅ Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={px-4 py-2 rounded-lg shadow ${activeTab === "marketplace" ? "bg-green-600 text-white" : "bg-gray-200"}}
          onClick={() => setActiveTab("marketplace")}
        >
          <FaShoppingCart className="inline mr-2" /> Marketplace
        </button>
        <button
          className={px-4 py-2 rounded-lg shadow ${activeTab === "impact" ? "bg-blue-600 text-white" : "bg-gray-200"}}
          onClick={() => setActiveTab("impact")}
        >
          <FaChartLine className="inline mr-2" /> Impact
        </button>
        <button
          className={px-4 py-2 rounded-lg shadow ${activeTab === "profile" ? "bg-purple-600 text-white" : "bg-gray-200"}}
          onClick={() => setActiveTab("profile")}
        >
          <FaUser className="inline mr-2" /> Profile
        </button>
      </div>

      {/* ✅ Marketplace */}
      {activeTab === "marketplace" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-xl p-5 shadow hover:shadow-lg transition">
              <h2 className="font-bold text-lg mb-2 text-green-700">{project.name}</h2>
              <p className="text-gray-600 mb-3">{project.description}</p>
              <p className="text-sm text-gray-500 mb-2">Type: {project.type}</p>
              <p className="font-semibold mb-3">₹{project.price_per_credit} per credit</p>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  min={1}
                  className="border rounded p-2 w-20"
                />
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  onClick={() => handleBuy(project)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Impact */}
      {activeTab === "impact" && profile && (
        <div>
          <div className="mb-6 grid md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-xl shadow text-center bg-green-50">
              <h3 className="text-xl font-bold text-green-700">{profile.credits_owned}</h3>
              <p className="text-gray-600">Credits Owned</p>
            </div>
            <div className="p-4 border rounded-xl shadow text-center bg-blue-50">
              <h3 className="text-xl font-bold text-blue-700">{profile.total_co2_offset.toFixed(2)} tons</h3>
              <p className="text-gray-600">CO₂ Offset</p>
            </div>
            <div className="p-4 border rounded-xl shadow text-center bg-purple-50">
              <h3 className="text-xl font-bold text-purple-700">{profile.badges.length}</h3>
              <p className="text-gray-600">Badges Earned</p>
            </div>
          </div>

          <h2 className="text-lg font-bold mb-4">Transaction History</h2>
          <div className="overflow-x-auto border rounded-xl shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Project</th>
                  <th className="px-4 py-2 text-center">Credits</th>
                  <th className="px-4 py-2 text-center">Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-2">{new Date(t.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{t.project_name}</td>
                    <td className="px-4 py-2 text-center">{t.credits}</td>
                    <td className="px-4 py-2 text-center">{t.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Impact Chart */}
          <h2 className="text-lg font-bold mt-8 mb-4">Impact Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="credits" stroke="#16a34a" />
              <Line type="monotone" dataKey="price" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ✅ Profile Section */}
      {activeTab === "profile" && profile && (
        <div className="p-6 border rounded-xl shadow bg-white">
          <h2 className="text-xl font-bold mb-4 text-purple-700">User Profile</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Credits Owned:</strong> {profile.credits_owned}</p>
          <p><strong>Total CO₂ Offset:</strong> {profile.total_co2_offset.toFixed(2)} tons</p>
          <div className="mt-3">
            <strong>Badges:</strong>
            <div className="flex gap-2 mt-1">
              {profile.badges.length > 0 ? (
                profile.badges.map((badge, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {badge}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No badges yet</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;