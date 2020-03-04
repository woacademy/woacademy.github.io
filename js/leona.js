/**
 * leona.js
 * Several functions for fetching and displaying the current list of iPad Exam Resources.
 *
 * Note: `XMLHTTPRequest` has been used in place of `fetch` due to iOS 9.3.5's limited compatibility.
 */
const GITHUB_USER = 'woacademy';
const GITHUB_REPO = 'woacademy.github.io';

/**
 * Generate the file hierarchy.
 * 
 * @param {Object} hierarchy JSON Object representing a level of the file hierarchy.
 * @param {String} current The current hierarchy HTML.
 */
function generateHierarchy(hierarchy, current) {
    current += '<li><i class="fa fa-folder-open" aria-hidden="true"></i> <strong>' + hierarchy.dirname + '</strong><ul>';

    // Display files.
    hierarchy.files.forEach(function(file) {
        current += '<li><i class="fa fa-file" aria-hidden="true"></i> <a href="' + encodeURI(file.filepath) + '">' + file.filename + '</a>' + '</li>';
    });

    // Recursively display folders.
    hierarchy.dirs.forEach(function(dir) {
        current += generateHierarchy(dir, '');
    });

    current += '</ul></li>';
    return current;
}

/**
 * Fetch a specified version of the file hierarchy from GitHub.
 * 
 * @param {String} sha SHA of the GitHub revision to fetch.
 */
function fetchHierarchy(sha) {
    var request = new XMLHttpRequest();
    request.open('GET', "https://raw.githubusercontent.com/woacademy/woacademy.github.io/" + sha + "/hierarchy.json");
    request.send();
    request.onload = function() {
            var hierarchy = generateHierarchy(JSON.parse(request.responseText), '');
            document.body.innerHTML += '<ul id="root-list">' + hierarchy + '</ul>';
    }

    // Display the latest SHA (debug only?).
    document.body.innerHTML += '<div id="sha"><i class="fa fa-info-circle" aria-hidden="true"></i> resources@' + sha + '</div><br>';
}

/**
 * Fetch the latest commit SHA using the GitHub API. This approach prevents the hierarchy becoming stale due to caching.
 */
(function fetchLatestCommit() {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.github.com/repos/' + GITHUB_USER + '/' + GITHUB_REPO + '/commits/master');
    request.send();
    request.onload = function() {
        fetchHierarchy(JSON.parse(request.responseText).sha);
    };
})();
