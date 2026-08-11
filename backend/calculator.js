const hospitalPrices = {
  None: 0,
  Basic: 90,
  Bronze: 120,
  Silver: 160,
  Gold: 220
};

const extrasPrices = {
  None: 0,
  Basic: 25,
  Standard: 45,
  Premium: 70
};

function calculateLoading(age, history, hospitalCover) {
  if (hospitalCover === "None") return 0;
  if (history === "Yes") return 0;
  if (history === "Not sure") return 0;

  if (history === "No" && age > 30) {
    return (age - 30) * 0.02;
  }

  return 0;
}

function calculateQuote(data) {
  const adultCount = data.cover_type === "Single" ? 1 : 2;

  const hospitalBase = hospitalPrices[data.hospital_cover];
  const extrasBase = extrasPrices[data.extras_cover];

  const applicant1Loading = calculateLoading(
    data.applicant1_age,
    data.applicant1_cover_history,
    data.hospital_cover
  );

  let applicant2Loading = 0;

  if (adultCount === 2) {
    applicant2Loading = calculateLoading(
      data.applicant2_age,
      data.applicant2_cover_history,
      data.hospital_cover
    );
  }

  const applicant1Hospital =
    hospitalBase * (1 + applicant1Loading);

  const applicant2Hospital =
    adultCount === 2
      ? hospitalBase * (1 + applicant2Loading)
      : 0;

  const hospitalTotal =
    applicant1Hospital + applicant2Hospital;

  const extrasTotal =
    extrasBase * adultCount;

  const familyFee =
    data.cover_type === "Family" ? 30 : 0;

  const monthlyPremium =
    hospitalTotal + extrasTotal + familyFee;

  const yearlyBeforeDiscount =
    monthlyPremium * 12;

  const discount =
    data.payment_frequency === "Yearly"
      ? data.annual_discount / 100
      : 0;

  const yearlyAfterDiscount =
    yearlyBeforeDiscount * (1 - discount);

  const warnings = [];

  if (data.applicant1_cover_history === "Not sure") {
    warnings.push(
      "Applicant 1: Cover history is unknown — LHC loading has not been applied. This quote may be inaccurate."
    );
  }

  if (
    adultCount === 2 &&
    data.applicant2_cover_history === "Not sure"
  ) {
    warnings.push(
      "Applicant 2: Cover history is unknown — LHC loading has not been applied. This quote may be inaccurate."
    );
  }

  return {
    applicant1LoadingPercent: applicant1Loading * 100,
    applicant2LoadingPercent: applicant2Loading * 100,
    hospitalTotal,
    extrasTotal,
    familyFee,
    monthlyPremium,
    yearlyBeforeDiscount,
    yearlyAfterDiscount,
    warnings,
    lhcStatement:
      "Lifetime Health Cover loading applies only to hospital cover. It does not apply to extras cover."
  };
}

module.exports = { calculateQuote };