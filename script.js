var baguettes = 0;
var epicbaguettes = 0;
var researchbaguettes = 0;
var divinebaguettes = 0;
var baguettesGenerated = 0;

var prestiges = 0;
/*
    Research Baguettes are hard to obtain, but provide massive boosts to production
    For each research baguette you have, they provide a passive boost to your furnace, and bakery buildings

    Furnace: 1.05x

    Bakery: 1.1x
    Market: 1.05x
    Factory: 1.03x
    ...
*/

var bakeryUnlocked = false;
var researchUnlocked = false;
var altarUnlocked = false;

var bakeries = 0;
var bakeryCM = 1.1;
var bakeryCost = 100;
var bakeryProduction = 2;

var markets = 0;
var marketCM = 1.13;
var marketCost = 1000;
var marketProduction = 15;

var factories = 0;
var factoryCM = 1.15;
var factoryCost = 12000;
var factoryProduction = 130;

var alchemyLabs = 0;
var alchemyCM = 1.175;
var alchemyCost = 180000;
var alchemyProduction = 1000;

var planets = 0;
var planetCM = 1.21;
var planetCost = 3600000;
var planetProduction = 7900;

var tesseracts = 0;
var tesseractCM = 1.25;
var tesseractCost = 800000000;
var tesseractProduction = 60000;

var galaxies = 0;
var galaxyCM = 1.3;
var galaxyCost = 24000000000;
var galaxyProduction = 435000;

var labs = 0;
var labCM = 1.5;
var labCost = 10;

var labSpeedCost = 100000;
var labSpeed = 1000; //In Milliseconds
var labSpeedUpgrades = 0;
var labSpeedCM = 1.35;
var labSpeedMultiplier = 0.9875;

var clickAmount = 1;
var clickerCM = 1.2;

var researchPercent = 1; //Any number less than this will earn a research baguette from ranNum from 1-100
var researchCM = 100;

/*
PROGRESSION:

Bakery
Market
Factory
Alchemy
Planet
Tesseract

*/

function loadGame()
{
    load();

    updateBaguetteCounters();
    updateUnlockedFeatures();
}

function format(num) 
{
    if (num < 1000) {return num;}
    const suffixes = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion"];

    const suffixIndex = Math.floor(Math.log10(Math.abs(num)) / 3);
    const scaledNum = num / Math.pow(10, suffixIndex * 3);

    const formattedNum = scaledNum.toFixed(3).replace(/\.0$/, ''); // Remove trailing zeroes
    const suffix = suffixes[suffixIndex];

    return `${formattedNum} ${suffix}`;
}

function prestige()
{
    //Calculate divine baguettes
    var dB = Math.floor(Math.pow(baguettesGenerated/1000000000, 0.5));

    if (dB <= divinebaguettes)
    {
        //Can't prestige if you get no divine baguettes
        return;
    }

    dB -= divinebaguettes;
    divinebaguettes += dB;
    prestiges += 1;

    reset();
    save();
    goFurnace();
}


function furnaceClick()
{
    baguettes += Math.floor(clickAmount*(1+.15*researchbaguettes));
    baguettesGenerated += Math.floor(clickAmount*(1+.15*researchbaguettes));

    updateBaguetteCounters();

    //Play Animation
    playAnimation(document.getElementById("furnace-button"), "furnaceClick");
}

function buyFurnaceUpgrade()
{
    var cost = Math.floor(25*Math.pow(clickerCM, clickAmount));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        clickAmount += 1;
        playAnimation(document.getElementById("buy-clicker-button"), "furnaceUpgradeClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-clicker-title"), "cantPurchase");
    }
}

function buyResearchUpgrade()
{
    var cost = Math.floor(100*Math.pow(researchCM, researchPercent));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        researchPercent += 1;
        playAnimation(document.getElementById("buy-research-button"), "furnaceUpgradeClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-research-title"), "cantPurchase");
    }
}

