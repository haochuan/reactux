// test/helpers/setup.js
import { jsdom } from 'jsdom';

global.document = jsdom('<body></body>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;