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
// submitting todo task modal adds a new task - how is it stored?
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
  tasks: [],
  projects: [Project("All"), Project("Project 2"), Project("Project 3")],
};

// const task = TodoTask("hello", "world", "today", "no", "yes", "work");
// console.log(task);
// console.log(task.due());
// const project = Project("completed todo");
// console.log(project);

const menuController = (function () {
  const sidebar = document.querySelector(".sidebar");
  sidebar.addEventListener("click", (event) => {
    removeActive();
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
    const title = form["title"].value;
    const titleValid = projectModalValidation.checkTitle(title);
    if (titleValid) {
      // create project
      const newProject = Project(title);
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
    const formField = input.parentElement;
    const error = formField.querySelector("small");
    error.textContent = message;
  };

  const checkTitle = (element) => {
    let valid = false;
    const title = element.trim();
    if (isRequired(title)) {
      showError(element, "Title cannot be empty.");
    } else {
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
    console.log(form);
    console.log(submit);
    // get form elements
    const title = form["title"].value;
    const description = form["description"].value;
    const dueDate = form["dueDate"].value;

    // validate form elements
    const titleValid = projectModalValidation.checkTitle(title);
    if (titleValid) {
      // create todo
      const newProject = Project(title);
      // push todo to storage
      model.projects.push(newProject);
      // render todo
      projectMenuView.addProjectToView(newProject);
      // clear form
      projectModalValidation.clearForm(form);
      // close modal
      hideModal();
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
  return {};
})();

model.projects.forEach((project) => projectMenuView.addProjectToView(project));
