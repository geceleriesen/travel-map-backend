export function detectCity(title){

const t = title.toLowerCase()

if(t.includes("giza")) return "giza"
if(t.includes("sakkara")) return "saqqara"
if(t.includes("saqqara")) return "saqqara"

if(t.includes("kahire")) return "cairo"
if(t.includes("cairo")) return "cairo"

if(t.includes("medine")) return "medina"
if(t.includes("medina")) return "medina"

if(t.includes("mekke")) return "mecca"
if(t.includes("mecca")) return "mecca"

if(t.includes("riyad")) return "riyadh"
if(t.includes("riyadh")) return "riyadh"

if(t.includes("mexico")) return "mexico"
if(t.includes("meksika")) return "mexico"

if(t.includes("porto rico")) return "puerto rico"
if(t.includes("puerto rico")) return "puerto rico"

return null
}
