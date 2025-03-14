export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
     
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <p className="text-gray-700 mb-6">Manage cities, departments, and posts efficiently.</p>

  
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
       
        {[
          { title: "📩 Real-time Communication", description: "Send instant messages and updates between departments." },
          { title: "⚖️ Conflict Resolution", description: "Efficiently resolve inter-departmental conflicts." },
          { title: "📅 Project Calendar", description: "Track and manage department projects to avoid clashes." },
          { title: "🤖 AI-driven Insights", description: "Leverage AI for data-driven decision-making." },
          { title: "🎥 Video Conferencing", description: "Conduct online meetings and workshops seamlessly." },
        ].map((feature, index) => (
          <div 
            key={index}
            className="bg-white p-6 rounded-xl shadow-md w-100 h-60 flex flex-col justify-center text-center"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h2>
            <p className="text-sm text-gray-700">{feature.description}</p>
          </div>
        ))}

      </div>
    </div>
  );
}
