export function detectLocation(text){

const t = text.toLowerCase()

const cities = [

["puerto rico",18.2208,-66.5901],
["porto rico",18.2208,-66.5901],

["mexico",19.4326,-99.1332],
["meksika",19.4326,-99.1332],

["cairo",30.0444,31.2357],
["kahire",30.0444,31.2357],

["giza",29.9773,31.1325],
["gize",29.9773,31.1325],

["saqqara",29.8711,31.2165],
["sakkara",29.8711,31.2165],

["medina",24.5247,39.5692],
["medine",24.5247,39.5692],

["mecca",21.3891,39.8579],
["mekke",21.3891,39.8579],

["riyadh",24.7136,46.6753],
["riyad",24.7136,46.6753],

["usa",37.0902,-95.7129],
["amerika",37.0902,-95.7129]

]

for(const c of cities){

if(t.includes(c[0])){

return {

name:c[0],
lat:c[1],
lng:c[2]

}

}

}

return null

}
