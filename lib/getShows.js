const { promisify } = require('util');
const glob = promisify(require('glob'));
const marked = require('meta-marked');
const { readFile } = require('fs');
const readAFile = promisify(readFile);

const pad = (num) => ('000' + num).substr(-3);

let shows = [];

const loadShows = async () => {
  const files = await glob('shows/*.md');
  const markdownPromises = files.map(file => readAFile(file, 'utf-8'));
  const showMarkdown = await Promise.all(markdownPromises);
  shows = showMarkdown
    .map(md => marked(md)) // convert to markdown
    .map((show, i) => Object.assign({}, show.meta, { html: show.html, notesFile: files[i] })) // flatten
    .map(show => Object.assign({}, show, { displayNumber: pad(show.number) })) // pad zeros
    .reverse()
}

exports.getShows = () => {
  return shows;
}

exports.getShow = (number) => {
  const show = shows.find(show => show.displayNumber === number);
  return show;
}

loadShows();
