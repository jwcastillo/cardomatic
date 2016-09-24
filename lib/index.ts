import * as Bluebird from 'bluebird'
import * as fs from 'fs'
import * as sizeOf from 'image-size'
import * as PDFDocument from 'pdfkit'
import * as baby from 'babyparse'
import * as glob from 'glob'
import replaceExt = require('replace-ext')

enum csvIndex {
  name = 0,
  imageSrc = 1
}

const globAsync = Bluebird.promisify<string[], string>(glob)
const readFileAsync = Bluebird.promisify<Buffer, string>(fs.readFile)

function isEmpty(s: string): boolean {
  return s === '' || s == null
}

globAsync('*.csv')
.then(filenames => {
  return Promise.all(filenames.map(filename => {
    return readFileAsync(filename)
    .then(buffer => {
      const csvData = baby.parse(buffer.toString()).data
      const csvWithoutEmptyLines = csvData.filter(csvLine => {
        return !isEmpty(csvLine[csvIndex.imageSrc])
      })

      return {
        csv: csvWithoutEmptyLines,
        sourceFilename: filename,
        destFilename: replaceExt(filename, '.pdf'),
      }
    })
  }))
})
.then(tuples => {
  tuples.forEach(({csv, destFilename}) => {
    const doc = new PDFDocument({
      layout: 'landscape',
      margin: 0,
    })
    doc.pipe(fs.createWriteStream(destFilename))
    const page = doc.page

    const last = csv.length - 1
    for (let i = 0; i <= last; i++) {
      const [name, imageSrc] = csv[i]

      const image = sizeOf(imageSrc)
      const widthRatio = page.width / image.width
      const heightRatio = page.height / image.height
      const scaledImage = widthRatio < heightRatio ?
        {width: page.width, height: image.height * widthRatio} :
        {width: image.width * heightRatio, height: page.height}
      const x = (page.width - scaledImage.width) / 2
      const y = (page.height - scaledImage.height) / 2
      doc.image(imageSrc, x, y, {
        fit: [scaledImage.width, scaledImage.height],
      })
      .text(name, 20, page.height - 30)

      if (i < last) doc.addPage()
    }
    doc.end()
  })
})
