import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

function EditQuote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuote() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/quotes/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Unable to load quote");
          return;
        }

        setFormData({
          ...data.quote,
          applicant2_age:
            data.quote.applicant2_age ?? "",
          applicant2_cover_history:
            data.quote.applicant2_cover_history ?? "Yes",
          annual_discount:
            data.quote.annual_discount ?? 0,
          notes: data.quote.notes ?? ""
        });
      } catch (error) {
        console.error(error);
        setError("Could not connect to the backend.");
      }
    }

    loadQuote();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const dataToSend = {
      ...formData,

      applicant1_age: Number(
        formData.applicant1_age
      ),

      applicant2_age:
        formData.cover_type === "Single"
          ? null
          : Number(formData.applicant2_age),

      applicant2_cover_history:
        formData.cover_type === "Single"
          ? null
          : formData.applicant2_cover_history,

      annual_discount:
        formData.payment_frequency === "Yearly"
          ? Number(formData.annual_discount)
          : 0
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/quotes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataToSend)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to update quote");
        return;
      }

      navigate(`/quotes/${id}`);
    } catch (error) {
      console.error(error);
      setError("Could not connect to the backend.");
    }
  }

  if (error && !formData) {
    return (
      <div className="app">
        <h1>Edit Quote</h1>
        <p>{error}</p>
        <Link to="/">Back to Quotes</Link>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="app">
        <p>Loading quote...</p>
      </div>
    );
  }

  const showApplicant2 =
    formData.cover_type === "Couple" ||
    formData.cover_type === "Family";

  return (
    <div className="app">
      <Link to={`/quotes/${id}`}>
        ← Back to Quote Details
      </Link>

      <h1>Edit Quote</h1>

      {error && <p>{error}</p>}

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
            value={
              formData.applicant1_cover_history
            }
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Not sure">
              Not sure
            </option>
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
                value={
                  formData.applicant2_cover_history
                }
                onChange={handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not sure">
                  Not sure
                </option>
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
            <option value="Standard">
              Standard
            </option>
            <option value="Premium">
              Premium
            </option>
          </select>
        </label>

        <label>
          Payment Frequency
          <select
            name="payment_frequency"
            value={formData.payment_frequency}
            onChange={handleChange}
          >
            <option value="Monthly">
              Monthly
            </option>
            <option value="Yearly">
              Yearly
            </option>
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

        <button type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditQuote;
