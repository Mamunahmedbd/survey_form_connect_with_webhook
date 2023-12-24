const sheet_url =
  "https://script.google.com/macros/s/AKfycbykSvVXttwBKw1T96MPHUbl6L-KD8LeZ-i36_pyePbJst_IAiehbu-Snxv3iH1N2_n8RQ/exec?sheet=0";

const offer_container = document.querySelector(".offer_container");

const zip_code = 27016;
lookUpZipCodeByOfferInSheet(zip_code);

// Fetching data from google sheet
async function lookUpZipCodeByOfferInSheet(zip_code) {
  const lookupOptions = {
    action: "lookup",
    data: {
      zip_code: zip_code,
    },
  };

  let lookupData;

  try {
    const request = await fetch(sheet_url, {
      method: "POST",
      body: JSON.stringify(lookupOptions),
    });
    const response = await request.json();
    lookupData = response;
    console.log(response);
  } catch (error) {
    throw new Error(error);
  }
  let offer_content;
  //   hideLoading();
  if (lookupData.status) {
    offer_content = `
    <div class="prev_items">
        <strong>Plan:</strong>
        <span>${lookupData.plan}</span>
    </div>
    <div class="prev_items">
        <strong>Metal level:</strong>
        <span>${lookupData.metal_level}</span>
    </div>
    <div class="prev_items">
        <strong>Issuer:</strong>
        <span>${lookupData.issuer}</span>
    </div>
  `;
  }
  if (!lookupData.status) {
    offer_content = `
  <div class="prev_items" style="justify-content: center;">
      <h4>Not found Offer</h4>
  </div>
  `;
  }
  offer_container.innerHTML = offer_content;
}

const offer_data = lookUpZipCodeByOfferInSheet(zip_code);
console.log(offer_data);
