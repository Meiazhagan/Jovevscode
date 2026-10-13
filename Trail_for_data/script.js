
async function fetchMachineData() {
    const message = document.getElementById("message");
    const tableBody = document.getElementById("machineData");

    try {
        message.textContent = "Loading data...";

        const response = await fetch("/api/machines");

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }

        const records = await response.json();

        // Handle an API error returned as JSON
        if (!Array.isArray(records)) {
            throw new Error(records.error || "Invalid data received");
        }

        // Update total number of records
        document.getElementById("totalRecords").textContent =
            records.length;

        // Clear the existing table
        tableBody.innerHTML = "";

        if (records.length === 0) {
            tableBody.innerHTML =
                '<tr><td colspan="6">No records found.</td></tr>';

            document.getElementById("latestTemperature").textContent = "--";
            document.getElementById("latestPressure").textContent = "--";
            document.getElementById("latestStatus").textContent = "--";

            message.textContent = "No data available.";
            return;
        }

        // Sort newest records first
        records.sort((a, b) => {
            const dateA = new Date(a.recorded_at || 0).getTime();
            const dateB = new Date(b.recorded_at || 0).getTime();

            if (dateA !== dateB) {
                return dateB - dateA;
            }

            return Number(b.entry_id) - Number(a.entry_id);
        });

        const latest = records[0];

        document.getElementById("latestTemperature").textContent =
            latest.temperature ?? "--";

        document.getElementById("latestPressure").textContent =
            latest.pressure ?? "--";

        document.getElementById("latestStatus").textContent =
            latest.machine_status === 1 ? "Running" :
            latest.machine_status === 0 ? "Stopped" :
            latest.machine_status ?? "--";

        // Display database records in the HTML table
        records.forEach(record => {
            const row = document.createElement("tr");

            const statusText =
                record.machine_status === 1 ? "Running" :
                record.machine_status === 0 ? "Stopped" :
                record.machine_status ?? "--";

            const statusClass =
                record.machine_status === 1 ? "status-running" :
                record.machine_status === 0 ? "status-stopped" : "";

            const values = [
                record.id,
                record.entry_id,
                record.recorded_at,
                record.temperature,
                record.pressure
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "--";
                row.appendChild(cell);
            });

            const statusCell = document.createElement("td");
            statusCell.textContent = statusText;
            statusCell.className = statusClass;
            row.appendChild(statusCell);

            tableBody.appendChild(row);
        });

        message.textContent =
            "Last refreshed: " + new Date().toLocaleTimeString();

    } catch (error) {
        console.error("Error fetching machine data:", error);
        message.textContent = "Unable to load data. Check Flask and MySQL.";
        tableBody.innerHTML =
            '<tr><td colspan="6">Failed to load records.</td></tr>';
    }
}

// Load data when the page opens
fetchMachineData();

// Refresh automatically every 5 seconds
setInterval(fetchMachineData, 5000);
