const filesGrid = document.getElementById("files-grid");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("empty-state");
const errorState = document.getElementById("error-state");
const fileCount = document.getElementById("file-count");
const refreshButton = document.getElementById("refresh-btn");

function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, index);

    return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function createFileCard(file) {
    const card = document.createElement("article");
    card.className = "file-card";

    const extension = file.extension.replace(".", "") || "file";

    card.innerHTML = `
        <div class="file-icon">${extension}</div>
        <h3 class="file-name"></h3>
        <p class="file-meta">${formatBytes(file.size)}</p>
        <a class="download-btn" href="${file.download_url}" download>Download</a>
    `;

    card.querySelector(".file-name").textContent = file.name;
    return card;
}

async function loadFiles() {
    loading.classList.remove("hidden");
    emptyState.classList.add("hidden");
    errorState.classList.add("hidden");
    filesGrid.innerHTML = "";

    try {
        const response = await fetch("/api/files");
        if (!response.ok) throw new Error("Could not load files.");

        const data = await response.json();
        const files = data.files || [];

        fileCount.textContent = `${files.length} file${files.length === 1 ? "" : "s"}`;

        if (files.length === 0) {
            emptyState.classList.remove("hidden");
            return;
        }

        files.forEach((file) => filesGrid.appendChild(createFileCard(file)));
    } catch (error) {
        errorState.textContent = error.message;
        errorState.classList.remove("hidden");
        fileCount.textContent = "Unable to load files";
    } finally {
        loading.classList.add("hidden");
    }
}

refreshButton.addEventListener("click", loadFiles);
loadFiles();
