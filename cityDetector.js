export function detectLocation(title){

const places = [

"Mexico",
"Meksika",
"Cairo",
"Kahire",
"Medina",
"Medine",
"Mecca",
"Mekke",
"Riyadh",
"Riyad",
"Puerto Rico",
"Porto Riko",
"California",
"USA",
"ABD"

]

for(const p of places){

if(title.toLowerCase().includes(p.toLowerCase())){

return p

}

}

return null
}
