const cities=[

"mexico",
"mexico city",
"cairo",
"giza",
"riyadh",
"medina",
"mecca",
"istanbul",
"paris",
"london",
"new york",
"los angeles",
"tokyo",
"dubai",
"rome"

]


export function detectCity(text){

text=text.toLowerCase()

for(const c of cities){

if(text.includes(c)) return c

}

return "unknown"

}
