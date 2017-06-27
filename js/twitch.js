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

    var logo, name, bio;
    // Get info about FCC.
    var url = "https://api.twitch.tv/kraken/users/freecodecamp";
    $.ajax({
        type: 'GET',
        url: url,
        headers: {
            'Client-ID': 'sh9x4gbft40ht9pg5mk0p6sfvn1h3a'
        },
        async: true,
        success: function(data) {
            console.log(data);
            name = data.name;
            bio = data.bio;
            logo = data.logo;
        }
    });

    // Get freeCodeCamp's followers
    $('#All').html("<p>Targeting all streamers</p>");
    var url = "https://api.twitch.tv/kraken/users/freecodecamp/follows/channels";
    $.ajax({
        type: 'GET',
        url: url,
        headers: {
            'Client-ID': 'sh9x4gbft40ht9pg5mk0p6sfvn1h3a'
        },
        async: true,
        success: function(data) {
            console.log(data);
            if (data.stream === null) {
                $('#All').html("FCC is offline!");
            } else {
                $('#All').html("FCC is online!");
            }
        }
    });

    // Get random people who are online.
    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/streams',
        headers: {
            'Client-ID': 'sh9x4gbft40ht9pg5mk0p6sfvn1h3a'
        },
        async: true,
        success: function(online) {
            console.log(online);
        }
    });

    // Get random people who are offline.


});
