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
  // TODO: Modular rendering function to reduce lines of code.
  /* Takes in an array or single value representing info about a streamer.
   * Parse the information and construct the html with updated field values.
   * Utilziing JQuery, we can parse that information into the DOM and create a list.
   */
  function renderUser(target, data) {}

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
      success: function(status) {
        if (status.stream !== null) { // if online
          $('#status').html('<i class="fa fa-globe fa-2x" aria-hidden="true"></i>');
        } else { // if offline
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
        console.log("FCC", data);
        isFccOnline(data); // This is the callback
      }
    });
  };

  getNameAndLogo(); // starts here.
  getFccFollowers();

  function areUsersOnline(data) {
    const streamers = data.follows;
    let renderFollowers = [],
      logo, link, name, followers, views, isOnline;

    // Render corresponding data for each follower of fcc.
    streamers.forEach(function(streamer) {
      logo = streamer.channel.logo || 'https://www.appointbetterboards.co.nz/Custom/Appoint/img/avatar-large.png';
      link = streamer.channel.url;
      name = streamer.channel.display_name;
      followers = streamer.channel.followers;
      views = streamer.channel.views;
      console.log(streamer.channel);

      // bootstrap rows are being constructed.
      renderFollowers.push(
        '<div class="row center-block">' +
          '<div class="link-effect">' +
            '<div id="logo" class="col-xs-3 col-sm-2">' +
              '<a href="' + link + '" target="_blank">' +
                '<img src="' + logo + '">' +
              '</a>' +
            '</div>' +
          '</div>' +
        '<div id="title" class="col-xs-6 col-sm-8 center-block">' + name + '</div>' +
          '<div id="status" class="col-xs-3 col-sm-1">' +
            '<div id="' + name + '" ></div>' +
          '</div>' +
        '</div>' +
        '</div>'
      );
    });
    // then bootstrap rows are being rendered here.
    $('#fcc-followers-dropoff').html(renderFollowers.join(""));


    streamers.forEach(function(streamer, index) {
      let url = 'https://api.twitch.tv/kraken/streams/' + streamers[index].channel.name;
      $.ajax({
        type: 'GET',
        url: url,
        headers: { 'Client-ID': CLIENT_ID },
        success: function(data) {
          name = streamer.channel.display_name;
          if (data.stream === null) { // if offline
            $('#' + name).html('<i class="fa fa-bolt fa-3x" aria-hidden="true"></i>');
          } else { // if onfine
            $('#' + name).html('<i class="fa fa-globe fa-2x" aria-hidden="true"></i>');
          }
        }
      });
    })

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
        areUsersOnline(data); // <--- Here's the callback.
      }
    });
  }

});
