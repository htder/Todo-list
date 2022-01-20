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
// // add event listeners to tasks
// // show details slider when down arrow is pressed
// // change arrow icon when details are showing and when they are not
// // completing task - how does it interact with data
//
// // strike through the title when the task is complete
// // show edit slider when edit is pressed
// // showing task priority colour as the left border colour of the task
// // deleteing task - how does it interact with data
// // populate the today and this week views with the correct tasks
// // populate each project with the correct tasks
// // add localstorage to project
//
//

import { isSameWeek, isSameDay } from "date-fns";

import { TodoTask } from "./task.js";
import { Project } from "./project.js";

let model = {
  tasks: [
    TodoTask(
      "Hello World",
      "one two three",
      "2022-01-21",
      true,
      "high",
      "Starter"
    ),
    TodoTask(
      "World Hello",
      "one two three",
      "2022-01-20",
      false,
      "low",
      "Starter"
    ),
    TodoTask(
      "One One One",
      "One Hello",
      "2022-09-17",
      true,
      "middle",
      "Starter"
    ),
  ],
  projects: [Project("Starter")],
};

const storage = (function () {
  const modelChanged = () => {
    writeStorage();
    readStorage();
  };

  function writeStorage() {
    window.localStorage.setItem("model", JSON.stringify(model));
  }

  function readStorage() {
    if (window.localStorage.getItem("model")) {
      model = JSON.parse(window.localStorage.getItem("model"));
    }
  }

  function resetStorage() {
    localStorage.setItem("model", JSON.stringify(model));
  }
  return { writeStorage, readStorage, resetStorage };
})();

// RUN TO CLEAR LOCAL STORAGE
// storage.resetStorage();

storage.readStorage();

let weeksTasks = [];
let todaysTasks = [];
let projectTasks = [];

