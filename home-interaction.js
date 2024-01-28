Home = function () {
    this.thumbnailsHeight = 0;
    this.thumbnailsSectionNumber = 5;
    this.thumbnailsSectionHeight = 0;
    this.lastScrollUpdate = 0;
    this.mobileUserScrolled = true;
    this.oldScroll = 0;
    this.responsiveWidth = 1000;
    this.responsiveWidth2 = 740;
    var self = this;
    this.init = function () {
      if ($("#home").length) {
        self.sliderPosition(0);
        self.initEvents();
        if (sessionStorage.getItem("loaded") == 1) {
          setTimeout(function () {
            gvs.lazyLoad();
          }, 200);
        }
        self.sliderPosition(sessionStorage.lastProjectClicked);
        self.resize();
        self.updateScroll();
        gvs.lazyLoad();
        setTimeout(function () {
          $("body")
            .removeClass("transitioning")
            .removeClass("archive-hover")
            .removeClass("loading-cursor");
        }, 20);
        $(window).resize(function () {
          self.resize();
        });
      }
    };
    this.resize = function () {
      if ($("#home").length) {
        if ($(window).width() <= self.responsiveWidth2) {
          $(".bottomMask").css("height", $(window).height() * 0.25 - 30);
          $(".topMask").css("height", $(window).height() * 0.25 - 22);
          $(".bottomMask").css({ top: $(window).height() * 0.25 + 30 + "px" });
          $("#home .thumbnails").css({ height: $(window).height() + "px" });
        } else if ($(window).width() <= self.responsiveWidth) {
          $(".bottomMask").css("height", $(window).height() * 0.25 - 35);
          $(".topMask").css("height", $(window).height() * 0.25 - 26);
          $(".bottomMask").css({ top: $(window).height() * 0.25 + 35 + "px" });
          $("#home .thumbnails").css({ height: $(window).height() + "px" });
        } else {
          $(".topMask, .bottomMask, .gradientMask, #home .thumbnails").attr(
            "style",
            ""
          );
        }
        self.thumbnailsHeight = $(".thumbnails .inner").outerHeight();
        self.thumbnailsSectionHeight =
          self.thumbnailsHeight / self.thumbnailsSectionNumber;
        self.updateThumbnailsPositions();
      }
    };
    this.updateScroll = function () {
      $("body").addClass("scrolling");
      var scroll = $(".thumbnails").scrollTop();
      if (scroll < self.oldScroll) {
        if (scroll <= self.thumbnailsSectionHeight) {
          $(".thumbnails").scrollTop(
            self.thumbnailsSectionHeight * 2 + (self.oldScroll - scroll)
          );
        }
      } else {
        if (scroll >= 4 * self.thumbnailsSectionHeight) {
          $(".thumbnails").scrollTop(
            self.thumbnailsSectionHeight * 2 + (self.oldScroll - scroll)
          );
        }
      }
      self.oldScroll = scroll;
      scroll = $(".thumbnails").scrollTop();
      if ($(window).width() <= self.responsiveWidth) {
        var percent =
          (0.5 * (scroll + $(window).height() * 0.5)) / self.thumbnailsHeight;
        var position = parseInt(percent * $(".index.mobile .inner").height());
        position -= parseInt($(window).height() * 0.25) - 23;
        $(".index.mobile .inner").css({
          "-webkit-transform": "translate3d(0px, -" + position + "px, 0px)",
          "-moz-transform": "translate3d(0px, -" + position + "px, 0px)",
          "-webkit-transform": "translate3d(0px, -" + position + "px, 0px)",
        });
      } else {
        var percent =
          0.5 - (0.5 * (scroll + $(window).height() / 2)) / self.thumbnailsHeight;
        var position = parseInt(percent * $(".index.desktop .inner").height());
        $(".index.desktop .inner").css({
          "-webkit-transform": "translate3d(0px, -" + position + "px, 0px)",
          "-moz-transform": "translate3d(0px, -" + position + "px, 0px)",
          "-webkit-transform": "translate3d(0px, -" + position + "px, 0px)",
        });
      }
      $(".projectTitle").removeClass("hovering");
    };
    this.sliderPosition = function (index, transitionTime = 0) {
      var initialPosition = self.thumbnailsSectionHeight * 2;
      var thumbnail = $("#projectThumbnail_2_" + index);
      var initialPosition =
        thumbnail.position().top - ($(window).height() - thumbnail.height()) / 2;
      if ($(window).width() <= self.responsiveWidth) {
        initialPosition = thumbnail.position().top - $(window).height() * 0.5;
      }
      self.oldScroll = initialPosition;
      if (transitionTime == 0) {
        $(".thumbnails").scrollTop(initialPosition);
      } else {
        $(".thumbnails").animate(
          { scrollTop: initialPosition },
          {
            duration: transitionTime,
            progress: function () {
              self.updateScroll();
            },
            complete: function () {
              self.updateThumbnailsPositions();
            },
          }
        );
      }
    };
    this.initEvents = function () {
      self.resize();
      self.updateScroll();
      if ($(window).width() <= self.responsiveWidth) {
        $("#thumbnails").scroll(function () {
          var scroll = $(this).scrollTop();
          $(".thumbnails").scrollTop(scroll);
          self.updateScroll();
          clearTimeout($.data(this, "scrollCheck"));
          $.data(
            this,
            "scrollCheck",
            setTimeout(function () {
              if (self.mobileUserScrolled) {
                $(".thumbnails").stop(false, false);
                self.updateThumbnailsPositions();
                self.mobileUserScrolled = false;
              }
            }, 250)
          );
        });
        $("#thumbnails").on("touchmove", function (e) {
          self.mobileUserScrolled = true;
          $(".thumbnails").stop(false, false);
        });
      } else {
        $("#home").mousewheel(function (event) {
          var scroll =
            $(".thumbnails").scrollTop() + event.deltaY * event.deltaFactor * -1;
          $(".thumbnails").scrollTop(scroll);
          $(".thumbnails").stop(false, false);
          self.updateScroll();
          self.updateThumbnailsPositions();
        });
      }
      $(".topMask, .bottomMask").mouseenter(function () {
        $("#cursor").addClass("action");
        $("#cursor span").removeClass("show");
        $("#cursor span.scroll").addClass("show");
      });
      $(".projectThumbnail").mouseenter(function () {
        $("#cursor").addClass("action");
        $("#cursor span").removeClass("show");
        $("#cursor span.click").addClass("show");
      });
      $("#home, .projectThumbnail, .topMask, .bottomMask").mouseleave(
        function () {
          $("#cursor").removeClass("action");
          $("#cursor span").removeClass("show");
        }
      );
      $(".projectTitle, .projectThumbnail").click(function () {
        var id = $(this).data("id");
        var group = $(this).data("group");
        var index = $(this).data("index");
        sessionStorage.lastProjectClicked = index;
        if (
          $(this).is(".projectTitle.hovering") ||
          $(this).hasClass("projectThumbnail")
        ) {
          $("body").addClass("project-loading");
          $(this).addClass("clicked");
        } else {
          self.sliderPosition(sessionStorage.lastProjectClicked, 800);
        }
      });
      if (!gvs.isTouchDevice()) {
        $(".projectThumbnail.video").mouseenter(function () {
          $("video", this)[0].play();
        });
        $(".projectThumbnail.video").mouseleave(function () {
          $("video", this)[0].pause();
        });
      }
    };
    this.updateThumbnailsPositions = function () {
      clearTimeout(self.lastScrollUpdate);
      self.lastScrollUpdate = setTimeout(function () {
        var scroll = $(".thumbnails").scrollTop();
        var positions = [];
        $(".projectThumbnail").each(function () {
          if ($(window).width() <= self.responsiveWidth) {
            positions.push({
              position: $(this).position().top,
              element: $(this),
            });
          } else {
            positions.push({
              position: $(this).position().top + $(this).height() / 2,
              element: $(this),
            });
          }
        });
        var num = 0;
        var ref = scroll + $(window).height() / 2;
        if ($(window).width() <= self.responsiveWidth) {
          ref = scroll + 0.5 * $(window).height();
        }
        for (var i = positions.length - 1; i >= 0; i--) {
          if (
            Math.abs(ref - positions[i].position) <
            Math.abs(ref - positions[num].position)
          ) {
            num = i;
          }
        }
        var closestThumbnail = positions[num].element;
        var newScroll =
          positions[num].element.position().top +
          positions[num].element.height() / 2 -
          $(window).height() / 2;
        if ($(window).width() <= self.responsiveWidth) {
          newScroll =
            positions[num].element.position().top - 0.5 * $(window).height();
        }
        $(".thumbnails").animate(
          { scrollTop: newScroll },
          {
            duration: 600,
            progress: function () {
              self.updateScroll();
            },
            complete: function () {
              var group = closestThumbnail.data("group");
              var index = closestThumbnail.data("index");
              $(
                '.projectTitle[data-group="' +
                  group +
                  '"][data-index="' +
                  index +
                  '"]'
              ).addClass("hovering");
              sessionStorage.lastProjectClicked = index;
              $("body").removeClass("scrolling");
            },
          }
        );
      }, 200);
    };
  };
  var home = new Home();
  home.init();
  