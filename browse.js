const fs = require("fs")
const path = require("path")
const inquirer = require('inquirer');
const util = require('util');
const readdir = util.promisify(fs.readdir);
function searchAll(message) {
  return new Promise(async(resolve, reject) => {
    var contents = await readdir(process.cwd())
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
          return resolve(path.join(process.cwd(), answers.selection))
        } else if (answers.confirm == "Enter"){
          if (!fs.lstatSync(answers.selection).isDirectory()) {
            searchAll(message, confirm)
          } else {
            process.chdir(answers.selection)
            searchAll(message, confirm)
          }
        } else {
          searchAll(message, confirm)
        }
      });
  });
}
function searchDir(message, confirm) {
  return new Promise(async(resolve, reject) => {
    var contents = await readdir(process.cwd())
    contents = contents.filter(item => fs.lstatSync(item).isDirectory())
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
          return resolve(path.join(process.cwd(), answers.selection))
        } else if (answers.confirm == "Enter") {
          process.chdir(answers.selection)
          searchDir(message, confirm)
        } else {
          searchDir(message, confirm)
        }
      });
  });
}
function searchCustom(message, ext) {
  return new Promise(async(resolve, reject) => {
    var contents = await readdir(process.cwd())
    contents = contents.filter(el => ext.includes(path.extname(el) || fs.lstatSync(el).isDirectory()))
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
          return resolve(path.join(process.cwd(), answers.selection))
        } else if (answers.confirm == "Enter"){
          if (!fs.lstatSync(answers.selection).isDirectory()) {
            console.log("Error! You cant enter a file as a directory.")
            searchCustom(message, confirm)
          } else {
            process.chdir(answers.selection)
            searchCustom(message, confirm)
          }
        } else {
          searchCustom(message, confirm)
        }
      });
  });
}
function createFile(data) {
  return new Promise(async(resolve, reject) => {
    var contents = await readdir(process.cwd())
    contents = contents.filter(item => fs.lstatSync(item).isDirectory())
    contents.push("../")
    contents.push("Create Here")
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'selection',
          message: "Choose a directory for file creation",
          choices: contents,
        }
      ])
      .then((answers) => {
        if (answers.selection != "Create Here") {
          process.chdir(answers.selection)
          createFile(data)
        } else {
          inquirer.prompt([
            {
              type: 'input',
              name: 'filename',
              message: 'File name and extension:'
            }
          ]).then((files) => {
            var file = files.filename
            fs.writeFile(file, data, (err) => {
              return resolve(true)
            })
          })
        }
      });
    })
}
function createFolder() {
  return new Promise(async(resolve, reject) => {
    var contents = await readdir(process.cwd())
    contents = contents.filter(item => fs.lstatSync(item).isDirectory())
    contents.push("../")
    contents.push("Create Here")
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'selection',
          message: "Choose a directory for folder creation",
          choices: contents,
        }
      ])
      .then((answers) => {
        if (answers.selection != "Create Here") {
          process.chdir(answers.selection)
          createFile(data)
        } else {
          inquirer.prompt([
            {
              type: 'input',
              name: 'name',
              message: 'folder name'
            }
          ]).then((folder) => {
            var folder = folder.name
            fs.mkdir(folder, (err) => {
              return resolve(true)
            })
          })
        }
      });
    })
}
function deleteFile() {
  return new Promise(async(resolve, reject) => {
    var contents = await readdir(process.cwd())
    contents.push("..")
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'selection',
          message: message,
          choices: contents,
        },
      ])
      .then((answers) => {
        if (fs.lstatSync(answers.selection).isDirectory()) {
          process.chdir(answers.selection)
          deleteFile()
        } else {
          inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirm',
              message: "Are You sure you want to delete this file?"
            }
          ]).then((c) => {
            if (c.confirm == true) {
              fs.unlink(answers.selection, (err) => {
                console.log('File deleted');
              });
            }
          })
        }
      });
  });
}
function deleteFolder() {
  return new Promise(async(resolve, reject) => {
    var contents = await readdir(process.cwd())
    contents = contents.filter(item => fs.lstatSync(item).isDirectory())
    contents.push("..")
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'selection',
          message: "Choose a folder to delete or enter",
          choices: contents,
        },
        {
          type: 'list',
          name: 'confirm',
          message: "Delete or Enter this folder?",
          choices: ["Delete", "Enter"]
        },
      ])
      .then((answers) => {
        if (answers.confirm == "Enter" || answers.selection == "..") {
          process.chdir(answers.selection)
          deleteFolder()
        }
        else {
          if (!fs.lstatSync(answers.selection).isDirectory()) {
            console.log("Uh Oh! This function is for deleting files, not directories.")
            deleteFile()
          } else {
            fs.rmdir(answers.selection, (err) => {
              console.log('Folder deleted');
            });
          }
        }
      });
  });
}
module.exports.searchDir = searchDir
module.exports.searchAll = searchAll
module.exports.searchCustom = searchCustom
module.exports.createFile = createFile
module.exports.createFolder = createFolder
module.exports.deleteFile = deleteFile
module.exports.deleteFolder = deleteFolder
module.exports.fs = fs
