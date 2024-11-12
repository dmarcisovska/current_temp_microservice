import zmq from "zeromq";
import axios from "axios";
import { API_KEY } from "./config.js"; 

async function getLocation() {
  try {
    const response = await axios.get("http://ip-api.com/json/");
    return {
      latitude: response.data.lat,
      longitude: response.data.lon,
    };
  } catch (error) {
    console.error("Error fetching location data:", error);
    return { latitude: 0, longitude: 0 }; 
  }
}

async function getTemperature(lat, lon) {

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  try {
    const response = await axios.get(url);
    const temp = Math.round(response.data.main.temp);
    return `${temp}°F`;
  } catch (error) {
    console.error("Error fetching temperature data:", error.response?.data || error.message);
    return "Temperature data unavailable";
  }
}


async function run() {
  const sock = new zmq.Publisher();
  await sock.bind("tcp://127.0.0.1:3008");
  console.log("Weather microservice bound to port 3008");

  const location = await getLocation();
  const { latitude, longitude } = location;

  while (true) {
    const temperature = await getTemperature(latitude, longitude);
    console.log("Sending temperature update:", temperature);
    await sock.send(["weather", temperature]);
    await new Promise((resolve) => setTimeout(resolve, 6000)); 
  }
}

run();
