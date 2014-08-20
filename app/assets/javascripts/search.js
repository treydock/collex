/*global History */
/*global GeneralDialog */

jQuery(document).ready(function($) {
	"use strict";
	var body = $("body");

	var progressDlg = null;
	function showProgress() {
		// This puts up a large spinner that can only be canceled through the ajax return status

		var dlgLayout = {
			page : 'spinner_layout',
			rows : [
				[{
					text : ' ',
					klass : 'gd_transparent_progress_spinner'
				}], [{
					rowClass : 'gd_progress_label_row'
				}, {
					text : "Searching...",
					klass : 'transparent_progress_label'
				}]]
		};

		var pgsParams = {
			this_id : "gd_progress_spinner_dlg",
			pages : [dlgLayout],
			body_style : "gd_progress_spinner_div",
			row_style : "gd_progress_spinner_row"
		};
		progressDlg = new GeneralDialog(pgsParams);
		progressDlg.center();
	}

	function getUrlVars() {
		// This returns the query string as a hash of values.
		// If a key appears more than once then it is returned as an array, otherwise as a string.
		// That is, given "?q=tree&gen=2&gen=5", the return object is: { q: "tree", gen: [ "2", "5" ] }
		var params = {};
		var query = ""+window.location.search;
		if (query === "") // If there are no query params at all.
			return params;
		query = query.substr(1);	// get rid of the "?"
		var hashes = query.split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			var hash;
			hash = hashes[i].split('=');
			if (hash.length === 1) // If the form just has "&key&key2" without an equal sign.
				hash.push("");

			if (params[hash[0]] !== undefined) {
				if (typeof params[hash[0]] === "string")
					params[hash[0]] = [ params[hash[0]], hash[1] ]; // If this is the second occurrence, turn it from a string into an array.
				else
					params[hash[0]].push(hash[1]);// If there are multiple occurrences, just keep adding them.
			} else
				params[hash[0]] = decodeURIComponent(hash[1]);// For the first, or only occurrence, return it as a string.
		}
		return params;
	}

	function makeQueryString(existingQuery) {
		var arr = [];
		for (var key in existingQuery) {
			if (existingQuery.hasOwnProperty(key)) {
				var val = existingQuery[key];
				if (typeof val === 'string')
					arr.push(key+'='+val);
				else {
					for (var i = 0; i < val.length; i++)
						arr.push(key+'='+val[i]);
				}
			}
		}
		return arr.join('&');
	}

	function onSuccess(resp) {
		if (progressDlg) {
			progressDlg.cancel();
			progressDlg = null;
		}
		resp.query = getUrlVars();
		body.trigger('RedrawSearchResults', resp);
	}

	function onError(resp) {
		if (progressDlg) {
			progressDlg.cancel();
			progressDlg = null;
		}
		window.console.error(resp);
	}

	function doSearch() {
		var existingQuery = getUrlVars();
		$.ajax({ url: "/search.json",
			data: existingQuery,
			success: onSuccess,
			error: onError
		});
	}

	History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
		var state = History.getState(); // Note: We are using History.getState() instead of event.state
		doSearch();
	});

	function addToQueryObject(newQueryKey, newQueryValue) {
		var existingQuery = getUrlVars();
		if (existingQuery[newQueryKey] === undefined)
			existingQuery[newQueryKey] = newQueryValue;
		else if (typeof existingQuery[newQueryKey] === 'string')
			existingQuery[newQueryKey] = [existingQuery[newQueryKey], newQueryValue];
		else if ($.inArray(newQueryValue, existingQuery[newQueryKey]) === -1)
			existingQuery[newQueryKey].push(newQueryValue);
		return existingQuery;
	}

	function removeFromQueryObject(newQueryKey, newQueryValue) {
		var existingQuery = getUrlVars();
		if (existingQuery[newQueryKey] === undefined)
			return existingQuery; // Nothing to do: the parameter wasn't present
		else if (typeof existingQuery[newQueryKey] === 'string') {
			if (existingQuery[newQueryKey] === newQueryValue)
				delete existingQuery[newQueryKey];
			// If the value didn't match, then there's nothing to do, the parameter wasn't present.
		} else {
			var index = $.inArray(newQueryValue, existingQuery[newQueryKey]);
			if (index !== -1)
				existingQuery[newQueryKey].splice(index, 1);
		}
		return existingQuery;
	}

	function replaceInQueryObject(newQueryKey, newQueryValue) {
		var existingQuery = getUrlVars();
		existingQuery[newQueryKey] = newQueryValue;
		return existingQuery;
	}

	function createNewUrl(newQueryKey, newQueryValue, action) {
		var existingQuery;
		if (action === 'remove')
			existingQuery = removeFromQueryObject(newQueryKey, newQueryValue);
		else if (action === 'add')
			existingQuery = addToQueryObject(newQueryKey, newQueryValue);
		else
			existingQuery = replaceInQueryObject(newQueryKey, newQueryValue);
		return "/search?" + makeQueryString(existingQuery);
	}

	body.on("click", ".select-facet", function () {
		var el = $(this);
		var newQueryKey = el.attr("data-key");
		var newQueryValue = el.attr("data-value");
		//newQueryValue = encodeURIComponent(newQueryValue);
		var action = el.attr("data-action");
		var url = createNewUrl(newQueryKey, newQueryValue, action);
		showProgress();
		var pageTitle = document.title; // For now, don't change the page title depending on the search.
		History.pushState(null, pageTitle, url);
	});

	body.on("change", ".limit_to_federation input", function() {
		var feds = $(".limit_to_federation input");
		// If all of the federation checkboxes are checked, then we remove the federation parameter.
		// If none of the federation checkboxes are checked, then we change them to all being checked.
		// Otherwise add the federations that were checked.
		var allChecked = true;
		var noneChecked = true;
		var checkedFeds = [];
		feds.each(function(index, el) {
			if (el.checked) {
				noneChecked = false;
				checkedFeds.push(el.name);
			} else {
				allChecked = false;
			}
		});
		var existingQuery = getUrlVars();
		if (allChecked || noneChecked) {
			delete existingQuery.f;
		} else {
			existingQuery.f = checkedFeds;
		}
		showProgress();
		var pageTitle = document.title; // For now, don't change the page title depending on the search.
		History.pushState(null, pageTitle, "/search?" + makeQueryString(existingQuery));
	});
});

