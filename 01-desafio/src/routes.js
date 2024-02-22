import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';
import { parse } from 'csv-parse';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;
      const result = database.select(
        'tasks',
        search ? { title: search, description: search } : null
      );
      return res.end(JSON.stringify(result));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) return res.writeHead(400).end();

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert('tasks', task);
      return res.writeHead(201).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      database.delete('tasks', id);

      return res.writeHead(204).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) return res.writeHead(400).end();
      database.update('tasks', id, { title, description });

      return res.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      if (!id) return res.writeHead(400).end();

      const [task] = database.select('tasks', { id });
      if (!task) return res.writeHead(404).end();

      const isCompleted = Boolean(task.completed_at) ? null : new Date();
      database.update('tasks', id, { completed_at: isCompleted });

      return res.writeHead(204).end();
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/teste'),
    handler: async (req, res) => {
      const parser = req;
      console.log(parser);
      return res.end();
      let count = 0;
      process.stdout.write('start\n');
      // Iterate through each records
      for await (const record of parser) {
        // Report current line
        process.stdout.write(`${count++} ${record.join(',')}\n`);
        // Fake asynchronous operation
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      // Report end
      process.stdout.write('...done\n');
      return res.end();
    },
  },
];
