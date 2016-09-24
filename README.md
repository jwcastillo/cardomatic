cardomatic
==========
Generates Doman-inspired flashcards for visual (and hopefully not oral) consumption by our little ones

How to
------
1. `npm install -g cardomatic`
2. Create directory that will contain all your CSV files.
3. Each CSV file must contain 2 columns with name & image filename (image must be local, not remote).

   This is an example:

   ```
  "Elephant","images/elephant.jpg"
  "Rabbit","images/rabbit.jpg"
   ```

4. Run `cardomatic` in that directory.
5. Marvel at all the generated PDFs (and then print them).
