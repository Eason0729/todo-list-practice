interface Entry {
  name: string;
  finished: boolean;
}

class Entries {
  entries: Entry[] = [];

  constructor() {
    this.entries = JSON.parse(localStorage.getItem("entries") || "[]");
  }
  saveEntries() {
    localStorage.setItem("entries", JSON.stringify(this.entries));
  }
  addEntry(entry: Entry) {
    this.entries.push(entry);
    this.saveEntries();
  }
  deleteEntry(index: number) {
    this.entries.splice(index, 1);
    this.saveEntries();
  }
  displayEntries() {
    const loading = document.getElementById("loading")!;
    loading.classList.add("hidden");

    const ul = document.getElementById("entries")!;
    ul.innerHTML = "";

    this.entries.forEach((entry) => {
      const li = document.createElement("li");
      li.className = "flex items-center justify-between";
      li.innerHTML = `
        <div>${entry.name}</div>
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
    const deleteButtons = document.querySelectorAll("#delete-entry");
    const finishButtons = document.querySelectorAll("#switch-finish");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", deleteEntry);
    });
    finishButtons.forEach((button) => {
      button.addEventListener("click", switchFinish);
    });
  }
}

function switchFinish(event: Event) {
  const target = event.target as HTMLButtonElement;
  const li = target.closest("li");
  if (li) {
    const index = Array.from(li.parentNode!.children).indexOf(li);
    entries.entries[index].finished = !entries.entries[index].finished;
    entries.saveEntries();
    entries.displayEntries();
  }
}

function deleteEntry(event: Event) {
  const target = event.target as HTMLButtonElement;
  const li = target.closest("li");
  if (li) {
    const index = Array.from(li.parentNode!.children).indexOf(li);
    entries.deleteEntry(index);
    entries.displayEntries();
  }
}

var entries = new Entries();
entries.displayEntries();

globalThis.document.getElementById("add-action")?.addEventListener(
  "click",
  () => {
    const input = document.getElementById("add-input") as HTMLInputElement;
    const name = input.value.trim();
    if (name) {
      entries.addEntry({ name, finished: false });
      input.value = "";
      entries.displayEntries();
    }
  },
);