function updateBaguetteCounters()
{
    //stockmarket
    if (document.getElementById("stock-count") != null) {document.getElementById("stock-count").textContent = stocks;}
    if (document.getElementById("stock-price") !=null) {document.getElementById("stock-price").textContent = stockPrice;}
    if (document.getElementById("stockmarket-locked-text") != null) {document.getElementById("stockmarket-locked-text").textContent = "Stock Market (Unlocked at 1,000,000 Baguettes)";}
    if (document.getElementById("stock-count2") != null) {document.getElementById("stock-count2").textContent = stocks2;}
    if (document.getElementById("stock-price2") !=null) {document.getElementById("stock-price2").textContent = stockPrice2;}
    if (document.getElementById("stock-count3") != null) {document.getElementById("stock-count3").textContent = stocks3;}
    if (document.getElementById("stock-price3") !=null) {document.getElementById("stock-price3").textContent = stockPrice3;}

    //Update Baguette Counters
    document.getElementById("baguette-count").textContent = format(baguettes);
    document.getElementById("epicbaguette-count").textContent = epicbaguettes;
    document.getElementById("researchbaguette-count").textContent = format(researchbaguettes);

    document.getElementById("BPS-count").textContent = format(calculateBPS());
    document.getElementById("RBoost-count").textContent = calculateResearchBoost();

    //Update Automated Counters
    if (document.getElementById("bakery-count") != null) {document.getElementById("bakery-count").textContent = bakeries;}
    if (document.getElementById("bakery-production") != null) {document.getElementById("bakery-production").textContent = format(Math.floor(bakeryProduction*bakeries*(1+0.1*Math.pow(researchbaguettes, epicbaguettes+1))));}

    if (document.getElementById("market-count") != null) {document.getElementById("market-count").textContent = markets;}
    if (document.getElementById("market-production") != null) {document.getElementById("market-production").textContent = format(Math.floor(marketProduction*markets*(1+0.05*Math.pow(researchbaguettes, epicbaguettes+1))));}

    if (document.getElementById("factory-count") != null) {document.getElementById("factory-count").textContent = factories;}
    if (document.getElementById("factory-production") != null) {document.getElementById("factory-production").textContent = format(Math.floor(factoryProduction*factories*(1+0.03*Math.pow(researchbaguettes, epicbaguettes+1))));}

    if (document.getElementById("alchemy-count") != null) {document.getElementById("alchemy-count").textContent = alchemyLabs;}
    if (document.getElementById("alchemy-production") != null) {document.getElementById("alchemy-production").textContent = format(Math.floor(alchemyProduction*alchemyLabs*(1+0.02*Math.pow(researchbaguettes, epicbaguettes+1))));}

    if (document.getElementById("planet-count") != null) {document.getElementById("planet-count").textContent = planets;}
    if (document.getElementById("planet-production") != null) {document.getElementById("planet-production").textContent = format(Math.floor(planetProduction*planets*(1+0.015*Math.pow(researchbaguettes, epicbaguettes+1))));}

    if (document.getElementById("tesseract-count") != null) {document.getElementById("tesseract-count").textContent = tesseracts;}
    if (document.getElementById("tesseract-production") != null) {document.getElementById("tesseract-production").textContent = format(Math.floor(tesseractProduction*tesseracts*(1+0.013*Math.pow(researchbaguettes, epicbaguettes+1))));}

    if (document.getElementById("galaxy-count") != null) {document.getElementById("galaxy-count").textContent = galaxies;}
    if (document.getElementById("galaxy-production") != null) {document.getElementById("galaxy-production").textContent = format(Math.floor(galaxyProduction*galaxies*(1+0.011*Math.pow(researchbaguettes, epicbaguettes+1))));}


    if (document.getElementById("lab-count") != null) {document.getElementById("lab-count").textContent = labs;}
    if (document.getElementById("labSpeed-count") != null) {document.getElementById("labSpeed-count").textContent = labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades);}

    //Update Automated Costs
    if (document.getElementById("bakery-cost") != null) {document.getElementById("bakery-cost").textContent = format(Math.floor(bakeryCost*Math.pow(bakeryCM, bakeries)));}
    if (document.getElementById("market-cost") != null) {document.getElementById("market-cost").textContent = format(Math.floor(marketCost*Math.pow(marketCM, markets)));}
    if (document.getElementById("factory-cost") != null) {document.getElementById("factory-cost").textContent = format(Math.floor(factoryCost*Math.pow(factoryCM, factories)));}
    if (document.getElementById("alchemy-cost") != null) {document.getElementById("alchemy-cost").textContent = format(Math.floor(alchemyCost*Math.pow(alchemyCM, alchemyLabs)));}
    if (document.getElementById("planet-cost") != null) {document.getElementById("planet-cost").textContent = format(Math.floor(planetCost*Math.pow(planetCM, planets)));}
    if (document.getElementById("tesseract-cost") != null) {document.getElementById("tesseract-cost").textContent = format(Math.floor(tesseractCost*Math.pow(tesseractCM, tesseracts)));}
    if (document.getElementById("galaxy-cost") != null) {document.getElementById("galaxy-cost").textContent = format(Math.floor(galaxyCost*Math.pow(galaxyCM, galaxies)));}

    if (document.getElementById("lab-cost") != null) {document.getElementById("lab-cost").textContent = format(Math.floor(labCost*Math.pow(labCM, labs)));}
    if (document.getElementById("labSpeed-cost") != null) {document.getElementById("labSpeed-cost").textContent = format(Math.floor(labSpeedCost*Math.pow(labSpeedCM, labSpeedUpgrades)));}

    //Update Furnace Information
    if (document.getElementById("furnace-cost") != null) {document.getElementById("furnace-cost").textContent = format(Math.floor(25*Math.pow(clickerCM, clickAmount)));}

    //Update Research Information
    if (document.getElementById("research-upgrade-cost") != null) {document.getElementById("research-upgrade-cost").textContent = format(Math.floor(100*Math.pow(researchCM, researchPercent)));}
    if (document.getElementById("research-cost") != null) {document.getElementById("research-cost").textContent = format(Math.floor(Math.pow(10, researchPercent)));}
    if (document.getElementById("research-percent") != null) {document.getElementById("research-percent").textContent = researchPercent + "%";}
}

