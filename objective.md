# Employee_Payroll_System

## Objective
This project simulates an employee payroll system using JavaScript. It allows users to add employee data, calculate net salaries with tax and other deductions, generate payslips, view employee details, delete employees, and persist data using local storage. Additionally, the system fetches and displays user data from an external API, enhancing the application's functionality by providing a source of external data for demonstration or augmentation. The application also has Dark Mode functionality. Technologies used include JavaScript, HTML, CSS, jspdf library and Local Storage.

## Output
<iframe src="https://github.com/niat-web/Employee_Payroll_System" height="1000" width="300" title="Employee_Payroll_System"></iframe>

## Project Requirements
**Technologies:** JavaScript, HTML, CSS, jspdf library (for PDF generation), Local Storage, freeTestApi.com (for fetching external user data).

## Features to Implement
- Add new employee records with details such as name, ID, department, contact, and salary information.
- Calculate net salary based on basic salary, allowances, bonuses, tax, insurance, and other earnings.
- Generate and display a downloadable payslip for each employee in PDF format using the jspdf library.

## UI Enhancements
- Implement a dark mode toggle for improved user experience in different lighting conditions.
- Improve the visual presentation of the employee list and details sections for better readability.

## Project Tasks & Expected Outcomes
| Task | Expected Outcome |
|------|------------------|
| Implement Form Submission | Employee data is captured, validated, and stored in the `employeeData` array. |
| Implement Net Salary Calculation | Correct `grossSalary`, `taxAmount`, and `netSalary` are calculated based on employee data. |
| Implement Payslip Generation | A well-formatted HTML payslip is generated for each employee. |
| Implement Local Storage Persistence | Employee data is saved to and loaded from local storage. |
| Implement Employee Search | Filter employees based on name, department, or ID. |
| Implement API Data Fetching and Display | Fetch user data from 'https://www.freetestapi.com/api/v1/users' and display in a table. |
| Implement Dark Mode | Toggle between light and dark themes with a button click. |
| Implement Employee Deletion | Delete an employee record from the `employeeData` array and local storage. |
| Implement Employee Details View | Displays a generated payslip of the selected employee|

## JavaScript Concepts
| Concept | Implementation |
|---------|----------------|
| DOM Manipulation | Used to access and modify HTML elements for displaying employee data, handling form submissions, and updating the UI. |
| Event Listeners | Used to handle form submission, button clicks (view, delete), search input, and dark mode toggle. |
| Arrays & Objects | `employeeData` array stores employee objects, which contain employee information. |
| Functions | Modularize code for tasks like calculating net salary, generating payslips, updating the employee list, and handling local storage. |
| Local Storage | Used to persist employee data in the browser. |
| Fetch API | Used to retrieve user data from an external API ('https://www.freetestapi.com/api/v1/users'). |
| Template Literals | Used to generate HTML strings for the employee list and payslips. |

## API Details
| API | Endpoint | Description |
|-----|----------|-------------|
| FreeTestApi | `https://www.freetestapi.com/api/v1/users` | Provides user data (id, name, age, username, email, address, phone, website, occupation, hobbies) for display in the application. |