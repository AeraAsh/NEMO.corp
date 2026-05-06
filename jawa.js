let lastUpdate = 0;

const clientId = "ALIE" + Math.random().toString(16).substr(2, 8);

const host = "wss://hatguy.cloud.shiftr.io:443/mqtt";

const options = {
    clientId: clientId,
    username: "hatguy",
    password: "RKGOva4VeeSENv2v",
    clean: true,
};

    console.log("Connect to Broker");

    const client = mqtt.connect(host, options);

    client.on("connect", () => {
        console.log("CONNECTED");

        document.getElementById("Status").innerHTML = "Connected";
        document.getElementById("Status").style.color = "green";

    });

        client.subscribe('NEMO/#', { qos: 1 })

        client.on('message', function (topic, data) {

        if (topic === "NEMO/tem") {
            document.getElementById("tem").innerHTML = data;
        }

        if (topic === "NEMO/hum") {
            document.getElementById("hum").innerHTML = data;
        }

        if (topic === "NEMO/waterlevel") {
            const num = parseInt(data);

            let percent = mapValue(num, 0, 4095, 0, 100);
            document.getElementById("waterval").innerHTML = percent + "%";
        }

        if (topic === "NEMO/servo") {
            let el = document.getElementById("servo");
            let value = data.toString();
            let toggle = document.getElementById("toggle");

            el.innerHTML = value;

            if (value === "ON") {
                el.style.color = "green";
                toggle.checked = true;
            } else {
                el.style.color = "red";
                toggle.checked = false;
            }
        }
    });

    client.on("error", (err) => {
        console.log("ERROR:", err);
    });

    client.on("offline", () => {
        console.log("OFFLINE");
    });

    client.on("close", () => {
        console.log("CLOSED");
    });

function mapValue(x, in_min, in_max, out_min, out_max) {
    return Math.round((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
}

        const toggle = document.getElementById("toggle");

        toggle.addEventListener("change", function () {
            if (toggle.checked) {
                client.publish("NEMO/servo/control", "ON");
            } else {
                client.publish("NEMO/servo/control", "OFF");
            }
    });