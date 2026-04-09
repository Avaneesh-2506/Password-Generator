const inputSlider=document.querySelector("[data-passRange]");
const lengthScale=document.querySelector("[data-lenghtScale]");
const passDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
const indiacator=document.querySelector("[data-indicator]");
const generatePass=document.querySelector(".generatePass");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~!@#$%^&*()-_+=][}{";:/?.>,<';

let password="";
let passLength=10;
let checkCount=1;
handleSlider();
//set inital indicator color gray
setIndicator("#ccc");


//functions

//set password length
function handleSlider(){
    inputSlider.value=passLength;
    lengthScale.innerText=passLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passLength-min)*100/(max-min))+"% 100%";

}

function setIndicator(color){
    indiacator.style.backgroundColor=color;
    indiacator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNum(){
    return getRandomInteger(0,9);
}

function generateLoweCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    const randomNum=getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNum);
}

function calcStrength(){
    let hasUpr=false;
    let hasLwr=false;
    let hasNum=false;
    let hasSybl=false;

    if(uppercaseCheck.checked) hasUpr=true;
    if(lowercaseCheck.checked) hasLwr=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSybl=true;

    if(hasUpr && hasLwr && (hasNum || hasSybl) && passLength >=8){
        setIndicator("#0f0");
    } else if((hasLwr || hasUpr) && (hasNum || hasSybl) && passLength >=6){
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passDisplay.value);
        copyMsg.innerText="Coppied!";

    }
    catch(e){
        copyMsg.innerText="Failed!";
    }

    //to make span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 1000);
}


inputSlider.addEventListener('input',(e)=>{
    passLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',() =>{
    if(passDisplay.value)
        copyContent();
})


function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach( (checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passLength<checkCount){
        passLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

function shufflePassword(Array){
    //Fisher Yates Methods
    for(let i=Array.length-1; i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=Array[i];
        Array[i]=Array[j];
        Array[j]=temp;
    }

    let str="";
    Array.forEach((el)=>(str += el));
    return str;

}

generatePass.addEventListener('click',()=>{
    if(checkCount ==0)
        return;

    if(passLength<checkCount){
        passLength=checkCount;
        handleSlider();
    }

    //Generate new password
    password="";

    // 1st method
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLoweCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNum();
    // }

    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }

    // 2nd method-----------------
    
    let funArr=[];

    if(uppercaseCheck.checked)
        funArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funArr.push(generateLoweCase);

    if(numbersCheck.checked)
        funArr.push(generateRandomNum);

    if(symbolCheck.checked)
        funArr.push(generateSymbol);


    for(let i=0; i<funArr.length; i++){
        password += funArr[i]();
    }

    for(let i=0; i<passLength-funArr.length;i++){
        let randIndex=getRandomInteger(0, funArr.length);
        password += funArr[randIndex]();
    }


    //suffle the password
    password=shufflePassword(Array.from(password));

    passDisplay.value=password;
    calcStrength();

})


