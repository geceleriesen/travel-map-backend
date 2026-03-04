export function detectCity(text){

const t = text.toLowerCase()

if(t.includes("porto rico")) return "puerto_rico"
if(t.includes("puerto rico")) return "puerto_rico"

if(t.includes("mexico")) return "mexico"
if(t.includes("meksika")) return "mexico"

if(t.includes("cairo")) return "cairo"
if(t.includes("kahire")) return "cairo"

if(t.includes("giza")) return "giza"
if(t.includes("sakkara")) return "saqqara"
if(t.includes("saqqara")) return "saqqara"

if(t.includes("medine")) return "medina"
if(t.includes("medina")) return "medina"

if(t.includes("mekke")) return "mecca"
if(t.includes("mecca")) return "mecca"

if(t.includes("riyad")) return "riyadh"
if(t.includes("riyadh")) return "riyadh"

return null

}
