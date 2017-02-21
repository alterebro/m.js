;(function () {

	'use strict';

	// -----------------
	// Template
	var template = (function() {

		var esc = {
			'\\': '\\',
			"'": "'",
			'r': '\r',
			'n': '\n',
			't': '\t',
			'u2028': '\u2028',
			'u2029': '\u2029'
		};
		for (var p in esc) { esc[esc[p]] = p; }

		var tmpl = function (text, data) {

	        var source = "__p+='" + text
	        	.replace('<%', '&lt;%')
	        	.replace('%>', '%&gt;')
	            .replace(/\\|'|\r|\n|\t|\u2028|\u2029/g, function (match) {
	                return '\\' + esc[match];
	            })
				.replace(/&lt;%=([\s\S]+?)%&gt;/g, function (match, code) {
	                return "'+\n(" + unescape(code) + ")+\n'";
	            })
	            .replace(/&lt;%([\s\S]+?)%&gt;/g, function (match, code) {
	                return "';\n" + unescape(code) + "\n;__p+='";
	            }) + "';\n";
				source = 'with(obj||{}){\n' + source + '}\n';
				source = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + source + "return __p;\n";

			var render = new Function('obj', source);

			return (data) ? render(data) : (function (data) {
					return render.call(this, data);
		        });

	    };

		return tmpl;
	})();

	// -----------------
	// Router
	var router = function (routes) {

		var getRegExp = function(route) {
			var regexps = [
		        /[\-{}\[\]+?.,\\\^$|#\s]/g,
		        /\((.*?)\)/g,
		        /(\(\?)?:\w+/g,
		        /\*\w+/g,
		    ];

	        route = route.replace(regexps[0], '\\$&')
	            .replace(regexps[1], '(?:$1)?')
	            .replace(regexps[2], function(match, optional) {
	                return optional ? match : '([^/?]+)';
	            }).replace(regexps[3], '([^?]*?)');
	        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
	    };

	    var extractParams = function(route, fragment) {
	        var params = route.exec(fragment).slice(1);
	        var results = [], i;
	        for(i = 0; i < params.length; i++) {
	            results.push(decodeURIComponent(params[i]) || null);
	        }
	        return results;
	    };

		function exec(path) {
	        for(var r in routes) {
	            var route = getRegExp(r);
	            if (!route.test(path)) {
	                continue;
	            }
				routes[r].apply(this, extractParams(route, path));
	        }
	    }

		function emit() {
			var path = location.href.split('#')[1] || '/';
			exec(path);
	    }

		var start = function() {
			emit();
			window.addEventListener('hashchange', emit, false);
		};
		var stop = function() {
			window.removeEventListener('hashchange', emit, false);
		};

		return {
			start : start,
			stop : stop,
			go : function(path) {
		        location.hash = path;
		        exec(path);
		    }
		};
    };

	// -----------------
	// Request
	var request = function (url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.send();
		xhr.onreadystatechange = function(e) {
			if (xhr.readyState === xhr.DONE) {
				var res = ( xhr.status === 200 ) ? xhr : { responseText : '[]' };
					res = JSON.parse( res.responseText );
				callback(res);
			}
		};
	};

	// -----------------
	// m.js
	window.m = {
		tpl : template,
		run : router,
		req : request
	};

}());