function goFurnace()
{
    save();
    window.location.href = 'index.html';
}


function goBakery()
{
    if (bakeryUnlocked)
    {
        save();
        window.location.href = 'bakeries.html';
        return;
    }

    //If bakery isnt unlocked, allow purchase

    if (baguettes >= 100)
    {
        baguettes -= 100;
        bakeryUnlocked = true;

        updateBaguetteCounters();
        updateUnlockedFeatures();

        save();
    }else {
        playAnimation(document.getElementById("bakery-locked-text"), "cantPurchase");
    }
}

function goStockMarket()
{
    if (stockmarketUnlocked)
    {
        save();
        window.location.href = 'stockmarket.html';
        return;
    }

    //If stockmarket isnt unlocked, allow purchase

    if (baguettes >= 100)
    {
        baguettes -= 100;
        stockmarketUnlocked = true;

        updateBaguetteCounters();
        updateUnlockedFeatures();

        save();
    }else {
        playAnimation(document.getElementById("market-locked-text"), "cantPurchase");
    }
}

function goResearch()
{
    if (researchUnlocked)
    {
        save();
        window.location.href = 'research.html';
        return;
    }

    //If bakery isnt unlocked, allow purchase

    if (baguettes >= 10000)
    {
        baguettes -= 10000;
        researchUnlocked = true;

        updateBaguetteCounters();
        updateUnlockedFeatures();

        save();
    }else {
        playAnimation(document.getElementById("research-locked-text"), "cantPurchase");
    }
}

