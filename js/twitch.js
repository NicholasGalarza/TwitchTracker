'use strict'

function getTwitchStreamers(clickEvent, streamList) {
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(streamList).style.display = "block";
  clickEvent.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();

$(document).ready(function() {
  var logo, name, status;
  // Determine if specified user is online.
  function isUserOnline(data) {
    name = data.name;
    logo = data.logo;
    $('#logo').html('<img src=\"' + data.logo + "\" height=\"100px\" width=\"100px\">");
    $('#title').html('<h3>' + data.name + "</h3>");

    var url = 'https://api.twitch.tv/kraken/streams/' + data.name;
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        'Client-ID': 'sh9x4gbft40ht9pg5mk0p6sfvn1h3a'
      },
      async: true,
      success: function(data) {
        var status = (data.stream === null) ? false : true;
        if (status) { // if online
          $('#status').html('<i class="fa fa-globe" aria-hidden="true"></i>');
        } else {
          $('#status').html('<i class="fa fa-bolt fa-3x" aria-hidden="true"></i>');
        }
      }
    });
  };

  function getNameAndLogo() {
    var url = "https://api.twitch.tv/kraken/users/freecodecamp";
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        'Client-ID': 'sh9x4gbft40ht9pg5mk0p6sfvn1h3a'
      },
      async: true,
      success: function(data) {
        isUserOnline(data); // This is the callback
      }
    });
  };

  getNameAndLogo(); // starts here.


  // Get freeCodeCamp's followers
  var url = "https://api.twitch.tv/kraken/users/freecodecamp/follows/channels";
  $.ajax({
    type: 'GET',
    url: url,
    headers: {
      'Client-ID': 'sh9x4gbft40ht9pg5mk0p6sfvn1h3a'
    },
    async: true,
    success: function(data) {
      var followers = data.follows;

      console.log(followers);
    }
  });

  // Get random people who are online.
  // $.ajax({
  //     type: 'GET',
  //     url: 'https://api.twitch.tv/kraken/streams',
  //     headers: {
  //         'Client-ID': 'sh9x4gbft40ht9pg5mk0p6sfvn1h3a'
  //     },
  //     async: true,
  //     success: function(online) {
  //         console.log(online);
  //     }
  // });

  // Get random people who are offline.


});
