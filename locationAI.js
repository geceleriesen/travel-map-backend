export function detectLocation(text){

text = text.toLowerCase()

const words = text
.replace(/[^\w\s]/g," ")
.split(/\s+/)

for(const word of words){

if(word.length < 4) continue

if(
word.includes("istanbul") ||
word.includes("cairo") ||
word.includes("mexico") ||
word.includes("tokyo") ||
word.includes("paris") ||
word.includes("rome") ||
word.includes("bangkok") ||
word.includes("bali") ||
word.includes("dubai")
){
return word
}

}

const flag = text.match(/🇹🇷|🇪🇬|🇲🇽|🇵🇷|🇨🇳|🇯🇵/)

if(flag) return flag[0]

return null
}
