"use strict";
var CryptoJS = require("crypto-js");
module.exports = {
  getPage,
  validar
};

function getPage(array, page, perPage) {
  var obj = {};
  var start = (page - 1) * perPage;
  var end = page * perPage;

  obj.items = array.slice(start, end);
  if (obj.items.length === 0) {
    return obj;
  }

  if (page > 1) {
    obj.prev = page - 1;
  }

  if (end < array.length) {
    obj.next = page + 1;
  }

  if (obj.items.length !== array.length) {
    obj.current = page;
    obj.first = 1;
    obj.last = Math.ceil(array.length / perPage);
  }

  return obj;
}

function validar(){
  var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
  console.log("------------------funcion validar -------------------");
  console.log(CryptoJS.AES.encrypt("Message", "Secret Passphrase").toString(CryptoJS.enc.Utf8));
  console.log("------------------funcion validar -------------------");
  console.log(CryptoJS.AES.decrypt(encrypted, "Secret Passphrase"));
  console.log("------------------funcion validar -------------------");
  console.log(CryptoJS.AES.decrypt(encrypted, "Secret Passphrase").toString(CryptoJS.enc.Utf8));
  console.log("------------------funcion validar -------------------");
  return encrypted;
  // return "------------------funcion validar -------------------";
}