var $ = jQuery.noConflict();
GVS = function () {
  this.initialized = false;
  this.start = {};
  this.state = {};
  this.debug = false;
  var self = this;
  this.init = function (type, id) {
    self.start.type = type;
    self.start.id = id;
    self.state = self.start;
    if (self.isTouchDevice()) {
      $("body").addClass("touchDevice");
    }
    $(document).ready(function () {
      self.initEvents();
      setTimeout(function () {
        self.removePagetransition();
      }, 20);
      self.initialized = true;
    });
    window.onpageshow = function (event) {
      if (!self.initialized) {
        self.init();
      }
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.onbeforeunload = function (event) {
      self.initialized = false;
    };
    self.credits();
  };
  this.initEvents = function () {
    let links = document.querySelectorAll("a");
    links.forEach((element) => {
      element.addEventListener("click", function (e) {
        const href = element.getAttribute("href");
        const target = element.getAttribute("target");
        const download = element.getAttribute("download");
        const re =
          /^(?!(?:javascript|data|chrome|mailto|tel|sms|callto|mms|skype|ftp):).+$/;
        if (re.test(href) && target !== "_blank" && !download) {
          e.stopPropagation();
          e.preventDefault();
          let pageTransitionElement = document.getElementById("pageTransition");
          pageTransitionElement.classList.remove("opened");
          pageTransitionElement.classList.remove("closed");
          setTimeout(function () {
            pageTransitionElement.classList.add("show");
          }, 20);
          setTimeout(() => {
            window.location = href;
          }, 600);
        }
      });
    });
  };
  this.lazyLoad = function () {
    $("video source").each(function () {
      var data = $(this).data("src");
      var parent = $(this).parent();
      if (data !== undefined && !parent.hasClass("avoidLazy")) {
        $(this).attr("src", data);
        $(this).removeAttr("data-src");
        parent.load();
      }
    });
    $("picture").each(function () {
      var picture = $(this);
      $("img", picture).attr("src", $("img", picture).data("src"));
      $("img", picture).removeAttr("data-src");
      $("source", picture).each(function () {
        var srcset = $(this).data("srcset");
        $(this).attr("srcset", srcset);
        $(this).removeAttr("data-srcset");
      });
      var image = new Image();
      image.onload = function () {
        picture.addClass("show");
      };
      image.src = $("img", picture).attr("src");
    });
  };
  this.removePagetransition = function () {
    document.body.classList.add("loaded");
    let pageTransitionElement = document.getElementById("pageTransition");
    setTimeout(function () {
      pageTransitionElement.classList.add("closed");
    }, 20);
  };
  this.isTouchDevice = function () {
    return "ontouchstart" in window;
  };
  this.credits = function () {
    console.log(
      "\n\n%cSite by\n%cMouthwash & MetÃ³dica\n\n%chttps://mouthwash.studio%c\n\n%chttps://metodica.co%c\n\n",
      "font-size: 20px;",
      "font-size: 40px;",
      '<a href="https://mouthwash.studio/" target="_blank" style="font-size: 20px">',
      "</a>",
      '<a href="https://metodica.co" target="_blank" style="font-size: 20px">',
      "</a><hr/>"
    );
  };
};
var gvs = new GVS();
gvs.init();
