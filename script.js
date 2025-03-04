document.addEventListener("DOMContentLoaded", function () {
    fetchCadets();

    document.getElementById("addCadetForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("cadetName").value;
        const regNo = document.getElementById("cadetRegNo").value;

        fetch("/add-cadet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, regNo })
        })
        .then(response => response.json())
        .then(() => {
            fetchCadets();  // Refresh table after adding cadet
            document.getElementById("addCadetForm").reset();
        })
        .catch(error => console.error("Error adding cadet:", error));
    });
});

function fetchCadets() {
    fetch("/get-cadets")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("cadetTableBody");
            tableBody.innerHTML = ""; // Clear existing rows

            data.forEach((cadet, index) => {
                const row = `<tr>
                    <td>${index + 1}</td>
                    <td>${cadet.name}</td>
                    <td>${cadet.regNo}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error("Error fetching cadets:", error));
}
