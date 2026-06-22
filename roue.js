const prizes = [

"👑 Reine",
"🥜 Tribunal",
"📺 Pub",
"🤐 Silence",
"🎮 Tekken",
"📰 News",
"🌶️ Piment",
"📞 Appel",
"😂 Chat",
"🎲 Défi",
"💀 Double",
"🔄 ReSpin"

];

const colors = [

"#d4af37",
"#0f8f0f",
"#c62828",
"#1f4fa3",
"#7b1fa2",
"#d4af37",

"#0f8f0f",
"#c62828",
"#1f4fa3",
"#7b1fa2",
"#d4af37",
"#0f8f0f"

];

let currentRotation = 0;

function spinWheel(index){

const angleSize = 360 / prizes.length;

const target =
3600 +
(360 - (index * angleSize + angleSize/2));

currentRotation += target;

document.getElementById("wheelGroup").style.transition =
"transform 8s cubic-bezier(.1,.9,.2,1)";

document.getElementById("wheelGroup").style.transform =
`rotate(${currentRotation}deg)`;

}

createWheel();
