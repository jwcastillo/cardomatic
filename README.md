# cardomatic
Generates Doman-inspired flashcards for visual (and hopefully not oral) consumption by our little ones

## How to
Run:

```
npm install -g cardomatic
```


Then create directory that will contain all your CSV files.

Each CSV file must contain 2 columns with name & image filename (image must be local, not remote).  This is an example:

```
"Elephant","images/elephant.jpg"
"Rabbit","images/rabbit.jpg"
...
```

Run `cardomatic` in that directory.  Once it's done, marvel at all the generated PDFs before printing them.
