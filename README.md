# Current Temperature 

This microservice provides the current temperature in F units. 

## Prerequisites
- **Node.js** installed on your system

## Installation

Clone the repository to your local machine:
   ```bash
   git clone https://github.com/dmarcisovska/current_temp_microservice.git
   cd current_temp_microservice
```

## How to run

```
npm install
npm start
```

This command will start a ZeroMQ publisher bound to tcp://127.0.0.1:3008. You’ll see console logs for each message sent, with different date and time formats.

## Topics and Message Formats
The microservice publishes messages on the following topics:

- weather: Returns the temperature in Fahrenheit 

## Example Subscriber Code

To receive messages from this microservice publisher, you need a ZeroMQ subscriber that connects to tcp://127.0.0.1:3000 and subscribes to time. Here’s an example:

```
import zmq from "zeromq";

async function run() {
  const sock = new zmq.Subscriber();

  sock.connect("tcp://127.0.0.1:3008");
  sock.subscribe("weather");
  console.log("Weather Subscriber connected to port 3008");

  for await (const [topic, msg] of sock) {
    console.log("Received a message related to:", topic.toString(), "containing:", msg.toString());
  }
}

run();

```




