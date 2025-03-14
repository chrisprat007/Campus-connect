import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: Buffer,
        required: false,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
});

const Tasks = mongoose.model('Tasks', taskSchema);

export default Tasks;
