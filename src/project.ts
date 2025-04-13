interface Todo {
  name: string;
  finished: boolean;
  priority: "low" | "medium" | "high";
}

export default class Project {
  projectName: string;
  entries: Todo[] = [];
  static abortController = new AbortController();

  constructor(projectName: string) {
    this.projectName = projectName;
    this.entries = JSON.parse(localStorage.getItem(projectName) || "[]");
  }
  saveEntries() {
    localStorage.setItem(this.projectName, JSON.stringify(this.entries));
  }
  addEntry(entry: Todo) {
    this.entries.push(entry);
    this.saveEntries();
  }
  deleteEntry(index: number) {
    this.entries.splice(index, 1);
    this.saveEntries();
  }
  render() {
    const loading = document.getElementById("loading")!;
    loading.classList.add("hidden");

    const ul = document.getElementById("todos")!;
    ul.innerHTML = "";

    this.entries.forEach((entry) => {
      const colorMap: Record<string, string> = {
        low: "green-200",
        medium: "yellow-200",
        high: "red-200",
      };

      const li = document.createElement("li");
      li.className = "flex items-center justify-between";
      li.innerHTML = `
        <div class="flex items-center">
          <div class="h-4 w-4 rounded-full border-2 border-gray-300 mr-2 bg-${
        colorMap[entry.priority]
      }" id="priority-switch"></div>
          ${entry.name}
        </div>
        <div>
          <button class="bg-blue-500 text-white px-4 py-1 rounded" id="switch-finish">
            ${entry.finished ? "Unfinish" : "Finish"}
          </button>
          <button class="bg-red-500 text-white px-4 py-1 rounded" id="delete-entry">
            Delete
          </button>
        </div>
      `;
      ul.appendChild(li);
    });

    const addButton = document.getElementById("todo-action")!;
    const input = document.getElementById("todo-input") as HTMLInputElement;

    Project.abortController.abort();
    Project.abortController = new AbortController();

    addButton.addEventListener("click", () => {
      const entryName = input.value;
      if (entryName) {
        this.addEntry({ name: entryName, finished: false, priority: "low" });
        input.value = "";
        this.render();
      }
    }, {
      signal: Project.abortController.signal,
    });

    const deleteButtons = document.querySelectorAll("#delete-entry");
    deleteButtons.forEach((button) =>
      button.addEventListener("click", (event) => {
        const target = event.target as HTMLButtonElement;
        const li = target.closest("li");
        if (li) {
          const index = Array.from(li.parentNode!.children).indexOf(li);
          this.deleteEntry(index);
          this.saveEntries();
          this.render();
        }
      })
    );
    const finishButtons = document.querySelectorAll("#switch-finish");
    finishButtons.forEach((button) =>
      button.addEventListener("click", (event) => {
        const target = event.target as HTMLButtonElement;
        const li = target.closest("li");
        if (li) {
          const index = Array.from(li.parentNode!.children).indexOf(li);
          this.entries[index].finished = !this.entries[index].finished;
          this.saveEntries();
          this.render();
        }
      })
    );
    const prioritySwitches = document.querySelectorAll("#priority-switch");
    prioritySwitches.forEach((button) =>
      button.addEventListener("click", (event) => {
        const target = event.target as HTMLDivElement;
        const li = target.closest("li");
        if (li) {
          const index = Array.from(li.parentNode!.children).indexOf(li);
          this.entries[index].priority = this.entries[index].priority === "low"
            ? "medium"
            : this.entries[index].priority === "medium"
            ? "high"
            : "low";
          this.saveEntries();
          this.render();
        }
      })
    );
  }
}
