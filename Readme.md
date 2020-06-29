# threax-npm-tk
This project provides a build system for the front end for Threax Hypermedia Framework projects. It enables the use of artifacts.json files to describe what to publish for a project. It also supports the other commands the framework makes use of like tsimport or clean. It is written in typescript and compiles to javascript.

## Installing
Run `npm install -g threax-npm-tk` to install.
You probably also want typescript `npm install -g typescript`.

## Running
Run the program with `threax-npm-tk` here are the example tasks from a framework project:
```
"build": "threax-npm-tk build && dotnet bundle",
"clean": "threax-npm-tk clean",
"trash-modules": "threax-npm-tk clean -o node_modules",
"import-tsconfig": "threax-npm-tk tsconfig"
```

## Building
To build run tsc in the root directory. This will update all the javascript files.

To test the local results run `node .\run.js` to run the program.

## Artifacts.json
This file describes how to copy files in a project. A typical project comes with a file that looks like the following:
```
[
  {
    "typescript": {
      "compile": true
    }
  },
  {
    "pathBase": "Client",
    "outDir": ".",
    "copy": [
      "Client/Images/*"
    ]
  }
]
```
This tells the artifacts system to build the local typescript config and to copy any images from the Client/Images folder. This only describes the resources for the current project. For other modules each npm package will have an artifacts.json file that is scanned for during build. The combined output of all of these files will be written to the output directories. This makes it easy to pull in dependencies without needing to modify a ton of config files.