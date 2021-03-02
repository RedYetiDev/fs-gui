# fs-gui

## Overview

Welcome to the `fs-gui`. This package allows you to add file selection menus to your programs. See below to example usage.

## How to use
1. First you have to install the [package](https://npmjs.com/package/fs-gui) using `npm i fs-gui` or fork the [repo](https://github.com/RedYetiDev/fs-gui)
2. You need to `require` it in your code.

```js
const Explorer = require("fs-gui")
```

3. Use the functions below, you can change `Explorer` for whatever you would like.

---

- #### `Explorer.dir(message)`

  The `dir` function creates a selection menu for selecting a directory.

  This function returns the path of the directory selected.

  The `message` parameter is the message to show the user, [e.g. `"Select a folder"`]

---

- #### `Explorer.all(message)`

  The `all` function creates a selection menu for selecting all files.

  This function returns the path to file/directory chosen.

  The `message` parameter is the message to show the user, [e.g. `"Select a file or folder"`]

---

- #### `Explorer.custom(message, ext)`

  The `custom` function creates a selection menu for selecting all files. This function returns the path to file/directory chosen

  The `message` parameter is the message to show the user, [e.g. `"Select a file or folder"`].

  The `ext` parameter is an array, containing the file extensions. [e.g. `[".txt",".pdf"]`]

## Examples
The examples below are assuming your code has the following line
```js
const Explorer = require("fs-gui")
```

- If you wanted the user to select a `pdf` file
```js
Explorer.custom("Select a PDF", [".pdf"])
```

- If you wanted the user to select a directory in the `node_modules` folder

```js
process.chdir("node_modules")
Explorer.dir("Select a directory")
```
