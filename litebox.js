// litebox.js
// A light-weight, dependency-free light box Javascript library for YouTube videos.
// Author: Barrett Hafner
// License: MIT

;(function() {

  // not supported in all browsers
  document.addEventListener('DOMContentLoaded', function(){

    //  -------------------------------------------------------------------
    // Append css from litebox.css to head

    var liteboxCSS = document.createElement("link");
    liteboxCSS.href = "./litebox.css";
    liteboxCSS.type = "text/css";
    liteboxCSS.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(liteboxCSS);

    //  -------------------------------------------------------------------
    //    Append litebox html at the end of the body
    //
    //    <div id="litebox-overlay" style="display: none;">
    //      <div id="litebox-content">
    //      </div>
    //      <span id="litebox-close"></span>
    //    </div>

    var htmlTemplate = '<div id="litebox-overlay" style="display: none;"><div id="litebox-content"></div><span id="litebox-close"></span></div>';

    document.body.insertAdjacentHTML('beforeend', htmlTemplate);

    //  -------------------------------------------------------------------
    //  Get litebox html elements

    var liteboxOverlay = document.querySelector('#litebox-overlay');
    var liteboxContent = document.querySelector('#litebox-content');
    var liteboxCloseButton = document.querySelector('#litebox-close');

    //  -------------------------------------------------------------------
    // Document Event Listener
    //
    // adds an event listener to the entire body
    // onclick traverses the DOM to looking any element on the event with both an href and a data-litebox attribute
    // shows first one found in the lightbox
    document.addEventListener('click', function (event) {

      if (event.which === 1) { // left click
        var target = event.target;
        while (target) {
          if (target.hasAttribute('href') && target.hasAttribute('data-litebox')) {
            event.preventDefault();
            var youtubeId = getYoutubeIdFromUrl(target.getAttribute('href'));
            showYoutube(youtubeId);
            return;
          } else if (target.parentElement) {
            target = target.parentElement;

          // if no parent, at body, exit while loop
          } else {
            target = false;
          }
        }
      }
    });

    //  -------------------------------------------------------------------
    //  Other event listeners

    //  Hide litebox when liteboxContent is clicked
    //  liteboxContent fills the litebox
    //  doesn't trigger when the video is clicked since the event.target is the iframe
    liteboxContent.addEventListener('click', function(event) {
      if (event.target === liteboxContent) {
        hideLitebox();
      }
    });

    //  Hide litebox when "X" close div is clicked
    //  Should be changed to a button
    liteboxCloseButton.addEventListener('click', hideLitebox);

    //  Hide litebox when "esc" key is pressed
    document.addEventListener('keydown', function(event) {
      if (event.keyCode === 27) { // esc key
        hideLitebox();
      }
    });


    //  -------------------------------------------------------------------
    //  Functions

    // showVideo
    // requires a youtube ID

    function showYoutube(youtubeID) {

      // creat YouTube iframe template
      var iframe = '<iframe width="560" height="315" src="https://www.youtube.com/embed/{youtubeID}" frameborder="0" allowfullscreen></iframe>';

      // inject html and show litebox
      liteboxContent.innerHTML = iframe.replace('{youtubeID}', youtubeID);
      liteboxOverlay.style.display = 'block';
    }

    // hideLitebox
    // hide overlay and erase innerHTML of content
    function hideLitebox() {
      liteboxOverlay.style.display = 'none';
      liteboxContent.innerHTML = '';
    }

    function getYoutubeIdFromUrl(url) {

      // shamelessly stolen from lity.js
      // var rx = /(youtube(-nocookie)?\.com|youtu\.be)\/(watch\?v=|v\/|u\/|embed\/?)?([\w-]{11})(.*)?/i;

      var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
      return url.match(rx)[1];
      
      }


  }, false); // DOMContentLoaded event listener
}()); // end of IIFE