function goAltar()
{
    if (altarUnlocked)
    {
        save();
        window.location.href = 'altar.html';
        return;
    }

    //If bakery isnt unlocked, allow purchase

    if (baguettes >= 1000000)
    {
        baguettes -= 1000000;
        altarUnlocked = true;

        updateBaguetteCounters();
        updateUnlockedFeatures();

        save();
    }else {
        playAnimation(document.getElementById("altar-locked-text"), "cantPurchase");
    }
}

function researchClick()
{
    let randomNumber = Math.floor(Math.random() * 100) + 1;
    if (baguettes < Math.pow(10, researchPercent)) {return;} //Can't afford
    
    baguettes -= Math.floor(Math.pow(10, researchPercent));
    if (randomNumber <= researchPercent) //Roll success
    {
        researchbaguettes += 1;
        playAnimation(document.getElementById("research-button"), "furnaceClick");
    }
    updateBaguetteCounters();
}

function playAnimation(element, animation)
{
    if (element == null) {return;}
    if (element.classList.contains(animation)) {element.classList.remove(animation);}
    void element.offsetWidth; //Resets something idk
    element.classList.add(animation);
}

function updateUnlockedFeatures()
{
    if (bakeryUnlocked && document.getElementById("bakery-locked-text") != null)
    {
        document.getElementById("bakery-locked-text").textContent = "Go to Bakery";
        document.getElementById("bakery-locked-text").style.color = "#00ff00";
    }

    if (researchUnlocked && document.getElementById("research-locked-text") != null)
    {
        document.getElementById("research-locked-text").textContent = "Go to Research";
        document.getElementById("research-locked-text").style.color = "#00ff00";
    }

    if (altarUnlocked && document.getElementById("altar-locked-text") != null)
    {
        document.getElementById("altar-locked-text").textContent = "Go to Epic Altar";
        document.getElementById("altar-locked-text").style.color = "#00ff00";
    }
    if (stockmarketUnlocked && document.getElementById("stockmarket-locked-text") != null)
    {
        document.getElementById("stockmarket-locked-text").textContent = "Go to Stock Market";
        document.getElementById("stockmarket-locked-text").style.color = "#00ff00";
    }
}

function buyBakery() 
{
    var cost = Math.floor(bakeryCost*Math.pow(bakeryCM, bakeries));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        bakeries += 1;
        playAnimation(document.getElementById("buy-bakery-button"), "furnaceClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-bakery-title"), "cantPurchase");
    }
}

function buyMarket()
{
    var cost = Math.floor(marketCost*Math.pow(marketCM, markets));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        markets += 1;
        playAnimation(document.getElementById("buy-market-button"), "marketClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-market-title"), "cantPurchase");
    }
}

function buyFactory()
{
    var cost = Math.floor(factoryCost*Math.pow(factoryCM, factories));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        factories += 1;
        playAnimation(document.getElementById("buy-factory-button"), "marketClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-factory-title"), "cantPurchase");
    }
}

function buyAlchemy()
{
    var cost = Math.floor(alchemyCost*Math.pow(alchemyCM, alchemyLabs));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        alchemyLabs += 1;
        playAnimation(document.getElementById("buy-alchemy-button"), "labClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-alchemy-title"), "cantPurchase");
    }
}

function buyPlanet()
{
    var cost = Math.floor(planetCost*Math.pow(planetCM, planets));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        planets += 1;
        playAnimation(document.getElementById("buy-planet-button"), "labClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-planet-title"), "cantPurchase");
    }
}

function buyTesseract()
{
    var cost = Math.floor(tesseractCost*Math.pow(tesseractCM, tesseracts));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        tesseracts += 1;
        playAnimation(document.getElementById("buy-tesseract-button"), "labClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-tesseract-title"), "cantPurchase");
    }
}

