var App = App || {};

(function ($) {
    /*----------------------------------------------------------------------
          mineLoader: loader with counter
    ----------------------------------------------------------------------*/
    App.mineLoader = function ($target) {
        var PARAM = {
            $html: $("html"),
            $target: $target,
            $bar: $target.find("#progress"),
            completeFlag: false,
            interval: 5
        };

        /**
         * [MineLoader constructa]
         */
        var MineLoader = function () {
            this.param = PARAM;
            this.init();
        };

        // prototype
        var PROTO = MineLoader.prototype;

        // init
        PROTO.init = function () {
            var self = this;

            self.completeFlag();
            self.core();
        };

        // init: Initialization
        PROTO.core = function () {
            var self = this;
            Array.prototype.remove = function (element) {
                for (var i = 0; i < this.length; i++)
                    if (this[i] == element) this.splice(i, 1);
            };

            function preload(images, progress) {
                var total = images.length;
                $(images).each(function () {
                    var src = this;
                    $("<img/>")
                        .attr("src", src)
                        .on("load", function () {
                            images.remove(src);
                            progress(total, total - images.length);
                        });
                });
            }

            var now_percent = 0;
            var displaying_percent = 0;
            var imagesBox = [];
            $("body")
                .find("img")
                .each(function () {
                    var src = $(this).attr("src");
                    imagesBox.push(src);
                });

            preload(imagesBox, function (total, loaded) {
                now_percent = Math.ceil((100 * loaded) / total);
            });

            var timer = window.setInterval(function () {
                if (displaying_percent >= 100 && PARAM.completeFlag) {
                    window.clearInterval(timer);
                    self.loadComplete();
                } else {
                    if (displaying_percent < now_percent) {
                        displaying_percent++;
                        PARAM.$bar.css("width", displaying_percent + "%");
                    }
                }
            }, PARAM.interval);

            setTimeout(function () {
                if(!PARAM.$html.hasClass("load-complete")) {
                    displaying_percent = 100;
                    PARAM.$bar.css("width", displaying_percent + "%");
                    window.clearInterval(timer);
                    self.loadComplete();
                }
            }, 5000);
        };

        /**
         * [completeFlag : other contents]
         */
        PROTO.completeFlag = function () {
            PARAM.completeFlag = true;
        };

        /**
         * [loadComplete]
         */
        PROTO.loadComplete = function () {
            window.scrollTo(0, 0);
            PARAM.$html.addClass("load-complete");

            if ($('#wrapper').hasClass('top')) {
                new App.TopMvSlider();
            }

            setTimeout(function () {
                PARAM.$target.hide();
            }, 1000);
        };

        // @return instance
        return new MineLoader();
    };
    /*----------------------------------------------------------------------
      TopMvSlider
  ----------------------------------------------------------------------*/
    (function () {
        var p = TopMvSlider.prototype;


        // init
        function TopMvSlider() {
            this._init();
        }

        p._init = function () {
            var $mv = $('.top_mv');
            var $slider = $('.top_mv_slide');
            var $thumb = $('.top_mv_slide_thumb span');
            var $navwrap = $('.top_mv_navwrap');
            var _item = '.top_mv_slide_item';
            var _imgs = '.item_image';
            var _img_num = '';
            var _zIndex = '';
            var _duration = 6000;
            var _current = 0;
            var _next = 1;
            var _thumb_timer;
            var _classImgsStandby = 'item_image--standby';
            var _classImgsAnimate = 'item_image--animate';

            var _init = function () {

                _resize();
                $(window).on('scroll resize orientationchange', function () {
                    _resize();
                });

                _img_num = $slider.find(_item).length;
                if (!_img_num) {
                    return false;
                }

                // 画像を背景にセット
                $slider.find(_imgs).each(function () {
                    var _src = $(this).find('img').attr('src');
                    $(this).css('background-image', 'url(' + _src + ')');
                    $(this).find('img').css('visibility', 'hidden');
                });

                _zIndex = _img_num;

                $slider.find(_item).each(function () {
                    $(this).hide();
                    $(this).css({ 'zIndex': _zIndex-- });
                });

                // 1枚目を表示
                $slider.find(_item).first().show();
                $slider.find(_item).first().find(_imgs).addClass(_classImgsAnimate);

                return false;

            };

            var _slide = function () {
                _zIndex = _img_num;
                $slider.find(_item).each(function (e) {
                    if (e == _current) {
                        $(this).css({ 'zIndex': _zIndex - 1 });
                    } else if (e == _next) {
                        $(this).show();
                        $(this).css({ 'zIndex': _zIndex, 'opacity': 0 });
                        $(this).velocity({ 'opacity': 1 }, 2000);
                        $(this).find(_imgs).addClass(_classImgsAnimate).removeClass(_classImgsStandby);
                    } else {
                        $(this).css({ 'zIndex': 1 });
                        $(this).hide();
                        $(this).find(_imgs).removeClass(_classImgsAnimate).addClass(_classImgsStandby);
                    }
                });

                _current = _next;
                if (_current + 1 == _img_num) {
                    _next = 0;
                } else {
                    _next = _current + 1;
                }
            };

            var _thumb = function () {
                $thumb.css({ 'width': 0 });
                clearInterval(_thumb_timer);
                var _thumb_duration = _duration / 110;
                var _i = 0;
                _thumb_timer = setInterval(function () {
                    $thumb.css({ 'width': _i + '%' });
                    _i++;
                }, _thumb_duration);
            };

            var _autoPlayStart = function () {
                _thumb();

                setInterval(function () {
                    _slide();
                    _thumb();
                }, _duration);
            };

            var _start = function () {
                // ズームアニメーション開始
                _autoPlayStart();
            };

            var _resize = function () {

                if ($('html').hasClass('mode-sp')) {
                    $navwrap.height('');
                    $mv.height($mv.find('.top_mv_inline').height());
                } else {
                    $navwrap.height('');
                    $mv.height('');
                }
            };

            _init();
            _start();
        };

        App.TopMvSlider = TopMvSlider;
    })();

    /*----------------------------------------------------------------------
      DOM READY
  ----------------------------------------------------------------------*/
    jQuery(function () {
        App.mineLoader($("#Loader"));
    });
})(jQuery);
