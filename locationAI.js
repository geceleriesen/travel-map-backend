import nlp from "compromise"

export function extractPlaces(text){

const doc = nlp(text)

const places = doc.places().out("array")

return places.map(p=>p.toLowerCase())

}
