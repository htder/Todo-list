const TodoTask = function (
  title,
  description,
  dueDate,
  completed,
  priority,
  project
) {
  const task = {};

  task.title = title;
  task.description = description;
  task.dueDate = dueDate;
  task.completed = completed;
  task.priority = priority;
  task.project = project;

  task.due = function () {
    return `${title} due: ${dueDate}`;
  };

  return task;
};

export { TodoTask };
