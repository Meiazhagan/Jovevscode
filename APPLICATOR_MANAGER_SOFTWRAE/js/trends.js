/* ==========================================
   INDUSTRIAL IoT TREND MONITORING
   ========================================== */


/* ================= PARAMETERS ================= */

const parameterConfig = {

    temperature: {
        name: "Temperature",
        unit: "°C",
        min: 55,
        max: 90
    },

    pressure: {
        name: "Pressure",
        unit: "bar",
        min: 3,
        max: 10
    },

    current: {
        name: "Motor Current",
        unit: "A",
        min: 10,
        max: 50
    },

    voltage: {
        name: "Voltage",
        unit: "V",
        min: 380,
        max: 440
    },

    rpm: {
        name: "Motor RPM",
        unit: "RPM",
        min: 1000,
        max: 1800
    },

    vibration: {
        name: "Vibration",
        unit: "mm/s",
        min: 0,
        max: 10
    },

    power: {
        name: "Power",
        unit: "kW",
        min: 5,
        max: 30
    },

    production: {
        name: "Production",
        unit: "Units/hr",
        min: 100,
        max: 500
    }

};


/* ================= MACHINE LIST ================= */

const machineNames = {

    M001: "Packaging Machine 01",
    M002: "Filling Machine 02",
    M003: "Conveyor System 03",
    M004: "Pump Station 04",
    M005: "Mixing Machine 05",
    M006: "Compressor 06"

};


/* ================= CREATE MACHINE LIST ================= */

function generateMachines() {

    const select =
        document.getElementById("machineSelect");

    for (let i = 7; i <= 300; i++) {

        const id =
            "M" + String(i).padStart(3, "0");

        const types = [
            "Packaging Machine",
            "Filling Machine",
            "Conveyor System",
            "Pump Station",
            "Mixing Machine",
            "Compressor",
            "Reactor System",
            "Blower System",
            "Centrifuge",
            "Processing Machine"
        ];

        const type =
            types[(i - 1) % types.length];

        const option =
            document.createElement("option");

        option.value = id;

        option.textContent =
            `${id} - ${type} ${String(i).padStart(2, "0")}`;

        select.appendChild(option);

    }

}


/* ================= GENERATE TREND DATA ================= */

function generateTrendData(parameter) {

    const config =
        parameterConfig[parameter];

    const points = [];

    const count = 80;

    for (let i = 0; i < count; i++) {

        const variation =
            Math.sin(i * 0.35) * 0.15;

        const noise =
            (Math.random() - 0.5) * 0.15;

        const percentage =
            0.55 +
            variation +
            noise;

        let value =
            config.min +
            (config.max - config.min)
            * percentage;

        value =
            Math.max(
                config.min,
                Math.min(
                    config.max,
                    value
                )
            );

        points.push(value);

    }

    return points;

}


/* ================= DRAW TREND ================= */

function drawTrend(data) {

    const svgWidth = 1000;

    const svgHeight = 350;

    const config =
        parameterConfig[
            document.getElementById("parameterSelect").value
        ];


    const min =
        config.min;

    const max =
        config.max;


    const points = data.map(
        (value, index) => {

            const x =
                (index / (data.length - 1))
                * svgWidth;

            const y =
                svgHeight -
                (
                    (value - min)
                    /
                    (max - min)
                )
                * svgHeight;

            return `${x},${y}`;

        }
    );


    document
        .getElementById("trendLine")
        .setAttribute(
            "points",
            points.join(" ")
        );


    const areaPoints =
        `0,${svgHeight} ` +
        points.join(" ") +
        ` ${svgWidth},${svgHeight}`;


    document
        .getElementById("trendArea")
        .setAttribute(
            "points",
            areaPoints
        );


    /* Current point */

    const lastIndex =
        data.length - 1;

    const lastValue =
        data[lastIndex];

    const lastX =
        svgWidth;

    const lastY =
        svgHeight -
        (
            (lastValue - min)
            /
            (max - min)
        )
        * svgHeight;


    document
        .getElementById("currentPoint")
        .setAttribute(
            "cx",
            lastX
        );

    document
        .getElementById("currentPoint")
        .setAttribute(
            "cy",
            lastY
        );


    updateKPI(data);

}


