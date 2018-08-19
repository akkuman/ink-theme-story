//时间戳转时间
$('time').each(function() {
    var T = new Date(parseInt($(this).attr('datetime'))*1000);
    //timetextlist=[Sun, Mar, 01, 2015]
    var timetextlist = T.toDateString().split(' ');
    var timetext = timetextlist[1] + ' ' + timetextlist[2] + ', ' + timetextlist[3];
    $(this).html(timetext);
});

var searchTpl = '<li class="post-item grid-item"><a class="post-link" href="{{link}}">{{title}}<section class="post-content">{{preview}}</section></a></li>'

// pick from underscore
var debounce = function(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

var initSearch = function() {
  var searchDom = $('#menu-search')
  if (!searchDom.length) return
  var searchWorker = new Worker(root + '/bundle/js/searchWorker.js')
  var oriHtml = $('.post-list').html()
  var workerStarted = false
  var tpl = function(keywords, title, preview, link, cover) {
    for (var i = 0; i < keywords.length; i++) {
      var keyword = keywords[i]
      var wrap = '<span class="searched">' + keyword + '</span>'
      var reg = new RegExp(keyword, 'ig')
      title = title.replace(reg, wrap)
      preview = preview.replace(reg, wrap)
    }
    return searchTpl
    .replace('{{title}}', title)
    .replace('{{link}}', link + '?search=' + keywords)  // append keywords to url
    .replace('{{preview}}', preview)
  }
  searchWorker.onmessage = function(event) {
    var results = event.data.results
    var keywords = event.data.keywords
    if (results.length) {
      var retHtml = ''
      for (var i = 0; i < results.length; i++) {
        var item = results[i]
        var itemHtml = tpl(keywords, item.title, item.preview, item.link, item.cover)
        retHtml += itemHtml
      }
      $('.nav-page').hide()
      $('.post-list').html(retHtml)
    } else {
      var keyword = event.data.keyword
      if (keyword) {
        $('.nav-page').hide()
        $('.post-list').html('<div class="empty">未搜索到 "<span>' + keyword + '</span>"</div>')
      } else {
        $('.nav-page').show()
        $('.post-list').html(oriHtml)
      }
    }
  }
  searchDom.on('input', debounce(function() {
    var keyword = $(this).val().trim()
    if (keyword) {
      searchWorker.postMessage({
        search: 'search',
        keyword: keyword
      })
    } else {
      $('.nav-page').show()
      $('.post-list').html(oriHtml)
    }
  }, 500))
  searchDom.on('focus', function() {
    if (!workerStarted) {
      searchWorker.postMessage({
        action: 'start',
        root: root
      })
      workerStarted = true
    }
  })
};

$(function() {
  // append image description and zoom-vanilla.js action
  $('img').each(function() {
    $item = $(this)
    $item.attr('data-action', 'zoom')
    if ($item.attr('data-src')) {
      var imageAlt = $item.prop('alt')
      if ($.trim(imageAlt)) $item.after('<div class="image-alt">' + imageAlt + '</div>')
    }
  });
  // lazy load images
  if ($('img').unveil) {
    $('img').unveil(200, function() {
      $(this).load(function() {
        this.style.opacity = 1;
      });
    });
  }
  //init search
  initSearch()
})



/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(threshold, callback) {

    var $w = $(window),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src",
        images = this,
        loaded;

    this.one("unveil", function() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        this.setAttribute("src", source);
        if (typeof callback === "function") callback.call(this);
      }
    });

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $w.on("scroll.unveil resize.unveil lookup.unveil", unveil);

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);


