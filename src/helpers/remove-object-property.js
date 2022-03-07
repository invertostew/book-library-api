function removeObjectProperty(property, object) {
  const { [property]: removed, ...objectWithoutRemovedProperty } = object;

  return objectWithoutRemovedProperty;
}

module.exports = removeObjectProperty;
