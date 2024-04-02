var API_URL = 'https://api.demoblaze.com';
var HLS_URL = '';
var token = '';
var usern = '';
var total = 0;

$(document).ready(function () {
  $.getJSON("config.json", function (data) {
    if (data.API_URL) API_URL = data.API_URL
    if (data.HLS_URL) HLS_URL = data.HLS_URL

    var token = getCookie("tokenp_");
    if (token.length > 0) {
      $.ajax({
        type: 'POST',
        url: API_URL + '/check',
        data: JSON.stringify({ "token": token }),
        contentType: "application/json",
        success: function (data) {
          if (data.errorMessage == "Token has expired") {
            alert("Your token has expired, please login again.");
          } else if (data.errorMessage == "Bad parameter, token malformed.") {
            alert("Bad parameter, token malformed.");
          } else if (data.errorMessage == "Bad parameter, flag is incorrect.") {
            alert("Bad parameter, flag is incorrect.");
          } else {
            usern = data.Item.username;
            document.getElementById("signin2").style.display = 'none';
            document.getElementById("login2").style.display = 'none';
            document.getElementById("nameofuser").text = "Welcome " + data.Item.username;
            document.getElementById('nameofuser').style.display = 'block';
            document.getElementById('logout2').style.display = 'block';
          }
        }
      });
    } else {
      document.getElementById("signin2").style.display = 'block';
      document.getElementById("login2").style.display = 'block';
    }
    var token = getCookie("tokenp_");
    if (token.length > 0) {
      $.ajax({
        type: 'POST',
        url: API_URL + '/viewcart',
        data: JSON.stringify({ "cookie": token, "flag": true }),
        contentType: "application/json",
        success: function (data) {
          if (data.errorMessage == "Token has expired") {
            alert("Your token has expired, please login again.");
          } else if (data.errorMessage == "Bad parameter, token malformed.") {
            alert("Bad parameter, token malformed.");
          } else if (data.errorMessage == "Bad parameter, flag is incorrect.") {
            alert("Bad parameter, flag is incorrect.");
          } else {
            data.Items.forEach(function (articleItem) {
              $.ajax({
                type: 'POST',
                url: API_URL + '/view',
                data: JSON.stringify({ "id": articleItem.prod_id }),
                contentType: "application/json",
                success: function (data) {
                  var valew2 = JSON.parse(JSON.stringify(data));
                  var itid = "'" + articleItem.id + "'";
                  $('#tbodyid').append('<tr class="success"><td><img width=100 height=100 src="' + valew2["img"] + '"></td><td>' + valew2["title"] + '</td><td>' + valew2["price"] + '</td><td><a href="#" onclick="deleteItem(' + itid + ')">Delete</a></td></tr>');
                  $('#totalp').empty();
                  $('#totalm').empty();
                  total = total + parseInt(valew2["price"]);
                  $('#totalp').append(total);
                  $('#totalm').append("Total: " + total);
                }
              });
            })
          }
        }
      });
    } else {
      $.ajax({
        type: 'POST',
        url: API_URL + '/viewcart',
        data: JSON.stringify({ "cookie": document.cookie, "flag": false }),
        contentType: "application/json",
        success: function (data) {
          // alert(JSON.stringify(data));
          // var valew = JSON.parse(JSON.stringify(data));
          data.Items.forEach(function (articleItem) {
            $.ajax({
              type: 'POST',
              url: API_URL + '/view',
              data: JSON.stringify({ "id": articleItem.prod_id }),
              contentType: "application/json",
              success: function (data) {
                var valew2 = JSON.parse(JSON.stringify(data));
                var itid = "'" + articleItem.id + "'";
                $('#tbodyid').append('<tr class="success"><td><img width=100 height=100 src="' + valew2["img"] + '"></td><td>' + valew2["title"] + '</td><td>' + valew2["price"] + '</td><td><a href="#" onclick="deleteItem(' + itid + ')">Delete</a></td></tr>');
                $('#totalp').empty();
                $('#totalm').empty();
                total = total + parseInt(valew2["price"]);
                $('#totalp').append(total);
                $('#totalm').append("Total: " + total);
              }
            });
          })
        }
      });
    }
    var player = window.player = videojs('example-video');
    var url = HLS_URL + "/index.m3u8";
    player.src({
      src: url,
      type: 'application/x-mpegURL'
    });
    $('#videoModal').on('hidden.bs.modal', function (e) {
      var player = window.player = videojs('example-video');
      player.pause();
    });
  })
});

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

