// turkishNormalizer.js

function normalizeTurkish(text){

if(!text) return "";

text=text.toLowerCase();

const suffixes=[
"'da","'de","'ta","'te",
"'ya","'ye",
"'dan","'den",
"'a","'e",
"da","de","ta","te",
"ya","ye",
"dan","den"
];

let words=text.split(/\s+/);

words=words.map(w=>{

for(const s of suffixes){

if(w.endsWith(s)){
return w.replace(s,"");
}

}

return w;

});

return words.join(" ");

}

module.exports={normalizeTurkish};
