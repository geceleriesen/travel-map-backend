// cityAliases.js

const aliases={

roma:"rome",
milano:"milan",
londra:"london",
riyad:"riyadh",
tokyo:"tokyo",
paris:"paris",
barselona:"barcelona",
newyork:"new york",
losangeles:"los angeles"

};

function resolveAlias(city){

city=city.toLowerCase();

if(aliases[city]) return aliases[city];

return city;

}

module.exports={resolveAlias};
