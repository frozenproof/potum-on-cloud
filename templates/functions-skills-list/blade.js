
function calcHammerSlamConstant(level, result) {
    result.innerHTML = `<li><b>Skill Constant:</b> 100</li>`
}

function calcHammerSlamMultiplier(level, strValue, vitValue, result) {
    var multiplier = 1 + (0.05 * level) + strValue / 500 + vitValue / 100

    function rounding(value) {
        if (value - Math.floor(value * 100) / 100 < 0.00999999) { value = Math.floor(value * 100) / 100 }
        else { value = Math.round(value * 100) / 100 }
        return value
    }

    multiplier = rounding(multiplier)
    result.innerHTML += `<li><b>Skill Multiplier:</b> ${multiplier}</li><br>`
}

function calcHammerSlamSecondHitRange(result) {
    result.innerHTML += `<li><b>Hit Range (radius):</b> 2.5m, around the <b>main target's position on cast</b></li>`
}

function addHammerSlamSkillInfo(interrupt, result) {
    var HTML = ``
    if (interrupt) { HTML += `<li>This skill will <b>always deal critical hits</b></li>` }
    HTML += `<li>Gains the following effects upon using this skill consecutively (the last skill used is also this skill):<ul>
    <li>&nbsp&nbsp&nbsp- This skill's MP Cost becomes 0</li>
    <li>&nbsp&nbsp&nbsp- This skill's proration is changed to <b>Normal Attack Proration</b></li>
    <li>&nbsp&nbsp&nbsp- This skill becomes <b>unaffected by any Proration modifiers</b></li>
    </ul></li>
    <li><b>Effect Duration:</b> Until another skill is used</li>`
    result.innerHTML += HTML
}

function addHammerSlamExtraInfo(result) {
    result.innerHTML += `<br><b>Extra info:</b>
    <li>This skill's <b>maximum cast range</b> is equal to the maximum auto attack range of the <b>main weapon</b></li>
    <li>This skill can only be used as Combo Start if its MP Cost is not 0</li>
    <li>This skill uses <b>Physical Proration</b> for its damage calculation and inflicts <b>Physical Proration</b>; these change to <b>not uses any Proration modifiers at all</b> and inflicts <b>Normal Attack Proration</b>, respectively, when used consecutively</li>`
}

function calcHammerSlamValues() {
    var levelSelector = document.getElementById("hammerSlamLevel")
    var level = levelSelector[levelSelector.selectedIndex].value
    var strValue = document.getElementById("hammerSlamStrValue").value
    var vitValue = document.getElementById("hammerSlamVitValue").value
    var interrupt = document.getElementById("hammerSlamFTS").checked
    var result = document.getElementById("hammerSlamValues")
    calcHammerSlamConstant(level, result)
    calcHammerSlamMultiplier(level, strValue, vitValue, result)
    calcHammerSlamSecondHitRange(result)
    addHammerSlamSkillInfo(interrupt, result)
    addHammerSlamExtraInfo(result)
}

calcHammerSlamValues()

function calcCleavingAttackConstant(level, vitValue, result) {
    var constant = 150 + 15 * level + vitValue * 1
    result.innerHTML = `<li><b>Skill Constant:</b> ${constant}</li>`
}

function calcCleavingAttackMultiplier(level, strValue, enemyCount, result) {
    var multiplier = 1.5 + (0.1 * level) + (strValue * Math.max(0, enemyCount - 1)) / 200
    if (multiplier - Math.floor(multiplier * 100) / 100 < 0.00999999) { multiplier = Math.floor(multiplier * 100) / 100 }
    else { multiplier = Math.round(multiplier * 100) / 100 }
    result.innerHTML += `<li><b>Skill Multiplier:</b> ${multiplier}</li><br>`
}

function calcCleavingAttackSecondHitRange(result) {
    result.innerHTML += `<li><b>Hit Range (radius):</b> same as the maximum auto attack range of the <b>main weapon</b>, around the <b>caster</b></li>`
}

