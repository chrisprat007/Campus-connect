export function TaskCard({ task, updateTaskStatus }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-2">
      <h3 className="text-lg font-semibold">{task.name}</h3>
      <p className="text-sm">{task.description}</p>
      <select
        className="mt-2 p-2 rounded border w-full"
        value={task.status}
        onChange={(e) =>{
          console.log(e); 
          updateTaskStatus(task._id, e.target.value)
        }}
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  );
}
