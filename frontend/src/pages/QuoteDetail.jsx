import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function QuoteDetail() {
  const { id } = useParams();

  const [quote, setQuote] = useState(null);
  const [calculation, setCalculation] = useState(null);
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

        setQuote(data.quote);
        setCalculation(data.calculation);
      } catch (error) {
        console.error(error);
        setError("Could not connect to the backend.");
      }
    }

    loadQuote();
  }, [id]);

  if (error) {
    return (
      <div className="app">
        <h1>Quote Details</h1>
        <p>{error}</p>
        <Link to="/">Back to Quotes</Link>
      </div>
    );
  }

  if (!quote || !calculation) {
    return (
      <div className="app">
        <p>Loading quote...</p>
      </div>
    );
  }

  const discountAmount =
    calculation.yearlyBeforeDiscount -
    calculation.yearlyAfterDiscount;

  return (
    <div className="app">
      <Link to="/">← Back to Quotes</Link>

      <h1>Quote Details</h1>

      <h2>{quote.customer_name}</h2>
      <Link to={`/quotes/${quote.id}/edit`}>
  Edit Quote
</Link>

      <div className="detail-section">
        <h3>Customer and Cover</h3>

        <p>
          <strong>Quote ID:</strong> {quote.id}
        </p>

        <p>
          <strong>Cover Type:</strong> {quote.cover_type}
        </p>

        <p>
          <strong>Hospital Cover:</strong>{" "}
          {quote.hospital_cover}
        </p>

        <p>
          <strong>Extras Cover:</strong>{" "}
          {quote.extras_cover}
        </p>

        <p>
          <strong>Payment Frequency:</strong>{" "}
          {quote.payment_frequency}
        </p>

        <p>
          <strong>Annual Discount:</strong>{" "}
          {quote.annual_discount}%
        </p>
      </div>

      <div className="detail-section">
        <h3>Applicant 1</h3>

        <p>
          <strong>Age:</strong> {quote.applicant1_age}
        </p>

        <p>
          <strong>Hospital Cover History:</strong>{" "}
          {quote.applicant1_cover_history}
        </p>

        <p>
          <strong>LHC Loading:</strong>{" "}
          {calculation.applicant1LoadingPercent.toFixed(0)}%
        </p>
      </div>

      {quote.cover_type !== "Single" && (
        <div className="detail-section">
          <h3>Applicant 2</h3>

          <p>
            <strong>Age:</strong> {quote.applicant2_age}
          </p>

          <p>
            <strong>Hospital Cover History:</strong>{" "}
            {quote.applicant2_cover_history}
          </p>

          <p>
            <strong>LHC Loading:</strong>{" "}
            {calculation.applicant2LoadingPercent.toFixed(0)}%
          </p>
        </div>
      )}

      <div className="detail-section">
        <h3>Premium Breakdown</h3>

        <p>
          <strong>Hospital Total:</strong> $
          {calculation.hospitalTotal.toFixed(2)} per month
        </p>

        <p>
          <strong>Extras Total:</strong> $
          {calculation.extrasTotal.toFixed(2)} per month
        </p>

        <p>
          <strong>Family Fee:</strong> $
          {calculation.familyFee.toFixed(2)} per month
        </p>

        <p>
          <strong>Monthly Premium:</strong> $
          {calculation.monthlyPremium.toFixed(2)}
        </p>

        <p>
          <strong>Yearly Premium Before Discount:</strong> $
          {calculation.yearlyBeforeDiscount.toFixed(2)}
        </p>

        {quote.payment_frequency === "Yearly" && (
          <>
            <p>
              <strong>Annual Discount:</strong>{" "}
              {quote.annual_discount}%
            </p>

            <p>
              <strong>Discount Amount:</strong> $
              {discountAmount.toFixed(2)}
            </p>
          </>
        )}

        <p>
          <strong>Yearly Premium After Discount:</strong> $
          {calculation.yearlyAfterDiscount.toFixed(2)}
        </p>
      </div>

      <div className="detail-section">
        <h3>Final Total</h3>

        {quote.payment_frequency === "Monthly" ? (
          <p>
            The customer will pay{" "}
            <strong>
              ${calculation.monthlyPremium.toFixed(2)} per month.
            </strong>
          </p>
        ) : (
          <p>
            The customer will pay{" "}
            <strong>
              ${calculation.yearlyAfterDiscount.toFixed(2)} per year.
            </strong>
          </p>
        )}
      </div>

      {calculation.warnings.length > 0 && (
        <div className="warning-box">
          <h3>Warnings</h3>

          {calculation.warnings.map((warning, index) => (
            <p key={index}>{warning}</p>
          ))}
        </div>
      )}

      <div className="lhc-box">
        <strong>{calculation.lhcStatement}</strong>
      </div>

      {quote.notes && (
        <div className="detail-section">
          <h3>Notes</h3>
          <p>{quote.notes}</p>
        </div>
      )}
    </div>
  );
}

export default QuoteDetail;
