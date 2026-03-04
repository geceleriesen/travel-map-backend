const cities = [

"Mexico City",
"Cairo",
"Giza",
"Sakkara",
"Medina",
"Mecca",
"Riyadh",
"Puerto Rico",
"California",
"Las Vegas",
"New York",
"Los Angeles",
"San Diego",
"Bangkok",
"Dubai",
"Doha",
"Istanbul",
"Paris",
"London",
"Rome"

]

export function detectLocation(text){

text = text.toLowerCase()

for(const city of cities){

if(text.includes(city.toLowerCase())){

return city

}

}

return null

}
