import React, { useState } from 'react';

type Subtask = {
    id: number;
    description: string;
};

type Task = {
    id: number;
    description: string;
    isEmergency: boolean;
    subtasks: Subtask[];
};

type TaskListProps = {};

const TaskList = ({}: TaskListProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskDescription, setTaskDescription] = useState('');
    const [subtaskDescription, setSubtaskDescription] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

    const addTask = () => {
        if (taskDescription.trim() === '') return;
        const newTask: Task = {
            id: Date.now(),
            description: taskDescription,
            isEmergency: false,
            subtasks: [],
        };
        setTasks([...tasks, newTask]);
        setTaskDescription('');
    };

    const toggleEmergency = (id: number) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, isEmergency: !task.isEmergency } : task
        ));
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
        if (selectedTaskId === id) {
            setSelectedTaskId(null);
        }
    };

    const addSubtask = () => {
        if (selectedTaskId === null || subtaskDescription.trim() === '') return;
        const newSubtask: Subtask = {
            id: Date.now(),
            description: subtaskDescription,
        };
        setTasks(tasks.map(task =>
            task.id === selectedTaskId
                ? { ...task, subtasks: [...task.subtasks, newSubtask] }
                : task
        ));
        setSubtaskDescription('');
    };

    const deleteSubtask = (taskId: number, subtaskId: number) => {
        setTasks(tasks.map(task =>
            task.id === taskId
                ? { ...task, subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId) }
                : task
        ));
    };

    return (
        <div>
            <h2>Task List</h2>
            <input
                type="text"
                placeholder="Enter task description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
            />
            <button onClick={addTask}>Add Task</button>

            {tasks.map(task => (
                <div key={task.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                    <p>{task.description}</p>
                    <label>
                        <input
                            type="checkbox"
                            checked={task.isEmergency}
                            onChange={() => toggleEmergency(task.id)}
                        />
                        Emergency
                    </label>
                    <button onClick={() => deleteTask(task.id)}>Delete Task</button>
                    <button onClick={() => setSelectedTaskId(task.id)}>
                        {selectedTaskId === task.id ? "Deselect Task" : "Select Task"}
                    </button>

                    {selectedTaskId === task.id && (
                        <div style={{ marginTop: '10px' }}>
                            <h4>Subtasks</h4>
                            <input
                                type="text"
                                placeholder="Enter subtask description"
                                value={subtaskDescription}
                                onChange={(e) => setSubtaskDescription(e.target.value)}
                            />
                            <button onClick={addSubtask}>Add Subtask</button>
                            <ul>
                                {task.subtasks.map(subtask => (
                                    <li key={subtask.id}>
                                        {subtask.description}
                                        <button onClick={() => deleteSubtask(task.id, subtask.id)}>Delete Subtask</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TaskList;
