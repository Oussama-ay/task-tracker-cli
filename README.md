# Task Tracker CLI

A simple command-line task tracker built with Node.js.

**Project URL:** https://roadmap.sh/projects/task-tracker

## Features

* Add tasks
* List all tasks
* List tasks by status
* Update task descriptions
* Delete tasks
* Mark tasks as in progress
* Mark tasks as done
* Store tasks in a local JSON file

## Requirements

* Node.js

## Usage

### Add a task

```bash
node index.js add "Learn Node.js"
```

### List all tasks

```bash
node index.js list
```

### List tasks by status

```bash
node index.js list todo
node index.js list in-progress
node index.js list done
```

### Update a task

```bash
node index.js update 1 "Learn Node.js deeply"
```

### Mark a task as in progress

```bash
node index.js mark-in-progress 1
```

### Mark a task as done

```bash
node index.js mark-done 1
```

### Delete a task

```bash
node index.js delete 1
```

## Task Structure

Tasks are stored in `tasks.json`:

```json
{
  "id": 1,
  "description": "Learn Node.js",
  "status": "todo",
  "createdAt": "2026-06-20T12:00:00.000Z",
  "updatedAt": "2026-06-20T12:00:00.000Z"
}
```
