/*!
 * jQuery Festival Timetable Plugin
 * https://github.com/malde/jquery-timetable
 *
 * Copyright 2013 Malte Klemke
 * Released under the MIT license
 */
;(function ($, window, document, undefined) {

    var pluginName = "timetable",
        defaults = {
            firstHour: 12,
            lastHour: 2,
            hourWidth: 120,
            file: ''
        },
        _storageKey = "jq.festival.timetable",
        _selectedArtists = [];

    function Plugin(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    var _calcWidth = function (duration, hourWidth) {
        var fiveMinuteWidth = (hourWidth / 60) * 5;
        return ((duration / 5) * fiveMinuteWidth) - 11; // I don't understand why, but the 11 has to be substracted
    };

    var _calcOffset = function (time, hourWidth, firstHour) {
        var fiveMinuteWidth = (hourWidth / 60) * 5;

        var timearray = time.split(':');
        var hours = parseInt(timearray[0], 10),
            minutes = parseInt(timearray[1], 10);

        hours = hours < firstHour ? hours + 24 : hours;
        return (hours * hourWidth + (minutes / 5) * fiveMinuteWidth) - (firstHour * hourWidth);
    };

    var _loadFromStore = function() {
        var storedValue = localStorage.getItem(_storageKey);
        return JSON.parse(storedValue) || [];
    };

    var _saveToStore = function(value) {
        localStorage.setItem(_storageKey, JSON.stringify(value));
    };

    var _toggleArtist = function(artistId) {
        var artists = _loadFromStore();
        var index = artists.indexOf(artistId);
        var selected = true;
        if (index > -1) {
            selected = false;
            artists.splice(index, 1);
            _saveToStore(artists);
        }
        else {
            artists.push(artistId);
            _saveToStore(artists);
        }

        $('#'+artistId).toggleClass('selected');
        $('input[value="'+artistId+'"]').prop('checked', selected);
    };

    Plugin.prototype = {

        init: function () {
            var plugin = this;
            _selectedArtists = _loadFromStore();
            var src = plugin.options.file;
            $.getJSON(src, function (json) {
                var $headline = $('<h1/>').append(json.name);
                var $selections = plugin.createSelection(plugin.element, plugin.options, json);
                var $festival = plugin.createFestival(plugin.element, plugin.options, json);

              //  $(plugin.element).append($headline).append($selections).append($festival);
			    $(plugin.element).append($festival);
            });
        },

        createSelection: function (el, options, festival) {
            var $checkboxes = $('<div/>').addClass('selections');

            var days = festival.days;

            for (var i = 0; i < days.length; i++) {
                var stages = days[i].stages;

                for (var j = 0; j < stages.length; j++) {
                    var artists = stages[j].artists;

                    for (var h = 0; h < artists.length; h++) {
                        var artist = artists[h];

                        var $input = $('<input/>').attr('type', 'checkbox').attr('value', artist.id);
                        if (_selectedArtists.indexOf(artist.id) > -1) {
                            $input.prop('checked', true);
                        }
                        $input.change(function (e) {
                            var val = $(this).val();
                            _toggleArtist(val);
                        });

                        var $label = $('<label/>').append($input).append(artist.name);
                        $checkboxes.append($label);
                    }
                }
            }

            return $checkboxes;
        },

        createFestival: function (el, options, festival) {
            var days = festival.days;

            var $div = $('<div/>').addClass('festival');

            for (var i = 0; i < days.length; i++) {
                var day = days[i];
                var $day = this.createDay(el, options, day);

                $div.append($day);
            }

            return $div;
        },

        createDay: function (el, options, day) {
            var stages = day.stages;
            var hourPx = options.hourWidth;
			
			var d = new Date();
			var today = d.getDate();
			if (d.getHours<5){
				today = d.getDate()-1; //rano se bere jako predchozi den
			}
			
			var today = today + '.' + (d.getMonth()+1) + '.' + d.getFullYear()
			var opacity = 0.6;
			if (day.date==today){
				opacity = 1;
			}
			
			var $day = $('<fieldset/>').addClass('day').css({
                'background-size': hourPx + 'px',
                'background-image': 'repeating-linear-gradient(-90deg, lightgrey, lightgrey 1px, transparent 1px, transparent ' + hourPx + 'px)',
				'opacity': opacity
            });
            var $legend = $('<legend/>').append(day.name);
			$day.append($legend);

            var $times = this.createTimes(el, options);
            $day.append($times);

            for (var i = 0; i < stages.length; i++) {
                var stage = stages[i];
                var $stage = this.createStage(el, options, stage);

                $day.append($stage);
            }

            return $day;
        },

        createTimes: function (el, options) {
            var $times = $('<div/>').addClass('times');

            for (var i = options.firstHour + 1; i < options.lastHour + 24; i++) {
                var time = (i > 24 ? i - 24 : (i == 24 ? '00' : i)) + ':00';
                var offset = _calcOffset(time, options.hourWidth, options.firstHour);

                var $time = $('<div/>').append(time).css({
                    'left': offset + 'px'
                }).addClass('time');

                $times.append($time);
            }

            return $times;
        },

        createStage: function (el, options, stage) {
            var artists = stage.artists;

            var $div = $('<div/>').addClass('stage').addClass(stage.id);
            $div.append('&nbsp;<span class="stagename '+ stage.id +'">'+stage.name+'</span>');

            for (var i = 0; i < artists.length; i++) {
                var artist = artists[i];
                var $artist = this.createArtist(el, options, artist);

                $div.append($artist);
            }

            return $div;
        },

        createArtist: function (el, options, artist) {
            var offset = _calcOffset(artist.time, options.hourWidth, options.firstHour);
            var width = _calcWidth(artist.duration, options.hourWidth);

            var $div = $('<div/>').addClass('artist').attr('id', artist.id).append(artist.name).css({
                'width': width + 'px',
                'left': offset + 'px'
            }).click(function(e) {
                _toggleArtist(artist.id);
            });
            if (_selectedArtists.indexOf(artist.id) > -1) {
                $div.addClass('selected');
            }

            return $div;
        }

    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);