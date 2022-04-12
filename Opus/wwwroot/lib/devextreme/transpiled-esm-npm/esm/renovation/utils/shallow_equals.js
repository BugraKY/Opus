export var shallowEquals = (firstObject, secondObject) => {
  if (Object.keys(firstObject).length !== Object.keys(secondObject).length) {
    return false;
  }

  return Object.keys(firstObject).every(key => firstObject[key] === secondObject[key]);
};