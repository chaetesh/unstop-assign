// Import necessary modules
const express = require("express");
const cors = require("cors"); // Import CORS
const app = express();
const PORT = process.env.PORT || 3000;

// Function to initialize seat structure with a few booked seats
const initializeSeats = () => [
  true,
  false,
  false,
  false,
  false,
  false,
  false, // Row 1 (1st seat booked)
  false,
  true,
  false,
  false,
  false,
  false,
  false, // Row 2 (2nd seat booked)
  false,
  false,
  true,
  false,
  false,
  false,
  false, // Row 3 (3rd seat booked)
  false,
  false,
  false,
  true,
  false,
  false,
  false, // Row 4 (4th seat booked)
  false,
  false,
  false,
  false,
  true,
  false,
  false, // Row 5 (5th seat booked)
  false,
  false,
  false,
  false,
  false,
  true,
  false, // Row 6 (6th seat booked)
  false,
  false,
  false,
  false,
  false,
  false,
  true, // Row 7 (7th seat booked)
  false,
  false,
  false,
  false,
  false,
  false,
  false, // Row 8
  false,
  false,
  false,
  false,
  false,
  false,
  false, // Row 9
  false,
  false,
  false,
  false,
  false,
  false,
  false, // Row 10
  false,
  false,
  false,
  false,
  false,
  false,
  false, // Row 11
  false,
  false,
  false,
];

// Initialize seat structure
let seats = initializeSeats();

// Middleware to handle JSON requests
app.use(cors()); // Enable CORS
app.use(express.json());

// Endpoint to handle seat reservation
app.post("/reserve", (req, res) => {
  const { seatCount } = req.body;
  if (!seatCount || seatCount < 1 || seatCount > 7) {
    return res.status(400).json({
      message: "Invalid seat count. Please reserve between 1 and 7 seats.",
    });
  }

  let reservedSeats = [];
  let remainingSeats = seatCount;

  // First, attempt to book contiguous seats in the same row
  for (let i = 0; i < 80; i += 7) {
    const rowSeats = seats.slice(i, i + 7);

    // Try to book contiguous seats in this row
    for (
      let startIndex = 0;
      startIndex <= rowSeats.length - remainingSeats;
      startIndex++
    ) {
      let canBook = true;
      for (let j = startIndex; j < startIndex + remainingSeats; j++) {
        if (seats[i + j]) {
          canBook = false; // If any seat is already booked, don't book this segment
          break;
        }
      }

      if (canBook) {
        // Reserve the seats in the found segment
        for (let j = startIndex; j < startIndex + remainingSeats; j++) {
          seats[i + j] = true; // Mark seat as booked
          reservedSeats.push(i + j + 1); // Store 1-based index of seat
        }
        remainingSeats = 0; // All seats booked
        break; // Exit once seats are successfully booked
      }
    }

    // If all seats are booked, stop searching
    if (remainingSeats === 0) break;
  }

  // If enough contiguous seats were not found, book nearby seats across rows
  if (remainingSeats > 0) {
    // Try booking seats across multiple rows
    outerLoop: for (let i = 0; i < 80 && remainingSeats > 0; i++) {
      if (!seats[i]) {
        seats[i] = true; // Mark seat as booked
        reservedSeats.push(i + 1); // Store 1-based index of seat
        remainingSeats--; // Decrease remaining seats to book
      }

      // If all seats are booked, stop the process
      if (remainingSeats === 0) break outerLoop;
    }
  }

  // If not enough seats were reserved, return an error
  if (remainingSeats > 0) {
    let partialbooked = seatCount - remainingSeats;
    return res.status(400).json({
      message: `Not enough seats available to reserve the requested amount. ${partialbooked} Seats Booked`,
    });
  }

  // If enough seats were reserved, return success
  res
    .status(200)
    .json({ message: "Seats reserved successfully", reservedSeats, seats });
});

// Add route to get current seat status
app.get("/seats", (req, res) => {
  res.status(200).json({ seats });
});

// Endpoint to reset seats
app.post("/reset", (req, res) => {
  seats = initializeSeats();
  res.status(200).json({ message: "Seats have been reset", seats });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
