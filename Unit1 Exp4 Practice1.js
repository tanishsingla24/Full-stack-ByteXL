const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initial employee array (for demonstration)
let employees = [
  { name: 'Alice', id: 'E101' },
  { name: 'Bob', id: 'E102' },
  { name: 'Charlie', id: 'E103' }
];

function showMenu() {
  console.log("\nEmployee Management System");
  console.log("1. Add Employee");
  console.log("2. List Employees");
  console.log("3. Remove Employee");
  console.log("4. Exit");
  rl.question("\nEnter your choice: ", handleMenu);
}

function handleMenu(choice) {
  switch (choice.trim()) {
    case '1':
      rl.question("Enter employee name: ", name => {
        rl.question("Enter employee ID: ", id => {
          employees.push({ name, id });
          console.log(`Employee ${name} (ID: ${id}) added successfully.`);
          showMenu();
        });
      });
      break;
    case '2':
      console.log("\nEmployee List:");
      employees.forEach((emp, idx) => {
        console.log(`${idx + 1}. Name: ${emp.name}, ID: ${emp.id}`);
      });
      showMenu();
      break;
    case '3':
      rl.question("Enter employee ID to remove: ", id => {
        const index = employees.findIndex(emp => emp.id === id);
        if (index === -1) {
          console.log(`Employee with ID ${id} not found.`);
        } else {
          const removed = employees.splice(index, 1)[0];
          console.log(`Employee ${removed.name} (ID: ${removed.id}) removed successfully.`);
        }
        showMenu();
      });
      break;
    case '4':
      rl.close();
      break;
    default:
      console.log("Invalid choice. Please try again.");
      showMenu();
  }
}

showMenu();

rl.on('close', () => {
  console.log('\nExiting Employee Management System.');
  process.exit(0);
});
