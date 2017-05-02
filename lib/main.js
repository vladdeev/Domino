window.$l = arg => {
  switch (typeof(arg)) {
    case "string":
      return Array.from(document.querySelectorAll(arg));  
  }
};
