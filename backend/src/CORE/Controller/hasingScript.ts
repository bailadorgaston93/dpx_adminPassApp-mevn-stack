const JWT = require("jsonwebtoken");

// DECODIFICACIÓN BASE 64 (FUNCIONANDO)
/*
    La codificación Base64 funciona asignando datos binarios a 64 caracteres del conjunto de caracteres ASCII. 
    Los 64 caracteres utilizados en la codificación Base64 son: A-Z, a-z, 0-9, +y /.

    El proceso de codificación toma 3 bytes de datos binarios y los asigna a 4 caracteres del conjunto anterior, de modo que un solo 
    carácter representa cada 6 bits de datos binarios. El resultado es una cadena de caracteres ASCII que se puede transmitir o 
    almacenar como texto.

    La decodificación Base64 es el proceso inverso a la codificación. Toma una cadena codificada en Base64 y asigna cada carácter a 
    su representación binaria de 6 bits. Los datos binarios resultantes son una reconstrucción de los datos binarios originales 
    codificados en Base64.

    // https://www.freecodecamp.org/news/encode-decode-html-base64-using-javascript/
    // otro ejemplo de base 64: https://dev.to/catur/simple-encode-and-decode-with-javascript-od6
*/
const hashingScript_funcJS_base64 = (isEncrypt, str) => isEncrypt ? btoa(str) : atob(str);

console.log(hashingScript_funcJS_base64(true, "Gastón Eduardo Bailador")); // ENCRIPTAR
console.log(hashingScript_funcJS_base64(false, hashingScript_funcJS_base64(true, "Gastón Eduardo Bailador"))); // DESENCRIPTAR


//obj_fields=  btoa(JSON.stringify(src.inputs_data)); <-- como recibe una cadena, lo convertimos al objeto en una
// ahora lo parseamos y lo convertimos en objeto para acceder a su información




// -------------------------------------------------------------------------------------
// JWT: JSON WEB TOKEN

const encryptJWT = (isEncrypt, fieldToEncrypt) => isEncrypt ? JWT.sign(fieldToEncrypt, 'asdsadjashdjsahdoqjkwjdlwqjdlwdqwd', { expiresIn: "10 days" }) : JWT.verify(fieldToEncrypt, 'asdsadjashdjsahdoqjkwjdlwqjdlwdqwd');

console.log("ENCRIPTADO: ", encryptJWT(true, { nombre: "Gastón", apellido: "Bailador", nacionalidad: "Argentina" }));
console.log("DESENCRIPTADO: ", encryptJWT(false, encryptJWT(true, { nombre: "Gastón", apellido: "Bailador", nacionalidad: "Argentina" })));