function addCleavingAttackSkillInfo(enemyCount, result) {
    var mp = Math.max(0, enemyCount - 1) * 100
    if (mp > 0) { result.innerHTML += `<li>Recovers <b>either ${mp} MP or the total MP Cost of this skill</b> (whichever is lower) upon successful cast</li>` }
}

function addCleavingAttackExtraInfo(enemyCount, result) {
    var HTML = `<br><b>Extra info</b>
    <li>This skill's <b>maximum cast range</b> is equal to the maximum auto attack range of the <b>main weapon</b></li>`
    if (enemyCount > 1) { HTML += `<li>As stated, this skill's MP recovery effect <b>cannot recover more MP than this skill's own cost on cast</b>; for example, if its MP Cost became 0 due to certain effects (e.g. <b>Save Combo tag</b>), it will not recover any MP at all</li>` }
    result.innerHTML += HTML
}

function calcCleavingAttackValues() {
    var levelSelector = document.getElementById("cleavingAttackLevel")
    var level = levelSelector[levelSelector.selectedIndex].value
    var strValue = document.getElementById("cleavingAttackStrValue").value
    var vitValue = document.getElementById("cleavingAttackVitValue").value
    var enemyCount = document.getElementById('cleavingAttackEnemyCount').value
    var result = document.getElementById("cleavingAttackValues")
    calcCleavingAttackConstant(level, vitValue, result)
    calcCleavingAttackMultiplier(level, strValue, enemyCount, result)
    calcCleavingAttackSecondHitRange(result)
    addCleavingAttackSkillInfo(enemyCount, result)
    addCleavingAttackExtraInfo(enemyCount, result)
}

calcCleavingAttackValues()


function calcMaxStackStormBlaze(dexValue, stackInput) {
    var maxStack = 10 + dexValue / 25
    if (maxStack - Math.floor(maxStack) < 0.999999999999) { maxStack = Math.floor(maxStack) } else { maxStack = Math.round(maxStack) } if (stackInput.value > maxStack) { stackInput.value = maxStack }
    stackInput.max = maxStack
}

function calcStormBlazeConstant(level, vitValue, result) {
    var constant = 100 + 10 * level + vitValue * 1
    result.innerHTML = `<li><b>Skill Constant: </b> ${constant}</li>`
}

function calcStormBlazeMultiplier(level, stack, result) {
    var multiplier = (0.5 + 0.05 * level) * stack
    if (multiplier - Math.floor(multiplier * 100) / 100 < 0.00999999) { multiplier = Math.floor(multiplier * 100) / 100 } else { multiplier = Math.round(multiplier * 100) / 100 } result.innerHTML += `<li><b>Skill Multiplier:</b> ${multiplier}</li>`
}

function calcStormBlazeSecondHitRange(stack, result) {
    var radius = Math.floor(2 + 0.4 * stack)
    if (stack > 0) {
        result.innerHTML += `<br>
        <li><b>Hit Range (radius):</b> length of 16m and radius of ${radius}m; from the <b>caster</b> toward the <b>main
                target</b></li>`}
}

function addStormBlazeSkillEffect(stackInput, stack, result) {
    var mp = stack * stack * 3
    var HTML = `<br><b>Buff Effect:</b>
        <li>Gains stacks upon performing the following actions; can stack up to a maximum of <b>${stackInput.max}
                stacks</b>
            <ul>
                <li>&nbsp&nbsp&nbsp- Gains 1 stack for each <b>auto attack</b> or <b>consecutive mode Hammer Slam</b>
                </li>
                <li>&nbsp&nbsp&nbsp- Gains 2 stacks for each <b>auto attack during Rampage buff</b></li>
            </ul>
        </li>
        <li>Upon casting this skill,`
    if (stack > 0) {
        HTML += ` <b>consumes ${stack} stack`
        if (stack != 1) { HTML += `s` }
        HTML += `</b> to launch a linear attack, and recovers ${mp} MP`
    }
    else { HTML += ` <b>nothing happens</b>, and the caster will look confused` }
    HTML += `</li>
        <li><b>Buff Duration:</b> Until all stacks are used up</li>`
    result.innerHTML += HTML
}

