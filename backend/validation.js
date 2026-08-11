function validateQuote(data) {
  const errors = [];

  const validCoverTypes = [
    "Single",
    "Couple",
    "Family"
  ];

  const validHistories = [
    "Yes",
    "No",
    "Not sure"
  ];

  const validHospitalCovers = [
    "None",
    "Basic",
    "Bronze",
    "Silver",
    "Gold"
  ];

  const validExtrasCovers = [
    "None",
    "Basic",
    "Standard",
    "Premium"
  ];

  const validPaymentFrequencies = [
    "Monthly",
    "Yearly"
  ];

  if (
    typeof data.customer_name !== "string" ||
    !data.customer_name.trim()
  ) {
    errors.push("Customer name is required");
  }

  if (!validCoverTypes.includes(data.cover_type)) {
    errors.push("Invalid cover type");
  }

  const applicant1Age = Number(
    data.applicant1_age
  );

  if (
    !Number.isInteger(applicant1Age) ||
    applicant1Age < 18 ||
    applicant1Age > 100
  ) {
    errors.push(
      "Applicant 1 age must be between 18 and 100"
    );
  }

  if (
    !validHistories.includes(
      data.applicant1_cover_history
    )
  ) {
    errors.push(
      "Invalid Applicant 1 cover history"
    );
  }

  if (
    data.cover_type === "Couple" ||
    data.cover_type === "Family"
  ) {
    const applicant2Age = Number(
      data.applicant2_age
    );

    if (
      !Number.isInteger(applicant2Age) ||
      applicant2Age < 18 ||
      applicant2Age > 100
    ) {
      errors.push(
        "Applicant 2 age must be between 18 and 100"
      );
    }

    if (
      !validHistories.includes(
        data.applicant2_cover_history
      )
    ) {
      errors.push(
        "Invalid Applicant 2 cover history"
      );
    }
  }

  if (
    !validHospitalCovers.includes(
      data.hospital_cover
    )
  ) {
    errors.push("Invalid hospital cover");
  }

  if (
    !validExtrasCovers.includes(
      data.extras_cover
    )
  ) {
    errors.push("Invalid extras cover");
  }

  if (
    !validPaymentFrequencies.includes(
      data.payment_frequency
    )
  ) {
    errors.push("Invalid payment frequency");
  }

  const discount =
    data.annual_discount === undefined ||
    data.annual_discount === null ||
    data.annual_discount === ""
      ? 0
      : Number(data.annual_discount);

  if (
    !Number.isFinite(discount) ||
    discount < 0 ||
    discount > 10
  ) {
    errors.push(
      "Annual discount must be between 0 and 10 percent"
    );
  }

  return errors;
}

module.exports = { validateQuote };