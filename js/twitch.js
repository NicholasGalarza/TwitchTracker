'use strict'
$(document).ready(function() {
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
    clickEvent.currentTarget.className += "active";
    document.getElementById(streamList).style.display = "block";
  }

  // Event listeners for button clicks.
  document.getElementById("fccButton").addEventListener("click", function() {
    getTwitchStreamers(event, 'fcc');
  });

  document.getElementById("popularButton").addEventListener("click", function() {
    getTwitchStreamers(event, 'popular');
  });
  document.getElementById("featuredButton").addEventListener("click", function() {
    getTwitchStreamers(event, 'featured');
  });
  // Open panel of default button automatically
  document.getElementById("fccButton").click();


  // TODO: If a user is online, display what they are streaming.
  // TODO: Edit html & css files so that rendered files are better layed out upon load.
  // TODO: Display data for FreeCodeCamp's followers.
  // TODO: Figure out how to gather a list of currently active users (preferably random).
  // TODO: Create a search bar in case a user wants to find a certain user and display if the account is closed.

  var CLIENT_ID = 'sh9x4gbft40ht9pg5mk0p6sfvn1h3a';
  var logo, name, status;
  // This is a callback function to determine if user is online after recieving
  // the streamer's logo and title.
  function isFccOnline(data) {
    name = data.name;
    logo = data.logo;
    $('#logo').html('<img src=\"' + data.logo + "\">");
    $('#title').html('<h3>' + data.name + "</h3>");

    var url = 'https://api.twitch.tv/kraken/streams/' + data.name;
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        'Client-ID': CLIENT_ID
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

  // This method is specifically for FreeCodeCamp.
  function getNameAndLogo() {
    var url = "https://api.twitch.tv/kraken/users/freecodecamp";
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        'Client-ID': CLIENT_ID
      },
      async: true,
      success: function(data) {
        isFccOnline(data); // This is the callback
      }
    });
  };

  getNameAndLogo(); // starts here.
  getFccFollowers();

  function areUsersOnline(streamer) {
    var url = 'https://api.twitch.tv/kraken/streams/' + streamer;
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        'Client-ID': CLIENT_ID
      },
      async: true,
      success: function(data) {
        console.log(streamer, data);
        var status = (data.stream === null) ? false : true;
        if (status) { // if online
          $('#status').html('<i class="fa fa-globe" aria-hidden="true"></i>');
        } else { // if offine
          $('#status').html('<i class="fa fa-bolt fa-3x" aria-hidden="true"></i>');
        }
      }
    });
  }
  // Get freeCodeCamp's followers
  function getFccFollowers() {
    var url = "https://api.twitch.tv/kraken/users/freecodecamp/follows/channels";
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        'Client-ID': CLIENT_ID
      },
      async: true,
      success: function(data) {
        var followers = data.follows;
        var renderFollowers = [];
        var logo, link, name, isOnline;
        logo = link = name = [];

        console.log(followers);
        for (var i = 0; i < followers.length; i++) {
          logo = followers[i].channel.logo || 'https://www.appointbetterboards.co.nz/Custom/Appoint/img/avatar-large.png';
          link = followers[i].channel.url;
          name = followers[i].channel.name;

          renderFollowers.push(
            '<div class="row center-block">' +
            '<div class="link-effect">' +
            '<div id="logo" class="col-xs-3 col-sm-2">' +
            '<a href="' + link + '" target="_blank">' +
            '<img src="' + logo + '">' +
            '</a>' +
            '</div>' +
            '</div>' +
            '<div id="title" class="col-xs-6 col-sm-8 center-block">' + name +
            '</div>' +
            '<div id="status" class="col-xs-3 col-sm-1">' +
            '<div id="status"></div>' +
            '</div>' +
            '</div>' +
            '</div>'
          );
          $('.fcc-followers-dropoff').html(renderFollowers.join(""));

        } // End of parsing data for list of follow

        // Update Status.
        for (var i = 0; i < followers.length; i++) {
          areUsersOnline(followers[i].channel.name);
        }
      }
    });
  }

});