function addStormBlazeExtraInfo(result) {
    var HTML = `<br><b>Extra info</b>
        <li>This skill's <b>maximum cast range</b> is equal to the maximum auto attack range of the <b>main weapon</b>
        </li>`
    result.innerHTML += HTML
}

function calcStormBlazeValues() {
    var levelSelector = document.getElementById("stormBlazeLevel")
    var level = levelSelector[levelSelector.selectedIndex].value
    var dexValue = document.getElementById("stormBlazeDexValue").value
    var vitValue = document.getElementById("stormBlazeVitValue").value
    var stackInput = document.getElementById('stormBlazeEnemyCount')
    var stack = Math.min(10, stackInput.value)
    var result = document.getElementById("stormBlazeValues")
    calcMaxStackStormBlaze(dexValue, stackInput)
    calcStormBlazeConstant(level, vitValue, result)
    calcStormBlazeMultiplier(level, stack, result)
    calcStormBlazeSecondHitRange(stack, result)
    addStormBlazeSkillEffect(stackInput, stack, result)
    addStormBlazeExtraInfo(result)
}

calcStormBlazeValues()
function addGardeBladeSkillEffect(level, vitValue, result) {
    var guard = level * 2.5 + vitValue / 100
    if (guard - Math.floor(guard) < 0.009999999999) { guard = Math.floor(guard * 100) / 100 }
    else { guard = Math.round(guard * 100) / 100 }
    var HTML = `<b>Skill Effect:</b> Recovers your <b>Guard gauge</b> by ${guard} units and grants <b>Garde Blade buff</b> to the <b>caster</b> upon successful cast; can only recover the <b>Guard gauge</b> until 100 units, and the recovery only applies if <b>Garde Blade buff</b> is not active<br><br>
    <b>Buff Effect:</b><br>`
    result.innerHTML = HTML
}

function addGardeBladeBuffEffect(level, result) {
    var ATK = 1 * level
    result.innerHTML += `<li>Allows <b>Main Weapon's Refinement Level</b> to grant damage reduction the same as that of a <b>Shield</b> while the buff is active</li>
    <li><b>Physical & Magic Resistance</b> +${level}%</li>
    <li>Upon <b>Perfect Guard</b>, negate any [Flinch], [Tumble], [Stun] or [Knockback] that comes with the blocked hit</li>
    <li><b>Buff Duration:</b> 70 seconds OR until you get [Guard Break]</li>`
}

function addGardeBladeExtraInfo(result) {
    result.innerHTML += `<br><b>Extra info:</b>
    <li><b>Perfect Guard</b> (or <b>"perfectly timed" Manual Guard</b>) refers to the short duration at the start of Manual Guard motion, during when Guard gauge consumption upon taking any hit is halved</li>
    <li>This skill <b>cannot be cast</b> if you have [Guard Break]</li>`
}

function calcGardeBladeValues() {
    var levelSelector = document.getElementById("gardeBladeLevel")
    var level = levelSelector[levelSelector.selectedIndex].value
    var vitValue = document.getElementById("gardeBladeVitValue").value
    var result = document.getElementById("gardeBladeValues")
    addGardeBladeSkillEffect(level, vitValue, result)
    addGardeBladeBuffEffect(level, result)
    addGardeBladeExtraInfo(result)
}

calcGardeBladeValues()

function calcOgreSlashConstant(level, dexValue, result) {
    result.innerHTML = `<li><b>Skill Constant (First Hit):</b> ${dexValue * 1}</li>
			<li><b>Skill Constant (Second Hit):</b> 500</li>`
}

function calcOgreSlashMultiplier(level, strValue, vitValue, stack, pPierce, result) {
    var multiplier1 = strValue / 100 + vitValue / 100 + Math.max(0, stack * 10 + pPierce * 1 - 100) / 100
    if (multiplier1 - Math.floor(multiplier1 * 100) / 100 < 0.00999999) { multiplier1 = Math.floor(multiplier1 * 100) / 100 }
    else { multiplier1 = Math.round(multiplier1 * 100) / 100 }
    var multiplier2 = 2 * Math.min(10, stack)
    result.innerHTML += `<li><b>Skill Multiplier (First Hit):</b> ${multiplier1}</li>
			<li><b>Skill Multiplier (Second Hit):</b> ${multiplier2}</li>
			<li><b>Hit Count:</b> up to 2 hits on the main target; 1 hit on all other targets; damage calculation is done for each hit</li>`
}

