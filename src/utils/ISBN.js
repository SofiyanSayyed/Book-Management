


const myISBN = () => {
    const prefix = "XYZ"; // Prefix for dummy ISBNs
  
    // Generate a random numeric suffix
    const suffixLength = 10;
    let suffix = "";
    for (let i = 0; i < suffixLength; i++) {
      const randomDigit = Math.floor(Math.random() * 10);
      suffix += randomDigit;
    }
  
    let number = prefix + suffix;
    return number.toString()
}

module.exports = {myISBN}