function addRow() {
  const table = document.getElementById("items");
  const row = table.insertRow();
  row.innerHTML = `
    <td><input></td>
    <td><input type="number" value="1" oninput="calculate()"></td>
    <td><input type="number" value="0" oninput="calculate()"></td>
    <td class="lineTotal">0</td>
  `;
}

function calculate() {
  let subtotal = 0;
  const rows = document.querySelectorAll("#items tr");

  rows.forEach((row, i) => {
    if (i === 0) return;
    const qty = row.cells[1].children[0].value;
    const price = row.cells[2].children[0].value;
    const total = qty * price;
    row.querySelector(".lineTotal").innerText = total;
    subtotal += total;
  });

  const tax = document.getElementById("tax").value;
  const grand = subtotal + (subtotal * tax / 100);
  document.getElementById("grandTotal").innerText = grand.toFixed(2);
}

document.getElementById("logoInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById("logoPreview").src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("template").addEventListener("change", e => {
  const invoice = document.getElementById("invoice");
  invoice.className = "invoice " + e.target.value;
});

function generatePDF() {
  document.getElementById("pCompany").innerText = company.value;
  document.getElementById("pClient").innerText = client.value;
  document.getElementById("pInvoice").innerText = invoiceNo.value;
  document.getElementById("pDate").innerText = invoiceDate.value;

  const body = document.querySelector("#previewTable tbody");
  body.innerHTML = "";

  document.querySelectorAll("#items tr").forEach((row, i) => {
    if (i === 0) return;
    body.innerHTML += `
      <tr>
        <td>${row.cells[0].children[0].value}</td>
        <td>${row.cells[1].children[0].value}</td>
        <td>${row.cells[2].children[0].value}</td>
        <td>${row.querySelector(".lineTotal").innerText}</td>
      </tr>
    `;
  });

  html2pdf().set({
    margin: 10,
    filename: "invoice.pdf",
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4" }
  }).from(document.getElementById("invoice")).save();
}
