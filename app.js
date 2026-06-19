// Base API URL for fetching currency rates
const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

// Selecting required HTML elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


// Function to update country flag when currency changes
const updateFlag = (element) => {
  // Get selected currency code (USD, INR, EUR...)
  let currCode = element.value;

  // Get corresponding country code from countryList object
  let countryCode = countryList[currCode];

  // Create flag image URL
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  // Find the image tag inside the dropdown container
  let img = element.parentElement.querySelector("img");

  // Change flag image
  img.src = newSrc;
};


// Populate both dropdowns with currency codes
for (let select of dropdowns) {

  // Loop through all currencies in countryList
  for (let currCode in countryList) {

    let newOption = document.createElement("option");

    // Set option text and value
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Default "From" currency = USD
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    }

    // Default "To" currency = INR
    else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    // Add option to dropdown
    select.append(newOption);
  }

  // Show flags when page loads
  updateFlag(select);

  // Update flag whenever user changes currency
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}


// Function to fetch exchange rate and calculate conversion
const updateExchangeRate = async () => {

  // Get amount input field
  let amount = document.querySelector(".amount input");

  // Read entered amount
  let amtVal = amount.value;

  // If input is empty or invalid, use 1
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  try {

    // Example:
    // https://latest.currency-api.pages.dev/v1/currencies/usd.json
    const URL =
      `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

    // Fetch data from API
    let response = await fetch(URL);

    // Check if request succeeded
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    // Convert response to JSON
    let data = await response.json();

    // Extract exchange rate
    let rate =
      data[fromCurr.value.toLowerCase()]
          [toCurr.value.toLowerCase()];

    // Calculate converted amount
    let finalAmount = amtVal * rate;

    // Display result
    msg.innerText =
      `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

  } catch (err) {

    // Show error message if API fails
    msg.innerText = "Failed to fetch exchange rate";

    console.error(err);
  }
};


// When Convert button is clicked
btn.addEventListener("click", async (evt) => {

  // Prevent page refresh
  evt.preventDefault();

  // Update exchange rate
  await updateExchangeRate();
});


// Run once when page loads
window.addEventListener("load", () => {
  updateExchangeRate();
});