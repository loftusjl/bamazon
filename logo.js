const clear = require('clear');
const CFonts = require('cfonts');

let logo = function() {
    clear();
    CFonts.say('Bamazon', {
        font: 'block', // define the font face
        align: 'center', // define text alignment
        colors: ['system'], // define all colors
        background: 'transparent', // define the background color, you can also use `backgroundColor` here as key
        letterSpacing: 1, // define letter spacing
        lineHeight: 1, // define the line height
        space: true, // define if the output text should have empty lines on top and on the bottom
        maxLength: '0', // define how many character can be on one line
    });
}


module.exports = logo;