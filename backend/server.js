const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "HealthCoverSim API is running"
  });
});
app.post("/api/quotes", (req, res) => {
  const {
    customer_name,
    cover_type,
    applicant1_age,
    applicant1_cover_history,
    applicant2_age,
    applicant2_cover_history,
    hospital_cover,
    extras_cover,
    payment_frequency,
    annual_discount,
    notes
  } = req.body;

  const sql = `
    INSERT INTO quotes (
      customer_name,
      cover_type,
      applicant1_age,
      applicant1_cover_history,
      applicant2_age,
      applicant2_cover_history,
      hospital_cover,
      extras_cover,
      payment_frequency,
      annual_discount,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      customer_name,
      cover_type,
      applicant1_age,
      applicant1_cover_history,
      applicant2_age || null,
      applicant2_cover_history || null,
      hospital_cover,
      extras_cover,
      payment_frequency,
      annual_discount || 0,
      notes || ""
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        message: "Quote created successfully",
        id: this.lastID
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
