// Todo List Item needs a:
// - project belongs to
// - title
// - description
// - due date
// - completed check box
// - red, orange or green for different priorities

// Factory function for a todo list item

// Project needs a:
// - list of zero or more todo items

// Factory function for a project

// Views:
// - sidebar view
// - project view
// - all task view
// - today's tasks view
// - this week's tasks view
// - project's tasks view

// Modals:
// - edit todo item
// - create new todo item
// - create new project

// Todo Controller:
// - delete todo
// - show edit modal
// - expand details

// Project Controller:
// - delete project

//
//
//
//
// // changing active button on the menu
// // adding project modal when new project is pressed
// // adding new todo task modal when add a new project is pressed
// // decide on how data for tasks is stored
// // submitting project modal adds a new project - how is it stored?
// // submitting todo task modal adds a new task - how is it stored?
// add event listeners to tasks
// show details slider when down arrow is pressed
// change arrow icon when details are showing and when they are not
// show edit slider when edit is pressed
// showing task priority colour as the left border colour of the task
// completing task - how does it interact with data
// strike through the title when the task is complete
// deleteing task - how does it interact with data
// populate the today and this week views with the correct tasks
// populate each project with the correct tasks
//
//
//

import { TodoTask } from "./task.js";
import { Project } from "./project.js";

const model = {
  tasks: [
    TodoTask("Hello World", "one two three", "2022-01-21", true, "high", "All"),
    TodoTask(
      "World Hello",
      "one two three",
      "2022-02-01",
      false,
      "low",
      "Project 2"
    ),
    TodoTask(
      "One One One",
      "one two three",
      "2022-09-17",
      true,
      "middle",
      "Project 2"
    ),
    TodoTask(
      "Two Two Two",
      "one two three",
      "2022-01-09",
      false,
      "high",
      "Project 3"
    ),
    TodoTask(
      "Three Three Three",
      "one two three",
      "2022-12-25",
      false,
      "high",
      "All"
    ),
  ],
  projects: [Project("All"), Project("Project 2"), Project("Project 3")],
};

const menuController = (function () {
  const sidebar = document.querySelector(".sidebar");
  sidebar.addEventListener("click", (event) => {
    removeActive();
    if (event.target.closest("a") === null) return;
    event.target.closest("a").classList.add("active");
  });
})();

function removeActive() {
  let buttons = Array.from(document.querySelectorAll(".menu-button"));
  buttons.forEach((button) => button.classList.remove("active"));
}

const projectModal = (function () {
  const modal = document.querySelector(".project-modal");
  const openModal = document.querySelector(".new-project-button");
  const closeModal = document.querySelector(".project-modal-close");
  const submit = document.querySelector(".project-submit");
  const form = document.getElementById("new-project-form");

  openModal.addEventListener("click", () => {
    showModal();
  });

  closeModal.addEventListener("click", () => {
    hideModal();
  });

  submit.addEventListener("click", (event) => {
    event.preventDefault();
    const title = form["title"];
    const titleValid = projectModalValidation.checkTitle(title);
    if (titleValid) {
      // create project
      const newProject = Project(title.value);
      // push project to storage
      model.projects.push(newProject);
      // render project
      projectMenuView.addProjectToView(newProject);
      // clear form
      projectModalValidation.clearForm(form);
      // close modal
      hideModal();
    }
  });

  const showModal = function () {
    modal.classList.remove("hide");
    modal.classList.add("show");
  };

  const hideModal = function () {
    modal.classList.remove("show");
    modal.classList.add("hide");
  };
})();

const projectModalValidation = (function () {
  const isRequired = (value) => {
    return value === "";
  };

  const showError = (input, message) => {
    input.classList.add("error");
  };

  const showSuccess = (input) => {
    input.classList.remove("error");
  };

  const checkTitle = (element) => {
    let valid = false;
    const title = element.value.trim();
    if (isRequired(title)) {
      showError(element, "Title cannot be empty.");
    } else {
      showSuccess(element);
      valid = true;
    }
    return valid;
  };

  const clearForm = (form) => {
    form["title"].value = "";
  };
  return { checkTitle, clearForm };
})();