function buyGalaxy()
{
    var cost = Math.floor(galaxyCost*Math.pow(galaxyCM, galaxies));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        galaxies += 1;
        playAnimation(document.getElementById("buy-galaxy-button"), "marketClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-galaxy-title"), "cantPurchase");
    }
}

function buyLab()
{
    var cost = Math.floor(labCost*Math.pow(labCM, labs));
    if (researchbaguettes >= cost)
    {
        researchbaguettes -= cost;
        labs += 1;
        playAnimation(document.getElementById("buy-lab-button"), "labClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-lab-title"), "cantPurchase");
    }
}

function buyLabSpeedUpgrade()
{
    var cost = Math.floor(labSpeedCost*Math.pow(labSpeedCM, labSpeedUpgrades));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        labSpeedUpgrades += 1;
        playAnimation(document.getElementById("buy-labSpeed-button"), "labClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-labSpeed-title"), "cantPurchase");
    }
}

function altarSacrifice()
{
    if (baguettes < 2000000)
    {
        //Needs to sacrifice at least 2 Million baguettes (To sacrifice 1 million)
        return;
    }

    //Sacrifice half of baguettes
    var bagSac = baguettes/2;

    baguettes -= Math.floor(bagSac);

    var sacResult = Math.floor(Math.log10(bagSac)-5)*.00001;

    epicbaguettes += sacResult;
    epicbaguettes = Math.round(epicbaguettes*100000)/100000;

    updateBaguetteCounters();

    playAnimation(document.getElementById("altar-button"), "furnaceClick");
}

function save()
{
    //Dictionary of variables
    var save = {
        baguettes: baguettes,
        epicbaguettes: epicbaguettes,
        bakeryUnlocked: bakeryUnlocked,
        bakeries: bakeries,
        markets: markets,
        clickAmount: clickAmount,
        researchbaguettes: researchbaguettes,
        researchPercent: researchPercent,
        researchUnlocked: researchUnlocked,
        factories: factories,
        labs: labs,
        alchemyLabs: alchemyLabs,
        labSpeedUpgrades: labSpeedUpgrades,
        planets: planets,
        tesseracts: tesseracts,
        altarUnlocked: altarUnlocked,
        galaxies: galaxies,
        prestiges: prestiges,
        divinebaguettes: divinebaguettes,
        baguettesGenerated: baguettesGenerated,
        stockmarketUnlocked: stockmarketUnlocked,
        stocks: stocks,
        stockPrice: stockPrice,
        id : id,
        stocks2: stocks2,
        stockPrice2: stockPrice2,
        id2 : id2,
        stocks3: stocks3,
        stockPrice3: stockPrice3,
        id3 : id3
    }

    localStorage.setItem("save", JSON.stringify(save));
    console.log("Game Saved!");

    clearInterval(researchInterval);

    researchInterval = setInterval(function generateResearch() {
        for (let i = 0; i<labs; i++) //Auto Lab research
        {
            researchClick();
        }
        
        updateBaguetteCounters();
    }, labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades));
}

