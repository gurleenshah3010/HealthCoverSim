import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    customer_name: "",
    cover_type: "Single",
    applicant1_age: "",
    applicant1_cover_history: "Yes",
    applicant2_age: "",
    applicant2_cover_history: "Yes",
    hospital_cover: "None",
    extras_cover: "None",
    payment_frequency: "Monthly",
    annual_discount: 0,
    notes: ""
  });

  const [message, setMessage] = useState("");
  const [quotes, setQuotes] = useState([]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }
  async function loadQuotes() {
  try {
    const response = await fetch(
      "http://localhost:5000/api/quotes"
    );

    const data = await response.json();

    if (response.ok) {
      setQuotes(data);
    }
  } catch (error) {
    console.error("Could not load quotes:", error);
  }
}
useEffect(() => {
  loadQuotes();
}, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const dataToSend = {
      ...formData,
      applicant1_age: Number(formData.applicant1_age),
      applicant2_age:
        formData.cover_type === "Single"
          ? null
          : Number(formData.applicant2_age),
      applicant2_cover_history:
        formData.cover_type === "Single"
          ? null
          : formData.applicant2_cover_history,
      annual_discount: Number(formData.annual_discount)
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/quotes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataToSend)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Unable to create quote");
        return;
      }

      setMessage(
        `Quote created successfully. Quote ID: ${result.id}`
      );
      setFormData({
  customer_name: "",
  cover_type: "Single",
  applicant1_age: "",
  applicant1_cover_history: "Yes",
  applicant2_age: "",
  applicant2_cover_history: "Yes",
  hospital_cover: "None",
  extras_cover: "None",
  payment_frequency: "Monthly",
  annual_discount: 0,
  notes: ""
});
      loadQuotes();

    } catch (error) {
      setMessage("Could not connect to the backend.");
      console.error(error);
    }
  }

  const showApplicant2 =
    formData.cover_type === "Couple" ||
    formData.cover_type === "Family";

  return (
    <div className="app">
      <h1>HealthCoverSim</h1>
      <p>Private Health Insurance Quote Simulator</p>

      <form onSubmit={handleSubmit}>
        <label>
          Customer Name
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Cover Type
          <select
            name="cover_type"
            value={formData.cover_type}
            onChange={handleChange}
          >
            <option value="Single">Single</option>
            <option value="Couple">Couple</option>
            <option value="Family">Family</option>
          </select>
        </label>

        <label>
          Applicant 1 Age
          <input
            type="number"
            name="applicant1_age"
            min="18"
            max="100"
            value={formData.applicant1_age}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Applicant 1 Hospital Cover History
          <select
            name="applicant1_cover_history"
            value={formData.applicant1_cover_history}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Not sure">Not sure</option>
          </select>
        </label>

        {showApplicant2 && (
          <>
            <label>
              Applicant 2 Age
              <input
                type="number"
                name="applicant2_age"
                min="18"
                max="100"
                value={formData.applicant2_age}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Applicant 2 Hospital Cover History
              <select
                name="applicant2_cover_history"
                value={formData.applicant2_cover_history}
                onChange={handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not sure">Not sure</option>
              </select>
            </label>
          </>
        )}

        <label>
          Hospital Cover
          <select
            name="hospital_cover"
            value={formData.hospital_cover}
            onChange={handleChange}
          >
            <option value="None">None</option>
            <option value="Basic">Basic</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
          </select>
        </label>

        <label>
          Extras Cover
          <select
            name="extras_cover"
            value={formData.extras_cover}
            onChange={handleChange}
          >
            <option value="None">None</option>
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
        </label>

        <label>
          Payment Frequency
          <select
            name="payment_frequency"
            value={formData.payment_frequency}
            onChange={handleChange}
          >
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </label>

        {formData.payment_frequency === "Yearly" && (
          <label>
            Annual Discount %
            <input
              type="number"
              name="annual_discount"
              min="0"
              max="10"
              value={formData.annual_discount}
              onChange={handleChange}
            />
          </label>
        )}

        <label>
          Notes
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Create Quote</button>
      </form>

      {message && <p>{message}</p>}
      <hr />

<h2>Saved Quotes</h2>

{quotes.length === 0 ? (
  <p>No quotes have been created yet.</p>
) : (
  <div className="quote-list">
    {quotes.map((quote) => (
      <div className="quote-card" key={quote.id}>
        <h3>{quote.customer_name}</h3>

        <p>
          <strong>Quote ID:</strong> {quote.id}
        </p>

        <p>
          <strong>Cover Type:</strong> {quote.cover_type}
        </p>

        <p>
          <strong>Hospital:</strong> {quote.hospital_cover}
        </p>

        <p>
          <strong>Extras:</strong> {quote.extras_cover}
        </p>

        <p>
          <strong>Payment:</strong> {quote.payment_frequency}
        </p>
      </div>
    ))}
  </div>
)}
    </div>
  );
}

export default App;