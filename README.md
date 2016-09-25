# cardomatic
Generates Doman-inspired flashcards for visual (and hopefully not oral) consumption by our little ones

## How to
Run:

```
npm install -g cardomatic
```


Then create directory that will contain all your CSV files.

Each CSV file must contain 2 columns with image filename (image must be local, not remote) and the text behind the page.  This is an example:

```
"images/elephant.jpg","Elephant"
"images/rabbit.jpg","Rabbit"
...
```

Run `cardomatic` in that directory.  Once it's done, marvel at all the generated PDFs before printing them with the following settings:

* Landscape
* Duplex
* Fit to page (the generated PDF has no margins)

## Tips for choosing images

* Singular, not plural (e.g. one almond vs. many almonds)
* High-res
