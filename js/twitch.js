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

  // TODO: Protocol for making GET requests for every streamer:
    // 1.) Check if their accounts exists with 'https://api.twitch.tv/kraken/channels/{streamer-name}'
      // If user doesn't exist, just place center text saying: {user} DNE or closed their account.
      // If the account exists & is online, the endpoint will provide all needed information.
      // Otherwise, use this endpoint: 'https://api.twitch.tv/kraken/users/{streamer-name}' to gather alternate information for offline user.
    // 2.) All of this means that there will be three types of rendering methods based on if the user is online or not.
      // renderNonExistantStreamer()
      // renderOfflineStreamer()
      // renderOnlineStreamer()

  /* Have module accept name and generate corresponding render field through ajax requests. */
  const StreamerInformation = (function() {
    const CLIENT_ID = 'sh9x4gbft40ht9pg5mk0p6sfvn1h3a';
    // TODO: Each of these methods will take an object of a user's information & return
    // jquery string to be rendered in the DOM.
    function _renderNonExistantStreamer(streamer) {}
    function _renderOfflineStreamer(streamer) {
      let streamerHTML =
      '<div class="row center-block">' +
        '<div class="link-effect">' +
          '<div id="logo" class="col-xs-3 col-sm-2">' +
            '<a href="' + streamer.url + '" target="_blank">' +
              '<img src="' + streamer.logo + '">' +
            '</a>' +
          '</div>' +
        '</div>' +
      '<div id="stream-body" class="col-xs-6 col-sm-8 center-block">' +
         '<h3>' + streamer.display_name + '</h3>' +
         '<h3>' + "Followers: " + streamer.followers + '</h3>' +
         '<h3>' + "Views: " + streamer.views + '</h3>' +
      '</div>' +
        '<div id="status" class="col-xs-3 col-sm-1">' +
          '<div id="' + streamer.name + '"><i class="fa fa-exclamation fa-3x" aria-hidden="true"></i></div>' +
        '</div>' +
      '</div>' +
      '</div>';
      return $(streamer.div).append(streamerHTML); // append() is fucking amazing!!!
    }
    function _renderOnlineStreamer(streamer) {
      let streamerHTML =
      '<div class="row center-block">' +
        '<div class="link-effect">' +
          '<div id="logo" class="col-xs-3 col-sm-2">' +
            '<a href="' + streamer.url + '" target="_blank">' +
              '<img src="' + streamer.logo + '">' +
            '</a>' +
          '</div>' +
        '</div>' +
      '<div id="stream-body" class="col-xs-6 col-sm-8 center-block">' +
         '<h3>' + streamer.display_name + '</h3>' +
         '<h3>' + streamer.game + '</h3>' +
         '<h3 class="online-status">' + '"' + streamer.status + '"' + '</h3>' +
      '</div>' +
        '<div id="status" class="col-xs-3 col-sm-1">' +
          '<div id="' + streamer.name + '"><i class="fa fa-check fa-2x" aria-hidden="true"></i></div>' +
        '</div>' +
      '</div>' +
      '</div>';
      return $(streamer.div).append(streamerHTML); // append() is fucking amazing!!!
    }

    /* STEP THREE: Since user is offline, we gather information to populate row */
    function getOfflineStreamerInformation(callbackData) {
      let url = "https://api.twitch.tv/kraken/users/" + callbackData.name;

      $.ajax({
        type: "GET",
        url: url,
        headers: {
          'Client-ID': CLIENT_ID
        },
        success: function(data) {
          data.logo = callbackData.logo || 'https://www.appointbetterboards.co.nz/Custom/Appoint/img/avatar-large.png';
          data.views = callbackData.views;
          data.followers = callbackData.followers;
          data.url = callbackData.url;
          data.div = callbackData.div;
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
          if (data.stream === null) {
            getOfflineStreamerInformation(callback);
          } else {
            _renderOnlineStreamer(callback);
          }
        },
        error: function (failure) {
          console.log("STREAM STATUS FAILURE", failure);
        }
      });
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
          data.div = targetDiv;
          isStreamerOnline(data);
        },
        error: function (failure) {
          let error = JSON.parse(failure.responseText);
          error.div = targetDiv;
          error.name = streamerName;
        }
      });
    }

    function getStreamersList(streamerName, targetDiv, options) {
      let url = "";
      if (options === "FOLLOWERS") {
        url = 'https://api.twitch.tv/kraken/users/' + streamerName + '/follows/channels';
      } else if (options === 'FEATURED') {
        url = 'https://api.twitch.tv/kraken/streams/featured';
      } else if (options === 'POPULAR') {
        streamerName.forEach(function(streamer) {
          validateStreamer(streamer, targetDiv);
        });
      }
      $.ajax({
        type: 'GET',
        url: url,
        headers: {
          'Client-ID': CLIENT_ID
        },
        success: function(data) {
          if (options === "FOLLOWERS") {
            // Followers of specific stream.
            data.follows.forEach(function(streamer) {
              validateStreamer(streamer.channel.name, targetDiv);
            });
          } else if (options === "FEATURED") {
            // Featured Streams.
            data.featured.forEach(function(streamer) {
              streamer.stream.channel.div = targetDiv;
              _renderOnlineStreamer(streamer.stream.channel)
            });
          }
        }
      });
    }

    return {
      validateStreamer: validateStreamer,
      getStreamersList: getStreamersList
    };
  })();

  StreamerInformation.validateStreamer("freecodecamp", "#freeCodeCamp")
  StreamerInformation.getStreamersList("freecodecamp", "#freeCodeCamp", "FOLLOWERS");
  let popularStreamers = ['ygtskedog', 'stpeach', 'dyrus', 'loltyler1', 'imaqtpie', 'kaypealol', 'greekgodx', 'ice_posiedon', 'andymilonakis', 'itshafu'];
  StreamerInformation.getStreamersList(popularStreamers, '#popularStreamerList', "POPULAR");
  StreamerInformation.getStreamersList("", '#featuredStreamerList', "FEATURED");
});
