// Necessary Imports, DO NOT REMOVE
const { LinkedList } = require('./LinkedList');
const { Student } = require('./Student');
const readline = require('readline');

// Initialize terminal interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const studentManagementSystem = new LinkedList();

// Display available commands
function main() {
  console.log(`
      Available Commands:
      - add [name] [year] [email] [specialization]: Add a student
      - remove [email]: Remove a student by email
      - display: Show all students
      - find [email]: Find a student by email
      - save: Save the current linked list to the specified file
      - load [fileName]: Load a linked list from a file
      - clear: Clear the current linked list
      - q: Quit the terminal
  `);
}

// Command handling logic
async function handleCommand(command) {
  const [operation, ...args] = command.trim().split(' ');

  switch (operation) {
    case 'add':
      console.log('Adding student...');
      const [name, year, email, specialization] = args;
      if (args.length < 4) {
        console.log(
          'Provide all arguments name , year email and specialization'
        );
        return;
      }
      const student = new Student(name, year, email, specialization);
      studentManagementSystem.addStudent(student);
      let result = studentManagementSystem.displayStudents();
      console.log(result);
      break;

    case 'remove':
      const [emailTobeRemoved] = args;
      console.log('Removing student...');

      if (emailTobeRemoved) {
        studentManagementSystem.removeStudent(emailTobeRemoved);
        console.log(studentManagementSystem.displayStudents());
        console.log('Student removed from list');
      } else {
        console.log('Provide an email id to remove a student');
      }
      break;

    case 'display':
      console.log('Displaying students...');
      let output = studentManagementSystem.displayStudents();
      if (!output) {
        console.log('There are no student in the list!');
        return;
      } else [console.log(output)];
      break;

    case 'find':
      console.log('Finding student...');
      const [emailToSearch] = args;
      if (!emailToSearch) {
        console.log('Please enter an email id');
      } else {
        const emailFound = studentManagementSystem.findStudent(emailToSearch);
        if (emailFound === -1) {
          console.log('Student not found');
        } else {
          console.log('Student found! Student detail are as follow: ');
          console.log(emailFound.getString());
        }
      }
      break;

    case 'save':
      console.log('Saving data...');
      const [fileToSave] = args;
      if (!fileToSave) {
        console.log('Please enter a file name where data will be saved');
      } else {
        await studentManagementSystem.saveToJson(fileToSave);
        let output = studentManagementSystem.displayStudents();
        if (!output) {
          console.log('List is empty');
        } else {
          console.log(output);
        }
      }

    case 'load':
      console.log('Loading data...');
      const [fileToLoad] = args;
      if (!fileToLoad) {
        console.log('Please enter a file name from where data has o be loaded');
      } else {
        await studentManagementSystem.loadFromJSON(fileToLoad);
        let output = studentManagementSystem.displayStudents();
        console.log(output);
      }
      break;

    case 'clear':
      console.log('Clearing data...');
      studentManagementSystem.clearStudents();
      console.log('Tyoe clear command  to see the empty list');
      break;

    case 'q':
      console.log('Exiting...');
      rl.close();
      break;

    default:
      console.log('Unknown command. Type "help" for a list of commands.');
      break;
  }
}

// Start terminal-based interaction (DO NOT MODIFY)
console.log('Welcome to the Student Management System!');
main();
rl.on('line', async (input) => {
  if (input.trim().toLowerCase() === 'help') {
    main();
  } else {
    await handleCommand(input);
  }
});
rl.on('close', () => {
  console.log('Goodbye!');
});