function calcOgreSlashSecondHitRange(result) {
    result.innerHTML += `<br><li><b>Second Hit Range (radius):</b> 2m, around the <b>main target's position on cast</b></li>`
}

function addOgreSlashSkillEffect(stack, pPierce, result) {
    var skillPp = Math.min(100, stack * 10, 100 - pPierce)
    var HTML = ``
    if (skillPp > 0) { HTML += `<li><b>Physical Pierce</b> of <b>Ogre Slash</b> +${skillPp}%</li>` }
    HTML += `<li>Negate all [Flinch], [Tumble], [Stun] or [Knockback] you would have taken during this skill's animation</li>`
    result.innerHTML += HTML
}

function addOgreSlashPassiveEffect(level, stack, result) {
    var iniGain = Math.floor(level / 2)
    var iniStack = `${iniGain} stack`
    if (iniGain != 1) { iniStack += `s` }
    var HTML = `<br><b>Passive Buff Effect:</b>
			<li>Gains stacks upon performing the following actions; can stack up to a maximum of <b>20 stacks</b><ul>`
    if (iniGain > 0) { HTML += `<li>&nbsp&nbsp&nbsp- Gains ${iniStack} stack upon <b>being the one to initiate combat</b></li>` }
    HTML += `<li>&nbsp&nbsp&nbsp- Gains 1 stack upon <b>receiving an AOE attack warning</b></li>
			<li>&nbsp&nbsp&nbsp- Gains 1 stack upon <b>taking attack damage</b></li>
			<li>&nbsp&nbsp&nbsp- Gains 1 stack upon <b>Perfect Guard</b></li>
			</ul></li>
			<li>Upon casting this skill,`
    if (stack > 0) {
        HTML += ` <b>consumes ${Math.min(10, stack)} stack`
        if (stack != 1) { HTML += `s` }
        HTML += `</b> to <b>enhance the skill</b>, and`
    }
    HTML += ` grants <b>Ogre Slash active buff</b> to the <b>caster</b></li>
			<li><b>Stack Duration:</b> Until all stacks are used up</li>`
    result.innerHTML += HTML
}

function addOgreSlashBuffEffect(level, result) {
    var duration = 3 + level * 2
    function calcHeal() {
        let mpCost = document.getElementById("ogreSlashMpBarCost").value
        let heal = mpCost * mpCost * 100
        document.getElementById("ogreHeal").innerHTML = heal
    }
    HTML = `<br><b>Active Buff Effect:</b>
			<li>Damage of <b>Rampage Auto Attacks</b> and <b>Rampage Finish Blow</b> are <b>doubled</b></li>
			<li><b>DEF, MDEF and Stability Penalties</b> of <b>Berserk</b> are <b>halved</b></li>
			<li>Upon consuming MP, <b>the caster recovers HP</b> by an amount equals to [(MP Bars consumed)^2 × 100]
			<li><b>Buff Duration:</b> ${duration} seconds</li>`
    result.innerHTML += HTML
}

function addOgreSlashExtraInfo(result) {
    var HTML = `<br><b>Extra info</b>
			<li>This skill's <b>maximum cast range</b> is equal to the maximum auto attack range of the <b>main weapon</b></li>
			<li>If this skill is used to initiate combat, existing stack(s) will be comsumed first before the stack gaining effect is applied</li>`
    result.innerHTML += HTML
}

