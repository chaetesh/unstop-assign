import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [seatCount, setSeatCount] = useState("");
  const [message, setMessage] = useState("");
  const [seats, setSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);

  // Fetch initial seat data on page load
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/seats");
        setSeats(response.data.seats);
      } catch (error) {
        console.error("Error fetching initial seat data:", error);
      }
    };

    fetchSeats();
  }, []);

  const handleSeatReservation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/reserve", {
        seatCount: parseInt(seatCount),
      });
      setMessage(response.data.message);
      setSeats(response.data.seats);
      setReservedSeats(response.data.reservedSeats);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleResetSeats = async () => {
    try {
      const response = await axios.post("http://localhost:3000/reset");
      setMessage(response.data.message);
      setSeats(response.data.seats);
      setReservedSeats([]);
    } catch (error) {
      console.error("Error resetting seats:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Train Seat Reservation</h1>

      <form
        onSubmit={handleSeatReservation}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <input
          type="number"
          min="1"
          max="7"
          value={seatCount}
          onChange={(e) => setSeatCount(e.target.value)}
          placeholder="Enter number of seats (1-7)"
          className="mb-4 border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Reserve Seats
        </button>
      </form>

      <button
        onClick={handleResetSeats}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Reset Seats
      </button>

      {message && (
        <p className="mt-4 text-center text-lg text-green-600">{message}</p>
      )}

      <div className="grid grid-cols-7 gap-2 mt-4">
        {seats.map((seat, index) => (
          <div
            key={index}
            className={`w-10 h-10 flex items-center justify-center border rounded ${
              seat ? "bg-red-500" : "bg-green-500"
            } ${
              reservedSeats.includes(index + 1) ? "ring-4 ring-yellow-500" : ""
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
