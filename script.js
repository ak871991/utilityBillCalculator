function updateFormattedDate() {
  const dateInput = document.getElementById("datePicker").value;
  if (dateInput) {
    const dateObj = new Date(dateInput);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-GB", options);
    document.getElementById("datePicker").setAttribute("data-formatted", formattedDate);
  }
}

function calculateBill() {
  const dateInput = document.getElementById("datePicker").value;
  if (!dateInput) {
    document.getElementById("billOutput").textContent = "❌ Please select a date.";
    return;
  }

  const formattedDate = document.getElementById("datePicker").getAttribute("data-formatted") || dateInput;

  const totalBill = parseFloat(document.getElementById("totalBill").value);
  const totalUnits = parseFloat(document.getElementById("totalUnits").value);
  const meter1Prev = parseFloat(document.getElementById("meter1Prev").value);
  const meter1Curr = parseFloat(document.getElementById("meter1Curr").value);
  const meter2Prev = parseFloat(document.getElementById("meter2Prev").value);
  const meter2Curr = parseFloat(document.getElementById("meter2Curr").value);
  const waterBill = parseFloat(document.getElementById("waterBill").value);
  const rent = parseFloat(document.getElementById("rent").value);
  const divideMeter2 = document.getElementById("divideMeter2").checked;
  const divideWater = document.getElementById("divideWater").checked;

  if (
    isNaN(totalBill) || isNaN(totalUnits) || isNaN(meter1Prev) || isNaN(meter1Curr) ||
    isNaN(meter2Prev) || isNaN(meter2Curr) || isNaN(waterBill) || isNaN(rent)
  ) {
    document.getElementById("billOutput").textContent = "❌ Please fill all fields correctly.";
    return;
  }

  const perUnitCost = totalBill / totalUnits;
  const meter1Units = meter1Curr - meter1Prev;
  let meter2Units = meter2Curr - meter2Prev;
  if (divideMeter2) meter2Units /= 2;

  const totalTenantUnits = meter1Units + meter2Units;
  const tenantElectricityBill = totalTenantUnits * perUnitCost;
  let tenantWaterBill = waterBill;
  if (divideWater) tenantWaterBill /= 2;

  const totalAmount = rent + tenantElectricityBill + tenantWaterBill;

  const billSummary = 
\`🙏 ॐ नमः शिवाय 🙏

📅 DATE: \${formattedDate}

⚡ TOTAL ELECTRICITY BILL: ₹\${totalBill.toFixed(2)}
🔢 TOTAL UNITS: \${totalUnits.toFixed(2)}
💰 PER UNIT COST: ₹\${perUnitCost.toFixed(2)}

----------------------------------------

🔌 METER 1 USAGE: (\${meter1Curr.toFixed(2)} - \${meter1Prev.toFixed(2)}) = \${meter1Units.toFixed(2)} UNITS
💦 METER 2 USAGE: (\${meter2Curr.toFixed(2)} - \${meter2Prev.toFixed(2)}) \${divideMeter2 ? "/ 2" : ""} = \${meter2Units.toFixed(2)} UNITS
📊 TOTAL TENANT USAGE: \${totalTenantUnits.toFixed(2)} UNITS

----------------------------------------

⚡ ELECTRICITY BILL: ₹\${tenantElectricityBill.toFixed(2)}

💧 WATER BILL: ₹\${waterBill.toFixed(2)} \${divideWater ? " / 2 = ₹" + tenantWaterBill.toFixed(2) : ""}
🏠 RENT: ₹\${rent.toFixed(2)}

----------------------------------------

💵 TOTAL AMOUNT PAYABLE: ₹\${totalAmount.toFixed(2)}

✨ धन्यवाद! ✨\`;

  document.getElementById("billOutput").textContent = billSummary;
}

function printBill() {
  const printContent = document.getElementById("billOutput").innerText;
  const win = window.open('', '', 'height=800,width=600');
  win.document.write('<pre>' + printContent + '</pre>');
  win.document.close();
  win.print();
}

document.getElementById("darkModeToggle").addEventListener("change", function () {
  document.body.classList.toggle("dark", this.checked);
});

function downloadPDF() {
  const content = document.getElementById("billOutput").innerText;
  const blob = new Blob([content], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "utility-bill.pdf";
  link.click();
}
