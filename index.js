const sheet_url =
  "https://script.google.com/macros/s/AKfycbykSvVXttwBKw1T96MPHUbl6L-KD8LeZ-i36_pyePbJst_IAiehbu-Snxv3iH1N2_n8R/exec?sheet=0";

// initial value of offer
const prev_main_container = document.querySelector(".prev_main_container");
if (prev_main_container) {
  const initial = `<h3 class="preview_heading">Offer for you</h3>
  <div class="offer_container">
    <div class="prev_items" style="justify-content: center">
      <h4>Loading Offer...</h4>
    </div>
  </div>`;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = initial;
  insertAsThird(tempDiv, prev_main_container);
}

// element insert function
function insertAsThird(element, parent) {
  if (parent.children.length > 2) {
    parent.insertBefore(element, parent.children[2]);
  } else parent.appendChild(element);
}

// input selector
const plan_input = document.querySelector('[data-q="plan"]');
const issuer_input = document.querySelector('[data-q="issuer"]');
const metal_level_input = document.querySelector('[data-q="metal_level"]');

// zip code
const zip_code = 27016;
lookUpZipCodeByOfferInSheet(zip_code);

// Fetching data from google sheet
async function lookUpZipCodeByOfferInSheet(zip_code) {
  const offer_container = document.querySelector(".offer_container");
  let offer_content;
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
    if (error) {
      offer_container.innerHTML = `
		<div class="prev_items" style="justify-content: center;">
    		<h4>Offer not found</h4>
		</div>`;
    }
    throw new Error(error);
  }

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

    if (plan_input && issuer_input && metal_level_input) {
      // set input value
      function setInputValue() {
        plan_input.value = lookupData.plan;
        issuer_input.value = lookupData.issuer;
        metal_level_input.value = lookupData.metal_level;
      }

      setInputValue();

      const inputEvent = new Event("input", {
        bubbles: true,
        cancelable: true,
      });

      plan_input.dispatchEvent(inputEvent);
      issuer_input.dispatchEvent(inputEvent);
      metal_level_input.dispatchEvent(inputEvent);
    }
  }
  if (!lookupData.status) {
    offer_content = `
  <div class="prev_items" style="justify-content: center;">
      <h4>Not found Offer</h4>
  </div>
  `;
  }
  if (offer_container) {
    offer_container.innerHTML = offer_content;
  }
}
