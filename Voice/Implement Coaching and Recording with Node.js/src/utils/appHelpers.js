// create a Showdown instance to parse issue/pr body content
const showdown = require('showdown')

// Showdown parameters to jive well with Github flavored markdown
export const converter = new showdown.Converter({
    tables: true,
    strikethrough: true,
    ghCompatibleHeaderId: true,
    literalMidWordUnderscores: true,
    ghCodeBlocks: true,
    tasklists: true,
    ghMentions: true,
    ghMentionsLink: 'https://github.com/{u}'
})

// helper function to properly encode query string for fetch
export const encodeQueryString = (params) => {
    const keys = Object.keys(params)
    return keys.length ?
        "?" + keys
        .map(key => encodeURIComponent(key) +
            "=" + encodeURIComponent(params[key]))
        .join("&") :
        ""
}

// helper function to parse Link headers in to an object for use with pagniation
export const parseLinkHeader = (header) => {
    if (header.length === 0) {
        throw new Error("input must not be of zero length");
    }

    // Split parts by comma and parse each part into a named link
    return header.split(/(?!\B"[^"]*),(?![^"]*"\B)/).reduce((links, part) => {
        const section = part.split(/(?!\B"[^"]*);(?![^"]*"\B)/);
        if (section.length < 2) {
            throw new Error("section could not be split on ';'");
        }
        const url = section[0].replace(/<(.*)>/, '$1').trim();
        const name = section[1].replace(/rel="(.*)"/, '$1').trim();

        links[name] = url;

        return links;
    }, {});
}