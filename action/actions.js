// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
	if (document.getElementById('disable') !== null)
		document.getElementById('disable').addEventListener('click', function() {__disable();});
	if (document.getElementById('enable') !== null)
		document.getElementById('enable').addEventListener('click', function() {__enable();});
	if (document.getElementById('docs') !== null)
        document.getElementById('docs').addEventListener('click', function() {home();});
    if (document.getElementById('options') !== null)    
        document.getElementById('options').addEventListener('click', function() {options();}); 
});

function goTo(url) {
	chrome.tabs.getAllInWindow(undefined, function(tabs) {
		for (var i = 0, tab; tab = tabs[i]; i++) {
			if (tab.url && tab.url == url) {
				chrome.tabs.update(tab.id, {selected: true});
				return;
			}
		}
		chrome.tabs.create({ url: url });
	});
}

function currentSite(callback) {
	chrome.tabs.getSelected(null, function(t) {
		callback(t.url);
		window.close();
	});
}

function toHost(url) {
	var host = new RegExp('(https{0,1}://.*?)/.*').exec(url);
	if (host == null)
		host = url;
	else
		host = host[1];
	return host;
}

function __enable() {
	currentSite(function(url) {
		var host = toHost(url);
		var sites = localStorage['sites'].split(/,\s+/);

		var newsites = [];
		for (var x = 0; x < sites.length; x++) {
			var site = sites[x];
			if (host != site)
				newsites.push(site);
		}
		localStorage['sites'] = newsites.join(', ');
		chrome.extension.sendRequest({ command: 'refreshTabs' });
	});
}

function __disable() {
	currentSite(function(url) {
		var sites = localStorage['sites'].split(/,\s+/);
		var host = toHost(url);
		sites.push(host);
		localStorage['sites'] = sites.join(', ');
		chrome.extension.sendRequest({ command: 'refreshTabs' });
	});
}

function home() {
	goTo('http://chrome.afterthedeadline.com/proofreading-for-google-chrome-help/');
}

function options() {
	goTo('chrome-extension://' + location.hostname + '/options/options.html');
}