function load()
{
    var savedata = JSON.parse(localStorage.getItem("save"));

    if (typeof savedata.baguettes !== "undefined") {baguettes = savedata.baguettes;}else {baguettes = 0;}
    if (typeof savedata.epicbaguettes !== "undefined") {epicbaguettes = savedata.epicbaguettes;}else {epicbaguettes = 0;}
    if (typeof savedata.bakeryUnlocked !== "undefined") {bakeryUnlocked = savedata.bakeryUnlocked;}else {bakeryUnlocked = false;}
    if (typeof savedata.bakeries !== "undefined") {bakeries = savedata.bakeries;}else {bakeries = 0;}
    if (typeof savedata.markets !== "undefined") {markets = savedata.markets;}else {markets = 0;}
    if (typeof savedata.clickAmount !== "undefined") {clickAmount = savedata.clickAmount;}else {clickAmount = 1;}
    if (typeof savedata.researchbaguettes !== "undefined") {researchbaguettes = savedata.researchbaguettes;}else {researchbaguettes = 0;}
    if (typeof savedata.researchPercent !== "undefined") {researchPercent = savedata.researchPercent;}else {researchPercent = 1;}
    if (typeof savedata.researchUnlocked !== "undefined") {researchUnlocked = savedata.researchUnlocked;}else {researchUnlocked = false;}
    if (typeof savedata.factories !== "undefined") {factories = savedata.factories;}else {factories = 0;}
    if (typeof savedata.labs !== "undefined") {labs = savedata.labs;}else {labs = 0;}
    if (typeof savedata.alchemyLabs !== "undefined") {alchemyLabs = savedata.alchemyLabs;}else {alchemyLabs = 0;}
    if (typeof savedata.labSpeedUpgrades !== "undefined") {labSpeedUpgrades = savedata.labSpeedUpgrades;}else {labSpeedUpgrades = 0;}
    if (typeof savedata.planets !== "undefined") {planets = savedata.planets;}else {planets = 0;}
    if (typeof savedata.tesseracts !== "undefined") {tesseracts = savedata.tesseracts;}else {tesseracts = 0;}
    if (typeof savedata.altarUnlocked !== "undefined") {altarUnlocked = savedata.altarUnlocked;}else {altarUnlocked = false;}
    if (typeof savedata.galaxies !== "undefined") {galaxies = savedata.galaxies;}else {galaxies = 0;}
    if (typeof savedata.prestiges !== "undefined") {prestiges = savedata.prestiges;}else {prestiges = 0;}
    if (typeof savedata.divinebaguettes !== "undefined") {divinebaguettes = savedata.divinebaguettes;}else {divinebaguettes = 0;}
    if (typeof savedata.baguettesGenerated !== "undefined") {baguettesGenerated = savedata.baguettesGenerated;}else {baguettesGenerated = 0;}
    if (typeof savedata.stockmarketUnlocked !== "undefined") {stockmarketUnlocked = savedata.stockmarketUnlocked;}else {stockmarketUnlocked = false;}
    if (typeof savedata.stocks !== "undefined") {stocks = savedata.stocks;}else {stocks = 0;}
    if (typeof savedata.stockPrice !== "undefined") {stockPrice = savedata.stockPrice;}else {stockPrice = 70000;}
    if (typeof savedata.id !== "undefined") {id = savedata.id;}else {id = 7000;}
    if (typeof savedata.stocks2 !== "undefined") {stocks2 = savedata.stocks2;}else {stocks2 = 0;}
    if (typeof savedata.stockPrice2 !== "undefined") {stockPrice2 = savedata.stockPrice2;}else {stockPrice2 = 250000;}
    if (typeof savedata.id2 !== "undefined") {id2 = savedata.id2;}else {id2 = 25000;}
    if (typeof savedata.stocks3 !== "undefined") {stocks3 = savedata.stocks3;}else {stocks3 = 0;}
    if (typeof savedata.stockPrice3 !== "undefined") {stockPrice3 = savedata.stockPrice3;}else {stockPrice3 = 99999;}
    if (typeof savedata.id3 !== "undefined") {id3 = savedata.id3;}else {id3 = 999999;}
}

function reset()
{
    baguettes = 0;
    epicbaguettes = 0;
    bakeryUnlocked = false;
    bakeries = 0;
    markets = 0;
    clickAmount = 1;
    researchbaguettes = 0;
    researchPercent = 1;
    researchUnlocked = false;
    factories = 0;
    labs = 0;
    alchemyLabs = 0;
    labSpeedUpgrades = 0;
    planets = 0;
    tesseracts = 0;
    altarUnlocked = false;
    galaxies = 0;
    baguettesGenerated = 0;
    stockmarketUnlocked = false;
    stocks = 0;
    stockPrice = 7000;
    id = 70000;
    stocks2 = 0;
    stockPrice2 = 250000;
    id2 = 25000;
    stocks3 = 0;
    stockPrice3 = 999999;
    id3 = 99999;

    updateBaguetteCounters();
    updateUnlockedFeatures();
}

