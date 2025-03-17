// Necessary Imports (you will need to use this)
const { Student } = require('./Student');
const fs = require('node:fs/promises');

/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data; // Student
  next; // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head; // Object
  tail; // Object
  length; // Number representing size of LinkedList

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  addStudent(student) {
    const newNode = new Node(student);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  removeStudent(email) {
    // if length is zero returb
    if (this.length === 0) {
      return;
    }
    // if length is one and email matches head node
    if (this.length === 1) {
      if (this.head.data.getEmail() === email) {
        this.head = null;
        this.tail = null;
        this.length--;
        return;
      } else {
        return;
      }
    }

    // if lenth is greater than 1 and head email matches
    if (this.length > 1 && this.head.data.getEmail() === email) {
      let currentHead = this.head;
      this.head = currentHead.next;
      this.length--;
      return;
    }

    // if student to be removed is from middle or last
    let current = this.head;
    let prev = null;

    while (current.next) {
      prev = current;
      current = current.next;

      if (current.data.getEmail() === email) {
        // student to be removed is last node;
        if (current === this.tail) {
          prev.next = null;
          this.tail = prev;
          this.length--;
        } else {
          prev.next = current.next;
          this.length--;
        }
        return;
      }
    }
  }

  findStudent(email) {
    if (this.length === 0) {
      return -1;
    }
    let current = this.head;
    while (current) {
      if (current.data.getEmail() === email) {
        return current.data;
      }
      current = current.next;
    }
    return -1;
  }

  clearStudents() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  displayStudents() {
    let output = [];
    let current = this.head;
    while (current) {
      output.push(current.data.getName());
      current = current.next;
    }
    return output.join(', ');
  }

  #sortStudentsByName() {
    let sortedArray = [];
    let current = this.head;
    while (current) {
      sortedArray.push(current.data.getName());
      current = current.next;
    }
    return sortedArray.sort();
  }

  filterBySpecialization(specialization) {
    const filteredArray = [];
    let current = this.head;
    if (!current) {
      return [];
    }
    while (current) {
      if (current.data.getSpecialization() === specialization) {
        filteredArray.push(current.data);
      }
      current = current.next;
    }
    if (filteredArray.length === 0) {
      return [];
    }

    return filteredArray.sort((a, b) => a.getName().localeCompare(b.getName()));
  }

  filterByMinAge(minAge) {
    let filteredArray = [];
    if (!this.head) {
      return filteredArray;
    }
    let current = this.head;
    while (current) {
      if (current.data.getYear() >= minAge) {
        filteredArray.push(current.data);
      }
      current = current.next;
    }
    if (filteredArray.length === 0) {
      return [];
    }
    return filteredArray.sort((a, b) => a.getName().localeCompare(b.getName()));
  }

  async saveToJson(fileName) {
    try {
      let content = [];
      let current = this.head;
      while (current) {
        let student = {
          name: current.data.getName(),
          year: current.data.getYear(),
          email: current.data.getEmail(),
          specialization: current.data.getSpecialization(),
        };
        content.push(student);
        current = current.next;
      }
      let data = JSON.stringify(content);
      await fs.writeFile(fileName, data);
    } catch (error) {
      console.log(error);
    }
  }

  async loadFromJSON(fileName) {
    try {
      const data = await fs.readFile(fileName, {
        encoding: 'utf8',
      });
      this.clearStudents();
      let parsedData = JSON.parse(data);
      parsedData.forEach((element) => {
        const student = new Student(
          element.name,
          element.year,
          element.email,
          element.specialization
        );
        this.addStudent(student);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = { LinkedList };
