var API_URL = 'https://api.demoblaze.com';
var HLS_URL = '';
var token = '';
$(document).ready(function () {
  $.getJSON("config.json", function (data) {
    if (data.API_URL) API_URL = data.API_URL
    if (data.HLS_URL) HLS_URL = data.HLS_URL

    bindEvents();
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
    var userc = getCookie("user");
    if (userc.length <= 0) {
      document.cookie = "user=" + guid();
    }
    $.ajax({
      type: 'GET',
      url: API_URL + '/entries',
      success: function (data) {
        // alert(JSON.stringify(data));
        // location.href= 'prod.html?idp_=' + eid + '&tokenp_=' + token;
        var valew = JSON.parse(JSON.stringify(data));
        document.frm.next2.value = valew.LastEvaluatedKey["id"];
        document.frm.prev2.value = valew.Items[0]["id"];
        data.Items.forEach(function (articleItem) {
          $('#tbodyid').append('<div class="col-lg-4 col-md-6 mb-4">' + '<div class="card h-100">' + '<a href="prod.html?idp_=' + articleItem.id + '">' + '<img class="card-img-top img-fluid" src="' + articleItem.img + '" alt="">' + '</a>' + '<div class="card-block">' + '<h4 class="card-title">' + '<a href="prod.html?idp_=' + articleItem.id + '" class="hrefch">' + articleItem.title + '</a>' + '</h4>' + '<h5>$' + articleItem.price + '</h5>' + '<p id="article" class="card-text">' + articleItem.desc + ' </p>' + ' </div>' + '</div>' + '</div>');
        })
      }
    });
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

function bindEvents() {
  $('#agregar').on('click', function () {
    $.ajax({
      type: 'POST',
      url: API_URL + '/entries',
      data: JSON.stringify({ "id": $('#id').val(), "title": $('#title').val(), "price": $('#price').val() }),
      contentType: "application/json",

      success: function (data) {
        location.reload();
      }
    });
    return false;
  });

  $('#next2').on('click', function () {
    $.ajax({
      type: 'POST',
      url: API_URL + '/pagination',
      data: JSON.stringify({ "id": $('#next2').val() }),
      contentType: "application/json",

      success: function (data) {
        var valew = JSON.parse(JSON.stringify(data));
        if (valew.ScannedCount == 9) {
          document.frm.next2.value = valew.LastEvaluatedKey["id"];
        } else {
          div = document.getElementById('next2');
          div.style.display = 'none';
        }
        $('#tbodyid').empty();
        data.Items.forEach(function (articleItem) {
          $('#tbodyid').append('<div class="col-lg-4 col-md-6 mb-4">' + '<div class="card h-100">' + '<a href="#">' + '<img class="card-img-top img-fluid" src="' + articleItem.img + '" alt="">' + '</a>' + '<div class="card-block">' + '<h4 class="card-title">' + '<a href="prod.html?idp_=' + articleItem.id + '" class="hrefch">' + articleItem.title + '</a>' + '</h4>' + '<h5>$' + articleItem.price + '</h5>' + '<p id="article" class="card-text">' + articleItem.desc + ' </p>' + ' </div>' + '</div>' + '</div>');
        })
      }
    });
    return false;
  });

  $('#prev2').on('click', function () {
    $.ajax({
      type: 'POST',
      url: API_URL + '/pagination',
      data: JSON.stringify({ "id": $('#prev2').val() }),
      contentType: "application/json",

      success: function (data) {
        var valew = JSON.parse(JSON.stringify(data));
        if (valew.ScannedCount == 9) {
          document.frm.next2.value = valew.LastEvaluatedKey["id"];
          document.getElementById('next2').style.display = 'block';
        } else {
          div = document.getElementById('next2');
          div.style.display = 'none';
        }
        $('#tbodyid').empty();
        data.Items.forEach(function (articleItem) {
          $('#tbodyid').append('<div class="col-lg-4 col-md-6 mb-4">' + '<div class="card h-100">' + '<a href="#">' + '<img class="card-img-top img-fluid" src="' + articleItem.img + '" alt="">' + '</a>' + '<div class="card-block">' + '<h4 class="card-title">' + '<a href="prod.html?idp_=' + articleItem.id + '" class="hrefch">' + articleItem.title + '</a>' + '</h4>' + '<h5>$' + articleItem.price + '</h5>' + '<p id="article" class="card-text">' + articleItem.desc + ' </p>' + ' </div>' + '</div>' + '</div>');
        })
      }
    });
    return false;
  });
  $('#videoModal').on('hidden.bs.modal', function () {
    var player = window.player = videojs('example-video');
    player.pause();
  });
}
function showIt(eid) {
  // location.href= 'prod.html?idp_=' + eid + '&tokenp_=' + token;
  // window.open('prod.html?idp_=' + eid +'&tokenp_='+token);
}
function showcart() {
  // location.href= 'cart.html?tokenp_=' + token;
  // window.open('cart.html?tokenp_=' + token);
  // window.open('cart.html?tokenp_=' + token,'_blank');
}

function send() {
  document.getElementById("recipient-email").value = "";
  document.getElementById("recipient-name").value = "";
  document.getElementById("message-text").value = "";
  alert('Thanks for the message!!');
  $('#exampleModal').modal('hide');
  location.reload();
}

function byCat(cat) {
  $.ajax({
    type: 'POST',
    url: API_URL + '/bycat',
    data: JSON.stringify({ "cat": cat }),
    contentType: "application/json",
    success: function (data) {
      $('#tbodyid').empty();
      // var valew = JSON.parse(JSON.stringify(data));
      // document.frm.next2.value = valew.LastEvaluatedKey["id"];
      data.Items.forEach(function (articleItem) {
        $('#tbodyid').append('<div class="col-lg-4 col-md-6 mb-4">' + '<div class="card h-100">' + '<a href="prod.html?idp_=' + articleItem.id + '">' + '<img class="card-img-top img-fluid" src="' + articleItem.img + '" alt="">' + '</a>' + '<div class="card-block">' + '<h4 class="card-title">' + '<a href="prod.html?idp_=' + articleItem.id + '" class="hrefch">' + articleItem.title + '</a>' + '</h4>' + '<h5>$' + articleItem.price + '</h5>' + '<p id="article" class="card-text">' + articleItem.desc + ' </p>' + ' </div>' + '</div>' + '</div>');
      })
    }
  });
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
