import Project from "./project";

function renderProjects() {
  const ul = globalThis.document.getElementById("projects")!;

  for (const projectName of Object.keys(localStorage)) {
    const li = document.createElement("li");
    li.className = "bg-blue-100 p-4 rounded-lg shadow-md cursor-pointer";
    li.innerHTML =
      `<h2 class="text-xl font-bold text-blue-500">${projectName}</h2>`;

    ul.appendChild(li);

    const project = new Project(projectName);
    li.addEventListener("click", () => {
      (globalThis.document.getElementById("todo-input") as HTMLInputElement)
        .disabled = false;
      (globalThis.document.getElementById("todo-action") as HTMLInputElement)
        .disabled = false;

      project.render();
    });
  }
}

renderProjects();

globalThis.document.getElementById("project-action")!.addEventListener(
  "click",
  () => {
    const projectName =
      (globalThis.document.getElementById("project-input") as HTMLInputElement)
        .value;
    if (projectName) {
      localStorage.setItem(projectName, JSON.stringify([]));
      renderProjects();
      (globalThis.document.getElementById("project-input") as HTMLInputElement)
        .value = "";
    }
  },
);
