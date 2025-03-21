/*  =======================================
    Funções
    ======================================= */


const Get = {
    id(name){
        return document.getElementById(name);
    },
    query(name){
        return document.querySelector(name);
    },
    queryAll(name){
        return document.querySelectorAll(name);
    }
}

function ifTemplate(element, param){
    if (!element){
        console.error('Função "ifTemplate" encerrada: o valor "element" permanece "undefined". Por favor, insira um elemento válido.');
        return null;
    }

    if (!param){
        console.error('Objeto "disabledAttr" encerrado: o valor "param" se encontra "undefined". Por favor, insira "add" ou "rm" como valor.');
        return null;
    }

    if (typeof param !== "string"){
        console.error('Objeto "disabledAttr" encerrado: o valor "param" não é uma "string". Por favor, insira "add" ou "rm" como valor.');
        return null;
    } else {
        if (param !== "add"){
            if (param !== "rm"){
                console.error('Objeto "disabledAttr" finalizado: qualquer coisa diferente de "add" ou "rm" será considerado inválido.');
                return null;
            }
        }
    }

    if (param === "add"){
        if (element.getAttribute('disabled') === true){
            return;
        }

        element.setAttribute('disabled', 'true');
    } else {
        if (element.getAttribute('disabled') === null){
            return;
        }

        element.removeAttribute('disabled');
    }
}

const disabledAttr = {
    operator(param){
        typeOperator.forEach((operator) => {
            ifTemplate(operator, param);
        });

        return this;
    },
    point(param){
        ifTemplate(point, param);

        return this;
    }
};

function calc(){
    if (numberDisplay === true && operatorDisplay === false){

        // Cálculo e tratamento
        const value = display.value.replace('÷', '/').replace('×', '*');
        try {
            const calc = math.evaluate(value);
            if (isNaN(calc)) {
                display.value = 'erro';
            } else {
                display.value = calc;
            }
        } catch (e) {
            display.value = 'erro';
        }

        if (/[a-z]/.test(display.value)){
            disabledAttr.operator('add');
        }

        // Verifica se o resultado já possui vírgula:
        // se sim, "point" não será interativo até que o próximo operador ser definido.
        if (/\./.test(display.value) === true){
            disabledAttr.point("add");
        }
    } else{
        return;
    }
}


/*  =======================================
    Selecionando Elementos
    ======================================= */


// Selecionando IDs
const display = Get.id('display');
const point = Get.id('point');
const equalButton = Get.id('equal');
const clear = Get.id('clear');

// Selecionando Class
const buttons = Get.queryAll('.button');
const typeNumber = Get.queryAll('.number');
const typeOperator = Get.queryAll('.operator');


/*  ==============================================================
    Variáveis usadas para verificação após clicar para calcular
    ============================================================== */


let numberDisplay = undefined;
let operatorDisplay = undefined;


/*  ===============================================
    Observando se o usuário removeu o "readonly"
    =============================================== */


// Se o atributo "readonly" for removido, ele será inserido logo em seguida
let observer = new MutationObserver(() => {
    if (!display.hasAttribute('readonly')){
        display.setAttribute('readonly', 'true');
    }
});
observer.observe(display, {
    attributes: true,
    subtree: true,
});


/*  =======================================
    Regex para o display
    ======================================= */


function regex(){
    const regex = {
        decimal:{
            one: /\d+\.\d+$/.test(display.value),
            two: /\d+\.$/.test(display.value),
            three: /\.\d+$/.test(display.value),
            four: /\.$/.test(display.value)
        },
        number: /\d+$/.test(display.value),
        operator: /[+-÷×]$/.test(display.value),
    }

    if (regex.decimal.one || regex.decimal.two || regex.decimal.three || regex.decimal.four){
        disabledAttr.operator('rm');
        disabledAttr.point('add');
        numberDisplay = true;
        operatorDisplay = false;
    } else if (regex.number){
        disabledAttr.operator('rm');
        numberDisplay = true;
        operatorDisplay = false;
    } else if (regex.operator){
        disabledAttr.operator('add').point('rm');
        numberDisplay = false;
        operatorDisplay = true;
    }
}


/*  =======================================
    Eventos
    ======================================= */


window.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace'){
        if (display.value === ''){
            return;
        } else{
            if (/[a-z]/.test(display.value)){
                display.value = '';
            } else{
                display.value = display.value.slice(0, -1);
                regex();
            }
        }
    } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/'].includes(event.key)){
        display.value += event.key.replace('/', '÷').replace('*', '×');

        if (/[+-÷×]$/.test(display.value)){
            display.value = display.value.replace(/([+\-÷×])+/g, '$1');
        }
        regex();
        display.scrollLeft = display.scrollWidth;
    } else if (event.key === '='){
        calc();
    }
});

// Escreve no display
buttons.forEach((e) => {
    e.addEventListener('click', function(){
        if (/[a-z]/.test(display.value)){
            display.value = '';
            display.value += this.textContent;
            regex();
        } else{
            display.value += this.textContent;
            regex();
        }

        display.scrollLeft = display.scrollWidth;
    });
});

// Reseta a calculadora
clear.addEventListener('click', function(){
    display.value = '';
    disabledAttr.operator("add").point("rm");
});

// Realiza o calculo
equal.addEventListener('click', function(){
    calc();
});