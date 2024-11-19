// JavaScript Functionality:
// o When add button clicked:
//   ▪ Search Pokemon by name using PokeAPI
//   ▪ Add Pokemon to team if found
//   ▪ Prevent adding more than 6 Pokemon
// o Each Pokemon display should show:
//   ▪ Pokemon sprite image
//   ▪ Pokemon name
//   ▪ Pokemon type(s)
// o Remove functionality:
//   ▪ Ability (button) to remove individual Pokemon
// o Empty slots:
//   ▪ Show empty slot placeholders when team is not full
// o Error handling:
//   ▪ Show message if Pokemon not found
//   ▪ Show message if team is full
// Use the PokeAPI: https://pokeapi.co/api/v2/pokemon/POKEMON_NAME

let slotsUsed = 0;
let errorMessage = document.getElementById('errorMessage');
async function fetchData(POKEMON_NAME) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${POKEMON_NAME}`);
        const data = await response.json();
        returnList = [];
        typeList = [];

        // test to get API values
        // console.log('sprites ', data.sprites['front_default']);
        // console.log('name: ', data.name);
        // console.log('type: ', data.types); // may have more than 1, loop?

        if ((data.types).length > 1) {
            (data.types).forEach(type => {
                // console.log(type.type['name']);
                typeList.push({type: type.type['name']});
            });
        } else {
            // console.log('else: ', data.types[0].type['name'])
            typeList.push({type: data.types[0].type['name']})
        };

        returnList.push({sprite: data.sprites['front_default']});
        returnList.push({name: data.name});
        returnList.push(typeList);

        // console.log('typeList: ', typeList);
        // console.log('returnList: ', returnList);
        return returnList;

    } catch (error) { // no pokemon found
        console.error("Error:", error);
        if (error.name == 'SyntaxError') {
            console.log('syntax error found');
            errorMessage.innerHTML = "Error: Pokémon not found, please try again.";
            return null;
        }
    }
}

let individualRemoveButton;
function showPokemon(forSlot, fromThisArray) {
    // set name
    let cardName = document.getElementById(`slot-${forSlot}-name`);
    cardName.innerHTML = fromThisArray[1].name;

    // set sprite
    let cardImg = document.getElementById(`slot-${forSlot}-img`);
    cardImg.style.display = "inline";
    cardImg.src = fromThisArray[0].sprite;
    cardImg.alt = `Sprite image of ${fromThisArray[1].name}`;

    // set type
    let cardType = document.getElementById(`slot-${forSlot}-type`);
    let typeList = fromThisArray[2]
    cardType.innerHTML = '<strong>Type: </strong>'
    let i = 0;
    if (typeList.length > 1) { // more than 1 type
        typeList.forEach(type => {
            cardType.innerHTML += type.type;
            if (i != typeList.length -1){
                cardType.innerHTML += ", "
            }
            i++;
        });
    } else {
        cardType.innerHTML = '<strong>Type: </strong>' + fromThisArray[2][0].type;
    }

    // create a remove button for individual remove
    let divContainer = document.getElementById(`slot-${forSlot}`);
    individualRemoveButton = document.createElement('button');
    individualRemoveButton.innerHTML = 'Remove';
    individualRemoveButton.id = `individualRemoveButton-${forSlot}`;
    divContainer.appendChild(individualRemoveButton);

    individualRemoveButton.addEventListener('click', async () => {
        errorMessage.innerHTML = "";
        removePokemon(forSlot);
        slotsUsed--;
        console.log('IndividualRemoveButton clicked');
    });
    
}

// remove individual pokemon on slot #
function removePokemon(onSlot) {
    let cardName = document.getElementById(`slot-${onSlot}-name`);
    cardName.innerHTML = "";

    let cardImg = document.getElementById(`slot-${onSlot}-img`);
    cardImg.style.display = "none";
    cardImg.src = "";
    cardImg.alt = "";

    let cardType = document.getElementById(`slot-${onSlot}-type`);
    cardType.innerHTML = "";

    let individualRemoveButton = document.getElementById(`individualRemoveButton-${onSlot}`);
    individualRemoveButton.remove();
}

let addButton = document.getElementById('addButton');

addButton.addEventListener('click', async () => {
    let input = document.getElementById('input').value;

    // console.log('AddButton clicked');
    // console.log('Input: ', input);

    errorMessage.innerHTML = ""; // clear error message

    let pokemonInfo = await fetchData(input);
    if (pokemonInfo != null) { // found pokemon
        slotsUsed ++;
        if (slotsUsed > 6) {
            // error handling;
            slotsUsed --;
            errorMessage.innerHTML = "Add " + input + " failed. Team is full.";
        } else {
            // loop to fill in the next available slot
            for (i=1; i<7; i++) {
                let card = document.getElementById(`slot-${i}-name`);
                if (card.innerHTML == "") { // if card is empty
                    showPokemon(i, pokemonInfo); 
                    break;
                }
            }
        };
        // console.log('slots used after add: ', slotsUsed);
    } 
});

let clearTeamButton = document.getElementById('clearTeamButton');
clearTeamButton.addEventListener('click', async () => {
    errorMessage.innerHTML = ""; // clear error message
    for (let i=1; i<=(slotsUsed); i++) {  
        removePokemon(i);
    }
    slotsUsed = 0; // reset slotsUsed
    console.log('slots used after clear: ', slotsUsed);
});


