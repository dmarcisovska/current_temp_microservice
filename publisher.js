import zmq from "zeromq";
import axios from "axios";

async function getTemperature(lat, lon) {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  try {
    const response = await axios.get(url);
    const temp = response.data.main.temp;
    return `Current temperature: ${temp}°C`;
  } catch (error) {
    console.error("Error fetching temperature data:", error);
    return "Temperature data unavailable";
  }
}

async function run() {
  const sock = new zmq.Publisher();

  await sock.bind("tcp://127.0.0.1:3008");
  console.log("Publisher bound to port 3008");

  while (true) {
    console.log("sending a multipart message envelope");
    await sock.send(["kitty cats", "meow!"]);
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }
}

run();
