# Retrovisor

Retrovisor is a simple script to add some features useful to retro-engineer any page with Javascript.

## Setup

Copy and paste [index.js](index.js) content in your console.

Your entrypoint is `Retrovisor` variable in the global scope.

## Api

### Retrovisor.findValueInWindow(value)

Search the value in the entire `window` object.

**Return value**: an array containing all paths with the value.

### Retrovisor.findRegexValueInWindow(regex)

Search a regex in the entire `window` object.  
Each variable is tested by checking the string value of the variable and using it with `regex.test(variable.toString())`.

**Return value**: an array containing all paths with the regex + the string value of the variable.

### Retrovisor.extractNonNativeVariablesFromWindow()

Search variables which has not been created by the browser and accessible from the `window` object.
This function needs a dump of a pure `window` variable to extract new values, because native variables didn't have anything to recognize them.

**Return value**: an object containing all new values.
It's a bit unstable, but it's enough for me currently.

### Setup of this function

To use this function, you need to open a new empty tab in your browser, import Retrovisor and call `Retrovisor.dumpCurrentWindowVariables()`.
Copy the return of this call and use it in your current tab (without the quotes around the result).
This will load a pure `window` dump and you're ready to use `Retrovisor.extractNonNativeVariablesFromWindow()`.

## Why this name

In French, we have the word [rétroviseur](https://fr.wikipedia.org/wiki/R%C3%A9troviseur) (rear-view mirror in English).  
So there's `retro` in the word (like retro-engineering), and `visor` exists in English.  
End. Pretty dumb, huh?  

## License

GPLv3
