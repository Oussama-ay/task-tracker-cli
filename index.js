const { argv } = require('node:process');
const fs = require('fs');

const FILE_PATH = 'tasks.json';

function readTasks()
{
    try {
        if (!fs.existsSync(FILE_PATH)) {
            fs.writeFileSync(FILE_PATH, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        throw new Error(`Error reading tasks: ${err.message}`);
    }
}

function saveTasks(tasks)
{
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
    } catch (err) {
        throw new Error(`Error saving tasks: ${err.message}`);
    }
}

function parseId(idStr)
{
    if (!idStr) {
        throw new Error("ID is required");
    }
    const id = Number(idStr);
    if (Number.isNaN(id)) {
        throw new Error("ID must be a number");
    }
    return id;
}

try
{
    const myArgs = argv.slice(2);
    const cmd = myArgs[0];

    if (!cmd)
        throw new Error("Usage: node index.js [add|list|update|delete|mark-in-progress|mark-done] [args...]");

    const tasks = readTasks();
    let flag = false;

    switch (cmd)
    {
        case 'add': {
            const description = myArgs.slice(1).join(' ');
            if (!description)
                throw new Error("Description is required");
    
            const nextId = tasks.length === 0
                ? 1
                : Math.max(...tasks.map(t => t.id)) + 1;

            const now = new Date().toISOString();
            const task = {
                id: nextId,
                description: description,
                status: 'todo',
                createdAt: now,
                updatedAt: now
            };

            tasks.push(task);
            console.log(`Task added successfully (ID: ${nextId})`);
            flag = true;
            break;
        }

        case 'list': {
            const statusFilter = myArgs[1];

            if (statusFilter && !['todo', 'in-progress', 'done'].includes(statusFilter))
                throw new Error("Invalid list status. Choose from: todo, in-progress, done");

            const filteredTasks = statusFilter
                ? tasks.filter(t => t.status === statusFilter)
                : tasks;

            if (filteredTasks.length === 0) {
                console.log(statusFilter ? `No tasks found with status: ${statusFilter}` : "No tasks found.");
                break;
            }

            filteredTasks.forEach(task => {
                console.log(`[${task.status}] ID: ${task.id} - ${task.description}`);
            });
            break;
        }

        case 'update': {
            const targetId = parseId(myArgs[1]);
            const newDescription = myArgs.slice(2).join(' ');
            if (!newDescription)
                throw new Error("New description is required");

            const task = tasks.find(t => t.id === targetId);
            if (!task)
                throw new Error(`Task with ID ${targetId} not found`);

            task.description = newDescription;
            task.updatedAt = new Date().toISOString();

            console.log(`Task ${targetId} updated successfully.`);
            flag = true;
            break;
        }

        case 'delete': {
            const targetId = parseId(myArgs[1]);

            const index = tasks.findIndex(t => t.id === targetId);
            if (index === -1)
                throw new Error(`Task with ID ${targetId} not found`);

            tasks.splice(index, 1);
            console.log(`Task ${targetId} deleted successfully.`);
            flag = true;
            break;
        }

        case 'mark-in-progress':
        case 'mark-done': {
            const targetId = parseId(myArgs[1]);

            const task = tasks.find(t => t.id === targetId);
            if (!task)
                throw new Error(`Task with ID ${targetId} not found`);

            const newStatus = cmd === 'mark-in-progress' ? 'in-progress' : 'done';
            task.status = newStatus;
            task.updatedAt = new Date().toISOString();

            console.log(`Task ${targetId} marked as ${newStatus}.`);
            flag = true;
            break;
        }

        default:
            throw new Error(`Unknown command: "${cmd}"`);
    }

    if (flag)
        saveTasks(tasks);
}
catch (err) 
{
    console.error(`Error: ${err.message}`);
    process.exit(1);
}