function calculateBPS()
{
    var sum = 0;
    sum += Math.floor(bakeryProduction*bakeries*(1+0.1*Math.pow(researchbaguettes, epicbaguettes+1)));
    sum += Math.floor(marketProduction*markets*(1+0.05*Math.pow(researchbaguettes, epicbaguettes+1)));
    sum += Math.floor(factoryProduction*factories*(1+0.03*Math.pow(researchbaguettes, epicbaguettes+1)));
    sum += Math.floor(alchemyProduction*alchemyLabs*(1+0.02*Math.pow(researchbaguettes, epicbaguettes+1)));
    sum += Math.floor(planetProduction*planets*(1+0.015*Math.pow(researchbaguettes, epicbaguettes+1)));
    sum += Math.floor(tesseractProduction*tesseracts*(1+0.013*Math.pow(researchbaguettes, epicbaguettes+1)));
    sum += Math.floor(galaxyProduction*galaxies*(1+0.011*Math.pow(researchbaguettes, epicbaguettes+1)));

    //Divine Baguette Boost
    sum *= 1+.05*divinebaguettes; //Each gives +5% boost to BPS
    return sum;
}

function calculateBPSVariable(research, epic, divine)
{
    var sum = 0;
    sum += Math.floor(bakeryProduction*bakeries*(1+0.1*Math.pow(research, epic+1)));
    sum += Math.floor(marketProduction*markets*(1+0.05*Math.pow(research, epic+1)));
    sum += Math.floor(factoryProduction*factories*(1+0.03*Math.pow(research, epic+1)));
    sum += Math.floor(alchemyProduction*alchemyLabs*(1+0.02*Math.pow(research, epic+1)));
    sum += Math.floor(planetProduction*planets*(1+0.015*Math.pow(research, epic+1)));
    sum += Math.floor(tesseractProduction*tesseracts*(1+0.013*Math.pow(research, epic+1)));
    sum += Math.floor(galaxyProduction*galaxies*(1+0.011*Math.pow(research, epic+1)));

    //Divine Baguette Boost
    sum *= 1+.05*divine; //Each gives +5% boost to BPS
    return sum;
}

function calculateResearchBoost()
{
    var ratio = calculateBPSVariable(researchbaguettes, epicbaguettes, divinebaguettes)/calculateBPSVariable(0, epicbaguettes, divinebaguettes);
    ratio = Math.floor(ratio*100)/100;

    return ratio;
}

//silly stockmarket  ***silly stockmarket*** code duclplicated from stockmarket.js sorry noah :( 
var stocks = 0;
var stockPrice = calculateRestingValue(7000); // Assuming id is 0
var id = 7000;
function updateStockPrice() {
    stockPrice = updateValue(stockPrice, calculateRestingValue(7000));
    updateBaguetteCounters();
}
setInterval(updateStockPrice, 12000);

function calculateRestingValue(id) {
    return 10 * (id + 1) - 1;
}

function updateValue(value, restingValue) {
    value += (restingValue - value) * 0.01;
    value += value * ((Math.random() - 0.5) * 0.3); // Change is now 15% of the current value
    return Math.round(value);
}

function buyStocks(amount){
    const cost = amount * stockPrice;
    if (baguettes >= cost) {
        baguettes -= cost;
        stocks += amount;
    } else {
        playAnimation(document.getElementById("buy-stock-title"), "cantPurchase");
    }   
}

function sellStocks(amount){
    //updateStockPrice();
    const sellPrice = stockPrice;
    if (stocks >= amount) {
        baguettes += Math.round(amount * sellPrice);
        stocks -= amount;
    } else {
        playAnimation(document.getElementById("sell-stock-title"), "cantPurchase");
    }
}

