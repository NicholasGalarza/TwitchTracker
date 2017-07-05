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
    tablinks[i].className = tablinks[i].className.replace("active", "");
  }
  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(streamList).style.display = "block";
  clickEvent.currentTarget.className += "active";
}

// Event listener for button clicks.
document.getElementById("defaultOpen").addEventListener("click", function() {
  getTwitchStreamers(event, 'fcc');
})
// click automatically upon page load.
document.getElementById("defaultOpen").click();


// TODO: If a user is online, display what they are streaming.
// TODO: Edit html & css files so that rendered files are better layed out upon load.
// TODO: Display data for FreeCodeCamp's followers.
// TODO: Figure out how to gather a list of currently active users (preferably random).
// TODO: Figure out how to gather a list of offline users.
// TODO: Create a search bar in case a user wants to find a certain user and display if the account is closed.
$(document).ready(function() {
  var logo, name, status;
  // This is a callback function to determine if user is online after recieving
  // the streamer's logo and title.
  function isUserOnline(data) {
    name = data.name;
    logo = data.logo;
    $('#logo').html('<img src=\"' + data.logo + "\">");
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
