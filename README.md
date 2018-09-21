A simple tool for assessing the scope of a solidity code audit. 

## Options:

`--summary (--dir)`

Aggregates data on all solidity files with in a directory, or in list 
of files provided.

* [x] Counting Lines of Solidity Code
* [x] How many solidity files? 
* [ ] How many final contracts?
* [ ] How many functions are there? 
* [ ] Which are public/external?
* [ ] Which are private/internal
* [ ] Which are state changing, or constant?

`--each`

Outputs a more detailed report with information about each function, 
in each file.

`--dash`

Provides a wizard for creating a dashboard, outlining the scope of the 
audit.

