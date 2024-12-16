
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
    var constant = Math.floor(50 + 5 * level)
    result.innerHTML = `<li><b>Skill Constant:</b> ${constant}</li>`
}

function calcHardHitMultiplier(level, registlet, weapon, result) {
    var multiplier = 1 + (0.05 * level) + (0.05 * registlet)
    if (weapon == "2H") { multiplier += 0.5 }
    if (multiplier - Math.floor(multiplier * 100) / 100 < 0.0099) { multiplier = Math.floor(multiplier * 100) / 100 }
    else { multiplier = Math.round(multiplier * 100) / 100 }
    result.innerHTML += `<li><b>Skill Multiplier:</b> ${multiplier}</li><br>`
}

function calcAilmentChanceHardHit(level, weapon, result) {
    var chance = 5
    //The next "if" is pretty much required; the game uses a weird function called Math.RoundToInt, and only for Hard Hit; go figure why
    //If the number has no decimal, there's nothing left to do
    if (4.5 * level == (4.5 * level).toFixed(0)) {
        chance += parseInt((4.5 * level).toFixed(0), 10)
        //If the decimal part is equal to 0.5 (it will be either 0 or 0.5), then the game rounds it up or down to the nearest even number
    }
    else if ((4.5 * level).toFixed(0) % 2 == 0) {
        //Checking if the rounded up number is even
        chance += parseInt((4.5 * level).toFixed(0), 10)
    }
    else {
        //If it's odd, then round it down
        chance += parseInt((4.5 * level).toFixed(0)) - 1
    }

    if (weapon == "1H") { chance += 50 }
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

function calcHardHitValue() {
    let weaponSelector = document.getElementById("hardHitWeapon")
    let weapon = weaponSelector[weaponSelector.selectedIndex].value
    let levelSelector = document.getElementById("hardHitLevel")
    let level = levelSelector[levelSelector.selectedIndex].value
    let registletSelector = document.getElementById("hardHitRegistlet")
    let registlet = registletSelector[registletSelector.selectedIndex].value
    let result = document.getElementById("hardHitValue")
    calcHardHitConstant(level, result)
    calcHardHitMultiplier(level, registlet, weapon, result)
    calcAilmentChanceHardHit(level, weapon, result)
    addHardHitAilmentInfo(result)
    addHardHitExtraInfo(result)
}

calcHardHitValue();

function calcAstuteMpCost(weapon, result) {
    var cost = 200
    if (weapon == "1H") { cost -= 100 }
    result.innerHTML = `<li><b>MP Cost:</b> ${cost}</li>`
}

function calcAstuteConstant(level, result) {
    var constant = Math.floor(150 + 5 * level)
    result.innerHTML += `<li><b>Skill Constant:</b> ${constant}</li>`
}

function calcAstuteMultiplier(level, weapon, result) {
    var multiplier = 1.5 + (0.1 * level)
    if (weapon == "2H") { multiplier += 0.5 }
    result.innerHTML += `<li><b>Skill Multiplier:</b> ${multiplier}</li>`
}

function calcAstuteMotionSpeed(level, result) {
    var motionSpeed = 5 * level
    result.innerHTML += `<br><li><b>Motion Speed</b> of <b>Astute</b> +${motionSpeed}%</li>`
}

function calcAstuteBuffEffect(level, weapon, result) {
    var crit = 25
    var duration = 5
    if (weapon == "2H") { crit *= 2 }
    if (level > 5) { duration *= 2 }
    result.innerHTML += `<li>Grants <b>Astute buff</b> upon successful cast</li>
    <br><b>Buff Effect:</b>
    <li><b>Critical Rate</b> +${crit}</li>
    <li><b>Buff Duration:</b> ${duration} seconds</li>`
}

function calcAstuteValues() {
    let weaponSelector = document.getElementById("astuteWeapon")
    let weapon = weaponSelector[weaponSelector.selectedIndex].value
    let levelSelector = document.getElementById("astuteLevel")
    let level = levelSelector[levelSelector.selectedIndex].value
    let result = document.getElementById("astuteValues")
    calcAstuteMpCost(weapon, result)
    calcAstuteConstant(level, result)
    calcAstuteMultiplier(level, weapon, result)
    calcAstuteMotionSpeed(level, result)
    calcAstuteBuffEffect(level, weapon, result)
    result.innerHTML += `<br>This skill's <b>maximum cast range</b> is equal to the maximum auto attack range of the <b>main weapon</b>`

}
calcAstuteValues()

function calcTriggerSlashMpCost(level, result) {
    var cost = 300
    if (level > 5) { cost -= 100 }
    result.innerHTML = `<li><b>MP Cost:</b> ${cost}</li>`
}

function calcTriggerSlashConstant(level, result) {
    var constant = 200 + 10 * level
    result.innerHTML += `<li><b>Skill Constant:</b> ${constant}</li>`
}

function calcTriggerSlashMultiplier(level, weapon, result) {
    var skillMultiplier = 1.5 + (0.05 * level)
    if (weapon == "2H") { skillMultiplier += 1 }
    result.innerHTML += `<li><b>Skill Multiplier:</b> ${skillMultiplier}</li>`
}

function addTriggerSkillEffect(weapon, registlet, result) {
    var element = ``
    if (registlet) { element = `Weapon Dependent` }
    else { element = `Fire` }
    var HTML = `<li><b>Element:</b> ${element}</li><br>`
    if (weapon == "1H") { HTML += `<li>This skill has the <b>Perfect Aim</b> attribute: it cannot [Miss] or [Graze], but can be [Evaded]</li>` }
    HTML += `<li>Grants <b>Trigger Slash buff</b> upon successful cast</li>`
    result.innerHTML += HTML
}

function calcTriggerBuffEffect(level, result) {
    var AMPR = 2 * level
    result.innerHTML += `<br><b>Buff Effect:</b>
					<li><b>Attack MP Recovery</b> +${AMPR}</li>
					<li>Sets the next skill's <b>Motion Speed</b> to +50%; <b>overrides</b> other <b>Motion Speed</b> effects such as <b>[Freeze]</b>, <b>Swift combo tag</b>, or <b>Chain Cast</b></li>
					<li><b>Buff Duration:</b> Until a skill is used</li>`
}

function calcTriggerValues() {
    var weaponSelector = document.getElementById("triggerWeapon")
    var weapon = weaponSelector[weaponSelector.selectedIndex].value
    var levelSelector = document.getElementById("triggerLevel")
    var level = levelSelector[levelSelector.selectedIndex].value
    var registlet = document.getElementById("triggerSlashElement").checked
    var result = document.getElementById("triggerValues")
    calcTriggerSlashMpCost(level, result)
    calcTriggerSlashConstant(level, result)
    calcTriggerSlashMultiplier(level, weapon, result)
    addTriggerSkillEffect(weapon, registlet, result)
    calcTriggerBuffEffect(level, result)
    result.innerHTML += `<br>This skill's <b>maximum cast range</b> is equal to the maximum auto attack range of the <b>main weapon</b>`
}

calcTriggerValues()

function calcRampageAutoAttack(level, registlet, weapon, result) {
    var constantAA = Math.floor(10 * level)
    var skillMultiplierAA = 0.1 + (0.04 * level)
    if (weapon != "2H") { skillMultiplierAA += 0.05 * level }
    skillMultiplierAA = Math.round(skillMultiplierAA * 100) / 100

    var atkCount = ``
    var dualMod = ``
    var hitCount = 4
    if (registlet > 0) { atkCount += `Next 11` }
    else { atkCount += `First 10` }
    if (weapon == "DW") {
        dualMod = `, <font style = 'color: #C70039'>only apply to main hand damage</font style>`
        hitCount = 7
    }
    var HTML = `<li><b>${atkCount} Auto Attacks Skill Constant</b> +${constantAA}; total constant increase for all hits of 1 auto attack${dualMod}</li>
    <li><b>${atkCount} Auto Attacks Skill Multiplier</b> +${skillMultiplierAA}; total multiplier increase for all hits of 1 auto attack${dualMod}</li>
    <li><b>${atkCount} Auto Attacks Hit Count:</b> ${hitCount} hits; damage calculation is done once then spread evenly between the hits`
    if (weapon == "DW") { HTML += ` alongside the sub-hand damage` }
    HTML += `</li>`
    result.innerHTML = HTML
}

function calcRampageFinalHit(level, registlet, weapon, result) {
    var constantFinal = Math.floor(300 + 20 * level)

    var skillMultiplierFinal1 = 0.5 + (0.05 * level)
    var skillMultiplierFinal2 = 2.5 + (0.05 * level)
    var heal = 50 * registlet

    if (weapon == "2H") {
        skillMultiplierFinal1 += 1
        skillMultiplierFinal2 += 3
    }
    skillMultiplierFinal1 = Math.round(skillMultiplierFinal1 * 100) / 100

    if (registlet == 0) {
        result.innerHTML += `<li><b>Final Attack Skill Constant: </b> ${constantFinal}; constant for each hit</li>
    <li><b>Final Attack Skill Multiplier (First 2 hits): </b> ${skillMultiplierFinal1}; multiplier for each hit<br>
    <li><b>Final Attack Skill Multiplier (Third hit): </b> ${skillMultiplierFinal2}<br>
    <li><b>Final Attack Hit Count:</b> 3 hits; damage calculation is done for each hit</li>`}
    else { result.innerHTML += `<li><b>HP restore after the 11th Auto Attack:</b> ${heal}</li>` }
}

function addRampageSkillInfo(result) {
    result.innerHTML += `<br><b>Skill Effect:</b> Grants <b>Rampage buff</b> with 11 stacks to the caster upon cast; each auto attack will consume 1 stack upon hitting a target<br>`
}

function addRampageBuffInfo(level, registlet, weapon, result) {
    var ampr = Math.floor(2.5 * level)
    var atkCount = 10
    if (registlet > 0) { atkCount += 1 }
    var HTML = `<br><b>Buff Effects:</b></li>
	<li>Sets the caster's <b>DEF</b>, <b>MDEF</b> and <b>Dodge</b> to 0 (<b>overrides all other DEF, MDEF and Dodge modifiers</b>) and deactivates <b>Power Wave</b> while the buff is active</li>
	<li>Enhances the caster's next ${atkCount} auto attacks and change their hit counts</li>
	<li><b>Attack MP Recovery</b> +${ampr}`
    if (weapon == "DW") { HTML += `; <font style = 'color: #C70039'><b>not doubled</b> by Dual Swords effect</font></li>` }
    HTML += `</li>`
    result.innerHTML += HTML
}

function addRampageFinalAttackInfo(registlet, result) {
    if (registlet == 0) {
        result.innerHTML += `<li>Replaces the 11th auto attack with an uncancellable "Final Attack" that is treated as a <b>Physical skill</b> with <b>Perfect Aim attribute</b>:
	<ul><li>&nbsp&nbsp&nbsp- It <b>inflicts physical proration</b> and <b>consumes buffs that apply to the next skill</b>; however, it is unaffected by <b>Whack</b>, <b>Short Range Damage</b> stat and <b>Sword Techniques</b></li>
	<li>&nbsp&nbsp&nbsp- It cannot [Miss] or [Graze], but can be [Evaded] (its damage is reduced to 1 instead of being fully evaded)</li>
	<li>&nbsp&nbsp&nbsp- It is unaffected by <b>Motion Speed</b> stat, but can be affected by [Freeze] and <b>Trigger Slash</b></li></ul></li>`}
    else { result.innerHTML += `<li>After the 11th auto attack, restore HP based on the level of <b>Remedial Rampage Registlet</b> equipped</li>` }
}

function addRampageBuffDuration(registlet, result) {
    var duration = 600;
    var whenFinalAttack = ""
    if (registlet == 0) { whenFinalAttack = "when the Final Attack ends" }
    else { whenFinalAttack = "after the 11th auto attack" }
    result.innerHTML += `<li><b>Buff Duration:</b> 10 minutes; the buff is also removed <b>${whenFinalAttack}</b> OR when inflicted with any ailment (the latter can be prevented with <b>Berserk's effect</b>)</li>`
}

function addRampageBuffLockInfo(result) {
    result.innerHTML += `<br><b>Extra info:</b>
	<li>This skill <b>cannot be recast</b> if the buff is active; it also <b>cannot be cast if another attack motion modifier skill is active</b> (e.g. <b>Dual Shields</b>,...)</li>
	<li>If this skill is in a <b>combo</b> and is not the first skill of that combo, the <b>combo will be temporarily disabled</b> as long as the buff is active</li>
	<li>Rampage Stack will not be consumed if your auto attack [Missed] or was [Evaded]</li>
	<li>This skill's total damage is <b>unaffected by Combo tags</b></li>`
}

function calcRampageValues() {
    var weaponSelector = document.getElementById("rampageWeapon")
    var weapon = weaponSelector[weaponSelector.selectedIndex].value
    var levelSelector = document.getElementById("rampageLevel")
    var level = levelSelector[levelSelector.selectedIndex].value
    var registletSelector = document.getElementById("rampageRegistlet")
    var registlet = registletSelector[registletSelector.selectedIndex].value
    var result = document.getElementById("rampageValues")
    calcRampageAutoAttack(level, registlet, weapon, result)
    calcRampageFinalHit(level, registlet, weapon, result)
    addRampageSkillInfo(result)
    addRampageBuffInfo(level, registlet, weapon, result)
    addRampageFinalAttackInfo(registlet, result)
    addRampageBuffDuration(registlet, result)
    addRampageBuffLockInfo(result)
}
calcRampageValues();


function weaponStrCheck(weapon, strSection) {
    if (weapon == "2H") { strSection.style = "display: block" }
    else { strSection.style = "display: none" }
}

function weaponDexCheck(weapon, dexSection) {
    if (weapon == "1H") { dexSection.style = "display: block" }
    else { dexSection.style = "display: none" }
}

function calcMeteorConstant(level, result) {
    var constant1 = Math.floor(400 + 20 * level)
    result.innerHTML = `<li><b>Skill Constant (First Hit): </b> ${constant1} </li>
    <li><b>Skill Constant (Second Hit): </b> 0</li>`
}

function calcMeteorMultiplier(level, weapon, strValue, dexValue, result) {
    var multiplier1 = 4 + (0.2 * level)
    var multiplier2 = 1 + (0.5 * level)
    if (weapon == "1H") { multiplier2 += dexValue / 200 }
    else if (weapon == "2H") { multiplier1 += 2 + strValue / 1000 }

    function rounding(value) {
        if (value - Math.floor(value * 100) / 100 < 0.00999999) { value = Math.floor(value * 100) / 100 }
        else { value = Math.round(value * 100) / 100 }
        return value
    }

    multiplier1 = rounding(multiplier1)
    multiplier2 = rounding(multiplier2)
    result.innerHTML += `<li><b>Skill Multiplier (First Hit):</b> ${multiplier1}</li>
    <li><b>Skill Multiplier (Second Hit):</b> ${multiplier2}</li>
    <li><b>Hit Count:</b> 2 hits on the main target; 1 hit on all other targets; damage calculation is done for each hit</li><br>`
}

function calcMeteorSecondHitRange(level, weapon, result) {
    var hitRange = 2 + Math.floor((level - 1) / 3) * 0.5
    result.innerHTML += `<li><b>Second Hit Range (radius):</b> ${hitRange}m, around the <b>main target's position on cast</b></li>`
}

function addMeteorInvincibleInfo(result) {
    result.innerHTML += `<li>Upon using this skill, gain [Invincible] for 2 seconds OR until you land</li>`
}

function calcMeteorDizzyChance(level, weapon, result) {
    var chance = Math.floor(2.5 * level)
    if (weapon != "2H") { chance += 75 }
    result.innerHTML += `<li class = 'skill-ailment'><b>Dizzy Chance (First Hit):</b> ${chance}%</li>
    <li><b>Dizzy Duration:</b> 10 seconds</li>`
}

function calcMeteorValues() {
    var weaponSelector = document.getElementById("meteorWeapon")
    var weapon = weaponSelector[weaponSelector.selectedIndex].value
    var levelSelector = document.getElementById("meteorLevel")
    var level = levelSelector[levelSelector.selectedIndex].value
    var strSection = document.getElementById("meteorStrInput")
    var strValue = document.getElementById("meteorStrValue").value
    var dexSection = document.getElementById("meteorDexInput")
    var dexValue = document.getElementById("meteorDexValue").value
    var result = document.getElementById("meteorValues");
    weaponStrCheck(weapon, strSection)
    weaponDexCheck(weapon, dexSection)
    calcMeteorConstant(level, result)
    calcMeteorMultiplier(level, weapon, strValue, dexValue, result)
    calcMeteorSecondHitRange(level, weapon, result);
    addMeteorInvincibleInfo(result);
    calcMeteorDizzyChance(level, weapon, result);
    result.innerHTML += `<br>This skill's <b>maximum cast range</b> is equal to the maximum auto attack range of the <b>main weapon</b>`
}

calcMeteorValues()

function shutOutWeaponDWCheck(weapon, agiSection) {
    if (weapon == "DW") {agiSection.style = "display: block"}
    else {agiSection.style = "display: none"}
}

function shutOutWeaponDexCheck(weapon, dexSection) {
    if (weapon == "1H") {dexSection.style = "display: block"}
    else {dexSection.style = "display: none"}
}

function calcShutOutConstant(weapon, result) {
    var constant = 100
    if (weapon == "DW") {constant += 100}
    result.innerHTML = `<li><b>Skill Constant:</b> ${constant}</li>`
}

function calcShutOutMultiplier(level, weapon, interrupt, dexValue, agiValue, result) {
    var multiplier1 = 5
    var multiplier2 = 10 + 1*level
    if (weapon == "1H") {
        multiplier1 += dexValue/200
        multiplier2 += 0.5 * level + dexValue/100
    }
    else if (weapon == "DW") {
        multiplier1 += agiValue/400
        multiplier2 += 0.5 * level + agiValue/200
    }
    else {multiplier1 += 1*level}
    
    function rounding(value) {
       if (value - Math.floor(value*100)/100 < 0.00999999) {value = Math.floor(value*100)/100}
        else {value = Math.round(value*100)/100}
        return value
    }

    multiplier1 = rounding(multiplier1)
    multiplier2 = rounding(multiplier2)
    var HTML = `<li><b>Skill Multiplier:</b> `
    if (interrupt) {HTML += multiplier2}
    else {HTML += multiplier1}
    HTML += `</li>`
    result.innerHTML += HTML
}

function addShutOutSkillEffect(weapon, interrupt, result) {
    if (weapon == "1H" && interrupt) {result.innerHTML += `<br><li><b>Total Physical Pierce</b> of this skill is <b>quadrupled</b></li>`}
    else if (weapon == "DW" && interrupt) {result.innerHTML += `<br><li><b>Total Physical Pierce</b> of this skill is <b>doubled</b></li>`}
    else if (weapon == "2H") {result.innerHTML += `<br><li>This skill is <b>unaffected by motion speed modifiers</b></li>`}
}

function calcShutOutBleedChance(interrupt, result) {
    if (interrupt) {result.innerHTML += `<li><b>Bleed Chance:</b> 100%</li>
    <li><b>Bleed Duration:</b> 10 seconds</li>`}
}

function addShutOutExtraInfo(result) {
    result.innerHTML += `<br>This skill's <b>maximum cast range</b> is equal to the maximum auto attack range of the <b>main weapon</b>`
}

function calcShutOutValues() {
    let weaponSelector = document.getElementById("shutOutWeapon")
    let weapon = weaponSelector[weaponSelector.selectedIndex].value
    let levelSelector = document.getElementById("shutOutSkillLevel")
    let level = levelSelector[levelSelector.selectedIndex].value
    let interrupt = document.getElementById("shutOutFTS").checked
    let dexSection = document.getElementById("shutOutDexInput")
    let dexValue = document.getElementById("shutOutDexValue").value
    let agiSection = document.getElementById("shutOutAgiInput")
    let agiValue = document.getElementById("shutOutAgiValue").value
    let result = document.getElementById("shutOutValues")
    shutOutWeaponDWCheck(weapon, agiSection)
    shutOutWeaponDexCheck(weapon, dexSection)
    calcShutOutConstant(weapon, result)
    calcShutOutMultiplier(level, weapon, interrupt, dexValue, agiValue, result)
    addShutOutSkillEffect(weapon, interrupt, result)
    calcShutOutBleedChance(interrupt, result)
    addShutOutExtraInfo(result)
}

calcShutOutValues()


function weaponComboCheck(weapon, comboSection) {
    if (weapon == "2H") {comboSection.style = "display: block"}
    else {comboSection.style = "display: none"}
}

function calcLunarSlashConstant(weapon, intValue, result) {
    var constant1 = 400
    var constant2 = intValue/2
    if (constant2 - Math.floor(constant2) < 0.9) {constant2 = Math.floor(constant2)}
    else {constant2 = Math.round(constant2)}
    var HTML = `<li><b>Skill Constant (First Hit):</b> ${constant1}</li>
    <li><b>Skill Constant (Magic Blade):</b> ${constant2}</li>`
    if (weapon == "2H") {HTML += `<li><b>Skill Constant (Additional Attack):</b> ${intValue}; constant for each hit</li>`}
    result.innerHTML = HTML
}

function calcLunarSlashMultiplier(level, weapon, strValue, comboCount, result) {
    var multiplier1 = 10
    var multiplier2 = strValue * level * 0.001
    if (multiplier2 - Math.floor(multiplier2*100)/100 < 0.00999999) {multiplier2 = Math.floor(multiplier2*100)/100}
    else {multiplier2 = Math.round(multiplier2*100)/100}
    var HTML = `<li><b>Skill Multiplier (First Hit):</b> ${multiplier1}</li>
    <li><b>Skill Multiplier (Magic Blade):</b> ${multiplier2}</li>`
    if (weapon == "2H") {HTML += `<li><b>Skill Multiplier (Additional Attack):</b> ${multiplier2}; multiplier for each hit</li>`}
    result.innerHTML += HTML
}

function addLunarSlashHitCount(weapon, comboCount, result) {
    var HTML = `<li><b>Hit Count:</b> 2 hits`
    if (weapon == "2H") {HTML += ` on the main target; 1 additional hit for each stack consumed`}
    HTML += `; damage calculation is done for each hit</li><br>`
    result.innerHTML += HTML
}

function calcLunarSlashFatigueChance(level, result) {
    var fatigue = 4 * level
    result.innerHTML += `<li><b>Fatigue Chance (Magic Blade):</b> ${fatigue}%</li>
    <li><b>Fatigue Duration:</b> 10 seconds</li>`
}

function addLunarSlashSkillEffect(level, weapon, crtValue, comboCount, result) {
    var stack = `stack`
    if (comboCount > 1) {stack += `s`}
    var cr = 10*level + 1*crtValue
    if (weapon == "2H") {result.innerHTML += `<br><b>Buff Effect:</b>
    <li>Grants ${comboCount} <b>Lunar Slash ${stack}</b> upon cast; can stack up to a maximum of <b>9 stacks</b></li>
    <li>Hitting a target with an attack skill other than <b>Lunar Slash</b> will consume 1 stack to deal an <b>Additional Attack</b> on that target</li>
    <li>The <b>Additional Attack</b> has a <b>fixed Critical Rate</b> of ${cr}</li>
    <li><b>Buff Duration:</b> Until all stacks are consumed</li>`}
}

function addLunarSlashExtraInfo(weapon, result) {
    result.innerHTML += `<br><b>Extra info:</b>
    <li>This skill's <b>maximum cast range</b> is equal to the maximum auto attack range of the <b>main weapon</b></li>`
    if (weapon == "2H") {result.innerHTML += `<li>If the used attack skill hits multiple targets, multiple stacks will be consumed accordingly</li>
    <li>The <b>Additional Attack(s)</b> are <b>unaffected by Combo Tags</b></li>
    <li>Strangely, the <b>Additional Attack(s)</b> are always affected by <b>Zero Stance registlet</b>, whether <b>Lunar Slash</b> or the skill that triggers these hit(s) is used out of combo or not; possibly because the attack is treated as "skill that is used out of combo" by the game</li>`}
}

function calcLunarSlashValues() {
    let weaponSelector = document.getElementById("lunarSlashWeapon")
    let weapon = weaponSelector[weaponSelector.selectedIndex].value
    let levelSelector = document.getElementById("lunarSlashSkillLevel")
    let level = levelSelector[levelSelector.selectedIndex].value
    let strValue = document.getElementById("lunarSlashStrValue").value
    let intValue = document.getElementById("lunarSlashIntValue").value
    let crtValue = document.getElementById("lunarSlashCrtValue").value
    let comboSection = document.getElementById("lunarSlashComboInput")
    let comboCount = document.getElementById("lunarSlashComboCount").value
    let result = document.getElementById("lunarSlashValues")
    weaponComboCheck(weapon, comboSection)
    calcLunarSlashConstant(weapon, intValue, result)
    calcLunarSlashMultiplier(level, weapon, strValue, comboCount, result)
    addLunarSlashHitCount(weapon, comboCount, result)
    calcLunarSlashFatigueChance(level, result)
    addLunarSlashSkillEffect(level, weapon, crtValue, comboCount, result)
    addLunarSlashExtraInfo(weapon, result)
}

calcLunarSlashValues()