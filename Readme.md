# threax-npm-tk
This project provides a build system for the front end for Threax Hypermedia Framework projects. It enables the use of artifacts.json files to describe what to publish for a project. It also supports the other commands the framework makes use of like tsimport or clean.

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