function send() {
  document.getElementById("recipient-email").value = "";
  document.getElementById("recipient-name").value = "";
  document.getElementById("message-text").value = "";
  alert('Thanks for the message!!');
  $('#exampleModal').modal('hide');
  location.reload();
}

function logIn() {
  var pass = b64EncodeUnicode(document.getElementById("loginpassword").value);
  var username = document.getElementById("loginusername").value;
  if (pass == "" || username == "") {
    alert("Please fill out Username and Password.");
  } else {
    $.ajax({
      type: 'POST',
      url: API_URL + '/login',
      data: JSON.stringify({ "username": username, "password": pass }),
      contentType: "application/json",

      success: function (data) {
        if (data.errorMessage == "Wrong password.") {
          alert("Wrong password.");
        } else if (data.errorMessage == "User does not exist.") {
          alert("User does not exist.");
        } else {
          $('#logInModal').modal('hide');
          $('.modal-backdrop').hide();
          token = data.replace("Auth_token: ", "");
          document.cookie = "tokenp_=" + token;
          location.reload();
        }
      }
    });
  }
}

function logOut() {
  document.cookie = 'tokenp_' + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  location.href = 'index.html';
}

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

function register() {
  var pass = b64EncodeUnicode(document.getElementById("sign-password").value);
  var username = document.getElementById("sign-username").value;
  if (pass == "" || username == "") {
    alert("Please fill out Username and Password.");
  } else {
    $.ajax({
      type: 'POST',
      url: API_URL + '/signup',
      data: JSON.stringify({ "username": username, "password": pass }),
      contentType: "application/json",

      success: function (data) {
        if (data.errorMessage == "This user already exist.") {
          alert("This user already exist.");
        } else {
          $('#signInModal').modal('hide');
          $('.modal-backdrop').hide();
          alert("Sign up successful.");
        }
      }
    });
  }
}
function deleteItem(id) {
  $.ajax({
    type: 'POST',
    url: API_URL + '/deleteitem',
    data: JSON.stringify({ "id": id }),
    contentType: "application/json",
    success: function (data) {
      location.reload();
    }
  });
}

function deleteCart(idc) {
  $.ajax({
    type: 'POST',
    url: API_URL + '/deletecart',
    data: JSON.stringify({ "cookie": idc }),
    contentType: "application/json",
    success: function (data) {
    }
  });
}

function purchaseOrder() {
  var idr = Math.floor((Math.random() * 10000000) + 1);
  var name = document.getElementById("name").value;
  var creditcard = document.getElementById("card").value;
  var date = new Date();
  if (name == "" || creditcard == "") {
    alert("Please fill out Name and Creditcard.");
  } else {
    var token = getCookie("tokenp_");
    if (token.length > 0) {
      deleteCart(usern);
    } else {
      deleteCart(document.cookie);
    }
    swal({
      title: "Thank you for your purchase!",
      text: "Id: " + idr + "\n" + "Amount: " + total + " USD" + "\n" + "Card Number: " + creditcard + "\n" + "Name: " + name + "\n" + "Date: " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear(),
      type: "success",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "OK",
      closeOnConfirm: false
    }, function (isConfirm) {
        if (isConfirm) {
          location.href = 'index.html';
        }
      });
  }
}