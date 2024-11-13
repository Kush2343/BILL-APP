// document.addEventListener("DOMContentLoaded", function() {
//     const initialRows = 5;
//     const addRowButton = document.getElementById("add-row-btn");
//     const tableBody = document.querySelector("#billing-table tbody");

//     // Function to add a new row to the table
//     function addRow() {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td><input type="text" name="label[]" placeholder="Label"></td>
//             <td><input type="text" name="data[]" placeholder="Data (numeric/alphabet)"></td>
//         `;
//         tableBody.appendChild(row);
//     }

//     // Add initial rows
//     for (let i = 0; i < initialRows; i++) {
//         addRow();
//     }

//     // Add more rows when the "Add More Rows" button is clicked
//     addRowButton.addEventListener("click", addRow);

//     // Handle form submission and generate the bill PDF
//     document.getElementById("billing-form").addEventListener("submit", function(e) {
//         e.preventDefault();

//         // Get the label and data values from the inputs
//         const labels = Array.from(document.querySelectorAll('input[name="label[]"]')).map(input => input.value);
//         const data = Array.from(document.querySelectorAll('input[name="data[]"]')).map(input => input.value);

//         // Filter out empty rows to ensure only filled rows are included
//         const billContent = labels.map((label, index) => [label, data[index]])
//             .filter(row => row[0] && row[1]); // Only include rows with both label and data

//         // Debugging: Log bill content to ensure data is correct
//         console.log("Bill Content:", billContent);

//         // Check if there's data to add to the PDF
//         // Check if there's data to add to the PDF
//         if (billContent.length > 0) {
//             // Call the generatePDF function with the content
//             const billNumber = generateBillNumber();
//             generatePDF(billNumber, billContent);

//             // Send bill data to backend for storage
//             sendBillDataToBackend(billNumber, billContent);
//         } else {
//             alert("Please enter data in the table rows before generating the bill.");
//         }
//     });
//     function generateBillNumber() {
//         return Math.floor(Math.random() * 9000) + 1000;
//     }
//     // Function to generate the PDF
//     function generatePDF(content) {
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF();

//         // Check if autoTable plugin is available
//         if (typeof doc.autoTable !== "function") {
//             console.error("autoTable plugin is not loaded correctly.");
//             alert("There was an issue loading the table plugin.");
//             return;
//         }

//         // Add watermark
//         doc.setTextColor(200, 200, 200);
//         doc.setFontSize(50);
//         doc.text("k.m.b", 105, 150, { angle: 45, align: "center" });

//         // Add bill number text
//         const billNumber = Math.floor(Math.random() * 9000) + 1000;
//         doc.setTextColor(0, 0, 0);
//         doc.setFontSize(12);
//         doc.text("Bill Number: " + billNumber, 10, 20);

//         // Add the table using autoTable
//         doc.autoTable({
//             head: [['Label', 'Data']],
//             body: content,
//             startY: 40, // Position the table after header
//         });

//         // Save the PDF
//         doc.save(`bill_${billNumber}.pdf`);
//     }

//     function sendBillDataToBackend(billNumber, content) {
//         const billData = {
//             billNumber: billNumber,
//             content: content,
//         };

//         fetch('/save-bill', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(billData),
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Bill data saved successfully:', data);
//         })
//         .catch(error => {
//             console.error('Error saving bill data:', error);
//         });
//     }
// });

document.addEventListener("DOMContentLoaded", function() {
    const initialRows = 5;
    const addRowButton = document.getElementById("add-row-btn");
    const tableBody = document.querySelector("#billing-table tbody");

    // Function to add a new row to the table
    function addRow() {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" name="label[]" placeholder="Label"></td>
            <td><input type="text" name="data[]" placeholder="Data (numeric/alphabet)"></td>
        `;
        tableBody.appendChild(row);
    }

    // Add initial rows
    for (let i = 0; i < initialRows; i++) {
        addRow();
    }

    // Add more rows when the "Add More Rows" button is clicked
    addRowButton.addEventListener("click", addRow);

    // Handle form submission and generate the bill PDF
    document.getElementById("billing-form").addEventListener("submit", function(e) {
        e.preventDefault();

        // Get the label and data values from the inputs
        const labels = Array.from(document.querySelectorAll('input[name="label[]"]')).map(input => input.value);
        const data = Array.from(document.querySelectorAll('input[name="data[]"]')).map(input => input.value);

        // Filter out empty rows to ensure only filled rows are included
        const billContent = labels.map((label, index) => [label, data[index]])
            .filter(row => row[0] && row[1]); // Only include rows with both label and data

        // Debugging: Log bill content to ensure data is correct
        console.log("Bill Content:", billContent);

        // Check if there's data to add to the PDF
        if (billContent.length > 0) {
            // Call the generatePDF function with the content
            const billNumber = generateBillNumber();
            generatePDF(billNumber, billContent);

            // Send bill data to backend for storage
            sendBillDataToBackend(billNumber, billContent);
        } else {
            alert("Please enter data in the table rows before generating the bill.");
        }
    });

    // Function to generate a random bill number
    function generateBillNumber() {
        return Math.floor(Math.random() * 9000) + 1000;
    }

    // Function to generate the PDF
    function generatePDF(billNumber, content) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add watermark
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(50);
        doc.text("k.m.b", 105, 150, { angle: 45, align: "center" });

        // Add bill number text
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("Bill Number: " + billNumber, 10, 20);

        // Add the table using autoTable
        doc.autoTable({
            head: [['Label', 'Data']],
            body: content,
            startY: 40, // Position the table after header
        });

        // Save the PDF
        doc.save(`bill_${billNumber}.pdf`);
    }

    // Function to send the bill data to the backend
    function sendBillDataToBackend(billNumber, content) {
        const now = new Date();
        const billDateTime = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0]; // Format: YYYY-MM-DD HH:mm:ss
        const billData = {
            billNumber: billNumber,
            BillDate: billDateTime,
            content: content,
        };
    
        fetch('http://localhost:3000/save-bill', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(billData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Bill data saved successfully:', data);
        })
        .catch(error => {
            console.error('Error saving bill data:', error);
        });
    }
    
});
