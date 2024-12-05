// frontend/src/components/tasklist/Tasklist.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../Tasklist';

describe('TaskList Component', () => {
    test('renders TaskList component', () => {
        render(<TaskList />);
        expect(screen.getByText(/Task List/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter task description/i)).toBeInTheDocument();
    });

    test('adds a task to the list', () => {
        render(<TaskList />);
        const input = screen.getByPlaceholderText(/Enter task description/i);
        const addButton = screen.getByText(/Add Task/i);

        fireEvent.change(input, { target: { value: 'New Task' } });
        fireEvent.click(addButton);

        expect(screen.getByText('New Task')).toBeInTheDocument();
    });

    test('deletes a task from the list', () => {
        render(<TaskList />);
        const input = screen.getByPlaceholderText(/Enter task description/i);
        const addButton = screen.getByText(/Add Task/i);

        // Add a task
        fireEvent.change(input, { target: { value: 'Task to Delete' } });
        fireEvent.click(addButton);
        const deleteButton = screen.getByText(/Delete Task/i);

        // Delete the task
        fireEvent.click(deleteButton);
        expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument();
    });

    test('toggles emergency status of a task', () => {
        render(<TaskList />);
        const input = screen.getByPlaceholderText(/Enter task description/i);
        const addButton = screen.getByText(/Add Task/i);

        // Add a task
        fireEvent.change(input, { target: { value: 'Emergency Task' } });
        fireEvent.click(addButton);

        const emergencyCheckbox = screen.getByLabelText(/Emergency/i);
        expect(emergencyCheckbox).not.toBeChecked();

        // Toggle emergency status
        fireEvent.click(emergencyCheckbox);
        expect(emergencyCheckbox).toBeChecked();
    });

    test('selects and adds a subtask', () => {
        render(<TaskList />);
        const taskInput = screen.getByPlaceholderText(/Enter task description/i);
        const addTaskButton = screen.getByText(/Add Task/i);

        // Add a main task
        fireEvent.change(taskInput, { target: { value: 'Main Task' } });
        fireEvent.click(addTaskButton);

        const selectButton = screen.getByText(/Select Task/i);
        fireEvent.click(selectButton);

        const subtaskInput = screen.getByPlaceholderText(/Enter subtask description/i);
        const addSubtaskButton = screen.getByText(/Add Subtask/i);

        // Add a subtask
        fireEvent.change(subtaskInput, { target: { value: 'Subtask 1' } });
        fireEvent.click(addSubtaskButton);

        expect(screen.getByText('Subtask 1')).toBeInTheDocument();
    });

    test('deletes a subtask from a task', () => {
        render(<TaskList />);
        const taskInput = screen.getByPlaceholderText(/Enter task description/i);
        const addTaskButton = screen.getByText(/Add Task/i);

        // Add a main task
        fireEvent.change(taskInput, { target: { value: 'Main Task' } });
        fireEvent.click(addTaskButton);

        const selectButton = screen.getByText(/Select Task/i);
        fireEvent.click(selectButton);

        const subtaskInput = screen.getByPlaceholderText(/Enter subtask description/i);
        const addSubtaskButton = screen.getByText(/Add Subtask/i);

        // Add a subtask
        fireEvent.change(subtaskInput, { target: { value: 'Subtask to Delete' } });
        fireEvent.click(addSubtaskButton);

        const deleteSubtaskButton = screen.getByText(/Delete Subtask/i);
        fireEvent.click(deleteSubtaskButton);

        expect(screen.queryByText('Subtask to Delete')).not.toBeInTheDocument();
    });
});
