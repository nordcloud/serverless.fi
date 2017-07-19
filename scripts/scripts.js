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
  var events = data.data || [];
  var eventTemplate = '<div class="single-event"><span class="date"></span><span class="time"></span> <br/><a class="event-url" href="" ><span class="event-title"></span></a> <br/> <span class="location"></span> <br/><span class="participants"></span></div>';
  events.forEach(function(event) {
    var $template = $(eventTemplate);
    if (event.time) {
      $template.find('.date').text(moment(event.time).format('DD.MM.YYYY'));
      $template.find('.time').text(' at ' + moment(event.time).format('HH:mm'));
    }
    if (event.name) {
      $template.find('.event-title').text(event.name);
    }
    if (event.link) {
      $template.find('.event-url').attr('href', event.link);
    }
    if (event.venue) {
      if (event.venue.name) {
        $template.find('.location').text('Location: ' + event.venue.name);
      }
    }
    if (event.rsvp_limit && event.yes_rsvp_count) {
      $template.find('.participants').text(event.yes_rsvp_count + '/' + event.rsvp_limit + ' participants');
    }
    $('.event').append($template);
  });

  if (!events || events.length === 0) {
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
  executeApiDomain: '4hcl6jbod2.execute-api.eu-west-1.amazonaws.com',
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
      url: 'https://' + settings.executeApiDomain + '/dev/invite',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({email: emailValue}),
    })
      .done(function (data) {
        try {
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
