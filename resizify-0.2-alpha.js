/* Resizify 0.2 - this is Alpha/Barely Beta™ code. 
 * Not ready for prime time until you have time to test.
 * Copyright (c) 2010 Robb Irrgang (http://irrg.org)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */

(function ($) {
    $.fn.extend({
        resizify: function (url, options) {
            var settings = $.extend({
                cache_folder: 'cache/resizify_',
                ratio: 4 / 3,
                width_modifier: function (window_w, window_h, image_w, image_h, image_ratio) {
                    if (image_h != window_h) {
                        image_w = Math.round(window_h * image_ratio)
                    }
                    return image_w
                }
            }, options);
            var image_url = url;
            var image_ratio = settings.ratio;
            var base_directory = image_url.substr(0, image_url.lastIndexOf('/') + 1);
            var base_file = image_url.substr(image_url.lastIndexOf('/') + 1);
            var base_extension = base_file.substr(base_file.lastIndexOf('.'));
            var base_filename = base_file.substr(0, base_file.length - base_extension.length);
            var ref = this;
            var window_w;
            var window_h;
            var image_w;
            var image_h;
            var needed_w;
            var needed_h;
            var resize_timeout;
            $(ref).hide();
            $(this).addClass('backdrop');

            function setDimensions() {
                window_w = $(window).width();
                window_h = $(window).height();
                image_w = window_w;
                image_h = Math.round(image_w / image_ratio);
                image_w = settings.width_modifier(window_w, window_h, image_w, image_h, image_ratio);
                image_h = Math.round(image_w / image_ratio);
                needed_w = Math.ceil(image_w / 256) * 256;
                needed_h = Math.round(needed_w / image_ratio);
                if (needed_w > 2560) {
                    needed_w = 2560;
                    needed_h = Math.round(needed_w / image_ratio)
                }
                if ($(ref).find('img').length > 0) {
                    $(ref).find('img').get(0).width = image_w;
                    $(ref).find('img').get(0).height = image_h;
                    $(ref).css('width', image_w + 'px').css('height', image_h + 'px')
                }
            }
            function loadImage(src, chainable) {
                var new_img = new Image();
                new_img.onload = function () {
                    $(ref).html('<img src="' + src + '" alt="" title="" />');
                    image_ratio = new_img.width / new_img.height;
                    setDimensions();
                    if (chainable) {
                        chainable()
                    }
                    $(ref).show()
                };
                new_img.src = src
            }
            function loadProperImage() {
                loadImage(base_directory + settings.cache_folder + base_filename + '_' + needed_w + base_extension)
            }
            $(window).unbind('resize');
            $(window).bind('resize', function () {
                setDimensions();
                if (resize_timeout) {
                    clearTimeout(resize_timeout);
                    resize_timeout = false
                }
                resize_timeout = setTimeout(function () {
                    loadProperImage()
                }, 1000)
            });
            setDimensions();
            return this.each(function () {
                loadProperImage()
            })
        }
    })
})($);