import { useState } from 'react';
import './Tasklist.css';

type Task = {
    id: number;
    name: string;
    description: string;
    isEmergency: boolean;
    location: string;
    assignees: string[];
};

const TaskListHeader = ({ progress }: { progress: string }) => {
    return (
        <div className="tasklist-header">
            <h2>Tasks</h2>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: progress }}></div>
                <span className="progress-text">1/3</span>
            </div>
            <button className="new-task-button">New Task</button>
        </div>
    );
};

const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskName, setTaskName] = useState('');
    const [taskLocation, setTaskLocation] = useState('');
    const [taskAssignees, setTaskAssignees] = useState('');
    const [taskDescription, setTaskDescription] = useState('');

    const addTask = () => {
        if (taskName.trim() === '' || taskLocation.trim() === '' || taskAssignees.trim() === '') return;
        const newTask: Task = {
            id: Date.now(),
            name: taskName,
            description: taskDescription,
            isEmergency: false,
            location: taskLocation,
            assignees: taskAssignees.split(',').map(name => name.trim()),
        };
        setTasks([...tasks, newTask]);
        setTaskName('');
        setTaskLocation('');
        setTaskAssignees('');
        setTaskDescription('');
    };

    const toggleEmergency = (id: number) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, isEmergency: !task.isEmergency } : task
        ));
    };

    return (
        <div className="tasklist">
            <TaskListHeader progress={`${(tasks.length / 3) * 100}%`} />

            <div className="task-inputs">
                <input
                    type="text"
                    placeholder="Task Name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={taskLocation}
                    onChange={(e) => setTaskLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Assignees (comma-separated)"
                    value={taskAssignees}
                    onChange={(e) => setTaskAssignees(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                />
                <button onClick={addTask}>Add Task</button>
            </div>

            <div className="tasklist-table">
                <div className="tasklist-table-header">
                    <span>Name</span>
                    <span>Description</span>
                    <span>Location</span>
                    <span>Assignee</span>
                </div>
                {tasks.map(task => (
                    <div key={task.id} className="tasklist-row">
                        <span>{task.name}</span>
                        <span className="description-cell">{task.description || 'No description'}</span>
                        <span>{task.location}</span>
                        <span>
                            {task.assignees.map((assignee, index) => (
                                <span key={index} className="assignee-badge">{assignee}</span>
                            ))}
                        </span>
                        <button onClick={() => toggleEmergency(task.id)}>
                            {task.isEmergency ? 'Unmark Emergency' : 'Mark Emergency'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;
