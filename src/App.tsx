import React, { useState, useEffect } from "react";
import Vehicle from "./common/interfaces/Vehicle";
import { HubConnectionBuilder, HttpTransportType, LogLevel, HubConnection, HubConnectionState } from "@microsoft/signalr";
import './App.scss';
import VehicleDataPresenter from "./components/VehicleDataPresenter";

const App = () => {
  const [lastMotorcycle, setLastMotorcycle] = useState<Vehicle>();
  const [motorcyclesAmountArrived, setMotorcyclesAmountArrived] = useState<number>(0);
  const [isMotorcycleConnected, setIsMotorcycleConnected] = useState<boolean>(false);

  const [lastCar, setLastCar] = useState<Vehicle>();
  const [carsAmountArrived, setCarsAmountArrived] = useState<number>(0);
  const [isCarHubConnected, setIsCarConnected] = useState<boolean>(false);

  useEffect(() => {

    let carConnection: HubConnection;
    let motorcycleConnection: HubConnection;

    subscribeToCars()
      .then(res => carConnection = res)
      .catch(() => console.log("Couldn't connect to the car hub"));

    subscribeToMotorcycles()
      .then(res => motorcycleConnection = res)
      .catch(() => console.log("Couldn't connect to the motorcycle hub"));

    return () => {
      carConnection?.stop();
    };
  }, []);

  const subscribeToCars = async () => {
    const carSocket = getHubConnection('/carHub');
    await carSocket.start();

    setIsCarConnected(true);
    carSocket.on("ReceiveMessage", onCarArrived)
    carSocket.onreconnected(() => setIsCarConnected(true))
    carSocket.onclose(() => setIsCarConnected(false));

    return carSocket.state === HubConnectionState.Connected ?
      Promise.resolve(carSocket)
      :
      Promise.reject()
  }

  const onCarArrived = (message: any) => {
    const car: Vehicle = JSON.parse(message);
    car.Timestamp = new Date(Date.parse(car.Timestamp.toString()));

    setLastCar(car);
    setCarsAmountArrived(prev => prev + 1);
  };

  const subscribeToMotorcycles = async () => {

    const motorSocket = getHubConnection('/motorcycleHub');
    await motorSocket.start();

    setIsMotorcycleConnected(true);
    motorSocket.on("ReceiveMessage", onMotorcycleArrived)
    motorSocket.onreconnected(() => setIsMotorcycleConnected(true))
    motorSocket.onclose(() => setIsMotorcycleConnected(false));

    return motorSocket.state === HubConnectionState.Connected ?
      Promise.resolve(motorSocket)
      :
      Promise.reject()
  }

  const onMotorcycleArrived = (message: any) => {
    const motorcycle: Vehicle = JSON.parse(message);
    motorcycle.Timestamp = new Date(Date.parse(motorcycle.Timestamp.toString()));

    setLastMotorcycle(motorcycle);
    setMotorcyclesAmountArrived(prev => prev + 1);
  };

  const getHubConnection = (url: string) => {
    const socket = new HubConnectionBuilder()
      .configureLogging(LogLevel.Debug)
      .withUrl(url, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .build();

    return socket;
  }

  return (
    <div className="app-container">
      {
        isCarHubConnected ?
          <>
            <h2 className="vehicle-title">Car arrived from AppY &#128071;</h2>

            {lastCar ?
              <VehicleDataPresenter vehicle={lastCar} />
              :
              <h3 className="waiting-title">Waiting for messages...</h3>
            }

            <h2 className="amount-title">
              Total amount of cars arrived:
              <span className="amount">
                {carsAmountArrived}
              </span>
            </h2>
          </>
          :
          <h1>
            There is no connection to the car hub
          </h1>
      }

      <div className="separator"></div>

      {
        isMotorcycleConnected ?
          <>
            <h2 className="vehicle-title">Motorcycle arrived from AppX &#128071;</h2>

            {lastMotorcycle ?
              <VehicleDataPresenter vehicle={lastMotorcycle} />
              :
              <h3 className="waiting-title">Waiting for messages...</h3>
            }

            <h2 className="amount-title">
              Total amount of motorcycles arrived:
              <span className="amount">
                {motorcyclesAmountArrived}
              </span>
            </h2>

          </>
          :
          <h1>
            There is no connection to the motorcycle hub
          </h1>
      }
    </div>
  );
};

export default App;
