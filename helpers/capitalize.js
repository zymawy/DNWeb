/**
 * The function `capitalizeString` takes a string as input and returns the same string with the first letter capitalized.
 * @param string - The parameter "string" is a string value that represents the input string that needs to be capitalized.
 * @returns the input string with the first character capitalized.
 */
const capitalizeString = (string) => {

  return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * The `strLimit` function takes a string and limits its length to a specified number of characters, adding an optional
 * ending if the string is longer than the limit.
 * @param string - The `string` parameter is the input string that you want to limit the length of.
 * @param [limit=100] - The `limit` parameter specifies the maximum length of the string. If the length of the string
 * exceeds this limit, it will be truncated.
 * @param [end=...] - The `end` parameter is a string that will be appended to the end of the truncated string if it
 * exceeds the specified limit. By default, it is set to `'...'`.
 * @returns The function `strLimit` returns a modified version of the input string. If the input string is empty,
 * undefined, or null, an empty string is returned. If the length of the input string is greater than the specified limit,
 * the function returns a substring of the input string up to the limit, followed by the specified end string. Otherwise,
 * the function returns the input string as is.
 */
const strLimit = (string, limit = 100, end = '...') => {
    if ([undefined, null, ''].includes(string)) {
        return '';
    }
	return string.length > limit ? string.substring(0,limit) + end : string;
}

/**
 * The `isset` function checks if a variable is defined and not null.
 * @param variable - The "variable" parameter is the variable that you want to check if it is set or not.
 * @returns The function `isset` returns a boolean value indicating whether the given variable is defined and not null.
 */
const isset =  (variable) => {
        return typeof variable !== 'undefined' && variable !== null;
    }

/**
 * The above function is a JavaScript function that logs the content passed to it as a JSON string.
 * @param content - The `content` parameter is a rest parameter that allows you to pass in multiple arguments as an array.
 * In this case, it is used to log the content to the console after converting it to a JSON string using
 * `JSON.stringify()`.
 */
const dd = (...content) => {
    console.error( JSON.stringify(content) );
}

/**
 * The above function is a JavaScript function called "dump" that logs the content passed to it to the console.
 * @param content - The `content` parameter is a rest parameter, denoted by the `...` syntax. It allows you to pass any
 * number of arguments to the `dump` function, which will be collected into an array called `content`.
 */
const dump = (...content) => {
    console.log( content );
}

/**
 * The `slug` function takes a `title` as input and returns a lowercase version of the title with any non-alphanumeric
 * characters replaced with hyphens.
 * @param title - The `title` parameter is a string representing the title of a post or article.
 * @returns The function `slug` returns a slugified version of the `title` string.
 */
const slug = (title) => {
  return title?.toLowerCase()?.replace(/[^a-z0-9]+/g, '-');
}

module.exports = { capitalizeString, strLimit, isset, dd, dump, slug };