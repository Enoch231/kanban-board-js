export default class Kanban {
  static getTasks(columnId) {
    const data = read().find((column) => column.columnId == columnId);
    if (!data) {
      return [];
    }
    return data.tasks;
  }

  static insertTask(columnId, content) {
    const data = read();
    const column = data.find((column) => column.columnId == columnId);
    const task = {
      taskId: Math.floor(Math.random() * 100000),
      content: content,
    };
    column.tasks.push(task);
    save(data);
    return task;
  }

  static updateTask(taskId, updatedInformation) {
    const data = read();

    function findColumnTask() {
      for (const column of data) {
        const task = column.tasks.find((taskItem) => {
          return taskItem.taskId == taskId;
        });

        if (task) {
          return [task, column];
        }
      }
    }
    const [task, currentColumn] = findColumnTask();

    const targetColumn = data.find((column) => {
      return column.columnId == updatedInformation.columnId;
    });
    task.content = updatedInformation.content;
    currentColumn.tasks.splice(currentColumn.tasks.indexOf(task), 1);
    targetColumn.tasks.push(task);

    save(data);
  }

  static deleteTask(taskId) {
    const data = read();

    for (const column of data) {
      const taskItem = column.tasks.find((task) => {
        return task.taskId == taskId;
      });
      if (taskItem) {
        column.tasks.splice(column.tasks.indexOf(taskItem), 1);
      }
    }
    save(data);
  }

  static getAllTasks() {
    columnCount();
    const data = read();
    return [data[0].tasks, data[1].tasks, data[2].tasks];
  }
}

function read() {
  const data = localStorage.getItem("data");
  if (!data) {
    return [
      { columnId: 0, tasks: [] },
      { columnId: 1, tasks: [] },
      { columnId: 2, tasks: [] },
    ];
  }
  return JSON.parse(data);
}

function save(data) {
  localStorage.setItem("data", JSON.stringify(data));
  columnCount();
}

function columnCount() {
  const data = read();

  const todo = document.querySelector(".title .todo_count");
  todo.textContent = data[0].tasks.length;

  const pending = document.querySelector(".title .progress_count");
  pending.textContent = data[1].tasks.length;

  const completed = document.querySelector(".title .completed_count");
  completed.textContent = data[2].tasks.length;
}
