import { Task } from './task.interface';

export const TASKS: Task[] = [
  {
    id: '1',
    title: 'Go shopping',
    createdAt: new Date(),
    content: '- Milk\n- Eggs\n- Bread',
    children: [],
  },
  {
    id: '2',
    title: 'Sample Task',
    createdAt: new Date(),
    content: 'This is a sample task with some text as content. You can edit this text by clicking on it. You can also add more text by clicking on the plus button below.',
    children: [],
  },
  {
    id: '3',
    title: 'Another task 1',
    createdAt: new Date(),
    content: '',
    children: [],
  },
  {
    id: '4',
    title: 'Another task 2',
    createdAt: new Date(),
    content: '',
    children: [
      {
        id: '5',
        title: 'Sub task 1',
        createdAt: new Date(),
        content: '',
        children: [],
      },
      {
        id: '6',
        title: 'Sub task 2',
        createdAt: new Date(),
        content: '',
        children: [],
      }
    ],
  },
  {
    id: '7',
    title: 'Another task 3',
    createdAt: new Date(),
    content: '',
    children: [],
  },
];