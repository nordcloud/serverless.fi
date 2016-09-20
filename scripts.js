function smoothScroll() {
  if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000);
      return false;
    }
  }
}

function setEventData(data) {
  var events = data.data;
  if (events.length != 0 && events[0]) {
    if (events[0].time) {
      var date = new Date(events[0].time);
      $('#date').text(date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear());
      $('#time').text(' at ' + date.getHours() + ':' + date.getMinutes());
    }
    if (events[0].name) {
      $('#event-title').text(events[0].name);
    }
    if (events[0].link) {
      $('#event-url').attr('href', events[0].link);
    }
    if (events[0].venue) {
      if (events[0].venue.name) {
        $('#location').text('Location: ' + events[0].venue.name);
      }
    }
    if (events[0].rsvp_limit && events[0].yes_rsvp_count) {
      $('#participants').text(events[0].yes_rsvp_count + '/' + events[0].rsvp_limit + ' participants');
    }
  } else {
    setNoUpcomingEvents();
  }
}

function setNoUpcomingEvents() {
  $('#next-event').html('<span >No upcoming events.</span>');
}

function showMore() {
  $('.presentation:nth-child(n+4)').show(); // heading + 2 presentations
  $('#presentation-toggle').text('View less').click(hide);
}

function hide() {
  $('#presentation-toggle').text('View all presentations').click(showMore);
  if (window.matchMedia('(min-width: 1630px)').matches) {
    $('.presentation:nth-child(n+5)').hide(); // heading + 2 presentations
  } else {
    $('.presentation:nth-child(n+4)').hide(); //heading + 3 presentations
  }
};


// SLACK INVITER:

var settings = {
  executeApiDomain: 'bd36x7kp31.execute-api.eu-west-1.amazonaws.com',
  submitButtonSelector: '#slack-invite-button',
  emailInputSelector: '#slack-invite-email',
  returnMessageContainerSelector: '#slack-invite-return-message'
};

function handleSuccess(message) {
  handle('success', message);
}

function handleError(message) {
  handle('error', message);
}

function handle(messageType, message) {
  var $returnMessageContainers = $(settings.returnMessageContainerSelector);
  if ($returnMessageContainers.length) {
    $returnMessageContainers.removeClass('success error');
    $returnMessageContainers.addClass(messageType);
    $returnMessageContainers.text(message);
  } else {
    alert(messageType + ': ' + message);
  }
}

$(function () {
  $('a[href*="#"]:not([href="#"])').click(smoothScroll);

  $.ajax({
    method: 'GET',
    url: 'https://api.meetup.com/Helsinki-serverless/events?&sign=true&photo-host=public',
    dataType: 'jsonp',
    headers: {'Access-Control-Allow-Origin': 'http://dev.serverless.fi'}
  })
    .done(function (data) {
      setEventData(data);
    })
    .fail(function () {
      setNoUpcomingEvents();
    });

  $('#presentation-toggle').click(showMore);

  if (window.matchMedia('(min-width: 1630px)').matches) {
    $('.presentation:nth-child(4)').show();
  }

  $(settings.submitButtonSelector).click(function () {
    var emailValue = $(settings.emailInputSelector).val()

    if (!emailValue) {
      return setTimeout(function () {
        handleError('Missing email');
      }, 10);
    }

    $.ajax({
      type: 'POST',
      url: 'https://' + settings.executeApiDomain + '/production/invite',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({email: emailValue}),
    })
      .done(function (data) {
        try {
          data = JSON.parse(data);
          if (data.ok) {
            handleSuccess('Great success');
          } else {
            handleError('Error while calling API: ' + data.error);
          }
        } catch (error) {
          handleError('Unknown when parsing API return: ' + error);
        }
      })
      .fail(function (xhr, status, error) {
        handleError('Unknown transport error: ' + status + ( error ? ' ' + error : '' ));
      });
  });
});
