// turkishNormalizer.js

function normalizeTurkish(text) {

  if (!text) return "";

  text = text.toLowerCase();

  const suffixes = [
    "'da","'de","'ta","'te",
    "'ya","'ye",
    "'dan","'den",
    "'a","'e",
    "da","de","ta","te",
    "ya","ye",
    "dan","den"
  ];

  let words = text.split(" ");

  words = words.map(word => {

    for (const s of suffixes) {

      if (word.endsWith(s)) {
        return word.replace(s,"");
      }

    }

    return word;

  });

  return words.join(" ");

}

module.exports = {
  normalizeTurkish
};
