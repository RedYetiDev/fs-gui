const fs = require("fs")
const path = require("path")
const inquirer = require('inquirer');
const util = require('util');
const readdir = util.promisify(fs.readdir);
async function all(message) {
  var contents = await readdir(__dirname)
  console.log(contents)
  contents.push("..")
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'selection',
        message: message,
        choices: contents,
      },
      {
        type: 'list',
        name: 'confirm',
        message: "Would like to use this file/directory, enter this directory, or Go Back",
        choices: ["Use","Enter","Go Back"],
      },
    ])
    .then((answers) => {
      if (answers.confirm == "Use") {
        console.log("You selected " + answers.selection);
        return path.join(process.cwd(), answers.selection)
      } else if (answers.confirm == "Enter"){
        if (!fs.lstatSync(answers.selection).isDirectory()) {
          console.log("Error! You cant enter a file as a directory.")
          all(message, confirm)
        } else {
          process.chdir(answers.selection)
          all(message, confirm)
        }
      } else {
        all(message, confirm)
      }
    });
}
async function dir(message, confirm) {
  var contents = await readdir(process.cwd())
  console.log(contents)
  contents = contents.filter(item => fs.lstatSync(item).isDirectory())
  console.log(contents)
  contents.push("../")
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'selection',
        message: message,
        choices: contents,
      },
      {
        type: 'list',
        name: 'confirm',
        message: "Would like to use this directory, enter this directory, or Go Back",
        choices: ["Use","Enter","Go Back"],
      }
    ])
    .then((answers) => {
      if (answers.confirm == "Use") {
        console.log("You selected " + answers.selection);
        return path.join(process.cwd(), answers.selection)
      } else if (answers.confirm == "Enter") {
        process.chdir(answers.selection)
        console.log(answers.selection)
        console.log(process.cwd())
        dir(message, confirm)
      } else {
        console.log("Going Back")
        dir(message, confirm)
      }
    });
}
async function custom(message, ext) {
  var contents = await readdir(__dirname)
  contents = contents.filter(el => ext.includes(path.extname(el) || fs.lstatSync(el).isDirectory()))
  console.log(contents)
  contents.push("..")
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'selection',
        message: message,
        choices: contents,
      },
      {
        type: 'list',
        name: 'confirm',
        message: "Would like to use this file/directory, enter this directory, or Go Back",
        choices: ["Use","Enter","Go Back"],
      },
    ])
    .then((answers) => {
      if (answers.confirm == "Use") {
        console.log("You selected " + answers.selection);
        return path.join(process.cwd(), answers.selection)
      } else if (answers.confirm == "Enter"){
        if (!fs.lstatSync(answers.selection).isDirectory()) {
          console.log("Error! You cant enter a file as a directory.")
          custom(message, confirm)
        } else {
          process.chdir(answers.selection)
          custom(message, confirm)
        }
      } else {
        custom(message, confirm)
      }
    });
}
custom("Test",[".json"])
module.exports.dir = dir
module.exports.all = all
module.exports.custom = custom