const projectMenuView = (function () {
  const projectMenu = document.querySelector(".project-menu");
  const formProjectList = document.querySelector(".form-project-selector");

  const addProjectToView = (project) => {
    projectMenu.appendChild(createProjectComponent(project));
  };

  const createProjectComponent = (project) => {
    const html = `
      <a href="#" class="nav-link menu-button link-dark rounded">
        <img
          class="bi me-2"
          width="16"
          height="16"
          src="../icons/arrow-right-short.svg"
        /><span class="d-none d-sm-inline">${project.title}</span></a
      >`;
    const newElement = document.createElement("li");
    newElement.classList = "nav-item m-1";
    newElement.innerHTML = html;
    return newElement;
  };

  const addProjectToTodoSelectorForm = () => {
    let html = "";
    model.projects.forEach((project) => {
      html += `<option>${project.title}</option>`;
    });
    formProjectList.innerHTML = html;
  };
  return { addProjectToView, addProjectToTodoSelectorForm };
})();

const todoModal = (function () {
  const modal = document.querySelector(".task-modal");
  const openModal = document.querySelector(".todo-new-task");
  const closeModal = document.querySelector(".todo-modal-close");
  const form = document.getElementById("new-todo-form");
  const submit = document.querySelector(".todo-submit");

  openModal.addEventListener("click", () => {
    projectMenuView.addProjectToTodoSelectorForm();
    open();
  });

  closeModal.addEventListener("click", () => {
    close();
  });

  submit.addEventListener("click", (event) => {
    event.preventDefault();
    const formProjectSelect = document.querySelector(".form-project-selector");

    // get form elements
    const title = form["title"];
    const description = form["description"];
    const dueDate = form["dueDate"];
    const project =
      formProjectSelect.options[formProjectSelect.selectedIndex].value;
    const priority = form["optradio"].value;

    // validate form elements
    let titleValid = todoModalValidation.checkTitle(title),
      descriptionValid = todoModalValidation.checkDescription(description),
      dateValid = todoModalValidation.checkDate(dueDate);

    let isFormValid = titleValid && descriptionValid && dateValid;
    // const titleValid = projectModalValidation.checkTitle(title);
    if (isFormValid) {
      // create todo
      const newTodo = TodoTask(
        title.value,
        description.value,
        dueDate.value,
        false,
        priority,
        project
      );
      // push todo to storage
      model.tasks.push(newTodo);
      // render todo
      todoView.addTodoToView(newTodo);
      // clear form
      todoModalValidation.clearForm(form);
      // close modal
      close();
    }
  });

  const open = () => {
    modal.classList.remove("hide");
    modal.classList.add("show");
  };

  const close = () => {
    modal.classList.remove("show");
    modal.classList.add("hide");
  };
})();

