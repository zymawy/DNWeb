const capitalizeString = (string) => {

  return string.charAt(0).toUpperCase() + string.slice(1);
}



const strLimit = (string, limit = 100, end = '...') => {
    if ([undefined, null, ''].includes(string)) {
        return '';
    }
	return string.length > limit ? string.substring(0,limit) + end : string;
}

const isset =  (variable) => {
        return typeof variable !== 'undefined' && variable !== null;
    }

const dd = (...content) => {
    console.log( JSON.stringify(content) );
}

const dump = (...content) => {
    console.log( content );
}
const slug = (title) => {
  return title?.toLowerCase()?.replace(/[^a-z0-9]+/g, '-');
}
module.exports = { capitalizeString, strLimit, isset, dd, dump, slug };