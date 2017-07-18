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

/* ========================================= */

  // TODO: Make get requst to FreeCodeCamp to gather their followers.
  // TODO: Protocol for making GET requests for every streamer:
    // 1.) Check if their accounts exists with 'https://api.twitch.tv/kraken/channels/{streamer-name}'
      // If user doesn't exist, just place center text saying: {user} DNE or closed their account.
      // If the account exists & is online, the endpoint will provide all needed information.
      // Otherwise, use this endpoint: 'https://api.twitch.tv/kraken/users/{streamer-name}' to gather alternate information for offline user.
    // 2.) All of this means that there will be three types of rendering methods based on if the user is online or not.
      // renderNonExistantStreamer()
      // renderOfflineStreamer()
      // renderOnlineStreamer()

  /* Have module accept name and generate corresponding render field through ajax requests.
   */
  const StreamerInformation = (function() {
    const CLIENT_ID = 'sh9x4gbft40ht9pg5mk0p6sfvn1h3a';
    // TODO: Each of these methods will take an object of a user's information & return
    // jquery string to be rendered in the DOM.
    function _renderNonExistantStreamer(streamer) {}
    function _renderOfflineStreamer(streamer) {
      console.log("offline renderer is firing off")
      let streamerHTML =
      '<div class="row center-block">' +
        '<div class="link-effect">' +
          '<div id="logo" class="col-xs-3 col-sm-2">' +
            '<a href="' + streamer.link + '" target="_blank">' +
              '<img src="' + streamer.logo + '">' +
            '</a>' +
          '</div>' +
        '</div>' +
      '<div id="stream-body" class="col-xs-6 col-sm-8 center-block">' +
         '<h3>' + streamer.display_name + '</h3>' +
      '</div>' +
        '<div id="status" class="col-xs-3 col-sm-1">' +
          '<div id="' + streamer.name + '"><i class="fa fa-bolt fa-3x" aria-hidden="true"></i></div>' +
        '</div>' +
      '</div>' +
      '</div>';
      return $(streamer.div).html(streamerHTML);
    }
    function _renderOnlineStreamer(streamer) {}

    /* STEP THREE: Since user is offline, we gather information to populate row */
    function getOfflineStreamerInformation(callbackData) {
      let url = "https://api.twitch.tv/kraken/users/" + callbackData.name;
      let streamerObj = {};

      $.ajax({
        type: "GET",
        url: url,
        headers: {
          'Client-ID': CLIENT_ID
        },
        success: function(data) {
          data.link = callbackData.url;
          data.div = callbackData.div;
          console.log("offline", data);
          return _renderOfflineStreamer(data);
        }

      });
    }
    // STEP TWO: Check if streamer is currently online.
    function isStreamerOnline(callback) {
      let url = 'https://api.twitch.tv/kraken/streams/' + callback.name;
      $.ajax({
        type: 'GET',
        url: url,
        headers: {
          'Client-ID': CLIENT_ID
        },
        success: function(data) {
          console.log("STREAMER STATUS", data);
          if (data.status == null) {
            getOfflineStreamerInformation(callback);
          } else {
            console.log("YOU NEED TO DO SOMETHING FOR ONLINE USER HERE!");
          }
        },
        error: function (failure) {
          console.log("STREAM STATUS FAILURE", failure);
        }
      });
    }

    function retrieveStreamerFollowers() {
      
    }
    // STEP ONE: Check if the specified streamer exists.
    function validateStreamer(streamerName, targetDiv) {
      let url = 'https://api.twitch.tv/kraken/channels/' + streamerName;
      $.ajax({
        type: 'GET',
        url: url,
        headers: {
          'Client-ID': CLIENT_ID
        },
        success: function(data) {
          console.log("IT WORKED", data);
          data.div = targetDiv;
          isStreamerOnline(data);
        },
        error: function (failure) {
          let error = JSON.parse(failure.responseText);
          error.div = targetDiv;
          error.name = streamerName;
          console.log("ERROR", error);
        }
      });
    }

    return {
      validateStreamer: validateStreamer
    };
  })();

  StreamerInformation.validateStreamer(["freecodecamp"], "#freeCodeCamp");


});
