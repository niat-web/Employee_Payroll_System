// script.js
 (function () {
  // Core Concepts
  const employeeData = [];
  let totalPayrollValue = 0.00;
  let totalTaxValue = 0.00;
  let totalNetSalaryValue = 0.00;

  // DOM Elements
  const employeeForm = document.getElementById('employeeForm');
  const employeeList = document.getElementById('employeeList');
  const searchEmployeeInput = document.getElementById('searchEmployee');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const totalPayrollSpan = document.getElementById('totalPayroll');
  const totalTaxSpan = document.getElementById('totalTax');
  const totalNetSalarySpan = document.getElementById('totalNetSalary');
  const employeeDetailsDiv = document.getElementById('employeeDetails');
  const apiDataContainer = document.getElementById('apiData');
  const refreshDataButton = document.getElementById('refreshData');

  // Dark Mode Functionality
  darkModeToggle.addEventListener('click', () => {
   document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
   const icon = darkModeToggle.querySelector('i');
   if (document.body.dataset.theme === 'dark') {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
   } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
   }
  });

  // Function to clear the form
  window.clearForm = function () {
   employeeForm.reset();
  };

  // Function to calculate net salary
  function calculateNetSalary(basicSalary, allowances, bonuses, taxPercentage, insurance, otherEarnings) {
   const grossSalary = parseFloat(basicSalary) + parseFloat(allowances || 0) + parseFloat(bonuses || 0) + parseFloat(otherEarnings || 0);
   const taxAmount = (grossSalary * parseFloat(taxPercentage || 0)) / 100;
   const netSalary = grossSalary - taxAmount - parseFloat(insurance || 0);
   return {
    grossSalary: grossSalary.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    netSalary: netSalary.toFixed(2)
   };
  }

  // Function to generate payslip
  function generatePayslip(employee) {
   const {
    grossSalary,
    taxAmount,
    netSalary
   } = calculateNetSalary(
    employee.basicSalary,
    employee.allowances,
    employee.bonuses,
    employee.tax,
    employee.insurance,
    employee.otherEarnings
   );

   const payslipHTML = `
        <div id="payslip">
            <h2>Payslip</h2>
            <div class="payslip-section">
                <h3>Employee Information</h3>
                <p><strong>Name:</strong> ${employee.name}</p>
                <p><strong>ID:</strong> ${employee.id}</p>
            </div>
            <div class="payslip-section">
                <h3>Earnings</h3>
                <p><strong>Basic Salary:</strong> $${employee.basicSalary}</p>
                <p><strong>Allowances:</strong> $${employee.allowances || 0}</p>
                <p><strong>Bonuses:</strong> $${employee.bonuses || 0}</p>
                <p><strong>Other Earnings:</strong> $${employee.otherEarnings || 0}</p>
            </div>
            <div class="payslip-section">
                <h3>Deductions</h3>
                <p><strong>Tax Deduction:</strong> $${taxAmount}</p>
                <p><strong>Insurance:</strong> $${employee.insurance || 0}</p>
            </div>
            <div class="payslip-section">
                <h3>Summary</h3>
                <p><strong>Gross Salary:</strong> $${grossSalary}</p>
                <p><strong>Net Salary:</strong> $${netSalary}</p>
            </div>
            <button class="btn btn-primary download-button" onclick="downloadPayslip('${employee.id}')">Download Payslip</button>
        </div>
    `;

   return payslipHTML;
  }

  // Function to display employee details and payslip
  function displayEmployeeDetails(employee) {
   const payslipHTML = generatePayslip(employee);
   employeeDetailsDiv.innerHTML = payslipHTML;
  }

  // Function to download payslip as PDF
  window.downloadPayslip = function (employeeId) {
   const employee = employeeData.find(emp => emp.id === employeeId);
   if (!employee) {
    alert('Employee not found.');
    return;
   }

   const {
    grossSalary,
    taxAmount,
    netSalary
   } = calculateNetSalary(
    employee.basicSalary,
    employee.allowances,
    employee.bonuses,
    employee.tax,
    employee.insurance,
    employee.otherEarnings
   );

   const doc = new jspdf.JSPDF();

   doc.text(`Payslip for ${employee.name}`, 10, 10);
   doc.text(`ID: ${employee.id}`, 10, 20);
   doc.text(`Basic Salary: $${employee.basicSalary}`, 10, 30);
   doc.text(`Allowances: $${employee.allowances || 0}`, 10, 40);
   doc.text(`Bonuses: $${employee.bonuses || 0}`, 10, 50);
   doc.text(`Other Earnings: $${employee.otherEarnings || 0}`, 10, 60);
   doc.text(`Tax Deduction: $${taxAmount}`, 10, 70);
   doc.text(`Insurance: $${employee.insurance || 0}`, 10, 80);
   doc.text(`Gross Salary: $${grossSalary}`, 10, 90);
   doc.text(`Net Salary: $${netSalary}`, 10, 100);

   doc.save(`payslip_${employee.name}.pdf`);
  };

  // Function to add employee to the list
  function addEmployeeToList(employee) {
   const row = document.createElement('tr');
   row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.department}</td>
            <td>
                <button class="btn btn-sm btn-info view-details" data-id="${employee.id}">View</button>
                <button class="btn btn-sm btn-danger delete-employee" data-id="${employee.id}">Delete</button>
            </td>
        `;
   employeeList.appendChild(row);

   // Attach event listeners to the buttons
   const viewButton = row.querySelector('.view-details');
   viewButton.addEventListener('click', () => {
    displayEmployeeDetails(employee);
   });

   const deleteButton = row.querySelector('.delete-employee');
   deleteButton.addEventListener('click', () => {
    deleteEmployee(employee.id);
   });
  }

  // Function to delete an employee
  function deleteEmployee(employeeId) {
   const index = employeeData.findIndex(emp => emp.id === employeeId);
   if (index > -1) {
    employeeData.splice(index, 1);
    updateEmployeeList();
    updatePayrollSummary();
    employeeDetailsDiv.innerHTML = ''; // Clear details after deletion
    saveDataToLocalStorage(); // Save updated data to local storage
   }
  }

  // Function to update the employee list
  function updateEmployeeList() {
   employeeList.innerHTML = ''; // Clear the current list
   employeeData.forEach(employee => {
    addEmployeeToList(employee);
   });
  }

  // Function to update payroll summary
  function updatePayrollSummary() {
   totalPayrollValue = employeeData.reduce((total, employee) => {
    const {
     grossSalary
    } = calculateNetSalary(
     employee.basicSalary,
     employee.allowances,
     employee.bonuses,
     employee.tax,
     employee.insurance,
     employee.otherEarnings
    );
    return total + parseFloat(grossSalary);
   }, 0);

   totalTaxValue = employeeData.reduce((total, employee) => {
    const {
     taxAmount
    } = calculateNetSalary(
     employee.basicSalary,
     employee.allowances,
     employee.bonuses,
     employee.tax,
     employee.insurance,
     employee.otherEarnings
    );
    return total + parseFloat(taxAmount);
   }, 0);

   totalNetSalaryValue = employeeData.reduce((total, employee) => {
    const {
     netSalary
    } = calculateNetSalary(
     employee.basicSalary,
     employee.allowances,
     employee.bonuses,
     employee.tax,
     employee.insurance,
     employee.otherEarnings
    );
    return total + parseFloat(netSalary);
   }, 0);

   totalPayrollSpan.textContent = totalPayrollValue.toFixed(2);
   totalTaxSpan.textContent = totalTaxValue.toFixed(2);
   totalNetSalarySpan.textContent = totalNetSalaryValue.toFixed(2);
  }

  // Function to handle form submission
  employeeForm.addEventListener('submit', function (event) {
   event.preventDefault();

   // Get form values
   const name = document.getElementById('employeeName').value;
   const id = document.getElementById('employeeId').value;
   const department = document.getElementById('employeeDepartment').value;
   const contact = document.getElementById('employeeContact').value;
   const basicSalary = document.getElementById('basicSalary').value;
   const allowances = document.getElementById('allowances').value;
   const bonuses = document.getElementById('bonuses').value;
   const tax = document.getElementById('tax').value;
   const insurance = document.getElementById('insurance').value;
   const otherEarnings = document.getElementById('otherEarnings').value;

   // Validate inputs (basic validation)
   if (!name || !id || !department || !contact || !basicSalary) {
    alert('Please fill in all required fields.');
    return;
   }

   // Create employee object
   const employee = {
    name,
    id,
    department,
    contact,
    basicSalary,
    allowances,
    bonuses,
    tax,
    insurance,
    otherEarnings
   };

   // Add employee to data array
   employeeData.push(employee);

   // Add employee to list
   addEmployeeToList(employee);

   // Update payroll summary
   updatePayrollSummary();

   // Save data to local storage
   saveDataToLocalStorage();

   // Clear the form
   clearForm();

  });

  // Function to filter employees
  function filterEmployees(searchTerm) {
   const searchTermLower = searchTerm.toLowerCase();
   return employeeData.filter(employee => {
    return (
     employee.name.toLowerCase().includes(searchTermLower) ||
     employee.department.toLowerCase().includes(searchTermLower) ||
     employee.id.toLowerCase().includes(searchTermLower)
    );
   });
  }

  // Function to handle search input
  searchEmployeeInput.addEventListener('input', function () {
   const searchTerm = searchEmployeeInput.value;
   const filteredEmployees = filterEmployees(searchTerm);

   // Clear the current list
   employeeList.innerHTML = '';

   // Add filtered employees to the list
   filteredEmployees.forEach(employee => {
    addEmployeeToList(employee);
   });
  });

  // Local Storage functions
  function saveDataToLocalStorage() {
   localStorage.setItem('employeePayrollData', JSON.stringify(employeeData));
  }

  function loadDataFromLocalStorage() {
   const data = localStorage.getItem('employeePayrollData');
   if (data) {
    const parsedData = JSON.parse(data);
    employeeData.push(...parsedData); // Append loaded data instead of replacing
    updateEmployeeList();
    updatePayrollSummary();
   }
  }

  // Load data from local storage on page load
  loadDataFromLocalStorage();
  // Function to fetch data from API
  async function fetchData(url) {
   try {
    const response = await fetch(url);
    if (response.ok) {
     return await response.json();
    } else {
     const proxyUrl = `https://api.allorigins.win/raw?url=${url}`;
     const proxyResponse = await fetch(proxyUrl);
     if (proxyResponse.ok) {
      return await proxyResponse.json();
     } else {
      return null;
     }
    }
   } catch (error) {
    const proxyUrl = `https://api.allorigins.win/raw?url=${url}`;
    const proxyResponse = await fetch(proxyUrl);
    if (proxyResponse.ok) {
     return await proxyResponse.json();
    } else {
     return null;
    }
   }
  }

  // Function to display API data in the table
  function displayApiData(data) {
   apiDataContainer.innerHTML = ''; // Clear existing data

   if (data && Array.isArray(data)) {
    data.forEach(item => {
     const row = document.createElement('tr');
     row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.age}</td>
            <td>${item.username}</td>
            <td>${item.email}</td>
            <td>${item.address.street}, ${item.address.city}, ${item.address.zip}</td>
            <td>${item.phone}</td>
            <td><a href="${item.website}" target="_blank">${item.website}</a></td>
            <td>${item.occupation}</td>
            <td>${item.hobbies.join(', ')}</td>
        `;
     apiDataContainer.appendChild(row);
    });
   } else {
    apiDataContainer.innerHTML = '<tr><td colspan="10">Failed to load data.</td></tr>';
   }
  }

  // Event listener for the refresh data button
  refreshDataButton.addEventListener('click', async () => {
   const apiUrl = 'https://www.freetestapi.com/api/v1/users';
   const data = await fetchData(apiUrl);
   if (data) {
    const shuffledData = data.sort(() => Math.random() - 0.5);
    displayApiData(shuffledData);
   } else {
    apiDataContainer.innerHTML = '<tr><td colspan="10">Failed to load data.</td></tr>';
   }
  });

  // Initial load of API data
  async function initializeApiData() {
   const apiUrl = 'https://www.freetestapi.com/api/v1/users';
   const data = await fetchData(apiUrl);
   if (data) {
    const shuffledData = data.sort(() => Math.random() - 0.5);
    displayApiData(shuffledData);
   } else {
    apiDataContainer.innerHTML = '<tr><td colspan="10">Failed to load data.</td></tr>';
   }
  }

  initializeApiData();

 })();