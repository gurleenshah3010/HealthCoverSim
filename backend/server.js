const express = require("express");
const cors = require("cors");
const db = require("./db");
const { calculateQuote } = require("./calculator");
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

// Get all quotes
app.get("/api/quotes", (req, res) => {
  const sql = `
    SELECT *
    FROM quotes
    ORDER BY created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(rows);
  });
});

// Get one quote by ID
app.get("/api/quotes/:id", (req, res) => {
  const id = req.params.id;

  db.get(
    "SELECT * FROM quotes WHERE id = ?",
    [id],
    (err, quote) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (!quote) {
        return res.status(404).json({
          error: "Quote not found"
        });
      }

      const calculation = calculateQuote(quote);

      res.json({
        quote,
        calculation
      });
    }
  );
});

// Update a quote
app.put("/api/quotes/:id", (req, res) => {
  const id = req.params.id;

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

  // Basic validation
  if (
    !customer_name ||
    !cover_type ||
    !hospital_cover ||
    !extras_cover ||
    !payment_frequency
  ) {
    return res.status(400).json({
      error: "Required fields are missing"
    });
  }

  if (applicant1_age < 18 || applicant1_age > 100) {
    return res.status(400).json({
      error: "Applicant 1 age must be between 18 and 100"
    });
  }

  if (
    (cover_type === "Couple" || cover_type === "Family") &&
    (!applicant2_age || !applicant2_cover_history)
  ) {
    return res.status(400).json({
      error:
        "Applicant 2 age and cover history are required for Couple or Family cover"
    });
  }

  if (
    applicant2_age &&
    (applicant2_age < 18 || applicant2_age > 100)
  ) {
    return res.status(400).json({
      error: "Applicant 2 age must be between 18 and 100"
    });
  }

  if (annual_discount < 0 || annual_discount > 10) {
    return res.status(400).json({
      error: "Annual discount must be between 0 and 10 percent"
    });
  }

  const sql = `
    UPDATE quotes
    SET
      customer_name = ?,
      cover_type = ?,
      applicant1_age = ?,
      applicant1_cover_history = ?,
      applicant2_age = ?,
      applicant2_cover_history = ?,
      hospital_cover = ?,
      extras_cover = ?,
      payment_frequency = ?,
      annual_discount = ?,
      notes = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      customer_name,
      cover_type,
      applicant1_age,
      applicant1_cover_history,
      cover_type === "Single" ? null : applicant2_age,
      cover_type === "Single"
        ? null
        : applicant2_cover_history,
      hospital_cover,
      extras_cover,
      payment_frequency,
      annual_discount || 0,
      notes || "",
      id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Quote not found"
        });
      }

      res.json({
        message: "Quote updated successfully"
      });
    }
  );
});
// Delete a quote
app.delete("/api/quotes/:id", (req, res) => {
  const id = req.params.id;

  db.run(
    "DELETE FROM quotes WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Quote not found"
        });
      }

      res.json({
        message: "Quote deleted successfully"
      });
    }
  );
});

app.post("/api/calculate", (req, res) => {
  const data = req.body;

  if (!data.customer_name) {
    return res.status(400).json({
      error: "Customer name is required"
    });
  }

  if (
    data.applicant1_age < 18 ||
    data.applicant1_age > 100
  ) {
    return res.status(400).json({
      error: "Applicant 1 age must be between 18 and 100"
    });
  }

  if (
    (data.cover_type === "Couple" ||
      data.cover_type === "Family") &&
    (!data.applicant2_age ||
      !data.applicant2_cover_history)
  ) {
    return res.status(400).json({
      error:
        "Applicant 2 age and cover history are required for Couple or Family cover"
    });
  }

  if (
    data.annual_discount < 0 ||
    data.annual_discount > 10
  ) {
    return res.status(400).json({
      error:
        "Annual discount must be between 0 and 10 percent"
    });
  }

  const result = calculateQuote(data);

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