/* ================= UPDATE KPI ================= */

function updateKPI(data) {

    const parameter =
        document.getElementById("parameterSelect").value;

    const config =
        parameterConfig[parameter];


    const current =
        data[data.length - 1];

    const minimum =
        Math.min(...data);

    const maximum =
        Math.max(...data);

    const average =
        data.reduce(
            (sum, value) =>
                sum + value,
            0
        )
        / data.length;


    document.getElementById("currentValue")
        .textContent =
        formatValue(current, config.unit);


    document.getElementById("minValue")
        .textContent =
        formatValue(minimum, config.unit);


    document.getElementById("maxValue")
        .textContent =
        formatValue(maximum, config.unit);


    document.getElementById("avgValue")
        .textContent =
        formatValue(average, config.unit);


    document.getElementById("sampleCount")
        .textContent =
        data.length * 18;

}


/* ================= FORMAT VALUE ================= */

function formatValue(value, unit) {

    let decimals = 1;

    if (unit === "RPM") {
        decimals = 0;
    }

    if (unit === "Units/hr") {
        decimals = 0;
    }

    return `${value.toFixed(decimals)} ${unit}`;

}


/* ================= UPDATE TREND ================= */

function updateTrend() {

    const machine =
        document.getElementById("machineSelect")
            .value;

    const parameter =
        document.getElementById("parameterSelect")
            .value;

    const timeRange =
        document.getElementById("timeRange")
            .value;


    const config =
        parameterConfig[parameter];


    const machineName =
        getMachineName(machine);


    document.getElementById("selectedMachine")
        .textContent =
        `${machine} - ${machineName}`;


    document.getElementById("trendTitle")
        .textContent =
        `${config.name} Trend`;


    document.getElementById("trendSubtitle")
        .textContent =
        `${machine} • ${getTimeRangeName(timeRange)}`;


    document.getElementById("parameterUnit")
        .textContent =
        `${config.name} (${config.unit})`;


    const data =
        generateTrendData(parameter);


    drawTrend(data);

}


/* ================= MACHINE NAME ================= */

function getMachineName(machine) {

    if (machineNames[machine]) {
        return machineNames[machine];
    }

    const index =
        parseInt(
            machine.substring(1)
        );

    const types = [
        "Packaging Machine",
        "Filling Machine",
        "Conveyor System",
        "Pump Station",
        "Mixing Machine",
        "Compressor",
        "Reactor System",
        "Blower System",
        "Centrifuge",
        "Processing Machine"
    ];

    const type =
        types[(index - 1) % types.length];

    return `${type} ${String(index).padStart(2, "0")}`;

}


/* ================= TIME RANGE ================= */

function getTimeRangeName(range) {

    const names = {

        "1h": "Last 1 Hour",
        "6h": "Last 6 Hours",
        "12h": "Last 12 Hours",
        "24h": "Last 24 Hours",
        "7d": "Last 7 Days",
        "30d": "Last 30 Days"

    };

    return names[range] || "Last 24 Hours";

}


/* ================= RESET ================= */

function resetTrend() {

    document.getElementById("machineSelect")
        .value = "M001";

    document.getElementById("parameterSelect")
        .value = "temperature";

    document.getElementById("timeRange")
        .value = "24h";


    updateTrend();

}


/* ================= DATE & TIME ================= */

function updateDateTime() {

    const now =
        new Date();


    const date =
        now.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        ).toUpperCase();


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


    document.getElementById("currentDate")
        .textContent = date;

    document.getElementById("currentTime")
        .textContent = time;

}


/* ================= LIVE DATA SIMULATION ================= */

function liveUpdate() {

    const parameter =
        document.getElementById("parameterSelect")
            .value;

    const data =
        generateTrendData(parameter);

    drawTrend(data);

}


/* ================= INITIALIZATION ================= */

generateMachines();

updateTrend();

updateDateTime();

setInterval(
    updateDateTime,
    1000
);


/*
    Simulate live trend update
    every 5 seconds.
*/

setInterval(
    liveUpdate,
    5000
);