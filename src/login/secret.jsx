const CryptoJS = require('crypto-js');
export const changeString = (inputText) => {
  /*inputText = inputText.toString().toLowerCase();
  const howMany = (inputText.charCodeAt(0) % 12) + 7;
  const mac = CryptoJS.HmacSHA256(inputText.repeat(howMany), 'požehnávam tento projekt');
  const macSum = mac.toString();
  let data64 = mac.toString(CryptoJS.enc.Base64);
  console.log('mac: ' + macSum + ' | b64: ' + data64);
  return data64;*/
  return inputText	// TODO client side hash
};
