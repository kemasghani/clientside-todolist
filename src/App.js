import React from 'react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Import Axios for API calls
import { useColorScheme } from '@mantine/hooks';
import './app.css'; // Import the custom tags CSS file

import {
	Button,
	Container,
	Text,
	Title,
	Modal,
	TextInput,
	Group,
	Card,
	ActionIcon,
} from '@mantine/core';
import { MoonStars, Sun, Trash } from 'tabler-icons-react';

export default function App() {
	const [tasks, setTasks] = useState([]);
	const [opened, setOpened] = useState(false);
	const taskTitle = useRef('');
	const taskDescription = useRef('');
	const dueDate = useRef('');
	const priority = useRef('');
	const [colorScheme, setColorScheme] = useState('light');

	function toggleColorScheme() {
		const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';
		setColorScheme(newColorScheme);
	}

	function createTask() {
		const newTask = {
			title: taskTitle.current.value,
			description: taskDescription.current.value,
			due_date: dueDate.current.value, // Add due date
			priority: priority.current.value, // Add priority
			status: 'Pending',
		};

		axios.post('http://localhost:3000/tasks', newTask) // Send POST request to create task
			.then(response => {
				setTasks([...tasks, response.data.task]); // Update tasks state with new task
				setOpened(false);
			})
			.catch(error => {
				console.error('Error creating task:', error);
			});
	}

	function deleteTask(id) {
		axios.delete(`http://localhost:3000/tasks/${id}`) // Send DELETE request to delete task by ID
			.then(() => {
				const updatedTasks = tasks.filter(task => task.id !== id);
				setTasks(updatedTasks);
			})
			.catch(error => {
				console.error('Error deleting task:', error);
			});
	}

	useEffect(() => {
		axios.get('http://localhost:3000/tasks') // Send GET request to fetch all tasks
			.then(response => {
				setTasks(response.data.tasks); // Update tasks state with fetched tasks
			})
			.catch(error => {
				console.error('Error fetching tasks:', error);
			});
	}, []);

	return (
		<Container size={550} my={40}>
			<Group position={'apart'}>
				<Title>My Tasks</Title>
				<ActionIcon onClick={toggleColorScheme} size='lg'>
					{colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
				</ActionIcon>
			</Group>
			{/* Task creation modal */}
			<Modal opened={opened} onClose={() => setOpened(false)}>
				<TextInput placeholder='Task Title' required ref={taskTitle} />
				<TextInput placeholder='Task Description' ref={taskDescription} />
				<TextInput placeholder='Due Date' type='date' ref={dueDate} />
				<TextInput placeholder='Priority' ref={priority} />
				<Group position='apart'>
					<Button onClick={() => setOpened(false)} variant='subtle'>
						Cancel
					</Button>
					<Button onClick={createTask}>Create Task</Button>
				</Group>
			</Modal>
			{/* Display tasks */}
			{tasks.map(task => (
				<Card key={task.id} mt='sm' withBorder>
					<Group position='apart'>
						<Text weight='bold'>{task.title}</Text>
						<ActionIcon onClick={() => deleteTask(task.id)} color='red' variant='transparent'>
							<Trash />
						</ActionIcon>
					</Group>
					<Text color='dimmed' size='md' mt='sm'>
						{task.description ? task.description : 'No description was provided for this task'}
					</Text>
					<div className='tag due-date'>Due Date: {new Date(task.due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
					<div className='tag priority'>Priority: {task.priority}</div>
				</Card>
			))}
			{/* Button to open task creation modal */}
			<Button onClick={() => setOpened(true)} fullWidth mt='md'>
				New Task
			</Button>
		</Container>
	);
}
