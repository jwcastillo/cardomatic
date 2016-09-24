"use strict";
const Bluebird = require('bluebird');
const fs = require('fs');
const sizeOf = require('image-size');
const PDFDocument = require('pdfkit');
const baby = require('babyparse');
const glob = require('glob');
const replaceExt = require('replace-ext');
var csvIndex;
(function (csvIndex) {
    csvIndex[csvIndex["imageSrc"] = 0] = "imageSrc";
    csvIndex[csvIndex["text"] = 1] = "text";
})(csvIndex || (csvIndex = {}));
const globAsync = Bluebird.promisify(glob);
const readFileAsync = Bluebird.promisify(fs.readFile);
function isEmpty(s) {
    return s === '' || s == null;
}
globAsync('*.csv')
    .then(filenames => {
    return Promise.all(filenames.map(filename => {
        return readFileAsync(filename)
            .then(buffer => {
            const csvData = baby.parse(buffer.toString()).data;
            const csvWithoutEmptyLines = csvData.filter(csvLine => {
                return !isEmpty(csvLine[csvIndex.imageSrc]);
            });
            return {
                csv: csvWithoutEmptyLines,
                sourceFilename: filename,
                destFilename: replaceExt(filename, '.pdf'),
            };
        });
    }));
})
    .then(tuples => {
    tuples.forEach(({ csv, destFilename }) => {
        const doc = new PDFDocument({
            layout: 'landscape',
            margin: 0,
        });
        const page = doc.page;
        doc.pipe(fs.createWriteStream(destFilename));
        doc.fontSize(36);
        const last = csv.length - 1;
        for (let i = 0; i <= last; i++) {
            const [imageSrc, text] = csv[i];
            const image = sizeOf(imageSrc);
            const widthRatio = page.width / image.width;
            const heightRatio = page.height / image.height;
            const scaledImage = widthRatio < heightRatio ?
                { width: page.width, height: image.height * widthRatio } :
                { width: image.width * heightRatio, height: page.height };
            const x = (page.width - scaledImage.width) / 2;
            const y = (page.height - scaledImage.height) / 2;
            doc.image(imageSrc, x, y, {
                fit: [scaledImage.width, scaledImage.height],
            });
            // center text on page
            doc.addPage();
            doc.text(text, 0, 150, {
                align: 'center',
            });
            if (i < last)
                doc.addPage();
        }
        doc.end();
    });
});