function updateStocks(){
    if (document.getElementById("stock-count") != null) {document.getElementById("stock-count").textContent = stocks;}
    if (document.getElementById("stock-price") !=null) {document.getElementById("stock-price").textContent = stockPrice;}
} 
setInterval(updateStocks, 100);
// stock market 2 electric boogaloo <- noah it wanted me to add this comment and i couldnt resist
var stocks2 = 0;
var stockPrice2 = calculateRestingValue(25000); // Assuming id is 25000
var id2 = 25000;

function updateStockPrice2() {
    stockPrice2 = updateValue(stockPrice2, calculateRestingValue(25000));
    updateBaguetteCounters();
}
setInterval(updateStockPrice2, 12000);

function buyStocks2(amount){
    //updateStockPrice();   When I run this, it updates updatebaguettecounters() twice, which is not good
    const cost = amount * stockPrice2;
    if (baguettes >= cost) {
        baguettes -= cost;
        stocks2 += amount;
    } else {
        playAnimation(document.getElementById("buy-stock-title2"), "cantPurchase");
    }   
}

function sellStocks2(amount){
    //updateStockPrice();
    const sellPrice = stockPrice2; 
    if (stocks2 >= amount) {
        baguettes += Math.round(amount * sellPrice);
        stocks2 -= amount;
    } else {
        playAnimation(document.getElementById("sell-stock-title2"), "cantPurchase");
    }
}

function updateStocks2(){
    if (document.getElementById("stock-count2") != null) {document.getElementById("stock-count2").textContent = stocks2;}
    if (document.getElementById("stock-price2") !=null) {document.getElementById("stock-price2").textContent = stockPrice2;}
}

setInterval(updateStocks2, 100);

// stock market 3 electric boogaloo <- now Im just keeping with the theme
var stocks3 = 0;
var stockPrice3 = calculateRestingValue(99999); // Assuming id is 99999
var id3 = 99999;

function updateStockPrice3() {
    stockPrice3 = updateValue(stockPrice3, calculateRestingValue(99999));
    updateBaguetteCounters();
}
setInterval(updateStockPrice3, 12000);

function buyStocks3(amount){
    //updateStockPrice();   When I run this, it updates updatebaguettecounters() twice, which is not good
    const cost = amount * stockPrice3;
    if (baguettes >= cost) {
        baguettes -= cost;
        stocks3 += amount;
    } else {
        playAnimation(document.getElementById("buy-stock-title3"), "cantPurchase");
    }   
}

function sellStocks3(amount){
    //updateStockPrice();
    const sellPrice = stockPrice3; 
    if (stocks3 >= amount) {
        baguettes += Math.round(amount * sellPrice);
        stocks3 -= amount;
    } else {
        playAnimation(document.getElementById("sell-stock-title3"), "cantPurchase");
    }
}

function updateStocks3(){
    if (document.getElementById("stock-count3") != null) {document.getElementById("stock-count3").textContent = stocks3;}
    if (document.getElementById("stock-price3") !=null) {document.getElementById("stock-price3").textContent = stockPrice3;}
}

setInterval(updateStocks3, 100);

// end of stock markets 1, 2, and 3


var textElement = document.getElementById('random-text');

function updatePosition() {
    if (textElement) {
        var x = Math.random() * window.innerWidth;
        var y = Math.random() * window.innerHeight;

        textElement.style.left = x + 'px';
        textElement.style.top = y + 'px';
    }
}

setInterval(updatePosition, 3000);
//end silly stockmarket ***end silly stockmarket***

//Auto Generation
setInterval(function generateBaguettes() {
    baguettes += calculateBPS();
    baguettesGenerated += calculateBPS();

    updateBaguetteCounters();
}, 1000);

//Research Generation
researchInterval = setInterval(function generateResearch() {
    for (let i = 0; i<labs; i++) //Auto Lab research
    {
        researchClick();
    }

    updateBaguetteCounters();
}, labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades));


//Auto save
setInterval(function autoSave() {
    save();
}, 10000);

