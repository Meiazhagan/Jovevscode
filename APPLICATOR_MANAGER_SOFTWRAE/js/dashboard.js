/* =========================================================
   MACHINE DATA
========================================================= */

const machineList = document.getElementById("machineList");


const machineTypes = [

    "Packaging Machine",
    "Filling Machine",
    "Conveyor System",
    "Pump Station",
    "Mixing Machine",
    "Compressor",
    "Reactor System",
    "Blower System",
    "Centrifuge",
    "Grinding Machine",
    "Processing Machine",
    "Cooling System"

];


const areas = [

    "Production Area",
    "Packaging Area",
    "Utility Area",
    "Process Area"

];


const statuses = [

    {
        name: "RUNNING",
        className: "status-green",
        dot: "green"
    },

    {
        name: "STOPPED",
        className: "status-red",
        dot: "red"
    },

    {
        name: "WARNING",
        className: "status-orange",
        dot: "orange"
    },

    {
        name: "OFFLINE",
        className: "status-grey",
        dot: "grey"
    }

];


/* =========================================================
   CREATE MACHINE
========================================================= */

function createMachine(machineNumber) {


    const machineID =
        "M" +
        String(machineNumber).padStart(3, "0");


    const machineType =
        machineTypes[
            (machineNumber - 1)
            % machineTypes.length
        ];


    const machineName =
        machineType +
        " " +
        String(
            ((machineNumber - 1)
            % 10) + 1
        ).padStart(2, "0");


    const area =
        areas[
            (machineNumber - 1)
            % areas.length
        ];


    /*
       Status distribution

       Most machines = Running
       Some = Stopped
       Some = Warning
       Few = Offline
    */

    let status;


    if (machineNumber % 23 === 0) {

        status = statuses[3];

    }

    else if (machineNumber % 11 === 0) {

        status = statuses[2];

    }

    else if (machineNumber % 8 === 0) {

        status = statuses[1];

    }

    else {

        status = statuses[0];

    }


    /* Random display values */

    let temperature = "--";

    let speed = "0 RPM";


    if (status.name !== "STOPPED"
        &&
        status.name !== "OFFLINE") {

        temperature =
            (
                55 +
                Math.random() * 30
            ).toFixed(1)
            +
            " °C";


        speed =
            Math.floor(
                900 +
                Math.random() * 1200
            )
            +
            " RPM";

    }


    /* Create HTML */

    const row =
        document.createElement("a");


    row.href =
        "machine.html?id=" +
        machineID;


    row.className =
        "machine-row";


    row.innerHTML = `

        <div class="machine-number">

            ${machineNumber}

        </div>


        <div class="machine-name">

            <strong>
                ${machineID}
                —
                ${machineName}
            </strong>

            <span>
                ${area}
            </span>

        </div>


        <div class="machine-state
                    ${status.className}">

            <span class="dot ${status.dot}">
            </span>

            ${status.name}

        </div>


        <div class="machine-value">

            ${temperature}

            &nbsp; | &nbsp;

            ${speed}

        </div>

    `;


    return row;

}


/* =========================================================
   CREATE 300 MACHINES
========================================================= */

function loadMachines() {


    machineList.innerHTML = "";


    /*
       Create TWO copies.

       This allows the CSS animation to
       continuously scroll without a gap.
    */


    for (
        let copy = 0;
        copy < 2;
        copy++
    ) {


        for (
            let i = 1;
            i <= 300;
            i++
        ) {

            machineList.appendChild(
                createMachine(i)
            );

        }

    }

}


/* =========================================================
   CURRENT DATE AND TIME
========================================================= */

function updateDateTime() {


    const now =
        new Date();


    const dateOptions = {

        day: "2-digit",

        month: "short",

        year: "numeric"

    };


    const date =
        now
        .toLocaleDateString(
            "en-IN",
            dateOptions
        )
        .toUpperCase();


    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }
        );


    document.getElementById(
        "currentDate"
    ).textContent = date;


    document.getElementById(
        "currentTime"
    ).textContent = time;

}


/* =========================================================
   START APPLICATION
========================================================= */

loadMachines();


updateDateTime();


setInterval(
    updateDateTime,
    1000
);