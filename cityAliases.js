const aliases = {

roma: "rome",
milano: "milan",
londra: "london",
riyad: "riyadh",
pekın: "beijing",
tokyo: "tokyo",
paris: "paris",
barselona: "barcelona"

};

function resolveAlias(word){

word = word.toLowerCase();

if(aliases[word]){
return aliases[word];
}

return word;

}

module.exports = { resolveAlias };