const todoModalValidation = (function () {
  const isRequired = (value) => {
    return value === "";
  };

  const notInFuture = (value) => {
    const [year, month, day] = value.split("-");
    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth() + 1;
    const cYear = currentDate.getFullYear();
    return !(+year >= cYear && +month >= cMonth && +day >= cDay);
  };

  const showTitleError = (input, message) => {
    const error = document.querySelector(".titleError");
    error.textContent = message;
  };

  const showDescError = (input, message) => {
    const error = document.querySelector(".descError");
    error.textContent = message;
  };
  const showDateError = (input, message) => {
    const error = document.querySelector(".dateError");
    error.textContent = message;
  };

  const showTitleSuccess = (input, message) => {
    const error = document.querySelector(".titleError");
    error.textContent = "";
  };

  const showDescSuccess = (input, message) => {
    const error = document.querySelector(".descError");
    error.textContent = "";
  };
  const showDateSuccess = (input, message) => {
    const error = document.querySelector(".dateError");
    error.textContent = "";
  };

  const checkTitle = (element) => {
    let valid = false;
    const title = element.value.trim();
    if (isRequired(title)) {
      showTitleError(element, "Title cannot be empty.");
    } else {
      showTitleSuccess(element);
      valid = true;
    }
    return valid;
  };

  const checkDescription = (element) => {
    let valid = false;
    const description = element.value.trim();
    if (isRequired(description)) {
      showDescError(element, "Description cannot be empty.");
    } else {
      showDescSuccess(element);
      valid = true;
    }
    return valid;
  };

  const checkDate = (element) => {
    let valid = false;
    const dueDate = element.value.trim();
    if (isRequired(dueDate)) {
      showDateError(element, "Due date cannot be empty");
    }
    if (notInFuture(dueDate)) {
      showDateError(element, "Due date must be in the future.");
    } else {
      showDateSuccess(element);
      valid = true;
    }
    return valid;
  };

  const clearForm = (form) => {
    form["title"].value = "";
    form["description"].value = "";
    form["dueDate"].value = "";
  };
  return { checkTitle, checkDescription, checkDate, clearForm };
})();

const todoView = (function () {
  const todoContainer = document.querySelector(".todo-container");

  const addTodoToView = (todo) => {
    const firstChild = todoContainer.firstElementChild;
    firstChild.insertAdjacentElement("beforebegin", createTodoComponent(todo));
  };

  const createTodoComponent = (todo) => {
    const html = `
    <div
    class="col-md-1 py-1 d-flex justify-content-md-end justify-content-center"
  >
    <input type="checkbox" class="task-checkbox" ${
      todo.completed ? "checked" : ""
    }/>
  </div>
  <div
    class="col-md-6 d-flex align-items-center justify-content-md-start justify-content-center"
  >
    ${todo.title}
  </div>
  <div
    class="col-md-1 d-flex align-items-center justify-md-start justify-content-center"
  >
    <a href="#" class="nav-link link-dark">
      <img
        class=""
        width="16"
        height="16"
        src="../icons/caret-down.svg"
      />
    </a>
  </div>
  <div
    class="col-md-2 d-flex align-items-center justify-content-md-start justify-content-center"
  >
    ${todo.dueDate}
  </div>
  <div
    class="col-md-1 d-flex align-items-center justify-md-start justify-content-center"
  >
    <a href="#" class="nav-link link-dark">
      <img
        class=""
        width="16"
        height="16"
        src="../icons/pencil-square.svg"
      />
    </a>
  </div>
  <div
    class="col-md-1 d-flex align-items-center justify-md-start justify-content-center"
  >
    <a href="#" class="nav-link link-dark">
      <img
        class=""
        width="16"
        height="16"
        src="../icons/trash.svg"
      />
    </a>
  </div>`;
    const newElement = document.createElement("div");
    newElement.classList = "row m-4 p-2 bg-white rounded-3 border-bottom";
    newElement.innerHTML = html;
    return newElement;
  };

  return { addTodoToView };
})();

const tasksListener = (function () {
  const todoContainer = document.querySelector(".todo-container");
  todoContainer.addEventListener("click", (event) => {
    const checkboxContainer = event.target.classList.contains("task-checkbox");
    const arrowContainer = event.target.classList.contains("task-arrow");
    const editContainer = event.target.classList.contains("task-edit");
    const deleteContainer = event.target.classList.contains("task-delete");

    if (checkboxContainer) {
      const row = Array.from(event.target.parentNode.parentNode.childNodes);
      const title = row[3].textContent.trim();
      const date = row[7].textContent.trim();

      const task = model.tasks.filter(
        (task) => task.title === title && task.dueDate === date
      );
      console.log(task);
      task[0].completed = !task[0].completed;
    }
    console.log(model.tasks);
  });
  return {};
})();

model.projects.forEach((project) => projectMenuView.addProjectToView(project));
model.tasks.forEach((task) => todoView.addTodoToView(task));