const menuController = (function () {
  const sidebar = document.querySelector(".sidebar");

  sidebar.addEventListener("click", (event) => {
    removeActive();
    if (event.target.closest("a") === null) return;
    event.target.closest("a").classList.add("active");

    const todayButton = event.target.classList.contains("today");
    const weekButton = event.target.classList.contains("week");
    const homeButton = event.target.classList.contains("home");
    const project = event.target.classList.contains("project");

    if (homeButton) {
      todoView.removeAllTasks();
      model.tasks.forEach((task) => todoView.addTodoToView(task));
    }

    if (todayButton) {
      const currentTasks = [];
      model.tasks.forEach((task) => {
        if (isSameDay(new Date(task.dueDate), new Date())) {
          currentTasks.push(task);
        }
      });
      todaysTasks = currentTasks;
      todoView.removeAllTasks();
      todaysTasks.forEach((task) => todoView.addTodoToView(task));
    }

    if (weekButton) {
      const currentTasks = [];
      model.tasks.forEach((task) => {
        if (isSameWeek(new Date(task.dueDate), new Date())) {
          currentTasks.push(task);
        }
      });
      weeksTasks = currentTasks;
      todoView.removeAllTasks();
      weeksTasks.forEach((task) => todoView.addTodoToView(task));
    }

    if (project) {
      const projectName =
        event.target.closest(".nav-item").lastChild.childNodes[2].textContent;
      console.log(projectName);

      const currentTasks = [];
      model.tasks.forEach((task) => {
        if (task.project === projectName) {
          currentTasks.push(task);
        }
      });
      projectTasks = currentTasks;
      todoView.removeAllTasks();
      projectTasks.forEach((task) => todoView.addTodoToView(task));
    }
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
      // add project to localstorage
      storage.writeStorage();
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
      <a href="#" class="nav-link menu-button link-dark rounded project">
        <img
          class="bi me-2 project"
          width="16"
          height="16"
          src="../icons/arrow-right-short.svg"
        /><span class="d-none d-sm-inline project">${project.title}</span></a
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
      // add todo to local storage
      storage.writeStorage();

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
    const taskDate = new Date(`${value}`);
    const [year, month, day] = value.split("-");
    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth() + 1;
    const cYear = currentDate.getFullYear();

    if (+year === cYear && +month === cMonth && +day === cDay) {
      return false;
    } else {
      return !(taskDate > currentDate);
    }
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

  const removeAllTasks = () => {
    while (todoContainer.firstChild) {
      todoContainer.removeChild(todoContainer.lastChild);
    }
  };

  const addTodoToView = (todo) => {
    todoContainer.appendChild(createTodoComponent(todo));
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
    ${todo.completed ? `<del>${todo.title}</del>` : `${todo.title}`}
  </div>
    <div
        class="col-md-1 d-flex align-items-center justify-md-start justify-content-center task-arrow"
         >
        <img
         class="task-arrow-image-down"
         width="16"
         height="16"
         src="../icons/caret-down.svg"
         />
    </div>
  <div
    class="col-md-2 d-flex align-items-center justify-content-md-start justify-content-center"
  >
    ${todo.dueDate}
  </div>
  <div
    class="col-md-1 d-flex align-items-center justify-md-start justify-content-center"
  >
      <img
        class="task-edit"
        width="16"
        height="16"
        src="../icons/pencil-square.svg"
      />

  </div>
  <div
    class="col-md-1 d-flex align-items-center justify-md-start justify-content-center"
  >
      <img
        class="task-delete"
        width="16"
        height="16"
        src="../icons/trash.svg"
      />
  </div>`;
    const newElement = document.createElement("div");
    newElement.classList = `row m-4 p-2 bg-white rounded-3 border-bottom  ${
      todo.priority === "high"
        ? "red-border"
        : todo.priority === "middle"
        ? "orange-border"
        : "green-border"
    }`;
    newElement.innerHTML = html;
    return newElement;
  };

  return { addTodoToView, removeAllTasks };
})();

const tasksListener = (function () {
  const todoMainContainer = document.querySelector(".todo-main-container");

  todoMainContainer.addEventListener("click", (event) => {
    const checkboxContainer = event.target.classList.contains("task-checkbox");
    const arrowContainer =
      event.target.classList.contains("task-arrow-image-down") ||
      event.target.classList.contains("task-arrow-image-up");
    const editContainer = event.target.classList.contains("task-edit");
    const deleteContainer = event.target.classList.contains("task-delete");

    const homeActive = document.querySelector(".home-active");

    if (checkboxContainer) {
      const row = Array.from(event.target.parentNode.parentNode.childNodes);
      const title = row[3].textContent.trim();
      const date = row[7].textContent.trim();

      const task = model.tasks.filter(
        (task) => task.title === title && task.dueDate === date
      );
      task[0].completed = !task[0].completed;
      if (task[0].completed) {
        row[3].innerHTML = `<del>${row[3].innerHTML}</del>`;
      } else {
        row[3].innerHTML = row[3].innerHTML.replace(/(<([^>]+)>)/gi, "");
      }
      storage.writeStorage();
    }

    if (arrowContainer) {
      let title;
      let date;
      let div;
      let arrow;

      if (event.target.classList.contains("task-arrow-image-down")) {
        const row = Array.from(event.target.parentNode.parentNode.childNodes);
        let arrowImageDiv = event.target.parentNode;
        div = event.target.parentNode.parentNode;
        console.log(row);
        console.log(div);
        title = row[3].textContent.trim();
        date = row[7].textContent.trim();
        arrowImageDiv.innerHTML = upArrowHtml();

        console.log(title, date);

        const task = model.tasks.filter(
          (task) => task.title === title && task.dueDate === date
        );
        console.log(task);
        const descDiv = createDescriptionDiv(task);
        div.insertAdjacentElement("afterend", descDiv);
      }

      if (event.target.classList.contains("task-arrow-image-up")) {
        const row = Array.from(event.target.parentNode.parentNode.childNodes);
        let arrowImageDiv = event.target.parentNode;
        div = event.target.parentNode.parentNode;
        title = row[3].textContent.trim();
        date = row[7].textContent.trim();
        arrowImageDiv.innerHTML = downArrowHtml();

        div.nextElementSibling.remove();
      }
    }

    if (editContainer) {
      const row = Array.from(event.target.parentNode.parentNode.childNodes);
      console.log(row);
      let title = row[3].textContent.trim();
      let date = row[7].textContent.trim();
      const task = model.tasks.filter(
        (task) => task.title === title && task.dueDate === date
      );
      console.log(task);
      todoEditModal.fillForm(task);
      todoEditModal.open();
    }

    if (deleteContainer) {
      const row = Array.from(event.target.parentNode.parentNode.childNodes);
      let title = row[3].textContent.trim();
      let date = row[7].textContent.trim();
      const task = model.tasks.filter(
        (task) => task.title === title && task.dueDate === date
      );
      let index;
      model.tasks.filter((t, i) => {
        if (
          task[0].title === t.title &&
          task[0].description === t.description &&
          task[0].dueDate === t.dueDate
        ) {
          index = i;
        }
      });

      model.tasks.splice(index, 1);
      removeActive();
      homeActive.classList.add("active");
      todoView.removeAllTasks();
      model.tasks.forEach((task) => todoView.addTodoToView(task));
      storage.writeStorage();
    }
  });

  const upArrowHtml = () => {
    const html = `
    <img
        class="task-arrow-image-up"
        width="16"
        height="16"
        src="../icons/caret-up.svg"
    />`;
    return html;
  };

  const downArrowHtml = () => {
    const html = `
    <img
        class="task-arrow-image-down"
        width="16"
        height="16"
        src="../icons/caret-down.svg"
    />`;
    return html;
  };

  const createDescriptionDiv = (task) => {
    console.log(task);
    const html = `
    <div class="container-fluid py-1">
      <h6 class="fw-bold">Description</h6>
      <p class="">
      ${task[0].description}
      </p>
  </div>`;

    const detailsDiv = document.createElement("div");
    detailsDiv.classList =
      "modal-body mx-5 my-3 bg-light rounded-3 border border-secondary p-3 rounded-3 description-div";
    detailsDiv.innerHTML = html;
    return detailsDiv;
  };

  return {};
})();

const todoEditModal = (function () {
  const modal = document.querySelector(".edit-modal");
  const form = document.getElementById("edit-modal-form");
  const submit = document.querySelector(".edit-submit");
  const cancel = document.querySelector(".edit-cancel");

  const homeActive = document.querySelector(".home-active");

  let currentTask;

  const open = () => {
    modal.classList.remove("hide");
    modal.classList.add("show");
  };

  const close = () => {
    modal.classList.remove("show");
    modal.classList.add("hide");
  };

  const fillForm = (task) => {
    currentTask = task;
    console.log(currentTask);
    form["title"].value = task[0].title;
    form["description"].value = task[0].description;
    form["dueDate"].value = task[0].dueDate;
  };

  cancel.addEventListener("click", () => {
    todoModalValidation.clearForm(form);
    close();
  });

  submit.addEventListener("click", (event) => {
    console.log(currentTask);
    event.preventDefault();
    const title = form["title"];
    const description = form["description"];
    const dueDate = form["dueDate"];
    // validate form elements
    let titleValid = todoModalValidation.checkTitle(title),
      descriptionValid = todoModalValidation.checkDescription(description),
      dateValid = todoModalValidation.checkDate(dueDate);

    let isFormValid = titleValid && descriptionValid && dateValid;
    if (isFormValid) {
      // create todo
      console.log(currentTask);
      const newTodo = TodoTask(
        title.value,
        description.value,
        dueDate.value,
        currentTask[0].completed,
        currentTask[0].priority,
        currentTask[0].project
      );
      console.log(newTodo);

      let index;
      model.tasks.filter((t, i) => {
        if (
          currentTask[0].title === t.title &&
          currentTask[0].description === t.description &&
          currentTask[0].dueDate === t.dueDate
        ) {
          index = i;
        }
      });

      model.tasks.splice(index, 1, newTodo);

      // clear form
      todoModalValidation.clearForm(form);

      removeActive();
      homeActive.classList.add("active");
      todoView.removeAllTasks();
      model.tasks.forEach((task) => todoView.addTodoToView(task));

      // close modal
      storage.writeStorage();
      close();
    }
  });

  return { open, close, fillForm };
})();

model.projects.forEach((project) => projectMenuView.addProjectToView(project));
model.tasks.forEach((task) => todoView.addTodoToView(task));
