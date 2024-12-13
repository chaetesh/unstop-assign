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
        const response = await axios.get(
          "https://unstop-assign.onrender.com/seats"
        );
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
      const response = await axios.post(
        "https://unstop-assign.onrender.com/reserve",
        {
          seatCount: parseInt(seatCount),
        }
      );
      setMessage(response.data.message);
      setSeats(response.data.seats);
      setReservedSeats(response.data.reservedSeats);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleResetSeats = async () => {
    try {
      const response = await axios.post(
        "https://unstop-assign.onrender.com/reset"
      );
      setMessage(response.data.message);
      setSeats(response.data.seats);
      setReservedSeats([]);
    } catch (error) {
      console.error("Error resetting seats:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="flex flex-col sm:flex-row w-full max-w-screen-xl">
        {/* Left side: Reservation Form */}
        <div className="sm:w-1/3 flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Train Seat Reservation
          </h1>

          <form
            onSubmit={handleSeatReservation}
            className="w-full max-w-xs mx-auto"
          >
            <label
              htmlFor="seatCount"
              className="block text-sm font-medium mb-2"
            >
              Seats (1-7)
            </label>
            <input
              type="number"
              min="1"
              max="7"
              value={seatCount}
              onChange={(e) => setSeatCount(e.target.value)}
              placeholder="Number of seats"
              id="seatCount"
              className="mb-4 border-2 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 ease-in-out"
            >
              Reserve Seats
            </button>
          </form>

          <button
            onClick={handleResetSeats}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md w-full max-w-xs text-sm transition-all duration-200 ease-in-out"
          >
            Reset Seats
          </button>

          {message && (
            <p className="mt-4 text-sm text-center text-green-600 font-semibold">
              {message}
            </p>
          )}
        </div>

        {/* Right side: Reserved Seats Grid */}
        <div className="sm:w-2/3 mt-6 sm:mt-0 flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-7 gap-2 w-full max-w-xs mx-auto">
            {seats.map((seat, index) => (
              <div
                key={index}
                className={`w-10 h-10 flex items-center justify-center text-xs font-bold rounded-md cursor-pointer transition-all duration-200 ${
                  seat
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white hover:bg-green-600"
                } ${
                  reservedSeats.includes(index + 1)
                    ? "ring-2 ring-yellow-500"
                    : ""
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