function calcOgreSlashValues() {
    var levelSelector = document.getElementById("ogreSlashLevel")
    var level = levelSelector[levelSelector.selectedIndex].value
    var strValue = document.getElementById("ogreSlashStrValue").value
    var vitValue = document.getElementById("ogreSlashVitValue").value
    var dexValue = document.getElementById("ogreSlashDexValue").value
    var stackInput = document.getElementById('ogreSlashEnemyCount')
    var stack = Math.min(10, stackInput.value)
    var pPierce = document.getElementById("ogreSlashPhysicalPierce").value
    var result = document.getElementById("ogreSlashValues")
    calcOgreSlashConstant(level, dexValue, result)
    calcOgreSlashMultiplier(level, strValue, vitValue, stack, pPierce, result)
    calcOgreSlashSecondHitRange(result)
    addOgreSlashSkillEffect(stack, pPierce, result)
    addOgreSlashPassiveEffect(level, stack, result)
    addOgreSlashBuffEffect(level, result)
    addOgreSlashExtraInfo(result)
}

calcOgreSlashValues()

function calcHardHitConstant(level, result) {
    var constant = Math.floor(50 + 5*level)
    result.innerHTML = `<li><b>Skill Constant:</b> ${constant}</li>`
}

function calcHardHitMultiplier(level, registlet, weapon, result) {
    var multiplier = 1 + (0.05 * level) + (0.05 * registlet)
    if (weapon == "2H") {multiplier += 0.5}
    if (multiplier - Math.floor(multiplier*100)/100 < 0.0099) {multiplier = Math.floor(multiplier*100)/100}
    else {multiplier = Math.round(multiplier*100)/100}
    result.innerHTML += `<li><b>Skill Multiplier:</b> ${multiplier}</li><br>`
}

function calcAilmentChanceHardHit(level, weapon, result) {
    var chance = 5
    //The next "if" is pretty much required; the game uses a weird function called Math.RoundToInt, and only for Hard Hit; go figure why
    //If the number has no decimal, there's nothing left to do
    if(4.5 * level == (4.5 * level).toFixed(0)) {
          chance += parseInt((4.5 * level).toFixed(0), 10)
        //If the decimal part is equal to 0.5 (it will be either 0 or 0.5), then the game rounds it up or down to the nearest even number
    }
    else if((4.5 * level).toFixed(0) % 2 == 0) {
        //Checking if the rounded up number is even
        chance += parseInt((4.5 * level).toFixed(0), 10)
    } 
    else {
        //If it's odd, then round it down
        chance += parseInt((4.5 * level).toFixed(0)) - 1
    }
    
    if(weapon == "1H") {chance += 50}
    result.innerHTML += `<li><b>Flinch Chance:</b> ${chance}%</li>`
}

function addHardHitAilmentInfo(result) {
    result.innerHTML += `<li><b>Flinch Duration:</b> 2 seconds</li>
    <li><b>Resistance Duration on Difficulties:</b> 3 second (<b>Easy</b> and <b>Normal</b>); 5 seconds (<b>Hard</b>); 8 seconds (<b>Nightmare</b>); 11 seconds (<b>Ultimate</b>)</li>`
}

function addHardHitExtraInfo(result) {
    result.innerHTML += `<br><b>Extra info:</b>
    <li><b>Ailment Resistance Duration</b> starts upon successfully inflicting the corresponding ailment; most ailments have the same resistance duration as their own duration, unless stated otherwise</li>
    <li>This skill's <b>maximum cast range</b> is equal to the maximum auto attack range of the <b>main weapon</b></li>`
}

function calcHardHitValue(){
    let weaponSelector = document.getElementById("hardHitWeapon")
    let weapon = weaponSelector[weaponSelector.selectedIndex].value
    let levelSelector = document.getElementById("hardHitLevel")
    let level = levelSelector[levelSelector.selectedIndex].value
    let registletSelector = document.getElementById("hardHitRegistlet")
    let registlet = registletSelector[registletSelector.selectedIndex].value
    let result = document.getElementById("hardHitValue")
    calcHardHitConstant (level, result)
    calcHardHitMultiplier(level, registlet, weapon, result)
    calcAilmentChanceHardHit(level, weapon, result)
    addHardHitAilmentInfo(result)
    addHardHitExtraInfo(result)
}

calcHardHitValue();
