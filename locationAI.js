import { cities } from "./cities.js"

export function detectLocation(text){

const clean = text.toLowerCase()

for(const city of cities){
if(clean.includes(city)) return city
}

// detect flag emojis
const flags = {
"🇹🇷":"turkey",
"🇪🇬":"egypt",
"🇲🇽":"mexico",
"🇨🇳":"china",
"🇵🇷":"puerto rico",
"🇯🇵":"japan",
"🇹🇭":"thailand"
}

for(const flag in flags){
if(text.includes(flag)) return flags[flag]
}

return null
}
