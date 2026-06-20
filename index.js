const { argv } = require('node:process');
const fs = require('fs')

try
{
    // skip the first two parametres
    let myArgs = argv.slice(2);

    // print process.argv
    // myArgs.forEach((val, index) => { console.log(`arg ${index} : ${val}`); });

    // read from tasks.json
    var tasks = JSON.parse(fs.readFileSync('tasks.json', 'utf8'));

    const cmd = myArgs[0]
    const args = myArgs.slice(1).join(' ');
    const nextId = tasks.length === 0 ? 1 : tasks.length

    if (cmd === 'add')
    {
        if (!args)
            throw Error("Description is required")
        const task = {
            id : nextId,
            description : args,
            status : "todo",
            createdAt : new Date().toISOString(),
            updatedAt : new Date().toISOString()
        }
        tasks.push(task)
    }
    else if (cmd === 'list')
    {
        tasks.forEach((task) => { console.log(`[${task.status}] ${task.id}: ${task.description}`); });
    }
    else if (cmd == 'mark-done')
    {
        if (!args)
            throw Error("ID is required")

        const targetId = Number(args)

        const task = tasks.find((t) => t.id === targetId)

        if (!task)
            throw Error(`Task with ID ${targetId} not found`);
        
        task.status = 'done'
        task.updatedAt = new Date().toISOString()
        console.log(`Task ${targetId} marked as done.`)
    }
    else
        console.log('Unkown command!');

    // write from tasks.json
    fs.writeFileSync('tasks.json',JSON.stringify(tasks));
}
catch (err)
{
    console.error(err.message);
}
