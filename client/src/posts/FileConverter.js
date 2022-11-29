function convertToBase64(file, onLoad) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        onLoad(reader.result);
    };
    reader.onerror = function (error) {
        throw error;
    };
}

export default convertToBase64;