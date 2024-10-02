export function mapResponseToDTO<U extends Record<string, any>>(
  responseDTO: U,
  propertyMappings: Record<string, string>,
) {
  function traverseAndUpdate(currentObj: any, _currentPath = '') {
      for (const key in currentObj) {
          if (currentObj.hasOwnProperty(key)) {
              const value = currentObj[key];
              const newPath = _currentPath ? `${_currentPath}.${key}` : key;
              if (propertyMappings[newPath]) {
                  const newKey = propertyMappings[newPath];
                  currentObj[newKey] = value; 
                  delete currentObj[key]; 
              }
              if (Array.isArray(value)) {
                  value.forEach((item) => {
                      if (typeof item === 'object' && item !== null) {
                          traverseAndUpdate(item, newPath);
                      }
                  });
              } else if (typeof value === 'object' && value !== null) {
                  traverseAndUpdate(value, newPath);
              }
          }
      }
  }

  traverseAndUpdate(responseDTO);
  return responseDTO;
}